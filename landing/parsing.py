import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
import uuid

UserAgent().chrome

URL = 'https://kaztag.kz/ru/'
URL2 = 'https://kaztag.kz'


def parsing():
    response = requests.get(URL, headers={'User-Agent': UserAgent().chrome})

    soup = BeautifulSoup(response.text, 'html.parser')


    news = soup.find(class_ = 'news')
    listArticle = news.find_all(class_ = 'item')

    listLinkArticles = []

    for art in listArticle[0:5]:
        titleArticle = art.find('a', class_ = 'img')
        link = titleArticle.attrs.get('href')
        linkUrl = URL2 + str(link)
        listLinkArticles.append(linkUrl)

    ArticleList = []

    for i, art in enumerate(listLinkArticles):
        if i == 5:
            break
        tempDict = {}
        responseArticle = requests.get(art, headers={'User-Agent': UserAgent().chrome})
        soupArticle = BeautifulSoup(responseArticle.text, 'html.parser')
        article = soupArticle.find('main')
        divArticle = article.find_all('div')
        tempDict['id']= uuid.uuid1()
        strTitle = divArticle[0].find(class_='title').text
        tempDict['title'] = strTitle.replace("\n","")
        strDate = divArticle[0].find(class_='t-info').text
        tempDict['date'] = strDate[7:].replace("\n","")
        tempDict['img'] = URL2 + divArticle[0].find(class_='img').attrs['data-original']
        bodyArticle = soupArticle.find(class_='content')
        tempDict['text'] = str(bodyArticle.find_all('p')[0].text)
        ArticleList.append(tempDict)

    return ArticleList





if __name__ == "__main__":
    print(parsing())
