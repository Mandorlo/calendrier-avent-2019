const fs = require('fs');

let positions = []

let width = 1450;
let height = 900;
let margin = 20;
let min_distance = 200; // minimum distance between points

for (let i = 1; i < 26; i++) {
    let pos = {
        'top': Math.round(Math.random() * (height - 2 * margin) + margin),
        'left': Math.round(Math.random() * (width - 2 * margin) + margin),
    }
    let k = 0;
    while (!distantEnough(pos, positions, min_distance) && k < 30) {
        k++;
        pos = {
            'top': Math.round(Math.random() * (height - 2 * margin) + margin),
            'left': Math.round(Math.random() * (width - 2 * margin) + margin),
        }
    }
    if (k >= 30) console.log('failed for ' + i);
    positions[i] = pos
}

function distantEnough(p1, point_list, max_dist) {
    for (let p of point_list) {
        if (!p || !p.top) continue;
        if (dist(p1, p) < max_dist) return false;
    }
    return true;
}

function dist(p1, p2) {
    return Math.sqrt((p1.top - p2.top)**2 + (p1.left - p2.left)**2)
}

fs.writeFileSync('./positions.js', "const positions = " + JSON.stringify(positions, null, '\t'));