
var string = "Parabéns por ter finalizado todo o site dos isômeros!"; /* type your text here */
var array = string.split("");
var timer;

function frameLooper () {
  if (array.length > 0) {
    document.getElementById("text").innerHTML += array.shift();
  } else {
    clearTimeout(timer);
      }
  loopTimer = setTimeout('frameLooper()',70); /* change 70 for speed */

}
frameLooper();
