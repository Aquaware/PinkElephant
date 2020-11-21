#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jun 19 21:58:49 2018

@author: iku
"""
import os
import sys
current_dir = os.path.abspath(os.path.dirname(__file__))
sys.path.append(current_dir + "/../common")
sys.path.append(current_dir + "/../private")

import threading
from ChromeHandler import ChromeHandler
import OptionParser
import Nikkei225fParser
from OptionDb import OptionDb, TickTable
from OptionPrice import importFromTable

from datetime import datetime, timedelta
import time

from CalendarTime import Today, DeltaMonth
import account_click_sec as account

from Timer import Timer

#chrome1 = ChromeHandler()
chrome2 = ChromeHandler()

intervalSec = 0.1
timer1 = None
timer2 = None


def now():
    return datetime.now()

class EveryMinutesTimer(object):
    
    def __init__(self, minutes):
        t = now()
        tnext = datetime(t.year, t.month, t.day, t.hour)
        self.minutes = minutes
        while tnext < t:
            tnext += timedelta(minutes=minutes)
        self.next_time = tnext
        
    def shouldDo(self):
        t = now()
        if t >= self.next_time:
            self.next_time += timedelta(minutes=self.minutes)
            return True
        else:
            return False
        
class EveryDayTimer(object):
    def __init__(self, hour, minute):
        t = now()
        self.hour = hour
        self.minute = minute        
        tnext = datetime(t.year, t.month, t.day) + timedelta(days=1)
        tnext += timedelta(hours=hour)
        tnext += timedelta(minutes=minute)
        self.next_time = tnext
        
    def shouldDo(self):
        t = now()
        if t >= self.next_time:
            tnext = datetime(t.year, t.month, t.day) + timedelta(days=1)
            tnext += timedelta(hours=self.hour)
            tnext += timedelta(minutes=self.minute)
            self.next_time = tnext
            return True
        else:
            return False    
    
class TickBuffer(object):

    def __init__(self, name):
        self.name = name
        self.buffer = []
        self.date = None
        
    def add(self, tick_list):
        if tick_list is None:
            print('error in add method')
            return None
        if len(tick_list) == 0:
            print('error in add method')
            return None
        
        tick = tick_list[-1]
        t = tick[0]
        out = None
        if self.date is None:
            self.date = datetime(t.year, t.month, 1)
        for tick in tick_list:
            [t, bid, ask] = tick
            if t.year > self.date.year or t.month > self.date.month:
                out = self.buffer.copy()
                self.buffer = []
                self.date = datetime(t.year, t.month, 1)
            self.buffer.append([t, bid, ask, (bid + ask) / 2, 0])
            
        return out
         
    def flush(self):
        out = self.buffer.copy()
        self.buffer = []
        self.date = None
        return out
    
def int2str(d, length):
    s = '0000' + str(d)
    n = len(s)
    return s[n - length: n]

def contractCode():
    t = Today()
    code = []
    for i in range(4):
        y = int2str(t.year, 4)
        m = int2str(t.month, 2)
        code.append(y + m)
        t += DeltaMonth(1)
            
    code.append('202075') # 11/20
    code.append('202076') # 11/27
    code.append('202077') # 12/6
    print(contractCode)
    return code 

def get225fPrice():
    codes = contractCode()
    month = codes[0]
    chrome1.clickButtonByName('reloadButton')

    parser = Nikkei225fParser.Nikkei225fParser(chrome1.html())
    nikkei225fPrices = parser.parse()
    if len(nikkei225fPrices) > 0:
        print(month, nikkei225fPrices[0])
        return nikkei225fPrices[0]
    else:
        return None

def getOptionPrices():
    codes = contractCode()
    for code in codes:
        try:
            chrome2.selectListByName('targetDeliveryMonth', code)
            chrome2.executeJS("changeDeliveryMonth('0')", [])
            getOptionPrice(code)
        except:
            continue
        
def getOptionPrice(theMonth):
    chrome2.clickButtonByName('reloadButton')
    parser = OptionParser.OptionParser(chrome2.html())
    prices = parser.parse(theMonth)
    db = OptionDb()
    for price in prices:
        price.description()   
    db.updatePrices(prices)
    return


    
   
def close():
    #chrome1.close()
    chrome2.close()
    pass

def login1():
    #chrome1 = ChromeHandler()
    url = account.URL
    userid = account.USERID
    password = account.PASSWORD
    chrome1.connect(url)
    time.sleep(5)
    chrome1.inputElement('j_username', userid)
    chrome1.inputElement('j_password', password)
    chrome1.clickButtonByName('LoginForm')
    chrome1.linkByClassName('js-fuop')
    #chrome1.linkByText('オプション注文')
    chrome1.linkByText('先物注文')
    return

def login2():
    #chrome2 = ChromeHandler()
    chrome2.connect(account.URL)
    time.sleep(5)
    chrome2.inputElement('j_username', account.USERID)
    chrome2.inputElement('j_password', account.PASSWORD)
    chrome2.clickButtonByName('LoginForm')
    chrome2.linkByClassName('js-fuop')
    chrome2.linkByText('オプション注文')
    return

def GMONavigator():
    scrape()
    
def scrape():
    #login1()
    #timer1 = Timer(0.1, get225fPrice)
    #timer1.run()
    
    login2()
    timer2 = Timer(2.0, getOptionPrices)
    timer2.run()
    
    pass

def test():
    login2()
    getOptionPrices()
    

if __name__ == "__main__":
    scrape()
    #test()
