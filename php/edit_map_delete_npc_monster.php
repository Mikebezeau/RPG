<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	$character_id = $_POST["id"];

	//deleting summoned character, ids and player_character_id in $_POST['data']
	if($character_id == 0)
	{
		$_POST = json_decode($_POST['data'], true);
		$character_id_arr = $_POST["character_id_arr"];
		for($i=0; $i<count($character_id_arr); $i++)
		{
			$query = "DELETE FROM MasterCharacter WHERE CharacterID = ".$character_id_arr[$i];
			$result = mysqli_query($link,$query);
			$query = "DELETE FROM PCCharacterInfo WHERE CharacterID = ".$character_id_arr[$i];
			$result = mysqli_query($link,$query);
		}
	}
	else
	{
		//delete character, map editor
		$query = "Select CatagoryID FROM MasterCharacter WHERE CharacterID = ".$character_id;
		$result = mysqli_query($link,$query);
		$row = mysqli_fetch_object($result);
		//dont delete PCs, just move them to area 0
		if($row->CatagoryID == 1)
		{
			$query = "UPDATE MasterCharacter SET AreaID = 0 WHERE CharacterID = ".$character_id;
			$result = mysqli_query($link,$query);
		}
		else
		{
			$query = "DELETE FROM MasterCharacter WHERE CharacterID = ".$character_id;
			$result = mysqli_query($link,$query);
			$query = "DELETE FROM PCCharacterInfo WHERE CharacterID = ".$character_id;
			$result = mysqli_query($link,$query);
			$query = "DELETE FROM PCWorldItemsHeld WHERE FromCharacterID = ".$character_id;
			$result = mysqli_query($link,$query);
		}
	}
	mysqli_close($link);
	
?>

