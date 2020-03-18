importScripts("https://cdn.rawgit.com/BrainJS/brain.js/45ce6ffc/browser.js");
const net = new brain.recurrent.LSTM();
onmessage = function(e) {
    data = e.data[0];
    maxIter = e.data[1];
    increment = 100/maxIter;
    p = 0;
    var stats = net.train(data, {
        iterations: maxIter,
        log: function() {
            p += increment;
            postMessage([p, 0]);
        },
        logPeriod: 1,
        learningRate: 0.6
    });
    postMessage([net, 1]);
    postMessage([stats, 2]);
}