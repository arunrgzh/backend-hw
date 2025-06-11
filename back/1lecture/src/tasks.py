from celery import Celery

app = Celery('tasks', broker='redis://localhost:6379/0')

@app.task
def fetch_data_from_website():
    # Logic to fetch data and save it to your database
    pass
