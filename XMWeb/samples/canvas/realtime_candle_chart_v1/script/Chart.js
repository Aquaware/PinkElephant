const margin = {top:100, bottom: 100, left: 100, right: 20};
const canvasSize = {width: 1120, height: 650};

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
    return [aa, bb, division];
}

function deltaMInutes(time, minutes) {
    var out = new Date(time.getTime());
    out.setMinute(out.getMinutes() + minutes);
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

function number2Str(value) {
    const order = 2;
    if (value == 0) {
        return "0";
    }
    if (Number.isInteger(value)) {
        return String(value);
    }
    let v = Math.floor(value * Math.pow(10, order) + 0.5) / Math.pow(10, order);
    return String(v);
}

function niceTimeRange(t1, t2, divide) {
    let niceNumbers = [1, 5, 10, 30, 60, 60 * 2, 60 * 4, 60 * 8, 60 * 12, 60 * 24, 60 * 24 * 2, 60 * 24 * 5, 60 * 24 * 10, 60 * 24 * 30];
    let deltaMinutes = Math.abs(parseInt((t2.getTime() - t1.getTime()) / 60 / 1000));
    let division = nice(niceNumbers, parseInt(deltaMinutes / divide));
    let a = parseInt(t1.getTime() / division) * division;
    if (a > t1.getTime()) {
        a -= division;
    }
    let b = parseInt (t2.getTime() / division) * division;
    if (b < t2.getTime()) {
        b += division;
    }
    let t1new = new Date(a);
    let t2new = new Date(b);
    return [t1new, t2new, division * 60 * 1000];
}

class Scale {
    constructor(domain, range, type) {
        this.domain = domain;
        this.range = range;
        if (type === undefined) {
            type = "linear"
        }
        this.type = type;
        if (type == "linear") {
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
        if (this.type == "linear") {
            let v = value - this.domain[0];
            return v * this.rate + this.range[0];
        } else if (this.type == "time") {
            let v = value.getTime() - this.domain[0].getTime();
            return v * this.rate + this.range[0];
        }
    }
}

class GraphicObject {
    style(context, prop) {
        context.globalAlpha = prop['opacity'];
        context.fillStyle = prop['color'];
    }
}

class Square extends GraphicObject {
    constructor(cx, cy, width, height, xScale, yScale) {
        super();
        this.cx = cx;
        this.cy = cy;
        this.width = width;
        this.height = height;
        this.xScale = xScale;
        this.yScale = yScale;
    }
    
    draw(context, prop) {
        super.style(context, prop);
        let x = this.xScale.pos(this.cx);
        let y = this.yScale.pos(this.cy);
        let x0 = x - this.width / 2;
        let y0 = y - this.height / 2;
        context.fillRect(x0, y0, this.width, this.height);
    }
}

class Candle extends GraphicObject {
    constructor(time, open, high, low, close, width, xScale, yScale) {
        super();
        this.time = time;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.width = width;
        this.xScale = xScale;
        this.yScale = yScale;
    }
    
    draw(context, prop) {
        super.style(context, prop);
        let x = this.xScale.pos(this.time);
        let y = this.yScale.pos(this.cy);
        let x0 = x - this.width / 2;
        var upper, lower, bodyColor, lineColor;
        if (this.open < this.close) {
            upper = this.yScale.pos(this.close);
            lower = this.yScale.pos(this.open);
            bodyColor = "blue";
            lineColor = "cyan"
        } else {
            upper = this.yScale.pos(this.open);
            lower = this.yScale.pos(this.close);
            bodyColor = "red";
            lineColor = "pink"    
        }
        // body
        context.fillStyle = bodyColor;
        context.fillRect(x0, lower, this.width, upper - lower);


        // upper line
        context.globalAlpha = 1.0;
        context.strokeStyle = lineColor;
        context.beginPath();
        context.moveTo(x, this.yScale.pos(this.high));
        context.lineTo(x, upper);
        context.closePath();
        context.stroke();

        // lower line
        context.beginPath();
        context.moveTo(x, lower);
        context.lineTo(x, this.yScale.pos(this.low));
        context.closePath();

        context.stroke();
    }
}

class PolyLine extends GraphicObject {
    constructor(points, xScale, yScale) {
        super();
        this.points = points;
        this.xScale = xScale;
        this.yScale = yScale;
    }
    
    draw(context, prop, should_fill) {
        super.style(context, prop);
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
    constructor(scale, level, mainDivision, subDivision, isHorizontal) {
        this.scale = scale;
        this.level = level;
        this.mainDivision = mainDivision;
        this.subDivision = subDivision;
        this.isHorizontal = isHorizontal;
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
        var min, max, division;
        if (this.scale.type == "linear") {
            [min, max, division] = niceRange(lower, upper, this.mainDivision);
        } else if (this.scale.type == "time") {
            let [tmin, tmax, division0] = niceTimeRange(this.scale.domain[0], this.scale.domain[1], this.mainDivision);
            division = division0;
            min = tmin.getTime();
            max = tmax.getTime();
        }
        for (let v = min; v <= max; v += division) {
            if (v < lower || v > upper) {
                continue;
            }
            if (this.scale.type == "linear") {
                value = this.scale.pos(v);
            } else if (this.scale.type == "time") {
                value = this.scale.pos(new Date(v));
            }
            if (this.isHorizontal) {
                const labelMargin = 5;
                context.textAlign = "center";
                context.textBaseline = "top";
                context.beginPath();
                context.moveTo(value, this.level[0]);
                context.lineTo(value, this.level[1]);
                context.closePath();
                context.globalAlpha = 1.0;
                var s;
                if (this.scale.type == "linear") {
                    s = number2Str(v);
                } else if (this.scale.type == "time") {
                    s = date2Str(new Date(v), "HH:mm");
                }
                context.fillText(s, value, this.level[0] + labelMargin);
                context.globalAlpha = 0.3;
            } else {
                context.textAlign = "right";
                context.textBaseline = "middle";
                context.beginPath();
                context.moveTo(this.level[0], value);
                context.lineTo(this.level[1], value);
                context.closePath();
                context.globalAlpha = 1.0;
                context.fillText(number2Str(v), this.level[0], value);
                context.globalAlpha = 0.3;
            }
            context.stroke();
        }

        context.lineWidth = 1.0;
        if (this.isHorizontal) {
            context.beginPath();
            context.moveTo(this.scale.range[0], this.level[0]);
            context.lineTo(this.scale.range[1], this.level[0]);
            context.moveTo(this.scale.range[0], this.level[1]);
            context.lineTo(this.scale.range[1], this.level[1]);
            context.closePath();
        } else {
            context.beginPath();
            context.moveTo(this.level[0], this.scale.range[0]);
            context.lineTo(this.level[0], this.scale.range[1]);
            context.moveTo(this.level[1], this.scale.range[0]);
            context.lineTo(this.level[1], this.scale.range[1]);
            context.closePath();
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
    }

    drawPoints(points, xScale, yScale, prop) {
        let width = 10;
        let height = 10;
        for(let p of points) {
            let point = new Square(p[0], p[1], width, height, xScale, yScale);
            point.draw(this.context, prop);
        }
    }

    drawAxis(xScale, yScale) {
        let xAxis = new Axis(xScale, yScale.range, 5, 2, true);
        xAxis.draw(this.context);
        let yAxis = new Axis(yScale, xScale.range, 5, 2, false);
        yAxis.draw(this.context);
    }

    drawTitle(title, prop) {
        this.context.textAlign = "center";
        this.context.textBaseline = "top";
        this.context.globalAlpha = 1.0;
        this.context.fillText(title, this.margin.left + this.width / 2, 20);
    }

    drawXtitle(title, prop) {
        this.context.textAlign = "center";
        this.context.textBaseline = "top";
        this.context.globalAlpha = 1.0;
        this.context.fillText(title, this.margin.left + this.width / 2, this.height -50);
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

// -----

function test1() {
    let points = [[100, 0], [200, 250], [300, 500], [400, 300], [500, 200], [600, 100], [700, 500]];
    draw1(points);
}

function test2() {
    let points = [[100, 0], [200, 20], [400, 10], [400, 200], [500, 5], [600, 12], [700, 500]];
    draw1(points);
}

function test3() {
    let data = dataSource();
    draw2(data);
}

function draw1(points) {
    let chart = new Chart(document.getElementById("canvas1"), canvasSize.width, canvasSize.height, margin);
    let xScale = new Scale([0, 1000], [margin.left, chart.width - margin.right]);
    let yScale = new Scale([0, 500], [chart.height - margin.bottom, margin.top]);
    let prop = {"color": "green", "opacity": 0.5};
    chart.drawPoints(points, xScale, yScale, prop);
    chart.drawAxis(xScale, yScale);
}

const zip = (arr1, arr2) => arr1.map((k, i) => [k, arr2[i]]);

function draw2(tohlc) {
    var time = keyListOfJson(tohlc, "time");
    let dates = minmaxDate(time);
    let [min, max] = minmax(tohlc);
    let chart = new Chart(document.getElementById("canvas1"), canvasSize.width, canvasSize.height, margin);
    let xScale = new Scale(dates, [margin.left, chart.width - margin.right], type="time");
    let yScale = new Scale([min, max], [chart.height - margin.bottom, margin.top]);
    let prop = {"color": "green", "opacity": 0.5};
    for (value of tohlc) {
        let candle = new Candle(value.time, value.open, value.high, value.low, value.close, 6, xScale, yScale);
        candle.draw(chart.context, prop);
    }
    chart.drawAxis(xScale, yScale);
    chart.drawTitle("Audjpy", {});
    chart.drawXtitle("Time", {});
}