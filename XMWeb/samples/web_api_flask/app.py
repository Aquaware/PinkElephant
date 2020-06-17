# -*- coding: utf-8 -*-
import os
import sys
sys.path.append('../../../XM')
sys.path.append('../../../common')
sys.path.append('../../../private')

from flask import Flask, flash, redirect, render_template, request
from flask import session, abort, send_from_directory, send_file, jsonify
import pandas as pd
import json

from MT5Bind import MT5Bind


app= Flask(__name__)
app.config['JSON_AS_ASCII'] = False
app.config["JSON_SORT_KEYS"] = False

class Request():
    stock = 'US30Cash'
    timeframe = 'H1'
    data_length = 10
    data_dic = None
    
req= Request()

@app.route("/", methods=["GET","POST"])
def homepage():
    stock = request.form.get('stock_field','US30Cash')
    req.stock = stock
    timeframe = request.form.get('timeframe_field', 'M5')
    req.timeframe = timeframe
    downloadData()
    return render_template("index.html", StockName=stock, Timeframe=timeframe, Data=returnStockData())

@app.route("/get-data", methods=["GET","POST"])
def returnStockData():
    j = json.dumps(req.data_dic)
    print(j)
    return jsonify(j)

def downloadData():
    server = MT5Bind(req.stock)
    dic = server.scrapeWithDic(req.timeframe, req.data_length)
    req.data_dic = dic
    #print(dic)
    pass
    
if __name__ == "__main__":
    app.run(debug=True)



