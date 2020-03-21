const net = new brain.recurrent.LSTM();
const rawData = document.getElementById("input");
const a = document.getElementById("answer");
const pcnt = document.getElementById("pcnt");
function submit() {
    loading(true);
    const data = rawData.value.toString().toLowerCase().split(/[\.\,\?\!\;]/);
    var maxIter = parseInt(prompt("How much training? (More training takes longer but provides higher quality results)", "500"))
    var increment = 100/maxIter;
    var step = 0; 
    console.log("Training neural net...");
    const d = new Date();
    const stats = net.train(data, {
        iterations: maxIter,
        log: false,
        callback: function() {
            step += increment;
            console.log(Math.round(step) + "%");
        },
        callbackPeriod: 1,
        learningRate: 1.6
    });
    console.log(`Net trained in ${(new Date() - d) /1000} seconds.`);
    //console.log(`Net trained in ${maxIter} iterations.`);
    console.log(stats)
    a.style.display = "block";
    loading(false);
}
function question() {
    a.innerHTML = net.run(prompt("Question?")) + ".";
}
function loading(bool) {
    if(bool) {
        document.getElementById("loading").style.display = "block";
    } else {
        document.getElementById("loading").style.display = "none";
    }
}
