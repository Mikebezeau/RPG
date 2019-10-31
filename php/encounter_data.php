<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	$encounter_id= $_POST['id'];
	
	//GET initiatives
	$query = "SELECT * FROM Encounters WHERE EncounterID = ".$encounter_id;
	
	if($encounter_result = mysqli_query($link,$query)) {
		$encounter_data = mysqli_fetch_object($encounter_result);
	} //end if result
	
	$query = "SELECT MasterCharacter.CharacterID, MasterCharacter.InitRoll FROM QuickStats 
								INNER JOIN (MasterCharacter 
									INNER JOIN (CharacterParty 
										INNER JOIN EncounterParty
										ON CharacterParty.PartyID = EncounterParty.PartyID)
									ON MasterCharacter.CharacterID = CharacterParty.CharacterID)
								ON QuickStats.QuickStatID = MasterCharacter.QuickStatID
							WHERE EncounterParty.EncounterID = ".$encounter_id." ORDER BY MasterCharacter.InitRoll DESC";
	
	$init_data = Array();
	if($init_result = mysqli_query($link,$query)) {
		while($init_row = mysqli_fetch_object($init_result))
		{
			$init_data[] = $init_row;
		}
	}
		
	mysqli_close($link);
	
	$encounter_return = new stdClass();
	$encounter_return->encounter_data = $encounter_data;
	$encounter_return->init_data = $init_data;
	
	echo(json_encode($encounter_return));
?>