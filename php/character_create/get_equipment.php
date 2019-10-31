<?php
	//database connect function
	include_once("../../includes/inc_connect.php"); 
		
	//Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	$weapon = array();
	$armor = array();
	$equipment = array();
	
	//Query for weapon
	$query = 'SELECT * FROM Weapon';
	if($result = mysqli_query($link,$query))
	{
		while($row = mysqli_fetch_object($result))
		{
			$weapon[] = $row;
		}
	}
	
	//Query for armor
	$query = 'SELECT * FROM Armor';
	if($result = mysqli_query($link,$query))
	{
		while($row = mysqli_fetch_object($result))
		{
			$armor[] = $row;
		}
	}
	
	//Query for equipment
	$query = 'SELECT * FROM Equipment';
	if($result = mysqli_query($link,$query))
	{
		while($row = mysqli_fetch_object($result))
		{
			$equipment[] = $row;
		}
	}
	
	mysqli_close($link);
	echo json_encode(array('weapon'=>$weapon, 'armor'=>$armor, 'equipment'=>$equipment));
?>