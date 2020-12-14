# based on https://github.com/deepanprabhu/duckduckgo-images-api
import requests;
import re;
import json;
import time;
import logging;

logging.basicConfig(level=logging.DEBUG);
logger = logging.getLogger(__name__)

def search(keywords, max_results=None):
    url = 'https://duckduckgo.com/';
    params = {
    	'q': keywords
    };

    logger.debug("Hitting DuckDuckGo for Token");

    #   First make a request to above URL, and parse out the 'vqd'
    #   This is a special token, which should be used in the subsequent request
    res = requests.post(url, data=params)
    searchObj = re.search(r'vqd=([\d-]+)\&', res.text, re.M|re.I);

    if not searchObj:
        logger.error("Token Parsing Failed !");
        return -1;

    logger.debug("Obtained Token");

    headers = {
        'authority': 'duckduckgo.com',
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'sec-fetch-dest': 'empty',
        'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'referer': 'https://duckduckgo.com/',
        'accept-language': 'en-US,en;q=0.9',
    }

    params = (
        ('l', 'us-en'),
        ('o', 'json'),
        ('q', keywords),
        ('vqd', searchObj.group(1)),
        ('f', ',,,'),
        ('p', '1'),
        ('v7exp', 'a'),
    )

    requestUrl = url + "i.js";

    logger.debug("Hitting Url : %s", requestUrl);


    while True:
        while True:
            try:
                res = requests.get(requestUrl, headers=headers, params=params);
                data = json.loads(res.text);
                break;
            except ValueError as e:
                logger.debug("Hitting Url Failure - Sleep and Retry: %s", requestUrl);
                time.sleep(5);
                continue;

        logger.debug("Hitting Url Success : %s", requestUrl);
        return data

with open('words.txt') as f:
    words = f.readlines()

with open('images.js') as f:
    s = f.read()
    original_raw_images = json.loads(s[17:])

original_images = {i['query'] + i['raw_query']: i for i in original_raw_images}
new_images = []

for raw_word in words:
    raw_word = raw_word.strip()
    if '|' in raw_word:
        word, search_term = raw_word.split('|')
    else:
        word = search_term = raw_word
    word = word.strip()
    search_term = search_term.strip()

    word_data = original_images.get(word + search_term)
    if not word_data:
        # import pdb; pdb.set_trace()
        word_data = search(search_term)
        word_data['query'] = word
        word_data['raw_query'] = search_term
        time.sleep(2)
    new_images.append(word_data)

with open('images.js', 'w') as f:
    f.write('window._images = ')
    f.write(json.dumps(new_images))
    