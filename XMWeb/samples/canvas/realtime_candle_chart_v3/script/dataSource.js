

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
	var format;
	if (name == "audjpy") {
		json = audjpy;
		format = d3.time.format("%Y-%M-%d %H:%M:%S");
	} else if (name == "oil") {
		json = oil;
		format = d3.time.format("%Y-%M-%d %H:%M");
	} else if (name == "gold") {
		format = d3.time.format("%Y-%M-%d %H:%M");
		json = gold;
	} else if (name == "jp225") {
		format = d3.time.format("%Y/%M/%d");
		json = jp225;
	}
	
	let dic = csv2Json(json);
	let data = dic.map(function(d){
        // 日付をDate型に
		return  {time: format.parse(d.time),
					open: parseFloat(d.open),
					high: parseFloat(d.high),
					low: parseFloat(d.low),
					close: parseFloat(d.close),
					volume: parseFloat(d.volume)};
	});
	return data;
}