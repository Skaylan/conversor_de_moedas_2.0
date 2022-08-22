from dotenv import load_dotenv
from os import getenv
import requests


load_dotenv()
API_URL = getenv('API_URL')


def get_currency_info(currency_code_one: str, currency_code_two: str) -> float|dict:
    currency = requests.get(API_URL + f'{currency_code_one}-{currency_code_two}')
    currency = currency.json()
    if 'status' in currency.keys():
        return currency
    else:
        currency = currency[currency_code_one]['bid']
        return float(currency)


def make_currency_conversion(currency_code_one: str, currency_code_two: str, value_to_convert: float) -> float|dict:
    currency = get_currency_info(currency_code_one=currency_code_one, currency_code_two=currency_code_two)  
    if type(currency) == float or type(currency) == int:
        if currency_code_one == 'JPY' and currency_code_two in ['USD', 'CAD', 'EUR']:
            final_value = (value_to_convert * currency) * .010
        else:
            final_value = value_to_convert * currency
        return final_value

    elif 'status' in currency.keys():
        return currency