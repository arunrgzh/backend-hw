from celery import Celery
from back.src.config import settings

app = Celery(
    "tasks",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0",
    include=['back.src.tasks']
)

app.conf.task_routes = {
    "back.src.tasks.*": {"queue": "main-queue"}
} 