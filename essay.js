const net = new brain.NeuralNetwork({

});
var outputData = ["What do you think I'm gonna say? Buy a new one. I ", "Stick a frying pan on the wall, I learned this trick on Pinterest"];
var data = [{
    input: "My computer is running slow.",
    output: 0
},{
    input: "My router doesn't work.",
    output: 1
}];

function submit() {
    console.log(net.run(prompt("What is your IT question?", "My router won't work")));
}
function encode(arg) {
    return arg.split('').map(x => (x.charCodeAt(0) / 256));
}
                                                                                              
function question() {
   
}

function trainet() {
    
}