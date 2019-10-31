<?php
// database connect function
include_once("./includes/inc_connect.php");
// Connect to database using function from "inc_connect.php"
$link = dbConnect();

//delete effect function
function DeleteEffect($local_link, $effectTypeTable, $oldEffectID)
{
	$query = "DELETE FROM $effectTypeTable WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	//delete from all tables
	$query = "DELETE FROM Effects WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM EffectSkillSaveDCMod WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM EffectArea WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM EffectHPMod WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM EffectCondition WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM EffectAttackMod WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM EffectACMod WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM EffectResistanceImmune WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM EffectAttributeMod WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM EffectSkillMod WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM EffectSaveMod WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM EffectMovementMod WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM EffectActionMod WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM EffectSummon WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM EffectSummonCreatures WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	$query = "DELETE FROM DiceRoll WHERE EffectID = ".$oldEffectID;
	$result = mysqli_query($local_link,$query);
	
	//echo mysqli_error($local_link);
}

//deleting effect option
if(isset($_GET['deleteeffectid']))
{
	$effectTypeTable = $_GET['effecttypetable'];
	$delete_effect_id = $_GET['deleteeffectid'];
	DeleteEffect($link, $effectTypeTable, $delete_effect_id);
	exit;
}

$title='Effect Generator';
if(isset($_GET['title'])) $title=ucfirst($_GET['title']);

//get description of Effects table
$query = "DESCRIBE Effects";
$effectsDescribeResult = mysqli_query($link,$query);
GLOBAL $effectsDescribe;
$effectsDescribe = array();
while($effectsDescribeRow = mysqli_fetch_object($effectsDescribeResult))
{
	$effectsDescribe[] = $effectsDescribeRow;
}

if(isset($_REQUEST['effecttype']))
{
	$effectType = $_REQUEST['effecttype'];
	$effectTypeID = $_REQUEST['effecttypeid'];
	$abilityRank = 0;
	
	switch($effectType)
		{
			case 'spells':
				$effectTypeTable = 'EffectsSpells';
				$effectTypeFieldID = 'SpellID';
				//get spell description
				$query = "SELECT html from Spells WHERE SpellID = ".$effectTypeID;
				if($result = mysqli_query($link,$query))
				{
					if($row = mysqli_fetch_object($result))
					{
						//$spell_description = str_replace('<link rel="stylesheet" href="PF.css">','', $row->html);
						$spell_description = str_replace('PF.css','', $row->html);
					}
				}
				break;
				
			case 'ability':
				$effectTypeTable = 'EffectsAbilities';
				$effectTypeFieldID = 'AbilityID';
				$abilityRank = isset($_REQUEST['abilityrank']) ? $_REQUEST['abilityrank'] : 0;
				break;
				
			case 'special':
				$effectTypeTable = 'EffectsAbilities';
				$effectTypeFieldID = 'QuickSpecialID';
				//if not exists, insert into QuickAbilities and get $effectTypeID
				break;
				
			case 'feat':
				$effectTypeTable = 'EffectsFeats';
				$effectTypeFieldID = 'FeatID';
				break;
				
			case 'weapon':
				$effectTypeTable = 'EffectsWeapons';
				$effectTypeFieldID = 'ItemID';
				break;
				
			case 'armor':
				$effectTypeTable = 'EffectsArmor';
				$effectTypeFieldID = 'ItemID';
				break;
				
			case 'equipment':
				$effectTypeTable = 'EffectsEquipment';
				$effectTypeFieldID = 'ItemID';
				break;
				
			default:
				$returnData['errors'] = 'Select Effect Type';
				echo json_encode($returnData);
				exit;
		}
		//error checking
		if($effectTypeID == '' || $effectTypeID < 0)
		{
			$returnData['errors'] = 'Enter Effect Type ID';
			echo json_encode($returnData);
			exit;
		}
}

if($_SERVER['REQUEST_METHOD'] == 'POST')
{
	$returnData = array();
	$returnData['queries'] = array();
	$returnData['errors'] = 0;

	$action = $_POST['action'];
	
	parse_str($_POST['effectability'], $effectability);
	parse_str($_POST['effectdata'], $effectdata);
	
	parse_str($_POST['effectarea'], $effectAreaData);
	
	parse_str($_POST['effecthpmod']['data'], $effectHPmodData);
	parse_str($_POST['effecthpmod']['dicerollbase'], $effectHPmodBaseDice);
	parse_str($_POST['effecthpmod']['dicerollper'], $effectHPmodDicePer);
	
	parse_str($_POST['effectcondition'], $effectConditionData);
	
	parse_str($_POST['effectattackmod']['data'], $effectAttackModData);
	parse_str($_POST['effectattackmod']['hitdicerollbase'], $HitModDiceRollBase);
	parse_str($_POST['effectattackmod']['hitdicerollper'], $HitModDiceRollPer);
	parse_str($_POST['effectattackmod']['damagedicerollbase'], $DamageModDiceRollBase);
	parse_str($_POST['effectattackmod']['damagedicerollper'], $DamageModDiceRollPer);
	
	parse_str($_POST['effectacmod']['data'], $EffectACModData);
	parse_str($_POST['effectacmod']['acdicerollbase'], $ACModDiceRollBase);
	parse_str($_POST['effectacmod']['acdicerollper'], $ACModDiceRollPer);
	
	parse_str($_POST['effectresistanceimmune'], $EffectResistanceImmuneData);
	
	parse_str($_POST['effectattributemod'], $EffectAttributeModData);
	
	parse_str($_POST['effectskillmod'], $EffectSkillModData);
	
	parse_str($_POST['effectsavemod'], $EffectSaveModData);
	
	parse_str($_POST['effectmovementmod'], $EffectMovementModData);
	
	parse_str($_POST['effectactionmod'], $EffectActionModData);
	
	parse_str($_POST['effectsummon']['data'], $EffectSummon);
	parse_str($_POST['effectsummon']['summoncreatures'], $EffectSummonCreatures);
	parse_str($_POST['effectsummon']['summondicerollbase'], $SummonDiceRollBase);
	
	//-------------------------------------
	
	if($action == 'save-effect')
	{
		$oldEffectID = 0;
		
		//deleting this old effect - should only delete effectid this save is replacing
		if($effectdata['EffectID'] > 0)
		{
			//for multiple options/effects per ability
			$oldEffectID = $effectdata['EffectID'];
			DeleteEffect($link, $effectTypeTable, $oldEffectID);
		}
		
		//if $effectability->AbilityEffectTypeID == 1 then Spell-Like ability, this doesnt have it's own effect, it uses a spell effect
		if($effectability->AbilityEffectTypeID == 1)
		{
			//$returnData['effectability'] = $effectability;
			//$returnData['queries'][] = 
			$query = "DELETE FROM EffectsAbilities WHERE ".$effectTypeFieldID." = ".$effectTypeID;
			if(!$result = mysqli_query($link,$query))
			{
				$returnData['errors'] = mysqli_error($link);
			}
			//$returnData['queries'][] = 
			$query = 
				"INSERT INTO EffectsAbilities "
					."(".$effectTypeFieldID.", EffectID, AbilityEffectTypeID, SpellID, SpellLikeCasterLevel, AbilitySaveDCAttributeModID, AbilitySaveDCMod, AbilitySaveDCFixed, "
					."AbilityPerDayBase, AbilityPerDayAttributeModID, AbilityRoundsPerDayBase, AbilityRoundsPerDayAttributeModID, AbilityRank)"
				."VALUES('".$effectTypeID."', '0', ".$effectability['AbilityEffectTypeID']."', '".$effectability['SpellID']."','".$effectability['SpellLikeCasterLevel']."','"
					.$effectability['AbilitySaveDCAttributeModID']."','".$effectability['AbilitySaveDCMod']."','".$effectability['AbilitySaveDCFixed']
					."','".$effectability['AbilityPerDayBase']."','".$effectability['AbilityPerDayAttributeModID']."','"
					.$effectability['AbilityRoundsPerDayBase']."','".$effectability['AbilityRoundsPerDayAttributeModID'].",'".$effectability['AbilityRank']."')";
			if(!$result = mysqli_query($link,$query))
			{
				$returnData['errors'] = mysqli_error($link);
			}
			$returnData['returnOutput'] = 'Spell-like Ability saved, with SpellID:'.$effectability['SpellID'];
			//end
			mysqli_close($link);
			echo json_encode($returnData);
			exit;
		}
		
		//insert effect (includes animation data)
		//build INSERT STATEMENT
		$fieldsString = '';
		$valuesString = '';
		$effectdataKeys = array_keys($effectdata);
		for($i = 0; $i < count($effectdata); $i++)
		{
			$key = $effectdataKeys[$i];
			if($key != 'EffectID')
			{
				$fieldsString .= $key;
				$valuesString .= "'".$effectdata[$key]."'";
				if($i+1 < count($effectdata))
				{
					$fieldsString .= ',';
					$valuesString .= ',';
				}
			}
		}
		//Effects
		//$returnData['queries'][] = 
		$insertQuery = "INSERT INTO Effects($fieldsString) VALUES ($valuesString)";
		if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
		
		$EffectID = mysqli_insert_id($link);
		
		//Effects*Type*
		//$returnData['count($effectability)'] = count($effectability);
		if(count($effectability) > 1)
		{
			//$returnData['effectability'] = $effectability;
			//$returnData['queries'][] = 
			$query = 
				"INSERT INTO EffectsAbilities "
					."(".$effectTypeFieldID.", EffectID, AbilityEffectTypeID, SpellID, SpellLikeCasterLevel, AbilitySaveDCAttributeModID, AbilitySaveDCMod, AbilitySaveDCFixed, "
					."AbilityPerDayBase, AbilityPerDayAttributeModID, AbilityRoundsPerDayBase, AbilityRoundsPerDayAttributeModID, AbilityRank)"
				."VALUES('".$effectTypeID."', '".$EffectID."', '".$effectability['AbilityEffectTypeID']."', '0','0','"
					.$effectability['AbilitySaveDCAttributeModID']."','".$effectability['AbilitySaveDCMod']."','".$effectability['AbilitySaveDCFixed']
					."','".$effectability['AbilityPerDayBase']."','".$effectability['AbilityPerDayAttributeModID']."','"
					.$effectability['AbilityRoundsPerDayBase']."','".$effectability['AbilityRoundsPerDayAttributeModID']."','".$effectability['AbilityRank']."')";
			if(!$result = mysqli_query($link,$query))
			{
				$returnData['errors'] = mysqli_error($link);
			}
		}
		else
		{
			//$returnData['queries'][] = 
			$insertQuery = "INSERT INTO $effectTypeTable ($effectTypeFieldID, EffectID) VALUES ('$effectTypeID', '$EffectID')";
			if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
		}
		
		$EffectAreaID = 'NULL';
		//IF EffectArea SELECTED
		if($effectAreaData['EffectAreaTypeID'] !== null)
		{
			foreach($effectAreaData['EffectAreaTypeID'] as $i => $value)
			{
				$EffectAreaTypeID = $effectAreaData['EffectAreaTypeID'][$i];
				$EffectAreaSizeBase = $effectAreaData['EffectAreaSizeBase'][$i];
				$EffectAreaSizePer = $effectAreaData['EffectAreaSizePer'][$i];
				//$returnData['queries'][] = 
				$insertQuery = "INSERT INTO EffectArea (EffectID, EffectAreaTypeID, EffectAreaSizeBase, EffectAreaSizePer) VALUES ('$EffectID', '$EffectAreaTypeID', '$EffectAreaSizeBase', '$EffectAreaSizePer')";
				if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
			}
			$EffectAreaID = mysqli_insert_id($link);
		}
		
		$EffectHPModID = 'NULL';
		//$returnData['queries']['effecthpmod data'] = $_POST['effecthpmod']['data'];
		//IF EffectHPMod SELECTED
		if($effectHPmodData['EffectHPModTypeID'] !== null)
		{
			//$returnData['queries']['EffectHPModTypeID'] = $effectHPmodData['EffectHPModTypeID'];
			
			//EffectHPMod
			foreach($effectHPmodData['EffectHPModTypeID'] as $i => $value)
			{
				//EffectHPMod Base Die Roll
				$HPModDiceRollBaseID = 0;
				if(($effectHPmodBaseDice['NumDice'][$i] > 0 && $effectHPmodBaseDice['DieType'][$i] > 0) || $effectHPmodBaseDice['RollMod'][$i] > 0)
				{
					//$returnData['queries'][] = 
					$insertQuery = "INSERT INTO DiceRoll (EffectID, NumDice, DieType, RollMod) VALUES ('$EffectID', '".$effectHPmodBaseDice['NumDice'][$i]."', '".$effectHPmodBaseDice['DieType'][$i]."', '".$effectHPmodBaseDice['RollMod'][$i]."')";
					if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
					$HPModDiceRollBaseID = mysqli_insert_id($link);
				}
				
				//EffectHPMod Die Roll Per
				$HPModDiceRollPerID = 0;
				if(($effectHPmodDicePer['NumDice'][$i] > 0 && $effectHPmodDicePer['DieType'][$i] > 0) || $effectHPmodDicePer['RollMod'][$i] > 0)
				{
					//$returnData['queries'][] = 
					$insertQuery = "INSERT INTO DiceRoll (EffectID, NumDice, DieType, RollMod) VALUES ('$EffectID', '".$effectHPmodDicePer['NumDice'][$i]."', '".$effectHPmodDicePer['DieType'][$i]."', '".$effectHPmodDicePer['RollMod'][$i]."')";
					if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
					$HPModDiceRollPerID = mysqli_insert_id($link);
				}
				
				//EffectHPMod
				$EffectHPModTypeID = $effectHPmodData['EffectHPModTypeID'][$i];
				
				$HPModMaxPerLevel = $effectHPmodData['HPModMaxPerLevel'][$i];
				$HPModPerEveryLevelStart = $effectHPmodData['HPModPerEveryLevelStart'][$i];
				$HPModPerEveryLevelNum = $effectHPmodData['HPModPerEveryLevelNum'][$i];
				//$returnData['queries'][] = 
				$insertQuery = "INSERT INTO EffectHPMod (EffectID, EffectHPModTypeID, HPModDiceRollBaseID, HPModMaxPerLevel, HPModPerEveryLevelStart, HPModPerEveryLevelNum, HPModDiceRollPerID) 
											VALUES ('$EffectID', '$EffectHPModTypeID', '$HPModDiceRollBaseID', '$HPModMaxPerLevel', '$HPModPerEveryLevelStart', '$HPModPerEveryLevelNum', '$HPModDiceRollPerID')";
				if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
			}
			$EffectHPModID = mysqli_insert_id($link);
		}
		//END IF EffectHPMod
		
		$EffectConditionID = 'NULL';
		//IF EffectCondition SELECTED
		if($effectConditionData['EffectConditionTypeID'] !== null)
		{
			foreach($effectConditionData['EffectConditionTypeID'] as $i => $value)
			{
				$EffectConditionTypeID = $effectConditionData['EffectConditionTypeID'][$i];
				$MaxHD = $effectConditionData['MaxHD'][$i];
				//$returnData['queries'][] = 
				$insertQuery = "INSERT INTO EffectCondition (EffectID, EffectConditionTypeID, MaxHD) VALUES ('$EffectID', '$EffectConditionTypeID', '$MaxHD')";
				if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
			}
			$EffectConditionID = mysqli_insert_id($link);
		}
		
		$EffectAttackModID = 'NULL';
		if($effectAttackModData['EffectHPModTypeID'] !== null)
		{
			//$returnData['queries']['EffectHPModTypeID'] = $effectAttackModData['EffectHPModTypeID'];
			
			//EffectAttackMod
			foreach($effectAttackModData['EffectHPModTypeID'] as $i => $value)
			{
				//EffectAttackMod HitModDiceRollBaseID
				$HitModDiceRollBaseID = 0;
				if(($HitModDiceRollBase['NumDice'][$i] > 0 && $HitModDiceRollBase['DieType'][$i] > 0) || $HitModDiceRollBase['RollMod'][$i] != 0)
				{
					//$returnData['queries'][] = 
					$insertQuery = "INSERT INTO DiceRoll (EffectID, NumDice, DieType, RollMod) VALUES ('$EffectID', '".$HitModDiceRollBase['NumDice'][$i]."', '".$HitModDiceRollBase['DieType'][$i]."', '".$HitModDiceRollBase['RollMod'][$i]."')";
					if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
					$HitModDiceRollBaseID = mysqli_insert_id($link);
				}
				
				//EffectAttackMod HitModDiceRollPerID
				$HitModDiceRollPerID = 0;
				if(($HitModDiceRollPer['NumDice'][$i] > 0 && $HitModDiceRollPer['DieType'][$i] > 0) || $HitModDiceRollPer['RollMod'][$i] != 0)
				{
					//$returnData['queries'][] = 
					$insertQuery = "INSERT INTO DiceRoll (EffectID, NumDice, DieType, RollMod) VALUES ('$EffectID', '".$HitModDiceRollPer['NumDice'][$i]."', '".$HitModDiceRollPer['DieType'][$i]."', '".$HitModDiceRollPer['RollMod'][$i]."')";
					if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
					$HitModDiceRollPerID = mysqli_insert_id($link);
				}
				
				//EffectAttackMod DamageModDiceRollBaseID
				$DamageModDiceRollBaseID = 0;
				if(($DamageModDiceRollBase['NumDice'][$i] > 0 && $DamageModDiceRollBase['DieType'][$i] > 0) || $DamageModDiceRollBase['RollMod'][$i] != 0)
				{
					//$returnData['queries'][] = 
					$insertQuery = "INSERT INTO DiceRoll (EffectID, NumDice, DieType, RollMod) VALUES ('$EffectID', '".$DamageModDiceRollBase['NumDice'][$i]."', '".$DamageModDiceRollBase['DieType'][$i]."', '".$DamageModDiceRollBase['RollMod'][$i]."')";
					if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
					$DamageModDiceRollBaseID = mysqli_insert_id($link);
				}
				
				//EffectAttackMod DamageModDiceRollPerID
				$DamageModDiceRollPerID = 0;
				print_r($effectattackmod['damagedicerollper']);
				if(($DamageModDiceRollPer['NumDice'][$i] > 0 && $DamageModDiceRollPer['DieType'][$i] > 0) || $DamageModDiceRollPer['RollMod'][$i] != 0)
				{
					//$returnData['queries'][] = 
					$insertQuery = "INSERT INTO DiceRoll (EffectID, NumDice, DieType, RollMod) VALUES ('$EffectID', '".$DamageModDiceRollPer['NumDice'][$i]."', '".$DamageModDiceRollPer['DieType'][$i]."', '".$DamageModDiceRollPer['RollMod'][$i]."')";
					if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
					$DamageModDiceRollPerID = mysqli_insert_id($link);
				}
				//print_r(effectAttackModData);
				$PassDRTypeID = $effectAttackModData['PassDRTypeID'][$i];
				$PassDRMaxAmount = $effectAttackModData['PassDRMaxAmount'][$i];
				
				$EffectHPModTypeID = $effectAttackModData['EffectHPModTypeID'][$i];
				$HitModAttributeID = $effectAttackModData['HitModAttributeID'][$i];
				$HitModMaxPerLevel = $effectAttackModData['HitModMaxPerLevel'][$i];
				$HitModPerEveryLevelStart = $effectAttackModData['HitModPerEveryLevelStart'][$i];
				$HitModPerEveryLevelNum = $effectAttackModData['HitModPerEveryLevelNum'][$i];
				$DamageModAttributeID = $effectAttackModData['DamageModAttributeID'][$i];
				$DamageModMaxPerLevel = $effectAttackModData['DamageModMaxPerLevel'][$i];
				$DamageModPerEveryLevelStart = $effectAttackModData['DamageModPerEveryLevelStart'][$i];
				$DamageModPerEveryLevelNum = $effectAttackModData['DamageModPerEveryLevelNum'][$i];
				
				//$returnData['queries'][] = 
				$insertQuery = 
					"INSERT INTO EffectAttackMod ".
						"(EffectID, PassDRTypeID, PassDRMaxAmount, EffectHPModTypeID, HitModAttributeID, HitModMaxPerLevel, ".
						"HitModPerEveryLevelStart, HitModPerEveryLevelNum, DamageModAttributeID, DamageModMaxPerLevel, ".
						"DamageModPerEveryLevelStart, DamageModPerEveryLevelNum, ".
						"HitModDiceRollBaseID, HitModDiceRollPerID, DamageModDiceRollBaseID, DamageModDiceRollPerID) ".
					"VALUES ".
						"('$EffectID', '$PassDRTypeID', '$PassDRMaxAmount', '$EffectHPModTypeID', '$HitModAttributeID', '$HitModMaxPerLevel', ".
						"'$HitModPerEveryLevelStart', '$HitModPerEveryLevelNum', '$DamageModAttributeID', '$DamageModMaxPerLevel', ".
						"'$DamageModPerEveryLevelStart', '$DamageModPerEveryLevelNum', ".
						"'$HitModDiceRollBaseID', '$HitModDiceRollPerID', '$DamageModDiceRollBaseID', '$DamageModDiceRollPerID')";
				if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
			}
			$EffectAttackModID = mysqli_insert_id($link);
		}
		//END IF EffectHPMod
		
		//EffectACMod
		$EffectACModID = 'NULL';
		if($EffectACModData['ACModAttributeID'] !== null)
		{
			foreach($EffectACModData['ACModAttributeID'] as $i => $value)
			{
				//ACModDiceRollBaseID
				$ACModDiceRollBaseID = 0;
				if(($ACModDiceRollBase['NumDice'][$i] > 0 && $ACModDiceRollBase['DieType'][$i] > 0) || $ACModDiceRollBase['RollMod'][$i] != 0)
				{
					//$returnData['queries'][] = 
					$insertQuery = "INSERT INTO DiceRoll (EffectID, NumDice, DieType, RollMod) VALUES ('$EffectID', '".$ACModDiceRollBase['NumDice'][$i]."', '".$ACModDiceRollBase['DieType'][$i]."', '".$ACModDiceRollBase['RollMod'][$i]."')";
					if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
					$ACModDiceRollBaseID = mysqli_insert_id($link);
				}
				
				//ACModDiceRollPerID
				$ACModDiceRollPerID = 0;
				if(($ACModDiceRollPer['NumDice'][$i] > 0 && $ACModDiceRollPer['DieType'][$i] > 0) || $ACModDiceRollPer['RollMod'][$i] != 0)
				{
					//$returnData['queries'][] = 
					$insertQuery = "INSERT INTO DiceRoll (EffectID, NumDice, DieType, RollMod) VALUES ('$EffectID', '".$ACModDiceRollPer['NumDice'][$i]."', '".$ACModDiceRollPer['DieType'][$i]."', '".$ACModDiceRollPer['RollMod'][$i]."')";
					if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
					$ACModDiceRollPerID = mysqli_insert_id($link);
				}
				
				$ACModDRTypeID = $EffectACModData['ACModDRTypeID'][$i];
				$ACModDRValue = $EffectACModData['ACModDRValue'][$i];
				$ACModConcealment = $EffectACModData['ACModConcealment'][$i];
				$ACModConcealMinDistance = $EffectACModData['ACModConcealMinDistance'][$i];
				$ACModVsAttackType = $EffectACModData['ACModVsAttackType'][$i];
				$ACModVsDamageType = $EffectACModData['ACModVsDamageType'][$i];
				$ACModVsDirection = $EffectACModData['ACModVsDirection'][$i];
				
				$ACModAttributeID = $EffectACModData['ACModAttributeID'][$i];
				$ACModMaxPerLevel = $EffectACModData['ACModMaxPerLevel'][$i];
				$ACModPerEveryLevelStart = $EffectACModData['ACModPerEveryLevelStart'][$i];
				$ACModPerEveryLevelNum = $EffectACModData['ACModPerEveryLevelNum'][$i];
				
				$returnData['queries'][] = 
				$insertQuery = 
					"INSERT INTO EffectACMod ".
						"(EffectID, ACModDRTypeID, ACModDRValue, ACModConcealment, ACModConcealMinDistance, ACModVsAttackType, ACModVsDamageType, ACModVsDirection, ".
						"ACModAttributeID, ACModMaxPerLevel, ".
						"ACModPerEveryLevelStart, ACModPerEveryLevelNum, ".
						"ACModDiceRollBaseID, ACModDiceRollPerID) ".
					"VALUES ".
						"('$EffectID', '$ACModDRTypeID', '$ACModDRValue', '$ACModConcealment', '$ACModConcealMinDistance', '$ACModVsAttackType', '$ACModVsDamageType', '$ACModVsDirection', ".
						"'$ACModAttributeID', '$ACModMaxPerLevel', ".
						"'$ACModPerEveryLevelStart', '$ACModPerEveryLevelNum', ".
						"'$ACModDiceRollBaseID', '$ACModDiceRollPerID')";
				if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
			}
			$EffectACModID = mysqli_insert_id($link);
		}
		
		$EffectResistanceImmuneID = 'NULL';
		if($EffectResistanceImmuneData['EffectHPModTypeID'] !== null)
		{
			foreach($EffectResistanceImmuneData['EffectHPModTypeID'] as $i => $value)
			{
				$EffectHPModTypeID = $EffectResistanceImmuneData['EffectHPModTypeID'][$i];
				$EffectConditionTypeID = $EffectResistanceImmuneData['EffectConditionTypeID'][$i];
				$EffectSpellSchoolTypeID = $EffectResistanceImmuneData['EffectSpellSchoolTypeID'][$i];
				$EffectSpellLevel = $EffectResistanceImmuneData['EffectSpellLevel'][$i];
				$SpellID = $EffectResistanceImmuneData['SpellID'][$i];
				$IsImmune = $EffectResistanceImmuneData['IsImmune'][$i];
				$ResistanceMod = $EffectResistanceImmuneData['ResistanceMod'][$i];
				//$returnData['queries'][] = 
				$insertQuery = "INSERT INTO EffectResistanceImmune (EffectID, EffectHPModTypeID, EffectConditionTypeID, EffectSpellSchoolTypeID, EffectSpellLevel, SpellID, IsImmune, ResistanceMod) VALUES ('$EffectID', '$EffectHPModTypeID', '$EffectConditionTypeID', '$EffectSpellSchoolTypeID', '$EffectSpellLevel', '$SpellID', '$IsImmune', '$ResistanceMod')";
				if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
			}
			$EffectResistanceImmuneID = mysqli_insert_id($link);
		}
		
		$EffectAttributeModID = 'NULL';
		if($EffectAttributeModData['AttributeID'] !== null)
		{
			foreach($EffectAttributeModData['AttributeID'] as $i => $value)
			{
				$AttributeID = $EffectAttributeModData['AttributeID'][$i];
				//can olny set IsAllAttributes on the first ability mod entered, otherwise the checkbox array values are out of order
				$IsAllAttributes = isset($EffectAttributeModData['IsAllAttributes'][$i])?1:0;
				$Mod = $EffectAttributeModData['Mod'][$i];
				//$returnData['queries'][] = 
				//'Mod' is a mysql keyword!
				$insertQuery = "INSERT INTO EffectAttributeMod (EffectID, AttributeID, IsAllAttributes, EffectAttributeMod.Mod) VALUES ('$EffectID', '$AttributeID', '$IsAllAttributes', '$Mod')";
				if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
			}
			$EffectAttributeModID = mysqli_insert_id($link);
		}
		
		$EffectSkillModID = 'NULL';
		if($EffectSkillModData['SkillID'] !== null)
		{
			//EffectAttributeMod
			foreach($EffectSkillModData['SkillID'] as $i => $value)
			{
				$SkillID = $EffectSkillModData['SkillID'][$i];
				//can olny set IsAllSkills on the first ability mod entered, otherwise the checkbox array values are out of order
				$IsAllSkills = isset($EffectSkillModData['IsAllSkills'][$i])?1:0;
				$SkillMod = $EffectSkillModData['SkillMod'][$i];
				//$returnData['queries'][] = 
				$insertQuery = "INSERT INTO EffectSkillMod (EffectID, SkillID, IsAllSkills, SkillMod) VALUES ('$EffectID', '$SkillID', '$IsAllSkills', '$SkillMod')";
				if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
			}
			$EffectSkillModID = mysqli_insert_id($link);
		}
		
		$EffectSaveModID = 'NULL';
		if($EffectSaveModData['SaveID'] !== null)
		{
			foreach($EffectSaveModData['SaveID'] as $i => $value)
			{
				$SaveID = $EffectSaveModData['SaveID'][$i];
				//can olny set IsAllSaves on the first ability mod entered, otherwise the checkbox array values are out of order
				$IsAllSaves = isset($EffectSaveModData['IsAllSaves'][$i])?1:0;
				$SaveModAttributeID = $EffectSaveModData['SaveModAttributeID'][$i];
				$SaveMod = $EffectSaveModData['SaveMod'][$i];
				//$returnData['queries'][] = 
				$insertQuery = "INSERT INTO EffectSaveMod (EffectID, SaveID, IsAllSaves, SaveModAttributeID, SaveMod) VALUES ('$EffectID', '$SaveID', '$IsAllSaves', '$SaveModAttributeID', '$SaveMod')";
				if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
			}
			$EffectSaveModID = mysqli_insert_id($link);
		}
		
		$EffectMovementModID = 'NULL';
		if($EffectMovementModData['MovementMod'] !== null)
		{
			foreach($EffectMovementModData['MovementMod'] as $i => $value)
			{
				$MovementMod = $EffectMovementModData['MovementMod'][$i];
				$MoveTypeID = $EffectMovementModData['MoveTypeID'][$i];
				$IsIgnoreTerrain = isset($EffectMovementModData['IsIgnoreTerrain'][$i])?1:0;
				$IsIgnoreMedArmor = isset($EffectMovementModData['IsIgnoreMedArmor'][$i])?1:0;
				$IsIgnoreHeavyArmor = isset($EffectMovementModData['IsIgnoreHeavyArmor'][$i])?1:0;
				$IsJumpRunningStart = isset($EffectMovementModData['IsJumpRunningStart'][$i])?1:0;
				//$returnData['queries'][] = 
				$insertQuery = "INSERT INTO EffectMovementMod (EffectID, MovementMod, MoveTypeID, IsIgnoreTerrain, IsIgnoreMedArmor, IsIgnoreHeavyArmor, IsJumpRunningStart) 
					VALUES ('$EffectID', '$MovementMod', '$MoveTypeID', '$IsIgnoreTerrain', '$IsIgnoreMedArmor', '$IsIgnoreHeavyArmor', '$IsJumpRunningStart')";
				if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
			}
			$EffectMovementModID = mysqli_insert_id($link);
		}
		
		$EffectActionModID = 'NULL';
		if($EffectActionModData['ActionMod'] !== null)
		{
			foreach($EffectActionModData['ActionMod'] as $i => $value)
			{
				$ActionMod = $EffectActionModData['ActionMod'][$i];
				//$returnData['queries'][] = 
				$insertQuery = "INSERT INTO EffectActionMod (EffectID, ActionMod) VALUES ('$EffectID', '$ActionMod')";
				if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
			}
			$EffectActionModID = mysqli_insert_id($link);
		}
		
		//EffectSummon - EffectSummonCreatures
		$EffectSummonID = 'NULL';
		if($EffectSummonCreatures['SummonSuccessChance'] !== null)
		{
			$IsPolymorph = isset($EffectSummon['IsPolymorph']) ? 1 : 0;
			$IsFamiliar = isset($EffectSummon['IsFamiliar']) ? 1 : 0;
			$returnData['queries'][] = 
			$insertQuery = "INSERT INTO EffectSummon (EffectID, IsPolymorph, IsFamiliar) VALUES ('$EffectID', $IsPolymorph, $IsFamiliar)";
			if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
			$EffectSummonID = mysqli_insert_id($link);
			
			foreach($EffectSummonCreatures['SummonSuccessChance'] as $i => $value)
			{
				//EffectSummon SummonDiceRollBaseID
				$SummonDiceRollBaseID = 0;
				if(($SummonDiceRollBase['NumDice'][$i] > 0 && $SummonDiceRollBase['DieType'][$i] > 0) || $SummonDiceRollBase['RollMod'][$i] != 0)
				{
					//$returnData['queries'][] = 
					$insertQuery = "INSERT INTO DiceRoll (EffectID, NumDice, DieType, RollMod) VALUES ('$EffectID', '".$SummonDiceRollBase['NumDice'][$i]."', '".$SummonDiceRollBase['DieType'][$i]."', '".$SummonDiceRollBase['RollMod'][$i]."')";
					if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
					$SummonDiceRollBaseID = mysqli_insert_id($link);
				}
				$SummonSuccessChance = $EffectSummonCreatures['SummonSuccessChance'][$i];
				$CreatureCharacterID = $EffectSummonCreatures['CreatureCharacterID'][$i];
				//$returnData['queries'][] = 
				$insertQuery = "INSERT INTO EffectSummonCreatures (EffectSummonID, EffectID, SummonSuccessChance, CreatureCharacterID, SummonDiceRollBaseID) VALUES ('$EffectSummonID', '$EffectID', '$SummonSuccessChance', '$CreatureCharacterID', '$SummonDiceRollBaseID')";
				if(!$result = mysqli_query($link,$insertQuery)) $returnData['errors'] = mysqli_error($link);
			}
			$EffectSummonID = mysqli_insert_id($link);
		}
		
		//update references in Effects entry
		//EffectAreaID
		$updateQuery = "UPDATE Effects SET EffectAreaID = $EffectAreaID WHERE EffectID = $EffectID";
		if(!$result = mysqli_query($link,$updateQuery)) $returnData['errors'] = mysqli_error($link);
		//EffectHPModID
		$updateQuery = "UPDATE Effects SET EffectHPModID = $EffectHPModID WHERE EffectID = $EffectID";
		if(!$result = mysqli_query($link,$updateQuery)) $returnData['errors'] = mysqli_error($link);
		//EffectConditionID
		$updateQuery = "UPDATE Effects SET EffectConditionID = $EffectConditionID WHERE EffectID = $EffectID";
		if(!$result = mysqli_query($link,$updateQuery)) $returnData['errors'] = mysqli_error($link);
		//EffectAttackModID
		$updateQuery = "UPDATE Effects SET EffectAttackModID = $EffectAttackModID WHERE EffectID = $EffectID";
		if(!$result = mysqli_query($link,$updateQuery)) $returnData['errors'] = mysqli_error($link);
		//EffectACModID
		$updateQuery = "UPDATE Effects SET EffectACModID = $EffectACModID WHERE EffectID = $EffectID";
		if(!$result = mysqli_query($link,$updateQuery)) $returnData['errors'] = mysqli_error($link);
		//EffectResistanceImmuneID
		$updateQuery = "UPDATE Effects SET EffectResistanceImmuneID = $EffectResistanceImmuneID WHERE EffectID = $EffectID";
		if(!$result = mysqli_query($link,$updateQuery)) $returnData['errors'] = mysqli_error($link);
		//EffectAttributeModID
		$updateQuery = "UPDATE Effects SET EffectAttributeModID = $EffectAttributeModID WHERE EffectID = $EffectID";
		if(!$result = mysqli_query($link,$updateQuery)) $returnData['errors'] = mysqli_error($link);
		//EffectSkillModID
		$updateQuery = "UPDATE Effects SET EffectSkillModID = $EffectSkillModID WHERE EffectID = $EffectID";
		if(!$result = mysqli_query($link,$updateQuery)) $returnData['errors'] = mysqli_error($link);
		//EffectSaveModID
		$updateQuery = "UPDATE Effects SET EffectSaveModID = $EffectSaveModID WHERE EffectID = $EffectID";
		if(!$result = mysqli_query($link,$updateQuery)) $returnData['errors'] = mysqli_error($link);
		//EffectMovementModID
		$updateQuery = "UPDATE Effects SET EffectMovementModID = $EffectMovementModID WHERE EffectID = $EffectID";
		if(!$result = mysqli_query($link,$updateQuery)) $returnData['errors'] = mysqli_error($link);
		//EffectActionModID
		$updateQuery = "UPDATE Effects SET EffectActionModID = $EffectActionModID WHERE EffectID = $EffectID";
		if(!$result = mysqli_query($link,$updateQuery)) $returnData['errors'] = mysqli_error($link);
		//EffectSummonID
		$updateQuery = "UPDATE Effects SET EffectSummonID = $EffectSummonID WHERE EffectID = $EffectID";
		if(!$result = mysqli_query($link,$updateQuery)) $returnData['errors'] = mysqli_error($link);
		
		//update PlayerCharacterSelectedClassAbilities & CharacterEffect from oldEffectID to new EffectID
		if($oldEffectID)
		{
			$query = "UPDATE PlayerCharacterSelectedClassAbilities SET EffectID = ".$EffectID." WHERE EffectID = ".$oldEffectID;
			$result = mysqli_query($link,$query);
			$query = "UPDATE CharacterEffects SET EffectID = ".$EffectID." WHERE EffectID = ".$oldEffectID;
			$result = mysqli_query($link,$query);
		}
		$returnData['returnOutput'] = 'Effect saved';
	}
	//-------------------------------------
	
	//end
	mysqli_close($link);
	$returnData['EffectID'] = $EffectID;
	echo json_encode($returnData);
	exit;
}

//INITIAL LOAD, load saved effect if is one
elseif(isset($_REQUEST['effecttype']))
{
	//effect_query_funciton
	include_once("./php/character_ability_effect_query_funciton.php"); 
	//echo($effectTypeTable.' '.$effectTypeFieldID.' '.$effectTypeID.'<br/>');
	
	//search to begin editing current effect
	$ability_effect = EffectQuery($link, $effectTypeTable, $effectTypeFieldID, $effectTypeID, $abilityRank);
	
	$multiple_effects_icon = array();
	$multiple_effects_id = array();
	
	if($ability_effect != 0)
	{
		for($i=0; $i<count($ability_effect); $i++)
		{
			$multiple_effects_icon[] = $ability_effect[$i]->EffectIconName;
			$multiple_effects_id[] = $ability_effect[$i]->EffectID;
		}
		
		//if editing a multiple effect
		$effect_index = isset($_REQUEST['effectindex'])?$_REQUEST['effectindex']:0;
		
		$ability_effect = $ability_effect[$effect_index];
	}
	
	if(isset($_REQUEST['newmultiple']))
	{
		//reset effect to create a new one
		$ability_effect = new stdClass();
		$ability_effect->EffectArea = array();
		$ability_effect->EffectHPMod = array();
		$ability_effect->EffectCondition = array();
		$ability_effect->EffectAttackMod = array();
		$ability_effect->EffectACMod = array();
		$ability_effect->EffectResistanceImmune = array();
		$ability_effect->EffectAttributeMod = array();
		$ability_effect->EffectSkillMod = array();
		$ability_effect->EffectSaveMod = array();
		$ability_effect->EffectMovementMod = array();
		$ability_effect->EffectActionMod = array();
		$ability_effect->EffectSummon = array();
	}
}

//is this page is being loaded up on it's own, outside of the game html page
if(isset($_GET['test']))
{
	//for include the JS files and intial setup of animation controllers
	$test = true;
}

function CreateFormInput($ability_effect_data, $fieldname, $defaultValue, $isInputArray=false)
{
	//select boxes
	if($fieldname == 'TargetsCreatureTypeID' || $fieldname == 'TargetsCreatureSubTypeID' || $fieldname == 'OnlyEffectsCreatureTypeID' 
		|| $fieldname == 'OnlyEffectsCreatureSubTypeID' || $fieldname == 'AppliesVsCreatureTypeID' || $fieldname == 'AppliesVsCreatureSubTypeID' 
		|| $fieldname == 'ActionTypeID' || $fieldname == 'EffectModTypeID' || $fieldname == 'EffectHPModTypeID' || $fieldname == 'EffectsTargetsID' 
		|| $fieldname == 'TargetTypeID' || $fieldname == 'HitType' || $fieldname == 'AbilityEffectTypeID' || $fieldname == 'MoveTypeID')
	{
		CreateSelectbox($ability_effect_data, $fieldname, $isInputArray);
	}
	//unused
	elseif($fieldname == 'EffectIconName' || $fieldname == 'SaveEffect' || $fieldname == 'SpecialSaveEffectID' 
		|| $fieldname == 'EffectMovementType' || $fieldname == 'EffectMovementRate')//these are for effects that have a duration and moves around
	{
		//do nothing
	}
	//hidden select boxes
	elseif($fieldname == 'SaveID')
	{
		echo'<div class="'.($ability_effect_data->IsAllowSave?'':'hide').'" id="toggle-isallowsave">';
		CreateSelectbox($ability_effect_data, $fieldname, $isInputArray);
		echo'</div>';
	}
	//text input box
	else
	{
		echo($fieldname.': <input type="text" id="'.$fieldname.'" name="'.$fieldname.($isInputArray?'[]':'').'" value="');
		echo(($ability_effect_data->{$fieldname} != '')?$ability_effect_data->{$fieldname}:$defaultValue);
		echo('"/><br/>');
	}
}

function CreateCheckbox($ability_effect_data, $fieldname, $isInputArray=false)
{
	echo('['.$fieldname.': <input class="toggle-check" data-toggle-id="'.strToLower($fieldname).'" type="checkbox" value="1" ');
	echo($ability_effect_data->{$fieldname} == 1)?'checked="checked"':'';
	echo(' id="'.$fieldname.'" name="'.$fieldname.($isInputArray?'[]':'').'" ');
	echo('/>] ');
}

function CreateSelectbox($ability_effect_data, $fieldname, $isInputArray=false)
{
	if($fieldname == 'AbilityEffectTypeID')
	{
		echo($fieldname.': <select id="'.$fieldname.'" name="'.$fieldname.($isInputArray?'[]':'').'">');
		echo('<option value="0" '.($ability_effect_data->AbilityEffectTypeID=='0'?'selected="selected"':'').'>Extraordinary</option>'.
			'<option value="1" '.($ability_effect_data->AbilityEffectTypeID=='1'?'selected="selected"':'').'>Spell-Like</option>'.
			'<option value="2" '.($ability_effect_data->AbilityEffectTypeID=='2'?'selected="selected"':'').'>Supernatural</option>');
		echo('</select><br/>');
	}
	if($fieldname == 'TargetTypeID')
	{
		echo($fieldname.': <select id="'.$fieldname.'" name="'.$fieldname.($isInputArray?'[]':'').'">');
		echo('<option value="0" '.($ability_effect_data->TargetTypeID=='0'?'selected="selected"':'').'>Self</option>'.
			'<option value="1" '.($ability_effect_data==0 || $ability_effect_data->TargetTypeID=='1'?'selected="selected"':'').'>Target creature(s)</option>'.
			//'<option value="2" '.($ability_effect_data->TargetTypeID=='2'?'selected="selected"':'').'>Humanoid Only</option>'.
			'<option value="3" '.($ability_effect_data->TargetTypeID=='3'?'selected="selected"':'').'>Target location</option>'.
			'<option value="4" '.($ability_effect_data->TargetTypeID=='4'?'selected="selected"':'').'>Weapon</option>'.
			'<option value="5" '.($ability_effect_data->TargetTypeID=='5'?'selected="selected"':'').'>Armor/Shield</option>');
		echo('</select><br/>');
	}
	elseif($fieldname == 'HitType')
	{
		echo($fieldname.': <select id="'.$fieldname.'" name="'.$fieldname.($isInputArray?'[]':'').'">');
		echo('<option value="0" '.($ability_effect_data->HitType=='0'?'selected="selected"':'').'>Automatic hit</option>'.
			'<option value="1" '.($ability_effect_data->HitType=='1'?'selected="selected"':'').'>Ranged attack</option>'.
			'<option value="2" '.($ability_effect_data->HitType=='2'?'selected="selected"':'').'>Ranged touch attack</option>'.
			'<option value="3" '.($ability_effect_data->HitType=='3'?'selected="selected"':'').'>Melee attack</option>'.
			'<option value="4" '.($ability_effect_data->HitType=='4'?'selected="selected"':'').'>Touch attack</option>'.
			'<option value="5" '.($ability_effect_data->HitType=='5'?'selected="selected"':'').'>Grapple</option>');
		echo('</select><br/>');
	}
	elseif($fieldname == 'EffectAreaTypeID')
	{
		echo($fieldname.': <select id="'.$fieldname.'" name="'.$fieldname.($isInputArray?'[]':'').'">');
		echo('<option value="0" '.($ability_effect_data->EffectAreaTypeID=='0'?'selected="selected"':'').'>Select area type</option>'.
			'<option value="1" '.($ability_effect_data->EffectAreaTypeID=='1'?'selected="selected"':'').'>Line</option>'.
			'<option value="2" '.($ability_effect_data->EffectAreaTypeID=='2'?'selected="selected"':'').'>Cone</option>'.
			'<option value="3" '.($ability_effect_data->EffectAreaTypeID=='3'?'selected="selected"':'').'>Burst</option>');
		echo('</select><br/>');
	}
	elseif($fieldname == 'EffectTypeID')
	{
		echo($fieldname.': <select id="'.$fieldname.'" name="'.$fieldname.($isInputArray?'[]':'').'">');
		echo('<option value="0" '.($ability_effect_data->EffectTypeID=='0'?'selected="selected"':'').'>none</option>'.
			'<option value="1" '.($ability_effect_data->EffectTypeID=='1'?'selected="selected"':'').'>Supernatural</option>'.
			'<option value="2" '.($ability_effect_data->EffectTypeID=='2'?'selected="selected"':'').'>Cone</option>'.
			'<option value="3" '.($ability_effect_data->EffectTypeID=='3'?'selected="selected"':'').'>Burst</option>');
		echo('</select><br/>');
	}
	
	elseif($fieldname == 'PassDRTypeID' || $fieldname == 'ACModDRTypeID')
	{
		echo($fieldname.': <select id="'.$fieldname.'" name="'.$fieldname.($isInputArray?'[]':'').'">');
		echo '<option value="-1">Select</option>';
		
		if($fieldname == 'PassDRTypeID') echo '<option value="0" '.($ability_effect_data->PassDRTypeID=='0'?'selected="selected"':'').'>Pass all DR</option>';
		else echo '<option value="0" '.($ability_effect_data->{$fieldname}=='0'?'selected="selected"':'').'>Vs. all damage</option>';
		
		echo '<option value="1" '.($ability_effect_data->{$fieldname}=='1'?'selected="selected"':'').'>Cold Iron</option>'.
			'<option value="2" '.($ability_effect_data->{$fieldname}=='2'?'selected="selected"':'').'>Silver</option>'.
			'<option value="3" '.($ability_effect_data->{$fieldname}=='3'?'selected="selected"':'').'>Adamantine</option>'.
			'<option value="4" '.($ability_effect_data->{$fieldname}=='4'?'selected="selected"':'').'>Good</option>'.
			'<option value="5" '.($ability_effect_data->{$fieldname}=='5'?'selected="selected"':'').'>Evil</option>'.
			'<option value="6" '.($ability_effect_data->{$fieldname}=='6'?'selected="selected"':'').'>Lawful</option>'.
			'<option value="7" '.($ability_effect_data->{$fieldname}=='7'?'selected="selected"':'').'>Chaotic</option>';
		echo('</select><br/>');
	}
	
	elseif($fieldname == 'ACModVsAttackType')
	{
		echo($fieldname.': <select id="'.$fieldname.'" name="'.$fieldname.($isInputArray?'[]':'').'">');
		echo '<option value="0">Select</option>'.
			'<option value="1" '.($ability_effect_data->ACModVsAttackType=='1'?'selected="selected"':'').'>Melee</option>'.
			'<option value="2" '.($ability_effect_data->ACModVsAttackType=='2'?'selected="selected"':'').'>Ranged</option>'.
			'<option value="3" '.($ability_effect_data->ACModVsAttackType=='3'?'selected="selected"':'').'>Area of Effect</option>';
		echo('</select><br/>');
	}
	
	elseif($fieldname == 'ACModVsDamageType')
	{
		echo($fieldname.': <select id="'.$fieldname.'" name="'.$fieldname.($isInputArray?'[]':'').'">');
		echo '<option value="0">Select</option>'.
			'<option value="1" '.($ability_effect_data->ACModVsDamageType=='1'?'selected="selected"':'').'>Slashing</option>'.
			'<option value="2" '.($ability_effect_data->ACModVsDamageType=='2'?'selected="selected"':'').'>Piercing</option>'.
			'<option value="3" '.($ability_effect_data->ACModVsDamageType=='3'?'selected="selected"':'').'>Bludgeoning</option>';
		echo('</select><br/>');
	}
	
	elseif($fieldname == 'ACModVsDirection')
	{
		echo($fieldname.': <select id="'.$fieldname.'" name="'.$fieldname.($isInputArray?'[]':'').'">');
		echo '<option value="0">Vs. all directions</option>'.
			'<option value="1" '.($ability_effect_data->ACModVsDirection=='1'?'selected="selected"':'').'>Only vs. front</option>'.
			'<option value="2" '.($ability_effect_data->ACModVsDirection=='2'?'selected="selected"':'').'>Only vs. back</option>';
		echo('</select><br/>');
	}
	
	elseif($fieldname == 'EffectsTargetsID')
	{
		echo($fieldname.': <select id="'.$fieldname.'" name="'.$fieldname.($isInputArray?'[]':'').'">');
		echo('<option value="0" '.($ability_effect_data->EffectsTargetsID=='0'?'selected="selected"':'').'>All targets</option>'.
			'<option value="1" '.($ability_effect_data->EffectsTargetsID=='1'?'selected="selected"':'').'>Only Allies</option>'.
			'<option value="2" '.($ability_effect_data->EffectsTargetsID=='2'?'selected="selected"':'').'>Only Enemies</option>');
		echo('</select><br/>');
	}
	
	elseif($fieldname == 'MoveTypeID')
	{
		echo($fieldname.': <select id="'.$fieldname.'" name="'.$fieldname.($isInputArray?'[]':'').'">');
		echo('<option value="0" '.($ability_effect_data->MoveTypeID=='0'?'selected="selected"':'').'>Move</option>'.
			'<option value="1" '.($ability_effect_data->MoveTypeID=='1'?'selected="selected"':'').'>Swim</option>'.
			'<option value="2" '.($ability_effect_data->MoveTypeID=='2'?'selected="selected"':'').'>Fly</option>');
		echo('</select><br/>');
	}
	
	if($fieldname == 'TargetsCreatureTypeID' || $fieldname == 'OnlyEffectsCreatureTypeID' || $fieldname == 'AppliesVsCreatureTypeID')
	{
		$dbFieldname = 'CreatureTypeID';
		GenerateSelectboxFromDB('CreatureTypes', $dbFieldname, 'TypeName', $ability_effect_data->{$fieldname}, $isInputArray, $fieldname);
	}
	elseif($fieldname == 'TargetsCreatureSubTypeID' || $fieldname == 'OnlyEffectsCreatureSubTypeID' || $fieldname == 'AppliesVsCreatureSubTypeID')
	{
		$dbFieldname = 'CreatureSubTypeID';
		GenerateSelectboxFromDB('CreatureSubTypes', $dbFieldname, 'TypeName', $ability_effect_data->{$fieldname}, $isInputArray, $fieldname);
	}
	elseif($fieldname == 'TargetsCreatureSubTypeID' || $fieldname == 'OnlyEffectsCreatureSubTypeID')
	{
		$dbFieldname = 'CreatureSubTypeID';
		GenerateSelectboxFromDB('CreatureSubTypes', $dbFieldname, 'TypeName', $ability_effect_data->{$fieldname}, $isInputArray, $fieldname);
	}
	elseif($fieldname == 'SaveID')
	{
		GenerateSelectboxFromDB('Saves', $fieldname, 'SaveName', $ability_effect_data->{$fieldname}, $isInputArray);
	}
	elseif($fieldname == 'ActionTypeID')
	{
		//3 is the default action type, standard action
		GenerateSelectboxFromDB('ActionType', $fieldname, 'ActionTypeName', ($ability_effect_data == 0)?3:$ability_effect_data->{$fieldname}, $isInputArray);
	}
	elseif($fieldname == 'EffectConditionTypeID')
	{
		GenerateSelectboxFromDB('EffectConditionType', $fieldname, 'ConditionName', $ability_effect_data->{$fieldname}, $isInputArray);
	}
	elseif($fieldname == 'AttributeID')
	{
		GenerateSelectboxFromDB('Attributes', $fieldname, 'AttributeName', $ability_effect_data->{$fieldname}, $isInputArray);
	}
	elseif($fieldname == 'EffectHPModTypeID')
	{
		GenerateSelectboxFromDB('EffectHPModType', $fieldname, 'HPModName', $ability_effect_data->{$fieldname}, $isInputArray);
	}
	elseif($fieldname == 'EffectModTypeID')
	{
		GenerateSelectboxFromDB('EffectModType', $fieldname, 'ModTypeName', $ability_effect_data->{$fieldname}, $isInputArray);
	}
}

function GenerateSelectboxFromDB($tableName, $fieldID, $fieldName, $default, $isInputArray=false, $alternateName='')
{
	$alternateName = $alternateName==''?$fieldID:$alternateName;
	$local_link = dbConnect();
	$query = "SELECT * FROM $tableName";
	$result = mysqli_query($local_link, $query);
	$noSelectionID = 0;
	if($tableName == 'EffectModType' && $default == 0) $default = 8;//8 = 'Inherant', stacks
	$html = '';
	while($row = mysqli_fetch_object($result))
	{
		//if first row value starts at a value of 0, make the default -1 (should have started everything at 1 like auto inc.)
		if($row->{$fieldID} == 0) $noSelectionID = -1;
		$html .= '<option value="'.$row->{$fieldID}.'" '.($row->{$fieldID}==$default?'selected="selected"':'').'>'.$row->{$fieldName}.($row->{$fieldName}=='Inherent'?' (stackable)':'').'</option>';
	}
	echo $alternateName.': <select id="'.$alternateName.'" name="'.$alternateName.($isInputArray?'[]':'').'">'
		.'<option value="'.$noSelectionID.'">select</option>'.$html
		.'</select><br/>';
	mysqli_close($local_link);
}

function CreateSubform($fieldname)
{
	$buttonName = str_replace('Effect','',$fieldname);
	$buttonName = str_replace('ID','',$buttonName);
	$buttonName = str_replace('Mod',' Mod',$buttonName);
	$buttonName = str_replace('AC Mod','Defence Mod',$buttonName);
	$buttonName = str_replace('Area','Area of Effect',$buttonName);
	echo('<div class="go-button" onclick="EffectController.AddSubForm(\''.strToLower($fieldname).'\');">'.$buttonName.'</div>');
}

?>

<?php if(isset($test)) { ?>
<script src="./js/jquery-2.1.3.min.js"></script>
<script src="./js/jscolor/jscolor.js"></script>
<script src="./js/effect_controller.js"></script>
<script src="./js/sprite_anim_controller.js"></script>
<script src="./js/canvas_effect_anim_controller.js"></script>
<?php } ?>

<div>
	<span class="menu-button" data-show-id="main-frm">Main Form</span>
	<span class="menu-button" data-show-id="select-icon">Select Icon</span>
	<span class="menu-button" data-show-id="select-anim">Animation</span>
	<?php if(isset($spell_description)){ ?>
	<span class="menu-button" data-show-id="spell-description">Spell Description</span>
	<?php } ?>
</div>

<hr/>

<h1><?php echo $title; ?></h1>

<hr/>

<form id="frm-effect-multiple">
	<?php
		echo 'EffectID: <span class="EffectID">'.($ability_effect->EffectID>0?$ability_effect->EffectID:0).'</span></br>';
		
		echo('<br/>');
		if($ability_effect != 0)
		{
			for($i=0; $i<count($multiple_effects_icon); $i++)
			{
				echo '<img src="./images/'.($multiple_effects_icon[$i] != ''? $multiple_effects_icon[$i]: 'battle_icons/spells/default.png').'"';
				
				echo ($effect_index != $i?' onclick="EffectController.EditMultipleEffect(\''.$title.'\',\''.$effectType.'\','.$effectTypeID.','.$abilityRank.','.$i.');" class="go-button"':' style="border-radius:5px; padding:5px;  display:inline-block; margin:5px;"');
				
				echo '/>';
			}
			
			//
			echo '<br/>';
			echo('[Has Multiple Effects: <input class="toggle-check" data-toggle-id="multiple_effects" type="checkbox" value="1" ');
			echo(count($multiple_effects_icon) > 1 || $ability_effect->IsMultipleEffectOptions == 1 || $ability_effect->IsChooseClassAbility == 1)?'checked="checked"':'';
			echo('/>] ');
		}
	?>
</form>

<hr/>

<form id="frm-effect-type">
	Type: 
		<select id="effect-type" name="effect-type">
			<!--<option value="-1">No Save</option>-->
			<option value="0">Select Effect Type</option>
			<option value="spells" <?php echo (isset($effectType) && $effectType=='spells')?'selected="selected"':''; ?>>Spells</option>
			<option value="feat" <?php echo (isset($effectType) && $effectType=='feat')?'selected="selected"':''; ?>>Feat</option>
			<option value="ability" <?php echo (isset($effectType) && $effectType=='ability')?'selected="selected"':''; ?>>Special Ability</option>
			<option value="special" <?php echo (isset($effectType) && $effectType=='special')?'selected="selected"':''; ?>>Uncategorised Ability</option>
			<option value="weapon" <?php echo (isset($effectType) && $effectType=='weapon')?'selected="selected"':''; ?>>weapon</option>
			<option value="armor" <?php echo (isset($effectType) && $effectType=='armor')?'selected="selected"':''; ?>>armor</option>
			<option value="equipment" <?php echo (isset($effectType) && $effectType=='equipment')?'selected="selected"':''; ?>>equipment</option>
		</select>
	ID: <input type="text" id="effect-type-id" name="effect-type-id" value="<?php echo (isset($effectTypeID))?$effectTypeID:'-1'; ?>"/>
</form>

<form id="frm-effects-abilities" style="<?php echo (isset($effectType) && ($effectType!='ability' && $effectType!='special' && $effectType!='weapon' && $effectType!='armor' && $effectType!='equipment'))?'display:none;':''; ?>">
	<hr/>
	<?php
		CreateFormInput($ability_effect, 'AbilityEffectTypeID', 0);
	?>
	<div class="hide" id="Spell-Like" class="<?php echo $ability_effect->AbilityEffectTypeID!=1?'':'hide'; ?>"><hr/>
	SELECT SPELL
	<?php
		CreateFormInput($ability_effect, 'SpellID', 0);
		CreateFormInput($ability_effect, 'SpellLikeCasterLevel', 0);
	?>
	<hr/></div>
	
	<?php 
		//for class abilities, need to save the rank
		if($abilityRank) CreateFormInput($ability_effect, 'AbilityRank', $abilityRank);
		GenerateSelectboxFromDB('Attributes', 'AttributeID', 'AttributeName', $ability_effect?$ability_effect->AbilitySaveDCAttributeModID:-1, false, 'AbilitySaveDCAttributeModID');
		CreateFormInput($ability_effect, 'AbilitySaveDCMod', 0);
		CreateFormInput($ability_effect, 'AbilitySaveDCFixed', 0);
		CreateFormInput($ability_effect, 'AbilityPerDayBase', 0);
		GenerateSelectboxFromDB('Attributes', 'AttributeID', 'AttributeName', $ability_effect?$ability_effect->AbilityPerDayAttributeModID:-1, false, 'AbilityPerDayAttributeModID');
		CreateFormInput($ability_effect, 'AbilityRoundsPerDayBase', 0);
		GenerateSelectboxFromDB('Attributes', 'AttributeID', 'AttributeName', $ability_effect?$ability_effect->AbilityRoundsPerDayAttributeModID:-1, false, 'AbilityRoundsPerDayAttributeModID');
	?>
</form>

<hr/>

<?php if(isset($spell_description)){ ?>
<div id="spell-description" class="toggle-menu" style="display:none;">
	<?php echo $spell_description; ?>
</div>
<?php } ?>

<div id="select-anim" class="toggle-menu" style="display:none;">
	
	<form id="frm-animation">
		Casting Animation:<br/>
		<?php
		CreateFormInput($ability_effect, 'AnimSpriteSheetCast', 0);
		CreateFormInput($ability_effect, 'AnimNameCast', 'anim12');
		echo('<br/>');
		CreateFormInput($ability_effect, 'AnimSpriteSheetTarget', 0);
		CreateFormInput($ability_effect, 'AnimNameTarget', '');
		?>
		<br/>
		Effect Animation:<br/>
		<style>
			#animation-rgb input{width:60px;}
		</style>
		
		<div id="animation-rgb">
		<?php
		function rgb2html($r, $g=-1, $b=-1)
		{
				if (is_array($r) && sizeof($r) == 3)
						list($r, $g, $b) = $r;

				$r = intval($r); $g = intval($g);
				$b = intval($b);

				$r = dechex($r<0?0:($r>255?255:$r));
				$g = dechex($g<0?0:($g>255?255:$g));
				$b = dechex($b<0?0:($b>255?255:$b));

				$color = (strlen($r) < 2?'0':'').$r;
				$color .= (strlen($g) < 2?'0':'').$g;
				$color .= (strlen($b) < 2?'0':'').$b;
				//return '#'.$color;
				return $color;
		}
		?>
		Color Picker, click here -> <input class="color {onImmediateChange:'updateInfo(this);'}" value="<?php echo rgb2html($ability_effect->R_max,$ability_effect->G_max,$ability_effect->B_max);?>"><br/>
		<br/>
		RGB_min:<br/>
		<?php
		CreateFormInput($ability_effect, 'R_min', 0);
		CreateFormInput($ability_effect, 'G_min', 0);
		CreateFormInput($ability_effect, 'B_min', 0);
		?><br/>
		RGB_max:<br/>
		<?php
		CreateFormInput($ability_effect, 'R_max', 0);
		CreateFormInput($ability_effect, 'G_max', 0);
		CreateFormInput($ability_effect, 'B_max', 0);
		?></div><br/>
		<?php
		CreateFormInput($ability_effect, 'particle_count', 0);
		CreateFormInput($ability_effect, 'shock_lines', 0);
		?>
		<div class="go-button" onclick="EffectController.PlayTestAnim()">Play Animation</div>
		<div id="load-anim-test-buttons"></div>
	</form>

	<div id="game-screen-container" style="position:relative; z-index:10; width:544px;">
		<div id="battle-container" style="position:relative; left:0px; top:0px; z-index:100;">
			<div id="battle-canvas-container" style="background-color:#222; position:relative; z-index:10; width:544px; height:300px;">
				<canvas id="test-battle-particle-effects" width="544" height="300" style="position:absolute; left:0px; top:0px; pointer-events:none;"></canvas>
				<canvas id="test-battle-weapons-effects" width="544" height="300" style="position:absolute; left:0px; top:0px; pointer-events:none;"></canvas>
			</div>
		</div>
	</div>
	<script>
	<?php if(!isset($test)) { ?>
		//switch to the text animation canvases
		//can re-init CanvasAnimController, only sets canvas and context
		CanvasAnimController.Init(document.getElementById('test-battle-particle-effects'));
		SpriteAnimController.SpriteAnimation.canvas = document.getElementById('test-battle-weapons-effects');
		//SpriteAnimController already initialized in game, don't do again or will reload animations
		SpriteAnimController.SpriteAnimation.ctx = document.getElementById('test-battle-weapons-effects').getContext('2d');
		SpriteAnimController.SpriteAnimation.init_test_buttons();
		SpriteAnimController.test_mode = 0; //to turn off blue background on sprites
	<?php } ?>
	
	window.onload=function()
	{
		<?php if(isset($test)) { ?>
			CanvasAnimController.Init(document.getElementById('test-battle-particle-effects'));
			SpriteAnimController.SpriteAnimation.init(document.getElementById('test-battle-weapons-effects'));
			SpriteAnimController.SpriteAnimation.init_test_buttons();
			SpriteAnimController.test_mode = 0; //to turn off blue background on sprites
			jscolor.init();
		<?php } ?>
	};
	</script>
</div>

<style>
#select-icon img {border:4px solid #fff; cursor:pointer;}
</style>
<div id="select-icon" class="toggle-menu" style="display:none;">
	<div id="select-icon-image-list"></div><!--html inserted with JS from GameController.init-->
	<form id="frm-icon">
		<input type="hidden" id="icon-path" name="EffectIconName" value="<?php echo($ability_effect->EffectIconName); ?>"/>
	</form>
</div>

<div id="main-frm" class="toggle-menu">
	<form id="frm-effect">
		<!-- HIDDEN EffectID -->
		<input type="hidden" class="EffectID" name="EffectID" value="<?php echo($ability_effect->EffectID>0?$ability_effect->EffectID:0); ?>"/> 
		<?php
		
		echo '<div id="toggle-multiple_effects" class="'.((count($multiple_effects_icon) > 1 || $ability_effect->IsMultipleEffectOptions == 1 || $ability_effect->IsChooseClassAbility == 1)?'':'hide').'">';
			
			//these effects stack and all are run when ability is activated
			$fieldname = 'IsMultipleEffectOptions';
			echo('['.$fieldname.': <input type="checkbox" value="1" ');
			echo($ability_effect->{$fieldname} == 1)?'checked="checked"':'';
			echo(' id="'.$fieldname.'" name="'.$fieldname.'" ');
			echo('/>] ');
			
			//player selects a class ability from the list
			//player can select a number of abilities equal to what their class level indicates (ability rank)
			//effect is saved to special table as selected class ability, will load with the other class abilities to be usable in ability menu options
			$fieldname = 'IsChooseClassAbility';
			echo('['.$fieldname.': <input class="toggle-check" data-toggle-id="'.strToLower($fieldname).'" type="checkbox" value="1" ');
			echo($ability_effect->{$fieldname} == 1)?'checked="checked"':'';
			echo(' id="'.$fieldname.'" name="'.$fieldname.'" ');
			echo('/>] ');
			
			echo '<br/>';
			
			echo '<span class="go-button" onclick="EffectController.AddMultipleEffect(\''.$title.'\',\''.$effectType.'\','.$effectTypeID.','.$abilityRank.');">Add Another Effect</span>';
			if($effect_index != 0) echo '<span class="go-button" onclick="EffectController.DeleteMultipleEffect(\''.$effectTypeTable.'\','.$ability_effect->EffectID.');">Delete This Effect Option</span>';			
			
		echo'<br/><br/></div>';
		
		foreach($effectsDescribe as $i => $effectsDescribeRow)
		{
			$fieldname = $effectsDescribeRow->Field;
			$defaultValue = $effectsDescribeRow->Default;
			if($fieldname=='EffectName') $defaultValue = $title;
			if($fieldname=='EffectResistanceImmuneID' || $fieldname=='EffectAreaID' || $fieldname=='EffectConditionID' || $fieldname=='EffectAttributeModID' 
				|| $fieldname=='EffectSkillModID' || $fieldname=='EffectSaveModID' || $fieldname=='EffectMovementModID' || $fieldname=='EffectActionModID' 
				|| $fieldname=='EffectAttackModID' || $fieldname=='EffectHPModID' || $fieldname=='EffectACModID' || $fieldname=='EffectSummonID')
			{
				CreateSubform($fieldname);
			}
			elseif($effectsDescribeRow->Extra != 'auto_increment')
			{
				//checkboxes
				if($effectsDescribeRow->Type == 'tinyint(1)')
				{
					CreateCheckbox($ability_effect, $fieldname);
					//add a  <br/> if last checkbox on line
					if($effectsDescribe[$i+1]->Type != 'tinyint(1)')
					{
						echo('<br/>');
					}
				}
				else
				{
					CreateFormInput($ability_effect, $fieldname, $defaultValue);
					//putting TargetsCreatureTypeID & OnlyEffectsCreatureTypeID in manually, after 'TargetTypeID' - since loop ends after 'EffectSummonID' and this was added to end of table
					if($fieldname == 'TargetTypeID')
					{
						CreateFormInput($ability_effect, 'EffectsTargetsID', 0);
						
						echo('[Can Only Target, Effect, or Apply Vs. A Specific Creature Type: <input class="toggle-check" data-toggle-id="creature-types" type="checkbox" value="1" ');
						echo($ability_effect->TargetsCreatureTypeID != 0 || $ability_effect->TargetsCreatureSubTypeID != 0 || $ability_effect->OnlyEffectsCreatureTypeID != 0 || $ability_effect->OnlyEffectsCreatureSubTypeID != 0 || $ability_effect->AppliesVsCreatureTypeID != 0 || $ability_effect->AppliesVsCreatureSubTypeID != 0 )?'checked="checked"':'';
						echo('/>] ');
						echo'<div id="toggle-creature-types" class="'.($ability_effect->TargetsCreatureTypeID != 0 ||$ability_effect->TargetsCreatureSubTypeID != 0 || $ability_effect->OnlyEffectsCreatureTypeID != 0 || $ability_effect->OnlyEffectsCreatureSubTypeID != 0 || $ability_effect->AppliesVsCreatureTypeID != 0 || $ability_effect->AppliesVsCreatureSubTypeID != 0 ?'':'hide').'">';
							echo('[Can Target Only Specific Creature Type: <input class="toggle-check" data-toggle-id="targets-creature-types" type="checkbox" value="1" ');
							echo($ability_effect->TargetsCreatureTypeID||$ability_effect->TargetsCreatureSubTypeID)?'checked="checked"':'';
							echo('/>] ');
							
							echo'<div id="toggle-targets-creature-types" class="'.($ability_effect->TargetsCreatureTypeID != 0 ||$ability_effect->TargetsCreatureSubTypeID != 0 ?'':'hide').'">';
							CreateFormInput($ability_effect, 'TargetsCreatureTypeID', 0);
							CreateFormInput($ability_effect, 'TargetsCreatureSubTypeID', 0);
							echo'</div><br/>';
							
							echo('[Only Effects Specific Creature Type: <input class="toggle-check" data-toggle-id="effects-creature-types" type="checkbox" value="1" ');
							echo($ability_effect->OnlyEffectsCreatureTypeID != 0 ||$ability_effect->OnlyEffectsCreatureSubTypeID != 0 )?'checked="checked"':'';
							echo('/>] ');
							
							echo'<div id="toggle-effects-creature-types" class="'.($ability_effect->OnlyEffectsCreatureTypeID != 0 ||$ability_effect->OnlyEffectsCreatureSubTypeID != 0 ?'':'hide').'">';
							CreateFormInput($ability_effect, 'OnlyEffectsCreatureTypeID', 0);
							CreateFormInput($ability_effect, 'OnlyEffectsCreatureSubTypeID', 0);
							echo'</div><br/>';
							
							echo('[Effects Only Apply Vs. Specific Creature Type: <input class="toggle-check" data-toggle-id="applies-to-creature-types" type="checkbox" value="1" ');
							echo($ability_effect->AppliesVsCreatureTypeID != 0 ||$ability_effect->AppliesVsCreatureSubTypeID != 0 )?'checked="checked"':'';
							echo('/>] ');
							
							echo'<div id="toggle-applies-to-creature-types" class="'.($ability_effect->AppliesVsCreatureTypeID != 0 ||$ability_effect->AppliesVsCreatureSubTypeID != 0 ?'':'hide').'">';
							CreateFormInput($ability_effect, 'AppliesVsCreatureTypeID', 0);
							CreateFormInput($ability_effect, 'AppliesVsCreatureSubTypeID', 0);
							echo'</div><br/>';
						echo'</div><br/>';
					}
				}
			}
			if($fieldname == 'EffectSummonID') break;
		}
		?>
		<hr/>
	</form>

	<div style="height:1vw;"></div>

	<!-- TEMPLATES FOR EFFECT SUBFORMS -->
	
	<?php
	//EffectArea
	//************************************************
	?>
	<div id="template-frm-effectareaid" class="hide">
		<div class="sub-form-container">
			<form id="frm-EffectArea">
				<div>Area Effect</div>
				<?php
				CreateSelectbox(0, 'EffectAreaTypeID', true);
				CreateFormInput(0, 'EffectAreaSizeBase', 0, true);
				CreateFormInput(0, 'EffectAreaSizePer', 0, true);
				?>
			</form>
			<div class="go-button remove-sub-form">remove</div>
			<hr/>
		</div>
	</div>
	
	<?php
	//EffectHPMod
	//************************************************
	?>
	<div id="template-frm-effecthpmodid" class="hide">
		<div class="sub-form-container">
			<form id="frm-EffectHPMod">
				<div>Modifies Hit Points</div>
				<?php 
				CreateFormInput(0, 'EffectHPModTypeID', 0, true);
				?>
				MaxPerLevel: <input type="text" id="HPModMaxPerLevel" name="HPModMaxPerLevel[]" value="0"/><br/>
				PerEveryLevelStart: <input type="text" id="HPModPerEveryLevelStart" name="HPModPerEveryLevelStart[]" value="0"/><br/>
				PerEveryLevelNum: <input type="text" id="HPModPerEveryLevelNum" name="HPModPerEveryLevelNum[]" value="0"/><br/>
			</form>

			<form id="frm-HPModDiceRollBase" class="DiceRoll">
				Base die roll: <input type="text" name="NumDice[]" value="0"/>D
				<input type="text" name="DieType[]" value="0"/>+
				<input type="text" name="RollMod[]" value="0"/>
			</form>
			
			<form id="frm-HPModDiceRollPer" class="DiceRoll">
				Die roll per level<input type="text" name="NumDice[]" value="0"/>D
				<input type="text" name="DieType[]" value="0"/>+
				<input type="text" name="RollMod[]" value="0"/>
			</form>
			<div class="go-button remove-sub-form">remove</div>
			<hr/>
		</div>
	</div>
	
	<?php
	//EffectConditionMod
	//************************************************
	?>
	<div id="template-frm-effectconditionid" class="hide">
		<div class="sub-form-container">
			<form id="frm-EffectCondition">
				<div>Applies Condition</div>
				<?php
				CreateSelectbox(0, 'EffectConditionTypeID', true);
				CreateFormInput(0, 'MaxHD', 0, true);
				?>
			</form>
			<div class="go-button remove-sub-form">remove</div>
			<hr/>
		</div>
	</div>
	
	<?php
	//EffectAttackMod
	//************************************************
	?>
	<div id="template-frm-effectattackmodid" class="hide">
		<div class="sub-form-container">
			<form id="frm-EffectAttackMod">
				<div>Alters Damage of Physical Attack</div>
				<?php 
				CreateSelectbox(0, 'PassDRTypeID', true);
				CreateFormInput(0, 'PassDRMaxAmount', 0, true);
				?>
				<br/>
				<?php
				CreateFormInput(0, 'EffectHPModTypeID', 0, true);
				?>
				<br/>
				<?php
				GenerateSelectboxFromDB('Attributes', 'AttributeID', 'AttributeName', -1, true, 'HitModAttributeID');
				?>
				HitModMaxPerLevel: <input type="text" id="HitModMaxPerLevel" name="HitModMaxPerLevel[]" value="0"/><br/>
				HitModPerEveryLevelStart: <input type="text" id="HitModPerEveryLevelStart" name="HitModPerEveryLevelStart[]" value="0"/><br/>
				HitModPerEveryLevelNum: <input type="text" id="HitModPerEveryLevelNum" name="HitModPerEveryLevelNum[]" value="0"/><br/>
			</form>

			<form id="frm-HitModDiceRollBase" class="DiceRoll">
				Base attack mod die roll: <input type="text" name="NumDice[]" value="0"/>D
				<input type="text" name="DieType[]" value="0"/>+
				<input type="text" name="RollMod[]" value="0"/>
			</form>
			
			<form id="frm-HitModDiceRollPer" class="DiceRoll">
				Attack mod die roll per level<input type="text" name="NumDice[]" value="0"/>D
				<input type="text" name="DieType[]" value="0"/>+
				<input type="text" name="RollMod[]" value="0"/>
			</form>
			
			<br/>
			<form id="frm-EffectAttackMod">
				<?php
				GenerateSelectboxFromDB('Attributes', 'AttributeID', 'AttributeName', -1, true, 'DamageModAttributeID');
				?>
				DamageModMaxPerLevel: <input type="text" id="DamageModMaxPerLevel" name="DamageModMaxPerLevel[]" value="0"/><br/>
				DamageModPerEveryLevelStart: <input type="text" id="DamageModPerEveryLevelStart" name="DamageModPerEveryLevelStart[]" value="0"/><br/>
				DamageModPerEveryLevelNum: <input type="text" id="DamageModPerEveryLevelNum" name="DamageModPerEveryLevelNum[]" value="0"/><br/>
			</form>
			
			<form id="frm-DamageModDiceRollBase" class="DiceRoll">
				Base damage mod die roll: <input type="text" name="NumDice[]" value="0"/>D
				<input type="text" name="DieType[]" value="0"/>+
				<input type="text" name="RollMod[]" value="0"/>
			</form>

			<form id="frm-DamageModDiceRollPer" class="DiceRoll">
				Damage mod die roll per level<input type="text" name="NumDice[]" value="0"/>D
				<input type="text" name="DieType[]" value="0"/>+
				<input type="text" name="RollMod[]" value="0"/>
			</form>
			<div class="go-button remove-sub-form">remove</div>
			<hr/>
		</div>
	</div>
	
	<?php
	//EffectACMod
	//************************************************
	?>
	<div id="template-frm-effectacmodid" class="hide">
		<div class="sub-form-container">
				<form id="frm-EffectACMod">
					<div>Alters Armor Class & Other Defences</div>
					<br/>
					<?php
					CreateSelectbox(0, 'ACModDRTypeID', true);
					?>
					ACModDRValue: <input style="width:50px;" type="text" id="ACModDRValue" name="ACModDRValue[]" value="0"/><br/>
					<br/>
					ACModConcealment: <input style="width:50px;" type="text" id="ACModConcealment" name="ACModConcealment[]" value="0"/><br/>
					ACModConcealMinDistance: <input style="width:50px;" type="text" id="ACModConcealMinDistance" name="ACModConcealMinDistance[]" value="0"/><br/> 
					<br/>
					<?php
					CreateSelectbox(0, 'ACModVsAttackType', true);
					CreateSelectbox(0, 'ACModVsDamageType', true);
					CreateSelectbox(0, 'ACModVsDirection', true);
					?>
					<br/>
					<?php
					GenerateSelectboxFromDB('Attributes', 'AttributeID', 'AttributeName', -1, true, 'ACModAttributeID');
					?>
					<br/>
					Dice Roll [AC Value / Damage Reduction Maximum Soak Value]
					<br/>
					ACModMaxPerLevel: <input type="text" id="ACModMaxPerLevel" name="ACModMaxPerLevel[]" value="0"/><br/>
					ACModPerEveryLevelStart: <input type="text" id="ACModPerEveryLevelStart" name="ACModPerEveryLevelStart[]" value="0"/><br/>
					ACModPerEveryLevelNum: <input type="text" id="ACModPerEveryLevelNum" name="ACModPerEveryLevelNum[]" value="0"/><br/>
				</form>

				<form id="frm-ACModDiceRollBase" class="DiceRoll">
					Base AC mod die roll: <input type="text" name="NumDice[]" value="0"/>D
					<input type="text" name="DieType[]" value="0"/>+
					<input type="text" name="RollMod[]" value="0"/>
				</form>
				
				<form id="frm-ACModDiceRollPer" class="DiceRoll">
					AC mod die roll per level: <input type="text" name="NumDice[]" value="<?php echo($EffectACMod->ACModDiceRollPer != 0?$EffectACMod->ACModDiceRollPer->NumDice:'0'); ?>"/>D
					<input type="text" name="DieType[]" value="0"/>+
					<input type="text" name="RollMod[]" value="0"/>
				</form>
				
				<div class="go-button remove-sub-form">remove</div>
				<hr/>
			</div>
	</div>
	
	<?php
	//EffectResistanceImmune
	//************************************************
	?>
	<div id="template-frm-effectresistanceimmuneid" class="hide">
		<div class="sub-form-container">
			<form id="frm-EffectResistanceImmune">
				<div>Provides Resistance or Immunity</div>
				<?php
				CreateSelectbox(0, 'EffectHPModTypeID', true);
				CreateSelectbox(0, 'EffectConditionTypeID', true);
				CreateFormInput(0, 'EffectSpellSchoolTypeID', 0, true);
				CreateFormInput(0, 'EffectSpellLevel', 0, true);
				CreateFormInput(0, 'SpellID', 0, true);
				CreateFormInput(0, 'IsImmune', 0, true);
				CreateFormInput(0, 'ResistanceMod', 0, true);
				?>
			</form>
			<div class="go-button remove-sub-form">remove</div>
			<hr/>
		</div>
	</div>
	
	<?php
	//EffectAttributeMod
	//************************************************
	?>
	<div id="template-frm-effectattributemodid" class="hide">
		<div class="sub-form-container">
			<form id="frm-EffectAttributeMod">
				<div>Attribute Modification</div>
				<?php
				CreateSelectbox(0, 'AttributeID', true);
				//GenerateSelectboxFromDB($tableName, $fieldID, $fieldName, $default, $isInputArray=false, $alternateName='');
				CreateCheckbox(0, 'IsAllAttributes', true);
				echo('<br/>');
				CreateFormInput(0, 'Mod', 0, true);
				?>
			</form>
			<div class="go-button remove-sub-form">remove</div>
			<hr/>
		</div>
	</div>
	
	<?php
	//EffectSkillMod
	//************************************************
	?>
	<div id="template-frm-effectskillmodid" class="hide">
		<div class="sub-form-container">
			<form id="frm-EffectSkillMod">
				<div>Skill Modification</div>
				<?php
				GenerateSelectboxFromDB('SkillList', 'SkillID', 'SkillName', -1, true);
				CreateCheckbox(0, 'IsAllSkills', true);
				echo('<br/>');
				CreateFormInput(0, 'SkillMod', 0, true);
				?>
			</form>
			<div class="go-button remove-sub-form">remove</div>
			<hr/>
		</div>
	</div>
	
	<?php
	//EffectSaveMod
	//************************************************
	?>
	<div id="template-frm-effectsavemodid" class="hide">
		<div class="sub-form-container">
			<form id="frm-EffectSaveMod">
				<div>Save Modification</div>
				<?php
				CreateSelectbox(0, 'SaveID', true);
				CreateCheckbox(0, 'IsAllSaves', true);
				echo('<br/>');
				GenerateSelectboxFromDB('Attributes', 'AttributeID', 'AttributeName', -1, true, 'SaveModAttributeID');
				CreateFormInput(0, 'SaveMod', 0, true);
				?>
			</form>
			<div class="go-button remove-sub-form">remove</div>
			<hr/>
		</div>
	</div>
	
	<?php
	//EffectMovementMod
	//************************************************
	?>
	<div id="template-frm-effectmovementmodid" class="hide">
		<div class="sub-form-container">
			<form id="frm-EffectMovementMod">
				<div>Movement Modification</div>
				<?php
				CreateFormInput(0, 'MovementMod', 0, true);
				CreateFormInput(0, 'MoveTypeID', 0, true);
				CreateCheckbox(0, 'IsIgnoreTerrain', true);
				CreateCheckbox(0, 'IsIgnoreMedArmor', true);
				CreateCheckbox(0, 'IsIgnoreHeavyArmor', true);
				CreateCheckbox(0, 'IsJumpRunningStart', true);
				?>
			</form>
			<div class="go-button remove-sub-form">remove</div>
			<hr/>
		</div>
	</div>
	
	<?php
	//EffectActionMod
	//************************************************
	?>
	<div id="template-frm-effectactionmodid" class="hide">
		<div class="sub-form-container">
			<form id="frm-EffectActionMod">
				<div>Alters Number of Actions</div>
				<?php
				CreateFormInput(0, 'ActionMod', 0, true);
				?>
			</form>
			<div class="go-button remove-sub-form">remove</div>
			<hr/>
		</div>
	</div>
	
	<?php
	//EffectSummon
	//************************************************
	?>
	<div id="template-frm-effectsummonid" class="hide">
		<div class="sub-form-container">
			<form id="frm-EffectSummon">
				<div>Summons Creatures</div>
				<?php
				CreateCheckbox(0, 'IsPolymorph', false);
				CreateCheckbox(0, 'IsFamiliar', false);
				?>
				<br/>
				<div class="go-button" onclick="EffectController.AddSummonCreatureSubForm(this);">Add Creature Option</div>
			</form>
			<div class="go-button remove-sub-form">remove</div>
			<hr/>
		</div>
	</div>

	<?php
	//EffectSummonCreatures
	//************************************************
	?>
	<div id="template-frm-effectsummoncreatureid" class="hide">
		<div class="sub-form-container">
			<form id="frm-EffectSummonCreatures">
				<div>Select Creature</div>
				<?php
				CreateFormInput(0, 'SummonSuccessChance', 0, true);
				//CreateFormInput(0, 'CreatureCharacterID', 0, true);
				$query = 'SELECT QuickstatID, Name, ThumbPicID, SpriteID, FilePathName, DefaultSpriteScale FROM QuickStats INNER JOIN Sprites USING(SpriteID) WHERE CatagoryID = 3 ORDER BY Name';
				$result = mysqli_query($link,$query);
				$select_box = '<select name="CreatureCharacterID[]"><option value="-1" data-sprite-id="-1">Select</option>';
				while($row = mysqli_fetch_object($result))
				{
					$select_box .= '<option value="'.$row->QuickstatID.'" data-sprite-id="'.$row->SpriteID.'" data-sprite-file="'.$row->FilePathName.'" data-sprite-scale="'.$row->DefaultSpriteScale.'" data-thumb-pic-id="'.$row->ThumbPicID.'">'.$row->Name.'</option>';
				}
				$select_box .= '</select>';
				echo 'CreatureCharacterID: '.$select_box;
				
				?>
			</form>
				
			<form id="frm-SummonDiceRollBase" class="DiceRoll">
				Number summoned (die roll): <input type="text" name="NumDice[]" value="0"/>D
				<input type="text" name="DieType[]" value="0"/>+
				<input type="text" name="RollMod[]" value="0"/>
			</form>

			<div class="go-button remove-sub-form">remove</div>
			<hr/>
		</div>
	</div>
	
	
	<div id="load-additional-forms">
		<?php //SHOW LOADED ABILITY SUBFORM DATA
			if($ability_effect != 0){ ?>
			
			<?php //ability_effect->EffectArea
			foreach($ability_effect->EffectArea as $i => $EffectArea) { ?>
			<div class="sub-form-container">
				<form id="frm-EffectArea">
					<div>Area Effect</div>
					<?php
					CreateSelectbox($EffectArea, 'EffectAreaTypeID', true);
					CreateFormInput($EffectArea, 'EffectAreaSizeBase', 0, true);
					CreateFormInput($EffectArea, 'EffectAreaSizePer', 0, true);
					?>
				</form>
				<div class="go-button remove-sub-form">remove</div>
				<hr/>
			</div>
			<?php } ?>
			
			<?php //ability_effect->EffectCondition
			foreach($ability_effect->EffectCondition as $i => $EffectCondition) { ?>
			<div class="sub-form-container">
				<form id="frm-EffectCondition">
					<div>Applies Condition</div>
					<?php
					CreateSelectbox($EffectCondition, 'EffectConditionTypeID', true);
					CreateFormInput($EffectCondition, 'MaxHD', 0, true);
					?>
				</form>
				<div class="go-button remove-sub-form">remove</div>
				<hr/>
			</div>
			<?php } ?>
			
			<?php //ability_effect->EffectHPModID
			foreach($ability_effect->EffectHPMod as $i => $EffectHPMod) { ?>
			<div class="sub-form-container">
				<form id="frm-EffectHPMod">
					<div>Modifies Hit Points</div>
					<?php 
					CreateFormInput($EffectHPMod, 'EffectHPModTypeID', 0, true);
					?>
					MaxPerLevel: <input type="text" id="HPModMaxPerLevel" name="HPModMaxPerLevel[]" value="<?php echo($EffectHPMod->HPModMaxPerLevel); ?>"/><br/>
					PerEveryLevelStart: <input type="text" id="HPModPerEveryLevelStart" name="HPModPerEveryLevelStart[]" value="<?php echo($EffectHPMod->HPModPerEveryLevelStart); ?>"/><br/>
					PerEveryLevelNum: <input type="text" id="HPModPerEveryLevelNum" name="HPModPerEveryLevelNum[]" value="<?php echo($EffectHPMod->HPModPerEveryLevelNum); ?>"/><br/>
				</form>
				
				<form id="frm-HPModDiceRollBase" class="DiceRoll">
					Base die roll: <input type="text" name="NumDice[]" value="<?php echo($EffectHPMod->HPModDiceRollBase != 0?$EffectHPMod->HPModDiceRollBase->NumDice:'0'); ?>"/>D
					<input type="text" name="DieType[]" value="<?php echo($EffectHPMod->HPModDiceRollBase != 0?$EffectHPMod->HPModDiceRollBase->DieType:'0'); ?>"/>+
					<input type="text" name="RollMod[]" value="<?php echo($EffectHPMod->HPModDiceRollBase != 0?$EffectHPMod->HPModDiceRollBase->RollMod:'0'); ?>"/>
				</form>

				<form id="frm-HPModDiceRollPer" class="DiceRoll">
					Die roll per level<input type="text" name="NumDice[]" value="<?php echo($EffectHPMod->HPModDiceRollPer != 0?$EffectHPMod->HPModDiceRollPer->NumDice:'0'); ?>"/>D
					<input type="text" name="DieType[]" value="<?php echo($EffectHPMod->HPModDiceRollPer != 0?$EffectHPMod->HPModDiceRollPer->DieType:'0'); ?>"/>+
					<input type="text" name="RollMod[]" value="<?php echo($EffectHPMod->HPModDiceRollPer != 0?$EffectHPMod->HPModDiceRollPer->RollMod:'0'); ?>"/>
				</form>
				<div class="go-button remove-sub-form">remove</div>
				<hr/>
			</div>
			<?php } ?>
			
			<?php //ability_effect->EffectAttributeMod
			foreach($ability_effect->EffectAttributeMod as $i => $EffectAttributeMod) { ?>
			<div class="sub-form-container">
				<form id="frm-EffectAttributeMod">
					<div>Attribute Modification</div>
					<?php
					CreateSelectbox($EffectAttributeMod, 'AttributeID', -1, true);
					CreateCheckbox($EffectAttributeMod, 'IsAllAttributes', true);
					echo('<br/>');
					CreateFormInput($EffectAttributeMod, 'Mod', 0, true);
					?>
				</form>
				<div class="go-button remove-sub-form">remove</div>
				<hr/>
			</div>
			<?php } ?>
			
			<?php //ability_effect->EffectAttackMod
			foreach($ability_effect->EffectAttackMod as $i => $EffectAttackMod) { ?>
			<div class="sub-form-container">
				<form id="frm-EffectAttackMod">
					<div>Alters Damage of Physical Attack</div>
					<?php 
					CreateSelectbox($EffectAttackMod, 'PassDRTypeID', true);
					CreateFormInput($EffectAttackMod, 'PassDRMaxAmount', 0, true);
					?>
					<br/>
					<?php
					CreateFormInput($EffectAttackMod, 'EffectHPModTypeID', 0, true);
					?>
					<br/>
					<?php
					GenerateSelectboxFromDB('Attributes', 'AttributeID', 'AttributeName', $EffectAttackMod->HitModAttributeID, true, 'HitModAttributeID');
					?>
					HitModMaxPerLevel: <input type="text" id="HitModMaxPerLevel" name="HitModMaxPerLevel[]" value="<?php echo($EffectAttackMod->HitModMaxPerLevel); ?>"/><br/>
					HitModPerEveryLevelStart: <input type="text" id="HitModPerEveryLevelStart" name="HitModPerEveryLevelStart[]" value="<?php echo($EffectAttackMod->HitModPerEveryLevelStart); ?>"/><br/>
					HitModPerEveryLevelNum: <input type="text" id="HitModPerEveryLevelNum" name="HitModPerEveryLevelNum[]" value="<?php echo($EffectAttackMod->HitModPerEveryLevelNum); ?>"/><br/>
				</form>

				<form id="frm-HitModDiceRollBase" class="DiceRoll">
					Base attack mod die roll: <input type="text" name="NumDice[]" value="<?php echo($EffectAttackMod->HitModDiceRollBase != 0?$EffectAttackMod->HitModDiceRollBase->NumDice:'0'); ?>"/>D
					<input type="text" name="DieType[]" value="<?php echo($EffectAttackMod->HitModDiceRollBase != 0?$EffectAttackMod->HitModDiceRollBase->DieType:'0'); ?>"/>+
					<input type="text" name="RollMod[]" value="<?php echo($EffectAttackMod->HitModDiceRollBase != 0?$EffectAttackMod->HitModDiceRollBase->RollMod:'0'); ?>"/>
				</form>
				
				<form id="frm-HitModDiceRollPer" class="DiceRoll">
					Attack mod die roll per level: <input type="text" name="NumDice[]" value="<?php echo($EffectAttackMod->HitModDiceRollPer != 0?$EffectAttackMod->HitModDiceRollPer->NumDice:'0'); ?>"/>D
					<input type="text" name="DieType[]" value="<?php echo($EffectAttackMod->HitModDiceRollPer != 0?$EffectAttackMod->HitModDiceRollPer->DieType:'0'); ?>"/>+
					<input type="text" name="RollMod[]" value="<?php echo($EffectAttackMod->HitModDiceRollPer != 0?$EffectAttackMod->HitModDiceRollPer->RollMod:'0'); ?>"/>
				</form>

				<br/>
				<form id="frm-EffectAttackMod">
					<?php
					GenerateSelectboxFromDB('Attributes', 'AttributeID', 'AttributeName', $EffectAttackMod->DamageModAttributeID, true, 'DamageModAttributeID');
					?>
					DamageModMaxPerLevel: <input type="text" id="DamageModMaxPerLevel" name="DamageModMaxPerLevel[]" value="<?php echo($EffectAttackMod->DamageModMaxPerLevel); ?>"/><br/>
					DamageModPerEveryLevelStart: <input type="text" id="DamageModPerEveryLevelStart" name="DamageModPerEveryLevelStart[]" value="<?php echo($EffectAttackMod->DamageModPerEveryLevelStart); ?>"/><br/>
					DamageModPerEveryLevelNum: <input type="text" id="DamageModPerEveryLevelNum" name="DamageModPerEveryLevelNum[]" value="<?php echo($EffectAttackMod->DamageModPerEveryLevelNum); ?>"/><br/>
				</form>
				
				<form id="frm-DamageModDiceRollBase" class="DiceRoll">
					Base damage mod die roll: <input type="text" name="NumDice[]" value="<?php echo($EffectAttackMod->DamageModDiceRollBase != 0?$EffectAttackMod->DamageModDiceRollBase->NumDice:'0'); ?>"/>D
					<input type="text" name="DieType[]" value="<?php echo($EffectAttackMod->DamageModDiceRollBase != 0?$EffectAttackMod->DamageModDiceRollBase->DieType:'0'); ?>"/>+
					<input type="text" name="RollMod[]" value="<?php echo($EffectAttackMod->DamageModDiceRollBase != 0?$EffectAttackMod->DamageModDiceRollBase->RollMod:'0'); ?>"/>
				</form>

				<form id="frm-DamageModDiceRollPer" class="DiceRoll">
					Damage mod die roll per level: <input type="text" name="NumDice[]" value="<?php echo($EffectAttackMod->DamageModDiceRollPer != 0?$EffectAttackMod->DamageModDiceRollPer->NumDice:'0'); ?>"/>D
					<input type="text" name="DieType[]" value="<?php echo($EffectAttackMod->DamageModDiceRollPer != 0?$EffectAttackMod->DamageModDiceRollPer->DieType:'0'); ?>"/>+
					<input type="text" name="RollMod[]" value="<?php echo($EffectAttackMod->DamageModDiceRollPer != 0?$EffectAttackMod->DamageModDiceRollPer->RollMod:'0'); ?>"/>
				</form>
				
				<div class="go-button remove-sub-form">remove</div>
				<hr/>
			</div>
			<?php } ?>
			
			<?php //ability_effect->EffectACMod
			foreach($ability_effect->EffectACMod as $i => $EffectACMod) { ?>
			<div class="sub-form-container">
				<form id="frm-EffectACMod">
					<div>Alters Armor Class</div>
					<br/>
					<?php
					CreateSelectbox($EffectACMod, 'ACModDRTypeID', true);
					?>
					ACModDRValue: <input style="width:50px;" type="text" id="ACModDRValue" name="ACModDRValue[]" value="<?php echo($EffectACMod->ACModDRValue); ?>"/><br/>
					<br/>
					ACModConcealment: <input style="width:50px;" type="text" id="ACModConcealment" name="ACModConcealment[]" value="<?php echo($EffectACMod->ACModConcealment); ?>"/><br/>
					ACModConcealMinDistance: <input style="width:50px;" type="text" id="ACModConcealMinDistance" name="ACModConcealMinDistance[]" value="<?php echo($EffectACMod->ACModConcealMinDistance); ?>"/><br/> 
					<br/>
					<?php
					CreateSelectbox($EffectACMod, 'ACModVsAttackType', true);
					CreateSelectbox($EffectACMod, 'ACModVsDamageType', true);
					CreateSelectbox($EffectACMod, 'ACModVsDirection', true);
					?>
					<br/>
					<?php
					GenerateSelectboxFromDB('Attributes', 'AttributeID', 'AttributeName', $EffectACMod->ACModAttributeID, true, 'ACModAttributeID');
					?>
					ACModMaxPerLevel: <input type="text" id="ACModMaxPerLevel" name="ACModMaxPerLevel[]" value="<?php echo($EffectACMod->ACModMaxPerLevel); ?>"/><br/>
					ACModPerEveryLevelStart: <input type="text" id="ACModPerEveryLevelStart" name="ACModPerEveryLevelStart[]" value="<?php echo($EffectACMod->ACModPerEveryLevelStart); ?>"/><br/>
					ACModPerEveryLevelNum: <input type="text" id="ACModPerEveryLevelNum" name="ACModPerEveryLevelNum[]" value="<?php echo($EffectACMod->ACModPerEveryLevelNum); ?>"/><br/>
				</form>

				<form id="frm-ACModDiceRollBase" class="DiceRoll">
					Base AC mod die roll: <input type="text" name="NumDice[]" value="<?php echo($EffectACMod->ACModDiceRollBase != 0?$EffectACMod->ACModDiceRollBase->NumDice:'0'); ?>"/>D
					<input type="text" name="DieType[]" value="<?php echo($EffectACMod->ACModDiceRollBase != 0?$EffectACMod->ACModDiceRollBase->DieType:'0'); ?>"/>+
					<input type="text" name="RollMod[]" value="<?php echo($EffectACMod->ACModDiceRollBase != 0?$EffectACMod->ACModDiceRollBase->RollMod:'0'); ?>"/>
				</form>
				
				<form id="frm-ACModDiceRollPer" class="DiceRoll">
					AC mod die roll per level: <input type="text" name="NumDice[]" value="<?php echo($EffectACMod->ACModDiceRollPer != 0?$EffectACMod->ACModDiceRollPer->NumDice:'0'); ?>"/>D
					<input type="text" name="DieType[]" value="<?php echo($EffectACMod->ACModDiceRollPer != 0?$EffectACMod->ACModDiceRollPer->DieType:'0'); ?>"/>+
					<input type="text" name="RollMod[]" value="<?php echo($EffectACMod->ACModDiceRollPer != 0?$EffectACMod->ACModDiceRollPer->RollMod:'0'); ?>"/>
				</form>
				
				<div class="go-button remove-sub-form">remove</div>
				<hr/>
			</div>
			<?php } ?>
			
			<?php //ability_effect->EffectResistanceImmune
			foreach($ability_effect->EffectResistanceImmune as $i => $EffectResistanceImmune) { ?>
			<div class="sub-form-container">
				<form id="frm-EffectResistanceImmune">
					<div>Provides Resistance or Immunity</div>
					<?php
					CreateSelectbox($EffectResistanceImmune, 'EffectHPModTypeID', true);
					CreateSelectbox($EffectResistanceImmune, 'EffectConditionTypeID', true);
					CreateFormInput($EffectResistanceImmune, 'EffectSpellSchoolTypeID', 0, true);
					CreateFormInput($EffectResistanceImmune, 'EffectSpellLevel', 0, true);
					CreateFormInput($EffectResistanceImmune, 'SpellID', 0, true);
					CreateFormInput($EffectResistanceImmune, 'IsImmune', 0, true);
					CreateFormInput($EffectResistanceImmune, 'ResistanceMod', 0, true);
					?>
				</form>
				<div class="go-button remove-sub-form">remove</div>
				<hr/>
			</div>
			<?php } ?>
			
			<?php	//EffectSkillMod
			foreach($ability_effect->EffectSkillMod as $i => $EffectSkillMod) { ?>
			<div class="sub-form-container">
				<form id="frm-EffectSkillMod">
					<div>Skill Modification</div>
					<?php
					GenerateSelectboxFromDB('SkillList', 'SkillID', 'SkillName', $EffectSkillMod->SkillID, true);
					CreateCheckbox($EffectSkillMod, 'IsAllSkills', true);
					echo('<br/>');
					CreateFormInput($EffectSkillMod, 'SkillMod', 0, true);
					?>
				</form>
				<div class="go-button remove-sub-form">remove</div>
				<hr/>
			</div>
			<?php } ?>
			
			<?php	//EffectSaveMod
			foreach($ability_effect->EffectSaveMod as $i => $EffectSaveMod) { ?>
			<div class="sub-form-container">
				<form id="frm-EffectSaveMod">
					<div>Save Modification</div>
					<?php
					CreateSelectbox($EffectSaveMod, 'SaveID', true);
					CreateCheckbox($EffectSaveMod, 'IsAllSaves', true);
					echo('<br/>');
					GenerateSelectboxFromDB('Attributes', 'AttributeID', 'AttributeName', $EffectSaveMod->SaveModAttributeID, true, 'SaveModAttributeID');
					CreateFormInput($EffectSaveMod, 'SaveMod', 0, true);
					?>
				</form>
				<div class="go-button remove-sub-form">remove</div>
				<hr/>
			</div>
			<?php } ?>
			
			<?php	//EffectMovementMod
			foreach($ability_effect->EffectMovementMod as $i => $EffectMovementMod) { ?>
			<div class="sub-form-container">
				<form id="frm-EffectMovementMod">
					<div>Movement Modification</div>
					<?php
					CreateFormInput($EffectMovementMod, 'MovementMod', 0, true);
					CreateFormInput($EffectMovementMod, 'MoveTypeID', 0, true);
					CreateCheckbox($EffectMovementMod, 'IsIgnoreTerrain', true);
					CreateCheckbox($EffectMovementMod, 'IsIgnoreMedArmor', true);
					CreateCheckbox($EffectMovementMod, 'IsIgnoreHeavyArmor', true);
					CreateCheckbox($EffectMovementMod, 'IsJumpRunningStart', true);
					?>
				</form>
				<div class="go-button remove-sub-form">remove</div>
				<hr/>
			</div>
			<?php } ?>
			
			<?php //EffectActionMod
			foreach($ability_effect->EffectActionMod as $i => $EffectActionMod) { ?>
			<div id="template-frm-effectactionmodid" class="hide">
				<div class="sub-form-container">
					<form id="frm-EffectActionMod">
						<div>Alters Number of Actions</div>
						<?php
						CreateFormInput($EffectActionMod, 'ActionMod', 0, true);
						?>
					</form>
					<div class="go-button remove-sub-form">remove</div>
					<hr/>
				</div>
			</div>
			<?php } ?>
			
			<?php //EffectSummon
			foreach($ability_effect->EffectSummon as $i => $EffectSummon) { ?>
			<div class="sub-form-container">
				<form id="frm-EffectSummon">
					<div>Summons Creatures</div>
					<?php
					CreateCheckbox($EffectSummon, 'IsPolymorph', false);
					CreateCheckbox($EffectSummon, 'IsFamiliar', false);
					?>
					<br/>
					<input type="hidden" name="EffectSummonCounter[]" value="<?php echo $i ?>"/>
					<div class="go-button" onclick="EffectController.AddSummonCreatureSubForm(this);">Add Creature Option</div>
				</form>
				<div class="go-button remove-sub-form">remove</div>
				<hr/>
			</div>
				<?php //EffectSummonCreatures
				foreach($EffectSummon->EffectSummonCreatures as $j => $EffectSummonCreatures) { ?>
				<div class="sub-form-container">
					<form id="frm-EffectSummonCreatures">
						<div>Select Creature</div>
						<?php
						//print_r($EffectSummonCreatures);
						CreateFormInput($EffectSummonCreatures, 'SummonSuccessChance', 0, true);
						//CreateFormInput($EffectSummonCreatures, 'CreatureCharacterID', 0, true);
						$query = 'SELECT QuickstatID, Name, ThumbPicID, SpriteID, FilePathName, DefaultSpriteScale FROM QuickStats INNER JOIN Sprites USING(SpriteID) WHERE CatagoryID = 3 ORDER BY Name';
						$result = mysqli_query($link,$query);
						$select_box = '<select name="CreatureCharacterID[]"><option value="-1" data-sprite-id="-1">Select</option>';
						while($row = mysqli_fetch_object($result))
						{
							$select_box .= '<option ';
							if($EffectSummonCreatures->CreatureCharacterID == $row->QuickstatID) $select_box .= 'selected="selected" ';
							$select_box .= 'value="'.$row->QuickstatID.'" data-sprite-id="'.$row->SpriteID.'" data-sprite-file="'.$row->FilePathName.'" data-sprite-scale="'.$row->DefaultSpriteScale.'" data-thumb-pic-id="'.$row->ThumbPicID.'">'.$row->Name.'</option>';
						}
						$select_box .= '</select>';
						echo 'CreatureCharacterID: '.$select_box;
						?>
					</form>
						
					<form id="frm-SummonDiceRollBase" class="DiceRoll">
						Number summoned (die roll): <input type="text" name="NumDice[]" value="<?php echo $EffectSummonCreatures->SummonDiceRollBase->NumDice?>"/>D
						<input type="text" name="DieType[]" value="<?php echo $EffectSummonCreatures->SummonDiceRollBase->DieType?>"/>+
						<input type="text" name="RollMod[]" value="<?php echo $EffectSummonCreatures->SummonDiceRollBase->RollMod?>"/>
					</form>
					
					<div class="go-button remove-sub-form">remove</div>
					<hr/>
				</div>
				<?php } ?>
		<?php } ?>
				
		<?php } ?>

	</div>
</div>

<div class="go-button" onclick="EffectController.SaveEffect();">SAVE</div>
<div class="go-button" onclick="EffectController.CloseForm();">CLOSE</div>
	
<div style="height:3vw;"></div>
	
<div id="return-data"></div>

<?php
//print_r($ability_effect);
mysqli_close($link);
?>