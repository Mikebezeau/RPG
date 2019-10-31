//v12

var BattleController = BattleController || {};

BattleController=
{
	'battle_grid':[
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0]
		],
	
	'action_confirmed': 0,
	'show_select_area': 0,
	'highlight_character_selected_index': -1,
	'player_character_selected_index': -1,
	'process_battle_action_diceRoll': [],
	'selected_battle_screen_coords': [0,0],
	'target_character_index_array': [],
	'process_battle_action_args': 0,
	'process_battle_action_data': 0,
	
	'move_into_battle_interval': 0,
	'pause_battle_interval': 0,
	
	'bg_file_names': [
		"beach.jpg",//0
		"cave.png",
		"cave_glow.jpg",
		"cave_ice_bright.jpg",
		"cave_magma.jpg",
		"cave_path.jpg",//5
		"cave_ruins.jpg",
		"forest_day.jpg",
		"forest_path.jpg",
		"forest_path_dark.jpg",
		"forest_path_old.jpg",//10
		"forest_path_snow.jpg",
		"forest_plants.jpg",
		"mine.jpg",
		"mountain_path.jpg",
		"mountain_path_bright.jpg",//15
		"mountain_path_ice.jpg",
		"plains.jpg",
		"ruins.jpg",
		"ruins_tower_top.jpg",
		"town_new.jpg",
		"town_old.jpg"//21
	],
	
	'tile_size': function()
	{
		return 30;
	}
}	

BattleController.init = function()
{
	var battle=this;
	
	battle.canvas = document.getElementById('battle');
	battle.context = document.getElementById('battle').getContext('2d');
	
	battle.particle_effects_canvas = document.getElementById('battle-particle-effects');
	battle.particle_effects_context = document.getElementById('battle-particle-effects').getContext('2d');
	
	battle.weapons_effects_canvas = document.getElementById('battle-weapons-effects');
	battle.weapons_effects_context = document.getElementById('battle-weapons-effects').getContext('2d');
	
	battle.battle_info_canvas = document.getElementById('battle-info-display');
	battle.battle_info_context = document.getElementById('battle-info-display').getContext('2d');
	
	battle.bgcanvas = document.getElementById('battlebg');
	battle.bgcontext = document.getElementById('battlebg').getContext('2d');
	
	battle.canvas.height=300;
	battle.canvas.width=544;
	battle.context.imageSmoothingEnabled = false;
	
	battle.weapons_effects_canvas.height=544;
	battle.weapons_effects_canvas.width=544;
	battle.weapons_effects_context.imageSmoothingEnabled = false;
	
	battle.particle_effects_canvas.height=544;
	battle.particle_effects_canvas.width=544;
	
	battle.battle_info_canvas.height=544;
	battle.battle_info_canvas.width=544;
	
	battle.bgcanvas.height=300;
	battle.bgcanvas.width=544;
	battle.bgcontext.fillStyle="#000";
	battle.bgcontext.fillRect(0,0,battle.bgcanvas.width,battle.bgcanvas.height);
	
	//onclick on battle canvas select target
	$('#battle').click(function(e)
	{	
		var rect = battle.canvas.getBoundingClientRect();
		var mouseY = Math.floor((e.clientY - rect.top));
		var mouseX = Math.floor((e.clientX - rect.left));
		
		var gridX = Math.floor(mouseX/battle.tile_size());
		var gridY = Math.floor((mouseY-20)/battle.tile_size());
		
		battle.SelectTarget(gridX, gridY, mouseX, mouseY);
	});
}
BattleController.SelectTarget = function(gridX, gridY, mouseX, mouseY)
{
	var battle=this;
	
	//clear current selected index
	battle.player_character_selected_index = battle.highlight_character_selected_index = -1;
	
	//if can select target, not target self only
	//if not waiting for confirmation, can click any character
	if(!battle.process_battle_action_data 
		//or has effect, and target type is not self only
		|| (battle.process_battle_action_data.effects != 0 && battle.process_battle_action_data.effects[0].TargetTypeID != 0)
		//or has no effect
		|| battle.process_battle_action_data.effects == 0
	)
	{
		//get closest character to click coord
		var closestDistance = 99;
		var distanceTo = 0;
		var sprite_coords;
		for(var i=0; i<GameController.characters.length; i++)
		{
			if(GameController.characters[i].in_encounter)
			{
				sprite_coords = GameController.characters[i].sprite_coords;
				//sprite_coords[gridX,gridY]
				
				distanceTo = Math.sqrt(Math.pow(gridX-sprite_coords[0], 2) + Math.pow(gridY+1-sprite_coords[1], 2));
				
				if(closestDistance > distanceTo)
				//if(sprite_coords[0]*battle.tile_size() < mouseX && sprite_coords[1]*battle.tile_size()+20 < mouseY && (sprite_coords[0]+1)*battle.tile_size()	> mouseX && (sprite_coords[1]+1)*battle.tile_size()+20 > mouseY)
				{
					closestDistance = distanceTo
					if(CharacterController.IsPartyMember(GameController.characters[i]))
					{
						//battle.player_character_selected_index don't set if selecting a PC, only store enemy target selection
						battle.highlight_character_selected_index = i;
					}
					else
					{
						battle.player_character_selected_index = battle.highlight_character_selected_index = i;
					}
				}
			}
		}
		
		CharacterController.ShowCharacterDisplay();
		battle.draw();
		
		if(battle.show_select_area)
		{
			for(var i=0; i<battle.process_battle_action_data.effects[0].EffectArea.length; i++)
			{
				battle.selected_battle_screen_coords = [gridX,gridY];
				//onsole.log(battle.selected_battle_screen_coords);
				var size = Math.floor(EffectController.GetAoeSize(battle.process_battle_action_data, i) / 5);
				GameController.burst_radius(battle.battle_grid,gridX,gridY,size);
			}
			BattleController.target_character_index_array = CharacterController.HighlightInAoe(battle.process_battle_action_data.effects);
			battle.draw();
		}
	}
}
BattleController.start_battle = function(monster_index)
{
	//start battle
	var battle=this;
	
	GameController.in_encounter=true;
	$('#game-map-container').fadeOut();
	
	BattleController.battle_info_canvas.height = 300;
	$('#loading-text').html('BATTLE');
	$('#loading').fadeIn();
	$('#play-menu-icon-container').fadeOut();
	$('#game-map-container').fadeOut();
	$('#game-map-buttons').fadeOut();
	//SpriteAnimController.StartAnimation(1, 'loading', 220, 130);
	
	if(arguments.length < 1)
	{
		monster_index = -1;
		battle.highlight_character_selected_index = battle.player_character_selected_index = -1;
	
	}
	else
	{
		battle.highlight_character_selected_index = battle.player_character_selected_index = monster_index;
		GameController.characters[monster_index].in_encounter = true;
	}
	
	//set MenuController to battle menu output
	MenuController.is_battle_menu = true;
	
	//use AI for battle
	battle.use_ai = 1;
	
	/*initiative from php query, each element in array includes:
		CharacterID
		InitRoll
	*/
	battle.initiative = [],
	
	battle.current_initiative_index = 0;
	battle.current_character_stats_index = -1;
	battle.target_character_index_array = [];
	battle.process_battle_action_diceRoll = [];
	
	/*encounter_data from php query, includes:
		EncounterID
		CampaignID
		MapName
		BGPicFileName
		CurrentRound
		CurrentInit
		Active
		Title
		Encounter
		Description
		StartedDate
	*/
	
	//create encounter data
	battle.encounter_data = {
		'CurrentRound': 1,
		'player_party_id':GameController.player.party_id,
		'map_file_name':'',
		'bg_pic_file_name':'',
		'monster_character_id':GameController.characters[monster_index].character_stats.character_id
	};
	
	//load up the player party
	for(var i=0; i<GameController.characters.length; i++)
	{
		if(CharacterController.IsPartyMember(GameController.characters[i]))
		{
			battle.add_character_to_encounter(GameController.characters[i], true);
			//GameController.characters[i].last_round_action_click_button_index = -1;
		}
	}
	
	//set 1st monster data, other monsters get added after battle has been initialized
	if(monster_index > -1)
	{
		battle.add_character_to_encounter(GameController.characters[monster_index], true, monster_index);
	}
	
	/*
	var callback = function(data){
		data = jQuery.parseJSON(data);
		battle.encounter_id = data.encounter_id;
		//set round number and encounter id in actioncontroller
		ActionController.Init(0, battle.encounter_id);
		battle.monster_party_id = data.monster_party_id;
		load_encounter_data();
	};
	ajax_action('encounter_create.php',0,battle.encounter_data,callback,false);
	
	//initialize/load encounter data
	function load_encounter_data()
	{
		var callback = function(data){
			data = $.parseJSON(data);
			battle.encounter_data = data.encounter_data;
			battle.initiative = data.init_data;
			for(var i=0; i<battle.initiative.length; i++)
			{
				battle.initiative[i].InitRoll = parseInt(battle.initiative[i].InitRoll);
			}
			
			if(monster_index > -1)
			{
				set_first_monster(monster_index);
			}
			
			//clear loading animation
			SpriteAnimController.SpriteAnimation.clearAnimations();
			//switch to battle screen
			$('#game-map-container').hide();
			battle.battle_info_context.clearRect(0, 0, battle.battle_info_canvas.width, battle.battle_info_canvas.height);
			$('#battle-attack-output').html('');
			if(GameController.dev_mode) $('#battle-secondary').show();
			
			if(bg_image_or_encounter_data_loaded)
			{
				//begin battle round
				battle.get_next_character_stats_index();
				battle.begin_round();
			}
			bg_image_or_encounter_data_loaded = true;
		};
		ajax_action('encounter_data.php',battle.encounter_id,0,callback,false);
	}
	*/
	
	battle.encounter_id = 0; //not saving to DB now
	ActionController.Init(0, battle.encounter_id);
	
	//clear loading animation
	SpriteAnimController.SpriteAnimation.clearAnimations();
	//switch to battle screen
	$('#game-map-container').hide();
	battle.battle_info_context.clearRect(0, 0, battle.battle_info_canvas.width, battle.battle_info_canvas.height);
	$('#battle-attack-output').html('');
	
	//if(GameController.dev_mode) $('#battle-secondary').show();
	/*
	if(!window.mobile)
	{
		$('#battle-secondary').show();
		if(GameController.dev_mode) $('#battle-secondary-buttons').show();
	}
	*/
	
	WeatherController.stop();
	
	//background image
	var background_image = new Image();
	
	//select random battle background image
	//Math.floor(Math.random() * (max - min)) + min
	//var num_bg_files = battle.bg_file_names.length;
	//var bg_file_name = battle.bg_file_names[Math.floor(Math.random()*(num_bg_files - 1))];
	
	//get from area variable
	var bg_file_name = battle.bg_file_names[GameController.area_settings[GameController.area_id].BattleBgIndex];
	background_image.src = "./images/battlebg/"+bg_file_name;
	//these calculations don't work on mobile???
	
	var bg_image_or_encounter_data_loaded = 0;
	
	background_image.onerror = function()
	{
		battle.get_next_character_stats_index();
		battle.begin_round();
		//bg_image_or_encounter_data_loaded = true;
		$('#loading-text').html('');
		$('#loading').fadeOut();
		$('#battle-container').stop().fadeIn();
		//start a timer for playing idle animations randomly
		battle.idleInterval = setInterval(battle.idleIntervalCheck, 2000);
	}
	background_image.onload = function()
	{
		if(!window.mobile)
		{
			var bg_image_scale_mult = battle.bgcanvas.width / background_image.width;
			var bg_image_translated_height = Math.floor(background_image.height * bg_image_scale_mult);
			
			if(bg_image_translated_height < 300) bg_image_translated_height = 300
			
			var bg_image_height_offset = Math.floor((bg_image_translated_height - battle.bgcanvas.height) / 3);
			
			//safari?
			try{
				battle.bgcontext.drawImage(background_image, 
					0, bg_image_height_offset, background_image.width, background_image.height, 
					0, 0, battle.bgcanvas.width, bg_image_translated_height);
			}catch(err){
				battle.bgcontext.drawImage(background_image, 0, 0, battle.bgcanvas.width, battle.bgcanvas.height);
			}
		}
		//for mobile draw bg image stretched to canvas size
		else
		{
			battle.bgcontext.drawImage(background_image, 0, 0, battle.bgcanvas.width, battle.bgcanvas.height);
		}
		
		//if(bg_image_or_encounter_data_loaded)
		//{
			//begin battle round
			battle.get_next_character_stats_index();
			battle.begin_round();
		//}
		//bg_image_or_encounter_data_loaded = true;
		$('#loading-text').html('');
		$('#loading').fadeOut();
		$('#battle-container').stop().fadeIn();
		
		//start a timer for playing idle animations randomly
		battle.idleInterval = setInterval(battle.idleIntervalCheck, 2000);
	}
}
BattleController.add_character_to_encounter = function(character, initializing, character_index)
{
	//need character_index in dev_mode to load monster menu, and for the function to slide monsters in when they join the battle
	if(arguments.length < 2)
	{
		initializing = false;
	}
	
	var battle=this;
	character_stats = character.character_stats;
	character.in_encounter = 1;
	
	/*
	//if monster, add to enounter in DB and get the initiative
	if(character_stats.GoodGuy == 0)
	{
		var new_initiative_roll;
		
		var callback = function(data){
			new_initiative_roll = parseInt(data);
			character_stats.init_roll = parseInt(new_initiative_roll);
		};
		data = {
			monster_party_id: battle.monster_party_id,
			monster_character_id: character_stats.character_id
		};
		if(!initializing)
		{
			ajax_action('encounter_add_monster.php',battle.encounter_id,data,callback,false);
		}
		
		//if in dev mode, load the monster combat menu
		if(GameController.dev_mode)
		{
			//set  menu as part of their character_stats
			var menu_data = MenuController.CreateCharacterMenuItems(character_index);
			GameController.characters[character_index].character_stats.menu_data = menu_data;
		}
	}
	*/
	
	//---
	//if in dev mode, load the monster combat menu
	if(GameController.dev_mode && !CharacterController.IsPartyMember(character))
	{
		//set menu as part of their character_stats
		var menu_data = MenuController.CreateCharacterMenuItems(character_index);
		GameController.characters[character_index].character_stats.menu_data = menu_data;
	}
	
	//---
	battle.add_to_and_order_initiative_array(character_stats);
	//---
	
	//add to initiative array
	if(!CharacterController.IsPartyMember(character))
	{
		character.moving_into_battle = 1;
		character.sprite_offset[0] = -300;
		if(battle.move_into_battle_interval == 0)
		{
			battle.move_into_battle_interval = setInterval(battle.move_into_battle, 60);
		}
	}
}
BattleController.move_into_battle = function()
{
	var clear_interval = true;
	for(var i=0; i<GameController.characters.length; i++)
	{
		if(GameController.characters[i].in_encounter && GameController.characters[i].moving_into_battle)
		{
			if(GameController.characters[i].sprite_offset[0] > -15)
			{
				GameController.characters[i].sprite_offset[0] = 0;
				GameController.characters[i].moving_into_battle = 0;
			}
			else
			{
				clear_interval = false;
				GameController.characters[i].sprite_offset[0] = GameController.characters[i].sprite_offset[0] + 15;
			}
		}
	}
	requestAnimationFrame(BattleController.draw);
	if(clear_interval)
	{
		clearInterval(BattleController.move_into_battle_interval);
		BattleController.move_into_battle_interval = 0;
	}
}
BattleController.add_to_and_order_initiative_array = function(character_stats, place_after_character_stats)
{
	var battle = this;
	
	if(arguments.length < 2)
	{
		place_after_character_stats = 0;
		character_stats.init_roll = (Math.floor(Math.random() * (10 - 1)) + 1) + parseInt(character_stats.initiative);
	}
	else
	{
		character_stats.init_roll = place_after_character_stats.init_roll;
	}
		
	insert_init_loop:
	for(var i = 0; i < battle.initiative.length; i++)
	{
		//regular init addition
		if(place_after_character_stats == 0)
		{
			//if character_stats.init_roll is higher then current, add as previous element in array
			if(character_stats.init_roll > battle.initiative[i].InitRoll)
			{
				battle.initiative.splice(i, 0, {"CharacterID":character_stats.character_id, "InitRoll":character_stats.init_roll, 'joined': battle.encounter_data.CurrentRound});
				break insert_init_loop;
			}
			//if reached last element add new initiative to end of array
			else if(i == battle.initiative.length - 1)
			{
				battle.initiative.push({"CharacterID":character_stats.character_id, "InitRoll":character_stats.init_roll});
				break insert_init_loop;
			}
		}
		//adding a new character mid round, after another specific character (summoning in)
		else
		{
			//if character_stats.init_roll is higher then current, add as previous element in array
			if(place_after_character_stats.character_id == battle.initiative[i].CharacterID)
			{
				battle.initiative.splice(i+1, 0, {"CharacterID":character_stats.character_id, "InitRoll":character_stats.init_roll, 'joined': battle.encounter_data.CurrentRound});
				break insert_init_loop;
			}
		}
	}
	
	//if first entry in initiative
	if(battle.initiative.length == 0)
	{
		battle.initiative.push({"CharacterID":character_stats.character_id, "InitRoll":character_stats.init_roll});
	}
	//onsole.log('add_to_and_order init: '+JSON.stringify(battle.initiative));
}

BattleController.set_starting_positions = function()
{
	var battle=this;
	
	//set starting position of characters
	
	//battle_grid is 14x7 squares battle_grid[x,y]
		
	var sprite_count = 0;
	var playerFormationSet = true;
	var sprite_side;
		
	
	//hack for enemy party size
	var enemyPartySize = 0;
	for(var i=0; i<GameController.characters.length; i++)
	{
		if(!GameController.characters[i].character_stats.GoodGuy && GameController.characters[i].in_encounter)
		//can add if character in_encounter
		{
			enemyPartySize++;
		}
	}
	//onsole.log('set_starting_positions',enemyPartySize);
	if(enemyPartySize == 1 || enemyPartySize == 2) sprite_count = 1;
	
	for(var i=0; i<GameController.characters.length; i++)
	{
		//check PC characters for any that don't have formation set: sprite_coords
		
		if(CharacterController.IsPartyMember(GameController.characters[i]) && GameController.characters[i].sprite_coords == [-1,-1])
		{
			playerFormationSet = false;
		}
		
		sprite_side = GameController.characters[i].character_stats.GoodGuy;
		if(GameController.characters[i].in_encounter && GameController.characters[i].sprite_coords[0] == -1 && GameController.characters[i].sprite_coords[1] == -1 && sprite_side == 0)//bad guys in the encounter
		{
			var positionFound = false;
			var sprite_coords = [-1,-1];
			while(!positionFound)
			{
				//increment sprite_count to check next position if open
				sprite_count = sprite_count+1;
				
				//flip x with scale flips xpos too
				sprite_coords = [10, sprite_count*3-1];
				if(sprite_count > 3)
				{
					sprite_coords = [12, (sprite_count-3)*3];
				}
				if(sprite_count > 5)
				{
					sprite_coords = [14, (sprite_count-5)*3-1];
				}
				if(sprite_count > 8)
				{
					sprite_coords = [16, (sprite_count-6)*3];
				}
				
				if(!CharacterController.SpriteCoordsTaken(sprite_coords))
				{
					GameController.characters[i].sprite_coords = sprite_coords;
					positionFound = true;
				}
			}
			//onsole.log('positionFound',sprite_coords);
		}
	}
	//set player formation if 
	if(!playerFormationSet)
	{
		CharacterController.SetFormation();
	}
}
BattleController.outline_sprite = function(colorRGBA, image, xpos, ypos, toContext, thickness, width, height)
{
	var battle=this;
	
	if(arguments.length < 5)
	{
		toContext = battle.context
	}
	if(arguments.length < 6)
	{
		thickness = 2;
	}
	if(arguments.length < 8)
	{
		width = image.naturalWidth;
		height = image.naturalHeight;
	}
	var newCanvas = document.getElementById("battle-staging");
	newCanvas.width = image.naturalWidth;
	newCanvas.height = image.naturalHeight;
	var newContext = newCanvas.getContext("2d");
	newContext.drawImage(image, 0, 0);
	
	//draw mask of image
	//get copy of image on memory canvas
	var imageData = newContext.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
	//make a masked copy of the sprite
	for (var i=0; i<imageData.data.length; i+=4)
	{
		if(imageData.data[i+3]>0)
		{
			imageData.data[i]=colorRGBA[0];
			imageData.data[i+1]=colorRGBA[1];
			imageData.data[i+2]=colorRGBA[2];
			imageData.data[i+3]=colorRGBA[3];
		}
	}
	newContext.putImageData(imageData,0,0);
	
	toContext.drawImage(newCanvas, xpos,ypos+thickness*2, width, height);
	toContext.drawImage(newCanvas, xpos,ypos-thickness*2, width, height);
	toContext.drawImage(newCanvas, xpos-thickness*2,ypos, width, height);
	toContext.drawImage(newCanvas, xpos-thickness,ypos-thickness, width, height);
	toContext.drawImage(newCanvas, xpos-thickness,ypos+thickness, width, height);
	toContext.drawImage(newCanvas, xpos+thickness*2,ypos, width, height);
	toContext.drawImage(newCanvas, xpos+thickness,ypos-thickness, width, height);
	toContext.drawImage(newCanvas, xpos+thickness,ypos+thickness, width, height);
}
BattleController.begin_round = function()
{
	var battle = this;
	//if not the first round, move nearby characters towards party to join battle
	//onsole.log(battle.encounter_data.CurrentRound);
	if(battle.encounter_data.CurrentRound > 1)
	{
		//let characters move 2 spaces
		CharacterAiController.move_npc_monster();
		CharacterAiController.move_npc_monster();
	}
	
	//set starting position of characters - for characters joining battle
	battle.set_starting_positions();
	
	ActionController.PrintNextRound();
	
	battle.current_initiative_index = 0;
	battle.get_next_character_stats_index();
	
	battle.begin_next_character_turn();
}
BattleController.end_round = function()
{
	var battle = this;
	
	//decrease duration of effects 
	EffectController.DecreaseDurationOnInit(0)
	
	CharacterAiController.move_npc_monster();
	CharacterAiController.move_npc_monster();
	
	battle.encounter_data.CurrentRound++;
	battle.begin_round();
}

BattleController.IsMonsterDeadEndBattle = function()
{
	//if party has slain all monsters, end the battle
	var is_monsters_dead = true;
	for(i in GameController.characters)
	{
		var character = GameController.characters[i];
		if(character.in_encounter)
		{
			if(character.character_stats.GoodGuy == 0 && CharacterController.IsCharacterAlive(character.character_stats)) is_monsters_dead = false;
		}
	}
	if(is_monsters_dead == true)
	{
		BattleController.end_battle();
	}
	return is_monsters_dead;
}
BattleController.begin_next_character_turn = function()
{
	var battle = this;
	//onsole.log(battle.initiative);
	//clear action data to start new action
	MenuController.BattleMenuClearAction();
	
	//WAIT for character joining battle to move across screen to their positions
	if(battle.move_into_battle_interval != 0)
	{
		if(battle.pause_battle_interval == 0) battle.pause_battle_interval = setInterval(function()
			{
				if(battle.move_into_battle_interval == 0)
				{
					clearInterval(battle.pause_battle_interval);
					battle.pause_battle_interval = 0;
					battle.begin_next_character_turn();
				}
			}, 200)
		//stop turn from starting until everyone has moved onto the map
		return false;
	}
	
	//decrease duration of effects 
	//THIS MIGHT NOT WORK WELL WHEN battle.initiative IS RESET //EffectController.DecreaseDurationOnInit(battle.initiative[battle.current_initiative_index].InitRoll);
	
	//onsole.log('??---');
	if(BattleController.IsMonsterDeadEndBattle()) return false;
	if(!CharacterController.IsPlayerAlive()) return false;
	//onsole.log('??');
	var current_character_stats = GameController.characters[battle.current_character_stats_index].character_stats;
	//if this character can't act
	if(!CharacterController.IsCharacterAlive(current_character_stats))
	{
		if(!GameController.dev_mode) battle.end_character_turn();
	}
	
	var ai_action_delayed = 0;
	//if was making a character, there is another #character-name ?
	$('#battle-menu-container #character-name').html('<h3>'+current_character_stats.character_name+' <span>HP: '+(current_character_stats.hp - current_character_stats.hp_damage)+'/'+current_character_stats.hp+'</span></h3>');
	
	//if now a goodguy turn
	if(current_character_stats.GoodGuy == 1)
	{
		//show menu icons
		//onsole.log('CreateBattleMenu');
		MenuController.CreateBattleMenu();
		//reselect the last monster player had selected previously
		battle.highlight_character_selected_index = battle.player_character_selected_index;
	}
	//if dev_mode mode show enemy menu
	else if(GameController.dev_mode)
	{
		//onsole.log('CreateBattleMenu');
		MenuController.CreateBattleMenu();
	}
	//if not dev_mode, clear menu during enemy action
	else
	{
		MenuController.BattleMenuClose();
	}
	
	ActionController.PrintNextCharTurn(current_character_stats.character_name);
	
	if(!GameController.dev_mode && current_character_stats.GoodGuy == 0 && battle.use_ai == 1)
	{
		//set a 1/2 second wait before ai acts
		setTimeout(function(){
			ai_action_delayed = 1
			if(ai_action_delayed == 1)
			{
				//if all buttons loaded and ai to control enemy action
				CharacterAiController.ai_action();
			}
		}, 500);
	}
	
	CharacterController.ShowCharacterDisplay();
	battle.draw();
}

BattleController.end_character_turn = function()
{
	//if there needs to be time to load (i.e. on summon creature) wait till everything is loaded
	if(ActionController.aiActionWait)
	{
		var aiActionWaitTillLoaded = setInterval(function(){
				if(GameController.resources_loaded == GameController.resources_loading)
				{
					ActionController.aiActionWait = false;
					clearInterval(aiActionWaitTillLoaded);
					BattleController.end_character_turn();
				}
			}, 500);
		return false;
	}
	
	//remove highlight
	BattleController.highlight_character_selected_index = -1;
	
	BattleController.current_initiative_index++;
	//if no more characters to act, start a new round
	
	if(BattleController.get_next_character_stats_index())
	{
		BattleController.begin_next_character_turn();
	}
	else
	{
		BattleController.end_round();
	}
}
BattleController.get_next_character_stats_index = function()
{
	var battle = this;
	//go through all characters to find character id that goes next
	for(var i in GameController.characters)
	{
		//if past end of initiative order, done next round will be started
		if(battle.current_initiative_index >= battle.initiative.length)
		{
			return false;
		}
		//if found character id of next character in intiative order
		if(GameController.characters[i].character_stats.character_id == battle.initiative[battle.current_initiative_index].CharacterID)
		{
			//if conscious
			if(CharacterController.IsCharacterAlive(GameController.characters[i].character_stats))
			{
				battle.current_character_stats_index = i;
				return true;
			}
			//if unconscious, increment battle.current_initiative_index to check for next character
			else
			{
				battle.current_initiative_index++;
				return battle.get_next_character_stats_index();
			}
		}
	}
	//if no conscious character found no next character
	return false;
},
BattleController.end_battle = function()
{
	var battle = this;
	BattleController.battle_info_canvas.height = 544;
	clearInterval(battle.idleInterval);
	MenuController.is_battle_menu = false;
	MenuController.MenuClose();
	//remove highlighted characters
	battle.current_character_stats_index = -1;
	battle.player_character_selected_index = -1;
	battle.highlight_character_selected_index = -1;
	battle.draw();
	
	GameController.in_encounter = false;
	for(var i = GameController.characters.length - 1; i >= 0; i--)
	{
		GameController.characters[i].in_encounter = false;
	}
	
	$('#show-character-a').html('');
	$('#show-character-b').html('');
	$('#loading-text').html('Victory');
	$('#loading').fadeIn();
	
	//save characters in the battle
	var characters_to_save = [];
	for(i in GameController.characters)
	{
		if(GameController.characters[i].in_encounter)
		{
			characters_to_save.push(GameController.characters[i])
			GameController.characters[i].in_encounter = 0;
		}
	}
	GameController.SaveGame(false, characters_to_save);
	
	//fade out after .5 seconds
	setTimeout(function()
		{
			CharacterController.ShowCharacterDisplay(GameController.active_player_index);
			//Update the map image to show killed characters as skeletons (in object_layer)
			GameController.redraw_object_bg_graphics = true;
			GameController.draw();
			SpriteAnimController.SpriteAnimation.clearAnimations();
			$('#game-map-container').show();
			if(window.mobile) $('#game-map-buttons').show();
			$('#play-menu-icon-container').fadeIn(200);
			$('#battle-container').fadeOut(200, function(){
					//clear victory message
					battle.battle_info_context.clearRect(0,0,battle.battle_info_canvas.width,battle.battle_info_canvas.height);
				});
			$('#loading').stop().fadeOut();
		}, 500);
	//$('#battle-secondary').hide();
	WeatherController.start();
}
BattleController.heal_all = function()
{
	var battle = this;
	//get all characters id in an array and send to php function to set hp damage to 0
	var character_ids = [];
	for(var i in GameController.characters)
	{
		if(GameController.characters[i].in_encounter)
		{
			character_ids.push(GameController.characters[i].character_stats.character_id);
			//set hp_damage = 0 for each character
			GameController.characters[i].character_stats.hp_damage = 0;
		}
	}
	var callback = function()
	{
		alert('All characters at full HP');
	}
	ajax_action('functions_for_testing.php?heal_all=1',0,character_ids,callback,false);
}
BattleController.animate_attack = function(character_index_action, character_index_target, action_data, alter_hp_damage)
{
	if(arguments.length < 4)
	{
		alter_hp_damage = 1;//default show hit if not given
	}
	
	var battle = BattleController;
	
	battle.attack_anim_move_forward = 1;
	battle.special_anim_duration = 0;
	battle.attack_anim_attack_duration = 0;
	battle.attack_anim_return = 0;
	battle.attack_anim_target_shake = 0;
	battle.attack_anim_target_dodge = 0;
	battle.attack_anim_target_return = 0;
	battle.attack_anim_finished = 0;
	
	var character_target = GameController.characters[character_index_target];
	if(character_target.hide_sprite) SpriteAnimController.SpriteAnimation.clearAnimations(character_index_target);
	
	battle.attack_anim_interval = setInterval(battle.attack_anim_interval_function, 100, character_index_action, character_index_target, action_data, alter_hp_damage);
	return 500;
}

BattleController.attack_anim_interval_function = function(character_index_action, character_index_target, action_data, alter_hp_damage)
{
	var character_action = GameController.characters[character_index_action];
	var character_target = GameController.characters[character_index_target];
	var battle = BattleController;
	var duration = 0;
	
	//start by moving active character forward
	if(battle.attack_anim_move_forward)
	{
		character_action.sprite_offset[0] = character_action.sprite_offset[0] + 5;
		//once character is in forward position
		if(character_action.sprite_offset[0] > 5)
		{
			battle.attack_anim_move_forward = 0;
			battle.current_character_stats_index = character_index_action;//for actions !in_encounter
			
			//if action has a special sprite anim (for special abilities)
			//start animation now and character_action sprite will be replaced with the animation
			if(action_data.sprite_anim != '')
			{
				//sprite specific attack anim
				if(CharacterController.GetSpriteSheet(GameController.characters[battle.current_character_stats_index]) > 0)//0 is the index for the effects sprite sheet
				{
					var character = GameController.characters[character_index_action];
					var yscale_x = CharacterController.IsPartyMember(character) ? 1 : -1;
					var ysprite_scale = CharacterController.GetSpriteScale(character);
					var yspriteSheet = CharacterController.GetSpriteSheet(character);
					var yanimName = action_data.sprite_anim;
					var ytargetX = CharacterController.SpritePxXnew(character, false, ysprite_scale);
					if(yscale_x < 0) ytargetX += CharacterController.GetSprite(character).naturalWidth;
					
					var ytargetY = CharacterController.SpritePxYnew(character, false, ysprite_scale);
					SpriteAnimController.SpriteAnimation.clearAnimations(battle.current_character_stats_index);
					battle.special_anim_duration = SpriteAnimController.StartAnimation(yspriteSheet, yanimName, yscale_x*ytargetX, ytargetY, yscale_x*ysprite_scale, battle.current_character_stats_index);
				}
			}
			//play attack animation
				//for two weapon attack
			var two_weapon_action_data = 0;
			if(typeof action_data.main != 'undefined')
			{
				two_weapon_action_data = action_data;
				action_data = action_data.main;//showing miss even when off-hand hits
			}
			battle.attack_anim_attack_duration = battle.play_attack_animation(character_index_action, character_index_target, action_data, alter_hp_damage);
			//if there's a target and it took damage
			if(character_index_target > -1 && alter_hp_damage > 0)
			{
				//if target character has a taking damage animation
				var scale_x = CharacterController.IsPartyMember(character_target) ? 1 : -1;
				var sprite_scale = CharacterController.GetSpriteScale(character_target);
				var spriteSheet = CharacterController.GetSpriteSheet(character_target);
				var animName = 'damage';
				var targetX = CharacterController.SpritePxXnew(character_target, false, sprite_scale);
				var targetY = CharacterController.SpritePxYnew(character_target, false, sprite_scale);
				if(scale_x < 0) targetX += CharacterController.GetSprite(character_target).naturalWidth;
				
				SpriteAnimController.SpriteAnimation.clearAnimations(character_index_target);
				//target being hit
				battle.anim_damage_duration = 0;
				//if not dead yet play damage animation, else play death animation
				//this will play on the map outside of encounter
				if(!GameController.in_encounter) sprite_scale = sprite_scale*GameController.map_scale*GameController.scale_sprite;
				if(CharacterController.IsCharacterAlive(character_target.character_stats)) SpriteAnimController.StartAnimation(spriteSheet, animName, scale_x*targetX, targetY, scale_x*sprite_scale, character_index_target);//taking damage
				//else PLAY DEATH ANIM
				if(!battle.anim_damage_duration)//taking damage
				{
					//no taking damage animation for target, shake target instead
					setTimeout(function(){ battle.attack_anim_target_shake = 1; }, 300);
					setTimeout(function(){ battle.attack_anim_target_shake = 0; character_target.sprite_offset[0] = 0; }, 1000);
				}
				//IF CHARACTER DIES set timeout to draw skeleton - duration = 1000 or DEATH ANIM duration
			}
			//else if there's a target and it didn't take damage
			else if(character_index_target > -1 && character_index_action != character_index_target)
			{
				//if target character has a dodge animation
				var scale_x = CharacterController.IsPartyMember(character_target) ? 1 : -1;
				var sprite_scale = CharacterController.GetSpriteScale(character_target);
				var spriteSheet = CharacterController.GetSpriteSheet(character_target);
				var animName = 'dodge';
				var targetX = CharacterController.SpritePxXnew(character_target, false, sprite_scale);
				var targetY = CharacterController.SpritePxYnew(character_target, false, sprite_scale);
				if(scale_x < 0) targetX += CharacterController.GetSprite(character_target).naturalWidth;
				
				SpriteAnimController.SpriteAnimation.clearAnimations(character_index_target);
				//target dodging
				if(!GameController.in_encounter) sprite_scale = sprite_scale*GameController.map_scale*GameController.scale_sprite;
				battle.anim_dodge_duration = SpriteAnimController.StartAnimation(spriteSheet, animName, scale_x*targetX, targetY, scale_x*sprite_scale, character_index_target);//dodge
				duration = 300;
				setTimeout(function(){ battle.attack_anim_target_dodge = 1; }, duration);
			}
			
			duration = !battle.attack_anim_attack_duration ? 500 : battle.attack_anim_attack_duration;
			duration = !battle.special_anim_duration ? duration : battle.special_anim_duration;
			setTimeout(function(){ battle.attack_anim_return = 1; }, duration);
		}
	}
	
	if(battle.attack_anim_target_shake)
	{
		if(character_target.sprite_offset[0] != 2)
			character_target.sprite_offset[0] = 2;
		else
			character_target.sprite_offset[0] = -2;
	}
	
	if(battle.attack_anim_target_dodge)
	{
		character_target.sprite_offset[0] = character_target.sprite_offset[0] - 10;
		if(character_target.sprite_offset[0] < -20)
		{
			battle.attack_anim_target_dodge = 0;
			battle.attack_anim_target_return = 1;
		}
	}
	
	if(battle.attack_anim_target_return)
	{
		character_target.sprite_offset[0] = character_target.sprite_offset[0] + 10;
		if(character_target.sprite_offset[0] >= 0)
		{
			battle.attack_anim_target_return = 0;
			character_target.sprite_offset[0] = 0;
		}
	}
	
	if(battle.attack_anim_return)
	{
		character_action.sprite_offset[0] = character_action.sprite_offset[0] - 5;
		if(character_action.sprite_offset[0] <= 0)
		{
			battle.attack_anim_return = 0;
			character_action.sprite_offset[0] = 0;
			battle.attack_anim_finished = 1;
		}
	}
	
	
	requestAnimationFrame(battle.draw);
	if(battle.attack_anim_finished)
	{
		clearInterval(battle.attack_anim_interval);
		battle.attack_anim_move_forward = 1;
		battle.special_anim_duration = 0;
		battle.attack_anim_attack_duration = 0;
		battle.attack_anim_return = 0;
		battle.attack_anim_target_shake = 0;
		battle.attack_anim_target_dodge = 0;
		battle.attack_anim_target_return = 0;
		battle.attack_anim_finished = 0;
		clearInterval(battle.attack_anim_interval);
		if(GameController.in_encounter) battle.end_character_turn();
	}
}
BattleController.play_attack_animation = function(character_index_action, character_index_target, action_data, alter_hp_damage)
{
	var battle=this;
	
	var character_action = GameController.characters[character_index_action];
	var character_target = GameController.characters[character_index_target];
	
	var effect_data = action_data.effects[0];
	//var effect_data = {'RGB_min' : [50,50,100], 'RGB_max' : [150,150,255], 'particle_count' : 0, 'shock_lines' : 3};
	
	var scale = GameController.in_encounter ? 1 : GameController.map_scale*GameController.scale_sprite;
	var sprite_scale = CharacterController.GetSpriteScale(GameController.characters[battle.current_character_stats_index]);
	var contextX = CharacterController.SpritePxXnew(character_action, true);
	var contextY = CharacterController.SpritePxYnew(character_action, false);

	var duration = 0;

	var action_type = action_data.action_type;
	
	if(action_type == 'attack')
	{
		//melee animation
		
		var scale_x;
		//place animation a bit in front of character
		var anim_offset = Math.floor(CharacterController.GetSprite(character_action).naturalWidth / 3 * sprite_scale);
		
		if(character_action.character_stats.GoodGuy == 1)
		{
			scale_x = 1;
		}
		else
		{
			scale_x = -1;
			anim_offset = -anim_offset;
			//if flipping to face other direction, change to negative value
			contextX = -contextX;
		}
		
		//sprite specific attack anim
		if(CharacterController.GetSpriteSheet(GameController.characters[battle.current_character_stats_index]) > 0)
		{
			var character = GameController.characters[battle.current_character_stats_index]
			var yscale_x = CharacterController.IsPartyMember(character) ? 1 : -1;
			var ysprite_scale = CharacterController.GetSpriteScale(character);
			var yspriteSheet = CharacterController.GetSpriteSheet(character);
			var yanimName = 'attack';
			var ytargetX = CharacterController.SpritePxXnew(character, false, ysprite_scale);
			if(yscale_x < 0) ytargetX += CharacterController.GetSprite(character).naturalWidth;
			
			var ytargetY = CharacterController.SpritePxYnew(character, false, ysprite_scale);
			SpriteAnimController.SpriteAnimation.clearAnimations(battle.current_character_stats_index);
			var anim_duration = SpriteAnimController.StartAnimation(yspriteSheet, yanimName, yscale_x*ytargetX, ytargetY, yscale_x*ysprite_scale, battle.current_character_stats_index);
		}
		//default attack effect
		else
		{
			//place animation a bit infront of character
			contextX += anim_offset;
			//position generic animation effect slightly up off the floor
			//contextY -= Math.floor(character_action.character_sprite.naturalHeight/4/sprite_scale)
		
			var spriteSheet = 0; //0 has all the combat sprite effects
			var animName = 'anim2';
			//ranged weapon
			if(action_data.weapon_type_id == 4)
			{
				animName = 'anim3';
			}
			//if not a PC, then add the sprite scale to the attack animation
			var sprite_scale = CharacterController.GetSpriteScale(GameController.characters[battle.current_character_stats_index]);
			//var attack_scale = CharacterController.IsPartyMember(character_action) ? 1 : sprite_scale;
			var attack_scale = 1;
			//var attack_scale = 1;
			duration = SpriteAnimController.StartAnimation(spriteSheet, animName, contextX/attack_scale, contextY/attack_scale, scale_x * attack_scale);//attack
		}
		
		//melee sound effect
		//random sound 0-7
		var random_sound = Math.floor(Math.random()*(7))
		if(!GameController.sound_mute) GameController.sound.battle[random_sound].play();
	}
	else
	{
		var animCastDuration = 0;
		if(effect_data != 0)
		{
			//sound effect
			if(!GameController.sound_mute) GameController.sound.magic_missiles.play();
			
			//if has starting animation
			if(effect_data.AnimNameCast != '')
			{
				animCastDuration = SpriteAnimController.StartAnimation(effect_data.AnimSpriteSheetCast, effect_data.AnimNameCast, contextX, contextY, scale);
			}
			
			setTimeout(function()
			{
				var animEffectDuration = 0;
				//if has canvas animation
				if(EffectController.HasCanvasAnim(effect_data))
				{
					animEffectDuration = CanvasAnimController.StartAnimation(effect_data, contextX, contextY, targetX, targetY);
				}
				
			}, animCastDuration*0.75);
		}
		duration = animCastDuration+500;// + animEffectDuration;
	}
	
	return duration;
}

BattleController.play_hit_animation = function(character_index_action, character_index_target, action_data, alter_hp_damage, waitDuration)
{
	var battle=this;
	
	var character_action = GameController.characters[character_index_action];
	var character_target = GameController.characters[character_index_target];
	
	var effect_data = action_data.effects[0];
	var scale = GameController.in_encounter ? 1 : GameController.map_scale*GameController.scale_sprite;
	var sprite_scale = CharacterController.GetSpriteScale(GameController.characters[battle.current_character_stats_index]);
	var duration = 0;
	var action_type = action_data.action_type;
	//onsole.log(battle.selected_battle_screen_coords[0],battle.selected_battle_screen_coords[1]);
	if(character_index_target > -1)
	{
		targetX = CharacterController.SpritePxXnew(character_target, true);
		targetY = CharacterController.SpritePxYnew(character_target, true);
	}
	else
	{
		if(GameController.in_encounter)
		{
			//battle screen coords
			targetX = battle.selected_battle_screen_coords[0]*battle.tile_size() + 27;
			targetY = battle.selected_battle_screen_coords[1]*battle.tile_size() + 27 + 20;
		}
		else
		{
			//game map coords
			targetX = (Math.floor((battle.selected_battle_screen_coords[0] - GameController.display_start_x())*GameController.tileset_tile_size + GameController.tileset_tile_size/2) * scale);
			targetY = (Math.floor((battle.selected_battle_screen_coords[1] - GameController.display_start_y())*GameController.tileset_tile_size + GameController.tileset_tile_size/2) * scale);
		}
	}
	if(action_type == 'attack')
	{
		if(character_action.character_stats.GoodGuy == 1)
		{
			scale_x = 1;
		}
		else
		{
			scale_x = -1;
			//if flipping to face other direction, change to negative value
			targetX = -targetX;
		}
		
		targetY -= Math.floor(CharacterController.GetSprite(character_target).naturalHeight/4*sprite_scale)
		
		spriteSheet = 0;
		if(alter_hp_damage > 0)
		{
			setTimeout(function(){SpriteAnimController.StartAnimation(spriteSheet, 'anim8', targetX, targetY, scale_x);}, waitDuration/2+300);//hit
			setTimeout(function(){SpriteAnimController.StartAnimation(spriteSheet, 'anim24', targetX+20, targetY, scale_x);}, waitDuration/2+600);//blood
			setTimeout(function(){SpriteAnimController.StartAnimation(spriteSheet, 'anim25', targetX+50, targetY, scale_x);}, waitDuration/2+630);//blood
		}
		else
		{
			setTimeout(function(){SpriteAnimController.StartAnimation(spriteSheet, 'anim8', targetX, targetY, scale_x);}, waitDuration/2+300);//miss
		}
	}
	else
	{
		//if has ending animation
		if(effect_data.AnimNameTarget != '')
		{
			setTimeout(function()
			{
				//if single target, run loop once with that target id in BattleController.target_character_index_array
				//else loop through BattleController.target_character_index_array
				if(BattleController.target_character_index_array.length == 0)
				{
					BattleController.target_character_index_array.push(target_character_index);
				}
				for(var i=0; i<BattleController.target_character_index_array.length; i++)
				{
					//get target position
					targetX = CharacterController.SpritePxXnew(GameController.characters[BattleController.target_character_index_array[i]], true);
					targetY = CharacterController.SpritePxYnew(GameController.characters[BattleController.target_character_index_array[i]], true);
					//run end animaiton
					SpriteAnimController.StartAnimation(effect_data.AnimSpriteSheetTarget, effect_data.AnimNameTarget, targetX, targetY, scale);
				}
			}, waitDuration*2);
		}
	}
}
BattleController.clear_select = function()
{
	BattleController.battle_info_context.clearRect(0, 0, BattleController.battle_info_canvas.width, BattleController.battle_info_canvas.height);
}
BattleController.idleIntervalCheck = function()
{
	for(var i=0; i<GameController.characters.length; i++)
	{
		if(GameController.characters[i].in_encounter)
		{
			//one in 10 chance to start an idle animation
			var chance = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
			var character = GameController.characters[i];
			if(chance == 1 && !character.hide_sprite && CharacterController.IsCharacterAlive(character.character_stats))
			{
				//if target character has a taking damage animation
				var scale_x = CharacterController.IsPartyMember(character) ? 1 : -1;
				var sprite_scale = CharacterController.GetSpriteScale(character);
				var spriteSheet = CharacterController.GetSpriteSheet(character);
				var animName = 'random_idle';
				var targetX = CharacterController.SpritePxXnew(character, false, sprite_scale);
				var targetY = CharacterController.SpritePxYnew(character, false, sprite_scale);
				if(scale_x < 0) targetX += CharacterController.GetSprite(character).naturalWidth;
				var anim_duration = SpriteAnimController.StartAnimation(spriteSheet, animName, scale_x*targetX, targetY, scale_x*sprite_scale, i);//taking damage
				/*
				if(anim_duration)//doing anim
				{
					character.hide_sprite = 1;
					requestAnimationFrame(BattleController.draw);
				}
				*/
			}
		}
	}
}
BattleController.draw = function()
{
	//called from outside controller
	var battle = BattleController;
	
	//clear canvas
	battle.context.clearRect(0,0,battle.canvas.width,battle.canvas.height);
	
	var visible_sprites = [];
	for(var i=0; i<GameController.characters.length; i++)
	{
		//skip character if animating
		if(GameController.characters[i].hide_sprite == 1) continue;
		
		if(GameController.characters[i].in_encounter)
		{
			visible_sprites.push(i);
		}
	}
	
	for(var y=0; y<battle.battle_grid[0].length; y++)
	{
		for(var j=0; j<visible_sprites.length; j++)
		{
			var i = visible_sprites[j];//quick hack
			var character_index = visible_sprites[j];
			var character = GameController.characters[i];
			
			if(character.sprite_coords[1] != y) continue;
			
			var image = CharacterController.GetSprite(character);
			battle.context.save();
			
			//get sprite coordinates
			var this_sprite_scale = CharacterController.GetSpriteScale(character);
			var xpos = CharacterController.SpritePxXnew(character, false, this_sprite_scale);
			var ypos = CharacterController.SpritePxYnew(character, false, this_sprite_scale);
			
			//is this character hasn't had it's corpse drawn to background
			if(character.battle_skeleton_drawn != 1)
			{
				var sprite_side = character.character_stats.GoodGuy;
				if(sprite_side==1)
				{
					battle.context.scale(this_sprite_scale, this_sprite_scale);
					//put outline around sprite if selected
					if(battle.highlight_character_selected_index == i || GameController.characters[i].highlight)
					{
						var colorRGBA = 0;
						//if selecting fellow good guy make it green, if enemy selecting make it red
						if(GameController.characters[battle.current_character_stats_index].character_stats.GoodGuy == 1)
						{
							colorRGBA = [70,255,70,100];
						}
						else
						{
							colorRGBA = [255,70,70,100];
						}
						if(GameController.characters[battle.current_character_stats_index].character_stats.GoodGuy == 1 || GameController.dev_mode)
						{
							battle.outline_sprite(colorRGBA, image, xpos, ypos);
						}
					}
				}
				else
				{
					//flip horizontal with x = -1
					battle.context.scale(-this_sprite_scale, this_sprite_scale);
					
					//flip x to negative, and add the sprites width to x position because scale x is -1
					xpos = -xpos - image.naturalWidth;
					
					//put outline around sprite if selected
					if(battle.highlight_character_selected_index == i || GameController.characters[i].highlight)
					{
						var colorRGBA = 0;
						//if selecting good guy make it red, if selecting fellow enemy make it green
						if(GameController.characters[battle.current_character_stats_index].character_stats.GoodGuy == 1)
						{
							colorRGBA = [255,70,70,100];
						}
						else
						{
							colorRGBA = [70,255,70,100];
						}
						if(GameController.characters[battle.current_character_stats_index].character_stats.GoodGuy == 1 || GameController.dev_mode)
						{
							battle.outline_sprite(colorRGBA, image, xpos, ypos);
						}
					}

				}
				
				//highlight sprite who's turn it is if not selected as target
				if(battle.current_character_stats_index == i 
					&& (GameController.characters[battle.current_character_stats_index].character_stats.GoodGuy == 1 || GameController.dev_mode) 
					&& (battle.highlight_character_selected_index != i && !GameController.characters[i].highlight)
					)
				{
					battle.outline_sprite([70,70,255,100], image, xpos, ypos);
				}
				
				//draw sprite over outline
				battle.context.drawImage(image,xpos,ypos);
				
				battle.context.restore();
			}
			
			if(!CharacterController.IsCharacterAlive(character.character_stats))//dead
			{
				//deselect KO'd character
				if(battle.highlight_character_selected_index == i)
				{
					battle.highlight_character_selected_index = -1;
				}
				if(battle.player_character_selected_index == i)
				{
					battle.player_character_selected_index = -1;
				}
				
				//draw the corpse on a timeout
				if(!character.hide_sprite && character.battle_skeleton_draw_timeout != 1)
				{
					character.battle_skeleton_draw_timeout = 1;
					setTimeout(function(character_index){
							var character = GameController.characters[character_index];
							character.battle_skeleton_drawn = 1;
							//make image a skeleton on the ground //{'layer': 0, 'tileset_index': 25, 'tileset_pos': [0, 10]}
							var ts_size = GameController.tileset_tile_size;
							xpos = CharacterController.SpritePxXnew(character, true) + Math.floor(Math.random()*(14)-7);
							ypos = CharacterController.SpritePxYnew(character, true) + Math.floor(Math.random()*(14)-7);
							battle.bgcontext.drawImage(GameController.tileset_object[25], 10*ts_size, 0, ts_size, ts_size, Math.floor(xpos-BattleController.tile_size()), Math.floor(ypos-BattleController.tile_size()), ts_size*1.5, ts_size*1.5);
						}, 500, character_index);
				}
				
			}
		}
	}
	
	if(battle.show_select_area)
	{
		//onsole.log('show_select_area');
		battle.battle_info_context.clearRect(0,0,battle.battle_info_canvas.width,battle.battle_info_canvas.height);
		for(y=0; y<battle.battle_grid[0].length; y++)
		{
			for(x=0; x<battle.battle_grid.length; x++)
			{
				switch(battle.battle_grid[x][y])
				{
					//no effect (0's)
					case 0:
					break;
					
					//effect square (not 0's)
					default:
						battle.battle_info_context.fillStyle='#ff7';
						battle.battle_info_context.globalAlpha=0.4;
						battle.battle_info_context.fillRect(x*battle.tile_size(), y*battle.tile_size()+20, battle.tile_size(), battle.tile_size());
						battle.battle_info_context.globalAlpha=1;
						battle.battle_grid[x][y]=0;
					break;
				}
			}
		}
	}
	/*
	//shows the grid
	else
	{
		battle.battle_info_context.clearRect(0,0,battle.battle_info_canvas.width,battle.battle_info_canvas.height);
		for(y=0; y<battle.battle_grid[0].length; y++)
		{
			for(x=0; x<battle.battle_grid.length; x++)
			{
				if((y%2==1 && x%2==0) || (y%2==0 && x%2==1))
				{
					battle.battle_info_context.fillStyle='#ff7';
					battle.battle_info_context.globalAlpha=0.4;
					battle.battle_info_context.fillRect(x*battle.tile_size(), y*battle.tile_size()+20, battle.tile_size(), battle.tile_size());
					battle.battle_info_context.globalAlpha=1;
					battle.battle_grid[x][y]=0;
				}
			}
		}
	}
	*/
}