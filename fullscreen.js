function openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
};
function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };
var full = false;
var button = document.getElementById('btn-download');
button.onclick = function(e) {
  saveCanvas(canvas, "Your Beautiful Drawing",  'png');
};
var button1 = document.getElementById('fs');
var sc = document.getElementById('fullscreen');
button1.onclick = function(event) {
    switch (full) {
        case false:
            full = true;
            openFullscreen(sc);
            break;
        case true:
            full = false;
            closeFullscreen(sc);
            break;
    };
};