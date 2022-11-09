from flask import Flask, request
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Netflix Top 10 and details web-scrapper!'



