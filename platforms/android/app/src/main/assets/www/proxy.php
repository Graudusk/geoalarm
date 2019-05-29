<?php
// header("Content-Type: application/javascript; charset=UTF-8");
header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Origin: *");
$ch = curl_init();

$request_file = "request.xml";
$fh = fopen($request_file, 'r');

// $xml_data = "<REQUEST>" +
//   "<LOGIN authenticationkey='f3c9703c86284fb9917dd764185250ae' />" +
//       "<QUERY objecttype='Situation' orderby='PublicationTime asc'>" +
//             "<FILTER>" +
//                   "<WITHIN name='Deviation.Geometry.WGS84' shape='center' value='15.42 60.48' radius='10000m' />" +
//             "</FILTER>" +
//             "<INCLUDE>Deviation.Id</INCLUDE>" +
//             "<INCLUDE>Deviation.Header</INCLUDE>" +
//             "<INCLUDE>Deviation.NumberOfLanesRestricted</INCLUDE>" +
//             "<INCLUDE>Deviation.PositionalDescription</INCLUDE>" +
//             "<INCLUDE>Deviation.RoadNumber</INCLUDE>" +
//             "<INCLUDE>Deviation.Geometry.WGS84</INCLUDE>" +
//             "<INCLUDE>PublicationTime</INCLUDE>" +
//             "<INCLUDE>Deviation.IconId</INCLUDE>" +
//             "<INCLUDE>Deviation.Message</INCLUDE>" +
//             "<INCLUDE>Deviation.MessageCode</INCLUDE>" +
//             "<INCLUDE>Deviation.MessageType</INCLUDE>" +
//       "</QUERY>" +
// "</REQUEST>";
$xml_data = fread($fh, filesize($request_file));

$url = "http://api.trafikinfo.trafikverket.se/v1.3/data.json";
$page = "/v1.3/data.json"; 
$headers = array(
    "POST ".$page." HTTP/1.0",
    "Content-type: text/xml;charset=\"utf-8\"",
    "Accept: text/xml",
    "Cache-Control: no-cache",
    "Pragma: no-cache",
    // "Access-Control-Allow-Origin":"*",
    // "SOAPAction: \"run\"",
    "Content-length: ".strlen($xml_data)
); 

curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_HTTPHEADER,$headers);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml_data); 

$output = curl_exec($ch);

// var_dump($output);

echo $output;
// echo "myFunc(".json_encode($output).")";
curl_close($ch);
