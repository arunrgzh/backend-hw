from celery import Celery

app = Celery('characters', broker='redis://localhost:6379/0')

@app.character
def fetch_data_from_website():
    # Logic to fetch data and save it to your database
    pass
