from pyquery import PyQuery as pq
import urllib.request
import re
from pathlib import Path

from Classifier import *
from ElasticClient import *

##nær í html frá link
def GetHtml(link):
    fp = urllib.request.urlopen(link)
    mybytes = fp.read()

    html = mybytes.decode("utf8")
    fp.close()
    
    return html

##nær í alla sub linka
def GetLinks(html):
    p_jquery = pq(html)
    result = []
    elements = []
    elements = p_jquery(".product-title > a")

    for element in elements:
        result.append(element.attrib['href'])

    return result

##ef það eru íslensk orð í titilinum þá eru þau tekin í burtu
##td: Samsung LED 48" Sjónvarp => Samsung LED 48"
def ParseTitle(title):
    title_exploded = title.split()

    ret_title = ""

    for word in title_exploded:
        if GetLanguage(word) == "is":
            continue

        ret_title = ret_title + word + " "

    return ret_title

##nær í titil vöru
def GetTitle(html):
    p_jquery = pq(html)
    result = p_jquery("h1.product-title")
    
    return ParseTitle(result.text())

##ef það eru stafir í verðinu þá eru þeir teknir í burtu
##td: 20.000 KR => 20000
def ParsePrice(price):
    ret_price = ""
    for letter in price:
        if letter.isdigit():
            ret_price = ret_price + letter
    
    return ret_price

##nær í verðið
def GetPrice(html):
    p_jquery = pq(html)
    result = p_jquery(".price")
    
    return ParsePrice(result.text())

##nær í link að myndinni
def GetImage(html):
    p_jquery = pq(html)
    result = p_jquery(".product-big-image > div > img")
    
    return result.attr("src")

##reynir að búa til filter data 
def GetFeatures(html):
    p_jquery = pq(html)
    elements = []
    elements = p_jquery(".feature-div > .table > tbody > tr > td:not(.td-head)")

    ts = []
    vs = []
    turn = False

    for element in elements:
        if turn == False:
            ts.append(element.text.replace("\n", ""))
            turn = True
        else:
            vs.append(element.text.replace("\n", ""))
            turn = False

    index = 0
    ret = "information : ["

    while(index < len(ts)):
        element = "{"
        element = element + "name : " + ts[index] + ","
        element = element + "data : " + vs[index]

        if index == len(ts)-1:
            element = element + "}]"
            ret = ret + element
        else:
            element = element + "},"
            ret = ret + element

        index = index + 1
    return ret

##byrjar að scrape-a linkana
def Start():
    links = ["https://elko.is/hljod-og-mynd/sjonvorp", "https://elko.is/simar-og-gps/farsimar?new=desc"]

    for superlink in links:
        usableLinks = GetLinks(GetHtml(superlink))

        for link in usableLinks:
            try:
                html = GetHtml(link)

                title = GetTitle(html)
                price = GetPrice(html)
                image = GetImage(html)
                features = GetFeatures(html)

                doc = CreateDocument(link, title, price, image, "{}", "", features)
                print(doc)
                #Insert(doc)
                print("inserted: " + title + " on link " + link)
            except Exception as err:
                print("Error in scraping link: " + link)
                print(err)
