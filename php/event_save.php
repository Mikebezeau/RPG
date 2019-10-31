<?php

// database connect function
include_once("../includes/inc_connect.php"); 
	
// Connect to database using function from "inc_connect.php"
$link = dbConnect();

$returnData = array();

function EventDelete($link, $event_id, $isSaveKey=0)
{
	//delete old Event entry
	if(!$isSaveKey)//ON UPDATE SAVE THE KEY TO UPDATE RECORD AND KEEP KEY THE SAME
	{
		$query = 'DELETE FROM Events WHERE EventID='.$event_id;
		$resultDelete = mysqli_query($link,$query);
	}
	$query = 'DELETE FROM EventLocations WHERE EventID='.$event_id;
	$resultDelete = mysqli_query($link,$query);
	$query = 'DELETE FROM EventsChangeMap WHERE EventID='.$event_id;
	$resultDelete = mysqli_query($link,$query);
	$query = 'DELETE FROM EventsStartBattle WHERE EventID='.$event_id;
	$resultDelete = mysqli_query($link,$query);
	$query = 'DELETE FROM EventsItems WHERE EventID='.$event_id;
	$resultDelete = mysqli_query($link,$query);
}
/*
DELETE FROM Events;
DELETE FROM EventLocations;
DELETE FROM EventsChangeMap;
DELETE FROM EventsStartBattle;
DELETE FROM EventsItems;
*/
if(isset($_GET['event_id']) && isset($_GET['delete']))
{
	$event_id = $_POST['id'];
	EventDelete($link, $event_id);
}

else if(isset($_GET['event_id']))
{
	$event_id = $_POST['id'];

	//data (false makes it an object, true is array)
	$eventData = json_decode($_POST['data'], false);
	
	//vasic Event
	$title = mysqli_real_escape_string($link, $eventData->Title);
	$ActionType = mysqli_real_escape_string($link, $eventData->ActionType);
	$description = mysqli_real_escape_string($link, $eventData->Description);
	$cutscene = mysqli_real_escape_string($link, $eventData->Cutscene);
	$IsOnlyOnce = $eventData->IsOnlyOnce;
	//event location
	$AreaID = $eventData->AreaID;
	$X = $eventData->X;
	$Y = $eventData->Y;
	
	//character ids for starting battle
	$CharacterIDArr = $eventData->CharacterIDarr;
	
	//location changed to
	$ToAreaID = $eventData->ToAreaID;
	$AskChange = $eventData->AskChange;
	$ToX = $eventData->ToX;
	$ToY = $eventData->ToY;
	
	//event items placed here
	$EventItems = $eventData->EventItems;
	
	//update
	if($event_id != '' && $event_id > 0)
	{
		//delete old Event entry, keeping the main Event entry for update
		EventDelete($link, $event_id, true);
		$query = "UPDATE Events SET Title='$title', Description='$description', ActionType='$ActionType', IsOnlyOnce='$IsOnlyOnce', Cutscene='$cutscene' WHERE EventID = ".$event_id;
		$result = mysqli_query($link,$query);
		//using same Key value
		$new_event_id = $event_id;
	}
	//insert
	else
	{
		//echo 
		$query = "INSERT INTO Events (Title, Description, ActionType, IsOnlyOnce, Cutscene) VALUES('$title', '$description', '$ActionType', '$IsOnlyOnce', '$cutscene')";
		$result = mysqli_query($link,$query);
		//get insert id
		$new_event_id = mysqli_insert_id($link);
	}
	
	//echo 
	$query = "INSERT INTO EventLocations (AreaID, X, Y, EventID) VALUES('$AreaID', '$X', '$Y', '$new_event_id')";
	$result = mysqli_query($link,$query);
	
	//save battle characters
	for($i=0; $i<count($CharacterIDArr); $i++)
	{
		//echo 
		$query = "INSERT INTO EventsStartBattle (EventID, BattleCharacterID) 
			VALUES ($new_event_id, '".$CharacterIDArr[$i]."')";
		$result = mysqli_query($link,$query);
	}
	
	//if change location
	if($ToAreaID != '')
	{
		//echo 
		$query = "INSERT INTO EventsChangeMap (EventID, ToAreaID, AskChange, ToX, ToY) 
			VALUES ($new_event_id, '$ToAreaID', '$AskChange', '$ToX', '$ToY')";
		$result = mysqli_query($link,$query);
	}
	
	//if event items
	if($EventItems != 0)
	{
		for($i = 0; $i < count($EventItems->ItemID); $i++)
		{
			$ItemID = $EventItems->ItemID[$i]->value;
			$ItemType = $EventItems->ItemType[$i]->value;
			$Name = $EventItems->Name[$i]->value;
			$Description = $EventItems->Description[$i]->value;
			$TriggerEventID = $EventItems->TriggerEventID[$i]->value;
			$query = "INSERT INTO EventsItems (EventID, ItemID, ItemType, Name, Description, TriggerEventID) 
				VALUES ($new_event_id, '$ItemID', '$ItemType', '$Name', '$Description', '$TriggerEventID')";
			$result = mysqli_query($link,$query);
		}
	}
	
	echo $new_event_id;
}

mysqli_close($link);

?>