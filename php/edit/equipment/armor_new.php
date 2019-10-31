<?php
	// database connect function
	include_once("../../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();

	//DETERMINE WHETHER IT IS A NEW ARMOR OR SHIELD
	$shield = "0";
	if(isset($_GET["shield"]))
		$shield = "1";

	$armor_id = 0;
	//get next ArmorID (not using auto-increment
	$query = "SELECT ArmorID FROM Armor ORDER BY ArmorID DESC LIMIT 1";
	if($result = mysqli_query($link,$query)) {
		$row = mysqli_fetch_object($result);
		$armor_id = $row->ArmorID;
		//add one to get next available armor_id
		$armor_id++;
	} //end if $result
	
	//data on form stored in same format as data in armor list, in element arrays.  capture data from only element in array at [0]
	$arr_armor_name = $_POST["arr_armor_name"];
	$arr_ac_bonus = $_POST["arr_ac_bonus"];
	
	$arr_max_dex = $_POST["arr_max_dex"];
	if(!is_numeric($arr_max_dex[0]))
		$arr_max_dex[0] = 10;
	
	$arr_skill_penalty = $_POST["arr_skill_penalty"];
	$arr_spell_fail = $_POST["arr_spell_fail"];
	$arr_armor_type = $_POST["arr_armor_type"];
	
	//$arr_armor_size = $_POST["arr_armor_size"];
	$arr_armor_size = array();
	$arr_armor_size[0] = "M";
	
	$arr_material = $_POST["arr_material"];
	$arr_armor_icon = $_POST["arr_armor_icon"];
	
	$arr_armor_desc = $_POST["arr_armor_desc"];

	
	//***********************
	//INSERT NEW ARMOR

	//try to find out if max dex is a string or a number
	//replace string in max_dex field with 10 (10 means no limit to dex bonus for AC)

	
	$query = "INSERT INTO Armor
					(ArmorID, ArmorName, ACBonus, MaxDex, SkillPenalty, SpellFail, ArmorType, ArmorSize, Material, Icon, Shield, Description)
				VALUES (
					'".$armor_id."', 
					'".$arr_armor_name[0]."', 
					'".$arr_ac_bonus[0]."', 
					'".$arr_max_dex[0]."', 
					'".$arr_skill_penalty[0]."', 
					'".$arr_spell_fail[0]."', 
					'".$arr_armor_type[0]."', 
					'".$arr_armor_size[0]."',
					'".$arr_material[0]."', 
					'".$arr_armor_icon[0]."', 
					'".$shield."', 
					'".$arr_armor_desc[0]."')";

	// Perform Query
	$result = mysqli_query($link,$query);
	
	
	mysqli_close($link);
	header('Location: ../../../manage_equipment.php#armor');
?>