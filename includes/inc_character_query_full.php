<?php

//set function if does not exist or will cause error in level editor
if(!function_exists('EffectQuery'))
{
	function EffectQuery($link, $effectTypeTable, $effectTypeFieldID, $effectTypeID)
	{
		return 0;
	}
}

//CHARACTER INFO *****************************************************
//Prepare Query for characteres table
$query = 'SELECT * FROM MasterCharacter INNER JOIN 
		(Races INNER JOIN 
			(Characters INNER JOIN Sizes
				ON Characters.SizeID = Sizes.SizeID)
			ON Races.RaceID = Characters.RaceID)
		ON MasterCharacter.CharacterID = Characters.CharacterID
	WHERE MasterCharacter.CharacterID = '.$character_id;
//Perform characteres Query
if ($result = mysqli_query($link,$query)) {
	//Get resulting row from query
	$row = mysqli_fetch_object($result);
	$quick_stat_id = $row->QuickStatID;
	$charactername = $row->CharacterName;
	$favoredhp = $row->FavoredHP;
	$favoredskill = $row->FavoredSkill;
	$raceid = $row->RaceID;
	$racename = $row->RaceName;
	$movementrate = $row->MovementRate;
	$size_id = $row->SizeID;
	$sizename = $row->SizeName;
	$sizemod = $row->SizeMod;
	$gender = $row->Gender;
	$height = $row->Height;
	$weight = $row->Weight;
	$aligngoodid = $row->AlignGoodID;
	$alignchaosid = $row->AlignChaosID;
	$age = $row->Age;
	$deity = $row->Deity;
	$occupation = $row->Occupation;
	
	$factionid = $row->FactionID;
	
	$cmdmod = $row->CMDmod;
	$bullrush_b = $row->BullRushB;
	$disarm_b = $row->DisarmB;
	$grapple_b = $row->GrappleB;
	$sunder_b = $row->SunderB;
	$trip_b = $row->TripB;
	$feint_b = $row->FeintB;
	
	$cmbmod = $row->CMBmod;
	$bullrush_d = $row->BullRushD;
	$disarm_d = $row->DisarmD;
	$grapple_d = $row->GrappleD;
	$sunder_d = $row->SunderD;
	$trip_d = $row->TripD;
	$feint_d = $row->FeintD;
	
	$dodgebonus = $row->DodgeBonus;
	$initbonus = $row->InitBonus;
	$naturalac = $row->NaturalAC;
	$deflectac = $row->DeflectAC;
	$dr = $row->DamageResist;
	$sr = $row->SpellResist;
	$asp_bonus = $row->ASPbonus;
	$dsp_bonus = $row->DSPbonus;
	
	//set default values for armor and shield
	$acbonus = 0;
	$maxdex = 10;
	$skillpenalty = 0;
	$spellfail = 0;
	$shieldacbonus = 0;
	$shieldmaxdex = 10;
	$shieldskillpenalty = 0;
	$shieldspellfail = 0;
	
}

//\\//\\//\\//\\//
// count number of feats
$feat_count = 0;

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
//RACIAL ABILITIES
//\\//\\//\\//\\//
//get racial abilities
$arr_raceability = array();
$arr_raceability_id = array();
$arr_race_ability_desc = array();
//prepare Query for RaceAbility table
$query = 'SELECT Abilities.AbilityName, Abilities.AbilityID, Abilities.Description FROM Abilities 
			INNER JOIN RaceAbility ON Abilities.AbilityID = RaceAbility.AbilityID
			WHERE RaceID = '.$raceid;
//perform RaceAbility Query
if ($result = mysqli_query($link,$query)) {
	//get resulting rows from query
	while($row = mysqli_fetch_object($result))
	{
		$arr_raceability[] = $row->AbilityName;
		$arr_raceability_id[] = $row->AbilityID;
		if($row->AbilityID == 33) {
			//bonus feat
			$feat_count++;
		}
		$arr_race_ability_desc[] = $row->Description;
	
		$effectTypeTable = 'EffectsAbilities';
		$effectTypeFieldID = 'AbilityID';
		$effectTypeID = $row->AbilityID;
		$arr_race_ability_effect[] = EffectQuery($link, $effectTypeTable, $effectTypeFieldID, $effectTypeID);
	} // end while
}

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// FACTION INFO
//\\//\\//\\//\\//
// get faction name and info
// Prepare Query for Factions table
	$query = 'SELECT Factions.FactionName FROM Factions 
			WHERE FactionID = '.$factionid;
// Perform Factions Query
if ($result = mysqli_query($link,$query)) {
	//Get resulting row from query
	$row = mysqli_fetch_object($result);
	$factionname = $row->FactionName;
}

// FACTION ABILITIES ***************************************************
// get faction name and abilities
$arr_factionability = array();
$arr_faction_ability_desc = array();
// Prepare Query for FactionAbility table
$query = 'SELECT Abilities.AbilityID, Abilities.AbilityName, Abilities.Description 
			FROM FactionAbility INNER JOIN Abilities
			ON FactionAbility.AbilityID = Abilities.AbilityID 
			WHERE FactionAbility.FactionID = '.$factionid.' 
			ORDER BY Abilities.AbilityName';
// Perform FactionAbility Query
if ($result = mysqli_query($link,$query)) {
	//Get resulting rows from query
	while($row = mysqli_fetch_object($result)) {
		$arr_faction_ability_id[] = $row->AbilityID;
		$arr_factionability[] = $row->AbilityName;
		$arr_faction_ability_desc[] = $row->Description;
		
		$effectTypeTable = 'EffectsAbilities';
		$effectTypeFieldID = 'AbilityID';
		$effectTypeID = $row->AbilityID;
		$arr_faction_ability_effect[] = EffectQuery($link, $effectTypeTable, $effectTypeFieldID, $effectTypeID);
	} // end while
}

// RESISTANCES ***************************************************
// get resistances names
$arr_resistance = array();
// Prepare Query for CharacterResistance table
$query = 'SELECT CharacterResistance.Resistance 
			FROM CharacterResistance
			WHERE CharacterResistance.CharacterID = '.$character_id;
// Perform CharacterResistance Query
if ($result = mysqli_query($link,$query)) {
	//Get resulting rows from query
	while($row = mysqli_fetch_object($result)) {
		$arr_resistance[] = $row->Resistance;
	} // end while
}

// PROFICIENCIES ***************************************************
// get proficiency names
$arr_proficiency = array();
// Prepare Query for CharacterProficiency table
$query = 'SELECT CharacterProficiency.Proficiency 
			FROM CharacterProficiency
			WHERE CharacterProficiency.CharacterID = '.$character_id;
// Perform CharacterProficiency Query
if ($result = mysqli_query($link,$query)) {
	//Get resulting rows from query
	while($row = mysqli_fetch_object($result)) {
		$arr_proficiency[] = $row->Proficiency;
	} // end while
}

// SPECIAL ABILITIES ***************************************************
// get special abilitys names
$arr_special_ability = array();
$arr_special_ability_desc = array();
// Prepare Query for CharacterSpecialAbility table
$query = 'SELECT SpecialAbility, Description
			FROM CharacterSpecialAbility
			WHERE CharacterID = '.$character_id;
// Perform CharacterSpecialAbility Query
if ($result = mysqli_query($link,$query)) {
	//Get resulting rows from query
	while($row = mysqli_fetch_object($result)) {
		$arr_special_ability[] = $row->SpecialAbility;
		$arr_special_ability_desc[] = $row->Description;
	} // end while
}

// ATTRIBUTES**********************************************************
$arr_attmod = array();
$arr_attvalue = array();
$arr_attbonus = array();
$arr_attenhance = array();
$arr_attname = array();
// Prepare Query for Attributes table
$query = 'SELECT AttributeName FROM Attributes';
// Perform Attributes Query
if ($result = mysqli_query($link,$query)) {
	while($row = mysqli_fetch_object($result)) {
		$arr_attname[] = $row->AttributeName;
	} // end while
} //end if result
// Prepare Query for CharacterAttribute table
$query = 'SELECT * FROM CharacterAttribute WHERE CharacterID = '.$character_id;
// Perform Attributes Query
if ($result = mysqli_query($link,$query)) {
	// Get result rows from query
	while($row = mysqli_fetch_object($result))
	{
		$arr_attmod[] = floor((($row->Value + $row->Bonus + $row->Enhance)- 10)/2);
		$arr_attvalue[] = $row->Value;
		$arr_attbonus[] = $row->Bonus;
		$arr_attenhance[] = $row->Enhance;
	} // end while
}
//in case no attributes records exist
else {
	for($i = 0; $i < 6; $i++) {
		$arr_attmod[i] = 0;
		$arr_attvalue[i] = 10;
		$arr_attbonus[i] = 0;
		$arr_attenhance[i] = 0;
	} // end for
}
$str = 0;
$dex = 1;
$con = 2;
$int = 3;
$wis = 4; 
$cha = 5;

// SAVE BONUS ENHANCE NOTES ************************************************
$arr_savebonus = array(0, 0, 0);
$arr_savemod = array(0, 0, 0);
$arr_savenote = array('', '', '');
// Prepare Query for CharacterSave table
$query = 'SELECT * FROM CharacterSave WHERE CharacterID = '.$character_id;
// Perform CharacterSave Query
if($result = mysqli_query($link,$query)) {
	// Get result rows from query
	while($row = mysqli_fetch_object($result))
	{
		if ($row->Bonus > 0) { $arr_savebonus[$row->SaveID] = $row->Bonus; }
		else { $arr_savebonus[$row->SaveID] = 0; }
		if ($row->Enhance > 0) { $arr_savemod[$row->SaveID] = $row->Enhance; }
		else { $arr_savemod[$row->SaveID] = 0; }
		$arr_savenote [$row->SaveID] = $row->Notes;
	}
}

//***********************
// CLASS RECORDER :: LEVEL :: HIT POINTS :: BAB :: SKILL RANKS :: BASE SAVES
// get list of characters classes and data
$arr_classid = array();
$arr_level = array();
$totallevel = 0;
$arcane_level = 0;
$divine_level = 0;

// Prepare Query for CharacterClass table
$query = 'SELECT * FROM CharacterClass WHERE CharacterID = '.$character_id;
// Perform CharacterClass Query
$result = mysqli_query($link,$query);
// Get result rows from query
while($row = mysqli_fetch_object($result))
{
	$arr_classid[] = $row->ClassID;
	$arr_level[] = $row->Level;
	$totallevel += $row->Level;
	
	// if wizard or mt add to caster level
	if ($row->ClassID == 10 || $row->ClassID == 11 || $row->ClassID == 13 || $row->ClassID == 100) {
		$arcane_level += $row->Level;
	}
	// if cleric or mt add to divine caster level
	if ($row->ClassID == 3 || $row->ClassID == 4 || $row->ClassID == 100) {
		$divine_level += $row->Level;
	}
} // end while

//echo "arcane ".$arcane_level." divine ".$divine_level." /";

// get other class related data: class names, class abilities, base saving throws, bab
$arr_classname = array();
$arr_class_magic = array();
$arr_caster_level = array();
$arr_classability_learned = array();
$arr_classability_learned_temp = array();
$arr_classabilityid = array();
$arr_classabilityid_temp = array();
$arr_classability_class_level = array();
$arr_classability_class_level_temp = array();
$arr_classabilityname = array();
$arr_class_ability_desc_temp = array();
$arr_classabilityrank = array();
$arr_classabilityrank_temp = array();
$arr_hd = array();
$arr_hp = array();
$totalhp = 0;
$arr_classsaves = array(array());
// example of using nested array: array[%i]['fort'] = 4;
$arr_totalclasssaves = array(0, 0, 0);
// or ('fort' => 0, 'ref' => 0, 'will' => 0) ?
$arr_bab = array();
$totalbab = 0;
$arr_classranks = array();
$totalclassranks = 0;
$arr_classskill = array();
//declare array for class skills outside loop
$arr_classskill = array_pad($arr_classskill, 35, false); // $arr_classskill is now array[0 to 34], 35 elements, all set to false

$arr_class_asp = array();
$arr_class_dsp = array();
$asp_attribute_bonus = 0;
$dsp_attribute_bonus = 0;
$total_dsp = 0;
$total_asp = 0;
$total_dsp = 0;
$arr_spell_levels = array();
$arr_spell_levels = array_pad($arr_spell_levels, 10, -1); // $arr_spell_levels is now array[0 to 9], 10 elements, all set to NULL
$arr_spells_known = array();

//***********************
// CLASSES DATA
// cycle through each of the characters classes
foreach ($arr_classid as $i => $value) {
	//***********************
	// CLASSES HD, HP, TOTAL HP, SKILL RANKS
	// Prepare query of Classes table to get the class name
	$query = 'SELECT * FROM Classes WHERE ClassID = '.$arr_classid[$i];
	// Perform Classes Query
	$result = mysqli_query($link,$query);
	//Get resulting row from query
	$classrow = mysqli_fetch_object($result);
	$arr_classname[] = $classrow->ClassName;
	$arr_class_magic[] = $classrow->Magic;
	$arr_class_magic_attribute_id[] = (int)$classrow->MagicAttributeID;
	// get hit points for class and total
	$arr_hd[] = $classrow->HDType;
	$arr_hp[] = (round($classrow->HDType/2+1)) * $arr_level[$i];
	$totalhp += round($classrow->HDType/2+1) * $arr_level[$i];
	// get skill ranks for class and total
	$classranks = ($classrow->SkillPerLevel + $arr_attmod[$int]) * $arr_level[$i];
	$arr_classranks[] = $classranks;
	$totalclassranks += $classranks;

	//***********************
	// CLASS ABILITIES
	// get class abilities for current class that character meets level requirements for
	$class_feat_count = 0;
	$query = 'SELECT Abilities.AbilityID, Abilities.AbilityRank, Abilities.AbilityName, Abilities.Description, ClassAbility.LevelGained 
				FROM Abilities INNER JOIN ClassAbility 
					ON Abilities.AbilityID = ClassAbility.AbilityID 
					AND Abilities.AbilityRank = ClassAbility.AbilityRank 
				WHERE ClassAbility.ClassID = '.$arr_classid[$i].' 
				ORDER BY Abilities.AbilityRank ASC, ClassAbility.LevelGained DESC';
				
	// perform Abilities & ClassAbility query
	$result = mysqli_query($link,$query);
	// get resulting rows from query
	while($row = mysqli_fetch_object($result))
	{
		// add ability to list if class level meets requirment
		if ($row->LevelGained <= $arr_level[$i])
		{	
			if($row->AbilityID == 33) {
				$class_feat_count++;
			}
			else {
				$arr_classability_learned_temp[] = $arr_classid[$i];
				$arr_classabilityid_temp[] = $row->AbilityID;
				$arr_classability_class_level_temp[] = $arr_level[$i];
				$arr_classabilityrank_temp[] = $row->AbilityRank;
				$arr_classabilityname[] = $row->AbilityName;
				$arr_class_ability_desc_temp[] = $row->Description;
			}			
		}
	} // end while
	//add the bonus feat ability manually so that the number of feats can be added together as one 'ability'
	if($class_feat_count > 0) {
		$arr_classability_learned_temp[] = $arr_classid[$i];
		$arr_classabilityid_temp[] = 33;
		$arr_classability_class_level_temp[] = 0;
		$arr_classabilityrank_temp[] = $class_feat_count;
		$arr_classabilityname[] = 'Bonus Feat x'.$class_feat_count;
		$arr_class_ability_desc_temp[] = '';
	}
	//combine feats for total feat_count
	$feat_count += $class_feat_count;
	
	//***********************
	// CLASS BASE SAVES AND TOTAL BASE SAVES
	// loop 3 times to capture data for all 3 saves
	for ($j = 0; $j <= 2; $j++) {
		if ($j == 0) $savetype = $classrow->FortType;
		elseif ($j == 1) $savetype = $classrow->RefType;
		else $savetype = $classrow->WillType;
		
		if ($savetype == TRUE) { // high save
			$query = 'SELECT HighValue AS Value FROM SaveValues WHERE Level = '.$arr_level[$i];
		}
		else { // low save
			$query = 'SELECT LowValue AS Value FROM SaveValues WHERE Level = '.$arr_level[$i];
		}
		// perform Saving Throws query
		$result = mysqli_query($link,$query);
		// get resulting rows from query
		$row = mysqli_fetch_object($result);
		// add base save to save array $i is the class placeholder, $j is the savetype (0, 1, or 2)
		$arr_classsaves[$i][$j] = $row->Value;
		// add to total save
		$arr_totalclasssaves[$j] += $row->Value;
	}
	
	//***********************
	// CLASS BAB AND TOTAL BAB
	if ($classrow->AttackType == 'high') { // high BAB
		$query = 'SELECT HighValue AS Value FROM BabValues WHERE Level = '.$arr_level[$i];
	}
	elseif ($classrow->AttackType == 'medium') { // medium BAB
		$query = 'SELECT MediumValue AS Value FROM BabValues WHERE Level = '.$arr_level[$i];
	}
	else { // low BAB
		$query = 'SELECT LowValue AS Value FROM BabValues WHERE Level = '.$arr_level[$i];
	}
	$result = mysqli_query($link,$query);
	// get resulting rows from query
	$row = mysqli_fetch_object($result);
	$arr_bab[$i] = $row->Value;
	$totalbab += $row->Value;

	//***********************
	// CLASS SKILLS
	// get list of all current class skills
	$query = 'SELECT SkillID FROM ClassSkill WHERE ClassID = '.$arr_classid[$i];
	// perform ClassSkill query
	if($result = mysqli_query($link,$query)) {
		$arr_classskill = array();
		// get resulting rows from query
		while($row = mysqli_fetch_object($result))
		{
			$arr_classskill[$row->SkillID] = true;
		} // end while
	}
	
	//***********************
	// CLASS SPELL POINTS, SPELLS KNOWN, AND TOTAL SPELL POINTS
	if($arr_class_magic[$i]!= 'none') {	
		//get spells known
		if($arr_class_magic[$i]== 'arcane') $caster_level = $arcane_level;
		else $caster_level = $divine_level;
		
		if ($classrow->SpellPoints == 'low' || $classrow->SpellPoints == 'medium')// paladin, ranger, bard, vanguard
		{
			//for these, can't use total caster level, must use class level to get spell points and determine casting level of spells
			$caster_level = $arr_level[$i];
		}
			
		$arr_caster_level[$i] = $caster_level;
		//spells known query (SpellPoints = 'none', 'low', 'medium', 'high', 'highest')
		$query_sk = 'SELECT * FROM ClassSpell WHERE Level = '.$caster_level.' AND SpellsKnown = "'.$classrow->SpellPoints.'"';
		$result_sk = mysqli_query($link,$query_sk);
		//get resulting rows from query
		$row_sk = mysqli_fetch_object($result_sk);
		$arr_spells_known[$i] = $arr_spell_levels;
		//get spells known, find highest castable spell level
		$arr_spells_known[$i][0] = $row_sk->Zero;
		$arr_spells_known[$i][1] = $row_sk->One;
		$arr_spells_known[$i][2] = $row_sk->Two;
		$arr_spells_known[$i][3] = $row_sk->Three;
		$arr_spells_known[$i][4] = $row_sk->Four;
		$arr_spells_known[$i][5] = $row_sk->Five;
		$arr_spells_known[$i][6] = $row_sk->Six;
		$arr_spells_known[$i][7] = $row_sk->Seven;
		$arr_spells_known[$i][8] = $row_sk->Eight;
		$arr_spells_known[$i][9] = $row_sk->Nine;
		
		$msl = '';
		for($j = 0; $j < 10; $j++) {
			if($arr_spells_known[$i][$j] > -1)
				$msl = "MSL$j";
		} //end for $i
		
		//get class spell points
		if ($classrow->SpellPoints == 'low') { // low SP (paladin, ranger)
			//for these, can't use total divine caster level, must use class level to get spell points
			$query_sp = 'SELECT LowValue AS Value FROM SpellPointValues WHERE Level = '.$caster_level;
		}
		elseif ($classrow->SpellPoints == 'medium') { // medium SP (bard, vanguard)
			//for these, can't use total divine caster level, must use class level to get spell points
			$query_sp = 'SELECT MediumValue AS Value FROM SpellPointValues WHERE Level = '.$caster_level;
		}	
		elseif ($classrow->SpellPoints == 'high') { // high SP (cleric, druid, wizard)
			//$query_sp = 'SELECT HighValue AS Value FROM SpellPointValues WHERE Level = '.$caster_level;
			//***********
			//HOUSE RULE, GIVE MORE SPELL POINTS TO ALL MAGIC USERS, give them 'highest' value
			$query_sp = 'SELECT HighestValue AS Value FROM SpellPointValues WHERE Level = '.$caster_level;
		}
		else {// $classrow->SpellPoints == 'highest') // highest SP (sorcerer)
			$query_sp = 'SELECT HighestValue AS Value FROM SpellPointValues WHERE Level = '.$caster_level;
		}
		$result_sp = mysqli_query($link,$query_sp);
		// get resulting rows from query
		$row_sp = mysqli_fetch_object($result_sp);
		
		//bonus sp based on attribute modifier and highest level of known spells
		$query_bonus = 'SELECT '.$msl.' AS BonusPoints FROM BonusSpellPointValues WHERE AttributeMod = '.$arr_attmod[$classrow->MagicAttributeID];
		// perform ClassSkill query
		if($result_bonus = mysqli_query($link,$query_bonus)) {
			//??????????????????????????$arr_classskill = array();
			// get resulting rows from query
			$row_bonus = mysqli_fetch_object($result_bonus);
		} //end if result
		
		//if arcane or divine magic
		if($arr_class_magic[$i] == 'arcane') {
			$arr_class_asp[$i] = $row_sp->Value;
			$asp_attribute_bonus = $row_bonus->BonusPoints;
			$total_asp += $arr_class_asp[$i] + $asp_attribute_bonus + $asp_bonus;
		} //end if arcane magic
		else {
			$arr_class_dsp[$i] = $row_sp->Value;
			$dsp_attribute_bonus = $row_bonus->BonusPoints;
			$total_dsp += $arr_class_dsp[$i] + $dsp_attribute_bonus + $dsp_bonus;
		} //end if arcane magic
		
	} //end if magic
	
} // end foreach class loop

//***********************
// USE ONLY HIGHEST RANKS OF RANKED CLASS ABILITIES
$highestrank[] = array();
// find highest of ranked abilities, store abilityid and rank in $highestrank[abilityid]=rank
foreach ($arr_classabilityid_temp as $i => $value) {
	//if a highest rank has been previously set for the current ability
	if(isset($highestrank[$arr_classabilityid_temp[$i]])) {
		//check if current ability has a higher rank
		if ($arr_classabilityrank_temp[$i] > $highestrank[$arr_classabilityid_temp[$i]]) {
			//set new highestrank[abilityid] to current abilities higher rank
			$highestrank[$arr_classabilityid_temp[$i]] = $arr_classabilityrank_temp[$i];
		}
	}
	//else the abilities highestrank has not been set yet
	else {
		$highestrank[$arr_classabilityid_temp[$i]] = $arr_classabilityrank_temp[$i];
	}
}
// add abilities with 0 rank and highest of ranked abilities to $arr_classability[]
//	allowance for certain abilities, must choose an ability per rank: i.e. paladin mercies and rogue talents
foreach ($arr_classabilityid_temp as $i => $value)
{
	if ($arr_classabilityrank_temp[$i] == 0 || $arr_classabilityrank_temp[$i] == $highestrank[$arr_classabilityid_temp[$i]]
			|| $arr_classabilityid_temp[$i] == 168 || $arr_classabilityid_temp[$i] == 203 //168 == mercy, 203 == rogue talent
		)
		{
		
		$effectTypeTable = 'EffectsAbilities';
		$effectTypeFieldID = 'AbilityID';
		$effectTypeID = $arr_classabilityid_temp[$i];
		$abilityrank = $arr_classabilityrank_temp[$i];
		
		//add into the EffectQuery function parameter for the players selected choice for his potion abilities, i.e.: mercy, rogue talent
		$query = "SELECT EffectID FROM PlayerCharacterSelectedClassAbilities WHERE 
			CharacterID = $character_id AND AbilityID = $effectTypeID AND AbilityRank = $abilityrank";
		$result = mysqli_query($link,$query);
		if($row = mysqli_fetch_object($result))
		{
			$effect_id = $row->EffectID;
			$class_ability_effect = EffectQuery($link, $effectTypeTable, 0, 0, 0, $effect_id);
			//use specific name for the selected class ability
			$arr_classabilityname[$i] = $class_ability_effect[0]->EffectName;
			$arr_class_ability_effect[] = $class_ability_effect;
		}
		else
		{
			$arr_class_ability_effect[] = EffectQuery($link, $effectTypeTable, $effectTypeFieldID, $effectTypeID, $abilityrank);
		}
		
		$arr_classability_learned[] = $arr_classability_learned_temp[$i];
		$arr_classabilityid[] = $arr_classabilityid_temp[$i];
		$arr_classabilityrank[] = $arr_classabilityrank_temp[$i];
		$arr_classability_class_level[] = $arr_classability_class_level_temp[$i];
		$arr_classability[] = $arr_classabilityname[$i];
		$arr_class_ability_desc[] = $arr_class_ability_desc_temp[$i];
		
	}
}

//TOTAL LEVEL BONUSES / ABILITIES *******************************************
// get list of level based abilities
$query = 'SELECT AbilityID FROM LevelAbility WHERE LevelGained <= '.$totallevel;
//perform LevelAbility query
if($result = mysqli_query($link,$query)) {
	//get resulting rows from query
	while($row = mysqli_fetch_object($result))
	{
		if($row->AbilityID == 33) {
			//additional feat gained
			$feat_count++;
		}
	} //end while
}

//***********************
// TOTAL SKILL RANKS
$total_skill_ranks = $totalclassranks + $favoredskill;
//if human add extra skill points
if($raceid == 7) {
	$total_skill_ranks += $totallevel;
}

//***********************
// SAVING THROW VARIABLES AND TOTAL SAVING THROW VALUES
// use with save arrays
$fort = 0;
$ref = 1;
$will = 2;

// Total Saving throws
$arr_totalsaveroll = array();
$arr_totalsaveroll[$fort] = $arr_totalclasssaves[$fort]+$arr_attmod[$con]+$arr_savebonus[$fort]+$arr_savemod[$fort];
$arr_totalsaveroll[$ref] = $arr_totalclasssaves[$ref]+$arr_attmod[$dex]+$arr_savebonus[$ref]+$arr_savemod[$ref];
$arr_totalsaveroll[$will] = $arr_totalclasssaves[$will]+$arr_attmod[$wis]+$arr_savebonus[$will]+$arr_savemod[$will];

//************************************************************
// SKILLS
// Prepare Query for SkillList table
$query = 'SELECT SkillList.SkillID, SkillList.AttributeID, Attributes.ShortName, SkillName, Description, 
			Untrained, CharacterSkill.Ranks, CharacterSkill.Bonus, CharacterSkill.Enhance
			FROM Attributes INNER JOIN 
				(SkillList LEFT JOIN 
					(SELECT * FROM CharacterSkill WHERE CharacterID = '.$character_id.') as CharacterSkill
					ON SkillList.SkillID = CharacterSkill.SkillID)
				ON Attributes.AttributeID = SkillList.AttributeID
				ORDER BY SkillName';
			
// Perform SkillList Query
$result = mysqli_query($link,$query);

//Get resulting row from query
$arr_skillid = array();
$arr_skillname = array();
$arr_skillatt = array();
$arr_skillattshortname = array();
$arr_skillranks = array();
$arr_skillbonus = array();
$arr_skillenhance = array();
$arr_skilltotalroll = array();
$spentskillranks = 0;
$count = 0;

while($row = mysqli_fetch_object($result))
{
	$arr_skillid[] = $row->SkillID;
	$arr_skillname[] = $row->SkillName;
	$arr_skillatt[] = $row->AttributeID;
	$arr_skillattshortname[] = $row->ShortName;
	
	if ($row->Ranks != NULL) {
		$arr_skillranks[] = $row->Ranks;
		$spentskillranks += $row->Ranks;
	}
	else
		$arr_skillranks[] = 0;
		
	if ($row->Bonus != NULL)
		$arr_skillbonus[] = $row->Bonus;
	else
		$arr_skillbonus[] = 0;
		
	if ($row->Enhance != NULL)
		$arr_skillenhance[] = $row->Enhance;
	else
		$arr_skillenhance[] = 0;
	
	$arr_skilltotalroll[] = ($row->Ranks + $row->Bonus + $row->Enhance + $arr_attmod[$row->AttributeID]);

	if (isset($arr_classskill[$count]) && $arr_classskill[$count] == true && $row->Ranks > 0) {
			$arr_skilltotalroll[$count] += 3;
	}
	$count++;
} // end while


//ONLY DO THIS FOR LOOKING AT CHARACTER SHEET
if(isset($character_sheet_display) && $character_sheet_display == 1)
{
	// WEAPONS ARMOR EQUIPMENT *******************************
	// Prepare Query for CharacterWeapon / Weapon tables
	$query = 'SELECT Weapon.WeaponID, Weapon.WeaponTypeID, Weapon.WeaponName, CharacterWeapon.Enhance, CharacterWeapon.MW, Weapon.DamageDieType, Weapon.DamageDieNum, 
			Weapon.DamgeMod, CharacterWeapon.TwoHand AS CharTwoHand, Weapon.CritRange, Weapon.CritMult, Weapon.RangeBase, Weapon.WeaponSize, Weapon.DamageType, Weapon.SME, 
			Weapon.UseDex, CharacterWeapon.UseDex AS CharUseDex, Weapon.Thrown, CharacterWeapon.Flurry, CharacterWeapon.Notes, CharacterWeapon.CustomName, 
			CharacterWeapon.Equipped, CharacterWeapon.OffHand, 
			CharacterWeapon.HitBonus, CharacterWeapon.DamageBonus, CharacterWeapon.CritRangeBonus 
		FROM Weapon INNER JOIN CharacterWeapon
		ON Weapon.WeaponID = CharacterWeapon.WeaponID
		WHERE CharacterWeapon.CharacterID = '.$character_id;//.' AND CharacterWeapon.Equipped = TRUE';
	// Perform CharacterWeapon / Weapon Query
	$result = mysqli_query($link,$query);
	//Get resulting row from query
	$arr_weaponid = array();
	$arr_weapontypeid = array();
	$arr_weaponname = array();
	$arr_weaponenhance = array();
	$arr_weapon_mw = array();
	$arr_damagedietype = array();
	$arr_damagedienum = array();
	$arr_totaldamgemod = array();
	$arr_critrange = array();
	$arr_critmult = array();
	$arr_rangebase = array();
	$arr_weaponsize = array();
	$arr_damagetype = array();
	$arr_sme = array();
	//get two hand from CharacterWeapon so user has control of setting
	$arr_twohand = array();
	$arr_usedex = array();
	$arr_thrown = array();
	$arr_flurry = array();
	$arr_equipped = array();
	$arr_offhand = array();
	$arr_weaponnotes = array();
	$arr_customname = array();
	$arr_hitbonus = array();
	$arr_damagebonus = array();
	$arr_crit_range_bonus = array();

	$arr_totalattack = array(array_pad(array(), 5, 0));

	$count = 0;

	while($row = mysqli_fetch_object($result))
	{
		$arr_weaponid[$count] = $row->WeaponID;
		$arr_weapontypeid[$count] = $row->WeaponTypeID;
		$arr_weaponname[$count] = $row->WeaponName;
		$arr_weaponenhance[$count] = $row->Enhance;
		$arr_weapon_mw[$count] = $row->MW;
		$arr_damagedietype[$count] = $row->DamageDieType;
		$arr_damagedienum[$count] = $row->DamageDieNum;
		$arr_basedamgemod[$count] = $row->DamgeMod + $row->Enhance + $row->DamageBonus; //leaving off strength to calculate during attack with bonuses
		$arr_totaldamgemod[$count] = $row->DamgeMod + $row->Enhance + $row->DamageBonus + $arr_attmod[0]; //only using this on character sheet
		$arr_critrange[$count] = $row->CritRange;
		$arr_critmult[$count] = $row->CritMult;
		$arr_rangebase[$count] = $row->RangeBase;
		$arr_weaponsize[$count] = $row->WeaponSize;
		$arr_damagetype[$count] = $row->DamageType;
		$arr_sme[$count] = $row->SME;
		
		$arr_twohand[$count] = $row->CharTwoHand;
		if($row->CharTwoHand == TRUE && $arr_attmod[0] > 1)
			$arr_totaldamgemod[$count] += floor($arr_attmod[0] * 0.5);
		
		$arr_usedex[$count] = $row->UseDex;
		if ($row->CharUseDex == TRUE)
			$arr_usedex[$count] = TRUE;
			
		$arr_thrown[$count] = $row->Thrown;
		$arr_flurry[$count] = $row->Flurry;
		$arr_equipped[$count] = $row->Equipped;
		$arr_offhand[$count] = $row->OffHand;
		if($row->OffHand == TRUE && $arr_attmod[0] > 1)
			$arr_totaldamgemod[$count] -= floor($arr_attmod[0] * 0.5);
		
		$arr_weaponnotes[$count] = $row->Notes;
		$arr_customname[$count] = $row->CustomName;
		$arr_hitbonus[$count] = $row->HitBonus;
		$arr_damagebonus[$count] = $row->DamageBonus;
		
		//add CritRangeBonus to CritRange
		$arr_crit_range_bonus[$count] = $row->CritRangeBonus;
		$arr_critrange[$count] += $row->CritRangeBonus;
		
		// use dex mod to add to attack bonus if weapon usedex is true
		if(isset($character_sheet_display))
		{
			if ($arr_usedex[$count] == TRUE) { // use dex mod
				$attack = $row->Enhance + $row->HitBonus + $totalbab + $arr_attmod[1];
			}
			else {
				$attack = $row->Enhance + $row->HitBonus + $totalbab + $arr_attmod[0];
			}
		}
		else
		{
			$attack = $row->Enhance + $row->HitBonus + $totalbab;
		}
		
		// figure out number of attacks and full attack bonuses
		$arr_currenttotalattack = array(0, 0, 0, 0, 0);
		if ($totalbab > 20) {
			$arr_currenttotalattack = array(0 => $attack, 1 => $attack-5, 2 => $attack-10, 3 => $attack-15, 4 => $attack-20);
		}
		elseif ($totalbab > 15) {
			$arr_currenttotalattack = array(0 => $attack, 1 => $attack-5, 2 => $attack-10, 3 => $attack-15, 4 => 0);
		}
		elseif ($totalbab > 10) {
			$arr_currenttotalattack = array(0 => $attack, 1 => $attack-5, 2 => $attack-10, 3 => 0, 4 => 0);
		}
		elseif ($totalbab > 5) {
			$arr_currenttotalattack = array(0 => $attack, 1 => $attack-5, 2 => 0, 3 => 0, 4 => 0);
		}
		else {
			$arr_currenttotalattack = array(0 => $attack, 1 => 0, 2 => 0, 3 => 0, 4 => 0);
		}
		
		$arr_totalattack[$count] = $arr_currenttotalattack;
		
		$count++;
	}

	// Prepare Query for CharacterArmor / Armor tables
	// get Equipped armor
	$query = 'SELECT * FROM Armor INNER JOIN CharacterArmor
		ON Armor.ArmorID = CharacterArmor.ArmorID
		WHERE CharacterArmor.CharacterID = '.$character_id.' AND CharacterArmor.Equipped = TRUE
		AND Armor.Shield = FALSE';
	
	// Perform CharacterArmor Query
	if($result = mysqli_query($link,$query)) {
		
		//Get resulting row from query
		while($row = mysqli_fetch_object($result))
		{
			$armorid = $row->ArmorID;
			$armorname = $row->ArmorName;
			$armorenhance = $row->Enhance;
			$armor_mw = $row->MW;
			$acbonus = $row->ACBonus + $row->Enhance + $row->ACMod;
			$ac_mod = $row->ACMod;
			$maxdex = $row->MaxDex;
			$skillpenalty = $row->SkillPenalty;
			$spellfail = $row->SpellFail;
			$armortype = $row->ArmorType;
			$armorsize = $row->ArmorSize;
			$material = $row->Material;
			$armornotes = $row->Notes;
		}
	}

	// get Equipped shield
	$query = 'SELECT * FROM Armor INNER JOIN CharacterArmor
		ON Armor.ArmorID = CharacterArmor.ArmorID
		WHERE CharacterArmor.CharacterID = '.$character_id.' AND CharacterArmor.Equipped = TRUE
		AND Armor.Shield = TRUE';

	// Perform CharacterArmor / Shield Query
	if($result = mysqli_query($link,$query)) {
		
		//Get resulting row from query
		while($row = mysqli_fetch_object($result))
		{
			$shieldarmorid = $row->ArmorID;
			$shieldarmorname = $row->ArmorName;
			$shieldarmorenhance = $row->Enhance;
			$shieldarmor_mw = $row->MW;
			$shieldacbonus = $row->ACBonus + $row->Enhance + $row->ACMod;
			$shield_ac_mod = $row->ACMod;
			$shieldmaxdex = $row->MaxDex;
			$shieldskillpenalty = $row->SkillPenalty;
			$shieldspellfail = $row->SpellFail;
			$shieldarmortype = $row->ArmorType;
			$shieldarmorsize = $row->ArmorSize;
			$shieldmaterial = $row->Material;
			$shieldnotes = $row->Notes;
		}
	}
}//end if character sheet

//totals with modifiers added
$totalhp += $favoredhp +($arr_attmod[$con]*$totallevel);
//these used in CharacterSheet only
$totalac = 10 + $acbonus + $shieldacbonus + $arr_attmod[$dex] + $sizemod + $dodgebonus + $naturalac + $deflectac;
$totaltouchac =  10 + $arr_attmod[$dex] + $sizemod + $dodgebonus + $deflectac;
$totalffac = 10 + ($arr_attmod[$dex]<0?$arr_attmod[$dex]:0) + $acbonus + $shieldacbonus + $sizemod + $naturalac + $deflectac;
$totalcmd = 10 + $totalbab + $arr_attmod[$str] + $arr_attmod[$dex] + $sizemod + $cmdmod;
$totalcmb = $totalbab + $arr_attmod[$str] + $sizemod + $cmbmod;

$effectiveskillpenalty = $skillpenalty + $shieldskillpenalty;
if (isset($shieldmaxdex) && $shieldmaxdex < $maxdex) {
	$effectivemaxdex = $shieldmaxdex;
} else {
	$effectivemaxdex = $maxdex;
}
$effectivespellfail = $spellfail + $shieldspellfail;

$totalinit = $arr_attmod[$dex] + $initbonus;

/*
$character_id
$charactername
$favoredhp
$favoredskill
$raceid
$racename
$movementrate
$size_id
$sizename
$sizemod
$cmmod
$gender
$height
$weight
$aligngoodid
$alignchaosid
$age
$deity
$occupation

$factionid
$dodgebonus
$initbonus
$naturalac
$deflectac
$dr
$sr
$asp_bonus
$dsp_bonus
	
$arr_raceability[{list}]
$arr_race_ability_desc[{list}]
$feat_count

$factionname
arr_faction_ability_id[{list}]
$arr_factionability[{list}]

$arr_resistance[{list}]
$arr_proficiency[{list}]
$arr_special_ability[{list}]
$arr_special_ability_desc[{list}]

$arr_savebonus[{savetypes}]
$arr_savemod[{savetypes}]
$arr_savenote[{savetypes}]

$arr_classid[{classcounter}]
$arr_level[{classcounter}]
$totallevel
$arcanelevel // caster level
$divinelevel
$arr_classname[{classcounter}]
$arr_class_magic[{classcounter}]
$arr_hd[{classcounter}]
$arr_hp[{classcounter}]
$totalhp
$arr_classranks[{classcounter}]
$totalclassranks

$arr_class_asp = array();
$arr_class_dsp = array();
$asp_attribute_bonus = 0;
$dsp_attribute_bonus = 0;
$total_dsp = 0;
$total_asp = 0;
$total_dsp = 0;
$arr_spell_levels = array_pad($arr_spell_levels, 10, -1); // $arr_spell_levels is now array[0 to 9], 10 elements, all set to NULL
$arr_spells_known = array($arr_spell_levels);

$arr_classsaves [{classcounter}][{savetype}] // array of base class saves
$arr_totalclasssaves[{savetypes}] // array of total class saves
$fort = 0;
$ref = 1;
$will = 2;
$arr_totalsaveroll[{savetype}]

$arr_bab[{classcounter}]
$totalbab

$arr_classskill[{skill}]

$arr_attmod[{$attribute}]
$arr_attvalue[{$attribute}]
$arr_attbonus[{$attribute}]
$arr_attenhance[{$attribute}]
$arr_attname[{$attribute}]
$str = 0;
$dex = 1;
$con = 2;
$int = 3;
$wis = 4;
$cha = 5;

$arr_classability[{ability}]
$arr_class_ability_desc[{ability}]
$class_feat_count

$arr_skillid[{skill}]
$arr_skillname[{skill}]
$arr_skillatt[{skill}]
$arr_skillattshortname[{skill}]
$arr_skillranks[{skill}]
$arr_skillbonus[{skill}]
$arr_skillenhance[{skill}]
$arr_skilltotalroll[{skill}]

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
$arr_crit_range_bonus[{weapon}]

$arr_totalattack[{weapon}][{attacks}] -  attacks: item 0 is first attack, other items are multiple attacks

$armorid
$armorname
$armorenhance
$armor_mw
$acbonus
$ac_mod //character specific AC mod i.e. fighter ability armor master
$maxdex
$skillpenalty
$spellfail
$armortype
$armorsize
$material
$notes

$shieldarmorid
$shieldarmorname
$shieldarmorenhance
$shieldarmor_mw
$shieldacbonus
$shield_ac_mod
$shieldmaxdex
$shieldskillpenalty
$shieldspellfail
$shieldarmortype
$shieldarmorsize
$shieldmaterial
$shieldnotes

$totalac 
$totaltouchac
$totalffac
$totalcmd
$totalcmb

$effectiveskillpenalty
$effectivemaxdex
$effectivespellfail

$totalinit

*/

/* clear results
$result
*/

?>