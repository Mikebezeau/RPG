<?php
	// database connect function
	include_once("../../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();

	$character_id = $_GET['character_id'];
	
	//***********************
	// UPDATE FEATS
	
	//delete old feats
	$query = "DELETE FROM CharacterSpecialAbility WHERE CharacterID=".$character_id;
	// Perform Query
	$result = mysqli_query($link,$query);
	
	if(isset($_POST["arr_special_ability"])) {
		// place ability info into array
		$arr_special_ability = array();
		$arr_special_ability_desc = array();
		foreach($_POST["arr_special_ability"] as $abil) { 
				$arr_special_ability[] = $abil;
		} //end foreach
		foreach($_POST["arr_special_ability_desc"] as $desc) { 
				$arr_special_ability_desc[] = $desc;
		} //end foreach

		//insert CharacterSpecialAbility into db
		foreach ($arr_special_ability as $i => $value) { 
			if($arr_special_ability[$i] != "") {
				$query = "INSERT INTO CharacterSpecialAbility (CharacterID, SpecialAbility, Description) VALUES
						(".$character_id.", '".$arr_special_ability[$i]."', '".$arr_special_ability_desc[$i]."')";
				// Perform Query
				$result = mysqli_query($link,$query);
			} //end if
		} //end foreach
	} //end if isset
	
	mysqli_close($link);
	header('refresh:0; url=../../../character_sheet.php?character_id='.$character_id);
	exit;
?>