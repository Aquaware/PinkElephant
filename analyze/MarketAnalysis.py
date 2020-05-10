# -*- coding: utf-8 -*-
import sys
sys.path.append("../common")
sys.path.append("../private")
sys.path.append("../XM")
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
#plt.style.use('seaborn-whitegrid')
from matplotlib.gridspec import GridSpec, GridSpecFromSubplotSpec

from CandleChart import CandleChart
from Graph import Graph
import Filters
from CalendarTime import DTime, DeltaDay, DeltaHour
from XMDb import XMDb
from TimeSeries import TimeSeries


class MarketAnalysis:
    
    def __init__(self, market, time_series):
        self.market = market
        self.time_series = time_series
        self.time = time_series.time
        return

    def plotAday(self, date):
        end_date = date + DeltaDay(2)
        time_series = self.time_series.timeRangeFilter(date, end_date)

        time = time_series.time
        ohlcv = time_series.values
        ohlcv_array = time_series.array
        ohlc_array = ohlcv_array[:, 0:4]
        minmax = np.max(ohlc_array) - np.min(ohlc_array)

        # Runaway
        runway_flag, runways, runway_labels = Filters.detectRunway(ohlc_array, 3)
                
        # Thrust 
        thrust_flag, thrusts, thrust_labels = Filters.detectThrust(ohlc_array, 15)
        thrust_vector = np.zeros(len(ohlcv))
        integ = np.zeros(len(ohlcv))
        for thrust in thrusts:
            state = thrust[0]
            index = thrust[1]
            v = thrust[2]
            thrust_vector[index] = v
            integ = Filters.integration(thrust_vector)
                
        width = len(ohlcv) / 10
        height = minmax / 50
                
        fig1 = plt.figure(figsize=(width, height))
        ratio = 1 / minmax * 100 * (np.max(integ) - np.min(integ)) / 100
        if ratio < 0.2:
            ratio = 0.2
        grid = GridSpec(nrows=2, ncols=1, height_ratios=[1, ratio])
        grid1 = GridSpecFromSubplotSpec(nrows=1, ncols=1, subplot_spec=grid[0, 0])
        ax1 = fig1.add_subplot(grid1[:, :])
                
        graph1 = CandleChart(ax1, time)
        graph1.setTitle(date.strftime('%Y/%m/%d %A'), '', self.market)
        graph1.plotOHLC(ohlc_array, bar_width = 0.4)
        prop1 = {'status': Filters.UP, 'label': runway_labels[0], 'marker':'^', 'color':'orange', 'alpha':0.4, 'size':70}
        prop2 = {'status': Filters.DOWN, 'label': runway_labels[1],'marker':'v', 'color':'green', 'alpha':0.4, 'size':70}
        graph1.markingWithFlag(ohlc_array, runway_flag, [prop1, prop2])
        prop3 = {'status': Filters.UP, 'label': thrust_labels[0], 'marker':'o', 'color':'magenta', 'alpha':0.5, 'size':40}
        prop4 = {'status': Filters.DOWN, 'label': thrust_labels[1],'marker':'o', 'color':'cyan', 'alpha':0.5, 'size':40}
        graph1.markingWithFlag(ohlc_array[:, 3], thrust_flag, [prop3, prop4])            
        graph1.drawLegend(None, [prop1, prop2, prop3, prop4])
            
        passed = self.time_series.timeRangeFilter(end_date - DeltaDay(30) , end_date)
        prices = Filters.peakPrices(passed.array[:,0:4], 10, 20, np.min(ohlc_array), np.max(ohlc_array))
        graph1.hline(prices, ['green'], 1)      
                
        grid2 = GridSpecFromSubplotSpec(nrows=1, ncols=1, subplot_spec=grid[1, 0])
        ax2 = fig1.add_subplot(grid2[:, :])
                
        graph2 = Graph(ax2)
        graph2.setDateFormat()
        graph2.plot(time, integ, {'color':'red', 'style': 'solid', 'width':2})
        for runaway in runways:
            direction = runways[0]
            index = runways[1]
            value = runways[2]
            graph2.point([time[index], value], 'blue', 0.7, 50)
        pass

    def jump(self, market, year, months, hour, threshold):
        begin = market.beginTime()
        end = market.endTime()
        for month in months:
            for day in range(1, 32):
                try:
                    date = DTime(year, month, day, hour, 0)
                except:
                    continue
                end_date = date + DeltaDay(1)
                m = market.timeRangeFilter(date, end_date)
                if m.length() > 0:
                    jump_up = []
                    jump_down = []
                    for t, o, h, l, c in m.tohlcList():
                        if (c - o) >= threshold:
                            jump_up.append(t)
                        if (c - o) <= - threshold:
                            jump_down.append(t)
                        
                    if len(jump_up) == 0 and len(jump_down) == 0:
                        continue
                               
                    m2 = market.timeRangeFilter(date, date + DeltaDay(3))
                    if m2.length() > 0:
                        ohlc = m2.ohlcArray()
                        minmax = np.max(ohlc) - np.min(ohlc)
                        width = len(ohlc) / 15 / 4
                        height = minmax / 50 / 8
                        fig1 = plt.figure(figsize=(width, height))
                        ax1 = fig1.add_subplot(1, 1, 1)
                    
                        graph1 = CandleChart.CandleChart(ax1, m2.pytime())
                        graph1.setTitle(date.strftime('%Y/%m/%d %A'), '', market.name)
                        graph1.plotOHLC(ohlc, bar_width = 0.2)

                        graph1.markingWithTime(ohlc[:, 3], jump_up, 'magenta', 0.5, 100)
                        graph1.markingWithTime(ohlc[:, 3], jump_down, 'cyan', 0.5, 100)
                        graph1.drawLegend(None, [['JumpUp(' + str(threshold) + ')', 'magenta', 'o', 5], ['JumpDown(' + str(threshold) + ')', 'cyan', 'o', 5]])



def test():
    name = 'US30Cash'
    timeframe = 'M5'
    db = XMDb()
    t1 = DTime(2020, 1, 1, 0, 0)
    t2= DTime(2020, 5, 9, 7, 0)
    values = db.priceRange(name, timeframe, t1, None)
    
    
    t = DTime(2020, 5, 7, 20, 0)
    ana = MarketAnalysis('DJI 5Min', values)
    ana.plotAday(t)
    #while (t < market.endTime()):
    #    plotAday(market, t.year, t.month, t.day, session)
    #    t += Market.DeltaDay(1)

    
    
if __name__ == '__main__':
    test()