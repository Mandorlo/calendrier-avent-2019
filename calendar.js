const fs = require('fs');

let positions = {}

for (let i = 1; i < 26; i++) {
    positions[i] = {
        'top': Math.round(Math.random() * (900 - 2 * 50) + 50),
        'left': Math.round(Math.random() * (1600 - 2 * 50) + 50),
    }
}

fs.writeFileSync('./positions.js', "const positions = " + JSON.stringify(positions, null, '\t'));