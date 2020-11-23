<?php
	// database connect function
	include_once("../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	$data = array();
	$data['queries'] = array();
	
	if(isset($_POST['new']))
	{
			
		$player_id = $_POST['player_id'];
		//if no player error exit
		if($player_id == -1)
		{
			$data['error'] = "player doesn't exist";
			echo json_encode($data);
			exit;
		}
		//insert new character
		//get next number for CharacterID - not using auto inc
		
		//get character auto-inc
		$query = "SELECT CharacterID FROM MasterCharacter ORDER BY CharacterID DESC LIMIT 1";
		//perform query
		$result = mysqli_query($link,$query);
		$IDrow = mysqli_fetch_object($result);
		$character_id = $IDrow->CharacterID + 1;
		
		//insert character info into db 
		$data['queries']['Characters'] = 
		$query = "INSERT INTO Characters (CharacterID, RaceID, FavoredHP, FavoredSkill, SizeID, Gender, AlignGoodID, AlignChaosID, Height, Weight, Age, Deity, Occupation, FactionID, CMDmod, BullRushB, DisarmB, GrappleB, SunderB, TripB, FeintB, CMBmod, BullRushD, DisarmD, GrappleD, SunderD, TripD, FeintD,DodgeBonus, InitBonus, NaturalAC, DeflectAC, DamageResist, SpellResist, ASPbonus, DSPbonus) VALUES (".$character_id.", '".$_POST["race"]."', 0, 0, 0, '".$_POST["gender"]."', 0, 0,'', '', 0, '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 0, 0, 0)";
		//perform query
		$result = mysqli_query($link,$query);
		$data['queries']['Characters Error'] = mysqli_error($link);
		
		//update character info into db 
		$query = "UPDATE Characters  SET SizeID = 5, AlignGoodID='1', AlignChaosID='1', FactionID = '1' WHERE CharacterID=".$character_id;
		
		// Perform Query
		$result = mysqli_query($link,$query);
		//insert new mastercharacter
		//$data['queries']['MasterCharacter'] = 
		$query = "INSERT INTO MasterCharacter (PlayerID,CharacterID,QuickStatID,CatagoryID,CampaignID,ListRank,CharacterName,HPDamage,ArcaneSPUsed,DivineSPUsed,InitRoll,ActionComplete,CR,ExpVal,Xpos,Ypos,Direction,CurrentAction,Description,SpriteID,WeaponSpID,ShieldSpID,ThumbPicID,PortraitPicID,FullPicID,AreaID,CustomSpriteScale)VALUES (".$player_id.", ".$character_id.", 0, 1, 0, 0, '".$_POST["name"]."', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '".$_POST["sprite_id"]."', 0, 0, '".$_POST["thumb_pic_id"]."', 0, 0, 0, 0)";
		$result = mysqli_query($link,$query);
		//$data['queries']['MasterCharacter Error'] = mysqli_error($link);
		
		// ATTRIBUTES
		// place attribute info into arrays
		$arr_attvalue = array();
		foreach($_POST["arr_attvalue"] as $attribute)
		{ 
			$arr_attvalue[] = $attribute; 
    }
		//insert attributes into db
		for($i = 0; $i < 6; $i++)
		{ 
			//$data['queries']['CharacterAttribute'] = 
			$query = "INSERT INTO CharacterAttribute(CharacterID, AttributeID, Value, Bonus, Enhance) VALUES(".$character_id.", ".$i.", ".$arr_attvalue[$i].", 0, 0)";
			// Perform Query
			$result = mysqli_query($link,$query);
		}
		
		// CLASSES
		// place classes info into arrays
		$arr_classid = array();
		foreach($_POST["arr_classid"] as $class)
		{ 
			$arr_classid[] = $class;
		}
		
		$arr_level = array();
		foreach($_POST["arr_level"] as $class)
		{ 
			$arr_level[] = $class;
		}
		
		//insert classes into db
		foreach ($arr_classid as $i => $value)
		{
			// if arr_classid[$i] == 99 skip because its the New Class default selection
			if($arr_classid[$i] != 99)
			{
				//if level > 0 INSERT record
				if($arr_level[$i] > 0)
				{
					//$data['queries']['CharacterClass'] = 
					$query = "INSERT INTO CharacterClass (CharacterID, ClassID, Level) VALUES (".$character_id.", ".$arr_classid[$i].", ".$arr_level[$i].")";
					//Perform Query
					$result = mysqli_query($link,$query);
				}
			}
		}
		
		//spells
		//insert classes into db
		// place spells into array
		$new_spell_list = $_POST["new_spell_list"];
		$new_spell_level = $_POST["new_spell_level"];
		$learned_class_id_arr = $_POST["learned_class_id"];//can only have one class to start
		//insert spells into db
		//check to make sure $new_spell_id_list isset
		if(isset($new_spell_list)) {
			//loop through checked spell select checkboxes
			foreach ($new_spell_list as $i => $value)
			{ 
				$spell_id = $new_spell_list[$i];
				$spell_level = $new_spell_level[$i]; 
				$learned_class_id = $learned_class_id_arr[$i];
				$query = "INSERT INTO CharacterSpell (CharacterID, SpellID, LearnedClassID, SpellLevel) VALUES (".$character_id.", ".$spell_id.", ".$learned_class_id.", ".$spell_level.")";
				// Perform Query
				$result = mysqli_query($link,$query);
			}
		}
		
		function EffectQuery($link, $effectTypeTable, $effectTypeFieldID, $effectTypeID)
		{
			return 0;
		}

		// ARMOR
		if(isset($_POST["armorid_new"]) && $_POST["armorid_new"] != -1) {
			$armorid_new = $_POST["armorid_new"];
			if(isset($_POST["armorenhance_new"])) { $armorenhance_new = $_POST["armorenhance_new"]; }
			else { $armorenhance_new = 0; }
			if(isset($_POST["armornotes"])) { $armornotes = $_POST["armornotes"]; }
			else { $armornotes = ""; }
			if($armornotes == "notes") { $armornotes = ""; }
			//new armor has been selected
			//delete old armor from CharacterArmor
			if(isset($_POST["armorid"]))
			{
				$query = "DELETE FROM CharacterArmor WHERE CharacterID=".$character_id." AND ArmorID=".$_POST["armorid"];
				// Perform Query
				$result = mysqli_query($link,$query);
			}
			//insert new armor
			$query = "INSERT INTO CharacterArmor (ArmorID, CharacterID, Enhance, MW, Equipped, ACMod, Notes)
					VALUES (".$armorid_new.", ".$character_id.", FALSE, 0, TRUE, ".$armorenhance_new.", '".$armornotes."')";
			// Perform Query
			$result = mysqli_query($link,$query);
		}
		
		// SHIELD
		if(isset($_POST["shieldid_new"]) && $_POST["shieldid_new"] != -1) {
			$shieldid_new = $_POST["shieldid_new"];
			if(isset($_POST["shieldenhance_new"])) { $shieldenhance_new = $_POST["shieldenhance_new"]; }
			else { $shieldenhance_new = 0; }
			if(isset($_POST["shieldnotes"])) { $shieldnotes = $_POST["shieldnotes"]; }
			else { $shieldnotes = ""; }
			if($shieldnotes == "notes") { $shieldnotes = ""; }
			//new shield has been selected
			//delete old shield from CharacterArmor
			$query = "DELETE FROM CharacterArmor WHERE CharacterID=".$character_id." AND ArmorID=".$_POST["shieldarmorid"];
			// Perform Query
			$result = mysqli_query($link,$query);
			//insert new shield
			$query = "INSERT INTO CharacterArmor (ArmorID, CharacterID, Enhance, MW, Equipped, ACMod, Notes)
					VALUES (".$shieldid_new.", ".$character_id.", FALSE, 0, TRUE, ".$shieldenhance_new.", '".$shieldnotes."')";
			// Perform Query
			$result = mysqli_query($link,$query);
		}
		
		if(isset($_POST["weaponid_new2"]) && $_POST["weaponid_new2"] != -1) {
			$weaponid_new = $_POST["weaponid_new2"];
			if(isset($_POST["weaponenhance_new2"])) { $weaponenhance_new = $_POST["weaponenhance_new2"]; }
			else { $weaponenhance_new = 0; }
			
			//get if weapon is two handed
			$query = 'SELECT TwoHand FROM Weapon WHERE WeaponID = '.$weaponid_new;
			// Perform CharacterArmor / Weapon Query
			$result = mysqli_query($link,$query);
			//Get resulting row from query
			$row = mysqli_fetch_object($result);
			$two_hand = $row->TwoHand;
			//insert new weapon into db
			$query = "INSERT INTO CharacterWeapon (WeaponID, CharacterID, Enhance, MW, Equipped, TwoHand, UseDex, Flurry, CustomName, HitBonus, DamageBonus, CritRangeBonus, OffHand)
						VALUES (".$weaponid_new.", ".$character_id.", ".$weaponenhance_new.", FALSE, TRUE, ".$two_hand.", FALSE, FALSE, '', 0, 0, 0, 1)";
			// Perform Query
			$result = mysqli_query($link,$query);
		}
		
		if(isset($_POST["weaponid_new"]) && $_POST["weaponid_new"] != -1) {
			$weaponid_new = $_POST["weaponid_new"];
			if(isset($_POST["weaponenhance_new"])) { $weaponenhance_new = $_POST["weaponenhance_new"]; }
			else { $weaponenhance_new = 0; }
			
			//get if weapon is two handed
			$query = 'SELECT TwoHand FROM Weapon WHERE WeaponID = '.$weaponid_new;
			// Perform CharacterArmor / Weapon Query
			$result = mysqli_query($link,$query);
			//Get resulting row from query
			$row = mysqli_fetch_object($result);
			$two_hand = $row->TwoHand;
			//insert new weapon into db
			$query = "INSERT INTO CharacterWeapon (WeaponID, CharacterID, Enhance, MW, Equipped, TwoHand, UseDex, Flurry, CustomName, HitBonus, DamageBonus, CritRangeBonus, OffHand)
						VALUES (".$weaponid_new.", ".$character_id.", ".$weaponenhance_new.", FALSE, TRUE, ".$two_hand.", FALSE, FALSE, '', 0, 0, 0, 0)";
			// Perform Query
			$result = mysqli_query($link,$query);
		}
		
		if(isset($_POST["weaponid_new_ranged"]) && $_POST["weaponid_new_ranged"] != -1) {
			$weaponid_new = $_POST["weaponid_new2"];
			if(isset($_POST["weaponenhance_ranged"])) { $weaponenhance_new = $_POST["weaponenhance_ranged"]; }
			else { $weaponenhance_new = 0; }
			
			//get if weapon is two handed
			$query = 'SELECT TwoHand FROM Weapon WHERE WeaponID = '.$weaponid_new;
			// Perform CharacterArmor / Weapon Query
			$result = mysqli_query($link,$query);
			//Get resulting row from query
			$row = mysqli_fetch_object($result);
			$two_hand = $row->TwoHand;
			//insert new weapon into db
			$query = "INSERT INTO CharacterWeapon (WeaponID, CharacterID, Enhance, MW, Equipped, TwoHand, UseDex, Flurry, CustomName, HitBonus, DamageBonus, CritRangeBonus, OffHand)
						VALUES (".$weaponid_new.", ".$character_id.", ".$weaponenhance_new.", FALSE, TRUE, ".$two_hand.", FALSE, FALSE, '', 0, 0, 0)";
			// Perform Query
			$result = mysqli_query($link,$query);
		}
		
		include('../../includes/inc_character_query_full.php');
		$quick_stat_id = -1;
		include('../../includes/inc_char_update_quick.php');
	}
	
	
	$data['character_id'] = $character_id;
	
	//save full character data
	//include includes/inc_character_query_full - new has effect stuff in it, may be slightly different
	//include includes/inc_char_update_quick - dont think ive used this in new game yet
	//this will create the quickstats
	
	echo json_encode($data);
	
	exit;
	
	//old stuff----------------------------------------------
	
	$character_id = $_COOKIE['character_id'];
	
	//***********************
	// CHARACTER INFO
	//insert character info into db 
	$query = "UPDATE Characters 
			SET RaceID='".$_POST["race"]."', FavoredHP='".$_POST["favoredhp"]."', FavoredSkill='".$_POST["favoredskill"]."',
			Gender='".$_POST["gender"]."', AlignGoodID='".$_POST["aligngood"]."', AlignChaosID='".$_POST["alignchaos"]."', 
			Height='".mysqli_real_escape_string($link, $_POST["height"])."', 
			Weight='".$_POST["weight"]."', Age='".$_POST["age"]."', Deity='".$_POST["deity"]."', 
			Occupation='".mysqli_real_escape_string($link, $_POST['occupation'])."', 
			FactionID='".$_POST["faction"]."', 
			CMDmod='".$_POST["cmdmod"]."', 
			BullRushB='".$_POST["bullrush_b"]."', DisarmB='".$_POST["disarm_b"]."', GrappleB='".$_POST["grapple_b"]."', 
			SunderB='".$_POST["sunder_b"]."', TripB='".$_POST["trip_b"]."', FeintB='".$_POST["feint_b"]."', 
			CMBmod='".$_POST["cmbmod"]."', 
			BullRushD='".$_POST["bullrush_d"]."', DisarmD='".$_POST["disarm_d"]."', GrappleD='".$_POST["grapple_d"]."', 
			SunderD='".$_POST["sunder_d"]."', TripD='".$_POST["trip_d"]."', FeintD='".$_POST["feint_d"]."',
			DodgeBonus='".$_POST["dodgebonus"]."', InitBonus='".$_POST["initbonus"]."', 
			NaturalAC='".$_POST["naturalac"]."', DeflectAC='".$_POST["deflectac"]."', 
			DamageResist='".mysqli_real_escape_string($link, $_POST['dr'])."' , SpellResist='".$_POST["sr"]."', 
			ASPbonus='".$_POST["asp_bonus"]."', 
			DSPbonus='".$_POST["dsp_bonus"]."' 
			WHERE CharacterID=".$character_id;
	
	// Perform Query
	$result = mysqli_query($link,$query);

	//***********************
	// ATTRIBUTES
	// place attribute info into arrays
	$arr_attvalue = array();
	foreach($_POST["arr_attvalue"] as $attribute) { 
        $arr_attvalue[] = $attribute; 
    }
	
	$arr_attbonus = array();
	foreach($_POST["arr_attbonus"] as $attribute) { 
        $arr_attbonus[] = $attribute;
    }
	
	$arr_attenhance = array();
	foreach($_POST["arr_attenhance"] as $attribute) { 
        $arr_attenhance[] = $attribute;
    }
	
	//delete old attribute entries
	$query = "DELETE FROM CharacterAttribute WHERE CharacterID=".$character_id;
	// Perform Query
	$result = mysqli_query($link,$query);
	
	//insert attributes into db
	for($i = 0; $i < 6; $i++) { 
		$query = "INSERT INTO CharacterAttribute
					(CharacterID, AttributeID, Value, Bonus, Enhance)
					VALUES
					(".$character_id.", ".$i.", ".$arr_attvalue[$i].", ".$arr_attbonus[$i].", ".$arr_attenhance[$i].")";

		// Perform Query
		$result = mysqli_query($link,$query);
	}


	//***********************
	// SKILLS
	// place skill info into arrays
	$arr_skillranks = array();
	foreach($_POST["arr_skillranks"] as $skill) { 
        $arr_skillranks[] = $skill; 
    }
	
	$arr_skillbonus = array();
	foreach($_POST["arr_skillbonus"] as $skill) { 
        $arr_skillbonus[] = $skill;
    }
	
	$arr_skillenhance = array();
	foreach($_POST["arr_skillenhance"] as $skill) { 
        $arr_skillenhance[] = $skill;
    }
	//insert skills into db
	for ($i = 0; $i < 35; $i++)
    { 
		//if skill arrays contain any information save record
		if ($arr_skillranks[$i] > 0 || $arr_skillbonus[$i] > 0 || $arr_skillenhance[$i] > 0) {
			// query CharacterSkill to find if record exists
			$query = "SELECT SkillID FROM CharacterSkill WHERE CharacterID=".$character_id." AND SkillID=".$i; 

			// Perform CharacterSkill Query
			$result = mysqli_query($link,$query);
		
			// if record of CharacterSkill exists update
			if (mysqli_fetch_object($result)) {	
				$query = "UPDATE CharacterSkill
						SET Ranks = '".$arr_skillranks[$i]."', Bonus='".$arr_skillbonus[$i]."', Enhance='".$arr_skillenhance[$i]."' 
						WHERE CharacterID=".$character_id." AND SkillID=".$i;
			}
			// else skill not recorded, insert new record for CharacterSkill
			else {
				$query = "INSERT INTO CharacterSkill
							(CharacterID, SkillID, Ranks, Bonus, Enhance)
							VALUES
							(".$character_id.", ".$i.", ".$arr_skillranks[$i].", ".$arr_skillbonus[$i].", ".$arr_skillenhance[$i].")";
			}
		}
		//else delete empty skill record
		else {
			$query = "DELETE FROM CharacterSkill
						WHERE CharacterID=".$character_id." AND SkillID=".$i;
		}

		// Perform update/insert/delete query
		$result = mysqli_query($link,$query);
	}
	
	//***********************
	// CLASSES
	// place classes info into arrays
	$arr_classid = array();
	foreach($_POST["arr_classid"] as $class) { 
        $arr_classid[] = $class;
    }
	
	$arr_level = array();
	foreach($_POST["arr_level"] as $class) { 
        $arr_level[] = $class;
    }

	//insert classes into db
	foreach ($arr_classid as $i => $value)
    { 
		// if arr_classid[$i] == 99 skip because its the New Class default selection
		if($arr_classid[$i] != 99) {
			// query CharacterClass to find if record exists
			$query = "SELECT ClassID FROM CharacterClass WHERE CharacterID=".$character_id." AND ClassID = ".$arr_classid[$i];
			
			// Perform CharacterClass Query
			$result = mysqli_query($link,$query);
		
			// if record of CharacterClass exists update
			if (mysqli_fetch_object($result)) {
				// if level = 0 DELETE record
				if($arr_level[$i] == 0) {
					$query = "DELETE FROM CharacterClass
							WHERE CharacterID=".$character_id." AND ClassID=".$arr_classid[$i];
			
					// Perform Query
					$result = mysqli_query($link,$query);
					
					//get rid of any spells listed in CharacerSpells as well
					$query = "DELETE FROM CharacterSpell WHERE CharacterID=".$character_id." AND LearnedClassID=".$arr_classid[$i];
					
					// Perform Query
					$result = mysqli_query($link,$query);
				}
				// else CharacterClass exists UPDATE and level > 0 UPDATE
				else {
					$query = "UPDATE CharacterClass
							SET Level = '".$arr_level[$i]."'
							WHERE CharacterID=".$character_id." AND ClassID=".$arr_classid[$i];
			
					// Perform Query
					$result = mysqli_query($link,$query);
				}
			}
			// else no record of CharacterClass and level > 0 INSERT record
			elseif($arr_level[$i] > 0)  {
				$query = "INSERT INTO CharacterClass
						(CharacterID, ClassID, Level)
						VALUES
						(".$character_id.", ".$arr_classid[$i].", ".$arr_level[$i].")";
			
				// Perform Query
				$result = mysqli_query($link,$query);
			}
		}
	}

	//***********************
	// SAVES
	
	// place saves info into arrays
	$arr_savebonus = array();
	foreach($_POST["arr_savebonus"] as $save) { 
        $arr_savebonus[] = $save;
    }
	
	$arr_savemod = array();
	foreach($_POST["arr_savemod"] as $save) { 
        $arr_savemod[] = $save;
    }
	
	$arr_savenote = array();
	foreach($_POST["arr_savenote"] as $save) { 
        $arr_savenote[] = $save;
    }
	
	//insert save modifiers & notes into db
	//delete old charactersave data
	$query = "DELETE FROM CharacterSave
				WHERE CharacterID=".$character_id;
	// Perform Query
	$result = mysqli_query($link,$query);
	//loop through saves 0, 1, 2 / fort, ref, will
	for ($i = 0; $i <=2; $i++) {
		$query = "INSERT INTO CharacterSave (CharacterID, SaveID, Bonus, Enhance, Notes)
						VALUES ('".$character_id."', '".$i."', '".$arr_savebonus[$i]."', '".$arr_savemod[$i]."', '".$arr_savenote[$i]."')";
		// Perform Query
		$result = mysqli_query($link,$query);
	} //end for
	
	//***********************
	// RESISTANCES
	// place resistances info into array
	$arr_resistance = array();
	foreach($_POST["arr_resistance"] as $res) { 
        if($res != "") { $arr_resistance[] = $res; }
	} //end foreach
	//delete old resistance data from db
	$query = "DELETE FROM CharacterResistance WHERE CharacterID=".$character_id;

	// Perform Query
	$result = mysqli_query($link,$query);
	//insert resistances into db
	foreach ($arr_resistance as $i => $value)
    { 
		$query = "INSERT INTO CharacterResistance (CharacterID, Resistance) VALUES ('".$character_id."', '".$arr_resistance[$i]."')";

		// Perform Query
		$result = mysqli_query($link,$query);
	} //end foreach
	
	//***********************
	// PROCICIENCIES
	// place proficiency info into array
	$arr_proficiency = array();
	foreach($_POST["arr_proficiency"] as $pro) { 
        if($pro != "") { $arr_proficiency[] = $pro; }
	} //end foreach
	//delete old proficiency data from db
	$query = "DELETE FROM CharacterProficiency WHERE CharacterID=".$character_id;

	// Perform Query
	$result = mysqli_query($link,$query);
	//insert proficiency into db
	foreach ($arr_proficiency as $i => $value)
    { 
		$query = "INSERT INTO CharacterProficiency (CharacterID, Proficiency) VALUES ('".$character_id."', '".$arr_proficiency[$i]."')";

		// Perform Query
		$result = mysqli_query($link,$query);
	} //end foreach

	//***********************
	// EQUIPMENT NORMAL AND MAGICAL
	// place Equipment info into array
	if(isset($_POST["equip_id"]) || isset($_POST["equip_id_magic"])) {
		$arr_equip_id = array();
		if(isset($_POST["equip_id"])) {
			foreach($_POST["equip_id"] as $equip) { 
				if($equip != "99") { $arr_equip_id[] = $equip; }
			} //end foreach
		} //end if isset
		if(isset($_POST["equip_id"])) {
			foreach($_POST["equip_id_magic"] as $equip) { 
				if($equip != "99") { $arr_equip_id[] = $equip; }
			} //end foreach
		} //end if isset
	
		//delete old CharacterEquipment data from db
		$query = "DELETE FROM CharacterEquipment WHERE CharacterID=".$character_id;
	
		// Perform Query
		$result = mysqli_query($link,$query);
		//insert CharacterEquipment into db
		foreach ($arr_equip_id as $i => $value)
		{ 
			$query = "INSERT INTO CharacterEquipment (EquipID, CharacterID, Quantity, Equipped, Notes)
					VALUES (".$arr_equip_id[$i].", ".$character_id.", 0, FALSE, '')";
			// Perform Query
			$result = mysqli_query($link,$query);
		}	//end foreach
	} //end if isset
	
	//***********************
	// SPECIAL ABILITIES
	// place CharacterSpecialAbility info into array
	if(isset($_POST["arr_special_ability"])) {
		$arr_special_ability = array();
		foreach($_POST["arr_special_ability"] as $abil) { 
			$arr_special_ability[] = $abil;
		} //end foreach
		foreach($_POST["arr_special_ability_desc"] as $desc) { 
			$arr_special_ability_desc[] = $desc;
		} //end foreach
		//delete old CharacterSpecialAbility data from db
		$query = "DELETE FROM CharacterSpecialAbility WHERE CharacterID=".$character_id;
	
		// Perform Query
		$result = mysqli_query($link,$query);
		//insert proficiency into db
		foreach ($arr_special_ability as $i => $value)
		{ 
			if($arr_special_ability[$i] != "") {
				$query = "INSERT INTO CharacterSpecialAbility (CharacterID, SpecialAbility, Description) VALUES
							(".$character_id.", '".$arr_special_ability[$i]."', '".$arr_special_ability_desc[$i]."')";
				// Perform Query
				$result = mysqli_query($link,$query);
			} //end if !=""
		}	//end foreach
	} //end if isset
	
	//***********************
	// UPDATE CURRENT ARMOR AND SHIELD
	//update current armor and shield enhancement bonus	
	if(isset($_POST["armorid"])) {
		if($_POST["armornotes"] != "notes") { $armornotes = $_POST["armornotes"]; } else { $armornotes = ''; }
		if(isset($_POST["ac_mod"])) { $ac_mod = $_POST["ac_mod"]; } else { $ac_mod = 0; }
		if(isset($_POST["armor_mw"])) { $armor_mw = 1; } else { $armor_mw = 0; }

		$query = "UPDATE CharacterArmor
				SET Enhance=".$_POST["armorenhance"].", ACMod=".$ac_mod.", MW=".$armor_mw.", Notes='".$armornotes."' 
				WHERE CharacterID=".$character_id." AND ArmorID=".$_POST["armorid"];
			// Perform Query
		$result = mysqli_query($link,$query);
	}
	
	if(isset($_POST["shieldarmorid"])) {
		if($_POST["shieldnotes"] != "notes") { $shieldnotes = $_POST["shieldnotes"]; } else { $shieldnotes = ''; }
		if(isset($_POST["shield_ac_mod"])) { $shield_ac_mod = $_POST["shield_ac_mod"]; } else { $shield_ac_mod = 0; }
		if(isset($_POST["shieldarmor_mw"])) { $shieldarmor_mw = 1; } else { $shieldarmor_mw = 0; }
		$query = "UPDATE CharacterArmor
				SET Enhance=".$_POST["shieldarmorenhance"].", ACMod=".$shield_ac_mod.", MW=".$shieldarmor_mw.", Notes='".$shieldnotes."' 
				WHERE CharacterID=".$character_id." AND ArmorID=".$_POST["shieldarmorid"];
			// Perform Query
		$result = mysqli_query($link,$query);
	}
	
	//delete armor/shield if checkbox checked
	if(isset($_POST["delete_armor_shield"])) {
		foreach ($_POST["delete_armor_shield"] as $delete_id) {
			//delete weapon from CharacterArmor
			$query = "DELETE FROM CharacterArmor WHERE CharacterID=".$character_id." AND ArmorID=".$delete_id;
			// Perform Query
			$result = mysqli_query($link,$query);
		}
	}
	
	//***********************
	// CHANGE TO NEW ARMOR
	// if new armor has been chosen. make sure value is not 99 (default value)
	if(isset($_POST["armorid_new"]) && $_POST["armorid_new"] != 99) {
		$armorid_new = $_POST["armorid_new"];
		if(isset($_POST["armorenhance_new"])) { $armorenhance_new = $_POST["armorenhance_new"]; }
		else { $armorenhance_new = 0; }
		if(isset($_POST["armornotes"])) { $armornotes = $_POST["armornotes"]; }
		else { $armornotes = ""; }
		if($armornotes == "notes") { $armornotes = ""; }
		//new armor has been selected
		//delete old armor from CharacterArmor
		$query = "DELETE FROM CharacterArmor WHERE CharacterID=".$character_id." AND ArmorID=".$_POST["armorid"];
		// Perform Query
		$result = mysqli_query($link,$query);
		//insert new armor
		$query = "INSERT INTO CharacterArmor (ArmorID, CharacterID, Enhance, MW, Equipped, ACMod, Notes)
				VALUES (".$armorid_new.", ".$character_id.", FALSE, 0, TRUE, ".$armorenhance_new.", '".$armornotes."')";
		// Perform Query
		$result = mysqli_query($link,$query);
	}
	
	//***********************
	// CHANGE TO NEW SHIELD
	// if new shield has been chosen. make sure value is not 99 (default value)
	if(isset($_POST["shieldid_new"]) && $_POST["shieldid_new"] != 99) {
		$shieldid_new = $_POST["shieldid_new"];
		if(isset($_POST["shieldenhance_new"])) { $shieldenhance_new = $_POST["shieldenhance_new"]; }
		else { $shieldenhance_new = 0; }
		if(isset($_POST["shieldnotes"])) { $shieldnotes = $_POST["shieldnotes"]; }
		else { $shieldnotes = ""; }
		if($shieldnotes == "notes") { $shieldnotes = ""; }
		//new shield has been selected
		//delete old shield from CharacterArmor
		$query = "DELETE FROM CharacterArmor WHERE CharacterID=".$character_id." AND ArmorID=".$_POST["shieldarmorid"];
		// Perform Query
		$result = mysqli_query($link,$query);
		//insert new shield
		$query = "INSERT INTO CharacterArmor (ArmorID, CharacterID, Enhance, MW, Equipped, ACMod, Notes)
				VALUES (".$shieldid_new.", ".$character_id.", FALSE, 0, TRUE, ".$shieldenhance_new.", '".$shieldnotes."')";
		// Perform Query
		$result = mysqli_query($link,$query);
	}

	//***********************
	// WEAPONS
	// place weapon info into array
	if(isset($_POST["arr_weaponid"])) {
		$arr_weaponid = $_POST["arr_weaponid"];
		$arr_weaponenhance = $_POST["arr_weaponenhance"];
		$arr_hitbonus = $_POST["arr_hitbonus"];
		$arr_damagebonus = $_POST["arr_damagebonus"];
		$arr_crit_range_bonus = $_POST["arr_crit_range_bonus"];
		
		$arr_customname = array();
		foreach($_POST["arr_customname"] as $weap) {
			if($weap != "custom name") $arr_customname[] = $weap;
			else $arr_customname[] = '';
		}
		
		$arr_weaponnotes = array();
		foreach($_POST["arr_weaponnotes"] as $weap) {
			if($weap != "notes") { $arr_weaponnotes[] = $weap; }
			else { $arr_weaponnotes[] = ''; }
		}
		
		//loop through inputs make sure there are no empty strings ''
		foreach($arr_weaponid as $i => $value) {
			if(!isset($arr_crit_range_bonus[$i]))
				if($arr_crit_range_bonus[$i] == "") $arr_crit_range_bonus[$i] = 0;
		}
		
		$use_dex = array();
		//must use weaponid to count weapon entries because unchecked checkboxes are not read by post
		//checkboxes are not in array, must reference the name by use_dex1, use_dex2, use_dex3
		//want to get array in same order as other elements of the weapon list
		foreach($_POST["arr_weaponid"] as $i => $value) {
			//inside double quotes "use_dex" and $i will be parsed and concatenated
			if(isset($_POST["use_dex$i"])) { $use_dex[] = 1; } else { $use_dex[] = 0; }
		}
		
		$flurry = array();
		foreach($_POST["arr_weaponid"] as $i => $value) {
			if(isset($_POST["flurry$i"])) { $flurry[] = 1; } else { $flurry[] = 0; }
		}
		
		$weapon_mw = array();
		foreach($_POST["arr_weaponid"] as $i => $value) {
			if(isset($_POST["weapon_mw$i"])) { $weapon_mw[] = 1; } else { $weapon_mw[] = 0; }
		}
		
		$arr_twohand = array();
		foreach($_POST["arr_weaponid"] as $i => $value) {
			if(isset($_POST["arr_twohand$i"])) { $arr_twohand[] = 1; } else { $arr_twohand[] = 0; }
		}
		
		//insert weapon update into db
		foreach ($arr_weaponid as $i => $value)
		{
			$query = "UPDATE CharacterWeapon
					SET Enhance=".$arr_weaponenhance[$i].", MW=".$weapon_mw[$i].", TwoHand=".$arr_twohand[$i].", UseDex=".$use_dex[$i].", Flurry=".$flurry[$i].", CustomName='".$arr_customname[$i]."', HitBonus=".$arr_hitbonus[$i].", DamageBonus=".$arr_damagebonus[$i].", CritRangeBonus=".$arr_crit_range_bonus[$i].", Notes='".$arr_weaponnotes[$i]."'  
					WHERE CharacterID=".$character_id." AND WeaponID=".$arr_weaponid[$i];
			// Perform Query
			$result = mysqli_query($link,$query);
		} //end foreach arr_weaponid
	} //end if isset weaponid
	
	//delete weapon if checkbox checked
	if(isset($_POST["delete_weapon"])) {
		foreach ($_POST["delete_weapon"] as $delete_id) {
			//delete weapon from CharacterWeapon
			$query = "DELETE FROM CharacterWeapon WHERE CharacterID=".$character_id." AND WeaponID=".$delete_id;
			// Perform Query
			$result = mysqli_query($link,$query);
		} //end foreach delete weapon
	} //end if isset delete weapon
	
	if(isset($_POST["weaponid_new"]) && $_POST["weaponid_new"] != -1) {
		$weaponid_new = $_POST["weaponid_new"];
		if(isset($_POST["weaponenhance_new"])) { $weaponenhance_new = $_POST["weaponenhance_new"]; }
		else { $weaponenhance_new = 0; }
		
		//get if weapon is two handed
		$query = 'SELECT TwoHand FROM Weapon WHERE WeaponID = '.$weaponid_new;
		// Perform CharacterArmor / Weapon Query
		$result = mysqli_query($link,$query);
		//Get resulting row from query
		$row = mysqli_fetch_object($result);
		$two_hand = $row->TwoHand;
		//insert new weapon into db
		$query = "INSERT INTO CharacterWeapon (WeaponID, CharacterID, Enhance, MW, Equipped, TwoHand, UseDex, Flurry, CustomName, HitBonus, DamageBonus, CritRangeBonus)
					VALUES (".$weaponid_new.", ".$character_id.", ".$weaponenhance_new.", FALSE, TRUE, ".$two_hand.", FALSE, FALSE, '', 0, 0, 0)";
		// Perform Query
		$result = mysqli_query($link,$query);
	}
	
	if(isset($_POST["weaponid_new2"]) && $_POST["weaponid_new2"] != -1) {
		$weaponid_new = $_POST["weaponid_new2"];
		if(isset($_POST["weaponenhance_new2"])) { $weaponenhance_new = $_POST["weaponenhance_new2"]; }
		else { $weaponenhance_new = 0; }
		
		//get if weapon is two handed
		$query = 'SELECT TwoHand FROM Weapon WHERE WeaponID = '.$weaponid_new;
		// Perform CharacterArmor / Weapon Query
		$result = mysqli_query($link,$query);
		//Get resulting row from query
		$row = mysqli_fetch_object($result);
		$two_hand = $row->TwoHand;
		//insert new weapon into db
		$query = "INSERT INTO CharacterWeapon (WeaponID, CharacterID, Enhance, MW, Equipped, TwoHand, UseDex, Flurry, CustomName, HitBonus, DamageBonus, CritRangeBonus)
					VALUES (".$weaponid_new.", ".$character_id.", ".$weaponenhance_new.", FALSE, TRUE, ".$two_hand.", FALSE, FALSE, '', 0, 0, 0)";
		// Perform Query
		$result = mysqli_query($link,$query);
	}
	
	if(isset($_POST["weaponid_new_ranged"]) && $_POST["weaponid_new_ranged"] != -1) {
		$weaponid_new = $_POST["weaponid_new2"];
		if(isset($_POST["weaponenhance_ranged"])) { $weaponenhance_new = $_POST["weaponenhance_ranged"]; }
		else { $weaponenhance_new = 0; }
		
		//get if weapon is two handed
		$query = 'SELECT TwoHand FROM Weapon WHERE WeaponID = '.$weaponid_new;
		// Perform CharacterArmor / Weapon Query
		$result = mysqli_query($link,$query);
		//Get resulting row from query
		$row = mysqli_fetch_object($result);
		$two_hand = $row->TwoHand;
		//insert new weapon into db
		$query = "INSERT INTO CharacterWeapon (WeaponID, CharacterID, Enhance, MW, Equipped, TwoHand, UseDex, Flurry, CustomName, HitBonus, DamageBonus, CritRangeBonus)
					VALUES (".$weaponid_new.", ".$character_id.", ".$weaponenhance_new.", FALSE, TRUE, ".$two_hand.", FALSE, FALSE, '', 0, 0, 0)";
		// Perform Query
		$result = mysqli_query($link,$query);
	}
	
	if(isset($_POST["submit_select_feats"])) {
		mysqli_close($link);
		header('Location: ../character_select_feat.php');
	}
	elseif (isset($_POST["submit_edit_ability"])) {
		mysqli_close($link);
		header('Location: ../character_edit_ability.php');
	}
	elseif (isset($_POST["update"])) {
		mysqli_close($link);
		header('Location: ../character_sheet.php');
	}

	//check if user has clicked a save and select spells button by looping through those submit buttons
	//loop through classids check each submit_spells button to see if it was pressed, then send 
	//learned_class_id to select spell screen to bring up that classes spell list to pick from
	//do query to find out the highest classid number incase more classes are added
	$query = 'SELECT ClassID
				FROM Classes
				ORDER BY ClassID DESC
				LIMIT 1';
	
	// Perform Topics Query
	$result = mysqli_query($link,$query);

	//Get resulting row from query
	$row = mysqli_fetch_object($result);
	$highest_class_id = $row->ClassID;
	
	//select spells submit button pressed
	for($i = 1; $i <= $highest_class_id; $i++) {
 		//inside double quotes "submit_spells" and $i will be parsed and concatenated
       	if(isset($_POST["submit_spells$i"])) {
			//echo '<br/>isset id:'.$i.'<br/>';
			mysqli_close($link);
			header('Location: ../character_select_spell.php?learned_class_id='.$i);
		}
	}
	
	// echo '<br/><a href="../character_sheet.php">back</a>';

	//make sure links are closed before location changes
	//mysqli_close($link);
	
	/*
	
	select name="race"
	select name="gender"
	select name="faction"
	select name="alignchaos"
	select name="aligngood"
	name="occupation"
	name="height"
	name="weight"
	name="age"
	name="deity"
	
	name="arr_attvalue[]"
			arr_attbonus[]
			arr_attenhance[]
	
	select name="arr_classid[]"
	name="arr_level[]"
	
	name="favoredhp"
	name="favoredskill"
	
	name="dodgebonus"
	name="naturalac"
	name="deflectac"
	
	name="cmdmod"
	name="bullrush_d"
	name="disarm_d"
	name="grapple_d"
	name="sunder_d"
	name="trip_d"
	name="feint_d"
	
	name="cmbmod"
	name="bullrush_b"
	name="disarm_b"
	name="grapple_b"
	name="sunder_b"
	name="trip_b"
	name="feint_b"
		
	name="arr_savebonus[]" 0, 1, 2
	name="arr_savemod[]"
	name="fortnote"
	name="refnote"
	name="willnote"

	name="melee_note"
	name="ranged_note"
	name="cmb_note"
	
	name="arr_skillranks[]"
	name="arr_skillbonus[]"
	name="arr_skillenhance[]"
	
	name="dr"
	name="arr_resistance[]"
	name="arr_proficiency[]"
	
	name="initbonus"
	name="sr"
	
	name="armorenhance"
	name="shieldarmorenhance"	
	name="armor_mw"
	name="shieldarmor_mw"
	select name="armorid_new"
	name="armorenhance_new"
	
	name="arr_weaponenhance[]"
	name="arr_weaponnotes[]" != "notes"
	name="arr_customname[]" != "custom name"
	name="use_dex[]"
	name="flurry[]"
	name="weapon_mw[]"
	name="delete_weapon$i"
	
	name="weaponid_new"
	name="weaponenhance_new"
	
	select name="equip_id[]"
	select name="equip_id_magic[]"
	*/

?>