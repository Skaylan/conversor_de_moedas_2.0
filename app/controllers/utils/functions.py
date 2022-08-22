import requests

NOT_ALLOWED_STRINGS = ['<script>', '</script>', 'src']


def handle_user_input(user_input: str) -> float:
    for item in NOT_ALLOWED_STRINGS:
        if item in user_input:
            user_input = user_input.replace(item, '')
    new_user_input = user_input.replace(',', '.')
    return float(new_user_input)


def get_data_from_api():
        response = requests.get(f'https://economia.awesomeapi.com.br/json/daily/usd/30')
        data = response.json()
        return data
