var percent = document.getElementById("myBar");
function submit() {
    var rawData = document.getElementById("input");
    var q = document.getElementById("q");
    var a = document.getElementById("answer");
    const data = rawData.value.toString().toLowerCase().split(/[\.\,\?\!\;]/);
    var maxIter = parseInt(prompt("How much training? (More training takes longer but provides higher quality results)", "1000"))
    var increment = 100/maxIter;
    viewBar(true);
    console.log("Training neural net...");
    const d = new Date();
    if(window.Worker) {
        var worker = new Worker('worker.js');
        worker.postMessage([data, maxIter]);
        worker.onmessage = function(e) {
            if(e.data[1] == 0) {
                progress(e.data)
            } else if(e.data[1] == 1) {
                const net = e.data;
            } else {
                var stats = e.data;
            }
        }
    }
    else {
        console.warn("Because web workers not supported, program is running on single thread. You will get a huge lag spike.");
        var stats = net.train(data, {
        iterations: maxIter,
        log: function() {
            console.log();
        },
        logPeriod: 1,
        learningRate: 0.6
        });
    }
    viewBar(false)
    console.log("iterations: " + stats.iterations.toString() + " training error: " + stats.error.toString());
    console.log(`Neural net trained in ${(new Date() - d) /1000} seconds.`);
    q.style.display = "block";
    a.style.display = "block";
}
function question() {
    q = document.getElementById("q");
    var ans = document.getElementById("answer");
    ans.innerHTML = net.run(q.value.toString) + ".";
}
function progress(Bpercent=0) {
    percent.style.width = Bpercent + "%";
    percent.innerHTML = Bpercent + "%";
    return Bpercent

}
function viewBar(bool) {
    if(bool) {
        document.querySelector("#loading").style.display = "block";
    }
    else {
        document.querySelector("#loading").style.display = "none";
    }
}
document.getElementById("input").onchange = question();