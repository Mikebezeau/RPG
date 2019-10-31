<?php
	// database connect function
	include_once("../../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();

	$arr_equip_id = $_POST["arr_equip_id"];
	$arr_equip_name = $_POST["arr_equip_name"];
	$arr_equip_slot = $_POST["arr_equip_slot"];
	$arr_equip_desc = $_POST["arr_equip_desc"];
	$arr_equip_icon = $_POST["arr_equip_icon"];
	
	//***********************
	// UPDATE EQUIPMENT

	foreach ($arr_equip_id as $i => $value)
  { 
		$query = "UPDATE Equipment SET
						EquipName = '".$arr_equip_name[$i]."', 
						Magical = '1', 
						Slot = '".$arr_equip_slot[$i]."', 
						Description = '".$arr_equip_desc[$i]."', 
						Icon = '".$arr_equip_icon[$i]."'
					WHERE EquipID = ".$arr_equip_id[$i];

		// Perform Query
		$result = mysqli_query($link,$query);
	} //end foreach
	
	//DELETE CHECKED EQUIPMENT
	if(isset($_POST["arr_delete_equip_id"])) {
		$arr_delete_equip_id = $_POST["arr_delete_equip_id"];
		foreach ($arr_delete_equip_id as $i => $value)
		{
			$query = "DELETE FROM Equipment WHERE EquipID = ".$arr_delete_equip_id[$i];
			//perform Query
			$result = mysqli_query($link,$query);
		} //end foreach
	}
	
	mysqli_close($link);
	header('Location: ../../../manage_equipment.php#equip');
?>