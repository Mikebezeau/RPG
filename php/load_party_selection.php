<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	$query = 'SELECT PartyID, PartyName FROM Parties WHERE CatagoryID = 1 ORDER BY PartyName';
	$result = mysqli_query($link,$query);
	
	$select_box = '<select id="player-party-selection"><option value="-1" data-sprite-id="-1">Select</option>';
	
	$partyCount = 0;
	$party_images = array();
	
	while($row = mysqli_fetch_object($result))
	{
		$select_box .= '<option value="'.$row->PartyID.'">'.$row->PartyName.'</option>';
		
		$party_images[$partyCount] = array();
		$party_images[$partyCount]['party_id'] = $row->PartyID;
		$party_images[$partyCount]['party_name'] = $row->PartyName;
		$party_images[$partyCount]['thumb_id'] = array();
		$queryPartyImages = 'SELECT MasterCharacter.CharacterID, MasterCharacter.ThumbPicID FROM CharacterParty INNER JOIN MasterCharacter USING(CharacterID) WHERE PartyID = '.$row->PartyID;
		$resultPartyImages = mysqli_query($link,$queryPartyImages);
		while($rowPartyImages = mysqli_fetch_object($resultPartyImages))
		{
			$party_images[$partyCount]['thumb_id'][] = $rowPartyImages->ThumbPicID;
		}
		$partyCount++;
	}
	
	$select_box .= '</select>';
	
	mysqli_close($link);
	
	echo(json_encode(array('select_box'=>$select_box, 'party_thumb_images'=>$party_images)));
?>