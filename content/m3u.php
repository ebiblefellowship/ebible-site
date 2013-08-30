---
is_hidden: true
---
<?php
$url = $_GET['url'];
$dbg = $_GET['debug'];
if (isset($url)) {
    $content_type = (isset($dbg) && $dbg == 'true') ? 'text/plain' : 'audio/x-mpegurl';
    $mp3_url = preg_replace('/^\//', "http://www.ebiblefellowship.com/", $url);
    $m3u_file = preg_replace('/\.mp3$/', '.m3u', basename($url));
    header('Content-Type: ' . $content_type);
    header('Content-Disposition: filename=' . $m3u_file);
    header('Content-Length: ' . strlen($mp3_url)+1);
    print $mp3_url . "\n";
}
?>
