import scrapy
from scrapy.http import HtmlResponse
from scrapy.selector import Selector
import json
from models import db, Event, TicketsSource, PrecioTickets, EventType, GenereType

class ConciertosSpider(scrapy.Spider):
    name = 'conciertos'
    allowed_domains = ['elcorteingles.es']
    start_urls = ['https://www.elcorteingles.es/entradas/conciertos/todos/pop/']

    def __init__(self, *args, **kwargs):
        super(ConciertosSpider, self).__init__(*args, **kwargs)
        self.results = []

    def parse(self, response: HtmlResponse):
        selector = Selector(response)
        
        # Seleccionar todos los divs de tarjetas de producto dentro del div con la clase product-card__list
        product_cards = selector.css('div.container--main')

        # Extraer información de todas las tarjetas de producto
        titles = product_cards.css('h2.h3::text').getall()
        dates = product_cards.css('span.product-card__date::text').getall()
        places = product_cards.css('span.product-card__city::text').getall()
        prices_int = product_cards.css('span.integer-part::text').getall()
        prices_decimal = product_cards.css('span.decimal-part::text').getall()
        typesProduct = product_cards.css('span.product-card__typology::text').getall()
        image_urls = product_cards.css('img::attr(src)').getall()
        image_data_original_urls = product_cards.css('img::attr(data-original)').getall()
        buy_urls = product_cards.css('a.product-card::attr(href)').getall()

        def format_url(url):
            # Agregar "https:" si la URL comienza con "//"
            if url.startswith('//'):
                return f'https:{url}'
            return url
        
        def format_urlCompra(url):
            # Agregar "https://www.elcorteingles.es" si la URL comienza con "/"
            if url.startswith('/'):
                return f'https://www.elcorteingles.es{url}'
            return url

        for title, date, place, price_int, price_decimal, image_url, data_original_url, typeProduct, buy_url in zip(titles, dates, places, prices_int, prices_decimal, image_urls, image_data_original_urls, typesProduct, buy_urls):
            final_image_url = format_url(data_original_url if data_original_url else image_url)
            final_url_compra = format_urlCompra(buy_url)
            item = {
                'title': title.strip() if title else None,
                'date': date.strip() if date else None,
                'place': place.strip() if place else None,
                'price': f'{price_int.strip()}{price_decimal.strip()}' if price_int and price_decimal else None,
                'product_type': typeProduct.strip() if typeProduct else None,
                'image_url': final_image_url.strip() if final_image_url else None,
                'buy_url': final_url_compra.strip() if final_url_compra else None
            }

            self.results.append(item)
            yield item

        # Manejo de paginación
        next_page = selector.css('a.paginator__link[rel="next"]::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)

    def closed(self, reason):
        # Exportar a un archivo JSON con codificación UTF-8 y ensure_ascii=False
        with open('conciertos_data.json', 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=4, ensure_ascii=False)

        self.save_to_db()

    def save_to_db(self):
        for item in self.results:
            # Crear una instancia del modelo Event con la descripción formateada
            event = Event(
                name=item['title'],
                description=f"Concierto de {item['title']}",
                date=item['date'],
                location=item['place'],
                event_type=EventType.concierto, 
                genere=GenereType.pop,           
                image_url=item['image_url']
            )
            db.session.add(event)
            db.session.commit()

            # Crear una instancia del modelo TicketsSource
            ticket_source = TicketsSource(
                name='El Corte Ingles',
                web_url=item['buy_url']
            )
            db.session.add(ticket_source)
            db.session.commit()

            # Crear una instancia del modelo PrecioTickets
            precio_tickets = PrecioTickets(
                event_id=event.id,
                source_id=ticket_source.id,
                price=item['price']
            )
            db.session.add(precio_tickets)
            db.session.commit()