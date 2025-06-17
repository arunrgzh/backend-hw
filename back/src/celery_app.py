from celery import Celery
from .config import settings

app = Celery(
    "tasks",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0",
    include=['.tasks']
)

app.conf.task_routes = {
    ".tasks.*": {"queue": "main-queue"}
} 