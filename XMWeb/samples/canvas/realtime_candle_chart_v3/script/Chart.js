const MINUTE = 'M';
const HOUR = 'H';
const DAY = 'D';

let margin = {top:100, bottom: 100, left: 100, right: 100};
let canvasSize = {width: 1120, height: 650};

function separate(value) {
    if (value == 0.0) {
        return [0.0, 0.0];
    }
    if (value >= 1.0 && value < 10.0) {
        return [value, 1.0];
    }
    if (value >= 10.0) {
        for (let base = 1; base < 100; base++) {
            let v =  value / Math.pow(10, base);
            if (v < 10.0) {
                return [v, Math.pow(10, base)];
            }
        }
    } else {
        for (let base = 1; base < 100; base++) {
            let v = value * Math.pow(10, base);
            if (v >= 1.0) {
                return [v, 1.0 / Math.pow(10, base)];
            }
        }
    }
    return [0.0, 0.0];
}

function nice(niceNumbers, value) {
    let [mantissa, exponent] = separate(value);
    var dif = []
    for (let num of niceNumbers) {
        dif.push(Math.abs(mantissa - num))
    }
    let index = dif.indexOf(Math.min.apply(null, dif));
    return niceNumbers[index] * exponent;
}

function niceRange(a, b, divide) {
    let niceNumbers = [1.0, 2.0, 2.5, 5.0, 10.0];
    let d = Math.abs((a - b) / divide);
    let division = nice(niceNumbers, d);
    let aa = parseInt(a / division) * division;
    if (aa >= a) {
        aa -= division;
    }
    let bb = parseInt (b / division) * division;
    if (bb <= b) {
        bb += division;
    }
    var array = []
    for (let v = aa; v <= bb; v += division) {
        if (v >= a && v <= b) {
            array.push(v);
        }
    }
    return array;
}

function deltaMinutes(time, minutes) {
    var out = new Date(time.getTime());
    out.setMinute(out.getMinutes() + minutes);
    return out;
}

function deltaHours(time, hours) {
    var out = new Date(time.getTime());
    out.setHours(out.getHours() + hours);
    return out;
}

function deltaDays(time, days) {
    var out = new Date(time.getTime());
    out.setDate(out.getDate() + days);
    return out;
}

function date2Str (date, format) {
    format = format.replace(/yyyy/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
    return format;
}

function round(value, order) {
    return Math.floor(value * Math.pow(10, order ) + 0.5) / Math.pow(10, order);
}

function number2Str(value) {
    const order = 3;
    if (value == 0) {
        return "0";
    }
    if (Number.isInteger(value)) {
        return String(value);
    }
    let v = round(value, order);
    return String(v);
}

function nearest1(value, nears) {
    var dif = [];
    for( let v of nears) {
        dif.push(Math.abs(value - v));
    }
    let index = dif.indexOf(Math.min.apply(null, dif));
    return nears[index];
}

function nearest2(value, begin, delta) {
    var difmin, min;
    for(let v = begin; v < begin + 1000 * delta; v+= delta) {
        dif = Math.abs(value - v);
        if (v == begin) {
            difmin = dif;
            min = v;
        }
        if (dif > difmin) {
            break;
        }
    }
    return min;
}

function roundMinute(time, minutes) {
    var array = [];
    for (let m of minutes) {
        let t = new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), m);
        array.push(t);
        array.push(deltaHours(t, -1));
        array.push(deltaHours(t, 1));
    }
    var dif = [];
    for (let v of array) {
        dif.push(Math.abs(time.getTime() - v.getTime()));
    }
    let index = dif.indexOf(Math.min.apply(null, dif));
    return array[index];
}

function roundHour(time, hours) {
    var array = [];
    for (let h of hours) {
        let t = new Date(time.getFullYear(), time.getMonth(), time.getDate(), h);
        array.push(t);
        array.push(deltaDays(t, -1));
        array.push(deltaDays(t, 1));
    }
    var dif = [];
    for (let v of array) {
        dif.push(Math.abs(time.getTime() - v.getTime()));
    }
    let index = dif.indexOf(Math.min.apply(null, dif));
    return array[index];
}

function roundDay(time, days) {
    var array = [];
    for (let d of days) {
        let t = new Date(time.getFullYear(), time.getMonth(), d);
        array.push(t);
        array.push(deltaDays(t, -1));
        array.push(deltaDays(t, 1));
    }
    var dif = [];
    for (let v of array) {
        dif.push(Math.abs(time.getTime() - v.getTime()));
    }
    let index = dif.indexOf(Math.min.apply(null, dif));
    return array[index];
}

function niceTimeRange(iMin, iMax, time, timeframe, divide) {
    let [value, unit, minutes] = timeframe;
    let division = parseInt(iMax / divide);
    var delta, interval, tbegin;
    if (unit == DAY) {
        delta = nearest2(dividion, 10, 10);
        interval = num * (24 * 60 * 60 * 1000);
        tbegin = roundDay(time[0], [1, 15]);
    } else if(unit == MINUTE) {
        if (value == 1) {
            delta = nearest1(division, [5, 10, 15]);
            tbegin = roundMinute(time[0], [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
        } else {
            delta = nearest2(divisionm, value * 6, 30);
            tbegin = roundMinute(time[0], [0, 15, 30, 45]);
        }
        interval = delta * (60 * 1000);
    } else if (unit == HOUR) {
        delta = nerest2(division, value * 6, 12);
        interval = delta * (60 * 60 * 1000);
        tbegin = roundHour(time[0], [0, 4, 8, 12, 16, 20]);
    }
    var array = [];
    var t = tbegin.getTime();
    for (var i = 0; i < divide * 4; i++) {
        t += interval;
        let t0 = new Date(t);
        if (t > time[time.length - 1].getTime()) {
            break;
        }
        for (var j = 0; j < time.length; j++) {
            if (time[j].getTime() == t) {
                array.push([j, t0]);
            }
        }
    }
    return array;
}

// ---- draw primitives ----
function line(context, pos1, pos2, lineWidth=1.0, style="solid") {
    context.lineWidth = lineWidth;
    if (style.toLowerCase() == "dot") {
        let dash = [1, 1];
        context.setLineDash(dash);
    }
    context.beginPath();
    context.moveTo(pos1[0], pos1[1]);
    context.lineTo(pos2[0], pos2[1]);
    context.closePath();
    context.stroke();
}

function boxedText(context, point, text, color) {



}

// ------


class Scale {
    constructor(domain, range, type) {
        this.domain = domain;
        this.range = range;
        if (type === undefined) {
            type = "linear"
        }
        this.type = type;
        if (type == "linear" || type == "bartime") {
            let delta1 = range[1] - range[0];
            let delta2 = domain[1] - domain[0];
            if (delta1 == 0.0 || delta2 == 0.0) {
                this.rate = 1.0;
            } else {
                this.rate = delta1 / delta2;
            }
        } else if (type == "time") {
            let delta1 = range[1] - range[0];
            let delta2 = domain[1].getTime() - domain[0].getTime();
            if (delta1 == 0.0 || delta2 == 0.0) {
                this.rate = 0.0;
            } else {
                this.rate = delta1 / delta2;
            }            
        } 
    }
    
    pos(value) {
        if (this.type == "linear" || this.type == "bartime") {
            // pos = (value - real0) * (screen1 - screen0) / (real1 - real0) + screen0
            let v = value - this.domain[0];
            return v * this.rate + this.range[0];
        } else if (this.type == "time") {
            let v = value.getTime() - this.domain[0].getTime();
            return v * this.rate + this.range[0];
        }
    }

    value(pos) {
        if (this.type == "linear" || this.type == "bartime") {
            // value = (pos - screen0) / (screen1 - screen0) * (real1 - real0) + real0
            if (this.rate == 0.0) {
                return 0.0;
            }
            let v = (pos - this.range[0]) / this.rate + this.domain[0];
            if (this.type == "bartime") {
                return parseInt(v + 0.5);
            } else {
                return v;
            }
        } else if (this.type == "time") {
            let v = (pos - this.range[0]) / this.rate + this.domain[0];
            return new Date(v);
        }
    }

    rangeWidth() {
        let w = Math.abs(this.range[0] - this.range[1]);
        return w;
    }

    domainWidth() {
        let w = Math.abs(this.domain[0] - this.domain[1]);
        return w;
    }

}

class GraphicObject {
    constructor(context) {
        this.context = context;
    }

    style(prop) {
        try {
            this.context.globalAlpha = prop['opacity'];
        } catch(e) {
        }
        try {
            this.context.lineColor = prop['lineColor'];
        } catch(e) {
        }
        try {
            this.context.fillStyle = prop['fillColor'];
        } catch(e) {
        }
    }

    drawLine(point0, point1, prop) {
        this.style(prop);
        line(this.context, point0, point1);
    }

    drawSquare(point0, point1, prop) {
        this.style(prop);
        let x, y, width, height;
        if (point0[0] < point1[0]) {
            x = point0[0];
        } else {
            x = point1[0];
        }
        width = Math.abs(point1[0] - point0[0]);
        if (point0[1] < point1[1]) {
            y = point0[1];
        } else {
            y = point1[1];
        }
        height = Math.abs(point1[1] - point0[1]);
        this.ontext.fillRect(x, y, width, height);    
    }
}

class Square extends GraphicObject {
    constructor(context, xScale, yScale) {
        super(context);
        this.xScale = xScale;
        this.yScale = yScale;
    }
    
    draw(cx, cy, width, height, prop) {
        super.style(prop);
        this.cx = cx;
        this.cy = cy;
        this.width = width;
        this.height = height;
        let x = this.xScale.pos(this.cx);
        let y = this.yScale.pos(this.cy);
        let x0 = x - this.width / 2;
        let y0 = y - this.height / 2;
        this.context.fillRect(x0, y0, this.width, this.height);
    }
}

class Candle extends GraphicObject {
    constructor(context, xScale, yScale) {
        super(context);
        this.xScale = xScale;
        this.yScale = yScale;
    }
    
    draw(index, time, open, high, low, close, width, prop) {
        super.style(prop);
        this.index = index;
        this.time = time;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.width = width;

        let x = this.xScale.pos(index);
        let x0 = x - this.width / 2;
        var upper, lower, bodyColor, lineColor;
        if (this.open < this.close) {
            upper = this.yScale.pos(close);
            lower = this.yScale.pos(open);
            bodyColor = "green";
            lineColor = "lime"
        } else {
            upper = this.yScale.pos(open);
            lower = this.yScale.pos(close);
            bodyColor = "red";
            lineColor = "pink"    
        }
        // body
        this.context.fillStyle = bodyColor;
        this.context.fillRect(x0, lower, width, upper - lower);

        // upper line
        this.context.globalAlpha = 1.0;
        this.context.strokeStyle = lineColor;
        this.drawLine([x, this.yScale.pos(high)], [x, upper], {})

        // lower line
        this.drawLine([x, lower], [x, this.yScale.pos(low)], {})
    }
}

class PolyLine extends GraphicObject {
    constructor(context, xScale, yScale) {
        super(context);
        this.xScale = xScale;
        this.yScale = yScale;
    }
    
    draw(points, prop, should_fill) {
        this.points = points;
        super.style(context, prop);
        context.globalAlpha = prop["opacity"];
        context.strokeStyle = prop["lineColor"];
        context.beginPath();
        let isFirst = True;
        for (p of this.points) {
            x = this.xScale.pos(p[0]);
            y = this.yScale.pos(p[1]);
            if (isFirst) {
                context.moveTo(x, y);
                isFirst = False;
                continue;
            }
            context.lineTo(x, y);
        }
        context.closePath();
        context.stroke();
        if (should_fill) {
            context.fill();
        }
    }
}

class Axis {
    constructor(scale, level, mainDivision, subDivision, isHorizontal, time, timeframe) {
        this.scale = scale;
        this.level = level;
        this.mainDivision = mainDivision;
        this.subDivision = subDivision;
        this.isHorizontal = isHorizontal;
        if (time === undefined) {
            this.time = null;
            this.timeframe = null;
        } else {
            this.time = time;
            this.timeframe = this.parseTimeframe(timeframe);
        }
    }

    parseTimeframe(timeframe) {
        let unit = timeframe.substring(0, 1);
        let figure = parseInt(timeframe.substring(1));
        var minutes;
        if (unit == MINUTE) {
            minutes = figure;
        } else if(unit == HOUR) {
            minutes = figure * 60;
        } else if (unit == DAY) {
            minutes = figure * 24 * 60;
        }
        return [figure, unit, minutes];
    }

    draw(context) {
        context.globalAlpha = 0.3;
        context.fillStyle = "black";
        var lower, upper, value;

        if (this.scale.type == "linear") {
            lower = this.scale.domain[0];
            upper = this.scale.domain[1];
            if (upper < lower) {
                let tmp = lower;
                lower = upper;
                upper = tmp;
            }
        } else if (this.scale.type == "time") {
            lower = this.scale.domain[0].getTime();
            upper = this.scale.domain[1].getTime();   
        }

        // grid
        context.lineWidth = 0.2;
        context.font = 'bold 12px Times Roman';
        context.strokeStyle = "grey";
        var range;
        if (this.scale.type == "linear") {
            range = niceRange(lower, upper, this.mainDivision);
        } else if (this.scale.type == "bartime") {
            range = niceTimeRange(this.scale.domain[0], this.scale.domain[1], this.time, this.timeframe, this.mainDivision);
        } else if (this.scale.type == "time") {
            range = niceTimeRange(this.scale.domain[0], this.scale.domain[1]);
        }
        for (let v of range) {

            if (this.scale.type == "linear") {
                value = this.scale.pos(v);
            } else if (this.scale.type == "bartime") {
                value = this.scale.pos(v[0]);
            } else if (this.scale.type == "time") {
                value = this.scale.pos(new Date(v));
            }
            if (this.isHorizontal) {
                const labelMargin = 5;
                context.textAlign = "center";
                context.textBaseline = "top";
                line(context, [value, this.level[0]], [value, this.level[1]])
                context.globalAlpha = 1.0;
                var s;
                if (this.scale.type == "linear") {
                    s = number2Str(v);
                } else if (this.scale.type == "bartime") {
                    if (v[1]) {
                        s = date2Str(v[1], "HH:mm");
                    } else {
                        s = "";
                    }
                } else if (this.scale.type == "time") {
                    s = date2Str(new Date(v), "HH:mm");
                }
                context.fillText(s, value, this.level[0] + labelMargin);
                context.globalAlpha = 0.3;
            } else {
                context.textAlign = "right";
                context.textBaseline = "middle";
                line(context, [this.level[0], value], [this.level[1], value])
                context.globalAlpha = 1.0;
                context.fillText(number2Str(v), this.level[0], value);
                context.globalAlpha = 0.3;
            }
            context.stroke();
        }

        if (this.isHorizontal) {
            line(context, [this.scale.range[0], this.level[0]], [this.scale.range[1], this.level[0]], 2.0);
            line(context, [this.scale.range[0], this.level[1]], [this.scale.range[1], this.level[1]], 2.0);
        } else {
            line(context, [this.level[0], this.scale.range[0]], [this.level[0], this.scale.range[1]], 2.0);
            line(context, [this.level[1], this.scale.range[0]], [this.level[1], this.scale.range[1]], 2.0);
        }
        context.stroke();
    }
}

class Chart {
    constructor(canvas, width, height, margin) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.context = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        this.showLength = 30;
        this.tohlc = null;
        this.xScale = null;
        this.yScale = null;
        this.crossPoint = null;
        this.eventControl();
        this.showLength = 30;
    }

    setBarNumber(number) {
        this.showLength = number;
        this.update()
    }

    load(tohlc) {
        this.tohlc = tohlc;
        this.update();
    }

    update() {
        if (!this.tohlc) {
            return;
        }
        let data = slice(this.tohlc, -5, this.showLength);
        if (!data) {
            return;
        }
        this.currentData = data;
        this.currentIndex = this.showLength - data.length;
        this.makeScale(this.showLength, minmax(data));
        var self = this;
        setInterval(function(e) {
            self.render(self.currentData, self.currentIndex);}
        , 1000 / 30);
    }

    makeScale(showLength, minmax) {
        const bar_left_margin = 2;
        const bar_right_margin = 7;
        let xScale = new Scale([-bar_left_margin, showLength + bar_right_margin], [this.margin.left, this.width - this.margin.right], "bartime");
        this.xScale = xScale;
        let yScale = new Scale(minmax, [this.height - this.margin.bottom, this.margin.top]);
        this.yScale = yScale;
    }

    render(tohlc, beginIndex) {
        if (!tohlc) {
            return;
        }
        this.context.clearRect(0, 0, this.width, this.height);
        let candles = []
        let prop = {"color": "green", "opacity": 0.5};
        let w = this.candleWidth(this.xScale.rangeWidth(), this.showLength);
        for (var i = 0; i < tohlc.length; i++){
            let value = tohlc[i];
            let candle = new Candle(this.context, this.xScale, this.yScale);
            candles.push(candle);
            candle.draw(i + beginIndex, value.time, value.open, value.high, value.low, value.close, w, prop);
        }
        let time = keyListOfJson(tohlc, "time");
        this.candles = candles;
        this.drawAxis(time, "M1");
        this.drawTitle("Audjpy", {});
        this.drawXtitle("Time", {});
        if (candles.length > 0) {
            this.drawCursor(candles[candles.length - 1]);
        }
        if (!this.curorPoint) {
            this.drawCross(this.crossPoint);
        }
    }

    candleWidth(range, bar_size) {
        let w = parseInt(range / bar_size);
        if (w < 0) {
            w = 1;
        } else if (w > 10) {
            w = 10;
        }
        return w;
    }

    drawPoints(points, prop) {
        let width = 10;
        let height = 10;
        for(let p of points) {
            let point = new Square(this.context, this.xScale, this.yScale);
            point.draw(p[0], p[1], width, height, prop);
        }
    }

    drawAxis(time, timeframe) {
        let xAxis, yAxis;
        if (this.xScale.type == "linear") {
            xAxis = new Axis(this.xScale, this.yScale.range, 5, 2, true);
        } else if (this.xScale.type == "bartime") {
            xAxis = new Axis(this.xScale, this.yScale.range, 5, 2, true, time, timeframe);
        }
        xAxis.draw(this.context);
        yAxis = new Axis(this.yScale, this.xScale.range, 5, 2, false);
        yAxis.draw(this.context);
    }

    drawTitle(title, prop) {
        this.context.textAlign = "center";
        this.context.textBaseline = "top";
        this.context.globalAlpha = 1.0;
        this.context.fillText(title, this.canvas.width / 2, 20);
    }

    drawXtitle(title, prop) {
        this.context.textAlign = "center";
        this.context.textBaseline = "top";
        this.context.globalAlpha = 1.0;
        this.context.fillText(title, this.canvas.width / 2, this.height - 50);
    }

    eventControl(){
        this.canvas.onmousemove = e => {
            let rect = this.canvas.getBoundingClientRect();
            let point = [e.clientX - rect.left, e.clientY - rect.top];
            this.updateCurorPoint(point);
        };
    }

    updateCurorPoint(point) {
        let [x, y] = point;
        let xval = this.xScale.value(x);
        if (xval < 0 || xval > this.showLength) {
            this.crossPoint = null;
            return;
        }

        let upper = this.yScale.range[0];
        let lower = this.yScale.range[1];
        if (lower > upper) {
            let tmp = lower;
            lower = upper;
            upper = tmp;
        }
        if (y < lower || y > upper) {
            this.crossPoint = null;
            return;
        }
        this.crossPoint = point;
    }

    drawCursor(candle) {
        let y = this.yScale.pos(candle.close);
        this.context.strokeStyle = "#aaaaff";
        line(this.context, [this.xScale.range[0], y], [this.xScale.range[1], y], 0.5);
        this.context.font = "12px Arial";
        this.context.textAlign = "left";
        this.context.textBaseline = "middle";
        this.context.fillStyle = "#aaaaff";
        this.context.fillRect(this.width - this.margin.right - 60, y - 10, 60, 24);
        this.context.fillStyle = "#444444";
        this.context.fillText(String(round(candle.close, 4)), this.width - this.margin.right - 50 , y + 4);
    }


    drawCross(point) {
        if (this.tohlc == null || this.xScale == null || this.yScale == null) {
            return;
        }
        if (!point) {
            return;
        }
        let [x, y] = point;

        let xvalue = this.xScale.value(x);
        line(this.context, [x, this.yScale.range[0]], [x, this.yScale.range[1]]);
        let yvalue = this.yScale.value(y);
        line(this.context, [this.xScale.range[0], y], [this.xScale.range[1], y]);

        this.context.font = "12px Arial";
        this.context.textAlign = "left";
        this.context.textBaseline = "middle";
        this.context.fillStyle = "#77ff77";
        this.context.fillRect(this.width - this.margin.right, y - 10, 70, 24);
        this.context.fillStyle = "#000000";
        this.context.fillText(String(round(yvalue, 4)), this.width - this.margin.right + 5 , y + 3);

        if (this.candles == null) {
            return;
        }
        if (xvalue < 0 || xvalue > this.candles.length - 1) {
            return;
        }
        let candle = this.candles[xvalue];
        let dispx = this.width - this.margin.right - 160;
        this.context.fillStyle = "black";
        this.context.fillText("Time: " + date2Str(candle.time, "yyyy/MM/dd HH:mm"), dispx, 10);
        this.context.fillText("Open: " + String(round(candle.open, 5)), dispx, 30);
        this.context.fillText("High: " + String(round(candle.high, 5)), dispx, 50);
        this.context.fillText("Low: " + String(round(candle.low, 5)), dispx, 70);
        this.context.fillText("Close: " + String(round(candle.close, 5)), dispx, 90);
    }


}

// -----

function keyListOfJson(jsonArray, key){
    var dates = []
    for (var i = 0; i < jsonArray.length; i++) {
        var d = jsonArray[i][key]
        dates.push(d);
    }
    return dates;
}

function minmaxDate(d) {
    var mindate, maxdate;
    for (var i = 0; i < d.length; i++){
        if (i == 0) {
            mindate = d[0];
            maxdate = d[0];
        } else {
            if (d[i] > maxdate) {
                maxdate = d[i]
            }
            if (d[i] < mindate) {
                mindate = d[i]
            }
        }
    }
    return [mindate, maxdate];
}

function minmax(jsonArray) {
    let lows = keyListOfJson(jsonArray, "low");
    let min = Math.min.apply(null, lows);
    let highs = keyListOfJson(jsonArray, "high");
    let max = Math.max.apply(null, highs);
    return [min, max];
}

function slice(data, last, size) {
    if (last < 0) {
        last = data.length + last;
    }
    let begin = last - size + 1;
    if (begin < 0 || last > data.size - 1) {
        return data;
    }
    d = []
    for (var i = begin; i <= last; i++) {
        d.push(data[i])
    }
    return d;
}

// -----

const zip = (arr1, arr2) => arr1.map((k, i) => [k, arr2[i]]);

function httpValues(ids) {
    var out = [];
    for (let e of ids) {
        let v = document.getElementById(e).value;
        out.push(parseInt(v));
    }
    return out;
}

var chart;
function load() {
    let [barNumber, priceRange] = httpValues(["barnumber", "pricerange"]);
    let tohlc = dataSource();
    chart = new Chart(document.getElementById("canvas1"), canvasSize.width, canvasSize.height, margin);
    chart.setBarNumber(barNumber);
    chart.load(tohlc);
}

function update() {
    let [barNumber, priceRange] = httpValues(["barnumber", "pricerange"]);
    chart.setBarNumber(barNumber);
}