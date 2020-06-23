var format = d3.time.format("%Y-%M-%d %H:%M:%S");
let audjpy = [	"time,open,high,low,close,volume",
			//"2015-01-02 07:00:00,97.94,97.947,97.919,97.919,0.0",
			//"2015-01-02 07:01:00,97.92,97.924,97.896,97.896,0.0",
			"2015-01-02 07:02:00,97.894,97.897,97.891,97.897,0.0",
			"2015-01-02 07:03:00,97.897,97.902,97.897,97.9,0.0",
			"2015-01-02 07:04:00,97.901,97.905,97.892,97.892,0.0",
			"2015-01-02 07:05:00,97.892,98.2,97.892,97.9,0.0",
			"2015-01-02 07:06:00,97.896,97.9,97.896,97.9,0.0",
			"2015-01-02 07:07:00,97.9,97.904,97.9,97.903,0.0",
			"2015-01-02 07:08:00,97.903,97.941,97.894,97.94,0.0",
			"2015-01-02 07:09:00,97.94,97.94,97.88,97.883,0.0",
			"2015-01-02 07:10:00,97.889,98.04,97.889,97.99,0.0",
			"2015-01-02 07:11:00,97.914,97.928,97.894,97.894,0.0",
			"2015-01-02 07:12:00,97.894,97.914,97.885,97.889,0.0",
			"2015-01-02 07:13:00,97.889,97.925,97.884,97.924,0.0",
			"2015-01-02 07:14:00,97.925,97.933,97.924,97.924,0.0",
			"2015-01-02 07:15:00,97.924,97.946,97.924,97.945,0.0",
			"2015-01-02 07:16:00,97.945,97.954,97.945,97.948,0.0",
			"2015-01-02 07:17:00,97.949,97.952,97.941,97.942,0.0",
			"2015-01-02 07:18:00,97.942,97.942,97.91,97.911,0.0",
			"2015-01-02 07:19:00,97.911,97.918,97.902,97.916,0.0",
			"2015-01-02 07:20:00,97.914,97.914,97.908,97.912,0.0",
			"2015-01-02 07:21:00,97.912,97.912,97.908,97.911,0.0",
			"2015-01-02 07:22:00,97.91,97.91,97.902,97.903,0.0",
			"2015-01-02 07:23:00,97.903,97.905,97.892,97.894,0.0",
			"2015-01-02 07:24:00,97.894,97.899,97.89,97.893,0.0",
			"2015-01-02 07:25:00,97.893,97.906,97.891,97.895,0.0",
			"2015-01-02 07:26:00,97.895,97.905,97.89,97.891,0.0",
			"2015-01-02 07:27:00,97.891,97.904,97.89,97.893,0.0",
			"2015-01-02 07:28:00,97.893,97.899,97.864,97.866,0.0",
			"2015-01-02 07:29:00,97.866,97.879,97.798,97.814,0.0",
			"2015-01-02 07:30:00,97.813,97.869,97.797,97.868,0.0",
			"2015-01-02 07:31:00,97.868,97.868,97.864,97.864,0.0",
			"2015-01-02 07:32:00,97.864,97.867,97.859,97.86,0.0",
			"2015-01-02 07:33:00,97.86,97.864,97.858,97.862,0.0",
			"2015-01-02 07:34:00,97.862,97.867,97.858,97.866,0.0",
			"2015-01-02 07:35:00,97.866,97.871,97.85,97.867,0.0",
			"2015-01-02 07:36:00,97.867,97.873,97.852,97.871,0.0",
			"2015-01-02 07:37:00,97.869,97.876,97.847,97.857,0.0",
			"2015-01-02 07:38:00,97.857,97.884,97.847,97.872,0.0",
			"2015-01-02 07:39:00,97.871,97.879,97.87,97.879,0.0",
			"2015-01-02 07:40:00,97.878,97.883,97.876,97.879,0.0",
			"2015-01-02 07:41:00,97.879,97.882,97.877,97.882,0.0",
			"2015-01-02 07:42:00,97.882,97.883,97.876,97.881,0.0",
			"2015-01-02 07:43:00,97.881,97.884,97.875,97.878,0.0",
			"2015-01-02 07:44:00,97.88,97.882,97.877,97.882,0.0",
			"2015-01-02 07:45:00,97.882,97.882,97.875,97.879,0.0",
			"2015-01-02 07:46:00,97.884,97.886,97.879,97.886,0.0",
			"2015-01-02 07:47:00,97.886,97.921,97.884,97.918,0.0",
			"2015-01-02 07:48:00,97.918,97.918,97.897,97.905,0.0",
			"2015-01-02 07:49:00,97.905,97.908,97.894,97.895,0.0",
			"2015-01-02 07:50:00,97.896,97.898,97.886,97.886,0.0",
			"2015-01-02 07:51:00,97.886,97.899,97.88,97.893,0.0",
			"2015-01-02 07:52:00,97.893,97.893,97.875,97.88,0.0",
			"2015-01-02 07:53:00,97.88,97.883,97.878,97.883,0.0",
			"2015-01-02 07:54:00,97.883,97.908,97.883,97.888,0.0",
			"2015-01-02 07:55:00,97.886,97.888,97.874,97.888,0.0",
			"2015-01-02 07:56:00,97.888,97.888,97.883,97.884,0.0",
            "2015-01-02 07:57:00,97.884,97.885,97.862,97.866,0.0"];

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

function dataSource() { 
	let json = csv2Json(audjpy);
	let data = json.map(function(d){
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