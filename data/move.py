# -*- coding: utf-8 -*-

import glob
import shutil
import os

file_list =  glob.glob("./vix/*/*.csv", recursive=True)

for path in file_list:
    print(path)
    shutil.move(path, './vix/')
