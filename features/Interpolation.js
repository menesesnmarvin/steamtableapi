function Compute (y1, y2, x, x1, x2) {
    let result1 = (x - x1) / (x2 - x1);

    let result2 = y2 - y1;

    let y = (result1 * result2) + y1;

    return y;
} 

module.exports = { Compute };