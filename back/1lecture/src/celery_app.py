from celery import Celery
from .config import settings

celery_worker = Celery(
    "worker",
    broker=f"redis://redis:6379/0",
    backend=f"redis://redis:6379/0"
)

celery_beat = Celery(
    "beat",
    broker=f"redis://redis:6379/0",
    backend=f"redis://redis:6379/0"
)

celery_worker.conf.task_routes = {
    "src.tasks.*": {"queue": "main-queue"}
}

celery_beat.conf.task_routes = {
    "src.tasks.*": {"queue": "main-queue"}
} 