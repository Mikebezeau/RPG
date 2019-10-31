<?php
	if(isset($arr_party_id[0])) {
		//form for delete buttons if called from manage_encounter_edit.php page id $delete_option == true
		//otherwise wont include form or delete buttons
		//technically, dont need to exclude form, just exclude buttons
		
		//$radio_button_select = true set in manage_encounter_edit, to put a radio button by the party name for selecting to add to encounter
		
		if($delete_option) echo '<form class="form_delete" method="post" action="queries/party_delete.php?catagory_id='.$catagory.'">';
		foreach($arr_party_id as $i => $value) {
			// LIST PARTIES *************************
			//dont list unassigned party 0 = "Unassigned"
			if($arr_party_id[$i] != 0) {
				// Prepare Query for MasterCharacter table

				$query="SELECT * FROM Parties INNER JOIN (CharacterParty INNER JOIN (MasterCharacter INNER JOIN ThumbPics
								ON MasterCharacter.ThumbPicID = ThumbPics.ThumbPicID)
							ON CharacterParty.CharacterID = MasterCharacter.CharacterID)
						ON Parties.PartyID = CharacterParty.PartyID
					WHERE CharacterParty.PartyID=".$arr_party_id[$i];

				// Perform MasterCharacter Query
				if($result = mysqli_query($link,$query)) {
					//get resulting rows from query
					$arr_character = array();
					$arr_character_id = array();
					$arr_player = array();
					$arr_thumb_pic_id = array();
					$arr_thumb_pic_file = array();
					while($row = mysqli_fetch_object($result)) {
						$party_name = $row->PartyName;
						$party_id = $row->PartyID;
						$arr_character[] = $row->CharacterName;
						$arr_character_id[] = $row->CharacterID;
						$arr_player[] = $row->PlayerName;
						$arr_thumb_pic_id[] = $row->ThumbPicID;
						$arr_thumb_pic_file[] = $row->FileName;
					} //end while
					//START PARTY DIV*************
					echo "<div class='party'>";
					
					//$radio_button_select = true set in manage_encounter_edit, to put a radio button by the party name for selecting to add to encounter
					if(isset($checkbox_select)) {
						if($checkbox_select == true) {
							echo "<input class='fltlft' type='checkbox' name='".$checkbox_name."' value='".$arr_party_id[$i]."' />";
						} //end if
					} //end if isset

					echo "<h2 class='fltlft'><a href='manage_party_edit.php?party_id=".$party_id."&catagory=".$catagory."'>".$party_name."</a></h2>".PHP_EOL;
					foreach($arr_character as $j => $value) {
						//display character pics
						echo "<img class='profile_pic' src='images/char/thumb/".$arr_thumb_pic_file[$j]."' alt='' width='44' height='44' />";
					} //end foreach
					echo "<br class='clearfloat' />";
					// delete party image button
					if($delete_option) echo '<input style="float:right;" type="submit" name="delete_party_id" value="'.$party_id.'"/>';
					echo "<p class='names'>";
					foreach ($arr_character as $j => $value) {
						//display character names
						echo "<a href='quick_stats_view.php?character_id=".$arr_character_id[$j]."&catagory=".$catagory."'>".$arr_character[$j]."</a> ";
					} //end foreach
					echo "</p>";
					if(isset($arr_encounter_id[$i])) {
						echo '<p class="center_text">Currently involved in encounter: '.$arr_encounter_name[$i].'</p>';
					} //end if
					echo "</div>";
				} //end if result
			} //end if unassigned
		} //end foreach
		if($delete_option) echo "</form>"; //end delete buttons form
	} //end if isset
 ?>