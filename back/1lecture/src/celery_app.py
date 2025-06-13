from celery import Celery
from back.1lecture.src.config import settings

celery_worker = Celery(
    "worker",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0"
)

celery_beat = Celery(
    "beat",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0"
)

celery_worker.conf.task_routes = {
    "back.1lecture.src.tasks.*": {"queue": "main-queue"}
}

celery_beat.conf.task_routes = {
    "back.1lecture.src.tasks.*": {"queue": "main-queue"}
} 