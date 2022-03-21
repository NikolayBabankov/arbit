from celery import shared_task
from landing.cron import my_scheduled_job

@shared_task
def create_random_user_accounts():
    my_scheduled_job()
