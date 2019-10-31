<?php
	
	// database connect function
	include_once("../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();

	$data = json_decode($_POST['data'], false);
	
	//game_controller
	if(isset($data->get_party))
	{
		include_once("../classes/Quick_Stat.php");
		include_once("./character_ability_effect_query_funciton.php");
		
		//$party_id= $_POST['id'];
		$player_character_id= $_POST['id'];
		
		//prepare query of MasterCharacter table where characters party is the current $party_id
		//later --- order by walking position / row
		/*
		$query = "SELECT MasterCharacter.CharacterID FROM MasterCharacter INNER JOIN CharacterParty
							ON MasterCharacter.CharacterID = CharacterParty.CharacterID
					WHERE CharacterParty.PartyID = ".$party_id;
		*/
		
		$character_stats = 0;
		$player_character_stats_index = 0;
		$count = 0;
		$query = "SELECT CharacterID, FormationX, FormationY FROM PCPartyFormation WHERE PlayerCharacterID = ".$player_character_id;
		if($result = mysqli_query($link,$query))
		{
			$arr_character_stats = array();
			
			//PLAYER HAS GROUP
			while($row = mysqli_fetch_object($result))
			{
				if($row->CharacterID == $player_character_id) $player_character_stats_index = $count;//just using this to pull up main player characters equipment list for item events below
				$count++;
				//set $arr_character_stats[] using CharcterID's from above query
				$character_stats = new Quick_Stat();
				$character_stats->get_all_pc_data($link, $row->CharacterID, true, $player_character_id);
				$character_stats->FormationX = (int)$row->FormationX;
				$character_stats->FormationY = (int)$row->FormationY;
				//formation position
				
				$arr_character_stats[] = $character_stats;
				
			} //end while $row
			
			//PLAYER IS SOLO
			//if no entry 
			if($character_stats == 0)
			{
				$character_stats = new Quick_Stat();
				$character_stats->get_all_pc_data($link, $player_character_id, true, $player_character_id);//need $player_character_id so that is aware loading for playing the game
				$arr_character_stats[] = $character_stats;
			}
			
			unset($character_stats);
			
			//***
			
			//PLAYER DATA
			//get events for items player has
			$arr_item_events = array();
			include_once('./event_load_json.php');
			for($i=0; $i<count($arr_character_stats[$player_character_stats_index]->EquipArr); $i++)
			{
				if($arr_character_stats[$player_character_stats_index]->EquipArr[$i]->TriggerEventID > 0)
				{
					$arr_item_events[] = LoadEvent($link, $arr_character_stats[$player_character_stats_index]->EquipArr[$i]->TriggerEventID);
				}
			}
			
			//CharacterEvents - get Player event status (what event's player has seen run)
			$arr_completed_events = array();
			$query = "SELECT EventID FROM CharacterEvents WHERE CharacterID = ".$player_character_id;
			if($result = mysqli_query($link,$query))
			{
				while($row = mysqli_fetch_object($result))
				{
					$arr_completed_events[] = (int)$row->EventID;
				}
			}
			
			//CharacterKnowledge - get Player conversation knowledge tags learned
			$arr_knowledge_tag_id = array();
			$query = "SELECT KnowledgeTagID FROM CharacterKnowledge WHERE CharacterID = ".$player_character_id;
			if($result = mysqli_query($link,$query))
			{
				while($row = mysqli_fetch_object($result))
				{
					$arr_knowledge_tag_id[] = (int)$row->KnowledgeTagID;
				}
			}
			//***
			
			//close exit
			mysqli_close($link);
			echo(json_encode(array('arr_character_stats'=>$arr_character_stats, 'arr_item_events'=>$arr_item_events, 'arr_completed_events'=>$arr_completed_events, 'arr_knowledge_tag_id'=>$arr_knowledge_tag_id)));
			exit;
		} //end if $result
	}
	
	/*
	elseif(isset($data->get_character))
	{
		include_once("../classes/Quick_Stat.php");
		include_once("./character_ability_effect_query_funciton.php");
		
		$character_id = $_POST['id'];
		$player_character_id= $data->player_character_id;
	
		$character_stats = new Quick_Stat();
		//$character_stats->get_all_pc_data($character_id);
		$character_stats->get_all_data($character_id, $player_character_id);
		$character_stats->FormationX = -1;
		$character_stats->FormationY = -1;
		$arr_character_stats[] = $character_stats;
		
		//close exit
		mysqli_close($link);
		echo(json_encode($arr_character_stats));
		exit;
	}
	*/
	elseif(isset($data->save_character_party))
	{
		$player_character_id = $_POST['id'];
		
		//delete old
		$query = "DELETE FROM PCPartyFormation WHERE PlayerCharacterID = ".$player_character_id;
		$result = mysqli_query($link,$query);
		
		//save all character_ids  and formation locations to table
		for($i=0; $i<count($data->character_id_arr); $i++)
		{
			echo $query = "INSERT INTO PCPartyFormation (PlayerCharacterID, CharacterID, FormationX, FormationY) VALUES (".$player_character_id.", ".$data->character_id_arr[$i].", -1, -1)";
			$result = mysqli_query($link,$query);
		}
		
		//close exit
		mysqli_close($link);
		echo(json_encode($arr_character_stats));
		exit;
	}
	
	elseif(isset($data->get_pc_world_items_list))
	{
		$player_character_id = $_POST['id'];
		
		$pc_world_items_list = array();
		
		$query = "SELECT * FROM PCWorldItemsHeld WHERE PlayerCharacterID = ".$player_character_id;
		if($result = mysqli_query($link,$query))
		{
			//Get resulting row from query
			while($row = mysqli_fetch_object($result))
			{
				$pc_world_items_list[] = $row;
			} //end while $row
		}
		
		//close exit
		mysqli_close($link);
		echo(json_encode($pc_world_items_list));
		exit;
	}
	
?>