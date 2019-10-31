<?php
// database connect function
include_once("../includes/inc_connect.php"); 

function LoadEvent($link, $event_id)
{
	$event = 0;
	//if no id given, check for an area event, if none get most recent event saved
	/*if($event_id == 0)
	{
		$query = "SELECT EventID FROM Events WHERE AreaID = '$area_id' ORDER BY EventID DESC LIMIT 1";
		$result = mysqli_query($link,$query);
		if($event = mysqli_fetch_object($result))
		{
			$event_id = $event->EventID;
		}
		else
		{
			return 0;
		}
	}
	*/
	//query to retrieve Event entry
	$query = 'SELECT * FROM Events INNER JOIN EventLocations USING(EventID) WHERE EventID='.$event_id;
	if($result = mysqli_query($link,$query))
	{
		$event = mysqli_fetch_object($result);
		$event->EventID = (int)$event->EventID;
		$event->IsOnlyOnce = (int)$event->IsOnlyOnce;
		$event->X = (int)$event->X;
		$event->Y = (int)$event->Y;
		
		//battle
		$event->CharacterIDarr = array();
		$query = 'SELECT BattleCharacterID FROM EventsStartBattle WHERE EventID='.$event_id;
		if($result = mysqli_query($link,$query))
		{
			while($EventsStartBattleData = mysqli_fetch_object($result))
			{
				$event->CharacterIDarr[] = (int)$EventsStartBattleData->BattleCharacterID;
			}
		}
		
		//moving
		$event->ToAreaID = 0;
		$query = 'SELECT * FROM EventsChangeMap WHERE EventID='.$event_id;
		if($result = mysqli_query($link,$query))
		{
			while($EventsChangeMapData = mysqli_fetch_object($result))
			{
				$event->ToAreaID = (int)$EventsChangeMapData->ToAreaID;
				$event->AskChange = (int)$EventsChangeMapData->AskChange;
				$event->ToX = (int)$EventsChangeMapData->ToX;
				$event->ToY = (int)$EventsChangeMapData->ToY;
			}
		}
		
		//items
		$event->EventItems = array();
		$query = 'SELECT * FROM EventsItems WHERE EventID='.$event_id;
		if($result = mysqli_query($link,$query))
		{
			
			while($EventsItemsData = mysqli_fetch_object($result))
			{
				$EventsItemsData->EventID = (int)$EventsItemsData->EventID;
				$EventsItemsData->ItemID = (int)$EventsItemsData->ItemID;
				$EventsItemsData->TriggerEventID = (int)$EventsItemsData->TriggerEventID;
				$event->EventItems[] = $EventsItemsData;
			}
		}
		
	}
	return $event;
}

function GetAllAreaEvents($link, $AreaID, $player_character_id)
{
	$query = "SELECT * FROM Events INNER JOIN EventLocations USING(EventID) WHERE AreaID = ".$AreaID;
	$result = mysqli_query($link,$query);
	$events = array();
	while($row = mysqli_fetch_object($result))
	{
		$row->EventID = (int)$row->EventID;
		$row->IsOnlyOnce = (int)$row->IsOnlyOnce;
		$row->X = (int)$row->X;
		$row->Y = (int)$row->Y;
		$event_id = $row->EventID;
		
		$row->CharacterIDarr = array();
		$query = 'SELECT BattleCharacterID FROM EventsStartBattle WHERE EventID='.$event_id;
		if($battleResult = mysqli_query($link,$query))
		{
			while($battleData = mysqli_fetch_object($battleResult))
			{
				$row->CharacterIDarr[] = (int)$battleData->BattleCharacterID;
			}
		}
		
		$row->ToAreaID = 0;
		$query = 'SELECT EventsChangeMap.*, Areas.MapName, Areas.Description FROM EventsChangeMap INNER JOIN Areas ON(EventsChangeMap.ToAreaID = Areas.AreaID) WHERE EventID='.$event_id;
		if($changeMapResult = mysqli_query($link,$query))
		{
			while($changeMapData = mysqli_fetch_object($changeMapResult))
			{
				$row->ToMapName = $changeMapData->MapName;
				$row->ToDescription = $changeMapData->Description;
				$row->ToAreaID = (int)$changeMapData->ToAreaID;
				$row->AskChange = (int)$changeMapData->AskChange;
				$row->ToX = (int)$changeMapData->ToX;
				$row->ToY = (int)$changeMapData->ToY;
			}
		}
		
		//items
		$row->EventItems = array();
		$query = 'SELECT * FROM EventsItems WHERE EventID='.$event_id;
		if($itemsResult = mysqli_query($link,$query))
		{
			while($EventsItemsData = mysqli_fetch_object($itemsResult))
			{
				$EventsItemsData->EventID = (int)$EventsItemsData->EventID;
				$EventsItemsData->ItemID = (int)$EventsItemsData->ItemID;
				$EventsItemsData->TriggerEventID = (int)$EventsItemsData->TriggerEventID;
				if($player_character_id > 0)
				{
					//check if the item has already been taken by the player
					$query = 'SELECT * FROM PCWorldItemsHeld WHERE FromEventID='.$event_id.' AND ItemType="'.$EventsItemsData->ItemType.'" AND ItemID='.$EventsItemsData->ItemID.' AND PlayerCharacterID='.$player_character_id;
					if($EventsItemsData->TriggerEventID > 0)
					{
						$query .= ' AND TriggerEventID='.$EventsItemsData->TriggerEventID;
					}
					if($playerItemResult = mysqli_query($link,$query))
					{
						//if this item hasn't been picked up in the players world, add to event
						if(mysqli_num_rows($playerItemResult) == 0)
						{
							$row->EventItems[] = $EventsItemsData;
						}
					}
				}
				else
				{
					$row->EventItems[] = $EventsItemsData;
				}
			}
		}
		
		$events[] = $row;
	}
	return $events;
}

//main function: get id from POST
if(isset($_GET['event_id']))
{
	//Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	$event_id = $_POST['id'];
	//$event = LoadEvent($link, $event_id, $area_id);
	$event = LoadEvent($link, $event_id);
	mysqli_close($link);
	echo json_encode($event);
}//end isset event_id

elseif(isset($_GET['get_all_area']) && isset($_GET['area_id']))
{
	//Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	//edit mode, no player
	$events = GetAllAreaEvents($link, $_GET['area_id'], -1);
	mysqli_close($link);
	echo json_encode($events);
}

elseif(isset($_GET['get_all']))
{
	//Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	$query = "SELECT AreaID FROM Events INNER JOIN EventLocations USING(EventID) GROUP BY AreaID ORDER BY AreaID";
	$areaResult = mysqli_query($link,$query);
	$events = array();
	while($areaRow = mysqli_fetch_object($areaResult))
	{
		$query = "SELECT EventID, Title, Description, AreaID FROM Events INNER JOIN EventLocations USING(EventID) WHERE AreaID = ".$areaRow->AreaID;
		$eventResult = mysqli_query($link,$query);
		$thisAreaEvents = array();
		while($eventRow = mysqli_fetch_object($eventResult))
		{
			$thisAreaEvents[] = $eventRow;
		}
		$events[$areaRow->AreaID] = $thisAreaEvents;
	}
	mysqli_close($link);
	echo json_encode($events);
}

?>