<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	$PlayerName = $_POST['id'];
	
	/*
	if(isset($_POST['delete_player']))
	{
		$PlayerID = $_POST['id'];
		//delete all characters
		//delete player
		$query = "DELETE FROM Players WHERE PlayerID = '$PlayerID'";
		$result = mysqli_query($link,$query);
		mysqli_close($link);
		exit;
	}
	*/
	
	$query = "SELECT PlayerID FROM Players WHERE PlayerName = '$PlayerName'";
	$result = mysqli_query($link,$query);
	
	//if player exists
	if($playerRow = mysqli_fetch_object($result))
	{
		$PlayerID = $playerRow->PlayerID;
		
		$query = "SELECT * FROM MasterCharacter WHERE PlayerID = '$PlayerID'";
		$result = mysqli_query($link,$query);
		
		$pcCount = 0;
		$pcs = array();
		
		$select_box = '<select id="pc-selection" style="display:none;"><option value="-1" data-character-id="-1">Select</option>';
		
		while($row = mysqli_fetch_object($result))
		{
			$pcs[$pcCount] = array();
			$pcs[$pcCount]['character_id'] = $row->CharacterID;
			$pcs[$pcCount]['character_name'] = $row->CharacterName;
			$pcs[$pcCount]['thumb_id'] = $row->ThumbPicID;
			
			/*
			//now dont use party table, or need to have a party for solo player
			if($row->PartyID == null)
			{
				//set up new party for lonely guy
				//INSERT monster parties Parties into table, CatagoryID=1 means character party
				$query = "INSERT INTO Parties (CatagoryID) 
					VALUES (1)";
				// Perform Query
				$partyResult = mysqli_query($link,$query);
				$new_party_id = mysqli_insert_id($link);
				
				$query = "INSERT INTO CharacterParty (CharacterID, PartyID) VALUES (".$row->CharacterID.", ".$new_party_id.")";
				$partyResult = mysqli_query($link,$query);
				
				$row->PartyID = $new_party_id;
			}
			*/
			
			$pcs[$pcCount]['party_id'] = isset($row->PartyID)?$row->PartyID:0;
			
			$select_box .= '<option value="'.$row->CharacterID.'" data-character-id="'.$pcs[$pcCount]['character_id'].'">'.$row->CharacterName.'</option>';
			
			$pcCount++;
		}
		
		$select_box .= '</select>';
	
	}
	else
	{
		$select_box = '';
		$pcs = array();
		
		//create new player - stupid thing isnt using auto-inc
		$query = "SELECT PlayerID FROM Players ORDER BY PlayerID DESC LIMIT 1";
		//perform query
		$result = mysqli_query($link,$query);
		$IDrow = mysqli_fetch_object($result);
		$PlayerID = $IDrow->PlayerID + 1;
		
		$query = "INSERT INTO Players (PlayerID, PlayerName, Email) VALUES ($PlayerID, '$PlayerName', '')";
		$partyResult = mysqli_query($link,$query);
	}
	
	//GET adventure data
	$query = "SELECT * FROM Adventures";
	$result = mysqli_query($link,$query);
	$row = mysqli_fetch_assoc($result);
	$adventure = $row;
	
	mysqli_close($link);
	
	echo(json_encode(array('select_box'=>$select_box, 'pcs'=>$pcs, 'player_id'=>$PlayerID, 'adventure'=>$adventure)));
?>