# -*- coding: utf-8 -*-

from CalendarTime import DTime, DeltaHour, DeltaDay, toNaive
import numpy as np


OHLC = ['open', 'high', 'low', 'close'] 
OHLCV = ['open', 'high', 'low', 'close', 'volume'] 

class TimeSeries:
    
    def __init__(self, time, values, names=OHLC):
        self.time = time
        self.values = values
        self.length = len(time)
        self.names = names
        if len(time) != len(values):
            return
        
        if self.length > 0:
            self.size = len(values[0])
        else:
            self.size = 0
            
            
        self.array = None
        
        self.dic = {}
        if self.size != len(names):
            return

        for i in range(len(names)):
            name = names[i]
            v = []
            for value in values:
                v.append(value[i])
            self.dic[name] = v
            
        ary = np.zeros((self.length, self.size))
        for r in range(self.length):
            v = values[r]
            for c in range(self.size):
                ary[r, c] = v[c]
        self.array = ary
        return
        
    
    def timeRangeFilter(self, begin_time, end_time):
        begin_time = toNaive(begin_time)
        end_time = toNaive(end_time)
        
        time = []
        values = []
        
        if begin_time is None:
            begin_time = self.time[0]
        if end_time is None:
            end_time = self.time[-1]
        
        for i in range(self.length):
            if self.time[i] >= begin_time and self.time[i] <= end_time:
                time.append(self.time[i])
                values.append(self.values[i])
        return TimeSeries(time, values, names=self.names)
        
    def indexOfTime(self, time):
        for i in range(self.length):
            if self.time[i] >= time:
                return i
        return -1
    
    def indexRangeFilter(self, i_begin, i_end):
        if i_begin > i_end:
            tmp = i_begin
            i_begin = i_end
            i_end = tmp
            
        if i_begin < 0:
            return None
        if i_begin >= self.length:
            return None
        
        time = []
        values = []
        for i in range(i_begin, i_end + 1):
                time.append(self.time[i])
                values.append(self.values[i])
        return TimeSeries(time, values)