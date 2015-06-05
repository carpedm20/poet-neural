from flask import Flask
from flask import url_for, redirect, render_template

PREFIX = "carpedm20"
BASE_URL = "http://pail.unist.ac.kr/"

app = Flask(__name__, static_url_path="/%s/critic/static" % PREFIX,)

import re
from glob import glob

@app.route('/')
@app.route('/%s/' % PREFIX)
def root():
    return redirect(url_for('index'))

@app.route('/%s/critic/' % PREFIX)
def index():
    years = glob("./static/*.json")

    poets = ["123","1231231"]

    return render_template('index.html', poets=poets)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5004)
