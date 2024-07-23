from itemadapter import ItemAdapter
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import db, Event, TicketsSource, PrecioTickets, Favoritos
import json

class ConciertosScraperPipeline:
    def process_item(self, item, spider):
        return item

class JSONWriterPipeline:
    def open_spider(self, spider):
        self.file = open('conciertos_data.json', 'w', encoding='utf-8')
        self.items = []

    def close_spider(self, spider):
        json.dump(self.items, self.file, indent=4, ensure_ascii=False)
        self.file.close()

    def process_item(self, item, spider):
        self.items.append(dict(item))   
        return item

class SQLAlchemyPipeline:
 
    def process_item(self, item, spider):
        if spider.name == 'conciertos':
            event = self.session.query(Event).filter_by(name=item['title']).first()
            if not event:
                event = Event()
                event.name = item['title']
                event.description = item['title']
                event.date = item['date']
                event.location = item['place']
                event.event_type = item['product_type']
                event.genere = item['product_type']
                self.session.add(event)
                self.session.commit()
            source = self.session.query(TicketsSource).filter_by(name='El Corte Inglés').first()
            if not source:
                source = TicketsSource()
                source.name = 'El Corte Inglés'
                source.web_url = 'https://www.elcorteingles.es/entradas/conciertos/todos/pop/'
                self.session.add(source)
                self.session.commit()
            precio_ticket = PrecioTickets(event_id=event.id, source_id=source.id, price=item.get('price'))
            self.session.add(precio_ticket)
            self.session.commit()

        return item

    def close_spider(self, spider):
        self.session.close()
        self.engine.dispose()
