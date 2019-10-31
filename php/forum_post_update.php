<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();

	$character_id = $_COOKIE['character_id'];

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
	
	if(isset($_GET['round_num'])) {
		$round_num = $_GET['round_num'];
	} //end if
	else {
		$round_num = -1;
	}
	
	if (isset($_GET['active_character_id'])) {
		$active_character_id = $_GET['active_character_id'];
	} //end if
	else {
		//$active_character_id = $character_id;
	} //end else
	
	//make sure text has been entered into new_post_text
	if (isset($_POST['new_post_text']) && $_POST['new_post_text'] != '') {
		//get new post content
		//get mesage taxt for email, email called below
		$message_text = $_POST['new_post_text'];
		//Converts the new line characters (\n) in the text area into HTML line breaks (the <br /> tag)
		$new_post_text = nl2br($_POST['new_post_text']); 
		
		//******************************
		//INSERT into Post or EncounterPost depending on $topic_id > 0 (for an EncounterPost update, set cookie topic_id = -1
		
		//FORUM POST
		if($topic_id >= 0) {
			//get next PostID number bacuase im not using autoincrement
			$query = 'SELECT PostID
						FROM Posts
						ORDER BY PostID DESC
						LIMIT 1';
			
			//perform Topics Query
			$result = mysqli_query($link,$query);

			//get resulting row from query
			$row = mysqli_fetch_object($result);
			$new_post_id = $row->PostID + 1;
			
			//insert post into db
			$query = "INSERT INTO Posts (PostID, CharacterID, TopicID, PostDate, Roll, Content) VALUES 
						(".$new_post_id.", ".$active_character_id.", ".$topic_id.", NOW(), FALSE, '".mysqli_real_escape_string($link, $new_post_text)."' )";
						
			// Perform Post UPDATE Query
			$result = mysqli_query($link,$query);
		} //end if
		
		//ENCOUNTER POST
		else {
			if (isset($_GET['round_num'])) {
				$round_num = $_GET['round_num'];
			} //end if
			else {
				$round_num = 0;
			} //end else

			//get next EncounterPostID number bacuase im not using autoincrement
			$query = 'SELECT EncounterPostID
						FROM EncounterPost
						ORDER BY EncounterPostID DESC
						LIMIT 1';
			
			//perform Topics Query
			if($result = mysqli_query($link,$query)) {
				//get resulting row from query
				$row = mysqli_fetch_object($result);
				$new_encounter_post_id = $row->EncounterPostID + 1;
			} //end if
			else {
				$new_encounter_post_id = 0;
			}
				
			//insert post into db
			$query = "INSERT INTO EncounterPost (EncounterPostID, CharacterID, EncounterID, RoundNum, Content, PostDate, Roll, GroupThis, MarkDelete) VALUES 
						(".$new_encounter_post_id.", ".$active_character_id.", ".$encounter_id.", ".$round_num.", '".mysqli_real_escape_string($link,$new_post_text)."', NOW(), FALSE, TRUE, FALSE)";
						
			// Perform Post UPDATE Query
			$result = mysqli_query($link,$query);
		} //end else
		
		//SEND UPDATE EMAILS TO DESIRED RECIPIENTS
		if (isset($_POST['arr_email_player_id'])) {
			$arr_email_player_id = $_POST['arr_email_player_id'];
			$arr_email = array();
			foreach($arr_email_player_id as $i => $value) {
				//using id as part of input name instead of array
				$arr_email[] = $_POST["player_email$arr_email_player_id[$i]"];
			} //end foreach
			//got mesage text above
			//$message_text = $_POST['new_post_text'];
			include_once("../includes/inc_send_email.php");
		} //end if send email(s)
		
		//REDIRECT BACK TO CORRECT PAGE
		mysqli_close($link);
		if($topic_id >= 0) {
			header('Location: ../forum_topic.php?topic_id='.$topic_id);
		}
		else {
			header('Location: ../battle.php?encounter_id='.$encounter_id);
		}
	} //end if isset new_post_text
	
	mysqli_close($link);
	
?>