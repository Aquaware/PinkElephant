#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jun 19 21:58:49 2018

@author: iku
"""
import ChromeHandler as Chrome
from selenium.common.exceptions import NoSuchElementException
import datetime
import time as pyTime
import Scheduler
import const



menu_demo_fx = 8
menu_demo_index = 7


intervalSec = 0.1
scheduler = None
trailing = None


class Position:
    def __init__(self):
        self.index = -1
        self.brand = ''
        self.limit = ''
        self.lot = 0
        self.openRate = 0
        self.currentRate = 0
        self.profitRate = 0
        self.profit = 0
        self.active = False
        return
    
    def parse(self, index, values):
        self.index = index
        if len(values) != 6:
            return False
        try:
            self.brand = values[0]
            self.limit = values[1]
            self.lot = float(values[2])
            self.openRate = float(values[3])
            self.currentRate = float(values[4])
            self.profitRate = self.currentRate - self.openRate
            if self.currentRate > 0:
                self.active = True
                s = values[5].replace('$', '')
                ss = s.replace('￥', '')
                sss = ss.replace(',', '')
                self.profit = float(sss)
        except ValueError:        
            return False                
        return True
    
    def description(self):
        print('index: ', self.index)
        print(self.brand)
        print(self.limit)
        print('Lot:', self.lot)
        print('Price:', self.openPrice)
        print('Current:', self.currentPrice)
        print('Profit:', self.profit)
        pass
   
# -----
NOT_INITIALED = -1
INITIALED = 0
WAIT_PROFIT = 1
TRAILING = 2
CLOSED = 3

def now():
    return datetime.datetime.now()

class TrailingRule:
    def __init__(self, updateStopCallback, initialLossCutRate, initialLossCutIgnoreTimeMinutes, initialProfitRate, stopRateDelta ):
        self.updateStopCallback = updateStopCallback
        self.initialLossCutRate = initialLossCutRate
        self.initialLossCutIgnoreTimeMinutes = initialLossCutIgnoreTimeMinutes
        self.initialProfitRate = initialProfitRate
        self.stopRateDelta = stopRateDelta
        self.initialRate = 0
        self.initialTime = None
        self.stopRate = 0
        self.maxProfitRate = 0
        self.status = NOT_INITIALED
        pass
    
    def setInitialRate(self, initialRate):
        self.initialRate = initialRate
        self.initialTime = datetime.datetime.now()
        self.stopRate = initialRate - self.initialLossCutRate
        if self.stopRate < 0.0:
            self.stopRate = 0.1
        self.updateStopCallback(0, self.stopRate)
        #print('Stop(0): ', self.stopRate)
        self.status = INITIALED
        pass
    
    def shouldClose(self, currentRate):
        t = now() - (self.initialTime + datetime.timedelta(minutes=self.initialLossCutIgnoreTimeMinutes))
        tsec = t.total_seconds()
        profit = currentRate - self.initialRate
        if self.status == INITIALED and tsec < 0.0:
            if profit > self.initialProfitRate:
                self.stopRate = currentRate - self.stopRateDelta
                #print('Stop(1): ', self.stopRate)
                self.updateStopCallback(1, self.stopRate)
                self.status = TRAILING
            return False
        
        if self.status == INITIALED and tsec >= 0:
            self.stopRate = self.initialRate - self.initialLossCutRate
            self.updateStopCallback(2, self.stopRate)
            #print('Stop(2): ', self.stopRate)
            self.status = WAIT_PROFIT
            
        if currentRate < self.stopRate:
            # Close
            self.status = CLOSED
            return True
        
        if self.status == WAIT_PROFIT and currentRate > self.initialRate + self.initialProfitRate:
            self.stopRate = currentRate - self.stopRateDelta
            self.updateStopCallback(3, self.stopRate)
            #print('Stop(3): ', self.stopRate)
            self.status = TRAILING
            return False
        
        if self.status == TRAILING and currentRate > self.stopRate + self.stopRateDelta:
            self.stopRate = currentRate - self.stopRateDelta
            self.updateStopCallback(4, self.stopRate)
            #print('Stop(4): ', self.stopRate)
            return False

        return False
    
    def clone(self):
        rule = TrailingRule(self.updateStopCallback, self.initialLossCutRate, self.initialLossCutIgnoreTimeMinutes, self.initialProfitRate, self.stopRateDelta )
        rule.initialRate = self.initialRate
        rule.initialTime = self.initialTime
        rule.maxProfitRate = self.initialTime
        rule.status = self.status
        rule.stopRate = self.stopRate
        return rule

# -----
class IGNavigator:
    def __init__(self):
        self.chrome = Chrome.ChromeHandler()
        self.scheduler = None
        self.trailing = None
        self.currentPositions = None
        self.closePositionActive = False
        self.closePositionRule = None
        return
    
    def close(self):
        self.chrome.close()
        pass

    def login(self, menu):
        self.chrome.connect(const.URL)
        self.chrome.inputElementById('account_id', const.USERID)
        self.chrome.inputElementByName('nonEncryptedPassword', const.PW)
        self.chrome.clickButtonById('loginbutton')
        pyTime.sleep(20)
        self.chrome.linksByClassName('segmented-button-label', menu)
        pyTime.sleep(20)
        pass

    def selectBull(self):
        self.chrome.linkByClassName('knockout-tab-bull')
        pass

    def selectBear(self):
        self.chrome.linkByClassName('knockout-tab-bear')
        pass

    def getPrices(self):
        try:
            values = self.chrome.getTextsByClass('ig-ticket-price-button_price')
            premium = self.chrome.getTextsByClass('ig-ticket_ko-premium')
            if len(values) >= 2 and len(premium) >= 1:
                bid = float(values[0])
                ask = float(values[1])
                s = premium[0].replace('ノックアウト・プレミアム\n', '')
                ss = s.replace('ポイント', '')
                prem = float(ss)
                return [bid, ask, prem]
            return []
        except:
            return []
        
    def koLevels(self):
        options = self.chrome.getSelectOptionsByClass('form-control--large')
        return options

    def setKo(self, value):
        self.chrome.setSelectOptionByClass('form-control--large', value)
        pass

    def setLot(self, value):
        self.chrome.inputElementByClass('numeric-input-with-incrementors_input', 0, str(value))
        pass
    
    def valid(self):
        self.chrome.clickButtonByClass('btn-submit')
        pass
    
    def getPositions(self):
        positions = []
        date = now()
        elements = self.chrome.findElementsByClassName('ig-grid_row')
        if elements == None:
            return (date, [])
        
        for i in range(len(elements)):
            element = elements[i]
            values = []
            position = None
            e1 = element.find_element_by_class_name('cell-market-name_name')    
            e2 = element.find_element_by_class_name('cell-market-name_period')
            e3 = element.find_element_by_class_name('text-price-up')
            e4 = element.find_element_by_class_name('cell-open-level')
            e5 = element.find_element_by_class_name('cell-price-change')
            e6 = element.find_element_by_class_name('cell-profit-loss')
            if e1 is None or e2 is None or e3 is None or e4 is None or e5 is None or e6 is None:
                position = None
            else:
                values.append(e1.text)
                values.append(e2.text)
                values.append(e3.text)
                values.append(e4.text)
                values.append(e5.text)
                values.append(e6.text)
                position = Position()
                ret = position.parse(i, values)
                if ret == False:
                    positions.append(position)   
        if len(positions) > 0:
            self.currentPositions = positions
        return positions

    def closePosition(self, index):
        if self.chrome.clickButtonWithIndexByClass(index, 'cell-close_btn'):
            pyTime.sleep(0.1)
            self.chrome.clickButtonByClass('ig-close-position-ticket_submit-btn')
            print(index, 'closed')
        pass
    

    def test(self):
        self.login(menu_demo_fx)
        self.selectBull()
        pyTime.sleep(1)
        self.selectBear()
        pyTime.sleep(1)
        self.selectBull()
    
        ko = self.koLevels()
        if len(ko) < 2:
            return
    
        self.setKo(ko[1])    
        prices = self.getPrices()
        print(prices)
        self.setLot(2)
        #valid()
        position = self.getPositions()
        for pos in position:
            pos.description()
        if pos.profitRate > 5.0:
            self.closePosition(pos.index)
        pass    
            
    def closePosition(self, positions):
        if len(positions) == len(self.trailing):            
            for pos in positions:
                if self.trailing[pos.index].shouldClose(pos.currentRate) == True:
                    self.closePosition(pos.index)
                    self.trailing = []         
        pass
        
    def setTrailing(self, rule, positions):
        self.trailing = []
        if len(positions) > 0:
            for pos in positions:
                r = rule.clone()
                r.setInitialRate(pos.openRate)
                self.trailing.append(r)
                print('Trailing Start')
        pass
    
    def start(self, updatePricesCallback, updatePositionsCallback):
        self.updatePricesCallback = updatePricesCallback
        self.updatePositionsCallback = updatePositionsCallback
        self.scheduler = Scheduler.Scheduler(0.5, self.scheduleWorker, multi_thread = False)
        self.scheduler.start()
        
    def stop(self):
        self.scheduler.stop()
        
    def scheduleWorker(self):
        date = now()
        prices = self.getPrices()
        if len(prices) > 0:
            self.updatePricesCallback(date, prices)
        
        positions = self.getPositions()
        if len(positions) > 0:
            self.updatePositionsCallback(date, positions)
            if self.closePositionActive:
                if len(self.trailing) == 0:
                    self.setTrailing(self.closePositionRule, positions)   
                if len(self.trailing) > 0:
                    self.closePosition(positions)
        pass
        
    def startTrailingStop(self, rule):
        self.trailing = []
        self.closePositionActive = True
        self.closePositionRule = rule
        pass
    
    def test2(self):
        premium = self.chrome.getTextsByClass('ig-ticket_ko-premium')
        print('premium', premium)
    
if __name__ == '__main__':
    
    def updatePositions(date, positions):
        for pos in positions:
            print(date, pos.index, pos.openRate, pos.currentRate)
        pass
    
    def updateStop(stopValue, status):
        print('Stop:', status, stopValue)
        pass
    
    def updatePrices(date, values):
        print(date, values)
        pass
    
    # main routine
    IG = IGNavigator()
    IG.login(menu_demo_index)    
    pyTime.sleep(5)
    IG.start(updatePrices, updatePositions)
    IG.test()
        
    # closing if positions are hold
    #rule1 = TrailingRule(updateStop, 12.0, 0.5, 6.0, 3.0)
    #rule2 = TrailingRule(updateStop, 12.0, 0.0, 7.0, 3.0)
    #IG.startTrailingStop(rule2)

