import logging
from urllib import response
from django.shortcuts import render
from landing.models import Article, Comment, Lead
import json
import conf
from landing.api import requestLead
from django.http import HttpResponseBadRequest, JsonResponse


logger = logging.getLogger(__name__)


def artListViews(request):
    title = 'КазТАГ: Казахское телеграфное агентство'
    paramTemplate = request.GET.get('utm_source')
    numParam = 0
    if paramTemplate:       
        numParam = int(paramTemplate[-1])
    template = 'index.html'
    listArticle = Article.objects.order_by("-id")[0:5]
    context = {'list':listArticle, 'title':title, 'param' : numParam}
    return render(request, template, context)


def artListViews2(request):
    title = 'КазТАГ: Казахское телеграфное агентство'
    paramTemplate = request.GET.get('utm_source')
    numParam = 0
    if paramTemplate:       
        numParam = int(paramTemplate[-1])
    template = 'index2.html'
    listArticle = Article.objects.order_by("-id")[0:5]
    listComment= Comment.objects.order_by("-id")[0:5]
    context = {'list':listArticle, 'title':title, 'coms':listComment, 'param' : numParam}
    return render(request, template, context)


def articleViews(request, art_id):
    title = 'КазТАГ: Казахское телеграфное агентство'
    art = Article.objects.get(id = art_id)
    listArticle = Article.objects.order_by("-id")[0:5]
    context = {'art':art, 'list':listArticle, 'title': title}
    template = 'article.html'
    return render(request, template, context)


def confirmViews(request):
    title = 'КазТАГ: Казахское телеграфное агентство'
    name = request.GET.get('name')
    phone = request.GET.get('phone')
    context = {'name':name, 'phone':phone, 'title':title}
    template = 'confirm.html'
    return render(request, template, context)

def commentViews(request):
        # request.is_ajax() is deprecated since django 3.1
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

    if is_ajax:
        if request.method == 'GET':
            commentlist = []
            todos = Comment.objects.all()
            for todo in todos:
                parentCommentlist = todo.combined.all()
                if parentCommentlist:
                    continue
                commentdict = {}
                commentdict['id'] = todo.id
                commentdict['name'] = todo.name
                commentdict['text'] = todo.text
                commentdict['created_at'] = todo.created_at.strftime('%d.%m.%Y в %H:%M')
                if todo.update_at:
                    commentdict['update_at'] = todo.update_at.strftime('%d.%m.%Y в %H:%M')
                listAnswer = todo.answer.all()
                photoComment = todo.comment_photo.all()
                answerdict1 = []
                photolist = []
                if len(photoComment) != 0:
                    for pic in photoComment:
                        photolist.append(str(pic.url))
                if len(listAnswer) != 0:
                    for answer in reversed(listAnswer):
                        answerdict = {}
                        answerdict['id'] = answer.id
                        answerdict['name'] = answer.name
                        answerdict['text'] = answer.text
                        answerdict['created_at'] = answer.created_at.strftime('%d.%m.%Y в %H:%M')
                        answerdict1.append(answerdict)
                commentdict['answer'] = answerdict1
                commentdict['photo'] = photolist
                commentlist.append(commentdict)
            return JsonResponse({'comment': commentlist})
        if request.method == 'POST':
            data = json.load(request)
            app = data.get('payload')
            if 'id' in app:
                parentComment = Comment.objects.get(id = app['id'])
                ansComm = Comment.objects.create(name=app['name'], text=app['text'])
                parentComment.answer.add(ansComm)
            else:
                Comment.objects.create(name=app['name'], text=app['text'])
            return JsonResponse({'status': 'Todo added!'})     
        return JsonResponse({'status': 'Invalid request'}, status=400)
    else:
        return HttpResponseBadRequest('Invalid request')


def leadViews(request):
    """ Прием AJAX запроса от формы заявок."""
    
    # Получение ip пользователя
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    # request.is_ajax() is deprecated since django 3.1
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

    if is_ajax:
        if request.method == 'POST':
            data = json.load(request)
            lid = data.get('payload')
            try:
                objLead = Lead.objects.create(name = lid['name'], phone = lid['phone'], 
                                    siteId = lid['utm_source'], campId = lid['utm_campaign'],
                                    bannerId= lid['utm_content'])
            except:
                logger.warning(data)
            
            dataLead = {
                "flow_uuid": conf.hashFlow,
                "ip": ip,
                "country_code": conf.country_code,
                "phone": lid['phone'],
                "name": lid['name']
            }
            listUtm = ['utm_source', 'utm_campaign', 'utm_content']
            for utm in listUtm:
                if lid[utm] != None:
                    dataLead[utm] = lid[utm]

            respLead = requestLead(dataLead)
            if respLead['success']:
                objLead.ppLeadId = respLead['data']['lead_uuid']
                objLead.save()
            elif respLead['success'] == False:
                logger.warning(respLead)

            return JsonResponse({'lead': 'True', 'name':lid['name'], 'phone':lid['phone'] })    
        return JsonResponse({'status': 'Invalid request'}, status=400)
    else:
        return HttpResponseBadRequest('Invalid request')
