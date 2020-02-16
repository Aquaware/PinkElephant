//+------------------------------------------------------------------+
//|                                                   zigzagStep.mq5 |
//|                                                        Ikuo Kudo |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Ikuo Kudo"
#property link      "https://www.mql5.com"
#property version   "1.00"
#property indicator_chart_window
#property indicator_buffers 4
#property indicator_plots   2
//--- plot ZigZag
#property indicator_label1  "ZigZag"
#property indicator_type1   DRAW_COLOR_SECTION
#property indicator_color1  clrRed
#property indicator_style1  STYLE_SOLID
#property indicator_width1  1
//--- plot HighLow
#property indicator_label2  "HighLow"
#property indicator_type2   DRAW_COLOR_ARROW
#property indicator_color2  clrRed
#property indicator_style2  STYLE_SOLID
#property indicator_width2  1
//--- indicator buffers
double         ZigZagBuffer[];
double         ZigZagColors[];
double         HighLowBuffer[];
double         HighLowColors[];
//+------------------------------------------------------------------+
//| Custom indicator initialization function                         |
//+------------------------------------------------------------------+
int OnInit()
  {
//--- indicator buffers mapping
   SetIndexBuffer(0,ZigZagBuffer,INDICATOR_DATA);
   SetIndexBuffer(1,ZigZagColors,INDICATOR_COLOR_INDEX);
   SetIndexBuffer(2,HighLowBuffer,INDICATOR_DATA);
   SetIndexBuffer(3,HighLowColors,INDICATOR_COLOR_INDEX);
//--- setting a code from the Wingdings charset as the property of PLOT_ARROW
   PlotIndexSetInteger(1,PLOT_ARROW,159);
   
//---
   return(INIT_SUCCEEDED);
  }
//+------------------------------------------------------------------+
//| Custom indicator iteration function                              |
//+------------------------------------------------------------------+
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
  {
//---
   
//--- return value of prev_calculated for next call
   return(rates_total);
  }
//+------------------------------------------------------------------+
