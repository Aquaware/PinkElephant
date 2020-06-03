var property = {
    margin : {top: 20, right:20, bottom:20, left:50},
    width : 960,
    height : 500,
    
    get canvasWidth() {
        return this.width + this.margin.left + this.margin.right
    },
    
    get canvasHeight() {
        return this.height + this.margin.top + this.margin.bottom
    },
    get xScale() {
        return d3.scale.linear().range([0, this.width])
    },
    get yScale() {
        return d3.scale.linear().range([0, this.height])
    },
    
};

var xScale = property.xScale
var yScale = property.yScale


// draw and append the container
var svg = d3.select("body").append("svg")
    .attr("height", property.canvasHeight)
    .attr("width", property.canvasWidth)
    .append("g")
    .attr("transform","translate(" + property.margin.left + "," + property.margin.right + ")");

var line = d3.svg.line().interpolate("monotone")
  .x(function(d){ return xScale(d.x); })
  .y(function(d){ return yScale(d.y); });

// create random data
function newData(lineNumber, points){
  return d3.range(lineNumber).map(function(){
    return d3.range(points).map(function(item,idx){
      return {x:idx/(points-1),y:Math.random()*100};
    });
  });
}

function render(){
  // generate new data
  var data = newData(document.getElementById("linecount").value,document.getElementById("pointcount").value);

  // obtain absolute min and max
  var yMin = data.reduce(function(pv,cv){
    var currentMin = cv.reduce(function(pv,cv){
      return Math.min(pv,cv.y);
    },100)
    return Math.min(pv,currentMin);
  },100);
  var yMax = data.reduce(function(pv,cv){
    var currentMax = cv.reduce(function(pv,cv){
      return Math.max(pv,cv.y);
    },0)
    return Math.max(pv,currentMax);
  },0);

  // set domain for axis
  yScale.domain([yMin,yMax]);

  // create axis scale
  var yAxis = d3.svg.axis()
      .scale(yScale).orient("left");

  // if no axis exists, create one, otherwise update it
  if (svg.selectAll(".y.axis")[0].length < 1 ){
    svg.append("g")
        .attr("class","y axis")
        .call(yAxis);
  } else {
    svg.selectAll(".y.axis").transition().duration(1500).call(yAxis);
  }

  // generate line paths
  var lines = svg.selectAll(".line").data(data).attr("class","line");

  // transition from previous paths to new paths
  lines.transition().duration(1500)
    .attr("d",line)
    .style("stroke", function(){
      return '#'+Math.floor(Math.random()*16777215).toString(16);
    });
    
  // enter any new data
  lines.enter()
    .append("path")
    .attr("class","line")
    .attr("d",line)
    .style("stroke", function(){
      return '#'+Math.floor(Math.random()*16777215).toString(16);
    });

  // exit
  lines.exit()
    .remove();
}


