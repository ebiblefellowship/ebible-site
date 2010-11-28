  var items = new Array();
  var display = new Array();
  var currentIndex = [0, 0];
  var active = [false, false];  
  var langIndex = 0;
  var pubIndex = 1;
  $(document).ready(function(){  
    $("#fading-list").innerfade({
      animationtype: 'fade', 
      speed: 'slow', 
      timeout: 'dynamic', 
      type: 'random_start',
      containerheight: '287px',
      controlbox: true,
      controlboxid: 'billboard-sprite-wrap',
      controlprevid: 'back-button',
      controlplayid: 'play-button',
      controlpauseid: 'pause-button',      
      controlnextid: 'forward-button'
    });    
    
    $("#countdown").countdown({until: new Date(2011, 5 - 1, 21, 23, 59, 59), format: 'Od', layout: '{on} {ol}{d<} and {dn} {dl}{d>} Remaining'});
    
    // set the width of the judgment day gradient to the width of the text
    $("#jday-gradient").width($("#jday-link").outerWidth());

    /*
    $("#first-lang").hide();    
    items[langIndex] = $(".lang"); 
    display[langIndex] = $("#lang-display");
    display[langIndex].html($(items[langIndex][currentIndex[langIndex]]).html());
    $("#language-back").bind('click', function(){
      slideEm(langIndex, -1);
      return false;
    });
    $("#language-forward").bind('click', function(){
      slideEm(langIndex, 1);
      return false;
    });
    */
    
    $("#first-pub").hide();
    items[pubIndex] = $(".pub");
    display[pubIndex] = $("#pub-display");
    display[pubIndex].html($(items[pubIndex][currentIndex[pubIndex]]).html());
    $("#back-arrow").bind('click', function(){
      slideEm(pubIndex, -1);
      return false;
    });
    $("#forward-arrow").bind('click', function(){
      slideEm(pubIndex, 1);
      return false;
    });
  });  
  
  function slideEm(index, direction) {    
    if (active[index]) return;   
    active[index] = true;        
    display[index].animate({left: parseInt(display[index].css("left"),10) == 0 ? display[index].outerWidth()*direction : 0}, 300, function() {
      currentIndex[index] = (currentIndex[index] + direction) % items[index].length;
      if (currentIndex[index] < 0) currentIndex[index] = items[index].length - 1;        
      display[index].html($(items[index][currentIndex[index]]).html());
      display[index].css('left', display[index].outerWidth()*-direction);
      display[index].animate({left: parseInt(display[index].css("left"),10) == 0 ? display[index].outerWidth()*direction : 0}, 300, function() {
        active[index] = false;
      });
    });           
  }  
