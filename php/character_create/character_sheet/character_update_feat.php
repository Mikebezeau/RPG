<?php
	// database connect function
	include_once("../../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();

	$character_id = $_GET['character_id'];
	
	//***********************
	// UPDATE FEATS
	
	//delete old feats
	$query = "DELETE FROM CharacterFeat WHERE CharacterID=".$character_id;
	// Perform Query
	$result = mysqli_query($link,$query);
	
	// place feat info into array
	$arr_feat_id = $_POST["arr_feat_id"];
	
	if(isset($arr_feat_id)) {
		//insert attributes into db
		foreach ($arr_feat_id as $i => $value)
		{ 
			$query = "INSERT INTO CharacterFeat (CharacterID, FeatID) VALUES
					(".$character_id.", ".$arr_feat_id[$i].")";
			// Perform Query
			$result = mysqli_query($link,$query);
		}
	} //end if isset
	
	mysqli_close($link);
	header('refresh:0; url=../../../character_sheet.php?character_id='.$character_id);
	exit;
?>