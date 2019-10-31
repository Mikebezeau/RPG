<?php
	// database connect function
	include_once("../../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();

	$weapon_id = 0;
	//get next WeaponID (not using auto-increment
	$query = "SELECT WeaponID FROM Weapon ORDER BY WeaponID DESC LIMIT 1";
	if($result = mysqli_query($link,$query)) {
		$row = mysqli_fetch_object($result);
		$weapon_id = $row->WeaponID;
		//add one to get next available weapon id
		$weapon_id++;
	} //end if $result
	
	//data on form stored in same format as data in weapon list, in element arrays.  capture data from only element in array at [0]
	$arr_weapon_type_id = $_POST["arr_weapon_type_id"];
	$arr_weapon_class_id = $_POST["arr_weapon_class_id"];
	$arr_weapon_name = $_POST["arr_weapon_name"];
	$arr_damage_die_type = $_POST["arr_damage_die_type"];
	$arr_damage_die_num = $_POST["arr_damage_die_num"];
	$arr_damage_mod = $_POST["arr_damage_mod"];
	$arr_crit_range = $_POST["arr_crit_range"]; //20-this = real crit range
	$arr_crit_mult = $_POST["arr_crit_mult"];
	$arr_range_base = $_POST["arr_range_base"];
	$arr_weapon_size = $_POST["arr_weapon_size"];
	$arr_damage_type = $_POST["arr_damage_type"];
	$arr_weapon_icon = $_POST["arr_weapon_icon"];
	$arr_sme = $_POST["arr_sme"];
	$arr_weapon_desc = $_POST["arr_weapon_desc"];
	
	
	//***********************
	// INSERT NEW WEAPONS

	//reverse crit range
	$arr_crit_range[0] = 20 - $arr_crit_range[0];
	
	$two_hand = 0;
	if($arr_weapon_type_id[0] == 3) $two_hand = 1;
	
	$use_dex = 0;
	if($arr_weapon_type_id[0] == 4) $use_dex = 1;
	
	$thrown = 0;
	//if range != "n/a" || range > 0 AND $arr_weapon_type_id[$i] != 4 (ranged)  then its thrown
	if(($arr_range_base[0] != "n/a" || $arr_range_base[0] > 0) && $arr_weapon_type_id[0] != 4)
		$thrown = 1;
	
	$query = "INSERT INTO Weapon
				(WeaponID, WeaponTypeID, WeaponClassID, WeaponName, DamageDieType, DamageDieNum, DamgeMod, TwoHand, CritRange, CritMult, RangeBase, WeaponSize, DamageType, Icon, SME, UseDex, Thrown, Description)
				VALUES (
					'".$weapon_id."', 
					'".$arr_weapon_type_id[0]."', 
					'".$arr_weapon_class_id[0]."', 
					'".$arr_weapon_name[0]."', 
					'".$arr_damage_die_type[0]."', 
					'".$arr_damage_die_num[0]."', 
					'".$arr_damage_mod[0]."', 
					'".$two_hand."', 
					'".$arr_crit_range[0]."', 
					'".$arr_crit_mult[0]."', 
					'".$arr_range_base[0]."', 
					'".$arr_weapon_size[0]."', 
					'".$arr_damage_type[0]."', 
					'".$arr_weapon_icon[0]."', 
					'".$arr_sme[0]."', 
					'".$use_dex."', 
					'".$thrown."',
					'".$arr_weapon_desc[0]."')";

	// Perform Query
	$result = mysqli_query($link,$query);
	
	
	mysqli_close($link);
	header('Location: ../../../manage_equipment.php#weapons');
?>