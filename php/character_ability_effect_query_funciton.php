<?php
function CastAllToInt($object)
{
	foreach($object as $key => $value)
	{
		$object->{$key} = (int)$value;
	}
}

//function to query for all spell/ability effects
function EffectQuery($link, $effectTypeTable, $effectTypeFieldID, $effectTypeID, $abilityRank=0, $effect_id=0)//$effect_id for loading effects of saved game characters
{
	if($effect_id)
	{
		//looking for a specific EffectID, using '$effectTypeTable' and '$effect_id'
		//	used in Quick_Stat.php: 'SELECT * FROM CharacterEffects'
		//	used in inc_character_query_full.php: 'SELECT EffectID FROM PlayerCharacterSelectedClassAbilities'
		$effectQuery = 
			"SELECT $effectTypeTable.*, Effects.*, AppliesVsCreatureTypes.TypeName AS AppliesVsTypeName, AppliesVsCreatureSubTypes.TypeName AS AppliesVsSubTypeName 
				FROM $effectTypeTable INNER JOIN Effects USING(EffectID) 
				LEFT JOIN CreatureTypes AS AppliesVsCreatureTypes ON(AppliesVsCreatureTypeID = CreatureTypeID) 
				LEFT JOIN CreatureSubTypes AS AppliesVsCreatureSubTypes ON(AppliesVsCreatureSubTypeID = CreatureSubTypeID)
				WHERE Effects.EffectID = $effect_id";
	}
	else
	{
		$effectQuery = 
			"SELECT $effectTypeTable.*, Effects.*, AppliesVsCreatureTypes.TypeName AS AppliesVsTypeName, AppliesVsCreatureSubTypes.TypeName AS AppliesVsSubTypeName 
				FROM $effectTypeTable INNER JOIN Effects USING(EffectID) 
				LEFT JOIN CreatureTypes AS AppliesVsCreatureTypes ON(AppliesVsCreatureTypeID = CreatureTypeID) 
				LEFT JOIN CreatureSubTypes AS AppliesVsCreatureSubTypes ON(AppliesVsCreatureSubTypeID = CreatureSubTypeID)
				WHERE $effectTypeTable.$effectTypeFieldID = $effectTypeID";
		
		//use EffectID here to get data with a different query?
		if($abilityRank > 0)
		{
			$effectQuery .= " AND AbilityRank = ".$abilityRank;
		}
	}
	
	//echo('<br/><br/>effectQuery: '.$effectQuery.'<br/>');
	
	$effect_arr = array();
	
	if($effectResult = mysqli_query($link,$effectQuery))
	{
		//put in array for multiple effects 
		while($effectData = mysqli_fetch_object($effectResult))
		{
			/*
			//saved for each effect
			HasMultipleEffectOptions
			HasMultipleEffects
			MultipleEffectMainIconName
			*/
			$effectData->EffectID = (int)$effectData->EffectID;
			$effectData->EffectTypeTable = $effectTypeTable;
			$effectData->ActionTypeID = (int)$effectData->ActionTypeID;
			//$effectData->NumTimesUsed = (int)$effectData->NumTimesUsed;//??? 144000 rounds in a day
			$effectData->AttackBonus = (int)$effectData->AttackBonus;
			$effectData->AttackBonusAbilModID = (int)$effectData->AttackBonusAbilModID;
			$effectData->B_max = (int)$effectData->B_max;
			$effectData->B_min = (int)$effectData->B_min;
			$effectData->CancelAtWill = (int)$effectData->CancelAtWill;
			$effectData->CriticalRange = (int)$effectData->CriticalRange;
			$effectData->DurationBase = (int)$effectData->DurationBase;
			$effectData->DurationPer = (int)$effectData->DurationPer;
			$effectData->EffectAreaID = (int)$effectData->EffectAreaID;
			$effectData->EffectModTypeID = (int)$effectData->EffectModTypeID;
			$effectData->EffectMovementRate = (int)$effectData->EffectMovementRate;
			$effectData->EffectMovementType = (int)$effectData->EffectMovementType;
			$effectData->EffectsEquipmentID = NULL;//(int)$effectData->EffectsEquipmentID;
			$effectData->G_max = (int)$effectData->G_max;
			$effectData->G_min = (int)$effectData->G_min;
			$effectData->HitType = (int)$effectData->HitType;
			$effectData->IsAllowSR = (int)$effectData->IsAllowSR;
			$effectData->IsAllowSave = (int)$effectData->IsAllowSave;
			$effectData->IsDurationCountdownOnCharacterTurn = 1;//(int)$effectData->IsDurationCountdownOnCharacterTurn;
			$effectData->IsHarmless = (int)$effectData->IsHarmless;
			//$effectData->ItemID = (int)$effectData->ItemID;//ONLY USED FOR JOIN
			$effectData->MaintainEveryRound = (int)$effectData->MaintainEveryRound;
			$effectData->MultipleTargetMaxDistance = (int)$effectData->MultipleTargetMaxDistance;
			$effectData->NumTargets = (int)$effectData->NumTargets;
			$effectData->R_max = (int)$effectData->R_max;
			$effectData->R_min = (int)$effectData->R_min;
			$effectData->RangeBase = (int)$effectData->RangeBase;
			$effectData->RangePer = (int)$effectData->RangePer;
			$effectData->RequireActionEveryRound = (int)$effectData->RequireActionEveryRound;
			$effectData->SaveEffect = (int)$effectData->SaveEffect;
			$effectData->SaveEveryRound = (int)$effectData->SaveEveryRound;
			$effectData->SaveID = (int)$effectData->SaveID;
			$effectData->SpecialSaveEffectID = (int)$effectData->SpecialSaveEffectID;
			$effectData->TargetTypeID = (int)$effectData->TargetTypeID;
			$effectData->TargetsCreatureTypeID = (int)$effectData->TargetsCreatureTypeID;
			$effectData->OnlyEffectsCreatureTypeID = (int)$effectData->OnlyEffectsCreatureTypeID;
			$effectData->TargetsCreatureSubTypeID = (int)$effectData->TargetsCreatureSubTypeID;
			$effectData->OnlyEffectsCreatureSubTypeID = (int)$effectData->OnlyEffectsCreatureSubTypeID;
			$effectData->AppliesVsCreatureTypeID = (int)$effectData->AppliesVsCreatureTypeID;
			$effectData->AppliesVsCreatureSubTypeID = (int)$effectData->AppliesVsCreatureSubTypeID;
			$effectData->particle_count = (int)$effectData->particle_count;
			$effectData->shock_lines = (int)$effectData->shock_lines;
			$effectData->IsMultipleEffectOptions = (int)$effectData->IsMultipleEffectOptions;
			$effectData->IsChooseClassAbility = (int)$effectData->IsChooseClassAbility;

			//EffectArea
			//set empty array of EffectArea effects
			$effectData->EffectArea = array();
			if($effectData->EffectAreaID > 0)
			{
				$areaQuery = "SELECT * FROM EffectArea WHERE EffectID = ".$effectData->EffectID;
				$areaResult = mysqli_query($link,$areaQuery);
				while($areaData = mysqli_fetch_object($areaResult))
				{
					$effectData->EffectArea[] = $areaData;
				}
			}
			else
			{
				$effectData->EffectAreaID = 0;
			}
			
			//EffectHPMod
			//set empty array of EffectHPMod effects
			$effectData->EffectHPMod = array();
			if($effectData->EffectHPModID > 0)
			{
				$HPModQuery = "SELECT * FROM EffectHPMod LEFT JOIN EffectHPModType USING(EffectHPModTypeID) WHERE EffectID = ".$effectData->EffectID;
				$HPModResult = mysqli_query($link,$HPModQuery);
				while($HPModData = mysqli_fetch_object($HPModResult))
				{
					//get the dice rolls for the EffectHPMod
					$HPModData->HPModDiceRollBase = 0;
					if($HPModData->HPModDiceRollBaseID > 0)
					{
						$diceRollQuery = "SELECT * FROM DiceRoll WHERE DiceRollID = ".$HPModData->HPModDiceRollBaseID;
						$diceRollResult = mysqli_query($link,$diceRollQuery);
						if($diceRollData = mysqli_fetch_object($diceRollResult))
						{
							CastAllToInt($diceRollData);
							$HPModData->HPModDiceRollBase = $diceRollData;
						}
					}
					$HPModData->HPModDiceRollPer = 0;
					if($HPModData->HPModDiceRollPerID > 0)
					{
						$diceRollQuery = "SELECT * FROM DiceRoll WHERE DiceRollID = ".$HPModData->HPModDiceRollPerID;
						$diceRollResult = mysqli_query($link,$diceRollQuery);
						if($diceRollData = mysqli_fetch_object($diceRollResult))
						{
							CastAllToInt($diceRollData);
							$HPModData->HPModDiceRollPer = $diceRollData;
						}
					}
					$effectData->EffectHPMod[] = $HPModData;
				}
			}
			else
			{
				$effectData->EffectHPModID = 0;
			}
			
			//EffectCondition
			//set empty array of EffectCondition effects
			$effectData->EffectCondition = array();
			if($effectData->EffectConditionID > 0)
			{
				$conditionQuery = "SELECT * FROM EffectCondition LEFT JOIN EffectConditionType USING(EffectConditionTypeID) WHERE EffectID = ".$effectData->EffectID;
				$conditionResult = mysqli_query($link,$conditionQuery);
				while($conditionData = mysqli_fetch_object($conditionResult))
				{
					$conditionName = $conditionData->ConditionName;//preserve this as a string
					CastAllToInt($conditionData);
					$conditionData->ConditionName = $conditionName;
					$effectData->EffectCondition[] = $conditionData;
				}
			}
			else
			{
				$effectData->EffectConditionID = 0;
			}
			
			//EffectAttackMod
			//set empty array of EffectAttackMod effects
			$effectData->EffectAttackMod = array();
			if($effectData->EffectAttackModID > 0)
			{
				$query = "SELECT * FROM EffectAttackMod WHERE EffectID = ".$effectData->EffectID;
				$result = mysqli_query($link,$query);
				while($attackModData = mysqli_fetch_object($result))
				{
					CastAllToInt($attackModData);
					//get the dice rolls for the EffectAttackMod hit modifiers
					$attackModData->HitModDiceRollBase = 0;
					if($attackModData->HitModDiceRollBaseID > 0)
					{
						$diceRollQuery = "SELECT * FROM DiceRoll WHERE DiceRollID = ".$attackModData->HitModDiceRollBaseID;
						$diceRollResult = mysqli_query($link,$diceRollQuery);
						if($diceRollData = mysqli_fetch_object($diceRollResult))
						{
							CastAllToInt($diceRollData);
							$attackModData->HitModDiceRollBase = $diceRollData;
						}
					}
					$attackModData->HitModDiceRollPer = 0;
					if($attackModData->HitModDiceRollPerID > 0)
					{
						$diceRollQuery = "SELECT * FROM DiceRoll WHERE DiceRollID = ".$attackModData->HitModDiceRollPerID;
						$diceRollResult = mysqli_query($link,$diceRollQuery);
						if($diceRollData = mysqli_fetch_object($diceRollResult))
						{
							CastAllToInt($diceRollData);
							$attackModData->HitModDiceRollPer = $diceRollData;
						}
					}
					//get the dice rolls for the EffectAttackMod damage modifiers
					$attackModData->DamageModDiceRollBase = 0;
					if($attackModData->DamageModDiceRollBaseID > 0)
					{
						$diceRollQuery = "SELECT * FROM DiceRoll WHERE DiceRollID = ".$attackModData->DamageModDiceRollBaseID;
						$diceRollResult = mysqli_query($link,$diceRollQuery);
						if($diceRollData = mysqli_fetch_object($diceRollResult))
						{
							CastAllToInt($diceRollData);
							$attackModData->DamageModDiceRollBase = $diceRollData;
						}
					}
					$attackModData->DamageModDiceRollPer = 0;
					if($attackModData->DamageModDiceRollPerID > 0)
					{
						$diceRollQuery = "SELECT * FROM DiceRoll WHERE DiceRollID = ".$attackModData->DamageModDiceRollPerID;
						$diceRollResult = mysqli_query($link,$diceRollQuery);
						if($diceRollData = mysqli_fetch_object($diceRollResult))
						{
							CastAllToInt($diceRollData);
							$attackModData->DamageModDiceRollPer = $diceRollData;
						}
					}
					$effectData->EffectAttackMod[] = $attackModData;
				}
			}
			else
			{
				$effectData->EffectAttackModID = 0;
			}
			
			//EffectACMod
			//set empty array of EffectACMod effects
			$effectData->EffectACMod = array();
			if($effectData->EffectACModID > 0)
			{
				$query = "SELECT * FROM EffectACMod WHERE EffectID = ".$effectData->EffectID;
				$result = mysqli_query($link,$query);
				while($acModData = mysqli_fetch_object($result))
				{
					CastAllToInt($acModData);
					//get the dice rolls for the EffectAttackMod hit modifiers
					$acModData->ACModDiceRollBase = 0;
					if($acModData->ACModDiceRollBaseID > 0)
					{
						$diceRollQuery = "SELECT * FROM DiceRoll WHERE DiceRollID = ".$acModData->ACModDiceRollBaseID;
						$diceRollResult = mysqli_query($link,$diceRollQuery);
						if($diceRollData = mysqli_fetch_object($diceRollResult))
						{
							CastAllToInt($diceRollData);
							$acModData->ACModDiceRollBase = $diceRollData;
						}
					}
					$acModData->ACModDiceRollPer = 0;
					if($acModData->ACModDiceRollPerID > 0)
					{
						$diceRollQuery = "SELECT * FROM DiceRoll WHERE DiceRollID = ".$acModData->ACModDiceRollPerID;
						$diceRollResult = mysqli_query($link,$diceRollQuery);
						if($diceRollData = mysqli_fetch_object($diceRollResult))
						{
							CastAllToInt($diceRollData);
							$acModData->ACModDiceRollPer = $diceRollData;
						}
					}
					$effectData->EffectACMod[] = $acModData;
				}
			}
			else
			{
				$effectData->EffectACModID = 0;
			}
			
			//EffectResistanceImmune
			//set empty array of EffectResistanceImmune effects
			$effectData->EffectResistanceImmune = array();
			if($effectData->EffectResistanceImmuneID > 0)
			{
				$resistanceImmuneQuery = "SELECT * FROM EffectResistanceImmune WHERE EffectID = ".$effectData->EffectID;
				$resistanceImmuneResult = mysqli_query($link,$resistanceImmuneQuery);
				while($resistanceImmuneData = mysqli_fetch_object($resistanceImmuneResult))
				{
					$effectData->EffectResistanceImmune[] = $resistanceImmuneData;
				}
			}
			else
			{
				$effectData->EffectResistanceImmuneID = 0;
			}
			
			//EffectAttributeMod
			//set empty array of EffectAttributeMod effects
			$effectData->EffectAttributeMod = array();
			if($effectData->EffectAttributeModID > 0)
			{
				$attributeModQuery = "SELECT * FROM EffectAttributeMod LEFT JOIN Attributes USING(AttributeID) WHERE EffectID = ".$effectData->EffectID;
				$attributeModResult = mysqli_query($link,$attributeModQuery);
				while($attributeModData = mysqli_fetch_object($attributeModResult))
				{
					$attributeModData->AttributeID = (int)$attributeModData->AttributeID;
					$attributeModData->IsAllAttributes = (int)$attributeModData->IsAllAttributes;
					$attributeModData->Mod = (int)$attributeModData->Mod;
					$effectData->EffectAttributeMod[] = $attributeModData;
				}
			}
			else
			{
				$effectData->EffectAttributeModID = 0;
			}
			
			//EffectSkillMod
			//set empty array of EffectSkillMod effects
			$effectData->EffectSkillMod = array();
			if($effectData->EffectSkillModID > 0)
			{
				$query = "SELECT * FROM EffectSkillMod WHERE EffectID = ".$effectData->EffectID;
				$result = mysqli_query($link,$query);
				while($data = mysqli_fetch_object($result))
				{
					CastAllToInt($data);
					$effectData->EffectSkillMod[] = $data;
				}
			}
			else
			{
				$effectData->EffectSkillModID = 0;
			}
			
			//EffectSaveMod
			//set empty array of EffectSaveMod effects
			$effectData->EffectSaveMod = array();
			if($effectData->EffectSaveModID > 0)
			{
				$query = "SELECT * FROM EffectSaveMod WHERE EffectID = ".$effectData->EffectID;
				$result = mysqli_query($link,$query);
				while($data = mysqli_fetch_object($result))
				{
					CastAllToInt($data);
					$effectData->EffectSaveMod[] = $data;
				}
			}
			else
			{
				$effectData->EffectSaveModID = 0;
			}
			
			//EffectMovementMod
			//set empty array of EffectMovementMod effects
			$effectData->EffectMovementMod = array();
			if($effectData->EffectMovementModID > 0)
			{
				$query = "SELECT * FROM EffectMovementMod WHERE EffectID = ".$effectData->EffectID;
				$result = mysqli_query($link,$query);
				while($data = mysqli_fetch_object($result))
				{
					CastAllToInt($data);
					$effectData->EffectMovementMod[] = $data;
				}
			}
			else
			{
				$effectData->EffectMovementModID = 0;
			}
			
			//EffectActionMod
			//set empty array of EffectActionMod effects
			$effectData->EffectActionMod = array();
			if($effectData->EffectActionModID > 0)
			{
				$query = "SELECT * FROM EffectActionMod WHERE EffectID = ".$effectData->EffectID;
				$result = mysqli_query($link,$query);
				while($data = mysqli_fetch_object($result))
				{
					$effectData->EffectActionMod[] = $data;
				}
			}
			else
			{
				$effectData->EffectActionModID = 0;
			}
			
			//EffectSummon
			//set empty array of EffectSummon effects
			$effectData->EffectSummon = array();
			if($effectData->EffectSummonID > 0)
			{
				$query = "SELECT * FROM EffectSummon WHERE EffectID = ".$effectData->EffectID;
				$result = mysqli_query($link,$query);
				//only one EffectSummon record maximum
				$summonData = mysqli_fetch_object($result);
				CastAllToInt($summonData);
				//$summonData = new stdClass();
				$summonData->EffectSummonCreatures = array();
				//$creatureQuery = "SELECT * FROM EffectSummonCreatures WHERE EffectSummonID = ".$summonData->EffectSummonID;
				$creatureQuery = "SELECT * FROM EffectSummonCreatures WHERE EffectID = ".$effectData->EffectID;
				$creatureResult = mysqli_query($link,$creatureQuery);
				while($creatureData = mysqli_fetch_object($creatureResult))
				{
					//get the creature name and thumb image
					$QSQuery = "SELECT Name, ThumbPicID FROM QuickStats WHERE QuickStatID = ".$creatureData->CreatureCharacterID;
					$QSResult = mysqli_query($link,$QSQuery);
					$QSData = mysqli_fetch_object($QSResult);
					$creatureData->Name = $QSData->Name;
					$creatureData->ThumbPicID = $QSData->ThumbPicID;
					$creatureData->SummonDiceRollBase = 0;
					if($creatureData->SummonDiceRollBaseID > 0)
					{
						$diceRollQuery = "SELECT * FROM DiceRoll WHERE DiceRollID = ".$creatureData->SummonDiceRollBaseID;
						$diceRollResult = mysqli_query($link,$diceRollQuery);
						if($diceRollData = mysqli_fetch_object($diceRollResult))
						{
							CastAllToInt($diceRollData);
							$creatureData->SummonDiceRollBase = $diceRollData;
						}
					}
					$summonData->EffectSummonCreatures[] = $creatureData;
				}
				$effectData->EffectSummon[] = $summonData;
				
			}
			else
			{
				$effectData->EffectSummonID = 0;
			}
			$effect_arr[] = $effectData;
		}
	}
	if(count($effect_arr) == 0) $effect_arr = 0;
	return $effect_arr;
}
?>