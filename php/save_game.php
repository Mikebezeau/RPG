<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	$player_character_id = $_POST['id'];
	$data = json_decode($_POST['data']);
	
	//update player character MasterCharacter info
	//using PCCharacterInfo for location so this miught not be needed
	echo $query = "UPDATE MasterCharacter SET AreaID = ".$data->AreaID.", Xpos = ".$data->Xpos.", Ypos = ".$data->Ypos." WHERE CharacterID = ".$player_character_id;
	$result = mysqli_query($link,$query);
	
	//save damage to pc's character info for their world / includes summoned creatures - add 'SummonedByCharacterID'
	//for each non-PC character, delete old entry then save new info
	for($i=0; $i<count($data->characters); $i++)
	{
		$query = "DELETE FROM PCCharacterInfo WHERE PlayerCharacterID = ".$player_character_id." AND CharacterID = ".$data->characters[$i]->character_stats->character_id;
		$result = mysqli_query($link,$query);
		echo "\r\n".$query = "INSERT INTO PCCharacterInfo (PlayerCharacterID, CharacterID, AreaID, Xpos, Ypos, HPDamage, ArcaneSPUsed, DivineSPUsed, SummonedByCharacterID, IsPolymorphQSID, IsFamiliar) VALUES (".$player_character_id.", ".$data->characters[$i]->character_stats->character_id.", ".$data->characters[$i]->character_stats->area_id.", ".$data->characters[$i]->x.", ".$data->characters[$i]->y.", ".$data->characters[$i]->character_stats->hp_damage.", ".$data->characters[$i]->character_stats->asp_used.", ".$data->characters[$i]->character_stats->dsp_used.", ".$data->characters[$i]->character_stats->summoned_by_character_id.", ".$data->characters[$i]->character_stats->is_polymorph_qsid.", ".$data->characters[$i]->character_stats->is_familiar.")";
		$result = mysqli_query($link,$query);
		//SAVE CHARACTER EFFECTS
		$query = "DELETE FROM CharacterEffects WHERE PlayerCharacterID = ".$player_character_id." AND CharacterID = ".$data->characters[$i]->character_stats->character_id;
		$result = mysqli_query($link,$query);
		//*** DELETE caster sub types ***
		for($j=0; $j<count($data->characters[$i]->character_stats->effects); $j++)
		{
			$this_effect = $data->characters[$i]->character_stats->effects[$j];
			echo
			$query = "INSERT INTO CharacterEffects (PlayerCharacterID, CharacterID,
					EffectID, EffectTypeTable, CharacterIDWhoCasted, CastedByCreatureTypeID, ActionLevel, TotalDuration, RoundsLeft, InitiativeStarted, SaveDC, EffectData, DiceRollResult) 
				VALUES (".$player_character_id.", ".$data->characters[$i]->character_stats->character_id.", 
					".$this_effect->EffectID.", '".$this_effect->EffectTypeTable."', ".$this_effect->CharacterIDWhoCasted.", ".$this_effect->CastedByCreatureTypeID.", ".$this_effect->ActionLevel.", ".$this_effect->TotalDuration.", ".$this_effect->RoundsLeft.", ".$this_effect->InitiativeStarted.", ".$this_effect->SaveDC.", '".$this_effect->EffectData."', ".$this_effect->DiceRollResult.")";
			$result = mysqli_query($link,$query);
		
			//*** insert caster sub types loop ***
			
		}
		
		//FOR Players Main Character
		//Update equipped items
		if($player_character_id == $data->characters[$i]->character_stats->character_id)
		{
			for($j=0; $j<count($data->characters[$i]->EquipInfo); $j++)
			{
				$item = $data->characters[$i]->EquipInfo[$j];
				$offHandUpdate = '';
				if($item->type == 'weapon')
				{
					$table = 'CharacterWeapon';
					$tableID = 'WeaponID';
					$offHandUpdate = (isset($item->off_hand) && $item->off_hand == 1)? ', OffHand = 1' : '';//does not exist for NPC/Monsters
				}
				elseif($item->type == 'armor')
				{
					$table = 'CharacterArmor';
					$tableID = 'ArmorID';
				}
				elseif($item->type == 'equipment')
				{
					$table = 'CharacterEquipment';
					$tableID = 'EquipID';
				}
				//echo 
				$query = "UPDATE $table SET Equipped = ".$item->equipped." 
					WHERE $tableID = ".($item->id)." AND CharacterID = $player_character_id";
				$result = mysqli_query($link,$query);
			}
		}
	}
	
	//echo 
	$query = "DELETE FROM CharacterEvents WHERE CharacterID = ".$player_character_id;
	$result = mysqli_query($link,$query);
	for($i=0; $i<count($data->player_completed_events); $i++)
	{
		//echo 
		$query = "INSERT INTO CharacterEvents (CharacterID, EventID) VALUES (".$player_character_id.", ".$data->player_completed_events[$i].")";
		$result = mysqli_query($link,$query);
	}
	
	//echo 
	$query = "DELETE FROM CharacterKnowledge WHERE CharacterID = ".$player_character_id;
	$result = mysqli_query($link,$query);
	for($i=0; $i<count($data->player_knowledge_tags); $i++)
	{
		echo('Know tags possible issue');
		print_r($data->player_knowledge_tags);
		//echo 
		$query = "INSERT INTO CharacterKnowledge (CharacterID, KnowledgeTagID) VALUES (".$player_character_id.", ".$data->player_knowledge_tags[$i].")";
		$result = mysqli_query($link,$query);
	}
	
	mysqli_close($link);
?>