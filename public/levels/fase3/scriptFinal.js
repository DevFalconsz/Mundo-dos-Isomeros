
var string = "Parabéns por ter finalizado todo o site dos isômeros!"; /* type your text here */
var array = string.split("");
var timer;

var somRoleta = new Audio();
somRoleta.src = 'audio/somFinal.wav';
somRoleta.volume = 0.2;
somRoleta.load();

function tocarAudioRoleta(){
  somRoleta.play();
  somRoleta.loop="loop";
}

function frameLooper () {
  if (array.length > 0) {
    document.getElementById("text").innerHTML += array.shift();
  } else {
    clearTimeout(timer);
      }
  loopTimer = setTimeout('frameLooper()',70); /* change 70 for speed */

}

tocarAudioRoleta();
frameLooper();
