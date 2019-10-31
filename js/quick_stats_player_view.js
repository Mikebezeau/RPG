function GetStatWithBonuses(stat_name, stat_key, character_stats, effect_mod_type, mod_type_secondary)
{
	if(arguments.length<4) effect_mod_type = 0;
	if(arguments.length<5) mod_type_secondary = 0;
	
	var html = '';
	var this_stat_val = 0;
	var effect_mod = 0;
	var effect_note = ''
	
	if(stat_key == 'ac' || stat_key == 'touch' || stat_key == 'flat_footed' 
		|| stat_key == 'fort' || stat_key == 'ref' || stat_key == 'will'
		|| stat_key == 'hp')
	{
		var get_stat = CharacterController.GetStat(character_stats, stat_key);
		this_stat_val = get_stat.stat_val;
		effect_mod = get_stat.effect_mod;
		effect_note = get_stat.effect_note_list[0];
	}
	
	else
	{
		this_stat_val = character_stats[stat_key];
		var get_mod = EffectController.GetEffectTypeMods(character_stats, effect_mod_type, mod_type_secondary);
		//onsole.log(stat_key, this_stat_val);
		//onsole.log(get_mod);
		effect_mod = get_mod.total_mod;
		effect_note = get_mod.effect_note_list[0];
	}
	
	//double the mod to get the increase in attribute value
	if(effect_mod_type == 'EffectAttributeMod') effect_mod = effect_mod*2;
	
	MenuController.quick_stat_effect_note = effect_note;
	MenuController.effect_note_color = 'green';
	MenuController.effect_note_color = effect_mod<0?'red':MenuController.effect_note_color;
	
	html += '<p style="clear:both;">'+stat_name+'<span class="'+(effect_mod>0?'green"> (+':'')+(effect_mod<0?'red"> (':'')+(effect_mod==0?'">':'')+(effect_mod!=0?effect_mod+')':'')+'</span>: '
	//removing '*'
	//html += '<p style="clear:both;">'+stat_name+'<span class="'+(effect_mod>0?'green"> (+':'')+(effect_mod<0?'red"> (':'')+(effect_mod==0?'">':'')+(effect_mod!=0?effect_mod+(effect_note!=''?'*':'')+')':'')+'</span>: '
			+'<span class="fltrt '+(effect_mod>0?'green':'')+(effect_mod<0?'red':'')+'">'+(this_stat_val+effect_mod)+'</span></p>';		
	return html;
}

function GetQuickStatCharacterSheet(character_stats)
{
	//onsole.log(character_stats);
	
	var get_stat = 0;
	var html = '';
	
	html += '<div id="quick_stats_view_menu">';
	
	html += '<div class="trans_background_75"></div>';
	
	html += '<div style="position:relative;">';//overtop
	
	html += "<h1>"+character_stats.character_name+"</h1>";
	
	html += '<div style="height:40px;"></div>';
	html += '<div id="quick_stats_view_menu_inner">';
	
			
	html += '<div id="left_column">';

	html += "<div class='group_box'>";
	
		var char_full_image_src = '';
		var race_name = '';
		//set attribute bonuses
		switch (character_stats.RaceID) {
			case 7://human
				char_full_image_src = 'h';
				race_name = 'Human';
				break;
			
			case 1://dwarf
				char_full_image_src = 'd';
				race_name = 'Dwarf';
				break;
			
			case 2://elf
				char_full_image_src = 'e';
				race_name = 'Elf';
				break;
				
			case 3://Gnome
				char_full_image_src = 'g';
				race_name = 'Gnome';
				break;
				
			case 4://Half-Elf
				char_full_image_src = 'he';
				race_name = 'Half-Elf';
				break;
				
			case 5://Half-Orc
				char_full_image_src = 'ho';
				race_name = 'Half-Orc';
				break;
				
			case 6://Halfling
				char_full_image_src = 'g';
				race_name = 'Halfling';
				break;
				
			case 8://Fey-born
				char_full_image_src = 'ft';
				race_name = 'Fey-born';
				break;
				
			case 9://Tiefling
				char_full_image_src = 't';
				race_name = 'Tiefling';
				break;
				
			case 10://Bariaur
				char_full_image_src = 'b';
				race_name = 'Bariaur';
				break;
				
			default:
				char_full_image_src = '';
				race_name = 'Unknown';
				break;
				
		}
		
		//STATS
		html += "<div class='box'>";
			for(var i=0; i<character_stats.ClassArr.length; i++)
			{
				html += character_stats.ClassArr[i].ClassName;
				if(i+1<character_stats.ClassArr.length) html += ' / ';
			}
			html += '<br/>Level: ';
			for(var i=0; i<character_stats.ClassArr.length; i++)
			{
				html += character_stats.ClassArr[i].Level;
				if(i+1<character_stats.ClassArr.length) html += ' / ';
			}
			html += '<br/>';
			html += race_name+'<br/>';
			if(character_stats.poly_character_stats != 0) html += "<p class='green'>Shapeshift: "+character_stats.poly_character_stats.temp_name+"</p>";
			html += 'Alignment: ';
			html += window.mobile?'':'<br/>';
			if(character_stats.align_chaos_id == 1 && character_stats.align_good_id == 1) html += 'True Neutral';
			else
			{
				if (character_stats.align_chaos_id == 0) html += 'Lawful ';
				if (character_stats.align_chaos_id == 1) html += 'Neutral ';
				if (character_stats.align_chaos_id == 2) html += 'Chaotic ';
				if (character_stats.align_good_id == 0) html += 'Good';
				if (character_stats.align_good_id == 1) html += 'Neutral';
				if (character_stats.align_good_id == 2) html += 'Evil';
			}
			
		html += "</div><br/>"; //end box

		html += "<div class='box'>";
			html += "<h3>Attributes</h3>";
			html += GetStatWithBonuses('Strength', 'str', character_stats, 'EffectAttributeMod', 0);
			html += GetStatWithBonuses('Dexterity', 'dex', character_stats, 'EffectAttributeMod', 1);
			html += GetStatWithBonuses('Constitution', 'con', character_stats, 'EffectAttributeMod', 2);
			html += GetStatWithBonuses('Intelligence', 'int', character_stats, 'EffectAttributeMod', 3);
			html += GetStatWithBonuses('Wisdom', 'wis', character_stats, 'EffectAttributeMod', 4);
			html += GetStatWithBonuses('Charisma', 'cha', character_stats, 'EffectAttributeMod', 5);
			
			html += "<br/>";
			
			html += "<h3>HD HP SP</h3>";
			html += "<p>Hit Dice: <span class='fltrt'>"+character_stats.hd+"</span></p>";
			html += GetStatWithBonuses('Hit Points', 'hp', character_stats);
			
			html += "<p>Arcane SP: <span class='fltrt'>"+character_stats.asp+"</span></p>";
			html += "<p>Divine SP: <span class='fltrt'>"+character_stats.dsp+"</span></p>";
		
			html += "<br/>";
			
			html += "<h3>Saves</h3>";
			html += GetStatWithBonuses('Fortitude', 'fort', character_stats);
			html += GetStatWithBonuses('Reflex', 'ref', character_stats);
			html += GetStatWithBonuses('Willpower', 'will', character_stats);
			if(MenuController.quick_stat_effect_note != '') html += '<p><span class="'+MenuController.effect_note_color+'">*'+MenuController.quick_stat_effect_note+'</span></p>';
			
		html += "</div><br />"; //end box
		
		html += "<div class='box'>";
			html += "<h3>Defence</h3>";
			html += GetStatWithBonuses('Armor Class', 'ac', character_stats);
			html += GetStatWithBonuses('Touch AC', 'touch', character_stats);
			html += GetStatWithBonuses('Flat Footed', 'flat_footed', character_stats);
			if(MenuController.quick_stat_effect_note != '') html += '<p><span class="'+MenuController.effect_note_color+'">*'+MenuController.quick_stat_effect_note+'</span></p>';
		html += "</div><br />"; //end box
		
		//********************************
		//ATTACKS
		html += "<div class='box'>";
		html += '<h3>Attacks</h3>';
		//display attack to screen
		var thisAttackHtml = '';
		var mainAttackHtml = '';
		var secondaryAttackHtml = '';
		
		var hasOffHandAttack = 0;
		for(var i = 0; i < character_stats.action_data.attack_action_data.length; i++)
		{
			var action_data = character_stats.action_data.attack_action_data[i];
			if(action_data.OffHand) hasOffHandAttack = 1;
		}
		for(var i = 0; i < character_stats.action_data.attack_action_data.length; i++)
		{
			var action_data = character_stats.action_data.attack_action_data[i];
			thisAttackHtml = '';
			thisAttackHtml += '<br/>';
			thisAttackHtml += '<div name="attack">';
			thisAttackHtml += "<p'>"+action_data.attack_name+" <span class='fltrt'>";
			
			if(action_data.num_dice > 0)
			{
				thisAttackHtml += (action_data.num_dice > 0) ? action_data.num_dice+"d" : '';
				thisAttackHtml += action_data.die_type;
			}
			
			//get attack bonuses
			var getModifiers = 1;
			var modifier = 0;
			if(hasOffHandAttack)
			{
				//if has 2 weapon fighting feat
				if(CharacterController.HasFeat(character_stats, 'Two-Weapon Fighting'))
					modifier = -2;
				else
				{
					modifier = -4;
					if(action_data.OffHand) modifier = -6;
				}
			}
			var attack_modifiers = ActionController.ResolveAttack(character_stats, action_data, 0, modifier, action_data.OffHand, getModifiers);
			
			//+ damage mod
			thisAttackHtml += '<span class="'+(attack_modifiers.damage_effect_mod>0?'green':'')+(attack_modifiers.damage_effect_mod<0?'red':'')+'">'+(attack_modifiers.damage_mod+attack_modifiers.damage_effect_mod>0 ?'+':'')+(attack_modifiers.damage_mod+attack_modifiers.damage_effect_mod)+'</span>';
			thisAttackHtml += '</span></p>';
			MenuController.effect_note_color = 'green';
			MenuController.effect_note_color = attack_modifiers.damage_effect_mod<0?'red':MenuController.effect_note_color;
			if(attack_modifiers.damage_effect_note_list[0] != '')
			{
				for(var j=0; j<attack_modifiers.damage_effect_note_list.length; j++)
				{
					thisAttackHtml += '<p style="clear:both;" class="fltrt"><span class="'+MenuController.effect_note_color+'">*'+attack_modifiers.damage_effect_note_list[j]+'</span></p>';
				}
			}
			//display attack rolls to screen
			thisAttackHtml += '<p style="clear:both;">Attack Roll <span class="fltrt '+(attack_modifiers.to_hit_effect_mod>0?'green':'')+(attack_modifiers.to_hit_effect_mod<0?'red':'')+'">'+(attack_modifiers.arr_attack[0]>0?'+':'');
			/*
			for(var j=0; j<attack_modifiers.num_attacks; j++)
			{
				if(j>0) thisAttackHtml += "/+";
				thisAttackHtml += (attack_modifiers.to_hit_mod + attack_modifiers.to_hit_effect_mod) - j*5;
			}
			*/
			for(var j=0; j<attack_modifiers.arr_attack.length; j++)
			{
				if(j>0) thisAttackHtml += '/'+(attack_modifiers.arr_attack[j]>0?'+':'');
				thisAttackHtml += attack_modifiers.arr_attack[j];
			}
			
			thisAttackHtml += "</span></p>";
			MenuController.effect_note_color = 'green';
			MenuController.effect_note_color = attack_modifiers.to_hit_effect_mod<0?'red':MenuController.effect_note_color;
			if(attack_modifiers.to_hit_effect_note_list[0] != '') thisAttackHtml += '<p style="clear:both;" class="fltrt"><span class="'+MenuController.effect_note_color+'">*'+attack_modifiers.to_hit_effect_note_list[0]+'</span></p>';
			//display attack specials
			if(action_data.two_hand > 0) thisAttackHtml += '<p style="clear:both; text-align:right;">Two-handed</p>';
			//***USING OLD DATA***
			if(action_data.OffHand > 0) thisAttackHtml += '<p style="clear:both; text-align:right;">Off-Hand</p>';
			if(action_data.Thrown > 0) thisAttackHtml += '<p style="clear:both; text-align:right;">Thrown</p>';
			if(action_data.Flurry > 0) thisAttackHtml += '<p style="clear:both; text-align:right;">Flurry</p>';
			//***						   ***
			//crit range effect mod
			var crit_range = action_data.crit_range;
			thisAttackHtml += "<p style='clear:both;'>Critical <span class='fltrt "+(attack_modifiers.crit_effect_mod? 'green':'')+"'>"+(20-(attack_modifiers.crit_effect_mod? (crit_range==0?1:crit_range*2) :crit_range))+" x"+action_data.crit_mult+"</span></p>";
			if(action_data.range_base > 0) thisAttackHtml += "<p style='clear:both;'>Range <span class='fltrt'>"+action_data.range_base+"</span></p>";
			//bypasses damage reduction
			var get_pass_dr_stat = CharacterController.GetStat(character_stats, 'pass_dr');
			if(get_pass_dr_stat.effect_note_list[0] != '') thisAttackHtml += 'Bypass Damage Reduction: <span class="green fltrt">'+get_pass_dr_stat.effect_note_list[0]+'</span>';
			//str, damage and hit bonuses
			if(attack_modifiers.attack_mod_comment != '') thisAttackHtml += "<p style='clear:both;'><span class='fltlft'>Bonuses:</span><span class='fltrt' style='text-align:right; margin:0;'>"+attack_modifiers.attack_mod_comment+"</span></p>";
			thisAttackHtml += '</div>';
			
			if(action_data.OffHand) secondaryAttackHtml = secondaryAttackHtml+thisAttackHtml;
			else mainAttackHtml = mainAttackHtml+thisAttackHtml;
			
		} 
		//END ATTACKS
		html += mainAttackHtml;
		if(secondaryAttackHtml != '') html += '<br/><hr style="clear:both; margin-left:14px;"/>';
		html += secondaryAttackHtml;
		
		html += "</div><br/>"; //end box
		
		//****************************
		//COMBAT MANUVERS
		html += "<div class='box'>"+
				"<p>BAB <span class='fltrt'>"+character_stats.bab+"</span></p>"+
				//"<br />"+
				"<p>CMB <span class='fltrt'>"+character_stats.cmb+"</span></p>"+
				"<p style='font-size:8pt'>bonuses "+
					'<img id="toggle_cmb_bonuses" style="cursor: pointer; cursor: hand;" '+
						'src="images/graphic/expand_arrow.png" onclick="ShowHide(\'cmb_bonuses\', \'toggle_cmb_bonuses\')" />'+
					"</p>"+
				"<div name='cmb_bonuses' class='hide'>"+
					"<p>Bullrush <span class='fltrt'>+"+character_stats.bullrush_b+"</span></p>"+
					"<p>Disarm <span class='fltrt'>+"+character_stats.disarm_b+"</span></p>"+
					"<p>Grapple <span class='fltrt'>+"+character_stats.grapple_b+"</span></p>"+
					"<p>Sunder <span class='fltrt'>+"+character_stats.sunder_b+"</span></p>"+
					"<p>Trip <span class='fltrt'>+"+character_stats.trip_b+"</span></p>"+
					"<p>Feint <span class='fltrt'>+"+character_stats.feint_b+"</span></p>"+
				"</div>"+
				//"<br />"+
				"<p>CMD <span class='fltrt'>"+character_stats.cmd+"</span></p>"+
				'<p style="font-size:8pt">bonuses '+
					'<img id="toggle_cmd_bonuses" style="cursor: pointer; cursor: hand;" '+
						'src="images/graphic/expand_arrow.png" onclick="ShowHide(\'cmd_bonuses\', \'toggle_cmd_bonuses\')" />'+
				"</p>"+
				"<div name='cmd_bonuses' class='hide'>"+
					"<p>Bullrush <span class='fltrt'>+"+character_stats.bullrush_d+"</span></p>"+
					"<p>Disarm <span class='fltrt'>+"+character_stats.disarm_d+"</span></p>"+
					"<p>Grapple <span class='fltrt'>+"+character_stats.grapple_d+"</span></p>"+
					"<p>Sunder <span class='fltrt'>+"+character_stats.sunder_d+"</span></p>"+
					"<p>Trip <span class='fltrt'>+"+character_stats.trip_d+"</span></p>"+
					"<p>Feint <span class='fltrt'>+"+character_stats.feint_d+"</span></p>"+
				"</div>"+
			"</div>";
			
	html += "</div>"; //end group_box

	html += "<div class='group_box'>";
		
		//CHARACTER PICTURE
		try
		{
			//add male or female '-m' or '-f'
			char_full_image_src +=  character_stats.Gender=='Male'?'-m-':'-f-';
			//add class
			char_full_image_src += character_stats.ClassArr[0].ClassName.toLowerCase();
			/*
			html += "<p>"+race_name+' '+
						character_stats.Gender+' '+
						character_stats.Height+' '+
						character_stats.Weight+' '+
						character_stats.AlignGoodID+' '+
						character_stats.AlignChaosID+' '+
						character_stats.Age+' '+
						character_stats.Deity+' '+
						character_stats.Occupation+' '+
						character_stats.FactionID+"</p>";
			*/
			//float right characters full picture
			html += "<div class='box box_full_pic'>";
				html += '<img id="full_pic" src="./images/char/full/character_create/'+char_full_image_src+'.jpg" alt="'+character_stats.character_name+'" />';
			html += "</div><br />"; //end box
		}
		catch(err)
		{
			//not a full character
		}
		
		html += "<div class='box'>";
			html += "<h3>Secondary</h3>";
			html += "<p>Initiative: ";
			
			var init_stat = CharacterController.GetStat(character_stats, 'initiative');
			var init_mod = init_stat.stat_val;
			var init_effect_mod = init_stat.effect_mod;
			html += "<span class='fltrt'>1D10";
			html += "<span class='"+(init_effect_mod>0?'green':'')+(init_effect_mod<0?'red':'')+"'>"+(init_mod+init_effect_mod > 0?'+':'')+(init_mod+init_effect_mod!=0?init_mod+init_effect_mod:'')+"</span></span>";
			html += "</p>";
			
			html += "<p>Resistances</p>";
			html += "<p>Damage:<span class='fltrt'>"+(character_stats.dr?character_stats.dr:'none')+"</span></p>";
			html += "<p>Spell:<span class='fltrt'>"+character_stats.sr+"</span></p>";
		html += "</div><br />"; //end box
		
		html += "<div class='box'>";
			html += "<h3>Movement</h3>";
			var move_stat = CharacterController.GetStat(character_stats, 'move');
			var move_mod = move_stat.stat_val;
			var move_effect_mod = move_stat.effect_mod;
			html += "<p>Move: ";
			html += "<span class='fltrt "+(move_effect_mod>0?'green':'')+(move_effect_mod<0?'red':'')+"'>"+(move_mod+move_effect_mod)+(move_mod+move_effect_mod > 0?"'":'')+"</span>";
			html += "</p>";
			
			var swim_stat = CharacterController.GetStat(character_stats, 'swim');
			var swim_mod = swim_stat.stat_val;
			var swim_effect_mod = swim_stat.effect_mod;
			html += "<p>Swim: ";
			html += "<span class='fltrt "+(swim_effect_mod>0?'green':'')+(swim_effect_mod<0?'red':'')+"'>"+(swim_mod+swim_effect_mod)+(swim_mod+swim_effect_mod > 0?"'":'')+"</span>";
			html += "</p>";
			
			var fly_stat = CharacterController.GetStat(character_stats, 'fly');
			var fly_mod = fly_stat.stat_val;
			var fly_effect_mod = fly_stat.effect_mod;
			html += "<p>Fly: ";
			html += "<span class='fltrt "+(fly_effect_mod>0?'green':'')+(fly_effect_mod<0?'red':'')+"'>"+(fly_mod+fly_effect_mod)+(fly_mod+fly_effect_mod > 0?"'":'')+"</span>";
			html += "</p>";
			
		html += "</div><br />"; //end box
		
		html += "<div class='box'>";
			html += "<h3>Size</h3>";
			
			var size_stat = CharacterController.GetStat(character_stats, 'size_name');
			var size_name = size_stat.stat_val;
			var size_effect_name = size_stat.effect_mod;
			html += "<p>Size: ";
			html += "<span class='fltrt "+(size_effect_name!=0?'green':'')+(size_effect_name<0?'red':'')+"'>"+(size_effect_name != 0?size_effect_name:size_name)+"</span>";
			html += "</p>";
			
			var space_stat = CharacterController.GetStat(character_stats, 'space');
			var space_mod = space_stat.stat_val;
			var space_effect_mod = space_stat.effect_mod;
			html += "<p>Space: ";
			html += "<span class='fltrt "+(space_effect_mod!=0?'green':'')+(space_effect_mod<0?'red':'')+"'>"+(space_effect_mod != 0?space_effect_mod:space_mod)+"</span>";
			html += "</p>";
			
			var reach_stat = CharacterController.GetStat(character_stats, 'reach');
			var reach_mod = reach_stat.stat_val;
			var reach_effect_mod = reach_stat.effect_mod;
			html += "<p>Reach: ";
			html += "<span class='fltrt "+(reach_effect_mod!=0?'green':'')+(reach_effect_mod<0?'red':'')+"'>"+(reach_effect_mod != 0?reach_effect_mod:reach_mod)+"</span>";
			html += "</p>";
			
		html += "</div><br />"; //end box
		
		//********************************
		//SKILLS
		html += "<div class='box'>";
		html += '<h3>Skills'+
			'<span class="fltrt" style="display:inline-block;font-size:8pt">'+
			'show all'+
			'<img id="toggle_skill" style="cursor: pointer;	cursor: hand;" '+
				'src="images/graphic/expand_arrow.png" onclick="ShowHide(\'knowledge_skills\', \'toggle_skill\')" />'+
			'</span></h3>';
		for(var index in GameController.skill_arr)
		{
			var skill_stat = CharacterController.GetStat(character_stats, 'skill', index);
			skill_mod = skill_stat.stat_val;
			skill_effect_mod = skill_stat.effect_mod;
			
			//hide knowledge skills
			html += "<p";
			if((index >= 13 && index <= 22) || (skill_mod <= 0 && skill_effect_mod <= 2)) 
				html += " class='hide' name='knowledge_skills'>";
			//show non knowledge skills
			else
				html += ">";
			
			//html += character_stats.arr_skill_name[index];
			html += GameController.skill_arr[index].SkillName;
			html += "<span class=' fltrt "+(skill_effect_mod>0?'green':'')+(skill_effect_mod<0?'red':'')+"'>"+(skill_mod+skill_effect_mod > 0?'+':'')+(skill_mod+skill_effect_mod!=0?skill_mod+skill_effect_mod:'')+"</span>";
			
			html += "</p>";
		
		} //end while
		
		//RIGHT DIV ENDS
		html += "</div>";
		
	html += "</div>"; //end overtop
	html += "</div>"; //end group_box
	
	//*********
	//LEFT DIV ENDS
	html += '</div><div style="clear:both;"></div>'; //end div id="left_column"
	
	html += "</div> <!-- end div 'quick_stats_view_inner' -->";
	html += "</div> <!-- end div 'quick_stats_view' -->";
	return html;
}
