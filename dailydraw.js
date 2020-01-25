function setup() {
    var canvas = createCanvas(710, 400);
    canvas.parent('drawholder');
    background(100);
    strokeWeight(4);
    stroke(color(document.getElementById("bcolor").value.toString()));
}
function draw() {
    if(mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
    }
    stroke(color(document.getElementById("bcolor").value.toString()));
}
function cleardraw() {
    background(100);
}