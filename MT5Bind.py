# -*- coding: utf-8 -*-

import pandas as pd
import MetaTrader5 as MT5
import datetime 
from pytz import timezone 

zone = timezone('UTC') 

def DeltaDay(days):
    return datetime.timedelta(days=days)

def DeltaHour(hours):
    return datetime.timedelta(hours=hours)

def DeltaMinute(minutes):
    return datetime.timedelta(minutes=minutes)


def DTime(year, month, day, hour, minute):
    ja = timezone('Asia/Tokyo')
    return datetime.datetime(year, month, day, hour, minute, tzinfo=ja)

def now():
    t = datetime.datetime.now()
    return DTime(t.year, t.month, t.day, t.hour, t.minute)

def local2xm(time): 
    return time + DeltaHour(3)

def xm2local(time):
    return time + DeltaHour(7)
    
def UTCTime(year, month, day, hour, minute):
    delta = datetime.datetime.utcnow() - datetime.datetime.now()
    t = DTime(year, month, day, hour, minute)
    return t + delta



class pyMt5:
    def __init__(self, brand):
        self.brand = brand
        MT5.MT5Initialize() 
        MT5.MT5WaitForTerminal() 
        self.info = MT5.MT5TerminalInfo()
        pass
    
    #def __del__(self):
    #    MT5.MT5Shutdown()
    #    pass
     
    def close(self):
        MT5.MT5Shutdown()
        pass        
    
    def mt5Version(self):
        return MT5.MT5Version()


    def getTicks(self, time, size):
        ticks = MT5.MT5CopyTicksFrom(self.brand, time, size, MT5.MT5_COPY_TICKS_ALL) 
        data = []
        for tick in ticks:
            t = tick.time
            bid = tick.bid
            ask = tick.ask
            data.append([t, bid, ask])
        return data
    
   
    def get1Hour(self, time, size):
        data = MT5.MT5CopyRatesFrom(self.brand, MT5.MT5_TIMEFRAME_H1, time, size) 
        return data
    
    def get1Min(self, time, size):
        
        data = MT5.MT5CopyRatesFrom(self.brand, MT5.MT5_TIMEFRAME_M1, time, size) 
        out = []
        for d in data:
            t = xm2local(d.time)
            out.append([t, d.open, d.high, d.low, d.close, d.tick_volume, d.spread])
        return out

def scrape(market, year, interval, unit):
    mt5 = pyMt5(market)
    out = []
    for m in range(1, 13):
        for d in range(1, 32):
            try:
                t = DTime(year, m, d, 0, 0)
            except:
                continue
            data = mt5.get1Min(local2xm(t), 60 * 24)
            print(t)
            if len(data) > 0:
                out += data
    mt5.close()
    df = pd.DataFrame(data = out, columns=['Time', 'Open', 'High', 'Low', 'Close', 'Volume', 'Spread'])
    df.to_csv(market + '.csv', index=False)
    pass
    
def scrapeTicks(market, year, month, day, hours, minutes):
    mt5 = pyMt5(market)
    out = []
    try:
        t = DTime(year, month, day, hours, minutes)
    except:
        print('Error')
        return
    
    data = mt5.getTicks(t, 60 * 60 * 1000)
    print(t)
    if len(data) > 0:
        out += data
    mt5.close()
    df = pd.DataFrame(data = out, columns=['Time', 'Bid', 'Ask'])
    df.to_csv(market + '_' + str(year) +'-' + str(month) + '-' + str(day) + '.csv', index=False)
    pass
    

def test1():
    mt5 = pyMt5('US30Cash')
    t = local2xm(now())
    data = mt5.get1Min(t, 60 * 24)
    print('T=', t)
    
    for d in data:
        print(d)
    print('n=', len(data))
    mt5.close()    
    
    
def test2():
    t = now()
    print('t', t)
    t1 = local2utc(t)
    print('t1:', t1)
    
if __name__ == "__main__":
    scrapeTicks('US30Cash', 2019, 1, 31, 20, 0)
