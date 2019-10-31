<?php
	// database connect function
	include_once("../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	print_r($_POST);
	
	if(isset($_POST['ability_id']))
	{
		$ability_id = $_POST['ability_id'];
		$ability_rank = $_POST['ability_rank'];
		$effect_id = $_POST['effect_id'];
		$character_id = $_POST['character_id'];
		
		$query = "DELETE FROM PlayerCharacterSelectedClassAbilities WHERE CharacterID = $character_id AND AbilityID = $ability_id AND AbilityRank = $ability_rank";
		$result = mysqli_query($link,$query);
		
		$query = "INSERT INTO PlayerCharacterSelectedClassAbilities (CharacterID, AbilityID, AbilityRank, EffectID) 
			VALUES (".$character_id.", ".$ability_id.", ".$ability_rank.", ".$effect_id.")";
		$result = mysqli_query($link,$query);
		/*
		include_once("../character_ability_effect_query_funciton.php");
		include_once('../../includes/inc_character_query_full.php');
		include_once("../../classes/Quick_Stat.php");
		$character_stats = new Quick_Stat();
		$character_stats->get_all_pc_data($character_id);
		
		echo(json_encode($character_stats));*/
	}
	
	mysqli_close($link);
	
?>