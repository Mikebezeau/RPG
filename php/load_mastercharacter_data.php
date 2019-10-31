<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
		
	include_once("../classes/Quick_Stat.php");
	
	$character_id= $_POST['id'];
	$data = json_decode($_POST['data']);
	$player_character_id = $data->player_character_id;
	
	$character_stats = new Quick_Stat();
	$character_stats->get_data_master_character($link, $character_id);
	$character_stats->get_data_items($link, $character_stats->quick_stat_id);
	if($player_character_id != -1) $character_stats->get_data_character_pc_world($link, $character_id, $player_character_id);
	
	mysqli_close($link);
	
	echo(json_encode($character_stats));
?>