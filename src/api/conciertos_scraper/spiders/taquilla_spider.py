import scrapy
from scrapy.http import HtmlResponse
from scrapy.selector import Selector
import json
import aiohttp
import asyncio

class TaquillaSpider(scrapy.Spider):
    name = 'taquilla'
    allowed_domains = ['taquilla.com']
    start_urls = ['https://www.taquilla.com/conciertos/pop-rock',
                  'https://www.taquilla.com/conciertos/hip-hop',
                  'https://www.taquilla.com/conciertos/hard-rock',
                  'https://www.taquilla.com/conciertos/autor',
                  'https://www.taquilla.com/conciertos/electronica']

    def __init__(self, *args, **kwargs):
        super(TaquillaSpider, self).__init__(*args, **kwargs)
        self.results = []

    def parse(self, response: HtmlResponse):
        selector = Selector(response)
        events = selector.css('div.d-mosaic__box')

        for event in events:
            title = event.css('h3.d-mosaic__title::text').get().strip()
            image = event.css('img.d-mosaic__img::attr(data-src)').get()
            link = event.css('a.d-mosaic__info-btn::attr(href)').get()
            date = event.css('div.d-mosaic__date span::text').getall()

            # Extraer los datos básicos del evento
            event_data = {
                'title': title,
                'image': image,
                'link': response.urljoin(link),
                'date_start': date[0] if date else None,
                'date_end': date[1] if len(date) > 1 else None,
            }

            # Seguir el enlace para obtener más detalles del evento
            yield response.follow(link, callback=self.parse_event_details, meta={'event_data': event_data})

        # Manejo de paginación
        next_page = selector.css('a.paginator__link[rel="next"]::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)

    def parse_event_details(self, response: HtmlResponse):
        event_data = response.meta['event_data']

        # Contenedor para múltiples precios y fechas
        additional_info = []

        # Extraer más detalles del evento
        date_elements = response.css('meta[itemprop="startDate"]::attr(content)').getall()
        locations = response.css('ul.ent-results-list div.l-subtitle-entity a::text').getall()
        price_elements = response.css('div.ent-results-list-hour-price span::text').getall()

        # Imprimir para depuración
        self.logger.info(f'Date elements: {date_elements}')
        self.logger.info(f'Price elements: {price_elements}')

        # Limpiar los precios y fechas
        cleaned_price_elements = [price.strip().replace('desde ', '') for price in price_elements]
        print(cleaned_price_elements)
        for date_elem, location, price_elem in zip(date_elements, locations, cleaned_price_elements):
            additional_info.append({
                'date': date_elem,
                'location': location,
                'price': price_elem
            })

        event_data['additional_info'] = additional_info

        # Transformar el formato de los eventos
        transformed_events = self.transform_format(event_data)

        # Almacenar los detalles en la lista de resultados
        self.results.extend(transformed_events)

        yield from transformed_events

    def closed(self, reason):
        # Exportar a un archivo JSON con codificación UTF-8 y ensure_ascii=False
        with open('taquilla.json', 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=4, ensure_ascii=False)
        
        loop = asyncio.get_event_loop()
        loop.create_task(self.add_events())

    # Iniciar la tarea asincrónica para agregar eventos a la base de datos
    async def add_events(self):
        url = 'http://localhost:3001/api/events'
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(url, json=self.results) as response:
                    if response.status == 201:
                        print('Events created successfully')
                    else:
                        response_text = await response.text()
                        print(f"Estado: {response.status}, Respuesta: {response_text}")
            except aiohttp.ClientError as e:
                print(f"Ocurrió un error: {e}")

    def transform_format(self, event):
        
        #Transforms the event details from the first format to the second format.

    
        transformed_events = []
        for info in event.get("additional_info", []):
            transformed_event = {
                "title": event["title"],
                "date": info["date"],
                "place": info["location"].split(",")[1].strip() if "," in info["location"] else info["location"],
                "price": info["price"],
                "product_type": "Pop",  # Assuming the product type is "Pop" for all events
                "image_url": event["image"],
                "buy_url": event["link"],
                "source": "taquilla.com"
            }
            transformed_events.append(transformed_event)
        
        return transformed_events
