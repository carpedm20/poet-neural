import re
from pymongo import MongoClient
from collections import Counter
from konlpy.tag import Kkma
from konlpy.utils import pprint
import hashlib
import datetime

from tags import tags as TAGS

#TAGS = [tag.encode('utf-8') for tag in TAGS]

client = MongoClient('localhost', 27017)
db = client['neural']
#collection = db['poet']
collection = db['review']

def get_poets():
    string = ""
    with open('out.txt') as f:
        #string += f.read()[:26915].decode('utf-8' 'ignore')
        string += f.read().decode('utf-8', 'ignore')
    with open('demo.txt') as f:
        #string += f.read()[:8000].decode('utf-8' 'ignore')
        string += f.read().decode('utf-8', 'ignore')
    return re.sub('\n\n+', '\t', string).split('\t')

def get_reviews():
    with open('movie_out.txt') as f:
        string = f.read().decode('utf-8', 'ignore')
    return string.split('\n')

tag_needed = False
if tag_needed:
    #poets = get_poets()
    poets = get_reviews()

    for poet in poets:
        sentences = poet.split('\n')

        for sentence in sentences:
            try:
                c += Counter(kkma.nouns(sentence))
            except NameError:
                c = Counter(kkma.nouns(sentence))
            except:
                pass

#poets = get_poets()
poets = get_reviews()
kkma = Kkma()

for idx, poet in enumerate(poets):
    tags = []
    for noun in kkma.nouns(poet):
        if noun in TAGS:
            tags.append(noun)

    hash_object = hashlib.sha1(poet.encode('utf-8', 'ignore'))
    hex_dig = hash_object.hexdigest()

    results = collection.find_one({'hex':hex_dig})
    if not results:
        document = {'text': poet, 'index': idx, 'tags': tags, 'hex': hex_dig, 'like': 0, 'date': datetime.datetime.utcnow()}
        collection.insert(document)
