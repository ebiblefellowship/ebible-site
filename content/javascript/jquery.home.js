  var items = new Array();
  var display = new Array();
  var currentIndex = [0, 0];
  var active = [false, false];  
  var langIndex = 0;
  var pubIndex = 1;
  var isPanelEnabled = false;

  $(document).ready(function(){     
    
    //var jDay = new Date(Date.UTC(2011, 5 - 1, 22, 11,59,59));  // last place its May 21: UTC-12:00 is 5/22 at 11:59
    //if (new Date() <= jDay) {
        //$("#countdown").html("It is still May 21 in parts of the world");
    //}

    //$("#countdown").countdown({until: new Date(2011, 5 - 1, 21), format: 'Od', layout: '{on} {ol}{d<} and {dn} {dl}{d>} Remaining'});
    //$("#countdown").countdown({until: new Date(2011, 5 - 1, 21), format: 'D', layout: '{dn} {dl} Remaining'});
    
    // ie6 fix grey gradient on homepage
    if(typeof document.body.style.maxHeight === "undefined") {
      var spacerDiv = "<div style='font-size: 0px; height: 0px; margin-top: 0px; margin-bottom: 0px;'>&nbsp;</div>";
      $(".grey-gradient").after(spacerDiv);      
    }
    // set the width of the judgment day gradient to the width of the text
    // $("#jday-gradient").width($("#jday-link").outerWidth());

    
    /* $("#first-lang").hide();    
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
    
  if (isPanelEnabled) {
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
            timeout: 5000,  // 'dynamic', // all the same for March 2012 Purim
            type: 'sequence',
            containerheight: '287px',
            controlbox: true,
            controlboxid: 'billboard-sprite-wrap',
            controlprevid: 'back-button',
            controlplayid: 'play-button',
            controlpauseid: 'pause-button',      
            controlnextid: 'forward-button',
            tabs: false,  // no tabs for March 2012 Purim
            tabsid: 'tabs-wrap',
            tabids: [ 'billboards', 'features', 'comments' ],
            tabindexes: [ 0, 24, 26 ]            
          });
        }
      });
    });
   }  // isPanelEnabled
 });  // document.ready
  
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
