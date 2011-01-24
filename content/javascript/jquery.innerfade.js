// jquery.innerfade.js
// Datum: 2008-02-14
// Firma: Medienfreunde Hofmann & Baldes GbR
// Author: Torsten Baldes
// Mail: t.baldes@medienfreunde.com
// Web: http://medienfreunde.com
// based on the work of Matt Oakes http://portfolio.gizone.co.uk/applications/slideshow/
// and Ralf S. Engelschall http://trainofthoughts.org/
//
// also based on jquery.animated.innerfade.js
// Datum: 2007-10-30
// Firma: OpenStudio
// Autor: Arnault PACHOT
// Mail: apachot@openstudio.fr
// Web: http://www.openstudio.fr
//
// *** modified by Greg Seifert on 5/15/2009 for ebiblefellowship.com ***
(function($) {
  $.fn.innerfade = function(options) {        
    return this.each(function() {   
      $.innerfade(this, options);
    });
  };
  
  $.innerfade = function(container, options) {    
    var settings = {    
      animationtype: 'fade',
      speed: 'normal',
      type: 'sequence',
      timeout: 2000,
      containerheight: 'auto',
      runningclass: 'innerfade',
      children: null,
      fr: null, 
      controlbox: false, 
      controlboxid: 'control-box',
      controlbuttonspath: 'images',
      controlprevid: 'back-button',
      controlplayid: 'play-button',
      controlpauseid: 'pause-button',      
      controlnextid: 'forward-button',
      tabs: false,
      tabsid: 'tabs',
      tabids: [ 'tab-1', 'tab-2', 'tab-3' ],
      tabindexes: [ 0, 5, 10 ]
    };    
    
    if (options) $.extend(settings, options);
    if (settings.children == null) var elements = $(container).children();
    else var elements = $(container).children(settings.children);
    if (elements.length > 1) {
      settings.active = false;      
      switch (settings.type) {
        case 'random_start':
          settings.type = 'sequence';
          settings.prev = Math.floor((Math.random()%1) * elements.length);
          settings.current = (settings.prev + 1) % elements.length;
          settings.next = (settings.current + 1) % elements.length;
          break;
        case 'shuffle':
          settings.type = 'sequence';
        case 'random':
          shuffle(elements);
        case 'sequence':
          settings.prev = elements.length - 1;
          settings.current = 0;
          settings.next = 1;
          break;
        default:
          return;
      }
      
      $(container).css('position', 'relative').css('height', (settings.containerheight == 'dynamic') ? $(elements[settings.current]).height() : settings.containerheight).addClass(settings.runningclass);
      for (var i = 0; i < elements.length; i++) {
        $(elements[i]).css('z-index', String(elements.length-i)).css('position', 'absolute').hide();
      };
      
      fandr(settings.fr, elements[settings.current]);
      settings.timer = setTimeout(function() {        
        $.innerfade.next(container, elements, settings);
      }, (settings.timeout == 'dynamic') ? getTimeout(settings.current) : settings.timeout);
      $(elements[settings.current]).show();     

      if (settings.controlbox) {
        if ($("#"+settings.controlboxid).length == 0) $(container).before("<div id='"+settings.controlboxid+"'><a id='"+settings.controlprevid+"' href='#'><img src='"+settings.controlbuttonspath+"/previous.gif' alt='Previous' style='border: none;' /></a> <a id='"+settings.controlplayid+"' href='#'><img src='"+settings.controlbuttonspath+"/play.gif' alt='Play' style='border: none;' /></a> <a id='"+settings.controlpauseid+"' href='#'><img src='"+settings.controlbuttonspath+"/pause.gif' alt='Pause' style='border: none;' /></a> <a id='"+settings.controlnextid+"' href='#'><img src='"+settings.controlbuttonspath+"/next.gif' alt='Next' style='border: none;' /></a></div>");
        $("#"+settings.controlpauseid).show();
        $("#"+settings.controlplayid).hide();
        $("#"+settings.controlboxid).show();
        $("#"+settings.controlnextid).bind('click', function() { if (settings.active) return false; clearTimeout(settings.timer); $("#"+settings.controlpauseid).show(); $("#"+settings.controlplayid).hide(); $.innerfade.next(container, elements, settings); return false; });
        $("#"+settings.controlprevid).bind('click', function() { if (settings.active) return false; clearTimeout(settings.timer); $("#"+settings.controlpauseid).show(); $("#"+settings.controlplayid).hide(); settings.next = settings.prev; $.innerfade.next(container, elements, settings); return false; });
        $("#"+settings.controlpauseid).bind('click', function() {                   
          if (settings.active) return false;
          clearTimeout(settings.timer);          
          $(this).hide();
          $("#"+settings.controlplayid).show();
          $(elements[settings.current]).stop().stop();
          return false;
        });
        $("#"+settings.controlplayid).bind('click', function() {                   
          if (settings.active) return false;
          clearTimeout(settings.timer);          
          $(this).hide();
          $("#"+settings.controlpauseid).show();
          $.innerfade.next(container, elements, settings);          
          return false;
        });
      }
      
      if (settings.tabs) {        
        $("#"+settings.tabsid).show();
        for (var i=0;i<settings.tabids.length;i++) {            
          $("#"+settings.tabids[i]).bind('click', {tab: i}, function(event) { 
            if (settings.active) return false;
            clearTimeout(settings.timer);
            $("#"+settings.controlpauseid).show(); 
            $("#"+settings.controlplayid).hide();            
            settings.next = settings.tabindexes[event.data.tab];
            settings.prev = settings.next;
            $.innerfade.next(container, elements, settings); return false; 
          });
        }
      }
    }
    else {
      if ($("#"+settings.controlboxid).length > 0) $("#"+settings.controlboxid).hide();
      if ($("#"+settings.tabsid).length > 0) $("#"+settings.tabsid).hide();
      if (elements.length == 1 && settings.containerheight == 'dynamic') $(container).css('height', $(elements[0]).height());
    }
  };

  $.innerfade.next = function(container, elements, settings) {    
    settings.active = true;
    clearTimeout(settings.timer);   
    if (settings.containerheight == 'dynamic') {      
      if ($(elements[settings.next]).height() < $(elements[settings.current]).height()) {
        var nextIndex = settings.next;
        animateDisplay($(elements[settings.current]), settings, 'hide', function() {
          $height = $(elements[nextIndex]).height();
          if ($height > 0) $(container).css('height', $height);
          fandr(settings.fr, elements[nextIndex]);            
        });
      }
      else {  
        $height = $(elements[settings.next]).height();
        if ($height > 0) $(container).css('height', $height);
        fandr(settings.fr, elements[settings.next]);
        animateDisplay($(elements[settings.current]), settings, 'hide');        
      }
    }
    else {
      fandr(settings.fr, elements[settings.next]);
      animateDisplay($(elements[settings.current]), settings, 'hide');
    }
    animateDisplay($(elements[settings.next]), settings, 'show', function() {     
      settings.active = false;
      if (settings.animationtype == 'fade') removeFilter($(this)[0]);
    });
    
    if (settings.next == settings.prev) {
      if (settings.type == 'sequence') {
        var i = settings.prev - 1;
        if (i < 0) i = elements.length - 1;
        settings.prev = i;
      }
      else {
        settings.prev = Math.floor((Math.random()%1) * elements.length);
        if (settings.next == settings.prev) settings.prev = (settings.next + 1) % elements.length;
      }
    }
    else settings.prev = settings.current;
    settings.current = settings.next;   
    if (settings.type == 'sequence') {            
      settings.next = (settings.current + 1) % elements.length;       
    }
    else {
      settings.next = Math.floor((Math.random()%1) * elements.length);
      if (settings.current == settings.next) settings.next = (settings.current + 1) % elements.length;
    }
    
    settings.timer = setTimeout(function() {      
      $.innerfade.next(container, elements, settings);
    }, (settings.timeout == 'dynamic') ? getTimeout(settings.current) : settings.timeout);
  };
})(jQuery);

// **** remove Opacity-Filter in ie ****
function removeFilter(element) {
  if (element.style.removeAttribute) {
    element.style.removeAttribute('filter');
  }
}

// slide or fade
function animateDisplay(element, settings, display, callback) {
  if (settings.animationtype == 'slide') {
    if (display == 'hide') element.slideUp(settings.speed, callback);
    else if (display == 'show') element.slideDown(settings.speed, callback);
  }
  else if (settings.animationtype == 'fade') {
    if (display == 'hide') element.fadeOut(settings.speed, callback);
    else if (display == 'show') element.fadeIn(settings.speed, callback);
  }
}

// shuffle the array
function shuffle(a) {
  var i, j, k;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor((Math.random()%1) * (i + 1));
    k = a[i];
    a[i] = a[j];
    a[j] = k;
  }
}

// find and replace html
function fandr(fr, element) {
  if (fr != null) $(fr.find).html($(element).find(fr.replace).html());  
}

// dynamic timeout based on the "billboard" div order
// these timeout values need to be appropriate for the content of each "panel"
// so if the panels are updated, update the comment description and adjust the timeout if needed
function getTimeout(index) {
  var timeout;  
  switch (index) {
    case 0: // continents/countries listing
      timeout = 4000;
      break;
    case 1: // billboards
      timeout = 4000;
      break;
    case 2: // billboards
      timeout = 4000;
      break;      
    case 3: // billboards
      timeout = 4000;
      break;      
    case 4: // billboards
      timeout = 4000;
      break;
    case 5: // billboards
      timeout = 4000;
      break;
    case 6: // billboards
      timeout = 4000;
      break;
    case 7: // billboards
      timeout = 4000;
      break;
    case 8: // billboards
      timeout = 4000;
      break;
    case 9: // moving billboards
      timeout = 4000;
      break;
    case 10: // moving billboards
      timeout = 4000;
      break;
    case 11: // outreach map
      timeout = 8000;
      break;
    case 12: // we can know
      timeout = 8000;
      break;      
    case 13: // family radio
      timeout = 8000;
      break;
    case 14: // request comments
      timeout = 11000;
      break;      
    case 15: // request comments
      timeout = 11000;
      break;      
    case 16: // request comments
      timeout = 11000;
      break;      
    case 17: // request comments
      timeout = 11000;
      break;            
    case 18: // request comments
      timeout = 11000;
      break;
    case 19: // request comments
      timeout = 11000;
      break;
    case 20: // request comments
      timeout = 11000;
      break;
    case 21: // request comments
      timeout = 11000;
      break;          
    default:
      timeout = 15000;      
  }  
  return timeout;
}