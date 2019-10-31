<?php
	// database connect function
	include_once("../../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();

	$arr_weapon_id = $_POST["arr_weapon_id"];
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
	// UPDATE WEAPONS

	foreach ($arr_weapon_id as $i => $value)
    { 
		//reverse crit range
		$arr_crit_range[$i] = 20 - $arr_crit_range[$i];
		
		$two_hand = 0;
		if($arr_weapon_type_id[$i] == 3) $two_hand = 1;
		
		$use_dex = 0;
		if($arr_weapon_type_id[$i] == 4) $use_dex = 1;
		
		$thrown = 0;
		//if range != "n/a" || range > 0 AND $arr_weapon_type_id[$i] != 4 (ranged)  then its thrown
		if(($arr_range_base[$i] != "n/a" || $arr_range_base[$i] > 0) && $arr_weapon_type_id[$i] != 4)
			$thrown = 1;
		
		$query = "UPDATE Weapon SET
						WeaponName = '".$arr_weapon_name[$i]."', 
						WeaponTypeID = '".$arr_weapon_type_id[$i]."', 
						WeaponClassID = '".$arr_weapon_class_id[$i]."', 
						DamageDieType = '".$arr_damage_die_type[$i]."', 
						DamageDieNum = '".$arr_damage_die_num[$i]."', 
						DamgeMod = '".$arr_damage_mod[$i]."', 
						TwoHand = '".$two_hand."', 
						CritRange= '".$arr_crit_range[$i]."', 
						CritMult = '".$arr_crit_mult[$i]."', 
						RangeBase = '".$arr_range_base[$i]."', 
						WeaponSize = '".$arr_weapon_size[$i]."', 
						DamageType = '".$arr_damage_type[$i]."', 
						Icon = '".$arr_weapon_icon[$i]."', 
						SME = '".$arr_sme[$i]."', 
						UseDex = '".$use_dex."', 
						Thrown =  '".$thrown."',
						Description = '".$arr_weapon_desc[$i]."'  
					WHERE WeaponID = ".$arr_weapon_id[$i];

		// Perform Query
		$result = mysqli_query($link,$query);
		
	} //end foreach
	
	//DELETE CHECKED WEAPONS
	if(isset($_POST["arr_delete_weapon_id"])) {
		$arr_delete_weapon_id = $_POST["arr_delete_weapon_id"];
		foreach ($arr_delete_weapon_id as $i => $value)
		{
			$query = "DELETE FROM Weapon WHERE WeaponID = ".$arr_delete_weapon_id[$i];
			//perform Query
			$result = mysqli_query($link,$query);
		} //end foreach
	} //end iff isset delete armor checks
	
	mysqli_close($link);
	header('Location: ../../../manage_equipment.php#weapons');
?>