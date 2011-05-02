<?php
$url = $_GET['url'];
$dbg = $_GET['debug'];
if (isset($url)) {
    $content_type = (isset($dbg) && $dbg == 'true') ? 'text/plain' : 'audio/x-mpegurl';
    $mp3_url = preg_replace('/^\//', "http://www.ebiblefellowship.com/", $url);
    header('Content-Type: ' . $content_type);
    header('Content-Length: ' . strlen($mp3_url)+1);
    print $mp3_url . "\n";
}
?>
