function main() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('range');
    const subs = document.getElementById('subs');
    canvas.width = 400;
    canvas.height = 400;
    canvas.setAttribute('style', "position: absolute;  left: 50%; margin-left:-200; top: 50%; margin-top:-150px");

    const size = canvas.clientWidth;
    let subdivisions = 0;

    slider.oninput = function() {
        subdivisions = this.value;
        subs.innerHTML = subdivisions;
        update(ctx, size, subdivisions);
    }
    update(ctx, size, subdivisions);
}

function update(ctx, size, subdivisions) {
    ctx.clearRect(0, 0, size, size);
    let triangulo = new triangle(0, 0, size, subdivisions);
    triangulo.createTriangle(ctx);
}

class triangle {
    constructor(x, y, base, subdivisions) {
        this.x = x;
        this.y = y;
        this.base = base;
        this.height = base/2*1.3;
        this.subdivisions = subdivisions;
    }
    
    createTriangle = ctx => {
        const { x, y, base, height, subdivisions } = this;
        
        if (subdivisions == 0) {
            ctx.beginPath();
            ctx.moveTo(x, y + height);
            ctx.lineTo(x + base, y + height);
            ctx.lineTo(x + base/2, y);
            ctx.closePath();
            ctx.fill();
        } else {
            let t1 = new triangle(x, y + height/2, base/2, subdivisions - 1);
            let t2 = new triangle(x + base/2, y + height/2, base/2, subdivisions - 1);
            let t3 = new triangle(x + base/4, y, base/2, subdivisions - 1);
            t1.createTriangle(ctx);
            t2.createTriangle(ctx);
            t3.createTriangle(ctx);
        }
    }
}