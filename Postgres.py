# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import datetime
import os
import psycopg2

import Market

USER = 'postgres'
PASSWORD = ''
PORT = '5433'

DBNAME = 'XMMarket'

COLUMNS = ['time', 'open', 'high', 'low', 'close', 'volume']
TIME_FORMAT = '%Y-%m-%d %H:%M:%S'

def ManageTable(name):
    struct = {'name':'varchar(30)', 'tbegin':'timestamp', 'tend':'timestamp'}
    table = Structure(name, 'name', struct)
    return table

def PriceTable(name):
    struct = {'time': 'timestamp', 'open':'real', 'high':'real', 'low':'real', 'close':'real', 'volume':'integer'}
    table = Structure(name, 'name', struct)
    return table

def time_str2py_time(time_list):
    time = []
    for tstr in time_list:
        time.append(datetime.datetime.strptime(tstr, TIME_FORMAT))
    return time

class Structure:
    def __init__(self, name, primary_key, column_dic):
        self.name = name
        self.column_dic = column_dic
        columns = list(column_dic.keys())
        self.columns = columns
        self.primary_key = primary_key
        self.primary_key_index = -1
        for i in range(len(columns)):
            if columns[i] == primary_key:
                self.primary_key_index = i
                break
        pass
    
    def typeOf(self, column):
        return self.column_dic[column]
    
    def createSql(self):
        s = 'CREATE TABLE ' + self.name + ' ('
        for column in self.columns:
            if column == self.primary_key:
                s += column + ' ' + self.typeOf(column) + ' primary key,'
            else:
                s += column + ' ' + self.typeOf(column) + ','
        s = s[0:-1]
        s += ')'
        return s
    
class Postgres:
    
    def __init__(self, dbname = DBNAME):
        self.dbname = dbname
        pass
        
    def connect(self):
        try:
            statement = 'dbname=' + self.dbname + ' user=' + USER + ' password=' + PASSWORD + ' port=' + PORT
            connection = psycopg2.connect(statement)
            return connection
        except:
            print('Connection Error')
            return None
                
    def sql(self, statement):
        conn = self.connect()
        if conn is None:
            return False
        try:
            cur = conn.cursor()
            cur.execute(statement)
            #cur.fetchall()
            conn.commit()
            cur.close()
            conn.close()
            return True
        except Exception as e:
            print('SQL Error ', statement)
            self.debug(e)
            return False
        
    def create(self, table):
        return self.sql(table.createSql())
            
    def update(self, table, values):
        condition = {table.primary_key:values[table.primary_key_index]}
        v = self.fetch(table, condition)
        if len(v) == 0:
            self.insert(table, [values])
            return
        else:
            s = 'UPDATE ' + table.name + ' SET ' 
            for i in range(len(table.columns)):
                column = table.columns[i]
                if i != table.primary_key_index:
                    s += column + '="' + str(values[i]) + '",'
            s = s[0:-1]
            self.sql(s)
            return
    
    def cursor(self):
        con = self.connect()
        if con is None:
            return (None, None)
        cursor = con.cursor()
        return (con, cursor)
    
    def insert(self, table, value_list):
        con, cursor = self.cursor()
        if cursor is None:
            return
        for value in value_list:
            try:
                d = []
                s = ' VALUES('
                for v in value:
                    d.append(str(v))
                    s += '%s,'
                s = s[0:-1]
                s += ')'
                    
                param = table.name + '('
                for column in table.columns:
                    param += (column + ',')
                param = param[0:-1]
                param += ') '
                cursor.execute( 'INSERT INTO ' +  param + s , d)
            except psycopg2.IntegrityError as e:
                print('=== エラー　一意性制約違反===')
                print( 'type:' + str(type(e)))
                print( 'args:' + str(e.args))
                print( ':' + str(e))
                con.commit()
                con.close()
                con, cursor = self.cursor()
                if cursor is None:
                    return
            except Exception as e:
                self.debug(e)
                continue
        con.commit()
        con.close()
        pass
    
    def debug(self, e):
        print('=== エラー　その他===')
        print( 'type:' + str(type(e)))
        print( 'args:' + str(e.args))
        print( 'e:' + str(e))
        pass
    
    def fetch(self, table, where = None):
        con = self.connect()
        if con is None:
            return []
        
        cursor = con.cursor()
        try:
            s = 'SELECT * FROM ' + table.name 
            if where is not None:
                keys = list(where.keys())
                if len(keys) != 1:
                    return None
                key = keys[0]
                s += ' WHERE ' + key + '="' + where[key] + '"' 
            cursor.execute(s)
            value = cursor.fetchall()
            con.commit()
            con.close()
            return value
        except:
            return []
        
    def fetchAll(self, table, asc_order_column):
        con = self.connect()
        if con is None:
            return None
        cursor = con.cursor()
        try:
            s = 'SELECT * FROM ' + table.name
            if asc_order_column is not None:
                s += ' ORDER BY ' + asc_order_column + ' ASC'
            cursor.execute(s)
            values = cursor.fetchall()
            con.commit()
            con.close()
            out = []
            for value in values:
                d = []
                for v in value:
                    d.append(v)
                out.append(d)
            return out
        except:
            con.close()
            return None

    def values2dic(self, table, values):
        dic = {}
        for i in range(len(table.columns)):
            column = table.columns[i]
            d = []
            for v in values:
                d.append(v[i])
            if table.typeOf(column) == 'date':
                dic[column] = time_str2py_time(d)
            else:
                dic[column] = d
        return dic
        
def test1():
    brand = 'Data'
    table_name = 'test_1min'
    df = pd.read_csv('Data.csv')
    df1 = df[COLUMNS]
    values = list(df1.values)
    
    data_struct = {'time': 'timestamp', 'open':'real', 'high':'real', 'low':'real', 'close':'real', 'volume':'integer'}
    data_table = Structure(table_name, 'time', data_struct)
    db = Postgres()
    db.create(data_table)
    db.insert(data_table, values)
    values = db.fetchAll(data_table, 'time')
    dic = db.values2dic(data_table, values)
    print(dic)
    

def test2():
    brand = 'Data'
    table = ManageTable('manage')
    db = Postgres()
    db.create(table)
    t0 = Market.DTime(2020, 1, 12, 12, 3)
    t1 = Market.DTime(2020, 1, 19, 12, 3)
    db.update(table, ['test_1min', t0, t1])
    
def test3():
    table_name = 'test3'

    
    data_struct = {'time': 'timestamp'}
    data_table = Structure(table_name, 'time', data_struct)
    db = Postgres()
    db.create(data_table)
    #values = [['2020-01-12 12:03:00'], ['2020-01-12 12:05:00']]
    values = [['2020-01-12 12:05:00'], ['2020-01-12 13:00:00']]
    db.insert(data_table, values)
    values = db.fetchAll(data_table, 'time')
    dic = db.values2dic(data_table, values)
    print(dic)
    
    
def test4():
    table_name = 'test_1min'
    data_struct = {'time': 'timestamp', 'open':'real', 'high':'real', 'low':'real', 'close':'real', 'volume':'integer'}
    data_table = Structure(table_name, 'time', data_struct)
    db = Postgres()
    values = db.fetchAll(data_table, 'time')
    print(values)
    
if __name__ == '__main__':
    test2()        
