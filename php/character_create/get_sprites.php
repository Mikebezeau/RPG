<?php
	// database connect function
	include_once("../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	if($_POST['gender'] == 'Male')
	{
		$looking_for = 'male';
	}
	else
	{
		$looking_for = 'female';
	}
	
	$query = 'SELECT * FROM Sprites WHERE FilePathName LIKE "%/'.$looking_for.'%"';
	if($result = mysqli_query($link,$query))
	{
		while($row = mysqli_fetch_object($result))
		{
			echo('<img src="./images/'.$row->FilePathName.'" data-id="'.$row->SpriteID.'" data-scale="'.$row->DefaultSpriteScale.'">');
		}
	} //end if result Quickstats record exists
	
	mysqli_close($link);

?>