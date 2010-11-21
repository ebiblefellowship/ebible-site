// ebiblefellowship.com configuration for Google Analytics
// Docs on jQuery Google Analytics plugin: http://github.com/christianhellsten/jquery-google-analytics
// http://www.ebiblefellowship.com site key
$.trackPage('UA-11909859-1');
// After page finishes loading, bind click tracking to some a href's
$(document).ready(function() {
  // Docs on jQuery selectors: http://docs.jquery.com/Selectors
  // WARNING: any JavaScript syntax errors cause all tracking to break!
  $("a[href$='mp3'], a[href$='m3u']").track({ category : 'audio' });
  $("a[href$='pdf']").track({ category : 'pdf' });
  $("a[href^='mailto:']").track({ category : 'mailto' });
});
// end

