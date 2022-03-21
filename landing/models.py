from django.db import models

# Create your models here.


class Article(models.Model):
    idart = models.TextField()
    date = models.TextField(max_length=256, verbose_name='Дата публикации')
    title = models.TextField(max_length=256, verbose_name='Заголовок')
    subtitle = models.TextField(max_length=256, verbose_name='Подзаголовок', blank=True, null=True)
    img = models.URLField(verbose_name='Ссылка картинки')
    text = models.TextField(verbose_name='Текст статьи')
    created_at = models.DateTimeField()

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Статья'
        verbose_name_plural = 'Статьи'
    
    def __str__(self):
        return f'{self.id} ---- {self.idart} ---- {self.created_at}'


class Comment(models.Model):
    name = models.TextField(max_length=256, verbose_name='Имя')
    ava = models.FileField(upload_to='static/comment', verbose_name='Картинка товара', blank=True, null=True)
    text = models.TextField(verbose_name='Текст',blank = True, null = True)
    created_at = models.DateTimeField(auto_now_add=True,blank=True, null=True)
    update_at = models.DateTimeField(blank=True, null=True)
    answer = models.ManyToManyField('self', related_name = 'combined', symmetrical=False, blank = True, null = True, verbose_name = "Ответ")

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Коментарий'
        verbose_name_plural = 'Коментарии'
    
    def __str__(self):
        return f'{self.id} - {self.name}'


class Photo(models.Model):
    url = models.FileField(upload_to='static/photo', verbose_name='Фото комментариев')
    product_id = models.ForeignKey(
        Comment, related_name='comment_photo', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.product_id}'

    class Meta:
        verbose_name = 'ФотоКоммент'
        verbose_name_plural = 'ФотоКомменты'


class Lead(models.Model):
    name = models.TextField(max_length=256, verbose_name='Имя')
    phone = models.TextField(max_length=256, verbose_name='Телефон')
    siteId = models.TextField(max_length=256, verbose_name='СайтИд', blank=True, null=True)
    campId = models.TextField(max_length=256, verbose_name='Кампания', blank=True, null=True)
    bannerId = models.TextField(max_length=256, verbose_name='Креатив', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add = True)
    ppLeadId = models.TextField(max_length=256, verbose_name='Ид лида ПП', blank=True, null=True)
    
    def __str__(self):
        return f'{self.id} -------- {self.phone} -------- {self.created_at}'

    class Meta:
        verbose_name = 'Лид'
        verbose_name_plural = 'Лиды'

        