from flask import jsonify, url_for
import re 
from datetime import datetime

class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"

def validate_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search("[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search("[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search("[0-9]", password):
        return False, "Password must contain at least one number"
    return True, ""

def standard_date(fecha_str, formato_salida="%d/%m/%Y"):
    formatos = ["%d/%m/%Y", "%Y-%m-%d"]
    for formato in formatos:
        try:
            fecha_obj = datetime.strptime(fecha_str, formato)
            return fecha_obj.strftime(formato_salida)
        except ValueError:
            continue
    
    return fecha_str

def get_formatted_events(events):
    combined_events = {}

    def is_substring(str1, str2):
        str1 = str1.lower()
        str2 = str2.lower()
        return str1 in str2 or str2 in str1

    def find_matching_key(new_key, existing_keys):
        for key in existing_keys:
            if key[0] == new_key[0]:
                if is_substring(key[1], new_key[1]):
                    return key
        return None

    for event in events:
        key = (event.name, event.date)
        match_key = find_matching_key(key, combined_events.keys())
        if match_key:
            key = match_key

        if key not in combined_events:
            combined_events[key] = {
                'id': [event.id],
                'title': event.name,
                'date': event.date,
                'place': event.location,
                'genere': event.genere,
                'image_url': event.image_url,
                'prices': [event.precios[0].price],
                'buy_urls': [event.precios[0].source.web_url],
                'source': [event.precios[0].source.name]
            }
        else:
            combined_events[key]['id'].append(event.id)
            combined_events[key]['prices'].append(event.precios[0].price)
            combined_events[key]['buy_urls'].append(event.precios[0].source.web_url)
            combined_events[key]['source'].append(event.precios[0].source.name)

    return [
        {
            'id': ids[0],
            'title': details['title'],
            'date': details['date'],
            'place': details['place'],
            'genere': details['genere'],
            'image_url': details['image_url'],
            'price': details['prices'],
            'buy_url': details['buy_urls'],
            'source': details['source']
        }
        for ids, details in [(v['id'], v) for v in combined_events.values()]
    ]

