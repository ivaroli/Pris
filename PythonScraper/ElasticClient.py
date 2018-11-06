import requests
import json
from elasticsearch5 import Elasticsearch

es = Elasticsearch([{'host': 'localhost', 'port':9200}])
res = requests.get('http://localhost:9200')

##býr til json document sem er sett í gagnasafnið
def CreateDocument(link, title, price, image, labels, category, features):
    doc = json.dumps({
        "title": title,
        "price": price,
        "image": image,
        "link": link,
        "labels": labels,
        "category": category,
        "features": features
        }, indent=4)
    return doc

##checkar hvort þetta sé til staðar í gagnasafninu ef svo þá breytir hann því þar ef þess þarf
def Insert(insertionData):
    jsonData = json.loads(insertionData)
    baseData = HasData(insertionData)

    if(baseData["hits"]["total"] > 0):
        inDb = HasChange(baseData, jsonData)

        if(inDb != {}):
            print("updated some data")
            Update(inDb, jsonData)
    else:
        print("inserted new data")
        ActualInsert(insertionData)

    return True

##setur data spurningarlaust inn í gagnasafnið
def ActualInsert(data):
    jsonData = json.loads(data)
    jsonData["version"] = 1
    jsonData["active"] = True

    res = es.index(index='prices', doc_type='products', body=json.dumps(jsonData))
    print(res)
    return True

##Í stað þess að setja inn í safnið þá frekar að uppfæra það ser er nú þegar til
def Update(baseData, data):
    newBaseData = baseData["_source"]
    newBaseData["active"] = False

    data["version"] = newBaseData["version"] + 1
    data["active"] = True
    
    es.delete(index='prices', doc_type='products', id=baseData["_id"])

    #es.index(index='prices', doc_type='products', body=newBaseData)
    es.index(index='prices', doc_type='products', body=data)
    
    return True

##checkar hvort það sé til í gagnasafninu
##ef svo þá returnar það datanu sem er til annars tómum streng
def HasData(data):
    jsonData = json.loads(data)
    
    searchDocument = json.dumps({
      "query": {
        "bool" : {
          "must" : {
            "match" : { "link" : jsonData["link"] }
          }
        }
      }
    }, indent=4)

    response = es.search(index='prices', body=searchDocument)

    return response

##checkar hvort það sé munur á hlutunum tvemur
def HasChange(data1 ,data2):

    for key in data1["hits"]["hits"]:
        print(key["_source"])

        if(key["_source"]["active"] == True):
            usedData = key
    
    if(usedData != {} and usedData["_source"]["price"] == data2["price"] and usedData["_source"]["title"] == data2["title"]):
        print("nei")
        return usedData

    return {}