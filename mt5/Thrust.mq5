//+------------------------------------------------------------------+
//|                                                      Thrust.mq5 |
//|                                                        Ikuo Kudo |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Ikuo Kudo"
#property link      "https://www.mql5.com"
#property version   "1.00"
#property indicator_chart_window


#property indicator_chart_window
#property indicator_buffers 2
#property indicator_plots   1
#property indicator_type1   DRAW_COLOR_ARROW
#property indicator_color1  Cyan, Magenta
#property indicator_width1  5

input int  CountBars = 0; // CountBars - number of bars to count on, 0 = all.
input int  DisplayDistance = 0; // DisplayDistance - the higher it is the the distance from faces to candles.
input bool UseAlerts = true; // Use Alerts
input bool UseEmailAlerts = false; // Use Email Alerts (configure SMTP parameters in Tools->Options->Emails)
input double spreadMin = 5.0;

 
// Indicator buffers
double UpDown[];
double Color[];

//+------------------------------------------------------------------+
//| Custom indicator initialization function                         |
//+------------------------------------------------------------------+
void OnInit()
{
//---- indicator buffers mapping  
   SetIndexBuffer(0, UpDown, INDICATOR_DATA);
   SetIndexBuffer(1, Color, INDICATOR_COLOR_INDEX);
   ArraySetAsSeries(UpDown, false);
   ArraySetAsSeries(Color, false);
   
//---- drawing settings
   PlotIndexSetInteger(0, PLOT_ARROW, 159);
   PlotIndexSetDouble(0, PLOT_EMPTY_VALUE, EMPTY_VALUE);
   PlotIndexSetString(0, PLOT_LABEL, "Pinbar");

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
                const long &tickvolume[],
                const long &volume[],
                const int &spread[])
{

   ArraySetAsSeries(open, false);
   ArraySetAsSeries(high, false);
   ArraySetAsSeries(low, false);
   ArraySetAsSeries(close, false);
   
   int i0 = prev_calculated - 1;
   if(i0 < 0) {
      i0 = 0;
   }
   for (int i = i0; i < rates_total; i++){
      // Prevents bogus indicator arrows from appearing (looks like PlotIndexSetDouble(0, PLOT_EMPTY_VALUE, EMPTY_VALUE); is not enough.)
      UpDown[i] = EMPTY_VALUE;
      
      if (i < 1 ) {
         continue;
      }
      
      // Thrust Down
      if (close[i] < low[i - 1]) {
         double d = close[i] - low[i - 1];
         if (d < -1 * spreadMin) {
              UpDown[i] = close[i] + DisplayDistance * _Point; // - noseLength / 2;
              Color[i] = 0;
              if (i == 1) {
                  // Send alerts only for the latest fully formed bar
                  SendAlert("ThrustDown"); 
              }
         }
      }
      
      // Thrust Up
      if (close[i] > high[i - 1]) {
         double d = close[i] - high[i - 1];
         if (d > spreadMin) {
              UpDown[i] = close[i] - DisplayDistance * _Point; // + noseLength / 2;
              Color[i] = 1;
              if (i == 1) {
                  // Send alerts only for the latest fully formed bar
                  SendAlert("ThrustUp"); 
              }
         }
      }
   }   
   return(rates_total);
}

string TimeframeToString(int P)
{
   switch(P)
   {
      case PERIOD_M1:  return("M1");
      case PERIOD_M2:  return("M2");
      case PERIOD_M3:  return("M3");
      case PERIOD_M4:  return("M4");
      case PERIOD_M5:  return("M5");
      case PERIOD_M6:  return("M6");
      case PERIOD_M10: return("M10");
      case PERIOD_M12: return("M12");
      case PERIOD_M15: return("M15");
      case PERIOD_M20: return("M20");
      case PERIOD_M30: return("M30");
      case PERIOD_H1:  return("H1");
      case PERIOD_H2:  return("H2");
      case PERIOD_H3:  return("H3");
      case PERIOD_H4:  return("H4");
      case PERIOD_H6:  return("H6");
      case PERIOD_H8:  return("H8");
      case PERIOD_H12: return("H12");
      case PERIOD_D1:  return("D1");
      case PERIOD_W1:  return("W1");
      case PERIOD_MN1: return("MN1");
      default:         return(IntegerToString(P));
   }
}

void SendAlert(string direction)
{
   string per = TimeframeToString(_Period);
   if (UseAlerts){
      Alert(direction, _Symbol, " @ ", per);
      PlaySound("alert.wav");
   }
   if (UseEmailAlerts) {
      SendMail(_Symbol + " @ " + per + " - " + direction + " Pinbar", direction + " Pinbar on " + _Symbol + " @ " + per + " as of " + TimeToString(TimeCurrent()));
   }
}