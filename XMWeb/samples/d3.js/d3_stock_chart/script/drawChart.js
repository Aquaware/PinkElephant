
var margin = {top: 100, right: 30, bottom: 30, left: 100},
width = 1200 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function keyListOfJson(json_array, key){
    var dates = []
    for (var i = 0; i < json_array.length; i++) {
        var d = json_array[i][key]
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

// "日-月-年"からDateオブジェクトを作る。
var format = d3.time.format("%Y-%M-%d %H:%M:%S");
// Dateオブジェクトから"年-月-日"に変換する。
var newFormat = d3.time.format("%y-%b-%d");

const bar_margin = {left: 1, right: 5};


function deltaTime(time, time_frame, number){
    var unit = time_frame.substr(0, 1).toUpperCase();
    var value = parseInt(time_frame.substr(1, time_frame.length), 10) * number;
    var t = new Date(time.getTime());
    if (unit == 'M') {
        t.setMinutes(t.getMinutes() + value);
    } else if (unit == 'H') {
        t.setHours(t.getHours() + value);
    } else if (unit == 'D') {
        t.setDate(t.getDate() + value);
    }
    return t;
}

function slice(data, size) {
    if (data.length <= size) {
        return data;
    }
    d = []
    for (var i = data.length - size;  i < data.length; i++) {
        d.push(data[i])
    }
    return d;
}

function drawChart(data, display_bar_size, time_frame){
    data0 = data.map(function(d){
        // 日付をDate型に
        return  { time:format.parse(d.time), open:d.open, high:d.high, low:d.low, close: d.close, volume:d.volume } ;
    });
    data = slice(data0, display_bar_size)

    var yMax = d3.max(data, function(d){ return +d.high; });
    var yMin = d3.min(data, function(d){ return +d.low; });

    var times = keyListOfJson(data, "time")
    var lastTime = times[times.length - 1];
    var maxTime = deltaTime(lastTime, time_frame, bar_margin.right);
    var minTime = deltaTime(lastTime, time_frame, -bar_margin.left - display_bar_size);

    var xScale = d3.time.scale()
                        .domain([minTime, maxTime])
                        .range([0, width]);

    var yScale = d3.scale.linear()
                        .domain([yMin, yMax])
                        .nice()
                        .range([height, 0]);

    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .ticks(d3.time.minutes, 10)
                        .orient("bottom")
                        .tickFormat(function(d) {
                            hours = d.getHours();
                            minutes = ( (d.getMinutes() < 10) ?'0':'') + d.getMinutes();
                            return hours + ':' + minutes + '\r\n' + d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear()
                        });

    var yAxis = d3.svg.axis()
                        .ticks(5)
                        .scale(yScale)
                        .orient("left")
                        .tickSize(6, -width);

    var bar_body_width = (0.5 * width  / data.length ) % 20;
    
    // x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // x grid
    svg.append("g")         
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_axis()
            .tickSize(-height, 0, 0)
            .tickFormat(""));
    
    function make_x_axis() {        
        return d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .ticks(10)
    }

    // y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("y", -10)
        .attr("x",10)
        .style("text-anchor", "end")
        .text("Price($)");
    
    // y grid
    svg.append("g")         
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat(""));

    function make_y_axis() {        
            return d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(5)};

    // candle body
    svg.selectAll("rect").data(data).enter().append("rect")
        .attr("x", function (d) { return xScale(d.time) - bar_body_width / 2; })
        .attr("y", function (d) { return yScale(d3.max([d.open, d.close])); })
        .attr("height", function (d) { return yScale(d3.min([d.open, d.close])) - yScale(d3.max([d.open, d.close])); })
        .attr("width", function (d) { return bar_body_width; })
        .attr("fill", function (d) { return d.open > d.close ? "blue" : "red"; })
        .attr("opacity", 0.5);

    // candle upper line
    svg.selectAll("line.upper").data(data).enter().append("line").attr("class", "upper")
        .attr("x1", function (d) { return xScale(d.time); })
        .attr("x2", function (d) { return xScale(d.time); })
        .attr("y1", function (d) { return yScale((d.open > d.close) ? d.open : d.close); })
        .attr("y2", function (d) { return yScale(d.high); })
        .attr("stroke", function (d) { return d.open > d.close ? "blue" : "red"; });
    
    // candle lower line
    svg.selectAll("line.lower").data(data).enter().append("line").attr("class", "lower")
        .attr("x1", function (d) { return xScale(d.time); })
        .attr("x2", function (d) { return xScale(d.time); })
        .attr("y1", function (d) { return yScale((d.open < d.close) ? d.open : d.close); })
        .attr("y2", function (d) { return yScale(d.low); })
        .attr("stroke", function (d) { return d.open > d.close ? "blue" : "red"; });
}

var json_data = dataSource() 
drawChart(json_data, 80, "M1");
