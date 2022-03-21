import requests
import conf
import json


def requestLead(data):
    urlPP = 'https://api.affstar.com/api/lead/create/publisher'
    response = requests.post(urlPP, 
                            headers={'Content-Type': 'application/json', 
                            'ApiKey': conf.apiKeyPP},data=json.dumps(data))
    response_native = json.loads(response.text)
    return response_native

