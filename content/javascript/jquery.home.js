  var items = new Array();
  var display = new Array();
  var currentIndex = [0, 0];
  var active = [false, false];  
  var langIndex = 0;
  var pubIndex = 1;
  $(document).ready(function(){     
    
    $("#countdown").countdown({until: new Date(2011, 5 - 1, 21), format: 'Od', layout: '{on} {ol}{d<} and {dn} {dl}{d>} Remaining'});
    
    // ie6 fix grey gradient on homepage
    if(typeof document.body.style.maxHeight === "undefined") {
      var spacerDiv = "<div style='font-size: 0px; height: 0px; margin-top: 0px; margin-bottom: 0px;'>&nbsp;</div>";
      $(".grey-gradient").after(spacerDiv);      
    }
    // set the width of the judgment day gradient to the width of the text
    // $("#jday-gradient").width($("#jday-link").outerWidth());

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
    
    var verseIndex = Math.floor((Math.random()%1) * 7) + 1; // adjust if the number of verse images changes
    var img = $("#verse-home-wrap>img");
    var src = img.attr("src");    
    src = src.substring(0, src.lastIndexOf('/')+1) + 'verse' + verseIndex + ".png";    
    img.attr("src", src);
    $("#verse-home-wrap").onImagesLoad({
        callbackIfNoImagesExist: true,
        selectorCallback: function() {
          //$("#verse-home-wrap").show();
          $("#verse-home-wrap").css("visibility", "visible");
        }
      });    
    
    $("#first-pub").hide();
    items[pubIndex] = $(".pub");
    currentIndex[pubIndex] = Math.floor((Math.random()%1) * items[pubIndex].length);
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

    // load the rest of the billboards    
    $.ajaxSetup({ cache: false });
    $("#fading-list").load('panels/index.html', function() {
      $("#fading-list").onImagesLoad({
        callbackIfNoImagesExist: true,
        selectorCallback: function() {
          $("#fading-list").innerfade({
            animationtype: 'fade', 
            speed: 'slow', 
            timeout: 'dynamic', 
            type: 'sequence',
            containerheight: '287px',
            controlbox: true,
            controlboxid: 'billboard-sprite-wrap',
            controlprevid: 'back-button',
            controlplayid: 'play-button',
            controlpauseid: 'pause-button',      
            controlnextid: 'forward-button',
            tabs: true,
            tabsid: 'tabs-wrap',
            tabids: [ 'billboards', 'features', 'comments' ],
            tabindexes: [ 0, 17, 20 ]            
          });
        }
      });
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
