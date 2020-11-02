const baseInterval = 100
const minPlayableInterval = 30
let interval = baseInterval

window.onload = function () {
    canv = document.getElementById("gc");
    ctx = canv.getContext("2d");
    scoreField = document.getElementById("score");
    highScoreField = document.getElementById("highScore");
    levelField = document.getElementById("level");
    document.addEventListener("keydown", keyPush);
    timeout()
    function timeout() {
        setTimeout(function () {
            game()
            timeout();
        }, interval);
    }
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
let score = 0
let highscore = 0
let level = 0

const appleTtl = 20
const appleTimeBonus = 3

const numOfApples = 3
let applesRemaining = 0

let ctx
let canv
let scoreField
let highScoreField
let levelField

function game() {

    scoreField.textContent = score
    highScoreField.textContent = highscore
    levelField.textContent = level

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

    fillGameField();

    for (let i = 0; i < trail.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
        if (trail[i].x == px && trail[i].y == py) {
            tail = stLength;
            applesRemaining = 0
            colors = ['lime', 'lime', 'lime']
            interval = baseInterval
            if (score > highscore) {
                highscore = score
            }
            score = 0
            level = 0
        }
    }

    trail.push({ x: px, y: py });
    while (trail.length > tail) {
        trail.shift();
    }

    apples.forEach(a => {
        if (a.timeBonus > 0 && a.ttl % 2 != 0) {
            ctx.fillStyle = "gold"
            ctx.fillRect(a.x * gs, a.y * gs, gs, gs);
        }
        ctx.fillStyle = a.color
        ctx.fillRect(a.x * gs + 2, a.y * gs + 2, gs - 4, gs - 4);
    });

    for (let i = 0; i < apples.length; i++) {
        if (apples[i].x == px && apples[i].y == py) {
            if (apples[i].ttl >= 0) {
                interval += apples[i].ttl
            }
            if (interval - 1 > minPlayableInterval) {
                interval--
            }

            colors.push(apples[i].color)
            tail++;

            if (apples[i].ttl < 0) { applesRemaining-- }

            if (level != 0) {
                let ttlBonus = apples[i].ttl >= 0 ? apples[i].ttl : 0
                score += apples[i].scoreBonus + ttlBonus
            }
            apples = apples.filter(function (value, index, arr) { return index != i })
            if (score > highscore) {
                highscore = score
            }
        }
    }

    if (applesRemaining == 0) {
        if (interval - level >= minPlayableInterval) { interval -= level }
        apples = apples.filter(function (value, index, arr) { return value.ttl > 0 && level != 0 })
        for (let i = 0; i < numOfApples; i++) {
            ax = Math.floor(Math.random() * tc);
            ay = Math.floor(Math.random() * tc);
            let color = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
            apples.push({ x: ax, y: ay, color: color, ttl: -1, timeBonus: 0, scoreBonus: 1 })
            // ctx.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
            applesRemaining = numOfApples
        }

        ax = Math.floor(Math.random() * tc);
        ay = Math.floor(Math.random() * tc);

        if (level != 0) {
            score += 3 * level
        }
        level += 1
        apples.push({ x: ax, y: ay, color: "red", ttl: appleTtl, timeBonus: appleTimeBonus, scoreBonus: level })
    }

    apples = apples.filter(function (value, index, arr) { return value.ttl != 0 })

    apples.forEach(function (part, index, theArray) {
        if (theArray[index].ttl > 0) {
            theArray[index].ttl -= 1
        }
    });

    function fillGameField() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canv.width, canv.height);
    }
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
