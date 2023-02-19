from app import app
from flask import jsonify, render_template, request
from app.controllers.utils.currency_functions import make_currency_conversion
from app.controllers.utils.functions import fetch_chart_api_data, handle_user_input
from flask_cors import CORS


CORS(app)
CURRENCY_CODE_SYMBOL = {'BRL': 'R$', 'USD': '$', 'EUR': '€', 'JPY': '¥', 'CNY': 'CN¥', 'CAD': 'C$'}

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route('/handle_conversion', methods=['POST'])
def handle_conversion():

    if request.method == 'POST':
        data = request.get_json()
        currency_code_one = data['currencyCodeOne']
        currency_code_two = data['currencyCodeTwo']
        input_value = data['inputValue']
        input_value = handle_user_input(input_value)

        if currency_code_two in CURRENCY_CODE_SYMBOL:
            symbol = CURRENCY_CODE_SYMBOL[currency_code_two]
        
        converted_currency_value = make_currency_conversion(
            currency_code_one=currency_code_one,
            currency_code_two=currency_code_two,
            value_to_convert=input_value)
        

        if type(converted_currency_value) == float or type(converted_currency_value) == int:
            return jsonify({"value": f'{converted_currency_value:.2f}', "symbolOne": symbol, "symbolTwo": CURRENCY_CODE_SYMBOL[currency_code_one]})

        elif 'status' in converted_currency_value.keys():
            return jsonify({"error": "conversão indisponível no momento!"})


@app.route('/get_chart_data')
def get_chart_data():
    data = fetch_chart_api_data()
    return jsonify({'data': data})