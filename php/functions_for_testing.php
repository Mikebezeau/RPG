<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	if(isset($_GET['heal_all']))
	{
		$stringified_character_id_array = $_POST['data']; //looks like ["1", "2", "45", ... ]
		//replace [] with ()
		$stringified_character_id_array = str_replace("[","(",$stringified_character_id_array,$countChar);
		$stringified_character_id_array = str_replace("]",")",$stringified_character_id_array);
		
		//prepare query of MasterCharacter table where characters party is the current $party_id
		//later --- order by walking position / row
		
		$query = "UPDATE MasterCharacter 
							SET HPdamage = 0
					WHERE CharacterID IN ".$stringified_character_id_array;
					
		$result = mysqli_query($link,$query);
		echo mysqli_error($link);
	}
	
	mysqli_close($link);
	
?>