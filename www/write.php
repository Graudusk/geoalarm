<?php
header("Access-Control-Allow-Origin: *");
$lat = $_GET['lat'];
$lng = $_GET['lng'];
$file = 'request.xml';
// Open the file to get existing content
$contents = '<REQUEST>' .
$contents =
  '<LOGIN authenticationkey="f3c9703c86284fb9917dd764185250ae" />' .
      '<QUERY objecttype="Situation" orderby="PublicationTime desc">' .
'<FILTER>' .
'<WITHIN name="Deviation.Geometry.WGS84" shape="center" value="'.$lat.' '.$lng.'" radius="10000m" />' .
'</FILTER>' .
'<INCLUDE>Id</INCLUDE>' .
'<INCLUDE>Deviation.Header</INCLUDE>' .
'<INCLUDE>Deviation.NumberOfLanesRestricted</INCLUDE>' .
'<INCLUDE>Deviation.PositionalDescription</INCLUDE>' .
'<INCLUDE>Deviation.RoadNumber</INCLUDE>' .
'<INCLUDE>Deviation.Geometry.WGS84</INCLUDE>' .
'<INCLUDE>PublicationTime</INCLUDE>' .
'<INCLUDE>Deviation.IconId</INCLUDE>' .
'<INCLUDE>Deviation.Message</INCLUDE>' .
'<INCLUDE>Deviation.MessageCode</INCLUDE>' .
'<INCLUDE>Deviation.MessageType</INCLUDE>' .
'</QUERY>' .
'</REQUEST>';
// echo $contents;
// Write the contents back to the file
file_put_contents($file, $contents);

// echo $contents;
?>
