from app import app
import os
from dotenv import load_dotenv

load_dotenv()
app = app

if __name__ == '__main__':
    app.run(debug=True, port=os.getenv('PORT'))