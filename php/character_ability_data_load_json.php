<?php

// database connect function
include_once("../includes/inc_connect.php"); 

// Connect to database using function from "inc_connect.php"
$link = dbConnect();

//effect_query_funciton
include_once("./character_ability_effect_query_funciton.php"); 
	
$character_id = $_POST['id'];

//data (false makes it an object, true is array)
$data = json_decode($_POST['data'], false);
$party_stats_index = $data->party_stats_index;

//query to retrieve catagory_id
$query = 'SELECT CatagoryID, QuickStatID FROM MasterCharacter WHERE CharacterID='.$character_id;
//perform Encounters Query
if($result = mysqli_query($link,$query)) {
	//get resulting row from query
	$row = mysqli_fetch_object($result);
	$catagory_id = $row->CatagoryID;
} //end if result

$racial = array();
$class = array();
$faction = array();
$feat = array();
$spells = array();

//if player character
if($catagory_id == 1) {
	include_once("../includes/inc_character_query_full.php");
	//FEATS
	include_once("../includes/inc_character_query_feat.php");
	//SPELLS
	include_once("../includes/inc_character_query_spell.php");
	
	//RACE ABILITY SUB-BUTTON
	if(isset($arr_raceability))
	{
		foreach($arr_raceability as $i => $value)
		{
			$racial_data = array();
			$racial_data['id'] = (int)$arr_raceability_id[$i];
			$racial_data['action'] = 'ability';
			$racial_data['action_type'] = 'racial';
			$racial_data['action_level'] = (int)$totallevel; //character level
			$racial_data['data_index'] = (int)$i;
			$racial_data['party_stats_index'] = (int)$party_stats_index;
			$racial_data['name'] = $arr_raceability[$i];
			$racial_data['description'] = $arr_race_ability_desc[$i];
			$racial_data['effects'] = $arr_race_ability_effect[$i];
			$racial[] = $racial_data;
		}
	}
	
	//CLASS ABILITY SUB-BUTTONS
	if(isset($arr_classability))
	{
		foreach($arr_classability as $i => $value)
		{
			$classability_data = array();
			$classability_data['learned_class'] = (int)$arr_classability_learned[$i];
			$classability_data['id'] = (int)$arr_classabilityid[$i];
			$classability_data['ability_rank'] = (int)$arr_classabilityrank[$i]; //ability rank
			$classability_data['action'] = 'ability';
			$classability_data['action_type'] = 'class';
			$classability_data['action_level'] = (int)$arr_classability_class_level[$i]; //class level
			$classability_data['data_index'] = (int)$i;
			$classability_data['party_stats_index'] = (int)$party_stats_index;
			$classability_data['name'] = $arr_classability[$i];
			$classability_data['description'] = $arr_class_ability_desc[$i];
			$classability_data['effects'] = $arr_class_ability_effect[$i];
			$class[] = $classability_data;
		}
	}

	//FACTION ABILITY SUB-BUTTONS
	if(isset($arr_factionability))
	{
		if($arr_factionability[0] != '')
		{
			foreach($arr_factionability as $i => $value)
			{
				$factionability_data = array();
				$factionability_data['id'] = (int)$arr_faction_ability_id[$i];
				$factionability_data['action'] = 'ability';
				$factionability_data['action_type'] = 'faction';
				$factionability_data['action_level'] = (int)$totallevel; //character level
				$factionability_data['data_index'] = (int)$i;
				$factionability_data['party_stats_index'] = (int)$party_stats_index;
				$factionability_data['name'] = $arr_factionability[$i];
				$factionability_data['description'] = $arr_faction_ability_desc[$i];
				$factionability_data['effects'] = $arr_faction_ability_effect[$i];
				$faction[] = $factionability_data;
			}
		}
	} //end if

	//FEAT ABILITY SUB-BUTTONS
	if(isset($arr_feat_name))
	{
		foreach($arr_feat_name as $i => $value)
		{
			$feat_data = array();
			$feat_data['id'] = (int)$arr_feat_id[$i];
			$feat_data['action'] = 'feat';
			$feat_data['action_type'] = 'feat';
			$feat_data['action_level'] = (int)$totalbab; //base attack bonus
			$feat_data['data_index'] = (int)$i;
			$feat_data['party_stats_index'] = (int)$party_stats_index;
			$feat_data['name'] = $arr_feat_name[$i];
			$feat_data['description'] = $arr_feat_desc[$i];
			$feat_data['effects'] = $arr_feat_effect[$i];
			$feat[] = $feat_data;
		}
	}
	
	//ADD RESISTANCES
	
	
	//SPELLS
	//if character has spells
	if(isset($arr_spell_name[0]))
	{
		//if($arr_spell_name[0] != '')
		//{
			//foreach class
			foreach ($arr_classid as $class_counter => $value)
			{
				//if class magic != "None"
				// find classes with spell lists
				if($arr_class_magic[$class_counter] != 'None')
				{
					$spells[$arr_classid[$class_counter]] = array();
					$spells[$arr_classid[$class_counter]]['class_name'] = $arr_classname[$class_counter];
					$spells[$arr_classid[$class_counter]]['class_id'] = $arr_classid[$class_counter];
					
					//get lowest and highest spell levels of known spells for current class
					//used to create lists for each spell level under each class
					$lowest_level = 9;
					$highest_level = -1;
					foreach($arr_spell_id as $spell_counter => $value)
					{
						//get highest level of spell known for current class
						if ($arr_spell_level[$spell_counter] < $lowest_level && $arr_learned_class_id[$spell_counter] == $arr_classid[$class_counter])
						{
							$lowest_level = $arr_spell_level[$spell_counter];
						} //end if lower level
						if ($arr_spell_level[$spell_counter] > $highest_level && $arr_learned_class_id[$spell_counter] == $arr_classid[$class_counter])
						{
							$highest_level = $arr_spell_level[$spell_counter];
						} //end if higher level
					} //end foreach known spell
					
					//list all spells for current level for current class
					$spells[$arr_classid[$class_counter]]['spell_level'] = array();
					for($spell_level_counter = $lowest_level; $spell_level_counter <= $highest_level; $spell_level_counter++)
					{
						$spells[$arr_classid[$class_counter]]['spell_level'][$spell_level_counter] = array();
						
						//each class spell level
						//loop through known spells, display spells for this class / spell level in list
						foreach ($arr_spell_id as $known_spell_counter => $value)
						{
							//if current spell learned class == class of current list, and current spell level == level of current list
							if($arr_learned_class_id[$known_spell_counter] == $arr_classid[$class_counter] && $arr_spell_level[$known_spell_counter] == $spell_level_counter)
							{
								//$arr_spell_id[$known_spell_counter]
								//$arr_spell_desc[$known_spell_counter]
								//$arr_spell_name[$known_spell_counter]
								$image = $arr_spell_id[$known_spell_counter];
								if(!file_exists('../images/battle_icons/spells/'.$image.'.png'))
								{
									$image = 'default';
								}
								$spell_data = array();
								$spell_data['id'] = (int)$arr_spell_id[$known_spell_counter];
								$spell_data['action'] = 'spells';
								$spell_data['action_type'] = 'spells';
								//add these in js on load for finding spell data in menu items on casting
								$spell_data['action_level'] = (int)$arr_caster_level[$class_counter];
								$spell_data['magic_type'] = $arr_class_magic[$class_counter];
								$spell_data['caster_class_index'] = -1;
								$spell_data['spell_level_index'] = -1;
								$spell_data['class_magic_attribute_id'] = (int)$arr_class_magic_attribute_id[$class_counter];
								$spell_data['spell_index'] = -1;
								$spell_data['party_stats_index'] = (int)$party_stats_index;
								$spell_data['name'] = $arr_spell_name[$known_spell_counter];
								$spell_data['image'] = $image;
								$spell_data['effects'] = $arr_spell_effect[$known_spell_counter];
								//$spell_data['description'] = $arr_spell_desc[$known_spell_counter];
								$spells[$arr_classid[$class_counter]]['spell_level'][$spell_level_counter][] = $spell_data;
								/*
								array(
										'id'=>$arr_spell_id[$known_spell_counter], 
										'image'=>$image, 
										'name'=>$arr_spell_name[$known_spell_counter], 
										'description'=>$arr_spell_desc[$known_spell_counter]
									);
								*/
							}
						} //end foreach spell
					} //end for spell_level
					
				} //end if class_magic != None
			} //end foreach classid
		//} //end if($arr_spell_name[0] != '')
	} //end if isset($arr_spell_name)

} //end if PLAYER character

//else NPC / MONSTER
else
{
	//already done in encounter_charcter_data.php in battle.php
	//$character_stats->get_data_special($quick_stat_id);
	//this is only used in quick stats edit
	if(isset($character_stats->arr_special_name))
	{
		if($character_stats->arr_special_name[0] != '')
		{
			$arr_special_master['arr_special_name'] = $character_stats->arr_special_name;
			$arr_special_master['arr_special_description'] = $character_stats->arr_special_description;
		}
	} //end if
	
} //end else NPC or MONSTER

	
echo json_encode(array(
	//'test'=>$test,
	'party_stats_index'=>$party_stats_index,
	'racial'=>$racial, 
	'class'=>$class,
	'faction'=>$faction,
	'feat'=>$feat,
	'spells'=>$spells
));

mysqli_close($link);
	
?>