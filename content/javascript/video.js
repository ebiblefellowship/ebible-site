  var queryVideo = false;
  var feeds = [   
    {path: '', id: 'ebible', page: '1', excludeTag: 'TFTB'}, 
    {path: '', id: 'ebible', page: '2', excludeTag: 'TFTB'}, 
    {path: '', id: 'ebible', page: '3', excludeTag: 'TFTB'},
    {path: 'album/',id: '1523895', page: '1'},
    {path: 'album/',id: '1472823', page: '1'},    
    {path: '', id: 'bmi', page: '1', excludeTag: ''}, 
    {path: '', id: 'bmi', page: '2', excludeTag: ''},
    {path: '', id: 'bmi', page: '3', excludeTag: ''}
  ]        
  var fullNames = new Array();
  fullNames['1523895'] = 'Bible Reading';
  fullNames['1472823'] = 'Thought From The Bible';
  fullNames['ebible'] = 'EBible Fellowship';
  fullNames['bmi'] = 'Bible Ministries International';      
  fullNames['youtube'] = 'YouTube';
  var active = new Array();
  active['ebible'] = false;
  active['bmi'] = false;
  active['youtube'] = false;
  var autoHeights = new Array();
  var defaultHeight = '362px';
  var feedIndex = 0;
  var currentUserName = '';      
  var allContainerElement = '#all-videos';
  $(document).ready(function(){
    queryVideo = loadQueryVideo();
    $('#loading').show();
    $.ajaxSetup({ cache: false });        
    $.getScript('http://www.vimeo.com/api/v2/'+feeds[feedIndex].path+feeds[feedIndex].id+'/videos.json?callback=getVimeoVideos');
  });
    
  function loadQueryVideo() {		
    var q = $.parseQuery();
    if (q.type != 'yt' && q.type != 'v') return false;
    $('#video-player').insertBefore(allContainerElement);
    if (q.type == 'yt') loadYouTubeVideo(q.video, q.title);
    else loadVimeoVideo('http://vimeo.com/'+q.video);
    return true;
  }

  function startErUp(userName) {
    $('<div class="videos" id="videos-'+userName+'"><div class="contentbar-top"><\/div><div class="contentbar-mid" id="contentbar-mid-'+userName+'"><h2>'+fullNames[userName]+' Videos<\/h2><div class="plus-icon" id="plus-icon-'+userName+'"><span class="plus"><img src="/assets/images/plus-icon.jpg"><\/span><p>view<br>all<\/p><\/div><div class="vimeoBadge" id="vimeoBadge-'+userName+'"><\/div><\/div>').appendTo(allContainerElement);
  }

  function slideEm(userName) {
    // expand or collapse section when + or - is clicked      
    if (active[userName]) return;   
    active[userName] = true;
    var img = $('#plus-icon-'+userName+'>span>img');
    img.attr('src', (img.attr('src').toLowerCase().indexOf('plus-icon.jpg') != -1) ? '/assets/images/minus-icon.jpg' : '/assets/images/plus-icon.jpg');    
    var p = $('#plus-icon-'+userName+'>p');            
    p.html((p.html().toLowerCase() == 'view<br>all') ? 'hide' : 'view<br>all');
    var div = $('#contentbar-mid-'+userName);
    div.animate({height: div.css('height') == defaultHeight ? autoHeights[userName] : defaultHeight}, 1000, function() {
      active[userName] = false;
    });
    return false;
  }

  function closeErOut(userName) {
    $('<div class="contentbar-bottom"><\/div>').appendTo(allContainerElement);
    autoHeights[userName] = $('#contentbar-mid-'+userName).height();
    $('#contentbar-mid-'+userName).css('height', defaultHeight);        
    if (parseFloat(autoHeights[userName]) <= parseFloat(defaultHeight)+20) $('#plus-icon-'+userName).hide();
    $('#videos-'+userName).css('visibility', 'visible');
  }

  function getYouTubeVideos(data) {
    var userName = 'youtube';        
    startErUp(userName);        
    $('#plus-icon-'+userName).bind('click', function(){ slideEm(userName); });        
    var container = $('#vimeoBadge-'+userName);
    if (data.feed.entry) {
      // loop through the videos, adding them to the list
      $.each(data.feed.entry, function(i, entry){
        // search the links for the url
        $.each(entry.link, function(j, link){
          if (link.rel == 'alternate') {
            url = link.href;
            return false;
          }
        });
        var id = getVideoId(url);
        var overlayLink = 'javascript:loadYouTubeVideo(\''+id+'\');';            
        var time = pad(Math.floor(entry.media$group.yt$duration.seconds/60))+':'+pad(entry.media$group.yt$duration.seconds%60);            
        var div = $('<div class="clip" id="'+id+'"><a href="'+overlayLink+'" title="'+entry.yt$description.$t+'"><img src="'+entry.media$group.media$thumbnail[0].url+'" border="0" width="120px" height="90px"><\/a><div class="caption"><a href="'+overlayLink+'">'+entry.title.$t+'<\/a><p>Time: '+time+'<\/p><\/div><\/div>');
        container.append(div);            
      });
    }
    else {
      container.append('No videos available.');
    }        
    closeErOut(userName);
    // hide the loading indicator (but preserve the space in the layout)
    $('#loading').css('visibility', 'hidden');
  }

  var oldVideos = 'TFTB'; // filter out "Treasures From The Bible" videos from bmi
  function getVimeoVideos(data) {
    var userName = feeds[feedIndex].id;        
    // add new section if new user name
    if (userName != currentUserName) {
      // close out and show previous section if needed
      if (currentUserName != "") {
        closeErOut(currentUserName);
      }
      // start the new section
      startErUp(userName);
      $('#plus-icon-'+userName).bind('click', function(){ slideEm(userName); });          
      currentUserName = userName;
    }
    
    var container = $('#vimeoBadge-'+userName);
    if (data) {
      // loop through the videos, adding them to the list
      $.each(data, function(i, entry){
        if (entry.title.indexOf(oldVideos) == -1 && (feeds[feedIndex].excludeTag === '' || entry.tags.indexOf(feeds[feedIndex].excludeTag) == -1)) {				
          var overlayLink = 'javascript:loadVimeoVideo(\''+entry.url+'\');';				
          var time = pad(Math.floor(entry.duration/60))+':'+pad(entry.duration%60);
          var div = $('<div class="clip" id="'+entry.clip_id+'"><span class="upload-date">'+entry.upload_date+'<\/span><a href="'+overlayLink+'" title="'+entry.description.replace(/"/g,'&quot;')+'"><img src="'+entry.thumbnail_medium+'" border="0" width="120px" height="90px"><\/a><div class="caption"><a href="'+overlayLink+'">'+entry.title+'<\/a><p>Time: '+time+'<\/p><\/div><\/div>');
          container.append(div);
        }
      });		
    }
    else {
      container.append('No videos available.');
    }
    
    // get the next feed
    if (feedIndex < feeds.length-1) {
      feedIndex++;
      $.getScript('http://www.vimeo.com/api/v2/'+feeds[feedIndex].path+feeds[feedIndex].id+'/videos.json?callback=getVimeoVideos&page='+feeds[feedIndex].page);
    }
    else {
      // close out the last section
      closeErOut(currentUserName);          
      // load the youtube videos now
      $.getScript('http://gdata.youtube.com/feeds/playlists/707239D48D757C29?alt=json-in-script&format=5&orderby=published&sortorder=ascending&callback=getYouTubeVideos');
    }
  }

  //var lastId = '';
  function loadYouTubeVideo(id, title) {		
    var player = $('#video-player');
    if (queryVideo) { player.insertAfter(player.next()); queryVideo = false; }
    //if (lastId != id) {
      //lastId = id;
      // load the new video			
      var url = 'http://www.youtube.com/v/'+id;          
      if (typeof title == 'undefined') title = $('#'+id+'>div>a').text();          
      player.html($('<h4 class="youtube-title">'+title+'<\/h4><object width="510" height="420"><param name="movie" value="'+url+'"><param name="autoplay" value="1"><param name="wmode" value="transparent"><embed src="'+url+'&autoplay=1" type="application/x-shockwave-flash" wmode="transparent" width="510" height="420"><\/embed><\/object>'));			
    //}		
    // scroll the player into view
    player[0].scrollIntoView();
  }

  function loadVimeoVideo(url) {		
    $.getScript('http://www.vimeo.com/api/oembed.json?url='+encodeURIComponent(url)+'&maxwidth=640&maxheight=480&callback=embedVideo');
  }

  function embedVideo(video) {
    var player = $('#video-player');
    if (queryVideo && (feedIndex == feeds.length)) { player.insertAfter(player.next()); queryVideo = false; }
    player.html(unescape(video.html));
    // wait a little for the player to load before scrolling into view
    setTimeout(function() {
      player[0].scrollIntoView();
    }, 500);		
  }

  function getVideoId(url) {
    var start = url.indexOf('=');
    var end = url.indexOf('&');
    if ((start != -1) && (end != -1)) return url.substring(start+1,end);
    else return false;
  }

  function pad(num) {
    num = num + "";
    if (num.length == 1) num = "0" + num;
    return num;
  }
