# -*- coding: utf-8 -*-

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
#plt.style.use('seaborn-whitegrid')
from matplotlib.gridspec import GridSpec, GridSpecFromSubplotSpec

import Market
import CandleChart
import Graph
import Filters


def plotAday(market, year, month, day, session_time):
    day_time = session_time['day']
    night_time = session_time['night']
    report = []
    date = Market.DTime(year, month, day, day_time[0], 0)
    end_date = date + Market.DeltaDay(1)
    data = market.timeRangeFilter(date, end_date)
    #tohlc = data.tohlc()
    time = data.pytime()
    ohlc = data.ohlcArray()
    size = len(ohlc)
    if size == 0 or date.weekday() > 5:
        return
    

    minmax = np.max(ohlc) - np.min(ohlc)

    # Runaway
    runway_flag, runways, runway_labels = Filters.detectRunway(ohlc, 3)
                
    # Thrust 
    thrust_flag, thrusts, thrust_labels = Filters.detectThrust(ohlc, 15)
    thrust_vector = np.zeros(size)
    integ = np.zeros(size)
    for thrust in thrusts:
        state = thrust[0]
        index = thrust[1]
        v = thrust[2]
        thrust_vector[index] = v
        integ = Filters.integration(thrust_vector)
                
    width = size / 10
    height = minmax / 50
                
    fig1 = plt.figure(figsize=(width, height))
    ratio = 1 / minmax * 100 * (np.max(integ) - np.min(integ)) / 100
    if ratio < 0.2:
        ratio = 0.2
    grid = GridSpec(nrows=2, ncols=1, height_ratios=[1, ratio])
    grid1 = GridSpecFromSubplotSpec(nrows=1, ncols=1, subplot_spec=grid[0, 0])
    ax1 = fig1.add_subplot(grid1[:, :])
                
    graph1 = CandleChart.CandleChart(ax1, time)
    graph1.setTitle(date.strftime('%Y/%m/%d %A'), '', market.name)
    graph1.plotOHLC(ohlc, bar_width = 0.4)
    prop1 = {'status': Filters.UP, 'label': runway_labels[0], 'marker':'^', 'color':'orange', 'alpha':0.4, 'size':70}
    prop2 = {'status': Filters.DOWN, 'label': runway_labels[1],'marker':'v', 'color':'green', 'alpha':0.4, 'size':70}
    graph1.markingWithFlag(ohlc[:, 3], runway_flag, [prop1, prop2])
    prop3 = {'status': Filters.UP, 'label': thrust_labels[0], 'marker':'o', 'color':'magenta', 'alpha':0.5, 'size':40}
    prop4 = {'status': Filters.DOWN, 'label': thrust_labels[1],'marker':'o', 'color':'cyan', 'alpha':0.5, 'size':40}
    graph1.markingWithFlag(ohlc[:, 3], thrust_flag, [prop3, prop4])
                
    graph1.drawLegend(None, [prop1, prop2, prop3, prop4])
    
    peak_prices, prices = extremePrices(market, date - Market.DeltaDay(30 * 3), date, day_time[0])
    for value in prices:
        t = value[0]
        if t <= end_date and t >= (end_date - Market.DeltaDay(30 * 6)):
            prices = value[1]
            for price in prices:
                if price >= np.min(ohlc) and price <= np.max(ohlc):
                    graph1.hline([price], ['green'], 1)      
                
        grid2 = GridSpecFromSubplotSpec(nrows=1, ncols=1, subplot_spec=grid[1, 0])
        ax2 = fig1.add_subplot(grid2[:, :])
                
        graph2 = Graph.Graph(ax2)
        graph2.setDateFormat()
        graph2.plot(time, integ, {'color':'red', 'style': 'solid', 'width':2})
        for runaway in runways:
            direction = runways[0]
            index = runways[1]
            value = runways[2]
            graph2.point([time[index], value], 'blue', 0.7, 50)
                
                                
        report.append([date, end_date, ohlc[0, 0], ohlc[-1, 3], np.max(ohlc[:, 1]), np.min(ohlc[:, 2])] )
        # -----                
           
    r = pd.DataFrame(data = report, columns=['Begin', 'End', 'Open', 'Close', 'High', 'Close'])
    r.to_excel('./report_' + market.name + '_' + str(year) + '.xlsx', index=False)
    pass

def plotByDay(market, peak_prices, year, months, hour):
    
    report = []
    for month in months:
        for day in range(1, 32):
            try:
                date = Market.DTime(year, month, day, hour, 0)
            except:
                continue
            end_date = date + Market.DeltaHour(16)
            data = market.timeRangeFilter(date, end_date)
            #tohlc = data.tohlc()
            time = data.pytime()
            ohlc = data.ohlcArray()
            size = len(ohlc)
            if size > 0 and date.weekday() < 5:
                minmax = np.max(ohlc) - np.min(ohlc)
                # Runaway
                runaway_flag, runaways, runaway_labels = Filters.detectRunway(ohlc, 3)
                
                # Thrust 
                thrust_flag, thrusts, thrust_labels = Filters.detectThrust(ohlc, 15)
                thrust_vector = np.zeros(size)
                for thrust in thrusts:
                    state = thrust[0]
                    index = thrust[1]
                    v = thrust[2]
                    thrust_vector[index] = v
                integ = Filters.integration(thrust_vector)
                
                width = size / 10
                height = minmax / 50
                
                fig1 = plt.figure(figsize=(width, height))
                ratio = 1 / minmax * 100 * (np.max(integ) - np.min(integ)) / 100
                if ratio < 0.2:
                    ratio = 0.2
                grid = GridSpec(nrows=2, ncols=1, height_ratios=[1, ratio])
                grid1 = GridSpecFromSubplotSpec(nrows=1, ncols=1, subplot_spec=grid[0, 0])
                ax1 = fig1.add_subplot(grid1[:, :])
                
                graph1 = CandleChart.CandleChart(ax1, time)
                graph1.setTitle(date.strftime('%Y/%m/%d %A'), '', market.name)
                graph1.plotOHLC(ohlc, bar_width = 0.4)
                prop1 = {'status': Filters.UP, 'label': runaway_labels[0], 'marker':'s', 'color':'orange', 'alpha':0.5, 'size':120}
                prop2 = {'status': Filters.DOWN, 'label': runaway_labels[1],'marker':'s', 'color':'green', 'alpha':0.5, 'size':120}
                graph1.markingWithFlag(ohlc[:, 3], runaway_flag, [prop1, prop2])
                prop3 = {'status': Filters.UP, 'label': thrust_labels[0], 'marker':'o', 'color':'magenta', 'alpha':0.5, 'size':40}
                prop4 = {'status': Filters.DOWN, 'label': thrust_labels[1],'marker':'o', 'color':'cyan', 'alpha':0.5, 'size':40}
                graph1.markingWithFlag(ohlc[:, 3], thrust_flag, [prop3, prop4])
                
                graph1.drawLegend(None, [prop1, prop2, prop3, prop4])
                for value in peak_prices:
                    t = value[0]
                    if t <= end_date and t >= (end_date - Market.DeltaDay(30 * 6)):
                        prices = value[1]
                        for price in prices:
                            if price >= np.min(ohlc) and price <= np.max(ohlc):
                                graph1.hline([price], ['green'], 1)      
                
                grid2 = GridSpecFromSubplotSpec(nrows=1, ncols=1, subplot_spec=grid[1, 0])
                ax2 = fig1.add_subplot(grid2[:, :])
                
                graph2 = Graph.Graph(ax2)
                graph2.setDateFormat()
                graph2.plot(time, integ, {'color':'red', 'style': 'solid', 'width':2})
                for runaway in runaways:
                    direction = runaway[0]
                    index = runaway[1]
                    value = runaway[2]
                    graph2.point([time[index], value], 'blue', 0.7, 50)
                
                                
                report.append([date, end_date, ohlc[0, 0], ohlc[-1, 3], np.max(ohlc[:, 1]), np.min(ohlc[:, 2])] )
                # -----                
           
        r = pd.DataFrame(data = report, columns=['Begin', 'End', 'Open', 'Close', 'High', 'Close'])
        r.to_excel('./report_' + market.name + '_' + str(year) + '.xlsx', index=False)
    pass
                
                
def extremePrices(market, begin, end, base_hour):
    if begin is None:
        begin = market.beginTime()
    if end is None:
        end = market.endTime()
    t = Market.DTime(begin.year, begin.month, begin.day, base_hour, 0)
    peak_prices = []
    prices = []
    while (t < end):
        m = market.timeRangeFilter(t, t + Market.DeltaDay(7))
        values = Filters.peakPrices(m.ohlcArray(), 20)
        prices.append([t, values])
        for value in values:
            peak_prices.append(value)
        t += Market.DeltaDay(7)
    return (peak_prices, prices)    


def jump(market, year, months, hour, threshold):
    begin = market.beginTime()
    end = market.endTime()
    for month in months:
        for day in range(1, 32):
            try:
                date = Market.DTime(year, month, day, hour, 0)
            except:
                continue
            end_date = date + Market.DeltaDay(1)
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
                               
                m2 = market.timeRangeFilter(date, date + Market.DeltaDay(3))
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

    
if __name__ == '__main__':
    brand = 'us30'
    market = Market.Market(brand, 5, Market.UNIT_MINUTE, False)
    market.importFromSQLite('./data/click_sec/' + brand + '_5min.db', brand)
    print('Imported data size ...', len(market.df), 'From ', market.beginTime(), ' To: ', market.endTime())
    session = {'day':[23, 6], 'night':[8, 23]}
    
    t = Market.DTime(2019, 12, 1, 0, 0)
    while (t < market.endTime()):
        plotAday(market, t.year, t.month, t.day, session)
        t += Market.DeltaDay(1)
    #plotByDay(market, prices, 2020, [1], 8)
    #jump(market, 2019, np.arange(1, 13), 18, 100.0)