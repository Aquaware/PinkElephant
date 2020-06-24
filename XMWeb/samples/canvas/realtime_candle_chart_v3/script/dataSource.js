var format = d3.time.format("%Y-%M-%d %H:%M:%S");

function csv2Json(csvArray){
    var array = [];   
    // header element
    var items = csvArray[0].split(',');
    for (var i = 1; i < csvArray.length; i++) {
        var a_line = new Object();
        var values = csvArray[i].split(',');
        for (var j = 0; j < items.length; j++) {
            a_line[items[j]] = values[j];
        }
        array.push(a_line);
    }
    //console.debug(jsonArray);
    return array;
}

function dataSource(name) {
	var json;
	if (name == "audjpy") {
		json = audjpy;
	} else if (name == "oil") {
		json = oil;
	} else if (name == "gold") {
		json = gold;
	} else if (name == "jp225") {
		json = jp225;
	}
	
	let dic = csv2Json(json);
	let data = dic.map(function(d){
        // 日付をDate型に
		return  {time:format.parse(d.time),
					open: parseFloat(d.open),
					high: parseFloat(d.high),
					low: parseFloat(d.low),
					close: parseFloat(d.close),
					volume: parseFloat(d.volume)};
	});
	return data;
}