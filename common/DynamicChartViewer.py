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

def awarePytime2naive(time):
    naive = datetime(time.year, time.month, time.day, time.hour, time.minute, time.second)
    return naive

def awarePyTime2Float(time):
    naive = awarePytime2naive(time)
    t = mdates.date2num([naive])
    return t[0]

def awarePyTimeList2Float(aware_pytime_list):
    naives = []
    for time in aware_pytime_list:
        naive = awarePytime2naive(time)
        naives.append(naive)
    return mdates.date2num(naives)
    
class DynamicChartViewer(animation.TimedAnimation):

    def __init__(self, fig, ax, timeseries, timeframe):
        self.config()
        self.fix = fig
        self.ax = ax
        self.stock_data = timeseries
        self.n = timeseries.length
        self.timeframe = timeframe
        self.ohlc = timeseries.values
        self.time = awarePyTimeList2Float(timeseries.time)
        self.ax.set_xlim(self.time[0], self.time[-1])
        self.ax.set_ylim(np.min(self.ohlc), np.max(self.ohlc))
        self.ax.grid()
        self.ax.xaxis_date()
        self.ax.xaxis.set_major_formatter(mdates.DateFormatter('%H:%M'))

        ax.set_xlabel('date')
        self.lines = []
        self.boxes = []
        for i in range(self.n):
            line_upper = Line2D([], [], color='blue', linewidth= self.line_width, antialiased=True)
            line_lower = Line2D([], [], color='blue', linewidth=self.line_width, antialiased=True)
            self.lines.append((line_upper, line_lower))
            ax.add_line(line_upper)
            ax.add_line(line_lower)
            rect = Rectangle((0,0), width=self.box_width, height=0, facecolor='blue', edgecolor='blue')
            ax.add_patch(rect)
            self.boxes.append(rect)
        animation.TimedAnimation.__init__(self, fig, interval=200, blit=True)
        return

    def config(self):
        self.box_width = 0.002
        self.alpha = 1.0
        self.color_positive = 'pink'
        self.color_negative = 'cyan'
        self.box_line_color_positive = 'red'
        self.box_line_color_negative = 'blue'
        self.line_width = 1
        return

    def candleValue(self, index):
        t = self.time[index]
        ohlc = self.ohlc[index]
        open = ohlc[0]
        high = ohlc[1]
        low = ohlc[2]
        close = ohlc[3]
        if close >= open:
            color = self.color_positive
            line_color = self.box_line_color_positive
            box_low = open
            box_high = close
            height = close - open
        else:
            color = self.color_negative
            line_color = self.box_line_color_negative
            box_low = close
            box_high = open
            height = open - close
        return (t, color, line_color, low, high, box_low, box_high, height)

    # --- override ---
    def _init_draw(self):
        for i in range(self.n):
            (t, color, line_color, low, high, box_low, box_high, height) = self.candleValue(i)
            line_upper, line_lower = self.lines[i]
            line_upper.set_data([(t, t)], [(box_high, high)])
            line_lower.set_data([(t, t)], [(box_low, low)])
            line_upper.set_color(line_color)
            line_lower.set_color(line_color)

            box = self.boxes[i]
            box.set_xy((t - self.box_width / 2, box_low))
            box.set_height(height)
            box.set_color(color)
            box.set_edgecolor(line_color)
        return

    def _draw_frame(self, framedata):
        (t, color, line_color, low, high, box_low, box_high, height) = self.candleValue(framedata)
        line_upper, line_lower = self.lines[framedata]
        line_upper.set_data([(t, t)],[(box_high, high)])
        line_lower.set_data([(t, t)],[(box_low, low)])
        line_upper.set_color(line_color)
        line_lower.set_color(line_color)

        box = self.boxes[framedata]
        box.set_color(color)
        box.set_edgecolor(line_color)
        objects = []
        for line in self.lines:
            objects.append(line[0])
            objects.append(line[1])
        for rect in self.boxes:
            objects.append(rect)
        self._drawn_artists = objects

    def new_frame_seq(self):
        return iter(range(len(self.time)))


#-----------
    
def test():
    stock = 'US500Cash'
    server = MT5Bind(stock)
    data = server.scrape('M5', 150)
    d = server.toTimeSeries(data)
    
    fig = plt.figure(figsize=(12, 8))
    ax = fig.add_subplot(1, 1, 1)
    view = DynamicChartViewer(fig, ax, d, 'M5')
    plt.show()

    
    
if __name__ == '__main__':
    test()


