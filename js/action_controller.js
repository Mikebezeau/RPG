
var ActionController = ActionController || {};

ActionController.Init = function(topic_id, encounter_id)
{
	ActionController.aiActionWait = false;
	ActionController.topic_id = topic_id;
	ActionController.encounter_id = encounter_id;
}

ActionController.PolyMenuUpdate = function(character_stats, character_index)
{
	//attack action data and menu
	ActionController.UpdateCharacterAttackActionData(character_stats, character_index);
	
	//special abilities gained
	//var poly_special_data = '???';
	//character_stats.action_data.poly_special_data = poly_special_data;
	
	//items and equip will not be functional menu items, code in 'MenuController.CreateRing'
}

ActionController.UpdateCharacterAttackActionData = function(character_stats, character_index)
{
	//used in: ActionController.PolyMenuUpdate
	//attack action data and menu
	var attack_action_data = ActionController.GetCharacterAttackActionData(character_stats, character_index);
	character_stats.action_data.attack_action_data = attack_action_data;
	var attackMenu = MenuController.CreateCharacterAttackMenuItems(character_index);
	//remove old attack menu (if exists is first item in battle_menu)
	if(GameController.characters[character_index].character_stats.menu_data.battle_menu[0].description == 'Attack')
		GameController.characters[character_index].character_stats.menu_data.battle_menu.splice(0, 1);
	//place new attack menu as first item in battle_menu
	if(attackMenu.length > 0)
		GameController.characters[character_index].character_stats.menu_data.battle_menu.unshift(new MenuController.MenuItem('battle_icons/melee_mult.png', 'Attack', 0, attackMenu));
}

ActionController.GetCharacterAttackActionData = function(character_stats, character_index)
{
	var attack_action_data = [];
	
	if(character_stats.quick_stat_catagory_id == 1 && character_stats.poly_character_stats == 0)
	{
		var weapon_counter = 0;
		for(i in character_stats.WeaponArr)
		{
			//power attack feat id = 99
			//rapid attack feat id = 104, WeaponTypeID = 4 is the only ranged weapon type
			if(character_stats.WeaponArr[i].Equipped)
			{
				character_stats.WeaponArr[i].data_index = weapon_counter;
					weapon_counter++;
				character_stats.WeaponArr[i].party_stats_index = character_index;
				character_stats.WeaponArr[i].num_attacks = 1 + Math.floor((character_stats.bab - 1) / 5);
				attack_action_data.push(character_stats.WeaponArr[i]);
			}
		}
	}
	else
	{
		if(character_stats.poly_character_stats == 0)
			var this_character_stats = character_stats;
		else
			var this_character_stats = character_stats.poly_character_stats;
		
		for(i in this_character_stats.arr_quick_attack_id)
		{
			attack_action_data.push(
				{
					'action' : 'attack',
					'action_type' : 'attack',
					'target' : 1, //1 == select 1 target
					'data_index' : i,
					'party_stats_index' : character_index,
					'num_attacks' : this_character_stats.arr_attack_bonus[i].length,
					'submit' : 'm', //first letter of submit name - s for single and m for multiple attack
					'attack_name' : this_character_stats.arr_attack_name[i],
					'weapon_type_id' : this_character_stats.weapon_type_id[i],
					'weapon_class_id' : this_character_stats.weapon_class_id[i],
					'arr_attack_bonus' : this_character_stats.arr_attack_bonus[i],
					'attack_mod' : this_character_stats.arr_attack_bonus[i][0],
					'num_dice' : this_character_stats.arr_damage_die_num[i],
					'die_type' : this_character_stats.arr_damage_die_type[i],
					'damage_mod' : this_character_stats.arr_damage_mod[i],
					'arr_range_base' : this_character_stats.arr_range_base[i],
					'crit_range' : this_character_stats.arr_crit_range[i],
					'crit_mult' : this_character_stats.arr_crit_mult[i],
					'two_hand' : this_character_stats.arr_two_hand[i],
					'Equipped' : this_character_stats.arr_equipped[i],
					'OffHand' : this_character_stats.arr_off_hand[i],
					//'power_attack' : false,
					//'rapid_shot' : false,
					'effects' : this_character_stats.arr_attack_effect[i]
				});
		}
	}
	return attack_action_data;
}

ActionController.SetCharacterActionData = function(character_stats, character_index)
{
	if(arguments.length < 2) character_index = -1;
	var save_action_data = 
		[
			{
				'action' : 'save',
				'action_type' : 'save',
				'data_index' : 0,
				'party_stats_index' : character_index,
				'save_id' : 0,
				'save_type' : 'Fortitude',
				'stat_key' : 'fort'
			},
			{
				'action' : 'save',
				'action_type' : 'save',
				'data_index' : 1,
				'party_stats_index' : character_index,
				'save_id' : 1,
				'save_type' : 'Reflex',
				'stat_key' : 'ref'
			},
			{
				'action' : 'save',
				'action_type' : 'save',
				'data_index' : 2,
				'party_stats_index' : character_index,
				'save_id' : 2,
				'save_type' : 'Willpower',
				'stat_key' : 'will'
			},
		];
		
	var skill_action_data = [];
	//for each skill add dta object to array
	//skill_name, skill_mod
	for(i in character_stats.arr_skill_id)
	{
		skill_action_data.push(
			{
				'action' : 'skill',
				'action_type' : 'skill',
				'data_index' : i,
				'party_stats_index' : character_index,
				'skill_id' : character_stats.arr_skill_id[i],
				'skill_name' : character_stats.arr_skill_name[i],
				'skill_mod' : character_stats.arr_skill_roll[i]
			});
	}
	
	var attack_action_data = ActionController.GetCharacterAttackActionData(character_stats, character_index);
	
	var special_action_data = [];
	for(i in character_stats.arr_special_id)
	{
		special_action_data.push(
			{
				'id' : character_stats.arr_special_id[i],
				'action' : 'special',
				'action_type' : 'special',
				'action_level' : character_stats.hd,
				'data_index' : i,
				'party_stats_index' : character_index,
				'name' : character_stats.arr_special_name[i],
				'description' : character_stats.arr_special_description[i],
				'sprite_anim' : character_stats.arr_special_animname[i],
				'effects' : character_stats.arr_special_effect[i]
			});
	}
	return {'save_action_data' : save_action_data, 'skill_action_data' : skill_action_data, 'attack_action_data' : attack_action_data, 'special_action_data' : special_action_data};
}

ActionController.SelectTargetShow = function()
{
	$('#select-target').show();
	var baseFontSize = parseInt($('#select-target').css('font-size'));
	$('#select-target').css('font-size', (baseFontSize+15)+'px')
	var selectTargetInterval = setInterval(function()
		{
			var fontSize = parseInt($('#select-target').css('font-size'));
			fontSize -= Math.floor(fontSize/5);
			fontSize = fontSize < 1 ? 1 : fontSize;
			$('#select-target').css('font-size', fontSize+'px');
			if(fontSize <= baseFontSize)
			{
				$('#select-target').css('font-size', baseFontSize+'px');
				clearInterval(selectTargetInterval);
			}
		}, 100);
}

ActionController.process_battle_action = function(action_type, data_index, sub_effect_selected, active_character_index)
{
	//if called from confirmation, set arguments
	if(arguments.length == 0)
	{
		arguments = BattleController.process_battle_action_args;
		action_type = BattleController.process_battle_action_args[0];
		data_index = BattleController.process_battle_action_args[1];
		sub_effect_selected = BattleController.process_battle_action_args[2];
		if(BattleController.process_battle_action_args.length > 3)
		{
			active_character_index = BattleController.process_battle_action_args[3];
			//need to set this?
			BattleController.current_character_stats_index = active_character_index;
		}
		//clear selection context
		if(GameController.in_encounter) BattleController.battle_info_context.clearRect(0,0,BattleController.battle_info_canvas.width,BattleController.battle_info_canvas.height);
	}
	else if(!GameController.in_encounter)
	{
		//if not in a battle, reset this, so player must choose a target for action
		BattleController.highlight_character_selected_index = BattleController.player_character_selected_index = -1;
	}
	
	//FIND ACTION DATA based on action and indexes given

	//current character id
	var active_character = GameController.characters[active_character_index];
	//active_character.character_stats;
	var active_character_id = active_character.character_stats.character_id;
	
	var off_hand_attack_action_data = 0;
	
	//get action data
	var round_num = 0;
	//get form data add attack name and target
	//if spell then data_index = [action_data.caster_class_index, action_data.spell_level_index, action_data.spell_index]
	if(data_index.constructor === Array)
	{
		//attack-two-weapon
		if(action_type == 'attack')
		{
			var main_index = data_index[0];
			var off_hand_index = data_index[1];
			var copy_this_action_data = active_character.character_stats.action_data['attack_action_data'][main_index];
			var off_hand_attack_action_data = active_character.character_stats.action_data['attack_action_data'][off_hand_index];
		}
		//else spell
		else
		{
			//data_index = [action_data.caster_class_index, action_data.spell_level_index, action_data.spell_index]
			var caster_class_index = data_index[0];
			var spell_level_index = data_index[1];
			var spell_index = data_index[2];
			var copy_this_action_data = active_character.character_stats.ability_data.spells[caster_class_index].spell_level[spell_level_index][spell_index];
		}
	}
	else
	{
		//attack and special stored in character_stats.action_data
		if(action_type == 'attack' || action_type == 'special')
		{
			//onsole.log(active_character.character_stats.action_data);
			var copy_this_action_data = active_character.character_stats.action_data[action_type+'_action_data'][data_index];
		}
		//equipment stored in character_stats.action_data
		else if(action_type == 'equipment')
		{
			var copy_this_action_data = active_character.character_stats.EquipArr[data_index];
			copy_this_action_data.action = 'equipment';
			copy_this_action_data.name = copy_this_action_data.EquipName;
		}
		//other abilities stored in character_stats.ability_data (spells, feat, racial, faction, class)//note, spells are above
		else
		{
			var copy_this_action_data = active_character.character_stats.ability_data[action_type][data_index];
		}
	}
	
	var this_action_data = JSON.parse(JSON.stringify(copy_this_action_data));
	
	//setting these her manually for testing
	BattleController.current_character_stats_index = active_character_index;
	
	//IF IN EDIT MODE or if no effect exists, prompt player to create effect for this ability
	//don't ask for physical attacks (normal attacks can have effects as well)
	if(MenuController.editEffects || (this_action_data.action != 'attack' && this_action_data.effects == 0 && confirm('I don\'t know what this does, will you create the effect?')))
	{
		EffectController.EditEffect(this_action_data);
		//onsole.log(this_action_data);
		return false;
	}
	//if a class ability selection option, have player choose an ability from the options, then save the selection
	else if(this_action_data.effects != 0 && this_action_data.effects.length > 1 && this_action_data.effects[0].IsChooseClassAbility == 1)
	{
		ActionController.PrintActionInfo('Chose a class ability from the menu.<br/>');
		EffectController.ChooseClassAbility(this_action_data, active_character_index);
		return false;
	}
	//if ability requires effect sub-selection, have player choose an effect from the options
	//IsMultipleEffectOptions or summoning/polymorphong
	else if(this_action_data.effects != 0 && ((this_action_data.effects[0].IsMultipleEffectOptions == 1 && this_action_data.effects.length > 1) || (this_action_data.effects[0].EffectSummonID != 0 && this_action_data.effects[0].EffectSummon[0].EffectSummonCreatures.length > 1)))
	{
		if(sub_effect_selected == -1)
		{
			EffectController.ChooseSubAbility(this_action_data, data_index, active_character_index, this_action_data.effects[0].EffectSummonID);
			return false;
		}
		else
		{
			//different for sommon/polymorph
			if(this_action_data.effects[0].EffectSummonID != 0)
			{
				//set the chosen creature type as the 0th element in EffectSummonCreatures array
				this_action_data.effects[0].EffectSummon[0].EffectSummonCreatures[0] = this_action_data.effects[0].EffectSummon[0].EffectSummonCreatures[sub_effect_selected];
			}
			else
			{
				//if player has chosen the sub effect, then make that the only effect in effects array for this ability
				this_action_data.effects = [];
				this_action_data.effects[0] = copy_this_action_data.effects[sub_effect_selected];
			}
		}
	}
	//if not an attack, and is a continuous passive ability, don't do anything
	else if(this_action_data.action != 'attack' && this_action_data.effects != 0 && (this_action_data.effects[0].ActionTypeID == 5 || this_action_data.effects[0].ActionTypeID == 6))
	{
		ActionController.PrintActionInfo('This ability is always active.<br/>')
		return false;
	}
	else if(this_action_data.effects == 0 && this_action_data.action != 'attack')
	{
		ActionController.PrintActionInfo('???<br/>');
		return false;
	}
	
	var target_character_index = BattleController.highlight_character_selected_index;
	var target = 0;
	
	//if this targets self
	if(this_action_data.effects != 0 && parseInt(this_action_data.effects[0].TargetTypeID) == 0)
	{
		//get target
		var target_character_index = BattleController.current_character_stats_index;
		BattleController.highlight_character_selected_index = target_character_index;
		GameController.characters[target_character_index].highlight = 1;
		target = active_character.character_stats;	
		$('#select-target').html('TARGET: SELF');
		if(this_action_data.effects[0].EffectAreaID)
		{
			$('#select-target').append(' + AOE');
		}
		if(action_type == 'equipment')
		{
			$('#select-target').html('Use the '+this_action_data.name+'?');
		}
	}
	
	//if action confirmed complete action, else prompt use for target selection/confirmation
	if(GameController.dev_mode || active_character.character_stats.GoodGuy == 1)
	{
		//SAVE ACTION DATA for confirmation
		//on attack action, no confirmation (make sure target is alive)
		if((this_action_data.action == 'attack' && BattleController.highlight_character_selected_index != -1) || (BattleController.action_confirmed && (target_character_index != -1 || BattleController.target_character_index_array.length > 0)))
		{
			//get rid of the menu so it doesn't pop up
			MenuController.BattleMenuClose();
			MenuController.MenuClose();
			//just clear this so that there is no flash of menu fading out
			$('#game-menu-inner').html('')
			//for dev mode show the base menu
			if(GameController.dev_mode && GameController.in_encounter) MenuController.CreateBattleMenu();
			//delete temp stored action data and show appropriate menus
			MenuController.BattleMenuCancelAction();
			//action confirmed, proceed
		}
		//OR INITIALIZE CONFIRMED ACTION
		//action selected and not confirmed, ask for confirmation
		else
		{
			//save arguments for confirmation re-call
			BattleController.process_battle_action_args = arguments;
			BattleController.process_battle_action_data = this_action_data;
			
			//show confirmation button, give player a chance to change / confirm target area
			if(GameController.in_encounter)
			{
				$('#load-abilities').hide();
				$('#battle-menu-list-container').hide();
				//show confirmation buttons
				$('#action-confirm').show();
			}
			else
			{
				$("#show-characters").hide();
				$("#game-menu-top-menu").hide();
				$("#game-menu-top-default").hide();
				$("#game-menu").hide();
			}
			
			//$('#game-menu-top-default').hide();//why hiding this, makes action buttons vanish
			$('#game-menu-top-action-confirm').show();
			
			//reset AOE area targeted characters
			BattleController.target_character_index_array.length = 0;
			
			//if AOE show select area for current target
			if(typeof this_action_data.effects != 'undefined' && this_action_data.effects != 0 && this_action_data.effects[0].EffectAreaID != 0)
			{
				BattleController.show_select_area = 1;
			}
			
			if(BattleController.highlight_character_selected_index != -1 && typeof this_action_data.effects != 'undefined' && this_action_data.effects != 0 && this_action_data.effects[0].EffectAreaID != 0)
			{
				var x = CharacterController.SpriteGridX(GameController.characters[target_character_index]);//GameController.characters[target_character_index].sprite_coords[0];
				var y = CharacterController.SpriteGridY(GameController.characters[target_character_index]);//GameController.characters[target_character_index].sprite_coords[1];
				for(var i=0; i<this_action_data.effects[0].EffectArea.length; i++)
				{
					if(GameController.in_encounter)
					{
						var size = Math.floor(EffectController.GetAoeSize(this_action_data,i) / 5);
						GameController.burst_radius(BattleController.battle_grid,x,y,size);
					}
					else
					{
						var size = Math.floor(EffectController.GetAoeSize(this_action_data,i) / 10);
						//GameController stuff is mostly y,x reversed like that
						GameController.burst_radius(GameController.select_layer,y,x,size);
					}
				}
				BattleController.target_character_index_array = CharacterController.HighlightInAoe(BattleController.process_battle_action_data.effects);
			}
			
			ActionController.SelectTargetShow();
			
			//show selected target if auto selected
			if(GameController.in_encounter)
			{
				BattleController.draw();
			}
			else
			{
				GameController.view_selected_area = 1;
				GameController.redraw_map_on_player_position();
			}
			//setTimeout(function(){$('#select-target').hide()}, 1000);
			return false;
		}
	}
	
	//dev mode log the effect data
	/*if(GameController.dev_mode)
	{
		//onsole.log(this_action_data);
		//onsole.log(BattleController.highlight_character_selected_index, target_character_index, this_action_data.effect.TargetTypeID);
	}*/
	
	//get target - HAX!!!
	BattleController.highlight_character_selected_index = BattleController.highlight_character_selected_index == -1 ? target_character_index : BattleController.highlight_character_selected_index;
	
	//MAKE SURE TARGET IS SELECTED
	//IF this_action_data.effect.TargetTypeID != 0, must select a target
	//for monster action this_action_data.effect is undefined
	if(this_action_data.effects == 0 || parseInt(this_action_data.effects[0].TargetTypeID) != 0) //TargetTypeID == 0 is target self
	{
		//ONLY WORKS IN BATTLE
		if(GameController.in_encounter)
		{
			//onsole.log(BattleController.highlight_character_selected_index, BattleController.target_character_index_array.length)
				//if no one selected and no one in AOE
			if(BattleController.highlight_character_selected_index == -1 && BattleController.target_character_index_array.length == 0)
			{
				ActionController.SelectTargetShow();
				setTimeout(function(){$('#select-target').hide()}, 1000);
				return false;
			}
		}
	}
	
	
	//------------------------------------
	var action_return_data = 0;
	var duration = 0;
	
	//loop through BattleController.target_character_index_array, adding the selected single target if exists to the array first
	if(BattleController.target_character_index_array.length == 0)
	{
		BattleController.target_character_index_array.push(target_character_index);
	}
	
	target_character_index = BattleController.target_character_index_array[0];
	//if target is a selected location, aim for that square instead of the first character in target list
	target = GameController.characters[target_character_index].character_stats;
	
	//ProcessAction do this only once - will make one roll for action and in the case of saving throws roll for each target
	
	var modifier = 0;
	//-2 main hand attack if two weapon fighting (PC's only receive penalty)
	if(active_character.character_stats.quick_stat_catagory_id == 1 && this_action_data.action == 'attack' && off_hand_attack_action_data != 0)
	{
		//if has 2 weapon fighting feat
		if(CharacterController.HasFeat(active_character.character_stats, 'Two-Weapon Fighting'))
			modifier = -2;
		else
			modifier = -4;
	}
	
	if(this_action_data.action == 'spells')
	{
		//update spell points
		var sp_cost = 0;
		switch(spell_level_index)
		{
			case 1:
				sp_cost = 1;
				break;
			case 2:
				sp_cost = 3;
				break;
			case 3:
				sp_cost = 5;
				break;
			case 4:
				sp_cost = 7;
				break;
			case 5:
				sp_cost = 9;
				break;
			case 6:
				sp_cost = 11;
				break;
			case 7:
				sp_cost = 13;
				break;
			case 8:
				sp_cost = 15;
				break;
			case 9:
				sp_cost = 17;
				break;
		}
		//onsole.log('spell data',this_action_data);
		//if not enough spell points, cancel action
		if(!CharacterController.MpChange(sp_cost, this_action_data.magic_type, active_character_index, 0))
		{
			var message = 'Not enough spell points to cast this spell!<br/><br/>'; 
			message += '<div style="margin-top:15px;" id=""><span id="selected-button" class="button selected" onclick="MenuController.MenuClose();">OK</span></div>';
			MenuController.DisplayMessage(message);
			return false;
		}
	}
	
	//***PROCESS THIS ACTION***
	action_return_data = ActionController.ProcessAction(active_character.character_stats, this_action_data, target_character_index, modifier);
	
	//do the offhand attack if exists
	if(this_action_data.action == 'attack' && off_hand_attack_action_data != 0)
	{
		//if has 2 weapon fighting feat (PC's only receive penalty)
		if(active_character.character_stats.quick_stat_catagory_id == 1)
		{
			if(CharacterController.HasFeat(active_character.character_stats, 'Two-Weapon Fighting'))
				modifier = -2;
			else
				modifier = -6;
		}
		var isOffHandAttack = active_character.character_stats.quick_stat_catagory_id == 1 ? 1 : 0;
		var off_hand_action_return_data = ActionController.ProcessAction(active_character.character_stats, off_hand_attack_action_data, target_character_index, modifier, isOffHandAttack);//last parameter is isOffHandAttack, here true for PC and false for monster
		//update action_return_data
		action_return_data.alter_hp_damage += off_hand_action_return_data.alter_hp_damage;
		action_return_data.roll_comment += '<br/>'+off_hand_action_return_data.roll_comment;
	}
	
	if(action_type != 'equipment') duration = BattleController.animate_attack(BattleController.current_character_stats_index, target_character_index, this_action_data, action_return_data.alter_hp_damage);
	
	//***FOR EACH TARGET***
	for(var i=0; i<BattleController.target_character_index_array.length; i++)
	{
		target_character_index = BattleController.target_character_index_array[i];
		target = GameController.characters[target_character_index].character_stats;
		
		var this_target_damage = action_return_data.alter_hp_damage;
		
		if(this_action_data.effects != 0 && this_action_data.effects[0].IsAllowSave)
		{
			//for each target
			var save_result = ActionController.ProcessAction(target, this_action_data.save_action_data, {'vs_character_stats':active_character.character_stats ,'save_dc':this_action_data.save_dc});
			var save_roll_comment = save_result.roll_comment;
			target.save_made = save_result.is_success;
			if(target.save_made)
			{
				this_target_damage = Math.floor(this_target_damage/2);
			}
			action_return_data.roll_comment += target.character_name+': '+save_roll_comment;
		}
		
		//update battle screen with HP change alerts
		if(this_target_damage != 0)
		{
			CharacterController.HpChange(this_target_damage, target_character_index, duration);
		}
		
		/*
		//ROLL COMMENT -if affects target ability scores
		if(this_action_data.effects != 0 && this_action_data.effects[0].EffectAttributeModID > 0)
		{
			for(i in this_action_data.effects[0].EffectAttributeMod)
			{
				var EffectAttributeMod = this_action_data.effects[0].EffectAttributeMod[i];
				if(target.save_made)
				{
					action_return_data.roll_comment += target.character_name+' resists!<br/>';
				}
				else
				{
					action_return_data.roll_comment += target.character_name+'\'s '+EffectAttributeMod.AttributeName+' '+(EffectAttributeMod.Mod>0?'raised':'lowered')+' by '+EffectAttributeMod.Mod+'<br/>';
				}
			}
		}
		
		//ROLL COMMENT -if affects target ability scores
		if(this_action_data.effects != 0 && this_action_data.effects[0].EffectACModID > 0)
		{
			for(i in this_action_data.effects[0].EffectACMod)
			{
				var EffectACMod = this_action_data.effects[0].EffectACMod[i];
				if(target.save_made)
				{
					action_return_data.roll_comment += target.character_name+' resists!<br/>';
				}
				else
				{
					action_return_data.roll_comment += target.character_name+'\'s Armor Class has been modified<br/>';
				}
			}
		}
		*/
		
		//add effect resistance, cancellation check here
		//make function for checking if the effects remove any conditions, or provide another save vs. conditions
		//there will be abilities of a caster that increases the saving throw DC or spell penetration vs. SR, find place to check that as well
		
		//for spells, will need to add spell school / domain to effect info
		
		//if effect has a duration and the saving throw was not made, add effect to character_stats.effects
		var effect_duration = EffectController.GetDuration(this_action_data);
		if(effect_duration > 0)
		{
			//THIS MIGHT NOT WORK WELL WHEN battle.initiative IS RESET //var effectDurationCountdownOnInitValue = GameController.in_encounter ? BattleController.initiative[BattleController.current_initiative_index].InitRoll : 0;
			var effectDurationCountdownOnInitValue = 0;
			action_return_data.roll_comment += EffectController.AddEffectsToCharacter(target, active_character.character_stats, this_action_data, effect_duration, effectDurationCountdownOnInitValue, this_action_data.save_dc)
		}
		//reset save_made
		target.save_made = 0;
		
		if(action_type != 'equipment') 
		{
			//same arguments as 'animate_attack' shows animation on target getting hit
			BattleController.play_hit_animation(BattleController.current_character_stats_index, target_character_index, this_action_data, this_target_damage, duration);
		}
		
	}

	//output to log
	ActionController.PrintActionInfo(action_return_data.roll_comment+'<br/>');
	if(action_return_data.modifier_comment!='') ActionController.PrintActionInfo('('+action_return_data.modifier_comment+')<br/>');
	
	//update active characters HP display (in case it has changed)
	var current_character_stats = GameController.characters[BattleController.current_character_stats_index].character_stats;
	$('#character-name').html('<h3>'+current_character_stats.character_name+' <span>HP: '+(current_character_stats.hp - current_character_stats.hp_damage)+'/'+current_character_stats.hp+'</span></h3>');
	
	if(GameController.in_encounter)
	{
		BattleController.draw();
	}
	else
	{
		setTimeout(function()
		{
			GameController.redraw_characters = true;
			GameController.redraw_map_on_player_position();
		}, duration);
		
		if(!CharacterController.IsPlayerAlive())
		{
			setTimeout(function(){GameController.GameOver();}, 2000);
		}
	}
	
	CharacterController.ShowCharacterDisplay();
}

ActionController.ProcessAction = function(active_character_stats, action_data, target, modifier, isOffHandAttack)
{
	//runs only once for multiple targets
	if(arguments.length < 5) isOffHandAttack = false;
	if(arguments.length < 4) modifier = 0;
	//target = target_character_index or a target difficulty number
	//if not set targeting self
	if(arguments.length < 3) target = BattleController.current_character_stats_index;
	
	//onsole.log(action_data);
	var active_character_id = active_character_stats.character_id;
	var action = action_data.action;
	
	var target_damage = 0;
	var target_damage_resisted = 0;
	var roll_comment = "";
	var modifier_comment = "";
	var is_success = "";
	
	var roll = 0;
	var type = 0;
	var mod = 0;
	
	//special abilities //'special_weapon' is an effect on a magic weapon - triggers when weapon strikes enemy
	if(action == 'ability' || action == 'special' || action == 'special_weapon' || action == 'feat' || action == 'spells' || action == 'equipment')
	{
		switch(action)
		{
			case 'special_weapon':
				//don't output active character name or action name on weapon special attack effect
				//roll_comment += '';
				break;
			case 'spells':
				roll_comment += active_character_stats.character_name+' casts '+action_data.name+'<br/>';
				break;
			case 'equipment':
				roll_comment += active_character_stats.character_name+' uses the '+action_data.name+'<br/>';
				break;
			default:
				roll_comment += active_character_stats.character_name+' uses '+action_data.name+'<br/>';
				break;
		}
		
		//if special effect do processing here
		//onsole.log(action_data.effect);
		
		//-------------------
		var effect_damage_by_type = {};
		for(var j=0; j<action_data.effects.length; j++)
		{
			//if does damage, calculate how much damage is done (use same rolls for multiple targets)
			if(action_data.effects[j].EffectHPModID > 0)
			{
				for(i in action_data.effects[j].EffectHPMod)
				{
					var EffectHPMod = action_data.effects[j].EffectHPMod[i];
					var diceRoll = EffectController.DiceRoll(
							action_data.action_level, 
							EffectHPMod.HPModMaxPerLevel, 
							EffectHPMod.HPModPerEveryLevelStart, 
							EffectHPMod.HPModPerEveryLevelNum, 
							EffectHPMod.HPModDiceRollBase, 
							EffectHPMod.HPModDiceRollPer
						);
					
					//just set this var so that the TempHP stays set at the rolled value
					if(EffectHPMod.HPModName == 'TempHP') action_data.effects[j].DiceRollResult = diceRoll.roll_result;//saving DiceRollResult in base effect data, to get it later for storing must be easy to access
					roll_comment += diceRoll.roll_comment;
					//if healing
					//onsole.log(roll_comment);
					if(typeof effect_damage_by_type[EffectHPMod.HPModName] == 'undefined')
						effect_damage_by_type[EffectHPMod.HPModName] = (EffectHPMod.HPModName == 'Healing')?diceRoll.roll_result*-1:diceRoll.roll_result;
					else
						effect_damage_by_type[EffectHPMod.HPModName] += (EffectHPMod.HPModName == 'Healing')?diceRoll.roll_result*-1:diceRoll.roll_result;
				}
			}
			//get damage reduction by type
			for(var damage_type in effect_damage_by_type)
			{
				target_damage += effect_damage_by_type[damage_type];
				target_damage_resisted += CharacterController.GetDamageResisted(GameController.characters[target].character_stats, damage_type, diceRoll.roll_result);
			}
			
			//if summoning monsters
			if(action_data.effects[j].EffectSummonID > 0)
			{
				var cancel_summon = false;
				var is_familiar = action_data.effects[j].EffectSummon[0].IsFamiliar;
				//is this summoning a familiar?
				if(is_familiar)
				{
					//loop through characters to find if this familiar is already here
					for(var i = 0; i<GameController.characters.length; i++)
					{
						//can only have 1 familiar? *** multiclass
						if(GameController.characters[i].character_stats.summoned_by_character_id == active_character_stats.character_id && GameController.characters[i].character_stats.is_familiar)
						{
							ActionController.PrintActionInfo('Your familiar is already here.<br/><br/>');
							cancel_summon = true;
						}
					}
				}
				
				if(!cancel_summon)
				{
					//wait till fresh monster entry has been created, and then stats loaded if need to load this creature type
					ActionController.aiActionWait = true;//BattleController.end_character_turn checks for resources_loaded == resources_loading
					//multiple monster types monster
					//for AI select index 0
					var summon = action_data.effects[j].EffectSummon[0].EffectSummonCreatures[0];//taking 0th creature in array, if was a multiple choice, selected creature type was put in 0th position
					//summon.SummonSuccessChance;
					//totalSummoned not needed for polymorph
					var totalSummoned = 0;//var diceRoll = EffectController.DiceRoll(action_data, action_data.effects[0].EffectHPMod[i]);
					for(var i = 0; i<summon.SummonDiceRollBase.NumDice; i++)
					{
						totalSummoned += Math.floor(Math.random() * (summon.SummonDiceRollBase.DieType - 1)) + 1;
					}
					totalSummoned += summon.SummonDiceRollBase.RollMod;
					var character_index_polymorphed = -1;
					
					if(action_data.effects[j].EffectSummon[0].IsPolymorph)
					{
						character_index_polymorphed = target;
					}
					EffectController.SummonCreatures(active_character_stats, summon.CreatureCharacterID, totalSummoned, character_index_polymorphed, is_familiar);
					//CreatureCharacterID is QuickStatID
					//comment output in EffectController.CreateSummoned
				}
			}
		}
		//---------------------
		
		if(target_damage != 0)
		{
			//this is just the last EffectHPMod[] that was set in the loop
			if(EffectHPMod.HPModName == 'Healing' || EffectHPMod.HPModName == 'TempHP')
			{
				roll_comment += (parseInt(diceRoll.roll_comment).toString() == diceRoll.roll_comment?'':' = '+(diceRoll.roll_result))+' '+(EffectHPMod.HPModName == 'Healing'?' HP healed':' temporary HP gained')+'<br/>';
				if(EffectHPMod.HPModName == 'TempHP')
				{
					target_damage = 0;
				}
			}
			else
				roll_comment += (parseInt(diceRoll.roll_comment).toString() == diceRoll.roll_comment?'':' = '+target_damage)+' '+EffectHPMod.HPModName+' damage'+'<br/>';
		}
		
		//saving throw data calculated once on effects[0]
		//if effect grants target a saving throw (evasion applies to reflex HPMod effects)
		action_data.save_dc = 0;
		if(parseInt(action_data.effects[0].IsAllowSave))
		{
			action_data.save_dc = 10 + modifier;
			action_data.save_action_data = GameController.characters[target].character_stats.action_data.save_action_data[action_data.effects[0].SaveID];
			if(action_data.action_type == 'class')
			{
				action_data.save_dc += Math.floor(parseInt(action_data.class_level)/2);
			}
			else if(action == 'spells')
			{
				action_data.save_dc += parseInt(action_data.spell_level_index);
				action_data.save_dc += CharacterController.GetAttributeBonus(active_character_stats, action_data.class_magic_attribute_id);
			}
			roll_comment += 'Saving throw vs. DC '+action_data.save_dc+'<br/>';
		}
		
	}
	
	//SAVING THROW*******************************
	else if (action == "save")
	{
		roll = Math.floor(Math.random() * (20 - 1)) + 1;
		type = action_data.save_type;
		//for a saving throw, target = {vs_character_stats, save_dc}
		var get_stat = CharacterController.GetStat(active_character_stats, action_data.stat_key, -1, target.vs_character_stats);
		mod = get_stat.stat_val + get_stat.effect_mod;
		is_success = (roll+mod >= target.save_dc);
		roll_comment = type+" saving throw [1d20 ("+roll+") + "+mod+" = "+(roll+mod)+"] "+(is_success ? 'Success!':'Failed!')+"<br/>";
	}
	
	//SKILL ROLL*******************************
	else if (action == "skill")
	{
		roll = Math.floor(Math.random() * (20 - 1)) + 1;
		type = action_data.skill_name;
		mod = action_data.skill_mod + modifier;
		is_success = (roll+mod >= target);
		roll_comment = type+" skill roll: 1d20 ("+roll+") + "+mod+" = "+(roll+mod)+" VS. "+target+" "+(is_success ? 'Success!':'Failed!')+"<br/>";
	}
	
	//ATTACK ROLL*******************************
	else if (action == 'attack')
	{
		var AttackResult = ActionController.ResolveAttack(active_character_stats, action_data, target, modifier, isOffHandAttack);
		target_damage = AttackResult.target_damage;
		target_damage_resisted += CharacterController.GetDamageResisted(GameController.characters[target].character_stats, 'attack', AttackResult.target_damage, action_data);
		roll_comment = AttackResult.roll_comment;
		modifier_comment = AttackResult.attack_mod_comment;
	} //end attack
	
	return {'alter_hp_damage':target_damage, 'is_success':is_success, 'roll_comment':roll_comment, 'modifier_comment':modifier_comment};
}

ActionController.ResolveAttack = function(active_character_stats, action_data, target, modifier, isOffHandAttack, getModifiers)
{
	if(arguments.length < 6) getModifiers = 0;
	if(arguments.length < 5) isOffHandAttack = 0;
	if(arguments.length < 4) modifier = 0;
	//***
	var trigger_type = 0;
	//***
	var target_character_stats = getModifiers ? 0 : GameController.characters[target].character_stats;
	var target_damage = 0;
	var roll_comment = "";
	var attack_mod_comment = "";
	var attack_special_mod_comment = "";
	//onsole.log(action_data);
	var type = action_data.attack_name;
	var numdice = action_data.num_dice;
	var dietype = action_data.die_type;
	
	//STRENGTH BONUS
	var str_mod = CharacterController.GetAttributeBonus(active_character_stats, 0);
	var bab = active_character_stats.bab;
	
	//DEX???
	//var effect_dex_mods = EffectController.GetEffectTypeMods(character_stats, 'EffectAttributeMod', 1);
	//add_hit_mod += effect_dex_mods.total_mod;
	
	//PC and monster can use this (PC will usually have a 0, unless the weapon has a bonus to roll)
	var damgemod = action_data.damage_mod;//*** FORGETTING RollMod?
	
	//monster will use this as full to_hit, then add effect mods
	if(active_character_stats.quick_stat_catagory_id == 1)//another way to check if pc
	{
		var mod = bab + str_mod + modifier;
	}
	else
	{
		var mod = action_data.attack_mod + modifier;
	}
	
	var damage_effect_mod = 0;
	var to_hit_effect_mod = 0;
	
	var crit_range = action_data.crit_range;
	var crit_effect_mod = EffectController.GetEffectTypeMods(active_character_stats, 'EffectAttatckMod', 'CriticalRange');
	var crit_mult = action_data.crit_mult;
	
	//set number of attacks (only PC's have reduced number of off hand attacks)
	var num_attacks = (isOffHandAttack) ? 1 : action_data.num_attacks;
	
	//check first letter of submit button value, 'S' indicates single and 'F' is multiple attacks
	//if a single attack, set num_attacks down to 1
	if(action_data.submit == 's')
	{
		num_attacks = 1;
		if(isOffHandAttack) return {'target_damage':0, 'roll_comment':'', 'attack_mod_comment':''};
	} //end if
	//instantiate attack mod array
	var arr_mod = [];
	
	//set additional hit and damage modifiers

	//***
		//just for the attack comment for effect bonuses
		var str_effect_mod = EffectController.GetEffectTypeMods(active_character_stats, 'EffectAttributeMod', 0);
		if(str_effect_mod.total_mod != 0)
		{
			attack_mod_comment += (str_effect_mod.total_mod>0?'+':'')+str_effect_mod.total_mod+' Strength';
		}
	//***

	//modify str bonus if TwoHand, (action_data.two_hand)
	if(action_data.two_hand && str_mod > 1)
	{
		var add_damage_mod = str_mod + Math.floor(str_mod/2);
	}
	//modify str bonus if(isOffHandAttack)
	else if(isOffHandAttack && str_mod > 1)
	{
		var add_damage_mod = str_mod - Math.ceil(str_mod/2);
	}
	//else use regular str bonus
	else
	{
		var add_damage_mod = str_mod;
	}
	
	//EFFECT CHECK - MELEE DAMAGE
	//getModifiers = 1, so that the note is retrieved instead of the actual roll, rolls are made on the individual hits
	var effect_melee_damage_mods = EffectController.GetEffectTypeMods(active_character_stats, 'EffectAttackMod', 'Damage', target_character_stats, trigger_type, 1, isOffHandAttack);
	add_damage_mod += effect_melee_damage_mods.total_mod;
	//add to the attack mod comment
	if(effect_melee_damage_mods.total_mod != 0)
	{
		attack_mod_comment += (attack_mod_comment==''?'':', ')+(effect_melee_damage_mods.total_mod>0?'+':'')+effect_melee_damage_mods.total_mod+' to damage';
	}
	
	//EFFECT CHECK - MELEE TO HIT
	var effect_melee_hit_mods = EffectController.GetEffectTypeMods(active_character_stats, 'EffectAttackMod', 'Attack', target_character_stats, trigger_type, 1, isOffHandAttack);
	var add_hit_mod = effect_melee_hit_mods.total_mod;
	//add to the attack mod comment
	if(effect_melee_hit_mods.total_mod != 0)
	{
		attack_mod_comment += (attack_mod_comment==''?'':', ')+(effect_melee_hit_mods.total_mod>0?'+':'')+effect_melee_hit_mods.total_mod+' to hit';
	}
	
	//add SPECIAL MODIFIERS (vs. target type) to the attack mod comment
	if(!getModifiers && effect_melee_damage_mods.effect_note_list[0] != '')
	{
		//only do this for battle output display, the character stats display has the information already
		for(var j=0; j<effect_melee_damage_mods.effect_note_list.length; j++)
		{
			attack_special_mod_comment += (attack_special_mod_comment==''?'':' ')+('['+effect_melee_damage_mods.effect_note_list[j]+']');
		}
	}
	
	//ADJUST $mod and $damagemod AT THIS POINT
	mod += add_hit_mod;
	damgemod += add_damage_mod;
	
	//SET NUMBER OF ATTACKS AND HIT ROLLS in arr_mod[]
	//if player and not polymorphed
	if(typeof action_data.arr_attack_bonus == 'undefined')
	{
		//check for rapid shot
		//THROWS AN EXTRA ATTACK INTO arr_mod[]
		if(action_data.rapid_shot)
		{
			arr_mod.push(mod);
		}
		
		//check for monk attacks
		//if monk attack, then only reduce by 3?
		//else set attack rolls as per normal
		//reduce attack roll by 5 for each successive attack
		for (var i = 0; i < num_attacks; i++)
		{
			arr_mod.push(mod - (5 * i));
		} //end for i, set attack mods
	}
	//else monster or polymorphed form
	else
	{
		//if polymorphed form, get number of attacks and set to use players bab and str instead of monsters
		if(active_character_stats.poly_character_stats != 0)
		{
			for(i in action_data.arr_attack_bonus)
			{
				arr_mod.push(mod + (action_data.arr_attack_bonus[i] - active_character_stats.poly_character_stats.bab - active_character_stats.poly_character_stats.str_mod));
			}
		}
		//if regular monster
		else
		{
			arr_mod = action_data.arr_attack_bonus;
		}
	}
	/*
	onsole.log({
			'damage_mod':add_damage_mod - str_effect_mod.total_mod - effect_melee_damage_mods.total_mod, 
			'damage_effect_mod':str_effect_mod.total_mod + effect_melee_damage_mods.total_mod, 
			'damage_effect_note_list':effect_melee_damage_mods.effect_note_list, 
			'arr_attack':arr_mod,
			'to_hit_effect_mod':str_effect_mod.total_mod + effect_melee_hit_mods.total_mod, 
			'to_hit_effect_note_list':effect_melee_hit_mods.effect_note_list, 
			'num_attacks':num_attacks,
			'attack_increment':5,
			'attack_mod_comment':attack_mod_comment,
			'crit_effect_mod':crit_effect_mod});
	*/
	if(getModifiers)
	{
		return {
			'damage_mod':add_damage_mod - str_effect_mod.total_mod - effect_melee_damage_mods.total_mod, 
			'damage_effect_mod':str_effect_mod.total_mod + effect_melee_damage_mods.total_mod, 
			'damage_effect_note_list':effect_melee_damage_mods.effect_note_list, 
			'arr_attack':arr_mod,
			'to_hit_effect_mod':str_effect_mod.total_mod + effect_melee_hit_mods.total_mod, 
			'to_hit_effect_note_list':effect_melee_hit_mods.effect_note_list, 
			'num_attacks':num_attacks,
			'attack_increment':5,
			'attack_mod_comment':attack_mod_comment,
			'crit_effect_mod':crit_effect_mod};
	}
	
	//GET target info, AC and mods
	//get target data and start roll_comment
	var target_id = target_character_stats.character_id;
	
	//Get resulting row from query
	var target_name = target_character_stats.character_name;
	//onsole.log('target_character_stats',target_character_stats);
	var get_stat_target_ac = CharacterController.GetStat(target_character_stats, 'ac');
	var target_ac = get_stat_target_ac.stat_val + get_stat_target_ac.effect_mod;
	//onsole.log('get_stat_target_ac',get_stat_target_ac, target_ac);
	var target_ac_effect_note = get_stat_target_ac.effect_mod ? (get_stat_target_ac.effect_mod > 0 ? '+':'') + get_stat_target_ac.effect_mod + ' ' + get_stat_target_ac.effect_note_list[0] : '';
	
	roll_comment = type+' attack'+(attack_mod_comment != '' ? ' ('+attack_mod_comment+')' : '');
	roll_comment += attack_special_mod_comment != '' ? attack_special_mod_comment : '';
	roll_comment += ' vs. '+target_name;
	roll_comment += (target_ac_effect_note != '' ?  ' ('+target_ac_effect_note+' AC mod)' : '')+':<br/>';
	
	/*
	if(action_data.rapid_shot)
	{
		roll_comment += " (Rapid Shot)";
		//adjust all attacks by -2 to hit
		add_hit_mod -= 2;
	}
	if(modifier != 0)
	{
		roll_comment += " ("+(modifier>0?"+":"")+modifier+" to hit)";
	}
	//end first line of attack $roll_comment
	roll_comment += ":<br />";
	*/
	
	for(i in arr_mod)
	{
		roll = Math.floor(Math.random() * (20 - 1)) + 1;
		//set mod back from arr_mod[]
		mod = arr_mod[i];
		roll_comment += "<div style='margin-top:8px;'>1d20 ("+roll+") + "+mod+" = "+(roll+mod)+" vs. "+target_ac;
		var critical_check = false;
		var critical_hit = false;
		//double damage dice and mod if critical hit
		//if(crit_range >= (20 - roll)){
		if(roll >= (20 - (crit_effect_mod ? (crit_range==0?1:crit_range*2) : crit_range))){
			critical_check = true;
			
			//if attack roll was high enough to hit
			if(((roll + mod) >= target_ac) || roll == 20)
			{
				var crit_check_roll = Math.floor(Math.random() * (20 - 1)) + 1;
				roll_comment += ", Critical check";
				//if CRITICAL attack confirmaed (auto miss on roll of 1)
				if(crit_check_roll != 1 && (crit_check_roll + mod) >= target_ac)
				{
					critical_hit = true;
					roll_comment += " success!</br>";
				} //end if
				//else attack missed
				else
				{
					roll_comment += " failed.</br>";
				}
			} //end if hit
			
		} //end crit range

		//damage roll
		var totaldamage = 0;
		var arr_damageroll = [];
		for (var j = 0; j < (numdice+(critical_hit?numdice:0)); j++)
		{
			var thisdamage = Math.floor(Math.random() * (dietype - 1)) + 1;
			arr_damageroll.push(thisdamage);
			totaldamage += thisdamage;
		} //end for j
		
		//damage comment
		var damage_comment = "<br/>Damage roll: "+(numdice+(critical_hit?numdice:0))+"d"+dietype+" (";
		for (var j = 0; j < (numdice+(critical_hit?numdice:0)); j++)
		{
			damage_comment += arr_damageroll[j];
			if (j + 1 < (numdice+(critical_hit?numdice:0))) damage_comment += ", ";
		} //end for j
		damage_comment += ") ";
		if (damgemod > 0) damage_comment += "+ "+(damgemod+(critical_hit?damgemod:0));
		damage_comment += " = "+(totaldamage + (damgemod+(critical_hit?damgemod:0)));
		
		//if attack hit
		if(((roll+mod) >= target_ac) || roll == 20)
		{
			if(critical_hit == true)
				roll_comment += "Critical "+damage_comment;
			else if (critical_check == true)
				roll_comment += "Hit! "+damage_comment;
			else
				roll_comment += ", hit! "+damage_comment;
			//apply damage to MasterCharacter record
			damage_done = totaldamage + (damgemod+(critical_hit?damgemod:0));
			target_damage += damage_done;
			//total_target_damage += damage_done;
			
			//attack effect_mod_type_list[i].dieRoll EFFECT HANDLER
			//onsole.log('effect_melee_damage_mods.dice_list',effect_melee_damage_mods.dice_list);
			for(var i=0; i<effect_melee_damage_mods.dice_list.length; i++)
			{
				//if attack has die rolls to add to damage
				var dice = effect_melee_damage_mods.dice_list[i];
				var dieRoll = EffectController.DiceRoll(dice.action_level, dice.max_per_level, dice.per_every_level_start, dice.per_every_level_num, dice.dice_roll_base, dice.dice_roll_per)
				//onsole.log(dieRoll);
				target_damage += dieRoll.roll_result;
				roll_comment += '<br/>+'+dieRoll.roll_comment+'='+dieRoll.roll_result;
			}
			
		} //end if
		//else attack missed
		else
		{
			roll_comment += ", missed";
		}
		
		roll_comment += "</div>";
		
	} //end for i
	
	//return {'target_damage':target_damage, 'roll_comment':roll_comment, 'attack_mod_comment':attack_mod_comment};
	return {'target_damage':target_damage, 'roll_comment':roll_comment, 'attack_mod_comment':''};
}

ActionController.PrintActionInfo = function(info)
{
	if(GameController.in_encounter)
	{
		ActionController.PrintCharAction(info)
		return true;
	}
	$('#battle-attack-output').html(info+$('#battle-attack-output').html());
}

ActionController.PrintNextCharTurn = function(character_name)
{
	$('#battle-attack-output').find('#current-char').prop('id', '');
	//add new round div to output
	$('#battle-attack-output').find('#current-round').html('<br/><fieldset><legend><span style="color:#cfc;">Init:'+BattleController.initiative[BattleController.current_initiative_index].InitRoll+' '+character_name+'</span></legend><div id="current-char"></div></fieldset>'+$('#battle-attack-output').find('#current-round').html());
	
	//$('#battle-attack-output').html('<div style="opacity:0.75;">'+$('#battle-attack-output').html()+'</div>');
	//$('#battle-attack-output').html('<span style="color:#cfc;">Init:'+BattleController.initiative[BattleController.current_initiative_index].InitRoll+' '+character_name+"</span><br/><br/>"+$('#battle-attack-output').html());
}

ActionController.PrintCharAction = function(info)
{
	$('#current-char').html('<br/>'+info+$('#current-char').html());
}

ActionController.PrintNextRound = function()
{
	$('#battle-attack-output').find('#current-round').prop('class', '');
	//add new round div to output
	$('#battle-attack-output').html('<fieldset><legend><span style="color:#ccf">Round: '+BattleController.encounter_data.CurrentRound+'</span></legend><div id="current-round"><br/></div></fieldset><br/><br/>'+$('#battle-attack-output').html());
}
