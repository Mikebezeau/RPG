<?php
	// database connect function
	include_once("../../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	$AreaID = $_POST['id'];
	
	$query = "SELECT * FROM Areas WHERE AreaID = ".$AreaID;
	$result = mysqli_query($link,$query);
	if($row = mysqli_fetch_object($result))
	{
		$MapName = $row->MapName;
		unlink('../../txt_data/map/map_'.$MapName.'.txt');
		unlink('../../txt_data/map/map_'.$MapName.'_tileset.txt');
		
		$query = "DELETE FROM Areas WHERE AreaID = ".$AreaID;
		$result = mysqli_query($link,$query);
		
		$query = "DELETE FROM PCWorldItemsHeld WHERE DropAreaID = ".$AreaID;
		$result = mysqli_query($link,$query);
		
		$query = "DELETE FROM PCCharacterInfo WHERE AreaID = ".$AreaID;
		$result = mysqli_query($link,$query);
		
		$query = "DELETE FROM EventsChangeMap WHERE ToAreaID = ".$AreaID;
		$result = mysqli_query($link,$query);
		
		$query = "DELETE FROM EventLocations WHERE AreaID = ".$AreaID;
		$result = mysqli_query($link,$query);
		
		$query = "DELETE FROM MasterCharacter WHERE CatagoryID != 1 AND AreaID = ".$AreaID;
		$result = mysqli_query($link,$query);
		
		$query = "UPDATE MasterCharacter SET AreaID = 0, Xpos = 0, Ypos = 0 WHERE AreaID = ".$AreaID;
		$result = mysqli_query($link,$query);
		
		echo 'Error:'.mysqli_error($link);
	}
	mysqli_close($link);
?>