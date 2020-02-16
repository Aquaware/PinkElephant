//+------------------------------------------------------------------+
//|                                            ThrustIntegration.mq5 |
//|                                                        Ikuo Kudo |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Ikuo Kudo"
#property link      "https://www.mql5.com"
#property version   "1.00"
#property indicator_separate_window
#property indicator_buffers 2
#property indicator_plots   1

//--- plot ThrustIntegration
#property indicator_label1  "ThrustIntegration"
#property indicator_type1   DRAW_LINE
#property indicator_color1  clrRed
#property indicator_style1  STYLE_SOLID
#property indicator_width1  2

input int  CountBars = 0; // CountBars - number of bars to count on, 0 = all.
input double spreadMin = 5.0;

input int startHour = 0;
input int endHour = 23;

//--- indicator buffers
double ThrustIntegrationBuffer[];
double ThrustBuffer[];

//+------------------------------------------------------------------+
//| Custom indicator initialization function                         |
//+------------------------------------------------------------------+
int OnInit()
  {

   SetIndexBuffer(0,ThrustIntegrationBuffer,INDICATOR_DATA);
   SetIndexBuffer(1,ThrustBuffer,INDICATOR_CALCULATIONS);
   ArraySetAsSeries(ThrustIntegrationBuffer, false);
   ArraySetAsSeries(ThrustBuffer, false);

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
   ArraySetAsSeries(open, false);
   ArraySetAsSeries(high, false);
   ArraySetAsSeries(low, false);
   ArraySetAsSeries(close, false);
   ArraySetAsSeries(time, false);

   ThrustIntegrationBuffer[0] = 0;
   
   int i0 = prev_calculated - 1;
   if(i0 < 0) {
      i0 = 0;
   }
   for (int i = i0; i < rates_total; i++){
      // Prevents bogus indicator arrows from appearing (looks like PlotIndexSetDouble(0, PLOT_EMPTY_VALUE, EMPTY_VALUE); is not enough.)
      ThrustIntegrationBuffer[i] = 0;
      if (i < 1) {
         continue;
      }
      datetime t = time[i];
      MqlDateTime stm;
      TimeToStruct(t, stm);
      int hours =  stm.hour;
      int minutes = stm.min;
      double body = close[i] - open[i];
      double noseLength = high[i] - low[i];
     
      double value = 0.0;
      if (close[i] < low[i - 1]) {
         // Thrust Down
         double d = close[i] - low[i - 1];
         if (d <= -1 * spreadMin) {
            value = body;
         } else {
            value = 0.0;
         }
      }else if (close[i] > high[i - 1]) {
         // Thrust Up
         double d = close[i] - high[i - 1];
         if (d >= spreadMin) {
            value = body;
         } else {
            value = 0.0;
         }
      }
      
      if (endHour > startHour) {
         if (hours == startHour && minutes == 0) {
            ThrustIntegrationBuffer[i] = value;
         } else {
            if (hours >= startHour && hours < endHour ) {
               if (ThrustIntegrationBuffer[i - 1] == EMPTY_VALUE) {
                  ThrustIntegrationBuffer[i] =  value;
               } else {
                  ThrustIntegrationBuffer[i] = ThrustIntegrationBuffer[i - 1] + value;
               }
            } else {
               ThrustIntegrationBuffer[i] = EMPTY_VALUE;
            }
         }
      } else {
         if (hours == startHour && minutes == 0) {
            ThrustIntegrationBuffer[i] = value;
         } else {
            if ((hours >= startHour && hours <= 23) || (hours >= 0 && hours < endHour )) {
               if (ThrustIntegrationBuffer[i - 1] == EMPTY_VALUE) {
                  ThrustIntegrationBuffer[i] =  value;
               } else {
                  ThrustIntegrationBuffer[i] = ThrustIntegrationBuffer[i - 1] + value;
               }
            } else {
               ThrustIntegrationBuffer[i] = EMPTY_VALUE;
            }
         }
      }
   }   
   
 /*  
   ThrustIntegrationBuffer[0] = 0;
   ThrustIntegrationBuffer[1] = 0;
   for (int i = 2; i < NeedBarsCounted; i++){
      // Prevents bogus indicator arrows from appearing (looks like PlotIndexSetDouble(0, PLOT_EMPTY_VALUE, EMPTY_VALUE); is not enough.)
      ThrustIntegrationBuffer[i] = ThrustBuffer[i - 2];
   }
*/   
   return(rates_total);
  }

