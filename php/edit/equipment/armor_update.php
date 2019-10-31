<?php
	// database connect function
	include_once("../../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();

	$arr_armor_id = $_POST["arr_armor_id"];
	$arr_armor_name = $_POST["arr_armor_name"];
	$arr_ac_bonus = $_POST["arr_ac_bonus"];
	
	$arr_max_dex = $_POST["arr_max_dex"];
	
	$arr_skill_penalty = $_POST["arr_skill_penalty"];
	$arr_spell_fail = $_POST["arr_spell_fail"];
	$arr_armor_type = $_POST["arr_armor_type"];
	
	//$arr_armor_size = $_POST["arr_armor_size"];
	$arr_armor_size = array();
	
	$arr_material = $_POST["arr_material"];
	$arr_armor_icon = $_POST["arr_armor_icon"];
	
	$arr_shield = $_POST["arr_shield"];
	
	$arr_armor_desc = $_POST["arr_armor_desc"];
	
	
	//***********************
	// UPDATE ARMOR

	foreach ($arr_armor_id as $i => $value)
    { 
		if(!is_numeric($arr_max_dex[$i]))
			$arr_max_dex[$i] = 10;
		
		$arr_armor_size[$i] = 'M';
		
		$query = "UPDATE Armor SET
						ArmorName = '".$arr_armor_name[$i]."', 
						ACBonus = '".$arr_ac_bonus[$i]."', 
						MaxDex = '".$arr_max_dex[$i]."', 
						SkillPenalty = '".$arr_skill_penalty[$i]."', 
						SpellFail = '".$arr_spell_fail[$i]."', 
						ArmorType = '".$arr_armor_type[$i]."', 
						ArmorSize = '".$arr_armor_size[$i]."', 
						Material= '".$arr_material[$i]."', 
						Icon= '".$arr_armor_icon[$i]."', 
						Shield = '".$arr_shield[$i]."', 
						Description = '".$arr_armor_desc[$i]."' 
					WHERE ArmorID = ".$arr_armor_id[$i];
				
		//perform Query
		$result = mysqli_query($link,$query);
		
	} //end foreach
	
	//DELETE CHECKED ARMOR
	if(isset($_POST["arr_delete_armor_id"])) {
		$arr_delete_armor_id = $_POST["arr_delete_armor_id"];
		foreach ($arr_delete_armor_id as $i => $value)
		{
			$query = "DELETE FROM Armor WHERE ArmorID = ".$arr_delete_armor_id[$i];
			//perform Query
			$result = mysqli_query($link,$query);
		} //end foreach
	} //end iff isset delete armor checks
	
	mysqli_close($link);
	header('Location: ../../../manage_equipment.php#armor');
?>