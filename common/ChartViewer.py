# -*- coding: utf-8 -*-
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '../XM'))

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from matplotlib.lines import Line2D
from matplotlib.patches import Rectangle
from matplotlib.transforms import Affine2D
import matplotlib.dates as mdates
from datetime import datetime 

import matplotlib.animation as animation

from CalendarTime import DTime, DeltaDay, DeltaHour, DeltaMinute, Today, Now
from MT5Bind import MT5Bind

DATE_FORMAT_TIME = '%H:%M'
DATE_FORMAT_DAY = '%m-%d'
DATE_FORMAT_DAY_TIME = '%m-%d %H:%M'


    
# -----
    
class ChartViewer(animation.TimedAnimation):

    def __init__(self, fig, ax, timeseries, timeframe):
        self.fix = fig
        self.ax = ax
        self.stock_data = timeseries
        n = timeseries.length
        self.timeframe = timeframe

        self.graphic_objects = []
        for i in range(timeseries.length):
            obj = CandleGraphic()
            ax.add_line(obj.line_lower)
            ax.add_line(obj.line_upper)
            self.graphic_objects.append(obj)
        animation.TimedAnimation.__init__(self, fig, interval=200, blit=True)

    # --- override ---
    def _draw_frame(self, framedata):
        i = framedata - 1
        if i >= 0 and i < len(self.graphic_objects):
            obj = self.graphic_objects[i]
            obj.setData(self.stock_data.time[i], self.stock_data.values[i])
        pass

    def new_frame_seq(self):
        return iter(range(self.stock_data.length))

    def _init_draw(self):
        for obj in self.graphic_objects:
            obj.line_lower.set_data([], [])
    # -----
        
    def awarePytime2naive(self, time):
       naive = datetime(time.year, time.month, time.day, time.hour, time.minute, time.second)
       return naive

    def awarePyTime2Float(self, time):
        naive = self.awarePytime2naive(time)
        t = mdates.date2num([naive])
        return t[0]

    def awarePyTimeList2Float(self, aware_pytime_list):
        naives = []
        for time in aware_pytime_list:
            naive = self.awarePytime2naive(time)
            naives.append(naive)
        return mdates.date2num(naives)

#-----------
    
def test():
    stock = 'US500Cash'
    server = MT5Bind(stock)
    data = server.scrape('M5', 150)
    d = server.toTimeSeries(data)
    
    fig = plt.figure(figsize=(12, 8))
    ax = fig.add_subplot(1, 1, 1)
    view = ChartViewer(fig, ax, d, 'M5')

    
    
if __name__ == '__main__':
    test()


