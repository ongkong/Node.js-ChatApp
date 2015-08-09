function roomlistcntr(){
var clicked = false, that = {}, list = document.getElementById('userlist'), button = document.getElementsByClassName('getlist')[0];
  that.listpopout = function(){
    if (clicked){
      function decOpacity(){
        if (parseFloat(list.style.opacity, 10) <= 0){
          window.clearInterval(unfade);
          list.style.opacity = 0;
        }  else {
          list.style.opacity = parseFloat(parseFloat(list.style.opacity, 10).toFixed(1)) - .1
        }
      }
      button.classList.toggle('active');
      clicked = false;
      var unfade = window.setInterval(decOpacity, 10);
    }  else {
      function incOpacity(){
        if (parseFloat(list.style.opacity, 10) >= 1){
          window.clearInterval(fade);
        }  else {
          list.style.opacity = parseFloat(list.style.opacity,10) + .1
        }
      }
      button.classList.toggle('active');
      clicked = true;
      var fade = window.setInterval(incOpacity, 10);
    }
  };
  return that;
};
document.getElementById('userlist').style.opacity = 0;
document.getElementsByClassName('getlist')[0].onclick = roomlistcntr().listpopout;
