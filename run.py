#!/usr/bin/python
#-*- coding: utf-8 -*-
from flask import Flask
from flask import url_for, redirect, render_template, jsonify, session

PREFIX = "carpedm20"
BASE_URL = "http://pail.unist.ac.kr/"

app = Flask(__name__, static_url_path="/%s/poet/static" % PREFIX,)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'


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
PAGE = 8

client = MongoClient('localhost', 27017)
db = client['neural']
collection = db['poet']

_paragraph_re = re.compile(r'((?:\r\n|\r|\n){2,}|\.\ +)')
_paragraph_re1 = re.compile(r'((?:\r\n|\r|\n){1,}|\.\ +)')

@app.template_filter()
@evalcontextfilter
def nl2br(eval_ctx, value, is_list=False):
    if is_list:
        result = [u'%s' % p.replace('\n', u'') \
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

@app.route('/%s/poet/like/<int:index>' % PREFIX)
def poet_like(index):
    item = list(collection.find({'index':index}).limit(1))[0]

    if not session.has_key('likes'):
        session['likes'] = []

    if str(item['_id']) in session['likes']:
        data = {'success':False}
    else:
        collection.update({
            '_id': item['_id']
        },{
            '$inc': {
                'like': 1
            }
        }, upsert=False, multi=False)

        data = {'success':True, 'count': item['like'] + 1}
        session['likes'].append(str(item['_id']))

    return jsonify(**data)


@app.errorhandler(404)
def page_not_found(e):
    return redirect(url_for('poet'))

@app.route('/%s/poet/<int:index>' % PREFIX)
def poet_one(index):
    if index == 0:
        return redirect(url_for('poet'))

    items = list(collection.find({'index':{'$gte':index-1}}).sort('index').limit(2))

    if len(items) != 2:
        return redirect(url_for('poet'))

    items.reverse()

    return get_default_render('poet.html', 'poet_one', items[-1]['index'], get_items(items, index))

def get_items(items, index):
    item_iter = items[:-1]
    if len(item_iter) == 1:
        item_iter = items

    for idx in [0, -1]:
        item = items[idx]
        tmp = nl2brlist(True, item['text'].split('\n'), True)
        item['title'] = tmp[0].strip()
        item['short'] = ""

        title_idx = 1
        while len(item['short']) < 30:
            try:
                item['short'] += tmp[title_idx].strip() + " "
            except:
                break
            title_idx += 1
        item['short'] = item['short'].strip() + "..."

    for idx, item in enumerate(item_iter):
        #tmp = item['text'].split('\n')
        tmp = nl2brlist(True, item['text'].split('\n'))
        head = tmp.split('\n')[0]

        if len(head) > 28:
            try:
                item['text'] = tmp
            except:
                item['text'] = ""
            item['head'] = "#%s" % item['index']
        else:
            item['text'] = '\n'.join(tmp.split('\n')[1:])
            item['head'] = head

    if index == 0:
        items.append({'head':u'새로 만들기', 'short':'', 'index':0})

    return items

def pagination(idx, best=False):
    if best:
        col = collection.find({'like':{'$gte':1}}).sort('like')
    else:
        col = collection.find()

    max_idx = col.count() - 1
    start_idx = max_idx - (PAGE) * (idx)
    count = PAGE + 1
    if start_idx < 0:
        count += start_idx
        start_idx = 0

    if count < 0:
        return []
        
    if best:
        items = list(col.limit(count))
    else:
        items = list(collection.find({'index':{'$gte':start_idx}}).sort('like').limit(count))

    items.reverse()

    return get_items(items, start_idx)

@app.route('/%s/poet/page/<int:index>' % PREFIX)
def poet_page(index):
    if index < 0:
        return redirect(url_for('poet'))

    items = pagination(index)
    return get_default_render('poet.html', "poet_page", index+1, items)

@app.route('/%s/poet/best/<int:index>' % PREFIX)
def poet_best(index):
    if index < 0:
        return redirect(url_for('poet'))

    items = pagination(index, best=True)
    return get_default_render('poet.html', "poet_best", index+1, items)

@app.route('/%s/poet/' % PREFIX)
def poet():
    items = pagination(1)
    return get_default_render('poet.html', "poet_page", 2, items)

def get_default_render(template, action, index, items):
    if len(items) == 0:
        return redirect(url_for('poet'))

    return render_template(template, action=action, next_idx=index, poets=items, max_count=collection.count(), footer=str(randint(1,5)))

@app.route('/%s/alba/' % PREFIX)
def alba():
    poets = ["123","1231231","123","1231231","123123123","","123123"]

    return render_template('alba.html', poets=poets)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5004)
