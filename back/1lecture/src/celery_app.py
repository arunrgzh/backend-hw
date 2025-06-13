from celery import Celery
from back.1lecture.src.config import settings

app = Celery(
    "tasks",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0",
    include=['back.1lecture.src.tasks']
)

app.conf.task_routes = {
    "back.1lecture.src.tasks.*": {"queue": "main-queue"}
} 