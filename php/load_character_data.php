<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
		
	include_once("../classes/Quick_Stat.php");
	include_once("./character_ability_effect_query_funciton.php");
	
	$character_id= $_POST['id'];
	$data = json_decode($_POST['data']);
	$player_character_id= isset($data->player_character_id)?$data->player_character_id:-1;
	
	$character_stats = new Quick_Stat();
	//for NPC and monsters
	$character_stats->get_all_data($link, $character_id, $player_character_id);
	//for a PC sitting on the map, get some additional data
	if($character_stats->quick_stat_catagory_id == 1)
	{
		$character_stats->get_all_pc_data($link, $character_id, false, $player_character_id);
	}
	
	mysqli_close($link);

	echo(json_encode($character_stats));
?>