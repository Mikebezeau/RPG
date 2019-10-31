<?php
	// database connect function
	include_once("../../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	$data = json_decode($_POST['data']);
	//.AdventureID .StartAreaID .StartEventID .Image .Title .Description
	$query = "DELETE FROM Adventures";
	$result = mysqli_query($link,$query);
	echo $query = "INSERT INTO Adventures (StartAreaID, StartEventID, Image, Title, Description) VALUES (".$data->StartAreaID.", ".$data->StartEventID.", '".$data->Image."', '".$data->Title."', '".$data->Description."')";
	$result = mysqli_query($link,$query);
	
	mysqli_close($link);
?>