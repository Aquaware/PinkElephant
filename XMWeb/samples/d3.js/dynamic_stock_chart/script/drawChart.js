var margin = {top: 100, right: 30, bottom: 30, left: 100},
width = 1200 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;
var format = d3.time.format("%Y-%M-%d %H:%M:%S");

const bar_margin = {left: 1, right: 5};
var display_bar_size = 50;

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

function deltaTime(time, timeframe, number){
    var unit = timeframe.substr(0, 1).toUpperCase();
    var value = parseInt(timeframe.substr(1, timeframe.length), 10) * number;
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

function slice(data, index, size) {
    d = []
    for (var i = index - size + 1; i <= index; i++) {
        d.push(data[i])
    }
    return d;
}

function statics(data, timeframe) {
    var times = keyListOfJson(data, "time")
    var lastTime = times[times.length - 1];
    var maxTime = deltaTime(lastTime, timeframe, bar_margin.right);
    var minTime = deltaTime(lastTime, timeframe, -bar_margin.left - display_bar_size);
    var yMax = d3.max(data, function(d){ return +d.high; });
    var yMin = d3.min(data, function(d){ return +d.low; });
    return [times, minTime, maxTime, yMin, yMax];
}

function toDateType(data) {
    dataset = data.map(function(d){
        // 日付をDate型に
        return  { time:format.parse(d.time), open:d.open, high:d.high, low:d.low, close: d.close, volume:d.volume } ;
    });
    return dataset;
}

function timeTicks(timeframe, number) {
    var unit = timeframe.substr(0, 1).toUpperCase();
    var value = parseInt(timeframe.substr(1, timeframe.length), 10) * number;
    if (unit == 'M') {
        var tick_unit = d3.time.minute;
    } else if (unit == 'H') {
        var tick_unit = d3.time.hour;
    } else if (unit == 'D') {
        var tick_unit = d3.time.day;
    }
    return [tick_unit, value];
}

function render(data, timeframe){
    var [times, minTime, maxTime, yMin, yMax] = statics(data, timeframe);
    var t0 = deltaTime(minTime, timeframe, - bar_margin.left);
    var t1 = deltaTime(maxTime, timeframe, bar_margin.right);
    var xScale = d3.time.scale().domain([t0, t1]).range([0, width]);
    var yScale = d3.scale.linear().domain([yMin, yMax]).nice().range([height, 0]);
    var [tick_unit, tick_value] = timeTicks(timeframe, 10);
    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .ticks(tick_unit, tick_value)
                        .orient("bottom")
                        .tickFormat(function(d) {
                            hours = d.getHours();
                            minutes = ( (d.getMinutes() < 10) ?'0':'') + d.getMinutes();
                            return hours + ':' + minutes
                        });

    var yAxis = d3.svg.axis().ticks(5).scale(yScale).orient("left").tickSize(6, -width);

    // x axis
    if (svg.selectAll(".x.axis")[0].length < 1 ){
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // x grid
        svg.append("g")         
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(makeXaxis()
            .tickSize(-height, 0, 0)
            .tickFormat(""));
    }

    function makeXaxis() {        
        return d3.svg.axis().scale(xScale).orient("bottom").ticks(2);
    }
    
    // y axis
    if (svg.selectAll(".y.axis")[0].length < 1 ){
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
            .call(makeYaxis()
            .tickSize(-width, 0, 0)
            .tickFormat(""));
    }

    function makeYaxis() {        
        return d3.svg.axis().scale(yScale).orient("left").ticks(5);
    }

    // candle body
    var bar_body_width = (0.5 * width  / data.length ) % 20;
    var squares = svg.selectAll("rect").data(data, function(d){return d.id;});
    squares.enter().append("rect")
        .attr("x", d => { return xScale(d.time) - bar_body_width / 2; })
        .attr("y", d => { return yScale(d3.max([d.open, d.close])); })
        .attr("height", d => { return yScale(d3.min([d.open, d.close])) - yScale(d3.max([d.open, d.close])); })
        .attr("width", d => { return bar_body_width; })
        .attr("fill", d => { return d.open > d.close ? "blue" : "red"; })
        .attr("opacity", 0.5);

    squares.exit().remove();
    squares.transition()
            .attr("x", d => { return xScale(d.time) - bar_body_width / 2; })
            .attr("y", d => { return yScale(d3.max([d.open, d.close])); })
            .attr("height", d => { return yScale(d3.min([d.open, d.close])) - yScale(d3.max([d.open, d.close])); })
            .attr("width", d => { return bar_body_width; })


    // candle upper line
    var upperLines = svg.selectAll("line.upper").data(data, function(d){return d.id;});
    upperLines.enter().append("line").attr("class", "upper")
                .attr("x1", function (d) { return xScale(d.time); })
                .attr("x2", function (d) { return xScale(d.time); })
                .attr("y1", function (d) { return yScale((d.open > d.close) ? d.open : d.close); })
                .attr("y2", function (d) { return yScale(d.high); })
                .attr("stroke", function (d) { return d.open > d.close ? "blue" : "red"; });

    upperLines.exit().remove();
    upperLines.transition()
                .attr("x1", function (d) { return xScale(d.time); })
                .attr("x2", function (d) { return xScale(d.time); })
                .attr("y1", function (d) { return yScale((d.open > d.close) ? d.open : d.close); })
                .attr("y2", function (d) { return yScale(d.high); })
                .attr("stroke", function (d) { return d.open > d.close ? "blue" : "red"; });   
    
    // candle lower line
    var lowerLines = svg.selectAll("line.lower").data(data, function(d){return d.id;});
    lowerLines.enter().append("line").attr("class", "lower")
                .attr("x1", function (d) { return xScale(d.time); })
                .attr("x2", function (d) { return xScale(d.time); })
                .attr("y1", function (d) { return yScale((d.open < d.close) ? d.open : d.close); })
                .attr("y2", function (d) { return yScale(d.low); })
                .attr("stroke", function (d) { return d.open > d.close ? "blue" : "red"; });
    lowerLines.transition()
                .attr("x1", function (d) { return xScale(d.time); })
                .attr("x2", function (d) { return xScale(d.time); })
                .attr("y1", function (d) { return yScale((d.open < d.close) ? d.open : d.close); })
                .attr("y2", function (d) { return yScale(d.low); })
                .attr("stroke", function (d) { return d.open > d.close ? "blue" : "red"; });

}

// -----

function initial() {
    render(data, 'M1');
}

function insert() {
    currentIndex += 1;
    currentSize += 1;
    data = slice(dataset, currentIndex, currentSize);
    render(data, 'M1')
}

var jsonData = dataSource();
var dataset = toDateType(jsonData);
var currentIndex = display_bar_size - 1;
var currentSize = display_bar_size;
var data = slice(dataset, currentIndex, currentSize);


