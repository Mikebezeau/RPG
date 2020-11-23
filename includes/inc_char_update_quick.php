<?php
	//***********************
	// UPDATE ALL QuickStat info
	//ONLY FOR PCs
	//safty catch to make sure there is a quick stat record before proceeding with INSERT or UPDATE
	$doUpdate = false;
	$data['queries'][] = $query = "SELECT QuickstatID FROM QuickStats WHERE QuickstatID=".$quick_stat_id;
	// Perform update Query
	if($result = mysqli_query($link,$query)) {
		if(mysqli_num_rows($result) > 0) $doUpdate = true;
	} //end if result Quickstats record exists

	//INSERT QuickStat data
	if($doUpdate == false) {
		//next AUTO_INCREMENT
		$tablename	= "QuickStats";
		$next_increment = 0;
		$query_ShowStatus = "SHOW TABLE STATUS LIKE '$tablename'";
		$query_ShowStatusResult	= mysqli_query($link, $query_ShowStatus) or die ( "Query failed: " . mysqli_error() . "<br/>" . $query_ShowStatus );
		
		$row = mysqli_fetch_assoc($query_ShowStatusResult);
		$next_increment = $row['Auto_increment'];
		
		$quick_stat_id = $next_increment;
	
		//insert new $quick_stat_id into Characters
		$data['queries'][] = $query = "UPDATE MasterCharacter SET QuickStatID=".$quick_stat_id."  WHERE CharacterID=".$character_id;
		// Perform update Query
		$result = mysqli_query($link,$query);
		
		//insert new QuickStats record for character
		$data['queries'][] = $query = "INSERT INTO QuickStats (QuickStatID, Name, Description, CatagoryID, SizeID, AlignGoodID, AlignChaosID, Initiative, Armor, DeflectAC, Dodge, NaturalAC, DR, SR, HD, HDType, HP, ASP, DSP, Fort, Ref, Will, Move, Swim, Fly, Space, Reach, StrMod, DexMod, ConMod, IntMod, WisMod, ChaMod, BAB, CMB, BullRushB, DisarmB, GrappleB, SunderB, TripB, FeintB, CMD, BullRushD, DisarmD, GrappleD, SunderD, TripD, FeintD, SpriteID, ThumbPicID, FullPicID) VALUES (".$quick_stat_id.", '".$charactername."', 'Player character', 0, ".$size_id.", ".$aligngoodid.", ".$alignchaosid.", ".$totalinit.", 0, 0, 0, 0, '".$dr."', ".$sr.", ".$totallevel.", 0, ".$totalhp.", ".$total_asp.", ".$total_dsp.", ".$arr_totalsaveroll[0].", ".$arr_totalsaveroll[1].", ".$arr_totalsaveroll[2].", ".$movementrate.", 0, 0, 5, 5, ".$arr_attmod[0].", ".$arr_attmod[1].", ".$arr_attmod[2].", ".$arr_attmod[3].", ".$arr_attmod[4].", ".$arr_attmod[5].", ".$totalbab.", ".$totalcmb.", ".$bullrush_b.", ".$disarm_b.", ".$grapple_b.", ".$sunder_b.", ".$trip_b.", ".$feint_b.", ".$totalcmd.", ".$bullrush_d.", ".$disarm_d.", ".$grapple_d.", ".$sunder_d.", ".$trip_d.", ".$feint_d.", 0, 0, 0)";
	} //end if $quick_stat_id == null
	
	//ELSE UPDATE QuickStat table
	else {
		$query = "UPDATE QuickStats
				SET AlignGoodID=".$aligngoodid.", AlignChaosID=".$alignchaosid.", Initiative=".$totalinit.",  Armor=0, DeflectAC=0, Dodge=0, NaturalAC=0, DR='".$dr."', SR=".$sr.", HD=".$totallevel.", HP=".$totalhp.", ASP=".$total_asp.", DSP=".$total_dsp.", Fort=".$arr_totalsaveroll[0].", Ref=".$arr_totalsaveroll[1].", Will=".$arr_totalsaveroll[2].", Move=".$movementrate.", StrMod=".$arr_attmod[0].", DexMod=".$arr_attmod[1].", ConMod=".$arr_attmod[2].", IntMod=".$arr_attmod[3].", WisMod=".$arr_attmod[4].", ChaMod=".$arr_attmod[5].", BAB=".$totalbab.", CMB=".$totalcmb.", BullRushB=".$bullrush_b.", DisarmB=".$disarm_b.", GrappleB=".$grapple_b.", SunderB=".$sunder_b.", TripB=".$trip_b.", FeintB=".$feint_b.", CMD=".$totalcmd.", BullRushD=".$bullrush_d.", DisarmD=".$disarm_d.", GrappleD=".$grapple_d.", SunderD=".$sunder_d.", TripD=".$trip_d.", FeintD=".$feint_d."
				WHERE QuickStatID=".$quick_stat_id;
	
	} //end else $quick_stat_id != null

	// Perform Query for either case
	$result = mysqli_query($link,$query);

/*
$movementrate
$size_id
$aligngoodid
$alignchaosid
$dr
$sr
$totalac 
$totaltouchac
$totalffac
$totalcmd
$totalcmb
$totalinit
$totalhp

$arr_totalsaveroll[{savetype}]

$totalbab

$arr_attmod[{$attribute}]
$arr_attvalue[{$attribute}]
$arr_attbonus[{$attribute}]
$arr_attenhance[{$attribute}]
*/
	foreach ($arr_skillid as $i => $value)
    { 
		//query if record exists already
		$query = "SELECT QuickStatID FROM QuickSkill 
				WHERE QuickStatID = ".$quick_stat_id." AND SkillID = ".$arr_skillid[$i]." LIMIT 1";
		// Perform Query
		$result = mysqli_query($link,$query);
		if(mysqli_num_rows($result) > 0) {
			//update old record
			$query = "UPDATE QuickSkill SET SkillRoll = ".$arr_skilltotalroll[$i]." WHERE QuickStatID = ".$quick_stat_id." AND SkillID = ".$arr_skillid[$i];
			// Perform Query
			$result = mysqli_query($link,$query);	
		} //end if record exists
		else {
			//create new record
			$query = "INSERT INTO QuickSkill (QuickStatID, SkillID, SkillRoll) VALUES (".$quick_stat_id.", ".$arr_skillid[$i].", ".$arr_skilltotalroll[$i].")";
			// Perform Query
			$result = mysqli_query($link,$query);
		}
	} //end foreach skill

//$arr_skilltotalroll[]


	//DONT NEED QUICK ATTACK FOR PLAYERS
	
	/*
	//delete old QuickAttack and create new QuickAttacks based on current character attacks
	$query = "DELETE FROM QuickAttack WHERE QuickStatID=".$quick_stat_id;
	// Perform Query
	$result = mysqli_query($link,$query);
	*/
	
	/*
	$query = "SELECT QuickAttackID FROM QuickAttack WHERE QuickStatID=".$quick_stat_id;
	// Perform Query
	$arr_quick_attack_id = array();
	if($result = mysqli_query($link,$query)) {
		//get old QuickAttackIDs for reuse
		while($row = mysqli_fetch_object($result)) {
			$arr_quick_attack_id[] = $row->QuickAttackID;
		} //end while result
	} //end if $result

	$attack_counter = 0;
	*/
	//for each weapon
	/*
	//each and QuickAttack entry will have 1+ entries in QuickAttackHitRolls to store attack bonuses (e.i. +11/+6, or +10/+10/+10)
	foreach ($arr_weaponid as $i => $value) {
		$attack_counter++;
		//use old QuickAttackID if exists
		if($arr_quick_attack_id[$i] > 0) {
			//USE OLD QuickAttackID if exists
			$quick_attack_id = $arr_quick_attack_id[$i];
			
			//add this attack (bonus to hit value) to QuickAttack table
			$query = "UPDATE QuickAttack SET AttackName='".$arr_weaponname[$i]."', DamageDieType=".$arr_damagedietype[$i].", DamageDieNum=".$arr_damagedienum[$i].", 
				DamgeMod=".$arr_basedamgemod[$i].", Equipped='".$arr_equipped[$i]."', OffHand='".$arr_offhand[$i]."', TwoHand='".$arr_twohand[$i]."', CritRange=".$arr_critrange[$i].", CritMult=".$arr_critmult[$i].", 
					RangeBase=".$arr_rangebase[$i].", Thrown='".$arr_thrown[$i]."', Flurry='".$arr_flurry[$i]."', WeaponID='".$arr_weaponid[$i]."' 
						WHERE QuickAttackID=".$quick_attack_id;
	
			// Perform Query
			$result = mysqli_query($link,$query);
		} //end if
		
		else {
			//get next AUTO_INCREMENT value for QuickAttack->QuickAttackID
			//next AUTO_INCREMENT
			$tablename	= "QuickAttack";
			$next_increment = 0;
			$query_ShowStatus = "SHOW TABLE STATUS LIKE '$tablename'";
			$query_ShowStatusResult	= mysqli_query($link, $query_ShowStatus) or die ( "Query failed: " . mysqli_error() . "<br/>" . $query_ShowStatus );
			
			$row = mysqli_fetch_assoc($query_ShowStatusResult);
			$next_increment = $row['Auto_increment'];
			
			$quick_attack_id = $next_increment;
	
			//insert entry for current weapon
			//add this attack (bonus to hit value) to QuickAttack table
			$query = "INSERT INTO QuickAttack (QuickAttackID, QuickStatID, AttackName, DamageDieType, DamageDieNum, DamgeMod, TwoHand, CritRange, CritMult, RangeBase, Thrown, 
				Flurry, WeaponID)  VALUES (".$quick_attack_id.", ".$quick_stat_id.", '".$arr_weaponname[$i]."', ".$arr_damagedietype[$i].", ".$arr_damagedienum[$i].", 
					".$arr_basedamgemod[$i].", '".$arr_twohand[$i]."', ".$arr_critrange[$i].", ".$arr_critmult[$i].", ".$arr_rangebase[$i].", '".$arr_thrown[$i]."', 
						'".$arr_flurry[$i]."', '".$arr_weaponid[$i]."')";
	
			// Perform Query
			$result = mysqli_query($link,$query);
		} //end else insert new QuickAttack

		//number of attacks, for each attack input an entry in QuickAttackHitRolls table
		for($hit_roll_counter = 0; $hit_roll_counter < 5; $hit_roll_counter++) {
			if($arr_totalattack[$i][$hit_roll_counter] > 0) {
				//query if record exists already
				$query = "SELECT AttackBonus FROM QuickAttackHitRolls  WHERE AttackRollNum = ".$hit_roll_counter." AND QuickAttackID = ".$quick_attack_id." LIMIT 1";
				// Perform Query
				$result = mysqli_query($link,$query);
				if(mysqli_num_rows($result) > 0) {
					//update old record
					$query = "UPDATE QuickAttackHitRolls SET AttackBonus = ".$arr_totalattack[$i][$hit_roll_counter]."  WHERE AttackRollNum = ".$hit_roll_counter." AND QuickAttackID = ".$quick_attack_id;
					$result = mysqli_query($link,$query);
				} //end if update old record
				else {
					//add this attack (bonus to hit value) to QuickAttackHitRolls table
					$query = "INSERT INTO QuickAttackHitRolls (AttackRollNum, QuickAttackID, AttackBonus) VALUES (".$hit_roll_counter.", ".$quick_attack_id.", ".$arr_totalattack[$i][$hit_roll_counter].")";
					// Perform Query
					$result = mysqli_query($link,$query);
				} //end else  insert new record
			} //end if has another attack
			else {
			//detele quick attack hit roll because it should not exist (hit roll value == 0)
				$query = "DELETE FROM QuickAttackHitRolls  WHERE AttackRollNum = ".$hit_roll_counter." AND QuickAttackID = ".$quick_attack_id;
				// Perform Query
				$result = mysqli_query($link,$query);
			} //end else delete if exists
		} //end for check multiple attacks
		
	} //end foreach $arr_weaponid
	*/
	/*
	//DELETE extra unused QuickAttack and QuickAttackHitRolls entries
	for($i = $attack_counter; $i < count($arr_quick_attack_id); $i++) {
		
		//DELETE QuickAttack
		$query = "DELETE FROM QuickAttack WHERE QuickAttackID = ".$arr_quick_attack_id[$i];
		// Perform Query
		$result = mysqli_query($link,$query);
		
		//DELETE QuickAttackHitRolls
		$query = "DELETE FROM QuickAttackHitRolls WHERE QuickAttackID = ".$arr_quick_attack_id[$i];
		// Perform Query
		$result = mysqli_query($link,$query);
	} //end for
	*/
/*
$arr_weaponid[{weapon}]
arr_weapontypeid[{weapon}]
$arr_weaponname[{weapon}]
$arr_weaponenhance[{weapon}]
arr_weapon_mw[{weapon}]
$arr_damagedietype[{weapon}]
$arr_damagedienum[{weapon}]
$arr_totaldamgemod[{weapon}]
$arr_critrange[{weapon}]
$arr_critmult[{weapon}]
$arr_rangebase[{weapon}]
$arr_weaponsize[{weapon}]
$arr_damagetype[{weapon}]
$arr_twohand[{weapon}]
$arr_usedex[{weapon}]
$arr_thrown[{weapon}]
$arr_flurry[{weapon}]
$arr_notes[{weapon}]
$arr_customname[{weapon}]
$arr_hitbonus[{weapon}]
$arr_damagebonus[{weapon}]

$arr_totalattack[{weapon}][{attacks}] - attacks: item 0 is first attack, other items are multiple attacks
$arr_totaldamgemod[$i]
*/

?>