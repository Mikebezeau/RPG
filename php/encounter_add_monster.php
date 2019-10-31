<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	//data (false makes it an object, true is array)
	$_POST = json_decode($_POST['data'], true);
	
	$monster_party_id = $_POST["monster_party_id"];
	$monster_character_id = $_POST["monster_character_id"];
	
	//INSERT monster_party_id, monster_character_id into CharacterParty table
	//DELETE first
	$query = "DELETE FROM CharacterParty WHERE CharacterID =".$monster_character_id;
	$result = mysqli_query($link,$query);
	
	$query = "INSERT INTO CharacterParty (CharacterID, PartyID) VALUES (".$monster_character_id.", ".$monster_party_id.")";
	$result = mysqli_query($link,$query);
	
	//UPDATE a new initiative rool in MasterCharacter table
	$init_roll = rand( 1, 20);
	$query = "UPDATE MasterCharacter SET InitRoll = ".$init_roll." WHERE CharacterID = ".$monster_character_id;
	$result = mysqli_query($link,$query);
	
	mysqli_close($link);
	
	echo $init_roll;
?>