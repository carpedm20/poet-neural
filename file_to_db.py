import re
from pymongo import MongoClient
from collections import Counter
from konlpy.tag import Kkma
from konlpy.utils import pprint
import hashlib
import datetime

from tags import tags as TAGS

client = MongoClient('localhost', 27017)
db = client['neural']
collection = db['poet']

def get_poets():
    #with open('demo.txt') as f:
    with open('big_demo.txt') as f:
        #return re.sub('\n\n+', '\t', f.read()).decode('utf-8').split('\t')
        return re.sub('\n\n+', '\t', f.read()[:80523].decode('utf-8')).split('\t')

#TAGS = [tag.encode('utf-8') for tag in TAGS]

tag_needed = False
if tag_needed:
    poets = get_poets()
    for poet in poets:
        sentences = poet.split('\n')

        for sentence in sentences:
            try:
                c += Counter(kkma.nouns(sentence))
            except NameError:
                c = Counter(kkma.nouns(sentence))
            except:
                pass

poets = get_poets()
kkma = Kkma()

for idx, poet in enumerate(poets):
    tags = []
    for noun in kkma.nouns(poet):
        if noun in TAGS:
            tags.append(noun)

    hash_object = hashlib.sha1(poet.encode('utf-8'))
    hex_dig = hash_object.hexdigest()

    results = collection.find_one({'hex':hex_dig})
    if not results:
        document = {'text': poet, 'tags': tags, 'hex': hex_dig, 'like': 0, 'date': datetime.datetime.utcnow()}
        collection.insert(document)
