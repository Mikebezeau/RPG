<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	$delete_post_id = $_POST['delete_post'];

	if (isset($_GET['topic_id'])) {
		$topic_id = $_GET['topic_id'];
	} //end if
	else {
		$topic_id = -1;
	} //end else

	if (isset($_GET['encounter_id'])) {
		$encounter_id = $_GET['encounter_id'];
	} //end if
	else {
		$encounter_id = -1;
	} //end else
	
	//DELETE POST
	if($topic_id >= 0) {	
		//delete from db
		$query = "DELETE FROM Posts
				WHERE PostID=".$delete_post_id;
		
		// Perform Query
		$result = mysqli_query($link,$query);
	} //end if
	
	//DELETE ENCOUNTER POST
	else {
		//delete from db
		$query = "DELETE FROM EncounterPost
				WHERE EncounterPostID=".$delete_post_id;
		
		// Perform Query
		$result = mysqli_query($link,$query);
	} //end else
	
	mysqli_close($link);
	
?>