from landing.parsing import parsing
from landing.models import Article

def my_scheduled_job():
    articles = parsing()
    listArticle = Article.objects.all()
    for art in reversed(articles):
        if listArticle.filter(title = art['title']).exists():
            continue
        else:
            Article.objects.create(idart = art['id'], date = art['date'], 
                                title = art['title'], img = art['img'], text = art['text'])