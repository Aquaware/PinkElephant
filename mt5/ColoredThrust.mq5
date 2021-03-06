//+------------------------------------------------------------------+
//|                                                ColoredThrust.mq5 |
//|                                                        Ikuo Kudo |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Ikuo Kudo"
#property link      "https://www.mql5.com"
#property version   "1.00"
#property indicator_chart_window

//--- 指標の設定
#property indicator_chart_window
#property indicator_buffers 5
#property indicator_plots   1

//---- プロット
#property indicator_label1 "ColoredThrust"
#property indicator_type1   DRAW_COLOR_CANDLES
#property indicator_color1 clrLightSteelBlue,clrRed,clrBlue
#property indicator_style1 STYLE_SOLID
#property indicator_width1  1

//--- 定義済み定数
#define INDICATOR_EMPTY_VALUE 0.0

//--- 入力パラメータ
input double spreadMin = 5.0;

//--- 指標バッファ
double CandleOpen[];
double CandleHigh[];
double CandleLow[];
double CandleClose[];
double CandleColor[];


//--- グローバル変数
int fillBegin;
int fillCount;
   
//+------------------------------------------------------------------+
//| 非極値のローソク足に値を入れる                                           |
//+------------------------------------------------------------------+
void FillCandles(int begin, int count, const double &open[], const double &high[], const double &low[], const double &close[]){

  ArrayCopy(CandleOpen, open, begin, begin, count);
  ArrayCopy(CandleHigh, high, begin, begin, count);
  ArrayCopy(CandleLow,  low, begin, begin, count);
  ArrayCopy(CandleClose, close, begin, begin, count);
 }
 
void fillABar(int index, int col, const double& open[], const double &high[], const double& low[], const double& close[]) {
   CandleOpen[index] = open[index];
   CandleHigh[index] = high[index];
   CandleLow[index] = low[index];
   CandleClose[index] = close[index];
   CandleColor[index] = col;
}

//+------------------------------------------------------------------+
//| カスタム指標を初期化する関数                                            |
//+------------------------------------------------------------------+
int OnInit(){
   //--- 指標バッファマッピング
  SetIndexBuffer(0, CandleOpen);
  SetIndexBuffer(1, CandleHigh);
  SetIndexBuffer(2, CandleLow);
  SetIndexBuffer(3 ,CandleClose);
  SetIndexBuffer(4, CandleColor, INDICATOR_COLOR_INDEX);
  
   //--- 値を指定するが表示しない
  PlotIndexSetDouble(0, PLOT_EMPTY_VALUE,INDICATOR_EMPTY_VALUE);
  
   //--- データウィンドウに表示するために指標バッファの名称を指定する
  PlotIndexSetString(0, PLOT_LABEL, "Open;High;Low;Close");

  return(INIT_SUCCEEDED);
 }
 
//+------------------------------------------------------------------+
//| カスタム指標の反復関数                                                |
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
              const int &spread[]) {

   ArraySetAsSeries(open,false);
   ArraySetAsSeries(high,false);
   ArraySetAsSeries(low,false);
   ArraySetAsSeries(close,false);
  
   int i0 = prev_calculated - 1;
   if(i0 < 0) {
      i0 = 0;
   }
   if(i0 == 0) {
      fillBegin = 0;
      fillCount = 0;
    }
   
   for (int i = i0; i < rates_total; i++) {
      CandleOpen[i] = 0;
      CandleHigh[i] = 0;
      CandleLow[i] = 0;
      CandleClose[i] = 0;
      
      if (i < 1) {
         fillCount++;
         continue;
      }
      
      if(isThrustUp(i, open, high, low, close)) {
        //ローソク足を強調表示する
        fillABar(i, 1, open, high, low, close);
        //極値まで他のローソク足を中間色で強調表示する
        FillCandles(fillBegin, fillCount, open, high, low, close);
        fillBegin = i + 1;
        fillCount = 0;
        continue;
      }
       
      if(isThrustDown(i, open, high, low, close)) {
        //ローソク足を強調表示する
        fillABar(i, 2, open, high, low, close);
        //極値まで他のローソク足を中間色で強調表示する
        FillCandles(fillBegin, fillCount, open, high, low, close);
        fillBegin = i + 1;
        fillCount = 0;
        continue;
      }
      fillCount++;
    }

   return(rates_total);
 }

bool isThrustUp(int index, const double& open[], const double& high[], const double& low[], const double& close[]) {
   if (close[index] > high[index - 1]) {
      // Thrust Up
      double d = close[index] - high[index - 1];
      if (d >= spreadMin) {
         return true;
      }
   }
   return false;
}
   
bool isThrustDown(int index, const double& open[], const double& high[], const double& low[], const double& close[]) {
   if (close[index] < low[index - 1]) {
      // Thrust Down
      double d = close[index] - low[index - 1];
      if (d <= -1 * spreadMin) {
         return true;
      }
   }
   return false;
}  