from os import getenv
import requests
from dotenv import load_dotenv


load_dotenv()

BLACKLIST = ["<script>", "<script src=", "<script type=", "javascript:", "onerror=", "onload=", "eval(", "document.cookie", "document.write", "document.body.innerHTML", "<body onload=", "<img src=x onerror=", "<iframe src=", "window.location", "window.open", "window.alert", "window.confirm", "window.prompt", "<form", "<input", "<button", "<textarea", "<select", "<option", "<style>", "<link rel=stylesheet", "<base href", "<meta", "<object", "<embed", "<applet", "<param", "<frame", "<frameset", "<noframes", "<noscript", "<noembed", "<bgsound", "<blink>", "<xml>", "<xmp>", "<plaintext>", "<marquee>", "<layer>", "<ilayer>", "<table", "<tr", "<td", "<th", "<tbody", "<thead", "<tfoot", "<colgroup", "<col", "<caption", "<br", "<hr", "<pre", "<li", "<ul", "<ol", "<dl", "<dt", "<dd", "<u", "<s", "<strike", "<strong", "<em", "<i", "<b", "<font", "<big", "<small", "<sub", "<sup", "<code", "<kbd", "<samp", "<var", "<cite", "<abbr", "<acronym", "<address", "<blockquote", "<q", "<ins", "<del", "<dfn", "<mark", "<time", "<progress", "<meter", "<legend", "<output", "<keygen", "<datalist", "<select", "<optgroup", "<option", "<textarea", "<fieldset", "<label", "<output", "<legend", "<datalist", "<keygen", "<progress", "<meter"]


def handle_user_input(user_input: str) -> float:
    for item in BLACKLIST:
        if item in user_input:
            user_input = user_input.replace(item, '')
    new_user_input = user_input.replace(',', '.')
    return float(new_user_input)


def fetch_chart_api_data():
    response = requests.get(getenv('CHART_URL'))
    data = response.json()
    return data
