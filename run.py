#!/usr/bin/python
#-*- coding: utf-8 -*-
from flask import Flask
from flask import url_for, redirect, render_template

PREFIX = "carpedm20"
BASE_URL = "http://pail.unist.ac.kr/"

app = Flask(__name__, static_url_path="/%s/poet/static" % PREFIX,)

import re
from glob import glob
from jinja2 import evalcontextfilter, Markup, escape

from random import randint
from pymongo import MongoClient
from collections import Counter
from konlpy.tag import Kkma
from konlpy.utils import pprint
import hashlib

from tags import tags as TAGS
PAGE = 5

client = MongoClient('localhost', 27017)
db = client['neural']
collection = db['poet']

_paragraph_re = re.compile(r'((?:\r\n|\r|\n){2,}|\.\ +)')
_paragraph_re1 = re.compile(r'((?:\r\n|\r|\n){1,}|\.\ +)')

@app.template_filter()
@evalcontextfilter
def nl2br(eval_ctx, value, is_list=False):
    if is_list:
        result = [u'%s' % p.replace('\n', u'</p><p>\n') \
            for p in _paragraph_re1.split(value) if '. ' not in p and p != '.\n' and p != '\n']
    else:
        result = u'\n\n'.join(u'<p>%s</p>' % p.replace('\n', u'</p><p>\n') \
            for p in _paragraph_re.split(value) if '. ' not in p and p != '.\n' and p.strip() != '')
    return result

@evalcontextfilter
def nl2brlist(eval_ctx, value, is_list=False):
    value = "\n".join(value)
    return nl2br(eval_ctx, value, is_list)

def get_poets():
    with open('demo.txt') as f:
        return re.sub('\n\n+', '\t', f.read()).decode('utf-8').split('\t')

poets = get_poets()

@app.route('/')
@app.route('/%s/' % PREFIX)
def root():
    return redirect(url_for('poet'))

@app.route('/%s/poet/<int:index>' % PREFIX)
def poet_one(index):
    years = glob("./static/*.json")

    items = list(collection.find().skip(index-1).limit(2))
    if not items:
        return redirect(url_for('poet'))

    items = get_items(items, index)
    print items

    return get_default_render('poet.html', 'poet_one', items[-1]['index'], items)

def get_items(items, index):
    item_iter = items[:-1]
    if len(items) == 1:
        item_iter = items

    for idx, item in enumerate(item_iter):
        #tmp = item['text'].split('\n')
        tmp = nl2brlist(True, item['text'].split('\n'))
        head = tmp.split('\n')[0]

        if len(head) > 28:
            try:
                item['text'] = tmp
            except:
                item['text'] = ""
            item['head'] = False
        else:
            item['text'] = '\n'.join(tmp.split('\n')[1:])
            item['head'] = head
        item['index'] = index+idx

    if len(items) != 1:
        item = items[-1]
        tmp = nl2brlist(True, item['text'].split('\n'), True)
        items[-1]['head'] = tmp[0]
        items[-1]['short'] = tmp[1]
        item['index'] = index+idx+1
    else:
        items.append({'head':u'새로 만들기', 'short':'', 'index':0})

    return items

def pagination(idx):
    max_idx = collection.count() - 1
    start_idx = max_idx - (PAGE) * (idx)
    count = PAGE + 1
    if start_idx < 0:
        count += start_idx
        start_idx = 0
        
    items = list(collection.find().sort('date').skip(start_idx).limit(count))
    items.reverse()

    return get_items(items, start_idx)

@app.route('/%s/poet/page/0' % PREFIX)
def poet_generate():
    years = glob("./static/*.json")

    items = pagination(1)
    return get_default_render('poet.html', "poet_page", index+1, items)

@app.route('/%s/poet/page/<int:index>' % PREFIX)
def poet_page(index):
    years = glob("./static/*.json")

    items = pagination(index)
    return get_default_render('poet.html', "poet_page", index+1, items)

@app.route('/%s/poet/' % PREFIX)
def poet():
    years = glob("./static/*.json")

    items = pagination(1)
    return get_default_render('poet.html', "poet_page", 2, items)

def get_default_render(template, action, index, items):
    return render_template(template, action=action, next_idx=index, poets=items, max_count=collection.count(), footer=str(randint(1,5)))

@app.route('/%s/alba/' % PREFIX)
def alba():
    years = glob("./static/*.json")

    poets = ["123","1231231","123","1231231","123123123","","123123"]

    return render_template('alba.html', poets=poets)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5004)
