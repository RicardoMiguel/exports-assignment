
function toCsv (timeSeriesData) {
    let string = 'time,speed,soc,current,odo,voltage\n';
    for (const [k, v] of timeSeriesData) {
        const speed = v.speed || '';
        const soc = v.soc || '';
        const current = v.current || '';
        const odo = v.odo || '';
        const voltage = v.voltage || '';

        string += `${k},${speed},${soc},${current},${odo},${voltage}\n`;
    }

    return string;
}

module.exports = toCsv;