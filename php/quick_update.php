<?php
	
	$new_character = $_POST["new"];
	$character_id = $_POST["view_character_id"];
	$quick_stat_id = $_POST["view_quick_stat_id"];
	$quick_stat_catagory_id = $_POST["view_catagory_id"];
	
	//ONLY FOR MONSTERS AND NPCS
	if($quick_stat_catagory_id != 1) {
		// database connect function
		include_once("../includes/inc_connect.php"); 
		
		// Connect to database using function from "inc_connect.php"
		$link = dbConnect();
		
		echo "<br/>char_id: ".$character_id = $_POST["view_character_id"];
		echo "<br/>quick_stat_id ".$quick_stat_id = $_POST["view_quick_stat_id"];
		echo "<br/>quick_stat_catagory_id ".$quick_stat_catagory_id = $_POST["view_catagory_id"];
		
		//save old quickstat id to delete old records in other quickstat tables
		$new_quick_stat_id = $quick_stat_id;
		//***********************
		// UPDATE ALL QuickStat info
		
		//if $quick_stat_id < 0 need to get next QuickStatID AUTO_INCREMENT value, then INSERT new record into QuickStats
		if($quick_stat_id < 0) {
			$insterNewQuickStat = true;
			//update Characters with new QuickStatID
			//insert new QuickStat record for character
			
			//next QuickStats AUTO_INCREMENT
			$tablename	= "QuickStats";
			$next_increment = 0;
			$query_ShowStatus = "SHOW TABLE STATUS LIKE '$tablename'";
			$query_ShowStatusResult	= mysqli_query($link, $query_ShowStatus) or die ( "Query failed: " . mysqli_error() . "<br/>" . $query_ShowStatus );
			
			$row = mysqli_fetch_assoc($query_ShowStatusResult);
			$next_increment = $row['Auto_increment'];
		
			echo "<br/>autoinc quick_stat_id: ".$quick_stat_id = $next_increment;
			$new_quick_stat_id = $next_increment;
		} //end if need new quickstat_id
		
		$sprite_pic_id = $_POST["sprite_pic_id"];
		$thumb_pic_id = $_POST["thumb_pic_id"];
		$full_pic_id = $_POST["full_pic_id"];
		
		//if this is a new quickstat template being created, insert. otherwise update
		if($insterNewQuickStat == true) {
			//insert new QuickStats record for character
			echo $query = "INSERT INTO QuickStats
						(QuickStatID, Name, Description, CatagoryID, SizeID, AlignGoodID, AlignChaosID, CreatureTypeID, Initiative, Armor, DeflectAC, Dodge, NaturalAC, DR, SR, HD, HP, ASP, DSP, Fort, Ref, Will, Move, Swim, Fly, Space, Reach, StrMod, DexMod, ConMod, IntMod, WisMod, ChaMod, BAB, CMB, BullRushB, DisarmB, GrappleB, SunderB, TripB, FeintB, CMD, BullRushD, DisarmD, GrappleD, SunderD, TripD, FeintD, SpriteID, ThumbPicID, PortraitPicID, FullPicID)
						VALUES
						(".$new_quick_stat_id.", '".$_POST['name']."', '".$_POST['description']."', ".$quick_stat_catagory_id.", ".$_POST['size_id'].", ".$_POST['align_good_id'].", ".$_POST['align_chaos_id'].", ".$_POST['CreatureTypeID'].", ".$_POST['initiative'].", ".$_POST['Armor'].", ".$_POST['DeflectAC'].", ".$_POST['Dodge'].", ".$_POST['NaturalAC'].", '".$_POST['dr']."', ".$_POST['sr'].", ".$_POST['hd'].", ".$_POST['hp'].", ".$_POST['asp'].", ".$_POST['dsp'].", ".$_POST['fort'].", ".$_POST['ref'].", ".$_POST['will'].", ".$_POST['move'].", ".$_POST['swim'].", ".$_POST['fly'].", ".$_POST['space'].", ".$_POST['reach'].", ".$_POST['str_mod'].", ".$_POST['dex_mod'].", ".$_POST['con_mod'].", ".$_POST['int_mod'].", ".$_POST['wis_mod'].", ".$_POST['cha_mod'].", ".$_POST['bab'].", ".$_POST['cmb'].", ".$_POST['bullrush_b'].", ".$_POST['disarm_b'].", ".$_POST['grapple_b'].", ".$_POST['sunder_b'].", ".$_POST['trip_b'].", ".$_POST['feint_b'].", ".$_POST['cmd'].", ".$_POST['bullrush_d'].", ".$_POST['disarm_d'].", ".$_POST['grapple_d'].", ".$_POST['sunder_d'].", ".$_POST['trip_d'].", ".$_POST['feint_d'].", ".$sprite_pic_id.", ".$thumb_pic_id.", 0, ".$full_pic_id.")";
			// Perform insert Query
			$result = mysqli_query($link,$query);
		} //end if $quick_stat_id < 0
		else { 
		//quickstat_id exists (>=0), update QuickStats with new totals
			echo $query = "UPDATE QuickStats
					SET SizeID=".$_POST['size_id'].", AlignGoodID=".$_POST['align_good_id'].", AlignChaosID=".$_POST['align_chaos_id'].", CreatureTypeID=".$_POST['CreatureTypeID'].", Initiative=".$_POST['initiative'].", Armor=".$_POST['Armor'].", DeflectAC=".$_POST['DeflectAC'].", Dodge=".$_POST['Dodge'].", NaturalAC=".$_POST['NaturalAC'].", DR='".$_POST['dr']."', SR=".$_POST['sr'].", HD=".$_POST['hd'].", HP=".$_POST['hp'].", ASP=".$_POST['asp'].", DSP=".$_POST['dsp'].", Fort=".$_POST['fort'].", Ref=".$_POST['ref'].", Will=".$_POST['will'].", Move=".$_POST['move'].", Swim=".$_POST['swim'].", Fly=".$_POST['fly'].", Space=".$_POST['space'].", Reach=".$_POST['reach'].", StrMod=".$_POST['str_mod'].", DexMod=".$_POST['dex_mod'].", ConMod=".$_POST['con_mod'].", IntMod=".$_POST['int_mod'].", WisMod=".$_POST['wis_mod'].", ChaMod=".$_POST['cha_mod'].", BAB=".$_POST['bab'].", CMB=".$_POST['cmb'].", BullRushB=".$_POST['bullrush_b'].", DisarmB=".$_POST['disarm_b'].", GrappleB=".$_POST['grapple_b'].", SunderB=".$_POST['sunder_b'].", TripB=".$_POST['trip_b'].", FeintB=".$_POST['feint_b'].", CMD=".$_POST['cmd'].", BullRushD=".$_POST['bullrush_d'].", DisarmD=".$_POST['disarm_d'].", GrappleD=".$_POST['grapple_d'].", SunderD=".$_POST['sunder_d'].", TripD=".$_POST['trip_d'].", FeintD=".$_POST['feint_d']." WHERE QuickStatID=".$new_quick_stat_id;
			// Perform update Query
			$result = mysqli_query($link,$query);
			
			//CharacterID given, update MasterCharacter with new name, sprite and Thumb pic id, altering this one, making unique
			echo $query = "UPDATE MasterCharacter
					SET CharacterName='".$_POST['name']."', Description='".$_POST['description']."', SpriteID=".$sprite_pic_id.", ThumbPicID=".$thumb_pic_id.", PortraitPicID=0, FullPicID=".$full_pic_id." 
					WHERE CharacterID=".$character_id;
			$result = mysqli_query($link,$query);
			
			//update this characters items held, unique for this guy
			//TBD
		} //end else $quick_stat_id != null
	
		//CREATURE SUBTYPE(S)
		//delete old QuickStatSubTypes and insert new skill rolls
		$query = "DELETE FROM QuickStatSubTypes WHERE QuickStatID=".$quick_stat_id;
		$result = mysqli_query($link,$query);
		$CreatureSubTypeID = $_POST['CreatureSubTypeID'];
		for($i=0; $i<count($CreatureSubTypeID); $i++)
		{
			if($CreatureSubTypeID[$i] != 0)
			{
				$query = "INSERT INTO QuickStatSubTypes (QuickStatID, CreatureSubTypeID) VALUES(".$quick_stat_id.", ".$CreatureSubTypeID[$i].")";
				$result = mysqli_query($link,$query);
			}
		}
		
		//SKILLS********************
		//UPDATE or INSERT QuickSkill
		$arr_skill_id = $_POST["arr_skill_id"];
		$arr_skill_roll = $_POST["arr_skill_roll"];
		
		foreach ($arr_skill_id as $i => $value)
		{ 
			//query if record exists already
			$query = "SELECT QuickStatID FROM QuickSkill 
					WHERE QuickStatID = ".$new_quick_stat_id." AND SkillID = ".$arr_skill_id[$i]." LIMIT 1";
			// Perform Query
			if($result = mysqli_query($link,$query)) {
				if(mysqli_num_rows($result) > 0) {
					//update old record
					$query = "UPDATE QuickSkill SET SkillRoll = ".$arr_skill_roll[$i]." WHERE QuickStatID = ".$new_quick_stat_id." AND SkillID = ".$arr_skill_id[$i];
					// Perform Query
					$result = mysqli_query($link,$query);	
				} //end if record exists
				else {
					//create new record
					$query = "INSERT INTO QuickSkill (QuickStatID, SkillID, SkillRoll) VALUES (".$new_quick_stat_id.", ".$arr_skill_id[$i].", ".$arr_skill_roll[$i].")";
					// Perform Query
					$result = mysqli_query($link,$query);
				} //end messy wtf
			} //end if result
			else {
				//create new record
				$query = "INSERT INTO QuickSkill (QuickStatID, SkillID, SkillRoll) VALUES (".$new_quick_stat_id.", ".$arr_skill_id[$i].", ".$arr_skill_roll[$i].")";
				// Perform Query
				$result = mysqli_query($link,$query);
			}
		} //end foreach skill
	
		//SPECIAL********************
		//
		$arr_special_id = $_POST["arr_special_id"];
		$arr_special_name = $_POST["arr_special_name"];
		$arr_special_description = $_POST["arr_special_description"];
		$arr_special_animname = $_POST["arr_special_animname"];

		foreach ($arr_special_id as $i => $value)
		{
			if($arr_special_name[$i] != '')
			{
				//if existing
				if($arr_special_id[$i] > 0)
				{
					$query = "DELETE FROM QuickSpecial WHERE QuickSpecialID=".$arr_special_id[$i];
					$result = mysqli_query($link,$query);
					$query = "INSERT INTO QuickSpecial (QuickSpecialID, QuickStatID, SpecialName, Description, AnimName) VALUES (".$arr_special_id[$i].", ".$new_quick_stat_id.", '".mysqli_real_escape_string($link, $arr_special_name[$i])."', '".mysqli_real_escape_string($link, $arr_special_description[$i])."', '".mysqli_real_escape_string($link, strtolower($arr_special_animname[$i]))."')";
					$result = mysqli_query($link,$query);
				}
				else
				{
					$query = "INSERT INTO QuickSpecial (QuickStatID, SpecialName, Description, AnimName) VALUES (".$new_quick_stat_id.", '".$arr_special_name[$i]."', '".mysqli_real_escape_string($link, $arr_special_description[$i])."', '".mysqli_real_escape_string($link, strtolower($arr_special_animname[$i]))."')";
					$result = mysqli_query($link,$query);
				}
			} //end if
		} //end foreach special
		
		//ATTACKS************************
		/*
		//delete old QuickAttackHitRolls and create new QuickAttackHitRolls based on current character attacks
		//for each QuickAttack, query QuickAttackHitRolls to get list of multiple attack rolls
		$query = "SELECT QuickAttackID FROM QuickAttack WHERE QuickStatID=".$quick_stat_id;
		//reset the attack bunos array so that it gets set to 0 for this next attack if there is no attack needs to be reset
		if($result = mysqli_query($link,$query)) {
			while($row = mysqli_fetch_object($result)) {
				$query = "DELETE FROM QuickAttackHitRolls WHERE QuickAttackID=".$row->QuickAttackID;
				//perform query, use different var name to not mess up looping result
				$delete_result = mysqli_query($link,$query);			
			} //end while
		} //end if result
		
		//delete old QuickAttack and create new QuickAttacks based on current character attacks
		$query = "DELETE FROM QuickAttack WHERE QuickStatID=".$quick_stat_id;
		// Perform Query
		$result = mysqli_query($link,$query);
		*/
		$arr_quick_attack_id = $_POST['arr_quick_attack_id'];
		$arr_attack_name = $_POST['arr_attack_name'];
		$arr_damage_die_type = $_POST['arr_damage_die_type'];
		$arr_damage_die_num = $_POST['arr_damage_die_num'];
		$arr_damage_mod = $_POST['arr_damage_mod'];
		$arr_crit_range = $_POST['arr_crit_range'];
		$arr_crit_mult = $_POST['arr_crit_mult'];
		$arr_range_base = $_POST['arr_range_base'];
		
		//$arr_attack_bonus = array();
		$arr_off_hand = array(0, 1, 1, 1, 1);
		$arr_two_hand = array(0, 0, 0, 0, 0);
		$arr_thrown = array(0, 0, 0, 0, 0);
		$arr_flurry = array(0, 0, 0, 0, 0);
		
		//check all 5 attack fields
		for($i = 0; $i < 5; $i++) {
			//double quotes auto-concatinate
			//array of hit rolls for each of the 5 attack types
			$arr_attack_bonus[$i] = $_POST["arr_attack_bonus$i"];
			
			//get info for main/secondary radio buttons - set OffHand to true for secondary attacks
			if(isset($_POST["arr_off_hand$i"]) && $_POST["arr_off_hand$i"] == 0) $arr_off_hand[$i] = '0';
			else $arr_off_hand[$i] = '1';
			
			//get info from check boxes differently baecause unchecked boxes are not recognised
			if(isset($_POST["arr_two_hand$i"])) $arr_two_hand[$i] = '1';
			else $arr_two_hand[$i] = '0';
			
			if(isset($_POST["arr_thrown$i"])) $arr_thrown[$i] = '1';
			else $arr_thrown[$i] = '0';
			
			if(isset($_POST["arr_flurry$i"])) $arr_flurry[$i] = '1';
			else $arr_flurry[$i] = '0';
		} //end for each hit roll
	
		//for each attack
		foreach ($arr_quick_attack_id as $i => $value) {
			if($arr_attack_name[$i] != "") {
				//each QuickAttack entry will have 1+ entries in QuickAttackHitRolls to store attack bonuses (e.i. +11/+6, or +10/+10/+10)
				//query if record exists already
				$query = "SELECT QuickAttackID FROM QuickAttack 
						WHERE QuickAttackID = '".$arr_quick_attack_id[$i]."' LIMIT 1";
				// Perform Query
				$result = mysqli_query($link,$query);
				if(mysqli_num_rows($result) > 0) {
					//update old record
					//get QuickAttackID
					$row = mysqli_fetch_object($result);
					$new_quick_attack_id = $row->QuickAttackID;
					echo $query = "UPDATE QuickAttack SET AttackName = '".$arr_attack_name[$i]."', DamageDieType = ".$arr_damage_die_type[$i].", DamageDieNum = ".$arr_damage_die_num[$i].", 
								DamgeMod = ".$arr_damage_mod[$i].", Equipped = 1, OffHand = ".$arr_off_hand[$i].", TwoHand = ".$arr_two_hand[$i].", CritRange = ".$arr_crit_range[$i].", CritMult = ".$arr_crit_mult[$i].", 
								RangeBase = ".$arr_range_base[$i].", Thrown = ".$arr_thrown[$i].", Flurry = ".$arr_flurry[$i]." 
							WHERE QuickAttackID = ".$arr_quick_attack_id[$i];
					// Perform Query
					$result = mysqli_query($link,$query);	
				} //end if record exists
				else {
					//inset new record
					//get next AUTO_INCREMENT value for QuickAttack->QuickAttackID
					//next AUTO_INCREMENT
					$tablename	= "QuickAttack";
					$next_increment = 0;
					$query_ShowStatus = "SHOW TABLE STATUS LIKE '$tablename'";
					$query_ShowStatusResult	= mysqli_query($link, $query_ShowStatus) or die ( "Query failed: " . mysqli_error() . "<br/>" . $query_ShowStatus );
					$row = mysqli_fetch_assoc($query_ShowStatusResult);
					$next_increment = $row['Auto_increment'];
					$new_quick_attack_id = $next_increment;
					//insert entry for current weapon
					//add this attack (bonus to hit value) to QuickAttack table
					$query = "INSERT INTO QuickAttack (QuickAttackID, QuickStatID, AttackName, DamageDieType, DamageDieNum, DamgeMod, Equipped, OffHand, TwoHand, CritRange, CritMult, RangeBase, Thrown, Flurry) 
							VALUES (".$new_quick_attack_id.", ".$new_quick_stat_id.", '".$arr_attack_name[$i]."', ".$arr_damage_die_type[$i].", ".$arr_damage_die_num[$i].", ".$arr_damage_mod[$i].", '1', ".$arr_off_hand[$i].", ".$arr_two_hand[$i].", ".$arr_crit_range[$i].", ".$arr_crit_mult[$i].", ".$arr_range_base[$i].", ".$arr_thrown[$i].", ".$arr_flurry[$i].")";
					// Perform Query
					$result = mysqli_query($link,$query);	
				} //end else create new records for attack types
				
				//number of attacks, for each attack input an entry in QuickAttackHitRolls table
				for($hit_roll_counter = 0; $hit_roll_counter < 5; $hit_roll_counter++) {
					//concatinating $arr_attack_bonus.$hit_roll_counter
					if($arr_attack_bonus[$i][$hit_roll_counter] > 0) {
						//query if record exists already
						$query = "SELECT AttackBonus FROM QuickAttackHitRolls 
								WHERE AttackRollNum = ".$hit_roll_counter." AND QuickAttackID = ".$new_quick_attack_id." LIMIT 1";
						// Perform Query
						$result = mysqli_query($link,$query);
						if(mysqli_num_rows($result) > 0) {
							//update old record
							$query = "UPDATE QuickAttackHitRolls SET AttackBonus = ".$arr_attack_bonus[$i][$hit_roll_counter]." 
									WHERE AttackRollNum = ".$hit_roll_counter." AND QuickAttackID = ".$new_quick_attack_id;
							$result = mysqli_query($link,$query);
						} //end if update old record
						else {
							//add this attack (bonus to hit value) to QuickAttackHitRolls table
							$query = "INSERT INTO QuickAttackHitRolls (AttackRollNum, QuickAttackID, AttackBonus) VALUES (".$hit_roll_counter.", ".$new_quick_attack_id.", ".$arr_attack_bonus[$i][$hit_roll_counter].")";
							// Perform Query
							$result = mysqli_query($link,$query);
						} //end else insert new record
					} //end if has attack roll
					else {
						//detele quick attack hit roll because it should not exist (user has set hit roll value to 0)
						$query = "DELETE FROM QuickAttackHitRolls 
								WHERE AttackRollNum = ".$hit_roll_counter." AND QuickAttackID = ".$new_quick_attack_id;
						// Perform Query
						$result = mysqli_query($link,$query);
					} //end else delete if exists
				} //end for check multiple attacks
				
			} //end if add attack (if $arr_attack_name != ""
		} //end foreach $arr_weaponid
		
		//delete attacks if checkbox checked
		if(isset($_POST["delete_attack"])) {
			foreach ($_POST["delete_attack"] as $delete_id) {
				//delete weapon from CharacterWeapon
				$query = "DELETE FROM QuickAttack WHERE QuickStatID = ".$new_quick_stat_id." AND QuickAttackID = ".$delete_id;
				// Perform Query
				$result = mysqli_query($link,$query);
				//delete weapon from QuickAttackHitRolls
				$query = "DELETE FROM QuickAttackHitRolls WHERE QuickAttackID=".$delete_id;
				// Perform Query
				$result = mysqli_query($link,$query);
			} //end foreach delete weapon
		} //end if isset delete weapon
		
		//add items held
		//on create new, insert on table QuickStatItems
		//QuickStatItems (QuickStatItemID*, QuickStatID, ItemID**, Type***)
		//* AutoInc
		//** WeaponID, ArmorID, EquipmentID
		//*** 'weapon', 'armor', 'equipment'
		if($insterNewQuickStat == true)
		{
			$update_item_quick_stat_id = $new_quick_stat_id;
			$update_item_character_id = 'NULL';
		}
		//on edit, save to this specific character_id
		else
		{
			$update_item_quick_stat_id = 'NULL';
			$update_item_character_id = $_POST["view_character_id"];
		}
		
		//get list of WeaponIDs (comma separated)
		if($_POST["weapon_id_list"] != '')
		{
			$WeaponIDarr = explode(",", $_POST["weapon_id_list"]);
			for($i=0; $i < 	count($WeaponIDarr); $i++)
			{
				echo $query = "INSERT INTO QuickStatItems (QuickStatID, CharacterID, ItemID, ItemType) VALUES (".$update_item_quick_stat_id.", ".$update_item_character_id.", ".$WeaponIDarr[$i].", 'weapon')";
				$result = mysqli_query($link,$query);
			}
		}
		
		//get list of ArmorIDs (comma separated)
		if($_POST["armor_id_list"] != '')
		{
			$ArmorIDarr = explode(",", $_POST["armor_id_list"]);
			for($i=0; $i < 	count($ArmorIDarr); $i++)
			{
				echo $query = "INSERT INTO QuickStatItems (QuickStatID, CharacterID, ItemID, ItemType) VALUES (".$update_item_quick_stat_id.", ".$update_item_character_id.", ".$ArmorIDarr[$i].", 'armor')";
				$result = mysqli_query($link,$query);
			}
		}
		
		//get list of EquipmentIDs (comma separated)
		if($_POST["equipment_id_list"] != '')
		{
			$EquipmentIDarr = explode(",", $_POST["equipment_id_list"]);
			for($i=0; $i < 	count($EquipmentIDarr); $i++)
			{
				echo $query = "INSERT INTO QuickStatItems (QuickStatID, CharacterID, ItemID, ItemType) VALUES (".$update_item_quick_stat_id.", ".$update_item_character_id.", ".$EquipmentIDarr[$i].", 'equipment')";
				$result = mysqli_query($link,$query);
			}
		}
		
		echo(mysqli_error($link));
		mysqli_close($link);
			
	} //end if not a player character

	echo 'SAVED';
	//print_r($_POST);
?>