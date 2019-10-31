<?php

// EQUIPMENT ***************************************************
$arr_equip_id = array();
$arr_equip_name = array();
$arr_equip_description = array();
$arr_equip_id_magic = array();
$arr_equip_name_magic = array();
$arr_equip_description_magic = array();

// Prepare Query for CharacterEquipment table
$query = 'SELECT Equipment.EquipID, Equipment.EquipName, Equipment.Magical, Equipment.Description 
			FROM CharacterEquipment INNER JOIN Equipment ON CharacterEquipment.EquipID = Equipment.EquipID
			WHERE CharacterEquipment.CharacterID = '.$character_id;
// Perform CharacterProficiency Query
if ($result = mysqli_query($link,$query)) {
	//Get resulting rows from query
	while($row = mysqli_fetch_object($result)) {
		if($row->Magical) {
			$arr_equip_id_magic[] = $row->EquipID;
			$arr_equip_name_magic[] = $row->EquipName;
			$arr_equip_description_magic[] = $row->Description;
		} //end if magical
		else {
			$arr_equip_id[] = $row->EquipID;
			$arr_equip_name[] = $row->EquipName;
			$arr_equip_description[] = $row->Description;
		} //end if magical
	} // end while
}
?>