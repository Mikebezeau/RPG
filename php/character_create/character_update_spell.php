<?php
	// database connect function
	include_once("../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();

	$character_id = $_POST['character_id'];
	$learned_class_id = $_POST["learned_class_id"];
	
	//***********************
	// UPDATE FEATS
	
	//delete old spells
	$query = "DELETE FROM CharacterSpell WHERE CharacterID=".$character_id." AND LearnedClassID=".$learned_class_id;
	// Perform Query
	$result = mysqli_query($link,$query);
	
	// place spells into array
	$new_spell_list = $_POST["new_spell_list"];
	
	//insert spells into db
	//check to make sure $new_spell_id_list isset
	if(isset($new_spell_list)) {
		//loop through checked spell select checkboxes
		foreach ($new_spell_list as $i => $value)
		{ 
			//explode value data on the pipe '|' to seperate spellid and spelllevel
			$explode_value = explode ("|",$new_spell_list[$i]);
			$new_spell_id = $explode_value[0];
			$new_spell_level = $explode_value[1]; 
			$query = "INSERT INTO CharacterSpell (CharacterID, SpellID, LearnedClassID, SpellLevel) VALUES
					(".$character_id.", ".$new_spell_id.", ".$learned_class_id.", ".$new_spell_level.")";
			// Perform Query
			$result = mysqli_query($link,$query);
		}
	}
	
	mysqli_close($link);
?>