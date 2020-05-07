#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jun 19 21:58:49 2018

@author: iku
"""
import sys
sys.path.append("../common")
sys.path.append("../private")

import ChromeHandler as Chrome
import OptionParser
import Nikkei225fParser
from OptionDb import OptionDb
from OptionPrice import importFromTable

import datetime

import Scheduler
from CalendarTime import Today, DeltaMonth
import account_click_sec as account

chrome1 = Chrome.ChromeHandler()
chrome2 = Chrome.ChromeHandler()

beginTime = datetime.time(21, 5)
endTime = datetime.time(5, 31)
intervalSec = 20.0
scheduler = None


def get225fPrices(theMonth):
    chrome1.clickButtonByName('reloadButton')
    parser = Nikkei225fParser.Nikkei225fParser(chrome1.html())
    nikkei225fPrices = parser.parse()
    print('Nikkei225', theMonth)
    print(nikkei225fPrices[0])
    pass

def getOptionPrices(theMonth):
    chrome2.clickButtonByName('reloadButton')
    parser = OptionParser.OptionParser(chrome2.html())
    prices = parser.parse(theMonth)
    db = OptionDb()
    for price in prices:
        price.description()   
    db.updatePrices(prices)
    return

def int2str(d, length):
    s = '0000' + str(d)
    n = len(s)
    return s[n - length: n]

def getPrice():
    t = Today()
    contractCode = []
    for i in range(10):
        y = int2str(t.year, 4)
        m = int2str(t.month, 2)
        contractCode.append(y + m)
        t += DeltaMonth(1) 
    
    get225fPrices(contractCode[0])
    #get225fPrices(contractCode[0])
    for i in range(1, len(contractCode)):
        code = contractCode[i]
        try:
            chrome2.selectListByName('targetDeliveryMonth', code)
            chrome2.executeJS("changeDeliveryMonth('0')", [])
            getOptionPrices(code)
        except:
            continue
        
def close():
    chrome1.close()
    chrome2.close()
    pass

def login():
    url = account.URL
    userid = account.USERID
    password = account.PASSWORD
    chrome1.connect(url)
    chrome1.inputElement('j_username', userid)
    chrome1.inputElement('j_password', password)
    chrome1.clickButtonByName('LoginForm')
    chrome1.linkByClassName('js-fuop')
    chrome1.linkByText('先物注文')

    chrome2.connect(url)
    chrome2.inputElement('j_username', userid)
    chrome2.inputElement('j_password', password)
    chrome2.clickButtonByName('LoginForm')
    chrome2.linkByClassName('js-fuop')
    chrome2.linkByText('オプション注文')
    pass

def scrape():
    scheduler = Scheduler.Scheduler(intervalSec, chrome1, login, close, getPrice)
    pass

def test():
    login()
    getPrice()
    

if __name__ == "__main__":
    scrape()
    #test()