<?php

// database connect function
include_once("../../includes/inc_connect.php"); 
	
// Connect to database using function from "inc_connect.php"
$link = dbConnect();

$data = json_decode($_POST['data'], false);
$message = "\n\r".date("Y-m-d H:i:s").'  -  Browser: '.$data->browser.'  -  Mobile: '.($data->mobile? 'Yes':'No')."\n\rUser Agent: ".$data->userAgent."\n\r".$data->message;

file_put_contents('./errors.txt', $message, FILE_APPEND);
	
mysqli_close($link);

?>