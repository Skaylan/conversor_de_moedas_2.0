from app import app
import os
from dotenv import load_dotenv

load_dotenv()
app = app

if __name__ == '__main__':
    if os.getenv('FLASK_ENV') == 'production':
        app.run(debug=False, port=os.getenv('PORT'), host='0.0.0.0')
    else:
        app.run(debug=True, port=5000)