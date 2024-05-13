const canvas = document.querySelector('#vaszon');
const ctx = canvas.getContext('2d');
// Képek

let kepek = {
    madar: new Image(),
    hatter: new Image(),
    oszlop: new Image(),
};

kepek.madar.src = 'bird.png';
kepek.hatter.src = 'bg.png';
kepek.oszlop.src = 'column.png';

// KONSTANSOK

const MADARSZELESSEG = 30;
const MADARMAGASSAG = 50;
const MADARGYORSULAS = 250;
const OSZLOPSZELESSEG = 50;
const RESMAGASSAG = 200;
const OSZLOPSEBESSEG = -200;
const OSZLOPTAVOLSAG = 300;

// ÁLLAPOTTÉR

let madar = {
    x: 50,
    y: (canvas.height - MADARMAGASSAG) / 2,
    szelesseg: MADARSZELESSEG,
    magassag: MADARMAGASSAG,
    vy: 0, //px/s
    ay: MADARGYORSULAS, //px/s^2
}

let oszlopok = [];

let vege = false;

let pont=0;

// KIRAJZOLÁS



draw();

function draw() {
    //ég
    //    ctx.fillStyle = "lightblue";
    //    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(kepek.hatter, 0, 0, canvas.width, canvas.height);

    //madár
    //    ctx.fillStyle = "red";
    //    ctx.fillRect(madar.x, madar.y, madar.szelesseg, madar.magassag);
    ctx.drawImage(kepek.madar, madar.x, madar.y, madar.szelesseg, madar.magassag);


    //oszop

    oszlopok.forEach(oszlop => {
        //       ctx.fillStyle = "white";
        //       ctx.fillRect(oszlop.x, oszlop.y, oszlop.szelesseg, oszlop.magassag);
        ctx.drawImage(kepek.oszlop, oszlop.x, oszlop.y, oszlop.szelesseg, oszlop.magassag);
    });
    // Vége:
    if (vege) {
        ctx.fillStyle = 'red';
        ctx.font = '100px serif';
        ctx.fillText('Vége', 180, 210);
    }
    ctx.fillStyle = 'yellow';
    ctx.font = '20px serif';
    ctx.fillText(pont, 10, 20);
}

// SEGÉDFÜGGVÉNYEK

function ujOszlop() {
    let h = veletlenEgesz(10, canvas.height / 2);
    oszlopok.push(
        {
            x: canvas.width - 10,
            y: 0,
            szelesseg: OSZLOPSZELESSEG,
            magassag: h,
        },
        {
            x: canvas.width - 10,
            y: h + RESMAGASSAG,
            szelesseg: OSZLOPSZELESSEG,
            magassag: canvas.height - h - RESMAGASSAG,
        }
    )
}

function veletlenEgesz(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

ujOszlop();

function utkozikE(a, b) {
    return !(
        b.y + b.magassag < a.y ||
        a.x + a.szelesseg < b.x ||
        a.y + a.magassag < b.y ||
        b.x + b.szelesseg < a.x
    );
}

// JÁTÉKCIKLUS

let elozoIdo = performance.now();
jatekciklus();
function jatekciklus() {
    let mostaniIdo = performance.now();
    let dt = (mostaniIdo - elozoIdo) / 1000;
    elozoIdo = mostaniIdo;
    update(dt);
    draw();
    if (!vege) requestAnimationFrame(jatekciklus);
}

// ÁLLAPOTTÉR VÁLTOZTATÁSA

function update(dt) {
    //madármozgása
    madar.vy += madar.ay * dt;
    madar.y += madar.vy * dt;
    //oszlopmozgása
    oszlopok.forEach(oszlop => {
        oszlop.x += OSZLOPSEBESSEG * dt;
    });
    // Új oszlop létrehozása:
    if (oszlopok[oszlopok.length - 1].x < canvas.width - OSZLOPTAVOLSAG) {
        ujOszlop();
    }
    // Balra kiment oszlop eltávolítása:
    if (oszlopok[0].x + OSZLOPSZELESSEG < 0) { oszlopok.shift(); oszlopok.shift(); pont++;}

    // Ütközésvizsgálatok:
    oszlopok.forEach(oszlop => {
        if (utkozikE(oszlop, madar)) vege = true;
    });

    if (madar.y + MADARMAGASSAG >= canvas.height || madar.y < 0) vege = true;
}

// ESEMÉNYKEZELÉS

document.addEventListener("keydown", event);

function event(e) {
    if (e.key === " ") {
        madar.vy = -200;
    }

}



