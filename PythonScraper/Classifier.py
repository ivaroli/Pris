import io
import os

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'C:/Users/ivart/Documents/Development/Web/Pris/Pris-77840bdf54ac.json'

# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types
from googletrans import Translator

import urllib.request

# Instantiates a client
vision_client = vision.ImageAnnotatorClient()

#Skannar myndir og gefur hverri mynd "labels"
def lable(image):
    ret = []
    vision_client = vision.ImageAnnotatorClient()

    fp = urllib.request.urlopen(image)
    mybytes = fp.read()
    fp.close()

    image = types.Image(content=mybytes)

    response = vision_client.label_detection(image=image)
    labels = response.label_annotations

    for label in labels:
        print(label.description)
        ret.append(label.description)

    #ret = to_isk(ret)
    return ret

#finnur tungumálið á streng
def GetLanguage(data):
    translator = Translator(service_urls=[
      'translate.google.com',
      'translate.google.co.kr',
    ])

    detection = translator.detect(data)
    return detection.lang

#breytir enskum label-um í íslensku
def to_isk(lables):

    new_lables = lables

    translator = Translator(service_urls=[
      'translate.google.com',
      'translate.google.co.kr',
    ])
    translations = translator.translate(lables, dest='is')
    for translation in translations:
        new_lables.append(translation.text)
    return new_lables