function createPoint(x) {
    d = {x: x, y: Math.random() * 100};
    return d;
}

function createData(number){
    out = []
    for (var i = 0; i < number; i++) {
      d = createPoint(i * 10);
      out.push(d);
    }
    return out;
}

function addData(values) {
    x = values.length;
    d = createPoint(x * 10);
    values.push(d);
}

function updateLast(values){
    i = values.length - 1
    var last = values[i];
    var d = createPoint(last.x);
    values[i] = d;
}

var values = createData(10);

function update() {
  // 配列の個数を n に代入
  var n = values.length;

  // <svg> の中の <circle> を列挙して、values を割り当てる
  var circles = d3.select("svg#chart1")
    .selectAll('circle').data(values);

  // 作成: 足りない <circle> を追加する
  circles.enter()
    .append('circle')
    .attr('fill', 'red')
    .attr('cx', d => {return d.x;})
    .attr('cy', d, i => {return d.y})
    .attr('r', 6);

  // 削除: 余分な <circle> はアニメーションつきで削除
  circles.exit()
    //.transition()
    //.duration(300)
    //.attr('cy', 0).attr('r', 0)
    .remove();

  // 更新: アニメーションで正しい位置とサイズに移動
  circles
    .transition()
    //.duration(300)
    .attr('cx', d => { return d.x; })
    .attr('cy', d => { return d.y; })
    .attr('r', 6);
}


function initial() {
  values = createData(10);
  update();
}

function changeLast() {
    updateLast(values);
    update();
}

function insert() {
    addData(values);
    update();
}

function removeLast() {
    values.pop();
    update();
}