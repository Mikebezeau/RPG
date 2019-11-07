
var EffectController = EffectController || {};

EffectController.summon_unique_character_id = -1;

EffectController.last_checked_init_for_duration_decrease = 99;

EffectController.GetDuration = function(action_data)
{
	if(action_data.effects == 0) return 0;
	return action_data.effects[0].DurationBase + (typeof action_data.action_level != 'undefined' ? parseInt(action_data.action_level) * action_data.effects[0].DurationPer : 0);
}

EffectController.DecreaseDurationOnInit = function(current_init)
{
	/*
	decrease RoundsLeft each initiative increment
	last checked init = EffectController.last_checked_init_for_duration_decrease
	
	if character_stats.effects[n].InitiativeStarted < EffectController.last_checked_init_for_duration_decrease && >= current_init
		-> decrease .RoundsLeft
	
	update EffectController.last_checked_init_for_duration_decrease = current_init;
	
	example: .InitiativeStarted = 5, last checked = 7, current = 3 -> decrease .RoundsLeft
	
	character_stats.effects
		.TotalDuration
		.RoundsLeft
		.InitiativeStarted
	*/
}

EffectController.DecreaseAllDuration = function(durationDecreaseAmount)
{
	if(arguments.length < 1) durationDecreaseAmount = 1;
	/*decrease RoundsLeft on all effects for all characters
	character_stats.effects
		.TotalDuration
		.RoundsLeft
		.InitiativeStarted
	*/
	var effect_removed = false;
	for(var i=0; i<GameController.characters.length; i++)
	{
		if(GameController.characters[i].character_stats.effects)
		{
			for(var j=GameController.characters[i].character_stats.effects.length-1; j>=0; j--)
			{
				GameController.characters[i].character_stats.effects[j].RoundsLeft--;
				if(GameController.characters[i].character_stats.effects[j].RoundsLeft <= 0)
				{
					//remove this effect
					EffectController.RemoveEffect(i,j);
					effect_removed = true;
				}
			}
		}
	}
	//refresh display once at end of loops
	if(effect_removed)
	{
		if(GameController.in_encounter)
		{
			BattleController.draw();
		}
		else
		{
			$('#show-character-a').html(CharacterController.GetCharacterDisplay(0, 'left'));
			//GameController.redraw_map_on_player_position();
		}
	}
}

EffectController.RemoveAllEffects = function(character_index)
{
	//must count down, effects splice out of array in RemoveEffect (length - 1 !)
	for(var i=GameController.characters[character_index].character_stats.effects.length - 1; i>0; i--)
	{
		EffectController.RemoveEffect(character_index, i, false);
	}
}

EffectController.RemoveEffect = function(character_index, effect_index, refreshDisplay)
{
	if(arguments.length < 3) refreshDisplay = false;
	var this_effect = GameController.characters[character_index].character_stats.effects[effect_index];
	if(this_effect.effect.EffectSummonID != 0)
	{
		if(this_effect.effect.EffectSummon[0].IsPolymorph)
		{
			GameController.characters[character_index].character_stats.is_polymorph_qsid = 0;
			GameController.characters[character_index].character_stats.poly_character_stats = 0;
			//update character menu - attacks & specials
			ActionController.PolyMenuUpdate(GameController.characters[character_index].character_stats, character_index);
		}
		else
		{
			//remove the summoned creature
			//must be deleted from DB on save, so need to add isDelete variable in characters_to_save
			var delete_data = {
					'character_id_arr':this_effect.EffectData
				};
			//console.log('delete summon this_effect',this_effect);
			ajax_action('edit_map_delete_npc_monster.php', 0, delete_data, function(){GameController.SaveGame(0);});
			
			//save game
				
			//set hp to -100 so character doesn't get drawn
			for(var i=0; i<this_effect.EffectData.length; i++)
			{
				for(var j=GameController.characters.length-1; j>=0; j--)//counting down to avoid issue when remove elents from array
				{
					if(GameController.characters[j].character_stats.character_id == this_effect.EffectData[i])
					{
						//***do special effect anim as they dissapear
						
						//remove from GameController.characters
						GameController.characters.splice(j,1);
						//update menu for PC
						if(CharacterController.IsPartyMember(GameController.characters[j]))
						{
							FormationController.SetFormation();
							FormationController.SetFormationMenu();
							//remove creature from menu
							MenuController.SetMasterMenu();
						}
					}
				}
			}
		}
	}
	
	//remove the effect
	GameController.characters[character_index].character_stats.effects.splice(effect_index, 1);
	
	if(refreshDisplay)
	{
		if(GameController.in_encounter)
		{
			BattleController.draw();
		}
		else
		{
			$('#show-character-a').html(CharacterController.GetCharacterDisplay(character_index, 'left'));
			CharacterController.ShowCharacterStatusBox(character_index);
			GameController.redraw_map_on_player_position();
		}
	}
}

EffectController.CleanName = function(EffectName)
{
	return EffectName.replace('Spells_', '').replace('Feat_', '').replace('Ability_', '').replace('Class_', '').replace('Racial_', '').replace(/_/g, ' ');
}

EffectController.GetRange = function(action_data)
{
	return parseInt(action_data.effects[0].RangeBase) + (parseInt(action_data.action_level) * parseInt(action_data.effects[0].RangePer));
}

EffectController.GetAoeSize = function(action_data, EffectAreaIndex)
{
	if(action_data.effects[0].EffectAreaID != 0)
	{
		var action_level = parseInt(action_data.action_level) > 0 ? parseInt(action_data.action_level): 0;
		return parseInt(action_data.effects[0].EffectArea[EffectAreaIndex].EffectAreaSizeBase) + (parseInt(action_data.action_level) * parseInt(action_data.effects[0].EffectArea[EffectAreaIndex].EffectAreaSizePer));
	}
	return 0;
}

EffectController.HasCanvasAnim = function(effect)
{
	if(effect != 0 && effect.particle_count>0 || effect.shock_lines>0) return true;
	return 0;
}

EffectController.GetEffectsTargetsID = function(effects)
{
	var effects_allies = 0;
	var effects_enemies = 0;

	for(var i=0; i<effects.length; i++)
	{
		//check each effect (for multiple effects)
		if(effects[i].EffectsTargetsID == 1) effects_allies = 1;
		if(effects[i].EffectsTargetsID == 2) effects_enemies = 1;
	}
	if(effects_allies && effects_enemies) return 0;
	if(!effects_allies && !effects_enemies) return 0;
	if(effects_allies && !effects_enemies) return 1;
	if(!effects_allies && effects_enemies) return 2;
	alert('EffectsTargetsID not found');
}

EffectController.DiceRoll = function(action_level, MaxPerLevel, PerEveryLevelStart, EveryLevelNum, DiceRollBase, DiceRollPer)
{
	//onsole.log('action_level',action_level);
	//onsole.log(('Damage: '+DiceRollPer.NumDice+'D'+DiceRollPer.DieType+' per level'));
	var roll = 0;
	var mod = 0;
	var roll_comment = '';
	var dice_type_comment = '';
	var thisRollComment = ''
	var roll_result = 0;
	
	if(DiceRollBase)
	{
		for(var numDice=0; numDice < parseInt(DiceRollBase.NumDice); numDice++)
		{
			var thisRoll = Math.floor(Math.random()*parseInt(DiceRollBase.DieType)+1);
			thisRollComment += (numDice>0?'+':'')+thisRoll;
			roll += thisRoll;
		}
		mod += parseInt(DiceRollBase.RollMod);
	}
	
	if(DiceRollPer)
	{
		MaxPerLevel = parseInt(MaxPerLevel);
		var effictive_action_level = (MaxPerLevel > 0 && action_level > MaxPerLevel) ? MaxPerLevel : action_level;
		var levelStart = parseInt(PerEveryLevelStart) > 0 ? parseInt(PerEveryLevelStart) : 1;
		var levelIncrement = parseInt(EveryLevelNum) > 0 ? parseInt(EveryLevelNum) : 1;
		var diceRolledCount = 0;
		
		for(var levelCount=levelStart; levelCount <= effictive_action_level; levelCount = levelCount+levelIncrement)
		{
			for(var numDice=1; numDice <= parseInt(DiceRollPer.NumDice); numDice++)
			{
				var thisRoll = Math.floor(Math.random()*parseInt(DiceRollPer.DieType)+1);
				thisRollComment += (diceRolledCount>0?'+':'')+thisRoll;
				roll += thisRoll;
				diceRolledCount++;
			}
			mod += parseInt(DiceRollPer.RollMod);
		}
	}
	
	roll_result = roll + mod;
	//if base roll
	if(DiceRollBase)
	{
		roll_comment += parseInt(DiceRollBase.NumDice)>0 ? parseInt(DiceRollBase.NumDice)+'D'+DiceRollBase.DieType : '';
		dice_type_comment += parseInt(DiceRollBase.NumDice)>0 ? parseInt(DiceRollBase.NumDice)+'D'+DiceRollBase.DieType : '';
	}
	//if base and per rolls
	if(DiceRollBase && parseInt(DiceRollBase.NumDice)>0 && DiceRollPer && diceRolledCount>0)
	{
		roll_comment += ' + ';
		dice_type_comment += ' + ';
	}
	//if per roll
	if(DiceRollPer)
	{
		roll_comment += diceRolledCount>0 ? diceRolledCount+'D'+DiceRollPer.DieType : '';
		dice_type_comment += diceRolledCount>0 ? diceRolledCount+'D'+DiceRollPer.DieType : '';
	}
	roll_comment += (thisRollComment!=''?' ('+thisRollComment+')':'')+(mod>0&&thisRollComment!='' ? ' +' : '')+(mod!=0 ? mod : '');
	return {'roll_comment':roll_comment, 'dice_type_comment':dice_type_comment, 'roll_result':roll_result};
}

EffectController.AddEffectsToCharacter = function(character_stats, casted_character_stats, action_data, effect_duration, effectDurationCountdownOnInitValue, SaveDC)
{
	//character_stats.save_made
	var returnText = '';
	//make a copy of the effect
	
	for(var i=0; i<action_data.effects.length; i++)
	{
		//make sure this character is a valid target for the effect
		//target id type (ally or enemy)
		if(action_data.effects[i].EffectsTargetsID == 2 && character_stats.GoodGuy) continue;
		if(action_data.effects[i].EffectsTargetsID == 1 && !character_stats.GoodGuy) continue;
		//target type / subtype
		
		//???check here for the effect to remove other effects, i.e. remove paralysis, remove fear, protect evil - offer another save vs. enchantment
		//might need to check before this function called for effects with no duration, this doesn't run
		//if 
		
		//does the target already have this effect on them?
		for(var j=character_stats.effects.length-1; j>=0; j--)
		{
			//compare effectID (if the same effect but cast from the other side, like a prayer cast by enemies, will have different EffectIDs for good/bad effects)
			//if it's not a summoning spell (except polymorph), erase old effect, each spell has it's own set of creatures that were summoned and will disappear
			if((character_stats.effects[j].effect.EffectSummonID == 0 || character_stats.effects[j].effect.EffectSummon[0].IsPolymorph) && character_stats.effects[j].EffectID == action_data.effects[i].EffectID)
			{
				if(1)//check if it has a longer duration
				{
					//onsole.log('replacing effect',character_stats.effects[j],action_data.effects[i]);
					character_stats.effects.splice(j, 1);
				}
				else
				{
					//onsole.log('going with old effect');
					continue;
				}
			}
		}
		
		//move this to target select routine
		if(action_data.effects[i].OnlyEffectsCreatureTypeID != 0 && action_data.effects[i].OnlyEffectsCreatureTypeID != character_stats.CreatureTypeID) continue;
		//***SUB TYPES***
		
		//onsole.log('action_data.effects[i]',action_data.effects[i]);
		
		//ready to apply effect to target
		var effect = JSON.parse(JSON.stringify(action_data.effects[i]));
		
		//is this character immune to the effect: condition / type(action_data.action == 'spells' immune to spells?) / 
		//does this character already have the effect applied
		
		//if this new effect has conditions it will apply to the character
		if(effect.EffectConditionID != 0)
		{
			if(effect.IsAllowSave && character_stats.save_made)
			{
				returnText += character_stats.character_name+' resists the effect!';
				continue;
			}
			//set deletion counters for if an effect is to be removed from a character
			//i.e. the old effect condition is overpowered by the new condition
			var del_cs_effect_counter, del_cs_effect_condition_counter = -1;
			var del_new_effect_condition_counter = [];
			//for each effect currently on character
			check_effects_loop:
			for(var cs_effect_counter in character_stats.effects)
			{
				//if this effect on the character is applying conditions
				if(character_stats.effects[cs_effect_counter].effect.EffectConditionID != 0)
				{
					//for each condition this effect is applying on the character
					for(var cs_effect_condition_counter in character_stats.effects[cs_effect_counter].effect.EffectCondition)
					{
						//compare these conditions with each condition this new effect will apply on the character
						for(var this_effect_condition_counter in effect.EffectCondition)
						{
							if(parseInt(effect.EffectCondition[this_effect_condition_counter].EffectConditionTypeID) == character_stats.effects[cs_effect_counter].effect.EffectCondition[cs_effect_condition_counter].EffectConditionTypeID)
							{
								//if so go with higher effect_duration, remove lower effect_duration effect
								if(character_stats.effects[cs_effect_counter].RoundsLeft >= effect_duration)
								{
									//onsole.log('Effect condition \''+effect.EffectCondition[this_effect_condition_counter].ConditionName+'\' not applied, the current condition of this type has a >= duration')
									returnText += character_stats.character_name+' is already '+effect.EffectCondition[this_effect_condition_counter].ConditionName+'<br/>';
									//set delete counter for the new effect condition to be removed
									del_new_effect_condition_counter.push(JSON.parse(JSON.stringify(this_effect_condition_counter)));
								}
								else
								{
									//set condition (effect) deletion counters
									del_cs_effect_counter = cs_effect_counter;
									del_cs_effect_condition_counter = cs_effect_condition_counter;
									returnText = effect.EffectCondition[this_effect_condition_counter].ConditionName+' condition has been reinforced<br/>';
								}
							}
						}
					}
				}
			}
			if(del_cs_effect_counter != -1 && del_cs_effect_condition_counter != -1)
			{
				//remove this condition from this effect on the character:
				character_stats.effects[del_cs_effect_counter].effect.EffectCondition.splice(del_cs_effect_condition_counter, 1)
				//onsole.log('Old condition removed:',character_stats.effects[del_cs_effect_counter].effect.EffectCondition);
				//onsole.log(character_stats.effects);
			}
			for(var i=del_new_effect_condition_counter.length-1; i>=0; i--)
			{
				effect.EffectCondition.splice(del_new_effect_condition_counter[i], 1);
			}
		}
		
		var character_effect = {
				'EffectID' : effect.EffectID,
				'EffectTypeTable' : effect.EffectTypeTable,
				'CharacterIDWhoCasted' : casted_character_stats.character_id,
				'CastedByCreatureTypeID' : casted_character_stats.CreatureTypeID,
				'CastedBySubTypes' : [],//casted_character_stats.CreatureSubTypeID,
				'action_level' : (typeof action_data.action_level == 'undefined') ? 0 : action_data.action_level,
				'TotalDuration' : effect_duration,
				'RoundsLeft' : effect_duration,
				'InitiativeStarted' : effectDurationCountdownOnInitValue,
				'SaveDC' : SaveDC,
				'EffectName' : effect.EffectName,
				'EffectData' : 0,
				'DiceRollResult' : effect.DiceRollResult,
				//ADD EFFECT DICE ROLL RESULT!!! //only need to save 1 result (attack mods have damage and attack bonuses, but none have a roll for both*)
				'effect' : effect
			}
		
		/*
		effect contains
			effect.IsDurationCountdownOnCharacterTurn
			effect.CancelAtWill
			effect.SaveID
			effect.SaveEveryRound
		*/
		
		//if it's a summon, add effect to caster_character_stats
		if(effect.EffectSummonID != 0 && !effect.EffectSummon[0].IsPolymorph)
		{
			casted_character_stats.effects.push(character_effect);
		}
		else
		{
			character_stats.effects.push(character_effect);
		}
		
		for(i in effect.EffectCondition)
		{
			returnText += character_stats.character_name+' is '+effect.EffectCondition[i].ConditionName+'<br/>';
		}
	}
	return returnText;
}

//SELECTING CLASS ABILITY
EffectController.ChooseClassAbility = function(action_data, character_index)
{
	//class ability selection option, have player choose an ability from the options, then save the selection, then reload the character ability menu
	var ability_id = action_data.effects[0].AbilityID;
	var ability_rank = action_data.effects[0].AbilityRank;
	var icon_image = 0;
	var effect_id = 0;
	var effect_name = '';
	var classAbilityMenu = [];
	for(var i in action_data.effects)
	{
		icon_image = action_data.effects[i].EffectIconName;
		effect_id = action_data.effects[i].EffectID;
		effect_name = action_data.effects[i].EffectName;
		classAbilityMenu.push(new MenuController.MenuItem(icon_image, effect_name, 'EffectController.SelectedClassAbility('+ability_id+','+ability_rank+','+effect_id+','+character_index+')', []));
	}
	MenuController.CreateMenu(-1, action_data.effects.length, classAbilityMenu, 0, true);
	var backMenuEvent = "onclick='MenuController.MenuClose()'";
	$('#game-menu-inner').append(MenuController.currentMenuItem.CreateRingIcon(backMenuEvent, MenuController.centerY, MenuController.centerX, true, false));
}

//SELECTED THE CLASS ABILITY
EffectController.SelectedClassAbility = function(ability_id, ability_rank, effect_id, character_index)
{
	var character_id = GameController.characters[character_index].character_stats.character_id;
	//ActionController.PrintActionInfo(ability_id+' '+effect_id+' '+character_id+'<br/>');
	MenuController.MenuClose();
	var message = 'Class ability chosen.<br/><br/>'; 
	message += '<div style="margin-top:15px;" id=""><span id="selected-button" class="button selected" onclick="MenuController.MenuClose();">OK</span></div>';
	MenuController.DisplayMessage(message);
	//save the selection
	$.ajax({
			type: 'POST',
			async: false,
			url: './php/character_save/character_save_selected_class_ability.php',
			data: {'ability_id':ability_id, 'ability_rank':ability_rank, 'effect_id':effect_id, 'character_id':character_id}
		})
			.done(function(data) { 
					//onsole.log(data);
					//reload characters menu
					//dont close the menu or message dissapears
					MenuController.MenuInit(true);
				});
}

//SELECTING SUB ABILITY - effect has multiple sub options, or summoning/polymorphing options
EffectController.ChooseSubAbility = function(action_data, data_index, character_index, EffectSummonID)
{
	//onsole.log(action_data);
	//if ability requires effect sub-selection, have player choose an effect from the options
	var icon_image = 0;
	var effect_name = '';
	var subAbilityMenu = [];
	if(data_index.constructor === Array)
	{
		data_index = '['+data_index[0]+','+data_index[1]+','+data_index[2]+']';
	}
	//summoning / polymorph selection
	//just use the multiple effects for now >,<
	if(EffectSummonID != 0)
	{
		for(var i in action_data.effects[0].EffectSummon[0].EffectSummonCreatures)
		{
			icon_image = 'char/thumb/charthumb_'+action_data.effects[0].EffectSummon[0].EffectSummonCreatures[i].ThumbPicID+'.png';
			effect_name = action_data.effects[0].EffectSummon[0].EffectSummonCreatures[i].Name;
			subAbilityMenu.push(new MenuController.MenuItem(icon_image, effect_name, 'ActionController.process_battle_action("'+action_data.action_type+'",'+data_index+','+i+','+character_index+')', []));
		}
	}
	//sub effect selection
	else
	{
		for(var i in action_data.effects)
		{
			icon_image = action_data.effects[i].EffectIconName;
			effect_name = action_data.effects[i].EffectName;
			subAbilityMenu.push(new MenuController.MenuItem(icon_image, effect_name, 'ActionController.process_battle_action("'+action_data.action_type+'",'+data_index+','+i+','+character_index+')', []));
		}
	}
	MenuController.CreateMenu(-1, subAbilityMenu.length, subAbilityMenu, 0, true);
	var backMenuEvent = "onclick='MenuController.MenuCloseOvertop()'";
	$('#game-menu-overtop').append(MenuController.currentMenuItem.CreateRingIcon(backMenuEvent, MenuController.centerY, MenuController.centerX, true, false));
}

//CHECKING EFFECTS
EffectController.CheckEffectConditions = function(character_stats, type)
{
	//return true if character has a condition equal to 'type'
	for(var i in character_stats.effects)
	{
		//if this effect on the character has conditions
		if(character_stats.effects[i].effect.EffectConditionID != 0)
		{
			//for each condition this effect is applying on the character
			for(var j in character_stats.effects[i].effect.EffectCondition)
			{
				var condition = character_stats.effects[i].effect.EffectCondition[j];
				//onsole.log(character_stats.character_name+' condition:', condition);
				if(condition.ConditionName == type) return true;//
			}
		}
	}
	return false;
}

EffectController.GetEffectTypeMods = function(character_stats, modType, secondaryType, vs_character_stats, trigger_type, getForStatsView, isOffHandAttack)
{
	if(arguments.length < 3) secondaryType = 0;
	if(arguments.length < 4) vs_character_stats = 0;
	if(arguments.length < 5) trigger_type = 0;
	if(arguments.length < 6) getForStatsView = 0;
	if(arguments.length < 6) isMainHandOrOffHand = 0;//1 == main, 2 == offhand
	
	var continuous_ability_effects = [];
	
	//collect effects of equipped items (armor, weapon, eqipment)
	
	//only check continuous effects -> effects[j].ActionTypeID == 5
		//reflexive effects (trigger_type) -> effects[j].ActionTypeID == 6
	
	//PCs have ability_data 'character_stats.ability_data'
	//abilityData.racial - abilityData.class - abilityData.faction - abilityData.feat
	
	//place in 'character_stats.ability_data.passive'
	if(typeof character_stats.ability_data !== 'undefined')
	{
		var action_data = character_stats.ability_data.class;
		for(var i in action_data)
		{
			if(action_data[i].effects != 0)//just in case there's no effect set for this ability
			{
				for(var j=0; j<action_data[i].effects.length; j++)
				{
					//REFLEXIVE = //reflexive effects (trigger_type) -> effects[j].ActionTypeID == 6
					if(action_data[i].effects[j].ActionTypeID == 5 || action_data[i].effects[j].ActionTypeID == 6)
					{
						continuous_ability_effects.push({'effect':action_data[i].effects[j]});
					}
				}
			}
		}
	}
	
	//all characters have special abilities 'character_stats.action_data.special_action_data'
	//(currently not used with PCs)
	var special_action_data = character_stats.action_data.special_action_data;
	for(var i in special_action_data)
	{
		if(special_action_data[i].effects)//just in case there's no effect set for this ability
		{
			for(var j=0; j<special_action_data[i].effects.length; j++)
			{
				if(special_action_data[i].effects[j].ActionTypeID == 5)
				{
					continuous_ability_effects.push({'effect':special_action_data[i].effects[j]});
				}
			}
		}
	}
	
	var item_effects = [];
	//armor
	if(typeof character_stats.ArmorArr != 'undefined')
	{
		for(var i=0; i<character_stats.ArmorArr.length; i++)
		{
			if(character_stats.ArmorArr[i].Equipped && character_stats.ArmorArr[i].effects)
			{
				for(var j=0; j<character_stats.ArmorArr[i].effects.length; j++)
				{
					item_effects.push({'effect':character_stats.ArmorArr[i].effects[j]});
				}
			}
		}
		//weapons
		for(var i=0; i<character_stats.WeaponArr.length; i++)
		{
			if((character_stats.WeaponArr[i].Equipped && character_stats.WeaponArr[i].effects)
				&& (isOffHandAttack == character_stats.WeaponArr[i].OffHand))
			{
				for(var j=0; j<character_stats.WeaponArr[i].effects.length; j++)
				{
					item_effects.push({'effect':character_stats.WeaponArr[i].effects[j]});
				}
			}
		}
		//equipment
		for(var i=0; i<character_stats.EquipArr.length; i++)
		{
			if(character_stats.EquipArr[i].Equipped && character_stats.EquipArr[i].effects)
			{
				for(var j=0; j<character_stats.EquipArr[i].effects.length; j++)
				{
					item_effects.push({'effect':character_stats.EquipArr[i].effects[j]});
				}
			}
		}
	}
	//all naturally ongoing effects from abilities, action type continuous (5)
	//if trigger_type then also check for ability effects that match this reflexive trigger, i.e. sneak attack, EffectHPMod for target_no_dex
	
	//onsole.log('character_stats.effects',character_stats.effects);
	//onsole.log('item_effects',item_effects);
	
	
	//effects for -> character_stats.effects -> equipped item effects, weapon effects, armor effects
	var all_effect_lists = [item_effects, continuous_ability_effects, character_stats.effects];
	var effect_mod_type_list = {};
	var effect_note_list = [];
	
	//check all effects statuses for trigger
	
	//SPECIAL EFFECTS
	//check vision effects
	if(modType == 'vision')
	{
		effect_mod_type_list.Light_Minor = 0;
		effect_mod_type_list.Light_Major = 0;
		effect_mod_type_list.Darkvision = 0;
		//all three lists
		for(var list_i=0; list_i<all_effect_lists.length; list_i++)
		{
			var effect_list = all_effect_lists[list_i];
			for(var i=0; i<effect_list.length; i++)
			{
				if(effect_list[i].EffectName == 'Equipment_Torch' || effect_list[i].EffectName == 'Spells_Light')//holding a torch//has cast light spell
				{
					effect_mod_type_list.Light_Minor = 1;
				}
				else if(effect_list[i].EffectName == 'Spells_Darkvision')
				{
					effect_mod_type_list.Darkvision = 1;
				}
			}
		}
	}
	//STANDARD EFFECT TABLES
	else
	{
		//there are 18 different effect mod types
		for(var i=1; i<=18; i++)
		{
			//store mod and dieRoll
			effect_mod_type_list[i] = {'mod':0, 'dice':0};
		}
		
		var mod = 0;
		var total_mod = 0;
		var effect_note = '';
		
		var dice_list = [];
		
		//all three lists
		for(var list_i=0; list_i<all_effect_lists.length; list_i++)
		{
			var effect_list = all_effect_lists[list_i];
			
			for(var i=0; i<effect_list.length; i++)
			{
				
				//does this effect only apply vs. specific target creature type? i.e. only vs. evil
				// if vs_character_stats provided, then check to make sure the creature is of the right type before applying any effect bonus
				// if vs_character_stats == 0 then this is only checking modifiers for character sheet
				
				//set type matches by default, to allow mod to be added
				var target_type_matches = 1;
				//if effect applies to special target type, and no target given
				if(vs_character_stats == 0 && (effect_list[i].effect.AppliesVsCreatureTypeID || effect_list[i].effect.AppliesVsCreatureSubTypeID))
				{
					target_type_matches = 0;
				}
				//check type for given target
				else if(vs_character_stats != 0 && (effect_list[i].effect.AppliesVsCreatureTypeID || effect_list[i].effect.AppliesVsCreatureSubTypeID))
				{
					//if check must be made, set type matches to 0, if checks then set to 1
					target_type_matches = 0;
					
					var AppliesVsCreatureSubTypeID = effect_list[i].effect.AppliesVsCreatureSubTypeID
					if(AppliesVsCreatureSubTypeID != 0)
					{
						if(vs_character_stats.CreatureSubTypeID.length > 0)
						{
							for(var subtype_i=0; subtype_i<vs_character_stats.CreatureSubTypeID.length; subtype_i++)
							{
							 if(AppliesVsCreatureSubTypeID == vs_character_stats.CreatureSubTypeID[subtype_i]) target_type_matches = 1;
							}
						}
					}
					
					var AppliesVsCreatureTypeID = effect_list[i].effect.AppliesVsCreatureTypeID
					if(AppliesVsCreatureTypeID != 0 && vs_character_stats.CreatureTypeID != AppliesVsCreatureTypeID)
					{
						target_type_matches = 0;
					}
				}
				
				var this_effect_mod_type = effect_list[i].effect.EffectModTypeID;//EffectModTypeID is base effect info
					
				var this_effect_type_list = effect_list[i].effect[modType];//gets list of effects of a certain type, i.e. HPModEffects
				
				//CUSTOM CODED SPELLS
				if(secondaryType == 'CriticalRange')
				{
					if(effect_list[i].effect.EffectName == 'Spells_Keen_Edge') return true;
					this_effect_type_list = [];//custom coded spells don't have any of the effect mod arrays set
				}
				//---
				
				//did someone forget to set EffectModType?
				if(this_effect_mod_type == 0 && effect_list[i].effect.EffectSummonID == 0)
				{
					//dont log for summon/poly spells
					console.log('EffectModTypeID not set, possible problem for some effects',effect_list[0].effect);
					//alert(effect_list[0].effect.EffectName+': EffectModTypeID not set!');
				}
				else
				{
					for(var j=0; j<this_effect_type_list.length; j++)
					{
						var this_effect = this_effect_type_list[j];
						
						mod = 0;
						effect_note = '';
						
						//EffectAttackMod
						if(modType == 'EffectAttackMod')
						{
							if(secondaryType == 'Attack')
							{
								//if adding to attack from an alternate stat
								mod = CharacterController.GetAttributeBonus(character_stats, this_effect.HitModAttributeID);
								var diceRoll = EffectController.DiceRoll(effect_list[i].action_level, this_effect.HitModMaxPerLevel, this_effect.HitModPerEveryLevelStart, this_effect.HitModPerEveryLevelNum, this_effect.HitModDiceRollBase, this_effect.HitModDiceRollPer);
								mod += diceRoll.roll_result;
							}
							else if(secondaryType == 'Damage')
							{
								//if adding to damage from an alternate stat
								mod = CharacterController.GetAttributeBonus(character_stats, this_effect.DamageModAttributeID);
								//onsole.log('effect_list[i].action_level, this_effect.DamageModMaxPerLevel, this_effect.DamageModPerEveryLevelStart, this_effect.DamageModPerEveryLevelNum, this_effect.DamageModDiceRollBase, this_effect.DamageModDiceRollPer');
								//onsole.log(effect_list[i].action_level, this_effect.DamageModMaxPerLevel, this_effect.DamageModPerEveryLevelStart, this_effect.DamageModPerEveryLevelNum, this_effect.DamageModDiceRollBase, this_effect.DamageModDiceRollPer);
								var diceRoll = EffectController.DiceRoll(effect_list[i].action_level, this_effect.DamageModMaxPerLevel, this_effect.DamageModPerEveryLevelStart, this_effect.DamageModPerEveryLevelNum, this_effect.DamageModDiceRollBase, this_effect.DamageModDiceRollPer);
								
								//this kinda sucks! saving the dice for later...
								if(diceRoll.roll_result > 0)
								{
									//dice_list.push({'action_level':0, 'max_per_level':this_effect.DamageModMaxPerLevel, 'per_every_level_start':this_effect.DamageModPerEveryLevelStart, 'per_every_level_num':this_effect.DamageModPerEveryLevelNum, 'dice_roll_base':this_effect.DamageModDiceRollBase, 'dice_roll_per':this_effect.DamageModDiceRollPer});
									dice_list.push({'action_level':effect_list[i].action_level, 'max_per_level':this_effect.DamageModMaxPerLevel, 'per_every_level_start':this_effect.DamageModPerEveryLevelStart, 'per_every_level_num':this_effect.DamageModPerEveryLevelNum, 'dice_roll_base':this_effect.DamageModDiceRollBase, 'dice_roll_per':this_effect.DamageModDiceRollPer});
								}
								
								//if getting info for chatacter stats display, and this mod add a dice roll, show the die num and type instead of the result
								if(getForStatsView && diceRoll.dice_type_comment.indexOf('D') >= 0){
									effect_note = '+'+diceRoll.dice_type_comment+' '+effect_list[i].effect.EffectName;//just the dice i.e. 3d6 + effect name for display
								}else
									mod += diceRoll.roll_result;//actual dice roll result
							}
							if(secondaryType == 'pass_dr' && this_effect.PassDRTypeID != -1)
							{
									//this only works for character having one PassDRTypeID
									var dr_types = ['Pass all DR','Cold Iron','Silver','Adamantine','Good','Evil','Lawful','Chaotic'];
									var dr_type_name = dr_types[this_effect.PassDRTypeID];
									effect_note = dr_type_name+'/'+this_effect.PassDRMaxAmount;
									if(this_effect.PassDRTypeID == 0 || this_effect.PassDRMaxAmount == 0) effect_note = dr_type_name;//'Pass all DR'
							}
						}
						else if(modType == 'EffectACMod')
						{
							mod = CharacterController.GetAttributeBonus(character_stats, this_effect.ACModAttributeID);
							var diceRoll = EffectController.DiceRoll(effect_list[i].action_level, this_effect.ACModMaxPerLevel, this_effect.ACModPerEveryLevelStart, this_effect.ACModPerEveryLevelNum, this_effect.ACModDiceRollBase, this_effect.ACModDiceRollPer);
							mod += diceRoll.roll_result;
						}
						else if(modType == 'EffectHPMod')
						{
							if(secondaryType == 0 || this_effect.EffectHPModTypeID == secondaryType)
							{
								if(effect_list[i].DiceRollResult)
								{
									mod = effect_list[i].DiceRollResult;
								}
								else
								{
									var diceRoll = EffectController.DiceRoll(effect_list[i].action_level, this_effect.HPModMaxPerLevel, this_effect.HPModPerEveryLevelStart, this_effect.HPModPerEveryLevelNum, this_effect.HPModDiceRollBase, this_effect.HPModDiceRollPer);
									mod = diceRoll.roll_result;
								}
							}
						}
						else if(modType == 'EffectAttributeMod')
						{
							if(this_effect.AttributeID == secondaryType || this_effect.IsAllAttributes) mod = this_effect.Mod;
						}
						else if(modType == 'EffectSaveMod')
						{
							if(this_effect.SaveID == secondaryType || this_effect.IsAllSaves)
							{
								mod = CharacterController.GetAttributeBonus(character_stats, this_effect.SaveModAttributeID);
								mod += this_effect.SaveMod;
							}
						}
						else if(modType == 'EffectMovementMod')
						{
							if(this_effect.MoveTypeID == secondaryType)
							{
								mod = this_effect.MovementMod;
							}
						}
						else if(modType == 'EffectSkillMod')
						{
							if(this_effect.SkillID == secondaryType || this_effect.IsAllSkills) mod = this_effect.SkillMod;
						}
						
						//check for highest mod of that type
						//THIS CAN BE UPDATED LATER TO SHOW SPECIAL MODS SEPERATLY IN THE NOTE
						//this_effect_mod_type == 0 ???
						if(target_type_matches && (this_effect_mod_type == 8 || effect_mod_type_list[this_effect_mod_type].mod < mod))//mod type 8, 'Inherent', stacks - default mod type
						{
							//stacking
							if(this_effect_mod_type == 8) mod += effect_mod_type_list[this_effect_mod_type].mod
							
							effect_mod_type_list[this_effect_mod_type].mod = mod;
						}
						
						//special note
						if(effect_list[i].effect.AppliesVsCreatureTypeID || effect_list[i].effect.AppliesVsCreatureSubTypeID)
						{
							if(mod == 0)
								effect_note += ' vs.';
							else
								effect_note += (mod>0?' +':' ')+mod+' vs.';
						
							effect_note += (effect_list[i].effect.AppliesVsCreatureTypeID ? ' '+effect_list[i].effect.AppliesVsTypeName : '')
								+(effect_list[i].effect.AppliesVsCreatureSubTypeID ? ' '+effect_list[i].effect.AppliesVsSubTypeName : '');
						}
						
						if(effect_note != '') effect_note_list.push(effect_note);
					}
				}
			}
		}
		
		//total the mods
		for(var i=1; i<=18; i++)//1 to 18 different mod types, 0 is unselected
		{
			total_mod += effect_mod_type_list[i].mod;
		}
		
	}
	
	//CUSTOM CODED SPELLS
	if(secondaryType == 'CriticalRange') return false;
	
	if(effect_note_list.length == 0)
		effect_note_list.push('');
		
	return {'dice_list':dice_list, 'effect_mod_type_list':effect_mod_type_list, 'total_mod': total_mod, 'effect_note_list': effect_note_list};
}

//RUNNING EFFECTS
//summon creatures, create character data
EffectController.SummonCreatures = function(summoner_character_stats, quick_stat_id, totalSummoned, character_index_polymorphed, is_familiar)
{
	if(arguments.length < 4) character_index_polymorphed = -1;
	if(arguments.length < 5) is_familiar = 0;
	var currentNumEffects = summoner_character_stats.effects.length;
	var callback = function(data)
	{
		EffectController.CreateSummoned(summoner_character_stats, currentNumEffects, data, totalSummoned, summoner_character_stats.GoodGuy, character_index_polymorphed, is_familiar);
		GameController.resources_loaded++;//create_npc_monster complete
	}
	
	GameController.resources_loading++
	var summon_data = {
			'AreaID': GameController.area_id, 
			'x': GameController.characters[BattleController.current_character_stats_index].x, 
			'y': GameController.characters[BattleController.current_character_stats_index].y, 
			'name': 'Summoned Creature', 
			//'quick_stat_catagory_id': 3, //will we need this?
			'sprite_id': -1, 
			'thumb_pic_id': -1, 
			//special variables for summoning in 'create_npc_monster.php'
			'player_character_id': GameController.player.character_id,
			'summoned_by_character_id': summoner_character_stats.character_id,
			'is_polymorph': character_index_polymorphed != -1 ? GameController.characters[character_index_polymorphed].character_stats.character_id : 0, // if > 0 is polymorph
			'is_familiar': is_familiar,
			'summoner_good_guy': summoner_character_stats.GoodGuy, //set MasterCharacter CatagoryID / ? quick_stat_catagory_id ? to match if GoodGuy or not (NPC = 2, Monster = 3)
			'num_summoned': totalSummoned,
		};
	ajax_action('create_npc_monster.php', quick_stat_id, summon_data, callback, false);
}

EffectController.CreateSummoned = function(summoner_character_stats, currentNumEffects, data, totalSummoned, GoodGuy, character_index_polymorphed, is_familiar)
{
	var game = GameController;
	var parsedData = $.parseJSON(data);
	var character_id_arr = parsedData[0];
	var character_stats_master = parsedData[1];
	character_stats_master.hp = parseInt(character_stats_master.hp);
	character_stats_master.hp_damage = parseInt(character_stats_master.hp_damage);
	//is it a GoodGuy summon?
	character_stats_master.GoodGuy = GoodGuy;
	
	//console.log(character_stats_master);
	
	//polymorph
	if(character_index_polymorphed != -1)
	{
		var character_polymorphed = GameController.characters[character_index_polymorphed];
		var character_stats_polymorphed = character_polymorphed.character_stats;
		//polymorph 'summoner'
		character_stats_polymorphed.is_polymorph_qsid = character_stats_master.quick_stat_id;
		character_stats_polymorphed.poly_character_stats = character_stats_master;
		//update the action data of character polymorphed
		ActionController.PolyMenuUpdate(character_stats_polymorphed, character_index_polymorphed);
		character_polymorphed.poly_sprite = new Image();
		character_polymorphed.poly_sprite.src = "./images/"+character_stats_master.sprite_file;
		game.resources_loading++;
		character_polymorphed.poly_sprite.onload = function(){
				//redraw characters
				game.redraw_map_on_player_position();
				game.resources_loaded++;
			}
		var roll_comment = character_stats_polymorphed.character_name+' has shape shifted into a'
			+(['a', 'e', 'i', 'o', 'u'].indexOf(character_stats_polymorphed.poly_character_stats.temp_name[0].toLowerCase()) !== -1 ? 'n':'')
			+' '+character_stats_polymorphed.poly_character_stats.temp_name+'!<br/>';
		ActionController.PrintActionInfo(roll_comment+'<br/>');
	}
	//summon
	else
	{
		//set summoners summon effect to store character id array of characters summoned, when effect removed, remove these character ids
		//store character_id_arr to character_stats, and later save into effect.effectData to store on DB
		summoner_character_stats.tempEffectData = character_id_arr;
		
		for(var i=0; i<totalSummoned; i++)
		{
			//making a copy of data by parsing new value
			var summoned_character_stats = JSON.parse(JSON.stringify(character_stats_master));
			summoned_character_stats.character_id = character_id_arr[i];
			summoned_character_stats.area_id = summoner_character_stats.area_id;
			game.characters.push(
				{
					'character_stats': summoned_character_stats,
					'quick_stat_id': summoned_character_stats.quick_stat_id,
					'conversation': 0,
					'PC': GoodGuy,
					'party_id': GoodGuy ? game.player.party_id : -1,
					'in_encounter': game.in_encounter,
					'highlight': 0,
					'x': game.characters[game.active_player_index].x,
					'y': game.characters[game.active_player_index].y,
					'move_destination_y': -1,
					'move_destination_x': -1,
					'character_sprite': new Image(),
					'sprite_coords': [-1,-1],
					'sprite_offset': [0,0]
				});
			var monster_index = game.characters.length - 1;
			var character = game.characters[monster_index];
			character.character_sprite.src = "./images/"+character.character_stats.sprite_file;
			game.resources_loading++;
			character.character_sprite.onload = function(){
					game.resources_loaded++;
				}
			
			if(character.party_id == GameController.player.party_id)
			{
				CharacterController.AddCharacterToParty(monster_index);//formation and main menu
			}
			else
			{
				if(game.in_encounter) BattleController.set_starting_positions();//monster battle position
				if(game.dev_mode)
				{
					//set menu as part of their character_stats for test control over monsters in battle, will have battle menu buttons available
					CharacterController.SetAbilityDataMenu(monster_index);
				}
				else
				{
					//basic action data required by monsters
					character.character_stats.action_data = ActionController.SetCharacterActionData(character.character_stats, monster_index);
				}
			}
			
			
			//---
			if(game.in_encounter)
			{
				BattleController.add_to_and_order_initiative_array(character.character_stats, summoner_character_stats);//passing summoner_character_stats places new addition right after that character in init order
				//if bad guy, move in, else player creature appears in spot
				//character.moving_into_battle = 1;
				//character.sprite_offset[0] = 300;
				//if(BattleController.move_into_battle_interval == 0) BattleController.move_into_battle_interval = setInterval(BattleController.move_into_battle, 60);
			}
		}
		
		//
		if(is_familiar)
			var roll_comment = 'The familiar has been summoned!<br/>';
		else
			var roll_comment = totalSummoned+' '+summoned_character_stats.temp_name+(totalSummoned>1?'s are':' is')+' summoned!<br/>';
		
		ActionController.PrintActionInfo(roll_comment+'<br/>');
		
		//wait for effect to be added to character, then transfer character_stats.tempEffectData to effect.EffectData, then save game
		EffectController.timerInterval = setInterval(function(){
			//summoning effect has been added && sprites are loaded
			if(currentNumEffects+1 == summoner_character_stats.effects.length && game.resources_loading == game.resources_loaded)
			{
				clearInterval(EffectController.timerInterval);
				//save game state with new creatures in existence
				summoner_character_stats.effects[summoner_character_stats.effects.length-1].EffectData = summoner_character_stats.tempEffectData;
				GameController.SaveGame(0);
			}
		}, 100);
	}
}

//FOR EFFECT GENERATOR
$(document).ready(function(){

	$(document.body).on('click','.remove-sub-form',function(){
		$(this).parent().remove();
	});
	
	//selection of main type
	$(document.body).on('change','#effect-type',function(){
		if($(this).val() == 'ability' || $(this).val() == 'special')
		{
			$('#frm-effects-abilities').show();
		}
		else
		{
			$('#frm-effects-abilities').hide();
			$('#AbilityEffectTypeID').val(0);
			$('#main-frm').show();
		}
	});
	
	//selecting it's a spell like ability
	$(document.body).on('change','#AbilityEffectTypeID',function(){
		if($(this).val()=='1')
		{
			$('#main-frm').hide();
			$('#Spell-Like').show();
		}
		else
		{
			$('#main-frm').show();
			$('#Spell-Like').hide();
		}
	});
	
	//select ability icon
	$(document.body).on('click','#select-icon img', function()
	{
		$('#select-icon img').css('border','4px solid #fff');
		$(this).css('border','4px solid #00f');
		$('#icon-path').val($(this).data('file'));
	});
	
	//toggle check-boxes
	$(document.body).on('click','.toggle-check',function(){
		var dataToggleId;
		dataToggleId = $(this).data('toggle-id');
		if($('#toggle-'+dataToggleId).css('display') == 'none')
		{
			$('#toggle-'+dataToggleId).show();
		}
		else
		{
			$('#toggle-'+dataToggleId).hide();
		}
	});
	
});

EffectController.PlayTestAnim = function()
{
	var animCastDuration = 0;
	if($('#AnimNameCast').val() != '')
	{
		animCastDuration = SpriteAnimController.StartAnimation(parseInt($('#AnimSpriteSheetCast').val()), $('#AnimNameCast').val(), 100, 150);
	}
	
	setTimeout(function()
	{
		var effect_data = {'R_min' : parseInt($('#R_min').val()) ,'G_min' : parseInt($('#G_min').val()), 'B_min' : parseInt($('#B_min').val()), 'R_max' : parseInt($('#R_max').val()), 'G_max' : parseInt($('#G_max').val()), 'B_max' : parseInt($('#B_max').val()), 'particle_count' : parseInt($('#particle_count').val()), 'shock_lines' : parseInt($('#shock_lines').val())};
		var animEffectDuration = CanvasAnimController.StartAnimation(effect_data, 100, 150, 400, 150);
		//onsole.log('animEffectDuration',animEffectDuration);
		if($('#AnimNameTarget').val() != '')
		{
			setTimeout(function()
			{
				SpriteAnimController.StartAnimation(parseInt($('#AnimSpriteSheetTarget').val()), $('#AnimNameTarget').val(), 400, 150);
			}, animEffectDuration*0.5);
		}
	}, animCastDuration*0.75);
}

EffectController.AddSubForm = function(fieldName)
{
	var templateSelector = '#template-frm-'+fieldName;
	$('#load-additional-forms').prepend($(templateSelector).html());
}

EffectController.AddSummonCreatureSubForm = function(e)
{
	$(e).parent().parent().append($('#template-frm-effectsummoncreatureid').html());
}

EffectController.CloseForm = function()
{
	if(GameController.edit)
	{
		$('#effect-editor-load').hide();
		return false;
	}
	CanvasAnimController.Init(document.getElementById('battle-particle-effects'));
	SpriteAnimController.SpriteAnimation.canvas = document.getElementById('battle-weapons-effects');
	SpriteAnimController.SpriteAnimation.ctx = document.getElementById('battle-weapons-effects').getContext('2d');
	$('#effect-editor-load').hide();
}

EffectController.EditEffect = function(action_data)
{
	var effect_title = action_data.action_type+'_'+action_data.name.replace(/[^A-Z0-9]+/ig, "_")
	var effect_type = action_data.action;
	var effect_type_id = action_data.id;
	//onsole.log(action_data);
	var ability_rank = typeof action_data.ability_rank == 'undefined' ? 0 : action_data.ability_rank;
	EffectController.LoadEffectEditor(effect_title, effect_type, effect_type_id, ability_rank);
}

EffectController.AddMultipleEffect = function(effect_title, effect_type, effect_type_id, ability_rank)
{
	EffectController.LoadEffectEditor(effect_title, effect_type, effect_type_id, ability_rank, 0, true);
}

EffectController.EditMultipleEffect = function(effect_title, effect_type, effect_type_id, ability_rank, effect_index)
{
	EffectController.LoadEffectEditor(effect_title, effect_type, effect_type_id, ability_rank, effect_index, false)
}


EffectController.DeleteAllEffect = function(effect_type_table, effect_type_field_id, effect_type_id)
{
	//$effectTypeTable = 'EffectsAbilities';
	//$effectTypeFieldID = 'AbilityID';
	//$effectTypeID
	//$abilityRank??
	
	//deletes all optional effects and main effect
	if(confirm('Are you sure you want to delete this effect?'))
	{
		$.ajax({
			type: "GET",
			async: true,
			url: './effect-gen.php?effecttypetable='+effect_type_table+'&deleteeffectid='+effect_type_id+'&effecttypefieldid='+effect_type_field_id,
			data: 0
		}).done(function(result){
			console.log(result);
			EffectController.CloseForm();
			//still need to remove from Special Ability list in editor
		});
	}
}

EffectController.DeleteMultipleEffect = function(effect_type_table, effect_id)
{
	//deletes on of the additional optional effects, not main effect
	if(confirm('Are you sure you want to delete this effect option?'))
	{
		$.ajax({
			type: "GET",
			async: true,
			url: './effect-gen.php?effecttypetable='+effect_type_table+'&deleteeffectid='+effect_id,
			data: 0
		}).done(function(result){
			alert('Deleted');
			$('#frm-effect-multiple img').eq(0).trigger('click');
		});
	}
}

EffectController.LoadEffectEditor = function(effect_title, effect_type, effect_type_id, ability_rank, effect_index, is_new_multiple)
{
	//for class abilities, must include rank
	var rank_string = ability_rank != 0 ? '&abilityrank='+ability_rank:0;
	if(arguments.length < 5) effect_index = 0;
	var new_multiple_string = (arguments.length >= 6 && is_new_multiple) ? '&newmultiple=1': '';
	
	$('#effect-editor-load').html('<h1>LOADING EFFECT EDITOR<h1/>');
	$.ajax({
		type: "GET",
		async: true,
		url: './effect-gen.php?title='+effect_title+'&effecttype='+effect_type+'&effecttypeid='+effect_type_id+'&effectindex='+effect_index+rank_string+new_multiple_string,
		data: 0
	}).done(function(result){
		$('#effect-editor-load').html(result);
		$('#effect-editor-load #select-icon-image-list').html($('#load-effect-gen-icon-select').html());
		$('#effect-editor-load #select-icon-image-list img').each(function()
		{
			if($(this).data('file') == $('#icon-path').val())
			{
				$(this).css('border','4px solid #00f');
			}
		});
	});
	
	$('#effect-editor-load').show();
}

EffectController.SaveEffect = function()
{
	if(!confirm('Save effect?')) return false;

	var effectarea_data = (typeof $('#load-additional-forms #frm-EffectArea').html() !== 'undefined')?
		$('#load-additional-forms #frm-EffectArea').serialize() : 0;
		
	var effecthpmod_data = (typeof $('#load-additional-forms #frm-EffectHPMod').html() !== 'undefined')? {
			data : $('#load-additional-forms #frm-EffectHPMod').serialize(), 
			dicerollbase : $('#load-additional-forms #frm-HPModDiceRollBase').serialize(), 
			dicerollper : $('#load-additional-forms #frm-HPModDiceRollPer').serialize()
		} : {data : 0};
		
	var effectcondition_data = (typeof $('#load-additional-forms #frm-EffectCondition').html() !== 'undefined')?
		$('#load-additional-forms #frm-EffectCondition').serialize() : 0;
	
	var effectattackmod_data = (typeof $('#load-additional-forms #frm-EffectAttackMod').html() !== 'undefined')? {
			data : $('#load-additional-forms #frm-EffectAttackMod').serialize(), 
			hitdicerollbase : $('#load-additional-forms #frm-HitModDiceRollBase').serialize(), 
			hitdicerollper : $('#load-additional-forms #frm-HitModDiceRollPer').serialize(),
			damagedicerollbase : $('#load-additional-forms #frm-DamageModDiceRollBase').serialize(), 
			damagedicerollper : $('#load-additional-forms #frm-DamageModDiceRollPer').serialize()
		} : {data : 0};
	
	var effectacmod_data = (typeof $('#load-additional-forms #frm-EffectACMod').html() !== 'undefined')? {
			data : $('#load-additional-forms #frm-EffectACMod').serialize(), 
			acdicerollbase : $('#load-additional-forms #frm-ACModDiceRollBase').serialize(), 
			acdicerollper : $('#load-additional-forms #frm-ACModDiceRollPer').serialize()
		} : {data : 0};
	
	var effectresistanceimmune_data = (typeof $('#load-additional-forms #frm-EffectResistanceImmune').html() !== 'undefined')?
		$('#load-additional-forms #frm-EffectResistanceImmune').serialize() : 0;
	
	var effectattributemod_data = (typeof $('#load-additional-forms #frm-EffectAttributeMod').html() !== 'undefined')?
		$('#load-additional-forms #frm-EffectAttributeMod').serialize() : 0;

	var effectskillmod_data = (typeof $('#load-additional-forms #frm-EffectSkillMod').html() !== 'undefined')?
		$('#load-additional-forms #frm-EffectSkillMod').serialize() : 0;

	var effectsavemod_data = (typeof $('#load-additional-forms #frm-EffectSaveMod').html() !== 'undefined')?
		$('#load-additional-forms #frm-EffectSaveMod').serialize() : 0;

	var effectmovementmod_data = (typeof $('#load-additional-forms #frm-EffectMovementMod').html() !== 'undefined')?
		$('#load-additional-forms #frm-EffectMovementMod').serialize() : 0;

	var effectactionmod_data = (typeof $('#load-additional-forms #frm-EffectActionMod').html() !== 'undefined')?
		$('#load-additional-forms #frm-EffectActionMod').serialize() : 0;

	var effectsummon_data = (typeof $('#load-additional-forms #frm-EffectSummon').html() !== 'undefined')? {
			data : $('#load-additional-forms #frm-EffectSummon').serialize(),
			summoncreatures : $('#load-additional-forms #frm-EffectSummonCreatures').serialize(),
			summondicerollbase : $('#load-additional-forms #frm-SummonDiceRollBase').serialize()
		} : {data : 0};
		
	var data = {
			action : 'save-effect', 
			effecttype : $('#effect-type').val(), 
			effecttypeid : $('#effect-type-id').val(), 
			effectability : ($('#effect-type').val() == 'ability' || $('#effect-type').val() == 'special')?$('#frm-effects-abilities').serialize():0, 
			//add data for multiple effects to 'effectdata'
			effectdata : $('#frm-effect').serialize()+'&'+$('#frm-icon').serialize()+'&'+$('#frm-animation').serialize(),  
			effectarea : effectarea_data,
			effecthpmod : effecthpmod_data,
			effectcondition : effectcondition_data,
			effectattackmod : effectattackmod_data,
			effectacmod : effectacmod_data,
			effectresistanceimmune : effectresistanceimmune_data,
			effectattributemod : effectattributemod_data,
			effectskillmod : effectskillmod_data,
			effectsavemod : effectsavemod_data,
			effectmovementmod : effectmovementmod_data,
			effectactionmod : effectactionmod_data,
			effectsummon : effectsummon_data
		}
		
	$.ajax({
		type: "POST",
		async: true,
		url: "./effect-gen.php",
		data: data
	})
		.done(function(result){
			try
			{
				var returnData=jQuery.parseJSON(result);
				var errors=returnData.errors;
			}
			catch(err)
			{
				alert('ERROR: '+result);
				errors=1;
			}
			
			if (errors==0)
			{
				$("#return-data").html('<div>'+returnData.returnOutput+'</div>');
				var EffectID=returnData.EffectID
				$('.EffectID').html(EffectID);
				
				if(confirm('Saved, close form and reload game menu?'))
				{
					EffectController.CloseForm();
					MenuController.editEffects = 0;
					$('#toggle-edit-effect').children('div').children('span').html('Edit');
					if(!GameController.edit)
					{
						MenuController.MenuClose();
						if(GameController.in_encounter)
						{
							MenuController.BattleReloadMenu();
						}
						else
						{
							//MenuController.MenuInit(true);
							//reload only the player whos ability has changed
						}
						//reload main menu?
					}
				}
				
			}
			else
			{
				alert(errors);
			}
		});
}

//FOR JS COLOR PICKER
function updateInfo(color) {
	document.getElementById('R_max').value = Math.floor(color.rgb[0]*255);
	document.getElementById('G_max').value = Math.floor(color.rgb[1]*255);
	document.getElementById('B_max').value = Math.floor(color.rgb[2]*255);
	document.getElementById('R_min').value = Math.floor(color.rgb[0]*255/2);
	document.getElementById('G_min').value = Math.floor(color.rgb[1]*255/2);
	document.getElementById('B_min').value = Math.floor(color.rgb[2]*255/2);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}