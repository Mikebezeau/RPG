<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	//data (false makes it an object, true is array)
	$_POST = json_decode($_POST['data'], true);
	
	$queries = array();
	
	if(isset($_GET["campaign_id"]))
	{
		$campaign_id = $_GET["campaign_id"];
	} //end if
	else
	{
		$campaign_id = -1;
	} //end else
	
	//***
	$campaign_id = 99;
	//***
	
	if(isset($_POST["title"]))
	{
		$title = $_POST["title"];
	} //end if
	else
	{
		$title = "Encounter";
	} //end else
	if($title == "") $title = "Encounter";
	
	if(isset($_POST["description"]))
	{
		$description = $_POST["description"];
	} //end if
	else
	{
		$description = "";
	} //end else
	
	//place checked player parties characters info into array
	if(isset($_POST["player_party_id"]))
	{
		$player_party_id = $_POST["player_party_id"];
	} //end if
	
	$monster_character_id = $_POST["monster_character_id"];
	
	$monster_party_id = -1;

	if(isset($_POST["bg_pic_file_name"]))
	{
		//add quotes around string so that if NULL, NULL wont have quotes around it in query below
		$bg_pic_file_name = "'".$_POST["bg_pic_file_name"]."'";
		if($bg_pic_file_name == "") { $bg_pic_file_name = "NULL"; }
	} //end if
	else
	{
		$bg_pic_file_name = "NULL";
	} //end else
	if(isset($player_party_id) && $campaign_id > -1)
	{
		//DELETE old entries in Encounters, EncounterPost, and EncounterParty for player and monster parties
		//for each player party, query for EncounterID in EncounterParty
		function delete_party_encounters($party_id, $link)
		{
			$query_find_old_encounter = "SELECT EncounterID FROM EncounterParty WHERE PartyID = ".$party_id." GROUP BY EncounterID";
			if($result_find_old_encounter	= mysqli_query($link, $query_find_old_encounter))
			{
				while($row = mysqli_fetch_assoc($result_find_old_encounter))
				{
					$encounter_id = $row['EncounterID'];
					$query_delete_old_encounter = "DELETE FROM Encounters WHERE EncounterID = ".$encounter_id;
					$result_delete_old_encounter	= mysqli_query($link, $query_delete_old_encounter);
					$query_delete_old_encounter = "DELETE FROM EncounterPost WHERE EncounterID = ".$encounter_id;
					$result_delete_old_encounter	= mysqli_query($link, $query_delete_old_encounter);
				}
			}
			else
			{
				 die("Query failed: " . mysqli_error() . "<br/>" . $query_find_old_encounter);
			}
			//DELETE old entries in EncounterParty for parties
			$query = "DELETE FROM EncounterParty WHERE PartyID = ".$party_id;
			$result = mysqli_query($link,$query);
		}
		
		delete_party_encounters($player_party_id, $link);

		//INSERT encounter info
		//next AUTO_INCREMENT for Encounters table
		$tablename	= "Encounters";
		$next_increment = 0;
		$query_ShowStatus = "SHOW TABLE STATUS LIKE '$tablename'";
		$query_ShowStatusResult	= mysqli_query($link, $query_ShowStatus) or die ( "Query failed: " . mysqli_error() . "<br/>" . $query_ShowStatus );
		
		$row = mysqli_fetch_assoc($query_ShowStatusResult);
		$next_increment = $row['Auto_increment'];
		
		$encounter_id = $next_increment;
		
		//INSERT new encounter info into Encounters table (dont need to insert id because its on auto increment)
		//added quotes around $bg_pic_file_name so that if NULL, NULL wont have quotes around it in query
		$query = "INSERT INTO Encounters (CampaignID, MapName, BGPicFileName, CurrentRound, CurrentInit, Active, Title, Description, StartedDate) 
			VALUES (".$campaign_id.", '".$map_name."', ".$bg_pic_file_name.", 1, 99, FALSE, '".$title."', '".$description."', NOW())";
		//Perform Query
		$result = mysqli_query($link,$query);
		//echo($query);
		//echo(mysql_error($result));
		
		//set up monster party ----------
		
		//INSERT mew monster party
		//delete old one
		$queries[] = $query = "SELECT CharacterID, PartyID FROM CharacterParty WHERE CharacterID = ".$monster_character_id;
		$partyResult = mysqli_query($link,$query);
		while($partyRow = mysqli_fetch_object($partyResult))
		{
			$queries[] = $query = "DELETE FROM Parties WHERE PartyID = ".$partyRow->PartyID;
			$deleteResult = mysqli_query($link,$query);
		}
		$queries[] = $query = "DELETE FROM CharacterParty WHERE CharacterID = ".$monster_character_id;
		$deleteResult = mysqli_query($link,$query);
		
		///INSERT monster parties Parties into table, CatagoryID=3 means monster party
		$queries[] = $query = "INSERT INTO Parties (PartyName, CatagoryID) VALUES ('Monsters', 3)";
		$result = mysqli_query($link,$query);
		$monster_party_id = mysqli_insert_id($link);
		
		$queries[] = $query = "INSERT INTO CharacterParty (CharacterID, PartyID) VALUES (".$monster_character_id.", ".$monster_party_id.")";
		$result = mysqli_query($link,$query);
		
		// Perform Query
		$result = mysqli_query($link,$query);
		
		//-------------------------------
		
		//INSERT player party into EncounterParty table, GoodGuy=1 means these are the players / good guy parties
		$query = "INSERT INTO EncounterParty (PartyID, EncounterID, GoodGuy) 
			VALUES (".$player_party_id.", ".$encounter_id.", 1)";
		$result = mysqli_query($link,$query);
		
		//INSERT monster party into EncounterParty table, GoodGuy=0 means these are the bad guy parties
		$query = "INSERT INTO EncounterParty (PartyID, EncounterID, GoodGuy) 
			VALUES (".$monster_party_id.", ".$encounter_id.", 0)";
		// Perform Query
		$result = mysqli_query($link,$query);
		
		//set initiatives
		$query = "SELECT MasterCharacter.CharacterID FROM QuickStats INNER JOIN (MasterCharacter INNER JOIN (CharacterParty INNER JOIN EncounterParty
						ON CharacterParty.PartyID = EncounterParty.PartyID)
					ON MasterCharacter.CharacterID = CharacterParty.CharacterID)
				ON QuickStats.QuickStatID = MasterCharacter.QuickStatID
			WHERE EncounterParty.EncounterID = ".$encounter_id;
		
		if($char_result = mysqli_query($link,$query)) {
			//get $initiative and add to roll, update in MasterCharacter
			while($char_row = mysqli_fetch_object($char_result)) {
				$query = "UPDATE MasterCharacter SET InitRoll = ".($char_row->Initiative + mt_rand(1, 20)).", ActionComplete = FALSE WHERE CharacterID=".$char_row->CharacterID;
				//perform Query
				$set_init_result = mysqli_query($link,$query);
			} //end while
		} //end if result
		
	} //end if isset parties
	
	mysqli_close($link);
	
	echo json_encode(array('encounter_id'=>$encounter_id, 'monster_party_id'=>$monster_party_id, 'queries'=>$queries));
?>