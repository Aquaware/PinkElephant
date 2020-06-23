
function average(array) {
    if (array.length == 0) {
        return 0;
    }
    return array.reduce((a, b) => (a + b)) / array.length;    
}

function slice(array, begin, end) {
    if (end === undefined) {
        end = array.length - 1;
    }
    if (end < 0) {
        end = array.length + end;
    }
    var out = [];
    for (let i = begin; i <= end; i++) {
        out.push(array[i]);
    }
    return out;
}

function fill(value, length) {
    var out = [];
    for(let i = 0; i < length; i++) {
        out.push(value);
    }
    return out;
}

function MA(array, width) {
    var out = fill(NaN, array.length);
    for(let i = width - 1; i < array.length; i++) {
        let v = slice(array, i - width + 1, i);
        let a = average(v);
        out[i] = a;
    }
    return out;
}

function test() {
    let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let ma1 = MA(array, 5);
    let ma2 = MA(array, 6);
    let ma3 = MA(array, 7);
}