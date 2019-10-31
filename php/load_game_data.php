<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	$query = "SELECT * FROM SkillList";
	$result = mysqli_query($link,$query);
	$skill_arr = array();
	if($playerRow = mysqli_fetch_object($result))
	{
		while($row = mysqli_fetch_object($result))
		{
			$row->SkillID = (int)$row->SkillID;
			$row->AttributeID = (int)$row->AttributeID;
			$row->Untrained = (int)$row->Untrained;
			$skill_arr[$row->SkillID] = $row;
		}
	}
	mysqli_close($link);
	
	echo(json_encode(array('skill_arr'=>$skill_arr)));
?>