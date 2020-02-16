# -*- coding: utf-8 -*-

import numpy as np

import Market
import SQLite



class PriceDB:
    
    def __init__(self, file_path, name):
        self.name = name
        self.file_path = file_path
        
