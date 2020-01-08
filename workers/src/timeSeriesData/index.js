
function setData (map, data, type) {
    if (!map.has(data.time)) {
        map.set(data.time, {});
    }
    const point = map.get(data.time);
    point[type] = data.value;
}

function dataToTimeSeries ([ speed, soc, current, odo, voltage ]) {
    const map = new Map();
    speed.forEach((x) => setData(map, x, 'speed'));
    soc.forEach((x) => setData(map, x, 'soc'));
    current.forEach((x) => setData(map, x, 'current'));
    odo.forEach((x) => setData(map, x, 'odo'));
    voltage.forEach((x) => setData(map, x, 'voltage'));

    return map;
}

module.exports = dataToTimeSeries;