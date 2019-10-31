<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	//$character_id = $_COOKIE['character_id'];
	//$character_id = $_GET['active_character_id'];;
	
	if(isset($_GET['topic_id'])) {
		$topic_id = $_GET['topic_id'];
	} //end if
	else {
		$topic_id = -1;
	}

	if(isset($_GET['encounter_id'])) {
		$encounter_id = $_GET['encounter_id'];
	} //end if
	else {
		$encounter_id = -1;
	}

	if(isset($_GET['round_num'])) {
		$round_num = $_GET['round_num'];
	} //end if
	else {
		$round_num = -1;
	}

	if (isset($_GET['active_character_id'])) {
		$posting_character_id = $_GET['active_character_id'];
	} //end if
	else {
		//$posting_character_id = $character_id;
	} //end else
	
	//echo "active char ".$_GET['posting_character_id'];
	
	$action = $_GET["action"];

	$target_damage = 0;
	$roll_comment = "";
	
	//SAVING THROW*******************************
	if ($action == "save") {
		$roll = mt_rand(1, 20);
		$type = $_POST["save_type"];
		$mod = $_POST["save_mod"];
		$roll_comment = $type." saving throw: 1d20 (".$roll.") + ".$mod." = ".($roll+$mod)."<br/>";
	}
	
	//SKILL ROLL*******************************
	elseif ($action == "skill") {
		$roll = mt_rand(1, 20);
		$type = $_POST["skill_name"];
		$mod = $_POST["skill_mod"];
		
		$roll_comment = $type." skill roll: 1d20 (".$roll.") + ".$mod." = ".($roll+$mod)."<br/>";
	}

	//ATTACK ROLL*******************************
	elseif ($action == 'attack') {
		$type = $_POST["attack_name"];
		
		$mod = $_POST["attack_mod"];
		$numdice = $_POST["num_dice"];
		$dietype = $_POST["die_type"];
		$damgemod = $_POST["damage_mod"];
		$crit_range = $_POST["crit_range"];
		$crit_mult = $_POST["crit_mult"];
		//set number of attacks
		$num_attacks = $_POST["num_attacks"];
		$check_string = $_POST["submit"];
		//check first letter of submit button value, 'S' indicates single and 'F' is multiple attacks
		//if a single attack, set $num_attacks down to 1
		if($check_string[0] == 'S') {
			$num_attacks = 1;
		} //end if
		//instanciate attack mod array
		$arr_mod = array();
		
		//set additional hit and damage modifiers
		$add_hit_mod = 0;
		$add_damage_mod = 0;
		
		//get target data and start $roll_comment
		if(isset($_POST["target_id"])) {
			$target_id = $_POST["target_id"];
			
			$query = 'SELECT MasterCharacter.CharacterName,MasterCharacter.HPDamage, QuickStats.AC 
						FROM MasterCharacter INNER JOIN QuickStats 
							ON MasterCharacter.QuickStatID = QuickStats.QuickStatID
						WHERE MasterCharacter.CharacterID = '.$target_id;
			// Perform Topics Query
			if($result = mysqli_query($link,$query)) {
				//Get resulting row from query
				$row = mysqli_fetch_object($result);
				$target_name = $row->CharacterName;
				$target_ac = $row->AC;
				$target_damage = $row->HPDamage;
				$roll_comment = $type." attack roll vs. ".$target_name;
			} //end if result
		} //end if isset target
		else {
			$roll_comment = $type." attack roll";
		} //end else
		
		//check for power attack
		if(isset($_POST["power_attack"])) {
			$roll_comment .= " (Power Attack)";
			$add_hit_mod += $_POST["power_attack_hit"];
			$add_damage_mod += $_POST["power_attack_damage"];
		}
		if(isset($_POST["rapid_shot"])) {
			$roll_comment .= " (Rapid Shot)";
			//adjust all attacks by -2 to hit
			$add_hit_mod -=2;
		}

		//end first line of attack $roll_comment
		$roll_comment .= ":<br />";
		
		//ADJUST $mod and $damagemod AT THIS POINT
		$mod += $add_hit_mod;
		$damgemod += $add_damage_mod;
		
		//SET NUMBER OF ATTACKS AND HIT ROLLS in $arr_mod[]
		
		//check for rapid shot
		//THROWS AN EXTRA ATTACK INTO $arr_mod[]
		if(isset($_POST["rapid_shot"])) {
			$arr_mod[] = $mod;
		}
		
		//check for monk attacks
		//if monk attack, then only reduce by 3?
		//else set attack rolls as per normal
		//reduce attack roll by 5 for each successive attack
		for ($i = 0; $i < $num_attacks; $i++) {
			$arr_mod[] = $mod -= (5 * $i);
		} //end for i, set attack mods
		
		
		
		foreach ($arr_mod as $i=>$value) {
			$roll = mt_rand(1, 20);
			//set $mod back from $arr_mod[]
			$mod = $arr_mod[$i];
			$roll_comment .= "1d20 (".$roll.") + ".$mod." = ".($roll+$mod);
			$critical_check = FALSE;
			$critical_hit = FALSE;
			//double damage dice and mod if critical hit
			if($crit_range >= (20 - $roll)){
				$critical_check = TRUE;
				//if isset target
				if(isset($target_name)) { 
					//if attack roll was high enough to hit
					if((($roll + $mod) >= $target_ac) || $roll == 20) {
						$crit_check_roll = mt_rand(1, 20);
						$roll_comment .= ", Critical check";
						//$target_id set to -1 if user did not choose target
						//if CRITICAL attack confirmaed (auto miss on roll of 1)
						if($crit_check_roll != 1 && ($crit_check_roll + $mod) >= $target_ac) {
							$numdice = $numdice * 2;
							$damgemod = $damgemod * 2;
							$roll_comment .= " success!</br>";
							$critical_hit = TRUE;
						} //end if
						//else attack missed
						else {
							$roll_comment .= " failed.</br>";
						}
					} //end if hit
				} //end if isset
				//else no target specified, auto pass
				else {
					$crit_check_roll = mt_rand(1, 20);
					$roll_comment .= ", Critical check roll: ".($crit_check_roll + $mod)."</br> Critical "; //critical damage text follows
					$numdice = $numdice * 2;
					$damgemod = $damgemod * 2;
					$critical_hit = TRUE;
				} //end crit check
			} //end crit range

			//damage roll
			$totaldamage = 0;
			for ($j = 0; $j < $numdice; $j++) {
				$arr_damageroll[$j] = mt_rand(1, $dietype);
				$totaldamage += $arr_damageroll[$j];
			} //end for $j
			
			//damage comment
			$damage_comment = "Damage roll: ".$numdice."d".$dietype." (";
			for ($j = 0; $j < $numdice; $j++) {
				$damage_comment .= $arr_damageroll[$j];
				if ($j + 1 < $numdice) $damage_comment .= ", ";
			} //end for $j
			$damage_comment .= ") ";
			if ($damgemod > 0) $damage_comment .= "+ ".$damgemod;
			$damage_comment .= " = ".($totaldamage + $damgemod);
			
			//if isset target
			if(isset($target_name)) { 
				//$target_id set to -1 if user did not choose target
				//if attack hit
				if((($roll+$mod) >= $target_ac) || $roll == 20) {
					if($critical_hit == TRUE)
						$roll_comment .= "Critical ".$damage_comment;
					elseif ($critical_check == TRUE)
						$roll_comment .= "Hit! ".$damage_comment;
					else
						$roll_comment .= ", hit! ".$damage_comment;
					//apply damage to MasterCharacter record
					$target_damage += ($totaldamage + $damgemod);
				} //end if
				//else attack missed
				else {
					$roll_comment .= ", missed";
				}
			} //end if isset
			else
				$roll_comment .= " ".$damage_comment;
			
			if ($i < $_POST["num_attacks"]) $roll_comment .= "<br />";
			
		} //end for $i
		
		if(isset($target_name)) { 
			//update MasterCharacter
			$query = "UPDATE MasterCharacter SET HPDamage = ".$target_damage." WHERE CharacterID = ".$target_id;
			//preform query
			$result = mysqli_query($link,$query);
		} //end if target isset
	
	} //end attack
	
	
	//CMB ROLL*******************************
	elseif ($action == 'cmb') {
		$selection = explode('|',$_POST['cmb']);
		$cm_type = $selection[0];
		$mod = $selection[1];
		$totalroll = 0;

		//get target data
		if(isset($_POST["target_id"])) {
			$target_id = $_POST["target_id"];
			
			$query = 'SELECT MasterCharacter.CharacterName, MasterCharacter.Description, QuickStats.CMD, QuickStats.'.$cm_type.'D AS Modifier
						FROM MasterCharacter INNER JOIN QuickStats 
							ON MasterCharacter.QuickStatID = QuickStats.QuickStatID
						WHERE MasterCharacter.CharacterID = '.$target_id;
			// Perform Topics Query
			if($result = mysqli_query($link,$query)) {
				//Get resulting row from query
				$row = mysqli_fetch_object($result);
				$target_name = $row->CharacterName;
				$target_description = $row->Description;
				$target_cmd = $row->CMD;
				$target_mod = $row->Modifier;
				$roll_comment = $cm_type." attack roll vs. ".$target_name.": <br />";
			} //end if result
		} //end if isset target
		else {
			$roll_comment = $cm_type." attack roll: <br />";
		} //end else
		
		$roll = mt_rand(1, 20);
		$total_attack = $roll + $mod;
		$total_defense = $target_cmd + $target_mod;
		$roll_comment .= "1d20 ($roll) + $mod = $total_attack Vs. Defense $total_defense<br/>";
		
		//if isset target
		if(isset($target_name)) { 
			//$target_id set to -1 if user did not choose target
			//if attack hit
			if($total_attack >= $total_defense) {
				$roll_comment .= ', success!';
				//update MasterCharacter target description - append $cm_type
				$query = "UPDATE MasterCharacter SET Description = '".$target_description."\nHit by ".$cm_type."' WHERE CharacterID = ".$target_id;
				//preform query
				$result = mysqli_query($link,$query);
			} //end if
			//else attack missed
			else {
				$roll_comment .= ", failed";
			}
		} //end if isset
	
	} //end elseif
	
	
	//DICE ROLL*******************************
	elseif ($action == "roll") {
		$numdice = $_POST["num_dice"];
		$dietype = $_POST["die_type"];
		$mod = $_POST["roll_mod"];
		$totalroll = 0;
		$new_post_text = nl2br($_POST['dice_description']); 
		$new_post_text = mysqli_real_escape_string($link,$new_post_text);
		
		$roll_comment = "Die roll: ";
		
		if ($_POST["dice_description"] != "Description") { $roll_comment = $new_post_text." ..roll: "; }
		for ($j = 0; $j < $numdice; $j++) {
			$arr_roll[$j] = mt_rand(1, $dietype);
			$totalroll += $arr_roll[$j];
		}
		$roll_comment .= $numdice."d".$dietype." (";
		for ($j = 0; $j < $numdice; $j++) {
			$roll_comment .= $arr_roll[$j];
			if ($j + 1 < $numdice) { $roll_comment .= ", "; }
		}
		$roll_comment .= ") ";
		if ($mod > 0) { $roll_comment .= "+ ".$mod; }
		$roll_comment .= " = ".($totalroll + $mod)."<br/>";
	}
	
	//PARTY MEMBER UPDATES AND GROUP SAVE ROLLS*******************************
	elseif ($action == "party_action_update") {
		
		if(isset($_POST["update"])) {
			//notes update can be called from any page
			if(isset($_GET["back_to_page"])) {
				$back_to_page = $_GET["back_to_page"];
			} //end if isset
			
			//update hit point damage / used spell points
			$character_id = $_POST["character_id"];
			$char_damage_taken = $_POST["char_damage_taken"];
			$description_text = $_POST["description_text"];
			
			foreach($character_id as $i => $value) {
				$query = "UPDATE MasterCharacter SET HPDamage = ".$char_damage_taken[$i].", Description = '".mysqli_real_escape_string($link, $description_text[$i])."' WHERE CharacterID = ".$character_id[$i];
				$result = mysqli_query($link,$query);
			} //end foreach
			//set header to return user to topic or encounter page
			
			if(isset($back_to_page)) {
				mysqli_close($link);
				//header('Location: ../'.$back_to_page);
			} //end if
			elseif($topic_id >= 0) {
				mysqli_close($link);
				//header('Location: ../forum_topic.php?topic_id='.$topic_id);
			} //end elseif
			else {
				mysqli_close($link);
				//header('Location: ../battle.php?encounter_id='.$encounter_id);
			} //end else
		} //end if		
		elseif(isset($_POST["char_save_check"])) {
			
			//set up to post as GM
			//$posting_character_id = 99; //done in Party.php
			
			//get array of character ids to roll saves for
			$arr_group_save_char_id = $_POST["char_save_check"];
			
			//create query search string for WHERE IN clause
			//add first id out of loop to get format of ", " seperators correct
			$search_in = implode(',', $arr_group_save_char_id);

			
			//get DC of save
			$save_dc = $_POST["save_dc"];
			//get save type (fort, ref, will)
			if(isset($_POST["group_fort_save"]))
				$type = "Fort";
			if(isset($_POST["group_ref_save"]))
				$type = "Ref";
			else
				$type = "Will";
				
			//query QuickStats to get save roll modifier for each character
			$query = "SELECT QuickStats.$type AS Save, MasterCharacter.CharacterName FROM MasterCharacter INNER JOIN QuickStats 
							ON MasterCharacter.QuickStatID = QuickStats.QuickStatID
						WHERE MasterCharacter.CharacterID IN ($search_in) ORDER BY MasterCharacter.CharacterName";
			//perform LevelAbility query
			if($result = mysqli_query($link,$query)) {
				//get resulting rows from query
				$roll_comment = "<i>$type saving throw rolls, DC $save_dc:</i><br/>";
				while($row = mysqli_fetch_object($result))
				{
					$roll = mt_rand(1, 20);
					$total_roll = $roll + $row->Save;
					$roll_comment .= "$row->CharacterName -> $total_roll";
					if($total_roll >= $save_dc) $roll_comment .= " pass<br/>";
					else $roll_comment .= " fail<br/>";
				} //end while
			} //end result
		} //end if isset $_POST["char_save_check"]
	} //end else
	
	
	//******************************
	//INSERT into Post or EncounterPost depending on $topic_id > 0 (for an EncounterPost update, set cookie topicid = -1
	//must go last, updates database for either topic or forum post
	
	//TOPIC POST
	if($topic_id >= 0) {
		// get next PostID number bacuase im not using autoincrement
		$query = 'SELECT PostID
					FROM Posts
					ORDER BY PostID DESC
					LIMIT 1';
		
		// Perform Topics Query
		$result = mysqli_query($link,$query);

		//Get resulting row from query
		$row = mysqli_fetch_object($result);
		$new_post_id = $row->PostID + 1;
		
		//insert roll into db
		$query = "INSERT INTO Posts (PostID, CharacterID, TopicID, Content, PostDate, Roll, MarkDelete) VALUES 
					(".$new_post_id.", ".$posting_character_id.", ".$topic_id.", '".mysqli_real_escape_string($link, $roll_comment)."', NOW(), TRUE, FALSE)";
		
		// Perform Query
		$result = mysqli_query($link,$query);
		
		mysqli_close($link);
		//header('Location: ../forum_topic.php?topic_id='.$topic_id);
	} //end if
	
	//ENCOUNTER POST
	else {
		if (isset($_GET['round_num'])) {
			$round_num = $_GET['round_num'];
		} //end if
		else {
			$round_num = 0;
		} //end else
		
		// get next EncounterPostID number bacuase im not using autoincrement
		$query = 'SELECT EncounterPostID
					FROM EncounterPost
					ORDER BY EncounterPostID DESC
					LIMIT 1';
		
		// Perform Topics Query
		$result = mysqli_query($link,$query);

		//Get resulting row from query
		$row = mysqli_fetch_object($result);
		$new_encounter_post_id = $row->EncounterPostID + 1;
		
		//insert roll into db
		$query = "INSERT INTO EncounterPost (EncounterPostID, CharacterID, EncounterID, RoundNum, Content, PostDate, Roll, GroupThis, MarkDelete) VALUES 
						(".$new_encounter_post_id.", ".$posting_character_id.", ".$encounter_id.", ".$round_num.", '".$roll_comment."', NOW(), TRUE, TRUE, FALSE)";
		
		// Perform Query
		$result = mysqli_query($link,$query);

		//header('Location: ../battle.php?encounter_id='.$encounter_id);
	} //end else
	
	mysqli_close($link);
	
	echo json_encode(array('alter_hp_damage'=>$target_damage, 'roll_comment'=>$roll_comment));
?>