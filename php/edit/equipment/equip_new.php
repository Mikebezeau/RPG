<?php
	// database connect function
	include_once("../../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();

	$weapon_id = 0;
	//get next WeaponID (not using auto-increment
	$query = "SELECT EquipID FROM Equipment ORDER BY EquipID DESC LIMIT 1";
	if($result = mysqli_query($link,$query)) {
		$row = mysqli_fetch_object($result);
		$equip_id = $row->EquipID;
		//add one to get next available equip id
		$equip_id++;
	} //end if $result
	
	//data on form stored in same format as data in equip list, in element arrays.  capture data from only element in array at [0]
	$arr_equip_name = $_POST["arr_equip_name"];
	$arr_equip_slot = $_POST["arr_equip_slot"];
	$arr_equip_desc = $_POST["arr_equip_desc"];
	$arr_equip_icon = $_POST["arr_equip_icon"];
	
	//***********************
	// INSERT NEW EQUIPMENT
	
	$query = "INSERT INTO Equipment
				(EquipID, EquipName, Magical, Slot, Description, Icon)
				VALUES (
					'".$equip_id."', 
					'".$arr_equip_name[0]."', 
					'1', 
					'".$arr_equip_slot[0]."', 
					'".$arr_equip_desc[0]."',
					'".$arr_equip_icon[0]."')";

	// Perform Query
	$result = mysqli_query($link,$query);
	
	
	mysqli_close($link);
	header('Location: ../../../manage_equipment.php#equip');
?>