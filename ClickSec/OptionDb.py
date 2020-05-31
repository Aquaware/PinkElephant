# -*- coding: utf-8 -*-
import sys
sys.path.append("../common")
sys.path.append("../private")

import pytz
from datetime import datetime
from Postgres import Postgres, Structure
#import setting_option as setting
import account_db as account
from OptionPrice import OptionPrice
from CalendarTime import Now, DeltaHour
from CalendarTime import toNaive
from TimeSeries import TimeSeries, OHLC, OHLCV

TIME = 'time'
KIND = 'kind'
CONTRACT_MONTH = 'contract_month'
CONTRACT_PRICE = 'contract_price'
PRICE = 'price'
VOLUME = 'volume'
DELTA = 'delta'
GAMMA = 'gamma'
VEGA = 'vega'
THETA = 'theta'
IV = 'IV'
TBEGIN = 'tbegin'
TEND = 'tend'

TIME_FORMAT = '%Y-%m-%d %H:%M:%S'
MANAGE_TABLE_NAME = 'manage'
DB_NAME = 'Nikkei225Option'

def ManageTable(name=MANAGE_TABLE_NAME):
    struct = { CONTRACT_MONTH:'varchar(10)', CONTRACT_PRICE: 'varchar(10)', KIND:'varchar(10)', TBEGIN:'timestamp', TEND:'timestamp'}
    table = Structure(name, [CONTRACT_MONTH, CONTRACT_PRICE, KIND], struct)
    return table

def PriceTable(contract_month):
    struct = {TIME: 'timestamp', CONTRACT_PRICE: 'varchar(10)', KIND: 'varchar(10)', PRICE:'real', VOLUME: 'int', DELTA:'real', GAMMA:'real', VEGA:'real', THETA:'real', IV:'real'}
    table = Structure(contract_month, [TIME, CONTRACT_PRICE, KIND], struct)
    return table

def tableName(contract_month):
    return ('Option2_' + contract_month)

class OptionDb(Postgres):
    
    def __init__(self):
        super().__init__(DB_NAME, account.DB_USER, account.DB_PASSWORD, account.DB_PORT)
        if self.isTable(MANAGE_TABLE_NAME) == False:
            table = ManageTable()
            self.create(table)
        pass
    
    def updatePrices(self, prices):
        for price in prices:
            table_name = tableName(price.contract_month)
            table = PriceTable(table_name)
            is_table = self.isTable(table_name)
            if  is_table == False:
                self.create(table)
            if self.update(table, [price.time, price.contract_price, price.kind, price.price, price.volume, price.delta, price.gamma, price.vega, price.theta, price.iv]):
                self.updateManage(price)
        return
 
    def isItem(self, table, price):
        where = {CONTRACT_PRICE: price.contract_price, KIND: price.kind, TIME: price.time}
        r = self.fetchItem(table, where=where)
        if len(r) > 0:
            return True
        else:
            return False

    def updateManage(self, price):
        table = ManageTable()
        where = {CONTRACT_MONTH: price.contract_month, CONTRACT_PRICE: price.contract_price, KIND: price.kind}
        r = self.fetchItem(table, where=where)
        if len(r) > 0:
            t = price.time.astimezone(pytz.timezone('Asia/Tokyo'))
            if r[TBEGIN] > t:
                self.update(table, [price.contract_month, price.contract_price, price.kind, price.time, None])
            if r[TEND] < t:
                self.update(table, [price.contract_month, price.contract_price, price.kind, None, price.time])
        else:
            self.insert(table, [[price.contract_month, price.contract_price, price.kind, price.time, price.time]])
        

    def fetchItem(self, table, where=None):
        array = self.fetch(table, where)
        return self.value2dic(table, array)

    def fetchAllItem(self, table, asc_order_column):
        array = self.fetchAll(table, asc_order_column)
        return self.values2dic(table, array)
 
    def value2dic(self, table, values):
        dic = {}
        if len(values) == 0:
            return dic
        for (column, value) in zip(table.all_columns, values[0]):
            if table.typeOf(column) == 'timestamp':
                t1 = value.astimezone(pytz.timezone('Asia/Tokyo'))
                dic[column] = t1
            else:
                dic[column] = value
        return dic
    
    def values2dic(self, table, values):
        dic = {}
        for i in range(len(table.columns)):
            column = table.columns[i]
            d = []
            for v in values:
                d.append(v[i])
            if table.typeOf(column) == 'timestamp':
                dic[column] = self.time2pyTime(d)
            else:
                dic[column] = d
        return dic
    
    def qureyConditions(self, contract_month):
        table = ManageTable()
        items = self.fetchAll(table, CONTRACT_MONTH)
        out = []
        for item in items:
            if item[0] == contract_month:
                out.append(item[0:3])
        return out
    
    def queryPrice(self, contract_month, contract_price, kind, begin_time, end_time):
        table = PriceTable(tableName(contract_month))
        where0 = CONTRACT_PRICE + " = '" + contract_price + "' AND " + KIND + " = '" + kind + "' "
        if begin_time is not None:
            where1 = TIME + " >= cast('" + str(begin_time) + "' as timestamp) "
        else:
            where1 = ''
        if end_time is not None:
            where2 = TIME + " <= cast('" + str(begin_time) + "' as timestamp) "
        else:
            where2 = ''
            
        if begin_time is None and end_time is None:
            where = where0
        elif begin_time is not None and end_time is not None:
            where = where0 + ' AND ' + where1 + ' AND ' + where2
        else:
            where = where0 + ' AND ' + where1 + where2
            
        items = self.fetchItemsWhere(table, where, TIME)
        time = []
        values = []
        for item in items:
            time.append(toNaive(item[0]))
            v = item[3]
            values.append([v, v, v, v, item[4]])
        return TimeSeries(time, values, OHLCV)
        
# ----

def build():
    db = OptionDb()
    if db.isTable(MANAGE_TABLE_NAME) == False:
        table = ManageTable()
        db.create(table)
        

def test1():
    t0 = datetime(2020, 5, 1, 12, 10, 0)
    t1 = datetime(2020, 5, 1, 12, 30, 0)
    p0 = OptionPrice(t0, '202005', 18000, 'C', 30.1, 7)
    p1 = OptionPrice(t1, '202005', 17000, 'P', 10.1, 10)
    p = [p0, p1]
    db = OptionDb()
    db.updatePrice(p)
    
def test2():
    t0 = datetime(2020, 5, 1, 12, 10, 0)
    t1 = datetime(2020, 5, 1, 12, 40, 0)
    p0 = OptionPrice(t0, '202006', 18000, 'C', 32.1, 7)
    p1 = OptionPrice(t1, '202006', 17000, 'P', 10.5, 10)
    p = [p0, p1]
    db = OptionDb()
    db.updatePrice(p)
    
if __name__ == '__main__':
    test1()     
    test2()