# -*- coding: utf-8 -*-
import sys
sys.path.append("../common")

import pytz
from Postgres import Postgres, Structure
import setting_xm as setting
import account_db as account

TIME = 'time'
OPEN = 'open'
HIGH = 'high'
LOW = 'low'
CLOSE = 'close'
VOLUME = 'volume'
SPREAD = 'spread'

STOCK = 'stock'
TIMEFRAME = 'timeframe'
TBEGIN = 'tbegin'
TEND = 'tend'

COLUMNS = [TIME, OPEN, HIGH, LOW, CLOSE, VOLUME, SPREAD]
TIME_FORMAT = '%Y-%m-%d %H:%M:%S'
MANAGE_TABLE_NAME = 'manage'

def ManageTable(name=MANAGE_TABLE_NAME):
    struct = {STOCK:'varchar(30)', TIMEFRAME:'varchar(10)', TBEGIN:'timestamp', TEND:'timestamp'}
    table = Structure(name, [STOCK, TIMEFRAME], struct)
    return table

def PriceTable(stock, timeframe):
    name = stock + '_' + timeframe
    struct = {TIME: 'timestamp', OPEN:'real', HIGH:'real', LOW:'real', CLOSE:'real', VOLUME:'real', SPREAD:'real'}
    table = Structure(name, [TIME], struct)
    return table

class XMDb(Postgres):
    
    def __init__(self):
        super().__init__(setting.DB_NAME, account.DB_USER, account.DB_PASSWORD, account.DB_PORT)
        pass
    
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
    
    def time2pyTime(self, time_list):
        time = []
        for t in time_list:
            #t0 = datetime.datetime.strptime(tstr, TIME_FORMAT)
            t1 = t.astimezone(pytz.timezone('Asia/Tokyo'))
            time.append(t1)
        return time
    
# -----
   
#if __name__ == '__main__':
      
