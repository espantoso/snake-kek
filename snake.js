window.onload = function () {
    canv = document.getElementById("gc");
    ctx = canv.getContext("2d");
    document.addEventListener("keydown", keyPush);
    setInterval(game, 1000 / 10);
}

const stLength = 3

let px = 10
let py = 10
let gs = 20
let tc = 20
let ax = 15
let ay = 15
let xv = 0
let yv = 0;
let trail = [];
let apples = []
let tail = stLength;
let colors = ['lime', 'lime', 'lime']

let started = false

const numOfApples = 3
let applesRemaining = 0

let ctx
let canv

function game() {
    px += xv;
    py += yv;
    if (px < 0) {
        px = tc - 1;
    }
    if (px > tc - 1) {
        px = 0;
    }
    if (py < 0) {
        py = tc - 1;
    }
    if (py > tc - 1) {
        py = 0;
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);

    for (let i = 0; i < trail.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
        if (trail[i].x == px && trail[i].y == py) {
            tail = stLength;
            applesRemaining = 0
            colors = ['lime', 'lime', 'lime']
        }
    }

    trail.push({ x: px, y: py, color: 'lime' });
    while (trail.length > tail) {
        trail.shift();
    }

    apples.forEach(a => {
        ctx.fillStyle = a.color
        ctx.fillRect(a.x * gs, a.y * gs, gs - 2, gs - 2);
    });

    for (let i = 0; i < apples.length; i++) {
        if (apples[i].x == px && apples[i].y == py) {
            colors.push(apples[i].color)
            tail++;
            applesRemaining--
            apples = apples.filter(function (value, index, arr) { return index != i })
        }
    }

    if (applesRemaining == 0) {
        apples = []
        for (let i = 0; i < numOfApples; i++) {
            ax = Math.floor(Math.random() * tc);
            ay = Math.floor(Math.random() * tc);
            let color = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
            apples.push({ x: ax, y: ay, color: color })
            // ctx.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
            applesRemaining = numOfApples
        }
    }
    started = true
}

function keyPush(evt) {
    switch (evt.keyCode) {
        case 37:
            if (xv != 1) {
                xv = -1; yv = 0;
            }
            break;
        case 38:
            if (yv != 11) {
                xv = 0; yv = -1;
            }
            break;
        case 39:
            if (xv != -1) {
                xv = 1; yv = 0;
            }
            break;
        case 40:
            if (yv != -1) {
                xv = 0; yv = 1;
            }
            break;
    }
}
