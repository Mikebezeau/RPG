<?php
	// database connect function
	if(!isset($included_from_delete))
	{
		include_once("../../includes/inc_connect.php"); 
		// Connect to database using function from "inc_connect.php"
		$link = dbConnect();
			
		$character_id = $_POST['id'];
	}
	
	$query = "DELETE FROM CharacterEquipment WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);
	
	$query = "DELETE FROM CharacterConvComplete WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);
	
	$query = "DELETE FROM CharacterEvents WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);
	
	$query = "DELETE FROM CharacterEffects WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);
	
	$query = "DELETE FROM CharacterKnowledge WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);
	
	
	$query = "DELETE FROM PCPartyFormation WHERE PlayerCharacterID=".$character_id;
	$result = mysqli_query($link,$query);
	
	$query = "DELETE FROM PCWorldItemsHeld WHERE PlayerCharacterID=".$character_id;
	$result = mysqli_query($link,$query);
	
	//PCCharacterInfo & MasterCharacter
	//delete from MasterCharacter creatures summoned in this PlayerCharacter world
	$query = "SELECT * FROM PCCharacterInfo WHERE PlayerCharacterID=".$character_id." AND SummonedByCharacterID != 0";
	$result = mysqli_query($link,$query);
	while($row = mysqli_fetch_object($result))
	{
		$summoned_character_id = $row->CharacterID;
		$query = "DELETE FROM MasterCharacter WHERE CharacterID=".$summoned_character_id;
		$del_mc_result = mysqli_query($link,$query);
	}
	
	//delete players PCCharacterInfo
	$query = "DELETE FROM PCCharacterInfo WHERE PlayerCharacterID=".$character_id;
	$result = mysqli_query($link,$query);
	
	
	if(!isset($included_from_delete))
	{
		//reset location to start
		$query = "UPDATE MasterCharacter SET AreaID=0, Xpos=0, Ypos=0 WHERE CharacterID=".$character_id;
		$result = mysqli_query($link,$query);
		
		mysqli_close($link);
	}
?>