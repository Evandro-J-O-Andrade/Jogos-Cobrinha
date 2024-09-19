window.onload = function () {
    var stage = document.getElementById("stage");
    var ctx = stage.getContext("2d");

    setInterval(game, 60);

    const vel = 1;
    var vx = 0, vy = 0;
    var px = 10, py = 15;
    var lp = 20;
    var qp = 20;
    var ax = 15, ay = 15;
    var trail = [];
    var tail = 5;

    function game() {
        px += vx;
        py += vy;

        if (px < 0) {
            px = qp - 1;
        }
        if (px > qp - 1) {
            px = 0;
        }
        if (py < 0) {
            py = qp - 1;
        }
        if (py > qp - 1) {
            py = 0;
        }

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, stage.width, stage.height);
    }
}
