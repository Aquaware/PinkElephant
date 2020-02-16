# -*- coding: utf-8 -*-
import datetime


def DTime(year, month, day, hour, minute):
    return datetime.datetime(year, month, day, hour, minute)

def monthList(year):
    month = [  [DTime(year, 1, 1, 0, 0), DTime(year, 1, 31, 23, 59)],
               [DTime(year, 2, 10, 0, 0), DTime(year, 2, 28, 23, 59)],
               [DTime(year, 3, 1, 0, 0), DTime(year, 3, 31, 23, 59)],
               [DTime(year, 4, 1, 0, 0), DTime(year, 4, 30, 23, 59)],
               [DTime(year, 5, 1, 0, 0), DTime(year, 5, 31, 23, 59)],
              [DTime(year, 6, 1, 0, 0), DTime(year, 6, 30, 23, 59)],
              [DTime(year, 7, 1, 0, 0), DTime(year, 7, 31, 23, 59)],
              [DTime(year, 8, 1, 0, 0), DTime(year, 8, 31, 23, 59)],
              [DTime(year, 9, 1, 0, 0), DTime(year, 9, 30, 23, 59)],
              [DTime(year, 10, 1, 0, 0), DTime(year, 10, 31, 23, 59)],
              [DTime(year, 11, 1, 0, 0), DTime(year, 11, 30, 23, 59)],
              [DTime(year, 12, 1, 0, 0), DTime(year, 12, 31, 23, 59)]
             ]
    return month
    