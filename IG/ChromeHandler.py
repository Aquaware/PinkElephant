#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jun 19 21:58:49 2018

@author: iku
"""
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
import time
import logging
from logging import getLogger, StreamHandler, Formatter

ChromePath = './chromedriver'
WaitTimeSec = 0.5


class ChromeHandler:
    
    def __init__(self):
        self.driver = webdriver.Chrome(executable_path=ChromePath)
        self.driver.implicitly_wait(WaitTimeSec)
        self.isOpen = False
        return
    
    def connect(self, urlString):
        self.driver.get(urlString)
        self.isOpen = True
        return
    
    def findElementByClassName(self, className):
        try:
            return self.driver.find_element_by_class_name(className)
        except:
            return None
        
    def findElementsByClassName(self, className):
        try:
            return self.driver.find_elements_by_class_name(className)
        except:
            None
    
    def clickByLinkText(self, text):
        try:
            self.driver.find_element_by_partial_link_text(text).click()
            return True
        except:
            return False

    def switchTabByTitle(self, title):
        found = False
        try:
            for window in self.driver.window_handles:
                self.driver.switch_to.window(window)
                if self.driver.title == title:
                    found= True
                    break
            return found
        except:
            return False
        
    def html(self):
        try:
            return self.driver.page_source
        except:
            return None
        
    def inputElementById(self, elementId, text):
        try:
            element = self.driver.find_element_by_id(elementId)
            element.send_keys(text)
            return True
        except:
            return False
        
    def inputElementByName(self, elementName, text):
        try:
            element = self.driver.find_element_by_name(elementName)
            element.send_keys(text)
            return True
        except:
            return False
    
    def inputElementByClass(self, className, index, text):
        try:
            elements = self.driver.find_elements_by_class_name(className)
            if len(elements) > index:
                element = elements[index]
                element.clear()
                element.send_keys(text)
            return True
        except:
            return False
    
    def getTextById(self, elementId):
        try:
            element = self.driver.find_element_by_id(elementId)
            return element.text
        except:
            return None
        
    def getTextByName(self, elementName):
        try:
            element = self.driver.find_element_by_name(elementName)
            return element.text
        except:
            return None
        
    def getTextsByClass(self, className):
        try:
            elements = self.driver.find_elements_by_class_name(className)
            out = []
            for e in elements:
                out.append(e.text)
            return out
        except:
            return []
        
    def setSelectOptionByClass(self, className, value):
        try:
            element = self.driver.find_element_by_class_name(className)
            sel = Select(element)
            sel.select_by_value(value)
            return True
        except:
            return False
        
        
    def getSelectOptionsByClass(self, className):
        try:
            element = self.driver.find_element_by_class_name(className)
            select = Select(element)
            options = select.options
            out = []
            for option in options:
                out.append(option.text)
            return out
        except:
            return []
    
    def clickButtonByName(self, elementName):
        try:
            button = self.driver.find_element_by_name(elementName)
            button.click()
            return True
        except:
            return False
    
    def clickButtonById(self, elementId):
        try:
            button = self.driver.find_element_by_id(elementId)
            button.click()
            return True
        except:
            return False
    
    def clickButtonByClass(self, className):
        try:
            button = self.driver.find_element_by_class_name(className)
            button.click()
            return True
        except:
            return False
    
    def clickButtonWithIndexByClass(self, index, className):
        try:
            buttons = self.driver.find_elements_by_class_name(className)
            if len(buttons) > index:
                buttons[index].click()
            return True
        except:
            return False
    
    
    def linkByText(self, text):
        try:
            element = self.driver.find_element_by_link_text(text)
            element.click()
            return True
        except:
            return False
        
    def linkByClassName(self, className):
        try:
            element = self.driver.find_element_by_class_name(className)
            element.click()
            return True
        except:
            return False
    
    def linksByClassName(self, className, index):
        try:
            elements = self.driver.find_elements_by_class_name(className)
            if len(elements) > index:
                elements[index].click()
            return len(elements)
        except:
            return 0
    
    
    def selectListByName(self, elementName, value):
        try:
            element = self.driver.find_element_by_name(elementName)
            dropdown = Select(element)
            dropdown.select_by_value(value)
            return True
        except:
            return False
        
    def close(self):
        if self.isOpen:
            self.driver.close()
            self.isOpen = False
        return
    
    def screenShot(self, filepath):
        self.driver.save_screenshot(filepath)
        return

    def executeJS(self, script, args):
        try:
            self.driver.execute_script(script, args)
            return True
        except:
            return False
        