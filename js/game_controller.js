//v12
var GameController = GameController || {};

GameController=
{
	'intro_screen': true,
	'game_loading': false,
	'dev_mode': false,
	'edit': false,
	'edit_initialized': false,
	'edit_menu_initialized': false,
	'new_player': false,
	'functionSpeedTimerNow': Date.now(),
	'functionSpeedTimerThen': Date.now(),
	
	'functionDrawSpeedTimerNow': Date.now(),
	'functionDrawSpeedTimerThen': Date.now(),
	
	'adventure' : 0, //.AdventureID .StartAreaID .StartEventID .Image .Title .Description
	
	'game_screen_num_tiles_width': 17,
	'game_screen_num_tiles_height': 17,
	
	'preloadImages': [],
	
	'saveGameAjaxCall': 0,
	
	'tileset_wall': new Image(),
	'wall_graphic_number_tilesets_in_image': {x:3, y:18},
	'wall_graphic_tileset_length': {x:7, y:3},
	'tileset_floor': new Image(),
	'floor_graphic_number_tilesets_in_image': {x:3, y:13},
	'floor_graphic_tileset_length': {x:7, y:3},
	'tileset_pit': new Image(),
	'pit_graphic_number_tilesets_in_image': {x:1, y:16},
	'pit_graphic_tileset_length': {x:7, y:2},
	//'pit_graphic_type': {startX:0,lengthX:7,startY:1,lengthY:2},
	'tileset_door_closed': new Image(),
	'tileset_door_open': new Image(),
	'tileset_indexes_required': [], //array of tileset indexs that are required for current maps loaded,
	'tileset_object': [], //array of tileset images - new Image(),
	'tileset_random_ground': new Image(),
	'tileset_array': {
			0: "./images/tileset/decor0.png",
			1: "./images/tileset/grouped/house1.png",
			2: "./images/tileset/grouped/castle1.png",
			3: "./images/tileset/grouped/house2.png",
			4: "./images/tileset/grouped/stone_bridge.png",
			11: "./images/tileset/grouped/outdoor1.png",
			12: "./images/tileset/grouped/outdoor_construct1.png",
			13: "./images/tileset/grouped/ladder_bridge_stairs1.png",
			14: "./images/tileset/grouped/indoor1.png",
			15: "./images/tileset/grouped/indoor_rich_1.png",
			16: "./images/tileset/grouped/forest1.png",
			17: "./images/tileset/grouped/evil1.png",
			18: "./images/tileset/grouped/cathedral_outside.png",
			19: "./images/tileset/grouped/church.png",
			20: "./images/tileset/grouped/cozy_inn.png",
			21: "./images/tileset/grouped/village2.png",
			22: "./images/tileset/grouped/village_objects.png",
			23: "./images/tileset/grouped/abandoned_shack.png",
			24: "./images/tileset/grouped/cavern.png",
			25: "./images/tileset/grouped/evil2.png",
			26: "./images/tileset/grouped/evil3.png",
			27: "./images/tileset/grouped/assorted.png",
			28: "./images/tileset/grouped/barovia.png",
			29: "./images/tileset/grouped/ravenloft.png",
			30: "./images/tileset/grouped/forest.png",
			31: "./images/tileset/grouped/village2_inside.png",
			32: "./images/tileset/grouped/barovia_inside.png"
		},
		
	'area_id': -1,
	'characters': [],
	
	'player': 0,
	'player_knowledge_tags': [],
	'player_completed_events': [],
	'active_player_index': -1,
	//used to not overload game when player clicking movement buttons quickly (is an issue on mobile)
	'player_moving': 0,
	'player_moving_direction': function(setDirection)
	{
		if(this.active_player_index > -1)
		{
			if(arguments.length < 1)
				return this.characters[this.active_player_index].direction;
			else
			{
				this.characters[this.active_player_index].direction = setDirection;
			}
		}
		return -1;
	},
	'player_move_duration_countdown': 0,
	'smooth_move_distance': 0,
	'distance_per_smooth_move': 11,
	'smooth_move_interval': 0,
	'mobile_continuous_move': 0,
	'player_look': 0,
	'player_talk': 0,
	//used for redrawing area around mouse click in edit mode
	'player_mouse_grid_x': -1,
	'items': {'weapon': 0, 'armor': 0, 'equipment': 0}, //currently loaded with party data, gets list of all items
	'itemImages': {'weapon': {}, 'armor': {}, 'equipment': {}}, //list of all items images
	'pc_world_itmes' : [],
	
	'player_mouse_grid_y': -1,
	
	'display_start_x':	function()
	{
		var display_start_x;
		if(!this.edit)
		{
			display_start_x = Math.ceil(this.characters[this.active_player_index].x-(Math.floor(this.game_screen_num_tiles_width/2))/this.map_scale);
			//if the start is off the map then start where the map starts
			//if(display_start_x < 0) display_start_x = 0;
		}
		else
		{
			display_start_x = this.edit_start_x;
		}
		return display_start_x;
	},
	'display_start_y':	function()
	{
		var display_start_y;
		if(!this.edit)
		{
			display_start_y = Math.ceil(this.characters[this.active_player_index].y-(Math.floor(this.game_screen_num_tiles_height/2))/this.map_scale);
			//if the start is off the map then start where the map starts
			//if(display_start_y < 0) display_start_y = 0;
		}
		else
		{
			display_start_y = this.edit_start_y;
		}
		return display_start_y;
	},
	
	'quickstat_character_stats': [],
	//for calculating: monster movement, fill area, and fill los 
	'open_grid': [],
	'closed_grid': [],
	'parent_grid': [],
	'cost_grid': [],
	
	//MAX MAP SIZE IS 100x100//***changed back to variable size maps***
	//floor = 0, wall = 1, pit = 2, fence = 3, door = 4
	'floor_wall_pit_fence_door_layer': [],
	//store what tileset to use for wall floor and pit
	//tileset_type_layer[y][x][0][0] = wall tilset start y tile
	//tileset_type_layer[y][x][0][1] = wall tilset start x tile
	//tileset_type_layer[y][x][1][0] = floor tilset start y tile
	//tileset_type_layer[y][x][1][1] = floor tilset start x tile
	//tileset_type_layer[y][x][2][0] = pit tilset start y tile
	//tileset_type_layer[y][x][2][1] = pit tilset start x tile
	'tileset_type_layer': [],
	'wall_pit_fence_door_graphic_layer': [],
	'floor_graphic_layer': [],
	//'wall_pit_fence_door_graphic_layer_history': {}, //doesnt really speed things up
	//'floor_graphic_layer_history': {},
	'random_ground_layer': [],
	'character_layer': [],
	'object_layer': [],
	'event_layer': [],
	//description_index_layer[y][x] = index of description_text for those y,x coords
	'description_index_layer': [],
	'description_text': [],
	'edit_description_array': [],
	'select_layer': [],
	'vision_fog_layer': [],
	'vision_fog_single_check_layer': [],//keep the single square check separate
	'vision_fog_layer_already_checked_flag': [],
	'vision_layer_remember_map': [],
	'vision_remember_map_alpha': window.mobile?0.75:0.9,
	'facade_layer': [],
	'empty_layer': [],
	
	'in_event': 0,
	
	'area_height': 0,
	'area_width': 0,
	'get_area_height': function(){return this.area_height;},
	'get_area_width': function(){return this.area_width;},
	
	'un_parsed_map_file': 0,
	'un_parsed_tileset_file': 0,
	'map_file_history': [],
	'tileset_file_history': [],
	'vision_layer_remember_map_history': [],
	'events': [],
	'area_settings': [],
	
	'drawing_map': 0,
	'map_scale': 1,
	'scale_sprite': 0.8,
	'tileset_tile_size': 32,
	'tile_size': function()
	{
		return (Math.round(this.tileset_tile_size * this.map_scale));
	},
	
	//sounds
	'sound_mute': true,//false,
	'sound': {},
	
	//zoom functions
	'zoom_in': function()
	{
		if(this.map_scale < 1.3)
		{
			//clear battle_info_context 
			BattleController.battle_info_context.clearRect(0,0,BattleController.battle_info_canvas.width,BattleController.battle_info_canvas.height);
			if(this.map_scale < 0.5) this.map_scale = 0.5;
			else if(this.map_scale == 1) this.map_scale = 1.3;
			else this.map_scale = this.map_scale + 0.5;
			//set to re-draw graphic layer
			this.redraw_wall_graphics = true;
			this.redraw_object_bg_graphics = true;
			this.redraw_characters = true;
			//for edit - zoom to center of screen
			this.edit_start_x = this.edit_start_x + Math.floor(this.game_screen_num_tiles_width/2)/this.map_scale;
			this.edit_start_y = this.edit_start_y + Math.floor(this.game_screen_num_tiles_height/2)/this.map_scale;
			this.edit_start_x = this.edit_start_x < 0 ? 0 : this.edit_start_x;
			this.edit_start_y = this.edit_start_y < 0 ? 0 : this.edit_start_y; 
			this.edit_start_x = this.edit_start_x > this.get_area_width() - Math.ceil(this.game_screen_num_tiles_width/this.map_scale) ? this.get_area_width() - Math.ceil(this.game_screen_num_tiles_width/this.map_scale) : this.edit_start_x;
			this.edit_start_y = this.edit_start_y > this.get_area_height() - Math.ceil(this.game_screen_num_tiles_height/this.map_scale) ? this.get_area_height() - Math.ceil(this.game_screen_num_tiles_height/this.map_scale) : this.edit_start_y;
			//Update the image
			this.display_context.fillStyle='#000';
			this.display_context.fillRect(0,0,544,544);
			this.draw();
		}
	},
	'zoom_out': function()
	{
		if(this.map_scale > 0.25)
		{
			//clear battle_info_context 
			BattleController.battle_info_context.clearRect(0,0,BattleController.battle_info_canvas.width,BattleController.battle_info_canvas.height);
			if(this.map_scale <= 0.5) this.map_scale = 0.25;
			else if(this.map_scale == 1.3) this.map_scale = 1;
			else this.map_scale = this.map_scale - 0.5;
			//this.set_canvas_size();//edit has static canvas size
			//set to re-draw graphic layer
			this.redraw_wall_graphics = true;
			this.redraw_object_bg_graphics = true;
			this.redraw_characters = true;
			//for edit - zoom to center of screen
			this.edit_start_x = this.edit_start_x - Math.floor(this.game_screen_num_tiles_width/4)/this.map_scale;
			this.edit_start_y = this.edit_start_y - Math.floor(this.game_screen_num_tiles_height/4)/this.map_scale;
			this.edit_start_x = this.edit_start_x < 0 ? 0 : this.edit_start_x;
			this.edit_start_y = this.edit_start_y < 0 ? 0 : this.edit_start_y; 
			this.edit_start_x = this.edit_start_x > this.get_area_width() - Math.ceil(this.game_screen_num_tiles_width/this.map_scale) ? this.get_area_width() - Math.ceil(this.game_screen_num_tiles_width/this.map_scale) : this.edit_start_x;
			this.edit_start_y = this.edit_start_y > this.get_area_height() - Math.ceil(this.game_screen_num_tiles_height/this.map_scale) ? this.get_area_height() - Math.ceil(this.game_screen_num_tiles_height/this.map_scale) : this.edit_start_y;
			//Update the image
			this.display_context.fillStyle='#000';
			this.display_context.fillRect(0,0,544,544);
			this.draw();
		}
	}
}

GameController.load_show_intro_screen = function()
{
	var game=GameController;
	GameController.intro_screen = 1;
	GameController.game_loading = 0;
	$('#game-screen-container').hide();
	$('#battle-secondary').hide();
	$('#title-page').show();
	$('#player-name').show();
	if(!window.mobile) $('#player-name').focus();
	$('#license-credits').show();
	$('#game-menu-inner').css('height','2000px');
	$(window).trigger('resize');
	
	//remove scroll bar for opening title
	$('#column-1').css('overflow-y','hidden');
	
	var intro_screen_loading_count = 2;
	var intro_screen_load_count = 0;
	
	//set based on mobile here, device type has been collected at this point
	//GameController.sound_mute = window.mobile ? true : false;
	GameController.sound_mute = true;
	if(window.mobile) GameController.sound_mute = true;
	if(!GameController.sound_mute)
	{
		game.sound.intro_theme = game.sound.dark_castle;
		GameController.soundTestInterval = setInterval(
			function()
			{
				if(game.sound.intro_theme.readyState == 4)//buffered long enough to play
				{
					clearInterval(GameController.soundTestInterval);
					//game.sound.intro_theme = game.sound.battle_bgm;
					game.sound.intro_theme.currentTime = 77;
					game.sound.intro_theme.play();
					//audio.addEventListener('ended', PlayNext);
				}
			}, 500);//intro music
	}

	$('#game-begin-button').stop().hide();
	$('#loading').hide();
	
	callback = function(data)
	{
		$('#play-page').css('background-image','none');
		
		intro_screen_load_count++;
		
		data = $.parseJSON(data);
				
		$('#select-player-party-load').html(data.select_box);
		
		for(var i = 0; i < data.party_thumb_images.length; i++)
		{
			var party_selection_img_container = '';
			party_selection_img_container += '<div class="party-selection-img-container" style="position:relative;" data-party-id="'+data.party_thumb_images[i].party_id+'"><div class="selected-party" style="background-color:#000; position:absolute; top:0; left:0; width:100%; height:100%; opacity:0.25;"></div><div style="position:relative;"><div class="party-selection-party-name">'+data.party_thumb_images[i].party_name+'</div>';
			for(var j = 0; j < data.party_thumb_images[i].thumb_id.length; j++)
			{
				party_selection_img_container += '<img src="images/char/thumb/charthumb_'+data.party_thumb_images[i].thumb_id[j]+'.png"></img>';
			}
			party_selection_img_container += '</div></div>';
			$('#select-player-party-load').append(party_selection_img_container);
		}
		
		if(intro_screen_load_count = intro_screen_loading_count)
		{
			$('#select-edit-mode').show();
		}
	}
	ajax_action('load_party_selection.php',0,0,callback);
	
	callback = function(data)
	{
		intro_screen_load_count++;
		$('#select-start-map-load').html(data);
		$('#edit-page-adventure-start-map-load').html(data);
		if(intro_screen_load_count = intro_screen_loading_count)
		{
			$('#select-edit-mode').show();
		}
	}
	ajax_action('load_map_selection.php',0,0,callback);
	
	//update the hidden select box
	
	$(document).on(window.mobile?'touchend':'click', '.pc-select-image', function(e)
	{
		e.stopPropagation();
		e.preventDefault();
		$('.pc-select-image').find('span').css('color','#FFF');
		$(this).find('span').css('color','#7F7');
		var character_id = $(this).data('id');
		$('#pc-selection').val(character_id);
		
		$('#select-game-play-mode').show();
		$('#reset-character').show();
		$('#delete-pc-character').show();
	});
	
	//character creation / delete code in CharacterController
	
	$('#select-edit-mode').click(function()
	{
		if(game.dev_mode){
			$('#edit-page').fadeOut(250, function(){
				$('#play-page').fadeIn(250);
			});
		} else {
			//$('#edit-page').fadeOut(500, function(){ $('#intro-screen').fadeOut(500, function(){ $('#loading').show(); }) });
			$('#edit-page').fadeOut(500, function(){ $('#intro-screen').fadeOut(500) });
			$('#loading').show();
			game.edit_level($('#select-start-map-load #start-map-selection').val());
		}
	});
	
	$('#select-game-play-mode').bind(window.mobile?'touchend':'click', function(e)
	{
		e.stopPropagation();
		e.preventDefault();
		if(GameController.game_loading) return false;
		$('#column-1').scrollTop(0);
		$('#column-1').css('overflow-y','hidden');
		//$('#play-page').fadeOut(500, function(){ $('#intro-screen').fadeOut(500, function(){ $('#loading').show(); }) });
		$('#play-page').fadeOut(500, function(){ $('#intro-screen').fadeOut(500) });
		$('#loading').show();
		//var party_id = -1;
		var character_id = -1;
		if($('#pc-selection').val() > -1)
		{
			//party_id = parseInt($('#pc-selection').find(':selected').data('party-id'));
			character_id = parseInt($('#pc-selection').find(':selected').data('character-id'));
			game.start(character_id, GameController.adventure.StartAreaID);
		}
		else
		{
			//party_id = $('#player-party-selection').val();
			alert('not used');
		}
		//game.start(party_id, $('#select-start-map-load #start-map-selection').val());
	});
	
	$('#show-edit-page').click(function(){
		//$('#title-page').fadeOut(250, function(){
		$('#play-page').fadeOut(250, function(){
			$('#edit-page').fadeIn(250);
			$('#edit-page-new-map').show();
		});
	});
	$('.show-play-page').click(function(){
		$('#title-page').fadeOut(250, function(){
			if(game.dev_mode){
				$('#edit-page').fadeIn(250);
			} else {
				$('#play-page').fadeIn(250);
			}
		});
	});
	
	
	//if me enter name 'mikebezeau' then show dev options
	$('#player-name').keyup(function(e)
	{
		var name = $(this).val().replace(/[&\/\\#+()$~%'.,":;`|*<>!@ ^\-\=\?{}\[\]]/g, '');
		$(this).val(name);
		
		if($(this).val().length > 1)
		{
			$('#game-begin-button').fadeIn();
		}
		else if($(this).val().length < 2)
		{
			$('#game-begin-button').stop().hide();
		}
		
		var code = e.which; // recommended to use e.which, it's normalized across browsers
		if(code==13)e.preventDefault();
		if(code==32||code==13||code==188||code==186)
		{
			GameController.GameBegin();
		}
	});
	
	//new map
	$('#edit-page-create-new-map').click(function(e)
	{
		var map_id = $('#edit-page-map-id-new').val().replace(/[&\/\\#+()$~%'.,":;`|*<>!@ ^\-\=\?{}\[\]]/g, '');
		var height = $('#edit-page-map-height').val();
		var width = $('#edit-page-map-width').val();
		game.create_new_map(map_id,height,width);
		$('#edit-page').fadeOut(500, function(){ $('#intro-screen').fadeOut(500, function(){ $('#loading').show(); }) });
	});
	
}

GameController.init_load_tilesets = function()
{
	var game=GameController;
	
	game.context = game.canvas.getContext('2d');
	game.context_wall_and_floor_graphical = game.canvas_wall_and_floor_graphical.getContext('2d');
	game.context_object_bg = game.canvas_object_bg.getContext('2d');
	game.context_event_object = game.canvas_event_object.getContext('2d');
	game.context_character = game.canvas_character.getContext('2d');
	game.context_object_fg = game.canvas_object_fg.getContext('2d');
	game.context_vision_fog = game.canvas_vision_fog.getContext('2d');
	game.context_facade = game.canvas_facade.getContext('2d');
	game.context_select = game.canvas_select.getContext('2d');
	
	game.context.imageSmoothingEnabled = false;
	game.context_wall_and_floor_graphical.imageSmoothingEnabled = false;
	game.context_object_bg.imageSmoothingEnabled = false;
	game.context_event_object.imageSmoothingEnabled = false;
	game.context_character.imageSmoothingEnabled = false;
	game.context_object_fg.imageSmoothingEnabled = false;
	game.context_vision_fog.imageSmoothingEnabled = false;
	game.context_facade.imageSmoothingEnabled = false;
	game.context_select.imageSmoothingEnabled = false;
	
	game.resources_loading = 0;
	game.resources_loaded = 0;
	game.tilesets_loading = 0;
	game.tilesets_loaded = 0;
	game.sprites_loading = 0;
	game.sprites_loaded = 0;
	game.icons_loading = 0;
	game.icons_loaded = 0;
	game.menus_loading = 0;
	game.menus_loaded = 0;
	
	//load tilesets
	
	GameController.LoadTileset(0);//common tiles
	GameController.LoadTileset(25);//tileset with the skeleton
	
	game.tilesets_loading++;
	game.tileset_wall = new Image();
	game.tileset_wall.src = "./images/tileset/wall.png";
	game.tileset_wall.onload = function(){
		game.tilesets_loaded++;
	};
	
	game.tilesets_loading++;
	game.tileset_floor = new Image();
	game.tileset_floor.src = "./images/tileset/floor.png";
	game.tileset_floor.onload = function(){
		game.tilesets_loaded++;
	};
	
	game.tilesets_loading++;
	game.tileset_pit = new Image();
	game.tileset_pit.src = "./images/tileset/pit0.png";
	game.tileset_pit.onload = function(){
		game.tilesets_loaded++;
	};
	
	game.tilesets_loading++;
	game.tileset_door_closed = new Image();
	game.tileset_door_closed.src = "./images/tileset/door_closed.png";
	game.tileset_door_closed.onload = function(){
		game.tilesets_loaded++;
	};
	
	game.tilesets_loading++;
	game.tileset_door_open = new Image();
	game.tileset_door_open.src = "./images/tileset/door_open.png";
	game.tileset_door_open.onload = function(){
		game.tilesets_loaded++;
	};
	
	//load tileset_random_ground
	game.tilesets_loading++;
	game.tileset_random_ground = new Image();
	game.tileset_random_ground.src = "./images/tileset/ground.png";
	game.tileset_random_ground.onload = function(){
		game.tilesets_loaded++;
	};
}

GameController.init_load_all_tilesets = function()
{
	for(var tileset_index in GameController.tileset_array)
		{
			if(typeof GameController.tileset_object[tileset_index] === 'undefined')
			{
				GameController.LoadTileset(tileset_index);//init_load_tilesets
			}
		}
}

GameController.LoadTileset = function(tileset_index)
{
	var file = GameController.tileset_array[tileset_index];
	//load object tileset
	GameController.tilesets_loading++;
	GameController.tileset_object[tileset_index] = new Image();
	GameController.tileset_object[tileset_index].src = file;
	GameController.tileset_object[tileset_index].onload = function(){
		GameController.tilesets_loaded++;
	};
}

GameController.init_set_play_mouse_events = function()
{
	var game=GameController;
	
	//player clicks the map, get y and x map coordinates
	$('#display-game-map').bind((window.mobile && !just_testing_mobile)?'touchstart':'click', function(e)
	{
		e.stopPropagation();
		e.preventDefault();
		//if mouse is on a new tile
		var t = game.tile_size()
		var rect = game.display_canvas.getBoundingClientRect();
		//base coordinates
		if(window.mobile && !just_testing_mobile)
		{
			var mouseY = Math.floor((e.originalEvent.touches[0].pageY - rect.top)/t);
			var mouseX = Math.floor((e.originalEvent.touches[0].pageX - rect.left)/t);
		}
		else
		{
			var mouseY = Math.floor((e.clientY - rect.top)/t);
			var mouseX = Math.floor((e.clientX - rect.left)/t);
		}
		//add map coordinates offset
		var gridY = mouseY + Math.ceil(game.characters[game.active_player_index].y-(Math.floor(game.game_screen_num_tiles_height/2))/game.map_scale);
		var gridX = mouseX + Math.ceil(game.characters[game.active_player_index].x-(Math.floor(game.game_screen_num_tiles_width/2))/game.map_scale);
		game.GameMapClicked(gridY,gridX);
	});
	
	game.GameMapClicked = function(gridY,gridX)
	{
		//temp to make sure clicked location is visible - using fill not LoS
		//use vision type, towns can use fill, dungeons should use LoS
		game.vision_fog_layer = game.get_fill_area(game.characters[game.active_player_index].y,game.characters[game.active_player_index].x, true);
		
		//if clicked location is visible and valid > -1 && <  game.get_area_height() (get_area_width() for x)
		if(
				(gridY > -1 && gridY < game.get_area_height()) &&
				(gridX > -1 && gridX < game.get_area_width())
			)
		{
			//action based on what's clicked
			//get description of thing clicked on
			
			//clicked on an npc or monster
			var npc_monster_found = -1;
			for(index in game.characters)
			{
				if(game.characters[index].character_stats.area_id == game.area_id && !CharacterController.IsPartyMember(game.characters[index]))
				{
					if(game.vision_fog_layer[gridY][gridX] != 0 && gridY == game.characters[index].y && gridX == game.characters[index].x)
					{
						npc_monster_found = index;
					}
					//if has a conversation bubble, talk
					if(game.vision_fog_layer[gridY+1][gridX-1] != 0 && game.characters[index].character_stats.conversation_id && 
						gridY+1 == game.characters[index].y && gridX-1 == game.characters[index].x)
					{
						npc_monster_found = index;
					}
				}
			}
			
			//if didn't find a monster, check the square below where player clicked, because sprites are over 1 square tall
			//don't check square below if doing an AoE area selection
			if(!BattleController.show_select_area)
			{
				if(npc_monster_found == -1) 
				{
					for(index in game.characters)
					{
						if(game.characters[index].character_stats.area_id == game.area_id && game.vision_fog_layer[gridY+1][gridX] != 0 && !CharacterController.IsPartyMember(game.characters[index]) && gridY+1 == game.characters[index].y && gridX == game.characters[index].x)
						{
							npc_monster_found = index;
						}
					}
				}
			}
			
			//if clicking above player square open menu for that player
			var player_found = -1;
			//don't check square above if doing an AoE area selection
			if(!BattleController.show_select_area)
			{
				for(index in game.characters)
				{
					if(CharacterController.IsPartyMember(game.characters[index]) && gridY+1 == game.characters[index].y && gridX == game.characters[index].x)
					{
						player_found = index;
					}
				}
			}
			
			//or if no player found and clicking on player square
			if(player_found == -1)
			{
				for(index in game.characters)
				{
					if(CharacterController.IsPartyMember(game.characters[index]) && gridY == game.characters[index].y && gridX == game.characters[index].x)
					{
						player_found = index;
					}
				}
			}
			
			//SELECTING TARGET for action and has effect, can see square clicked, and has an effect, and effect is not target self only
			if(BattleController.process_battle_action_data != 0 && game.vision_fog_layer[gridY][gridX] != 0 
				&& BattleController.process_battle_action_data.effects != 0 && BattleController.process_battle_action_data.effects[0].TargetTypeID != 0)
			{
				//and target type allows this type of creature to be selected
				var effects_targets_id = EffectController.GetEffectsTargetsID(BattleController.process_battle_action_data.effects);
				//onsole.log(effects_targets_id, npc_monster_found, player_found);
				if(effects_targets_id == 0 || ((npc_monster_found != -1 && effects_targets_id == 2) || (player_found != -1 && effects_targets_id == 1)))
				{
					//un-highlight previous selected character
					if(BattleController.highlight_character_selected_index != -1) GameController.characters[BattleController.highlight_character_selected_index].highlight = false;
					
					BattleController.highlight_character_selected_index = -1;
					//don't really need BattleController.player_character_selected_index
					//BattleController.player_character_selected_index = BattleController.highlight_character_selected_index = npc_monster_found
					if(npc_monster_found != -1 && effects_targets_id != 1) BattleController.highlight_character_selected_index = npc_monster_found;
					else if(player_found != -1 && effects_targets_id != 2) BattleController.highlight_character_selected_index = player_found;
					//highlight selected character
					if(BattleController.highlight_character_selected_index != -1) GameController.characters[BattleController.highlight_character_selected_index].highlight = true;
					//area of effect selection
					if(BattleController.show_select_area)
					{
						BattleController.selected_battle_screen_coords = [gridX,gridY];
						for(var i=0; i<BattleController.process_battle_action_data.effects[0].EffectArea.length; i++)
						{
							//onsole.log(BattleController.selected_battle_screen_coords);
							var size = Math.floor(EffectController.GetAoeSize(BattleController.process_battle_action_data, i) / 10);
							//select_layer[y][x] - awesome
							GameController.burst_radius(GameController.select_layer,gridY,gridX,size);
						}
						BattleController.target_character_index_array = CharacterController.HighlightInAoe(BattleController.process_battle_action_data.effects);
					}
					game.redraw_object_bg_graphics = 1;
					GameController.draw();
				}
			}
			
			//if selecting target for action don't do anything else
			if(BattleController.process_battle_action_data != 0)
			{
				return false;
			}
			
			//if item there and within 1 square of player, can pick it up
			if(game.event_layer[gridY][gridX] != 0 && game.events[game.event_layer[gridY][gridX]].EventItems.length > 0 && Math.abs(gridY-game.characters[game.active_player_index].y) <= 1 && Math.abs(gridX-game.characters[game.active_player_index].x) <= 1)
			{
				//run item event
				game.RunEvent(game.event_layer[gridY][gridX]);
				return false;
			}
			
			//else if talking, but no one found to talk to
			/*
			if(game.player_talk && npc_monster_found == -1)
			{
				MenuController.DisplayMessage('There\'s no one in that direction to talk to');
			}
			*/
				
			//else if player has been clicked on, load that players menu
			else if(!game.player_look && player_found != -1)
			{
				//MenuController.CreateMenu(player_found);
				MenuController.CreateMenu();
				return false;
			}
			//else if npc has been clicked on (supersedes pc click) 
			else if(npc_monster_found != -1)
			{
				game.NpcMonsterClicked(npc_monster_found);
				//turn off look if clicking a monster
				if(game.player_look) $('#game-menu-top-look').trigger(window.mobile?'touchend':'click');
				return false;
			}
			
			//else if clicking on random spot on map make the menu
			/*
			else if(player_found == -1 && npc_monster_found == -1 && !game.player_look && !game.player_talk)
			{
				MenuController.CreateMenu();
			}
			*/
			//else if looking, get description of thing clicked on
			else if(game.player_look) 
			{
				//clicked on object
				if(game.object_layer[gridY][gridX] != 0)
				{
					//onsole.log(game.object_layer[gridY][gridX]);
					MenuController.DisplayMessage('There\'s an object here');
					//turn off look
					$('#game-menu-top-look').trigger(window.mobile?'touchend':'click');
				}
				//clicked on terrain
				else
				{
					var tile;
					switch(game.floor_wall_pit_fence_door_layer[gridY][gridX])
					{
						case 0:
							tile = 'floor';
							break;
						
						case 1:
							tile = 'a wall';
							break;
						
						case 2:
							tile = 'a pit';
							break;
						
						case 3:
							tile = 'a fence';
							break;
						
						case 4:
							tile = 'a door';
							break;
						
						default:
							tile = 'nothing';
							break;
					}
					MenuController.DisplayMessage('There\'s '+tile+' here');
				}
			}
		}
	}
	
	game.NpcMonsterClicked = function(index)
	{
		var npc_alive = CharacterController.IsCharacterAlive(GameController.characters[index].character_stats);
		//if npc doesnt have a conversatoin, but has items show items (store)
		if(npc_alive && !game.player_look && (game.characters[index].character_stats.GoodGuy && !game.characters[index].conversation))
		{
			if(
				typeof GameController.characters[index].character_stats.arr_quick_items_id != 'undefined'
				&& (GameController.characters[index].character_stats.arr_quick_items_id.weapon.length > 0
				|| GameController.characters[index].character_stats.arr_quick_items_id.armor.length > 0
				|| GameController.characters[index].character_stats.arr_quick_items_id.equipment.length > 0)
			)
			{
				//onsole.log(game.characters[index].conversation);
				ShopController.DisplayShop(index);
			}
		}
		//start conversation if one loaded
		else if(npc_alive && !game.player_look && (game.characters[index].character_stats.GoodGuy && (game.conversation || game.characters[index].conversation)))
		{
			var conversationIndex = 0;
			var conversationPathIndex = 0;
			var imagePath = './images/char/thumb/charthumb_'+game.characters[index].character_stats.thumb_pic_id+'.png';
			var conversation = 0;
			if(game.characters[index].conversation != 0)
			{
				GameController.current_conversation = game.characters[index].conversation;
			}
			else
			{
				GameController.current_conversation = game.conversation;
			}
			MenuController.DisplayConversation(conversationIndex, conversationPathIndex, imagePath);
		}
		//else display default descriptive message box
		else
		{
			var message = game.characters[index].character_stats.GoodGuy? 'It looks peacful :)' : 'It looks angry!';
			if(!npc_alive) message = 'It looks dead.'
			MenuController.DisplayMessage(
				game.characters[index].character_stats.character_name+'. '+
				(game.characters[index].character_stats.master_description != '' || game.characters[index].character_stats.temp_description != ''
					? ' '+(game.characters[index].character_stats.temp_description != ''? game.characters[index].character_stats.temp_description+'. ' 
					: game.characters[index].character_stats.master_description+'. ') : '')
					+message
			);
		}
	}
	
}

GameController.init_set_player_controls = function()
{
	var game=GameController;
	
	if(!game.edit)
	{
		
		$('#game-map-buttons').bind('touchstart', function(e)
		{
			if(game.player_moving_direction() == 0)
			{
				//figure out position of touch
				var offset = $(this).offset();
				//var x = e.pageX - offset.left;
				//var y = e.pageY - offset.top;
				var x = e.originalEvent.touches[0].pageX - offset.left;
				var y = e.originalEvent.touches[0].pageY - offset.top;
				var width = $(this).width();
				var height = $(this).height();
				
				if(y <= height/2 && Math.abs(y-height/2) >= Math.abs(x-width/2))  game.player_moving_direction('up');
				else if(y > height/2 && Math.abs(y-height/2) >= Math.abs(x-width/2))  game.player_moving_direction('down');
				else if(x <= width/2 && Math.abs(y-height/2) <= Math.abs(x-width/2))  game.player_moving_direction('left');
				else if(x >= width/2 && Math.abs(y-height/2) <= Math.abs(x-width/2))  game.player_moving_direction('right');
			}
			
			if(game.player_moving_direction() == 'left')
			{
				game.trigger_player_move(game.characters[game.active_player_index].x - 1,game.characters[game.active_player_index].y);
			}
			
			else if(game.player_moving_direction() == 'up')
			{
				game.trigger_player_move(game.characters[game.active_player_index].x,game.characters[game.active_player_index].y - 1);
			}
			
			else if(game.player_moving_direction() == 'right')
			{
				game.trigger_player_move(game.characters[game.active_player_index].x + 1,game.characters[game.active_player_index].y);
			}
			
			else if(game.player_moving_direction() == 'down')
			{
				game.trigger_player_move(game.characters[game.active_player_index].x,game.characters[game.active_player_index].y + 1);
			}
		});
		
		$('#game-map-buttons').bind('touchend', function(e)
		{
			game.player_moving_direction(0);
		});
		
		document.onkeyup=function(e)
		{
			//don't do if player hasn't loaded yet
			if(game.player != 0)
			{
				game.player_moving_direction(0);
			}
		}
	}
	
	$('#game-menu-top-menu').bind(window.mobile?'touchend':'click', function(e)
	{
		e.stopPropagation();
		e.preventDefault();
		if(game.in_event) return false;
		
		if(MenuController.MenuVisible)
		{
			MenuController.MenuClose();
			$('#game-menu-top-menu-icon').attr('src','./images/battle_icons/menu.png');
		}
		else
		{
			MenuController.CreateMenu();
		}
	});
	
	$('#game-menu-top-look').bind(window.mobile?'touchend':'click', function(e)
	{
		e.stopPropagation();
		e.preventDefault();
		game.player_look = game.player_look ? false: true;
		if(game.player_look)
		{
			$('#game-menu-top-look-icon').attr('src','./images/battle_icons/look_clicked.png');
			//$('#game-map-buttons').css('opacity','0.75');
		}
		else
		{
			$('#game-menu-top-look-icon').attr('src','./images/battle_icons/look.png');
			//$('#game-map-buttons').css('opacity','0.25');
		}
	});
	
	$('#game-menu-top-system').bind(window.mobile?'touchend':'click', function(e)
	{
		e.stopPropagation();
		e.preventDefault();
		var message = 'Save Game?<br/><br/>'; 
		message += '<div style="margin-top:15px;" id="save-buttons"><span id="" class="button" onclick="GameController.SaveGame();">OK</span>';
		message += ' <span id="" class="button" onclick="MenuController.MenuClose();">Cancel</span></div>';
		MenuController.DisplayMessage(message);
	});
	
	$('#game-menu-top-talk').bind(window.mobile?'touchend':'click', function(e)
	{
		e.stopPropagation();
		e.preventDefault();
		game.player_talk = game.player_talk ? false: true;
		if(game.player_talk)
		{
			$('#game-menu-top-talk-icon').attr('src','./images/battle_icons/talk_clicked.png');
			//$('#game-map-buttons').css('opacity','0.75');
		}
		else
		{
			$('#game-menu-top-talk-icon').attr('src','./images/battle_icons/talk.png');
			//$('#game-map-buttons').css('opacity','0.25');
		}
	});
	
	document.onkeydown=function(e)
	{
		if(game.player != 0 && game.player_moving_direction() != 0) return false;
		
		if (!e) e=window.event; //IE fix
		var code=(e.which)?e.which:e.keyCode;
			
		if(!game.in_encounter && (game.player != 0 || game.edit))
		{
			switch(code)
			{
				//ZOOM SCALE
				//+ key
				case 107:
					game.zoom_in();
					e.preventDefault();
				break;
				
				//- key
				case 109:
					game.zoom_out();
					e.preventDefault();
				break;
			}
		}
		
		if(!game.edit && !game.in_encounter && game.player != 0)
		{
			var x=game.characters[game.active_player_index].x, y=game.characters[game.active_player_index].y;
			
			switch(code)
			{
				//Left
				case 37:
					game.player_moving_direction('left');
					game.trigger_player_move(game.characters[game.active_player_index].x - 1,game.characters[game.active_player_index].y);
					e.preventDefault();
				break;
				
				//Up
				case 38:
					game.player_moving_direction('up');
					game.trigger_player_move(game.characters[game.active_player_index].x,game.characters[game.active_player_index].y - 1);
					e.preventDefault();
				break;
				
				//Right
				case 39:
					game.player_moving_direction('right');
					game.trigger_player_move(game.characters[game.active_player_index].x + 1,game.characters[game.active_player_index].y);
					e.preventDefault();
				break;
				
				//Down
				case 40:
					game.player_moving_direction('down');
					game.trigger_player_move(game.characters[game.active_player_index].x,game.characters[game.active_player_index].y + 1);
					e.preventDefault();
				break;
				
				//Spacebar
				case 32:
					
				break;
			}
		}
	
	}
}

GameController.init = function()
{
	var game=GameController;
	
	//load game data - only loading skill list atm
	callback = function(data)
	{
		data = $.parseJSON(data);
		game.skill_arr = data.skill_arr;
	}
	ajax_action('load_game_data.php',0,0,callback);
	
	if(!GameController.sound_mute)
	{
		GameController.sound = {
			'magic_missiles': new Audio('./sound/effect/spell/magic_missiles.wav'),
			//'wind': new Audio('./sound/wind.ogg'),
			'wind_02': new Audio('./sound/wind_02.ogg'),
			'footstep_dirt_00': new Audio('./sound/effect/footstep/Footstep_Dirt_00.mp3'),
			'footstep_dirt_01': new Audio('./sound/effect/footstep/Footstep_Dirt_01.mp3'),
			'footstep_dirt_03': new Audio('./sound/effect/footstep/Footstep_Dirt_03.mp3'),
			'cat_meow': new Audio('./sound/cat_meow.ogg'),
			'dark_castle': new Audio('./sound/music/dark_castle.mp3'),
			'attack_hit': new Audio('./sound/effect/battle/attack_hit.ogg'),
			'death': new Audio('./sound/effect/battle/death.wav'),
			
			'battle': {
				'0': new Audio('./sound/effect/battle/big_punch.wav'),
				'1': new Audio('./sound/effect/battle/hit_06.wav'),
				'2': new Audio('./sound/effect/battle/hurt.wav'),
				'3': new Audio('./sound/effect/battle/knife_slice.ogg'),
				'4': new Audio('./sound/effect/battle/small_knock.wav'),
				'5': new Audio('./sound/effect/battle/sword_small.wav'),
				'6': new Audio('./sound/effect/battle/sword_small_01.wav'),
				'7': new Audio('./sound/effect/battle/sword_small_02.wav')
			}
		};
	}

	//get the map selections loaded right away, so they are there when adventure loads, on player name input, to find the adventure start map
	game.load_show_intro_screen();

	$(window).resize(function(){
		var height = $(window).height() + (GameController.intro_screen ? 300 : 100);
			
		if(!game.edit)
		{
			//height of main menu div
			$('#game-menu').height((height-70)+'px');
			
			var left = ($(window).width() - 544) / 2;
			$('#column-1').css('left',left+'px');
			
			
			if(!window.mobile)
			{
				//$('#column-1').width(($(window).width() - left)+'px');
				$('#column-1').width('544px');
				//$('#battle-secondary').css('left',(left + 544)+'px');
				var battle_secondary_width = $(window).width() - left - 544 - 10;
				$('#battle-secondary').css('width',battle_secondary_width+'px');
				$('#battle-attack-output').css('width',battle_secondary_width+'px');
			}
			else
			{
				$('#battle-secondary').css('left',left+'px');
				$('#battle-secondary').width('544px');
				//var page_top_graphic_height = $('#page-top-graphic').height() - 25;
				var page_top_graphic_height = 99 - 25;//-25 bottom margin
				var game_map_container_height = 544;
				$('#battle-secondary').height((height-game_map_container_height-page_top_graphic_height)+'px');
				//$('#battle-secondary').css('top','-65px');
				$('#battle-secondary').css('top','-35px');
				$('#battle-attack-output').width('544px');
			}
			
			//shift movment buttons to right - add option to select position for player
			if(1)
			{
				$('#game-map-buttons').css('right','0');
			}
			/*
			//shift movment buttons to left
			if(height < 720)
			{
				$('#game-map-buttons').css('left','0');
			}
			else
			{
				$('#game-map-buttons').css('left','160px');
			}
			*/
		}
		else
		{
			$('#column-1').css('left','0px');
			$('#column-1').width('561px');
		}
		
		if(mobile)
		{
			//show partial or hide body background
			if(height < 687 || GameController.intro_screen == 1)
			{
				$('#body-background').css('height','0');
			}
			else if(height < 770)
			{
				$('#body-background').css('height','82px');
			}
			else
			{
				$('#body-background').css('height','159px');
			}
			
			$('#body-background').css('top',(height - $('#body-background').height())+'px');
		}
		
	});
	
	$(window).trigger('resize');
	
	setTimeout(function(){
		$('#column-1').fadeIn(3000);
		$('#body-background').fadeIn(3000);
		//just for when the playerns name is already showing in the input field on load up
		if($('#player-name').val().length > 1)
		{
			$('#game-begin-button').fadeIn();
		}
		if(!window.mobile) $('#player-name').focus();
	},1000);
	
	game.display_canvas = document.getElementById('display-game-map');
	game.display_context = document.getElementById('display-game-map').getContext('2d');
	
	game.buffer_display_canvas = document.createElement('canvas');
	game.buffer_display_context = game.buffer_display_canvas.getContext('2d');
	
	game.mini_map_canvas = document.getElementById('mini-game-map');
	game.mini_map_context = document.getElementById('mini-game-map').getContext('2d');
	
	game.canvas = document.createElement('canvas');
	game.canvas_wall_and_floor_graphical = document.createElement('canvas');
	game.canvas_object_bg = document.createElement('canvas');
	game.canvas_event_object = document.createElement('canvas');
	game.canvas_character = document.createElement('canvas');
	game.canvas_object_fg = document.createElement('canvas');
	game.canvas_select = document.getElementById('display-edit-selections');
	
	game.canvas_vision_fog = document.createElement('canvas');
	game.canvas_facade = document.createElement('canvas');
	
	game.canvas_object_select = document.getElementById('object-select-canvas');
	game.context_object_select = document.getElementById('object-select-canvas').getContext('2d');
	game.canvas_wall_select = document.getElementById('wall-select-canvas');
	game.context_wall_select = document.getElementById('wall-select-canvas').getContext('2d');
	game.canvas_floor_select = document.getElementById('floor-select-canvas');
	game.context_floor_select = document.getElementById('floor-select-canvas').getContext('2d');
	game.canvas_pit_select = document.getElementById('pit-select-canvas');
	game.context_pit_select = document.getElementById('pit-select-canvas').getContext('2d');
		game.canvas_wall_select_current = document.getElementById('current-wall-type');
		game.context_wall_select_current = document.getElementById('current-wall-type').getContext('2d');
		game.canvas_pit_select_current = document.getElementById('current-pit-type');
		game.context_pit_select_current = document.getElementById('current-pit-type').getContext('2d');
		game.canvas_floor_select_current = document.getElementById('current-floor-type');
		game.context_floor_select_current = document.getElementById('current-floor-type').getContext('2d');
	
	game.init_load_tilesets();//loads common tilesets
	game.init_set_play_mouse_events();
	game.init_set_player_controls();
	WeatherController.init();
	FormationController.Init();
	
	//pre load effect editor icon selection div - does job of pre loading effect icons
	$('#load-effect-gen-icon-select').load('./load_effect_gen_icon_list.php');
	
	//IF MOBILE, SET ZOOM TO A BIT MORE ZOOMED IN
	//if(mobile) game.map_scale = 1.25;
	
	//set action confirmation buttons (in battle menu and top menu)
	var clickEvent = 'onclick="MenuController.BattleMenuCancelAction();"';
	var cancelButton = new MenuController.MenuItem('battle_icons/back_arrow.png', 'Cancel', 0, [])
	$("#action-confirm").append(cancelButton.CreateRowIcon(clickEvent, false, true));
	
	var clickEvent = 'onclick="BattleController.action_confirmed = 1; ActionController.process_battle_action();"';
	var cancelButton = new MenuController.MenuItem('battle_icons/dice.png', 'Confirm', 0, [])
	$("#action-confirm").append(cancelButton.CreateRowIcon(clickEvent, false, true));
	//top menu
	$('#game-menu-top-action-confirm').html($('#action-confirm').html());
	
}

GameController.Exit = function()
{
	GameController.GameOver();
	$('#player-name').val('');
	$('#play-page').hide();
	$('#game-over-page').hide();
	GameController.load_show_intro_screen();
}

GameController.GameBegin = function()
{
	//scroll up to top
	window.scrollTo(0, 0);
	GameController.intro_screen = 0;
	$(window).trigger('resize');
	
	//add scroll bar for opening menu
	$('#column-1').css('overflow-y','auto');
	
	if($('#player-name').val().toUpperCase() == 'MIKE')
	{
		GameController.dev_mode = 1;
		$('#dev-mode-options').show();
		GameController.init_set_edit_menu_button_events();
	}
	if($('#player-name').val().toUpperCase() == 'MIKEBEZEAU')
	{
		$('.intro-screen-dev-option').show();
	}
	
	$('#player-name').hide();
	$('#license-credits').hide();
	$('#game-begin-button').stop().hide();
	//$('#loading').show();
	$('#select-game-play-mode').hide();
	$('#reset-character').hide();
	$('#delete-pc-character').hide();
	//take away focus from #player-name
	$('#player-name').blur();
	$('#game-menu-inner').css('height','100%');
	WeatherController.stop();
	
	callback = function(data)
	{
		data = $.parseJSON(data); //data.player_id //data.select_box //data.pcs //data.pcs[i].thumb_id //data.adventure.AdventureID .StartAreaID .StartEventID .Image .Title .Description
		
		
		GameController.adventure = data.adventure; //data.adventure.AdventureID .StartAreaID .StartEventID .Image .Title .Description
		$('#edit-page-adventure-title').val(GameController.adventure.Title);
		$('#edit-page-adventure-start-map-load #start-map-selection option[value="'+GameController.adventure.StartAreaID+'"]').attr('selected','selected');
		$('#edit-page-adventure-start-eventid').val(GameController.adventure.StartEventID);
		//alert('StartAreaID'+GameController.adventure.StartAreaID);
		//alert('StartEventID'+GameController.adventure.StartEventID);
		
		
		CharacterController.player_id = data.player_id;
		$('#select-player-party-load').html(data.select_box);
		var pc_selection_img_container = '<div style="font-size:12px; line-height:1;">';
		for(var i = 0; i < data.pcs.length; i++)
		{
			var top = Math.floor(i/3) * (100);
			pc_selection_img_container += '<span class="pc-select-image" style="position:relative; top: '+top+'px; margin-left:25px; margin-right:119px;" data-id="'+data.pcs[i].character_id+'">';
			var pcSelectIcon = new MenuController.MenuItem('char/thumb/charthumb_'+data.pcs[i].thumb_id+'.png', 
				data.pcs[i].character_name, 0, [])
			pc_selection_img_container += pcSelectIcon.CreateRingIcon('', 0, 1, false, true);//if coords are 0,0 text doesn't get centred
			pc_selection_img_container += '</span>';
		}
		
		$('#title-page').hide();
		$('#loading').hide();
		$('#play-page').show();
		
		GameController.new_player = i == 0 ? 1 : 0;
		if(i == 0  && $('#player-name').val().toUpperCase() != 'MIKEBEZEAU')
		{
			CharacterController.NewCharacter();
			return false;
		}
		
		pc_selection_img_container += '</div>';
		$('#select-player-party-load').append(pc_selection_img_container);
		$('#select-player-party-load').append('<div style="margin-top:'+(top+100)+'px;"></div>');
		
		if(CharacterController.new_character_selection.page != 1)
		{
			//select new character and show begin button
			$('.pc-select-image[data-id="'+CharacterController.new_character_selection.character_id+'"]').trigger(window.mobile?'touchend':'click');
			CharacterController.new_character_selection.page = 1;
		}
		else if($('.pc-select-image').length == 1)
		{
			$('.pc-select-image').eq(0).trigger(window.mobile?'touchend':'click');
		}
		
	}
	ajax_action('load_adventure_and_pc_selection.php',$('#player-name').val(),0,callback);
}

GameController.GameOver = function()
{
	WeatherController.FadeIn();
	$('#play-menu-icon-container').hide();
	$('#show-character-a').fadeOut();
	$('#show-character-b').fadeOut();
	$('#game-map-buttons').fadeOut();
	
	GameController.in_encounter = false;
	for(var i = GameController.characters.length - 1; i >= 0; i--)
		{
			GameController.characters[i].in_encounter = false;
		}
	MenuController.is_battle_menu = false;
	MenuController.MenuClose();
	
	$('#intro-screen').fadeIn(500, function(){
		GameController.display_context.fillStyle='#000';
		GameController.display_context.fillRect(0,0,544,544);
	});
	$('#game-over-page').show();
}

GameController.start = function(character_id, area_id)
{
	var game=GameController;
	GameController.intro_screen = 0;
	GameController.game_loading = 1;
	
	//hidden after game over
	$('#game-screen-container').show();
	$('#battle-secondary').show();
	
	$('#loading-text').html('Loading...');
	
	$('#image-preload').append('<img style="clear:both;" src="./images/battle_icons/zoom_clicked.png"/>');
	$('#image-preload').append('<img style="clear:both;" src="./images/battle_icons/menu_clicked.png"/>');
	$('#image-preload').append('<img style="clear:both;" src="./images/battle_icons/look_clicked.png"/>');
	$('#image-preload').append('<img style="clear:both;" src="./images/battle_icons/talk_clicked.png"/>');
	
	$('#page-top-graphic').show();
	$('#edit-level-side-bar').hide();
	$('#game-map-container').css('width','544px').css('height','544px').css('overflow','hidden');
	
	game.edit = false;
	MenuController.MenuInit();
	
	game.player = 
	{
		//'party_id': party_id
		'party_id': 'player', //give a default value
		'character_id': character_id,
		'direction': 0
	};
	
	game.active_player_index = 0;
		
	var items_loaded = 0;
	var world_items_loaded = 0;
	var pc_loaded = 0;
	
	//items
	var items_callback = function(postsCallback){
	
		parsed_data = $.parseJSON(postsCallback);
		//onsole.log('game.items parsed_data',parsed_data);
		game.items.weapon = parsed_data.weapon_list;
		game.items.armor = parsed_data.armor_list;
		game.items.equipment = parsed_data.equipment_list;
		//load item icons into image for use on map
		
		var LoadItemIcons = function(itemType)
		{
			for(var i=0; i<game.items[itemType].length; i++)
			{
				game.itemImages[itemType][i] = 0;
				if(game.items[itemType][i].Icon != '')
				{
					game.itemImages[itemType][i] = new Image();
					game.itemImages[itemType][i].src = "./images/battle_icons/"+game.items[itemType][i].Icon;
					game.icons_loading++;
					game.itemImages[itemType][i].onload = function(){
							game.icons_loaded++;
						}
				}
				//ERROR HANDLER FOR MISSING EQUIPMENT ICONS
				else
				{
					//onsole.log('item icon missing for '+game.items[itemType][i]);
				}
			}
		}
		
		LoadItemIcons('weapon');
		LoadItemIcons('armor');
		LoadItemIcons('equipment');
		items_loaded = 1;
		//onsole.log('items_loaded');
		if(items_loaded && world_items_loaded && pc_loaded)
		{
			items_and_pcs_loaded();
		}
	}
	
	ajax_action('load_items.php', 0, 0, items_callback);
	
	//get world item list for this player character
	//for each player, has a list of what items are held by what characters in their world
	var world_items_callback = function(data)
	{
		GameController.pc_world_itmes = $.parseJSON(data);
		world_items_loaded = 1;
		//onsole.log('world_items_loaded');
		if(items_loaded && world_items_loaded && pc_loaded)
		{
			items_and_pcs_loaded();
		}
	}
	ajax_action('party_character_data.php', GameController.player.character_id, {'get_pc_world_items_list': 1}, world_items_callback);

	//player characters
	game.characters = [];
	
	//load player party data
	var player_character_stats
	var pc_callback = function(postsCallback){
		//console.log(postsCallback);
		parsed_data = $.parseJSON(postsCallback);//arr_character_stats //arr_item_events //arr_completed_events //arr_knowledge_tag_id
		
		//array of character stats for all in party
		player_character_stats = parsed_data['arr_character_stats'];
		//
		for(var i=0; i<parsed_data['arr_item_events'].length; i++)
		{
			//if event not already loaded - not likely but you never know
			if(typeof game.events[parsed_data['arr_item_events'][i].EventID] === 'undefined')
			{
				game.events[parsed_data['arr_item_events'][i].EventID] = parsed_data['arr_item_events'][i];
			}
		}
		//
		game.player_completed_events = parsed_data['arr_completed_events'];
		//
		game.player_knowledge_tags.push(parsed_data['arr_knowledge_tag_id']);
		//
		var sprites_loaded = 0;
		$.each(player_character_stats, function(index, value)
		{
			player_character_stats[index].GoodGuy = 1;
			
			player_character_stats[index].hp = parseInt(player_character_stats[index].hp);
			player_character_stats[index].hp_damage = parseInt(player_character_stats[index].hp_damage);
			
			//onsole.log(player_character_stats[index].effects);
		
			var player_character_sprite = new Image();
			//player_character_sprite.src = "./images/char/sprite/char/"+this.sprite_id+".png";
			player_character_sprite.src = "./images/"+this.sprite_file;
			//unshift PC characters to keep them at the front of the array
			//if PCs are added after the menu is initialized, the menu will need to be re-initialized for new player indexes: MenuController.MenuInit();
			//game.characters.unshift(
			
			//poly
			var poly_sprite = 0;
			if(player_character_stats[index].poly_character_stats != 0)
			{
				poly_sprite = new Image();
				poly_sprite.src = "./images/"+player_character_stats[index].poly_character_stats.sprite_file;
				poly_sprite.onload = function(){
						sprites_loaded++;
						if(sprites_loaded == player_character_stats.length * 2)
						{
							pc_loaded = 1;
							//onsole.log('pc_loaded poly');
							if(items_loaded && world_items_loaded && pc_loaded)
							{
								items_and_pcs_loaded();
							}
						}
					}
			}
			else
			{
				sprites_loaded++; //no poly sprite to load
			}
			
			//parse JSON player_character_stats[index].effects[i].EffectData
			for(var i in player_character_stats[index].effects)
			{
				if(player_character_stats[index].effects[i].EffectData)
					player_character_stats[index].effects[i].EffectData = $.parseJSON(player_character_stats[index].effects[i].EffectData);
				else
					player_character_stats[index].effects[i].EffectData = 0;
			}
			
			game.characters.push(
			{
				'character_stats': player_character_stats[index],
				//polymorph sprite
				'poly_sprite': poly_sprite,
				'quick_stat_id': player_character_stats[index].quick_stat_id,
				'PC': 1,
				'party_id': 'player',
				'in_encounter': 0,
				'highlight': 0,
				'x': 0,
				'y': 0,
				'facing': 'right',
				'character_sprite': player_character_sprite,
				'sprite_coords': [player_character_stats[index].FormationX, player_character_stats[index].FormationY],
				'sprite_offset': [0,0]
			});
			
			player_character_sprite.onload = function(){
					sprites_loaded++;
					if(sprites_loaded == player_character_stats.length * 2)
					{
						pc_loaded = 1;
						//onsole.log('pc_loaded');
						if(items_loaded && world_items_loaded && pc_loaded)
						{
							items_and_pcs_loaded();
						}
					}
				};
			
			//add to paryy and load/set character menus 
			var party_stats_index = GameController.characters.length - 1;
			CharacterController.AddCharacterToParty(party_stats_index);
		});
	};
	ajax_action('party_character_data.php', game.player.character_id, {'get_party': 1}, pc_callback);
	
	function items_and_pcs_loaded()
	{
		//onsole.log('items_and_pcs_loaded');
		//if continuing from save, set area_id from main player character_stats
		if(game.characters[0].character_stats.area_id != 0)
			area_id = game.characters[0].character_stats.area_id;
		
		//now that characters are loaded, load menu menu
		MenuController.LoadImages();
		
		FormationController.SetFormationMenu();
		FormationController.SetFormation();
		FormationController.SetFormationGrid();
		
		//wait for all resources to load needed to create level
		var load_level_interval = setInterval(function(){
				var resources_loading_total = game.resources_loading + game.tilesets_loading + game.sprites_loading + game.icons_loading;
				var resources_loaded_total = game.resources_loaded + game.tilesets_loaded + game.sprites_loaded + game.icons_loaded;
				if(resources_loading_total == resources_loaded_total)
				{
					clearInterval(load_level_interval);
					game.load_level(area_id, -1, -1, true);
				}
			}, 200);
	}
}

GameController.load_level = function(area_id, start_x, start_y, load_from_save)
{
	if(arguments.length < 3)
	{
		start_x = -1; //use game.map_start_x - duplicate variable
		start_y = -1;
	}
	GameController.start_x = start_x;
	GameController.start_y = start_y;
	
	//set new area id for main PC character_stats
	//if using level editor, do not set
	if(!GameController.edit) GameController.characters[0].character_stats.area_id = area_id;
	
	if(arguments.length < 4)
	{
		load_from_save = false;
	}
	GameController.load_from_save = load_from_save;
	
	GameController.in_event = 1;
	WeatherController.stop();
	
	$('#loading').css('background-image','./images/title/black_bird.png');
	$('#loading-text').html('Loading...');
	$('#loading-bar').css('width', '0%');
	$('#loading').show();
	var game = GameController;
	
	if(!GameController.sound_mute && game.sound.intro_theme.readyState == 4) GameController.sound.intro_theme.pause();
	
	//clear player vars
	game.player_moving = 0;
	game.player_look = 0;
	game.player_talk = 0;
	
	//set edit variables to default, off
	game.in_encounter = false;
	game.place_map_walls = false;
	game.place_map_pits = false;
	game.place_map_floors = false;
	game.place_map_doors = false;
	game.fill_map = false;
	game.place_object = false;
	game.place_object_layer = 0;//0 = background, 1 = midground, 2 = foreground
	game.current_object_tileset = 0;
	game.view_objects = true;
	game.place_facade_object = false;
	game.view_facade = true;
	game.hightlight_facade_objects = false;
	game.view_only_foreground_objects = false;
	game.place_object_tile_x = -1;
	game.place_object_tile_y = -1;
	game.seleted_object_tiles = [];
	game.place_monster = false;
	game.place_npc_monster_sprite = false;
	game.delete_npc_monster = false;
	game.select_start_point = false;
	game.map_start_y = 1;
	game.map_start_x = 1;
	game.place_npc_monster_sprite_id = -1;
	game.place_npc_monster_sprite_file = -1;
	game.place_npc_monster_sprite_loaded = 0;
	game.place_npc_monster_sprite_images = [];
	game.remove_object = false;
	game.reverse_layers = false;
	game.view_events = true;
	game.test_burst = false;
	game.view_selected_area = false;
	//set gameplay and graphics variables, on, redraw
	game.test_los = game.edit ? false : true;
	game.redraw_wall_graphics = true;
	game.redraw_object_bg_graphics = true;
	game.redraw_characters = true;
	game.redraw_mouse_region = false;
	game.show_tileset_graphics = true;
	
	
	//Clear the arrays
	game.floor_wall_pit_fence_door_layer.length=0; 
	game.tileset_type_layer.length=0; 
	game.event_layer.length=0;
	game.events.length=0;
	game.wall_pit_fence_door_graphic_layer.length=0;
	game.floor_graphic_layer.length=0;
	game.random_ground_layer.length=0;
	game.character_layer.length=0;
	game.object_layer.length=0;
	game.select_layer.length=0;
	game.vision_fog_layer.length=0;
	game.vision_fog_layer_already_checked_flag.length=0;
	game.facade_layer.length=0;
	game.empty_layer.length=0;
	
	
	//if current level loaded, save file data for recall later
	//try not doing this on mobile, using too much memory?
	//if(!mobile)
	//{
		if(game.un_parsed_map_file != 0)
		{
			game.map_file_history[game.area_id] = game.un_parsed_map_file;
		}
		if(game.un_parsed_tileset_file != 0)
		{
			game.tileset_file_history[game.area_id] = game.un_parsed_tileset_file;
		}
	//}
	
	//if current level loaded, save file data for recall later
	if(game.vision_layer_remember_map.length > 0)
	{
		game.vision_layer_remember_map_history[game.area_id] = JSON.stringify(game.vision_layer_remember_map);
	}
	game.un_parsed_map_file=0;
	game.un_parsed_tileset_file=0;

	//switch over to new area
	GameController.area_id = parseInt(area_id);
		
	ConvEditController.ConversationLoad(GameController.edit, 0, -1, area_id);
	
	//load area from txt file
	game.resources_loading++;
	
	if(game.area_id in game.map_file_history)
	{
		game.loading_from_history = true;
		GameController.LoadLevelCallback(game.map_file_history[area_id]);//, true); //not using loading from history flag
	}
	else{
		game.loading_from_history = false;
		ajax_action('map_load.php',area_id,{'player_character_id': (game.edit ? 0 :game.player.character_id)},GameController.LoadLevelCallback);
	}
	
	//load tileset from seperate file
	game.resources_loading++;
	var callback_tileset = function(data){
		game.un_parsed_tileset_file = data;
		var tileset_data = $.parseJSON(data);
		game.tileset_type_layer = tileset_data;
		game.resources_loaded++;
		//onsole.log('map tileset loaded');
	}
	if(game.area_id in game.tileset_file_history)
	{
		callback_tileset(game.tileset_file_history[area_id], true);
	}
	else{
		ajax_action('map_load.php?tileset',area_id,1,callback_tileset);
	}
	
	//load saved vision remember map
	
}

GameController.LoadLevelCallback = function(data)
{
	var game = GameController;
	
	game.un_parsed_map_file = data;
	var map_data = $.parseJSON(data);
	
	//set master area size
	game.area_width = map_data[0].length;
	game.area_height = map_data[0][0].length;
	
	//area size
	if(map_data.length > 10)
	{
		game.area_height = parseInt(map_data[10][0]);
		game.area_width = parseInt(map_data[10][1]);
	}
	//initialize other map arrays based on floor_wall_pit_fence_door_layer size (100 x 100)
	
	//map_data[0] = map wall/floor/pit info
	//this would change the array size
	//game.floor_wall_pit_fence_door_layer = map_data[0];
	
	//initialize the y and x size of 2d arrays only once
	//***added back in the variable sizes of maps***
	/*
	if(game.empty_layer.length == 0)
	{
	*/
		//for(var y = 0,height=100; y < height; y++)
		for(var y = 0,height=game.area_height; y < height; y++)
		{
			game.empty_layer.push([]);
			game.random_ground_layer.push([]);
			//for(var x = 0,width=100; x < width; x++)
			for(var x = 0,width=game.area_width; x < width; x++)
			{
				game.empty_layer[y].push(0);
				game.random_ground_layer[y].push(Math.random() < 0.025 ? 1: 0);
			}
		}
		
		for(var i = 0; i < game.empty_layer.length; i++)
		{
			game.floor_wall_pit_fence_door_layer[i] = game.empty_layer[0].slice();
			game.event_layer[i] = game.empty_layer[0].slice();
			game.description_index_layer[i] = game.empty_layer[0].slice();
			game.wall_pit_fence_door_graphic_layer[i] = game.empty_layer[0].slice();
			game.floor_graphic_layer[i] = game.empty_layer[0].slice();
			game.character_layer[i] = game.empty_layer[0].slice();
			game.object_layer[i] = game.empty_layer[0].slice();
			game.select_layer[i] = game.empty_layer[0].slice();
			game.vision_fog_layer[i] = game.empty_layer[0].slice();
			game.vision_fog_single_check_layer[i] = game.empty_layer[0].slice();
			game.vision_fog_layer_already_checked_flag[i] = game.empty_layer[0].slice();
			game.vision_layer_remember_map[i] = game.empty_layer[0].slice();
			game.facade_layer[i] = game.empty_layer[0].slice();
			
			game.open_grid[i] = game.empty_layer[0].slice();
			game.closed_grid[i] = game.empty_layer[0].slice();
			game.parent_grid[i] = game.empty_layer[0].slice();
			game.cost_grid[i] = game.empty_layer[0].slice();
		}
	/*
	}
	//else clear all arrays all elements = 0
	else
	{
		for(var y = 0; y < 100; y++)
		{
			for(var x = 0; x < 100; x++)
			{
				game.event_layer[y][x] = 0;
				game.description_index_layer[y][x] = 0;
				game.wall_pit_fence_door_graphic_layer[y][x] = 0;
				game.floor_graphic_layer[y][x] = 0;
				game.character_layer[y][x] = 0;
				game.object_layer[y][x] = 0;
				game.select_layer[y][x] = 0;
				game.vision_fog_layer[y][x] = 0;
				game.vision_fog_single_check_layer[y][x] = 0;
				game.vision_fog_layer_already_checked_flag[y][x] = 0;
				game.vision_layer_remember_map[y][x] = 0;
				game.facade_layer[y][x] = 0;
			}
		}
	}
	*/
	
	//clear description text array
	game.description_text.length=0;
	game.edit_description_array.length=0;
	
	//game.floor_wall_pit_fence_door_layer = map_data[0];
	if(map_data.length > 0)
	{
		for(var y = 0; y < game.area_height; y++)
		{
			for(var x = 0; x < game.area_width; x++)
			{
				game.floor_wall_pit_fence_door_layer[y][x] = parseInt(map_data[0][y][x]);
			}
		}
	}
	
	//map_data[1] = event info id,y,x
	for(var i = 0; i < map_data[1].length; i++)
	{
		//map_data[1][i] = eventData object
		//if event not already loaded
		if(typeof game.events[map_data[1][i].EventID] === 'undefined')
		{
			game.events[map_data[1][i].EventID] = map_data[1][i];
		}
		//if an on-map event
		if(map_data[1][i].Y >= 0 && map_data[1][i].X >= 0)
		{
			game.event_layer[map_data[1][i].Y][map_data[1][i].X] = parseInt(map_data[1][i].EventID);
		}
	}
	
	//map_data[2] = object info [tileX,tileY],y,x,layer#
	for(var i = 0; i < map_data[2].length; i++)
	{
		var yCoord = map_data[2][i][1];
		var xCoord = map_data[2][i][2];
		
		//for old maps made where objects might have been placed outside of x-y size of map
		if(typeof game.object_layer[yCoord] == 'undefined' || typeof game.object_layer[yCoord][xCoord] == 'undefined') continue;
		
		if(game.object_layer[yCoord][xCoord] == 0)
		{
			game.object_layer[yCoord][xCoord]=[];
		}
		
		var object = {
			'tileset_pos':0,
			'layer':0,
			'tileset_index':0
		};
		
		//map_data[2][i][0] = object_coords on tileset
		object.tileset_pos = map_data[2][i][0];
		
		//map_data[2][i][3] = layer #
		if(map_data[2][i].length > 3)
		{
			object.layer = map_data[2][i][3];
		}
		
		//map_data[2][i][4] = tileset index
		if(map_data[2][i].length > 4)
		{
			object.tileset_index = map_data[2][i][4];
			//add tileset index to 'tileset_indexes_required'
			game.tileset_indexes_required[object.tileset_index] = 1;
		}
		
		game.object_layer[yCoord][xCoord].push(object);
	}
	
	//map_data[3] = facade info [tileX,tileY],y,x
	for(var i = 0; i < map_data[3].length; i++)
	{
		var yCoord = map_data[3][i][1];
		var xCoord = map_data[3][i][2];
		
		if(game.facade_layer[yCoord][xCoord] == 0)
		{
			game.facade_layer[yCoord][xCoord]=[];
		}
	
		var facade = {
			'tileset_pos':0,
			'layer':0,
			'tileset_index':0
		};
		
		//map_data[3][i][0] = object_coords on tileset
		facade.tileset_pos = map_data[3][i][0];
		
		//map_data[3][i][3] = layer #
		facade.layer = 0;
		if(map_data[3][i].length > 3)
		{
			facade.layer = map_data[3][i][3];
		}
		
		//map_data[3][i][4] = tileset index
		facade.tileset_index = 0;
		if(map_data[3][i].length > 4)
		{
			facade.tileset_index = map_data[3][i][4];
			//add tileset index to 'tileset_indexes_required'
			game.tileset_indexes_required[facade.tileset_index] = 1;
		}
		
		game.facade_layer[yCoord][xCoord].push(facade);
	}
	
	//load tilesets that need loading (object and facade)
	for(var tileset_index in game.tileset_indexes_required)
	{
		if(typeof game.tileset_object[tileset_index] === 'undefined')
		{
			game.LoadTileset(tileset_index);//init_load_tilesets
		}
	}
	
	//map_data[4] = map description info
	if(map_data.length > 4)
	{
		var description_info = map_data[4];
		if(Array.isArray(description_info))
		{
			//if in edit mode access raw data
			if(game.edit)
			{
				game.edit_description_array = description_info;
			}
			for(var d_index = 0; d_index < description_info.length; d_index++)
			{
				//onsole.log(description_info[d_index]);
				game.description_text.push(description_info[d_index].description);
				//go through coord array and add d_index to coords
				//add an array of d_index's so that descriptions may be stacked on each other
				for(var coord_index=0; coord_index<description_info[d_index].coord_array.length; coord_index++)
				{
					var y = description_info[d_index].coord_array[coord_index][0];
					var x = description_info[d_index].coord_array[coord_index][1];
					if(game.description_index_layer[y][x] == 0)
					{
						game.description_index_layer[y][x] = [];
					}
					game.description_index_layer[y][x].push(d_index);
				}
			}
		}
	}
	
	//map_data[5] = map start position y,x
	//onsole.log(GameController.start_x,game.characters[0].character_stats.x_pos);
	if(map_data.length > 5)
	{
		//default map start position
		game.map_start_y = parseInt(map_data[5][0]);
		game.map_start_x = parseInt(map_data[5][1]);
	}
	
	//place player party, default starting position is 1,1
	if(game.player != 0)
	{
		//set player position
		if(game.load_from_save && game.characters[0].character_stats.x_pos != 0)
		{
			//if loading from save game, place character in saved position
			game.map_start_x = game.characters[0].character_stats.x_pos;
			game.map_start_y = game.characters[0].character_stats.y_pos;
		}
		if(GameController.start_x != -1)
		{
			//if given start position in function call, place characters there
			game.map_start_x = parseInt(GameController.start_x);
			game.map_start_y = parseInt(GameController.start_y);
		}
		//place party members
		for(var i=0; i<game.characters.length; i++)
		{
			if(CharacterController.IsPartyMember(game.characters[i]))
			{
				game.characters[i].x = game.map_start_x;
				game.characters[i].y = game.map_start_y;
			}
		}
	}
	
	//map_data[6] = map size
	
	//map_data[7] = description
	
	//map_data[8] = npc and monster info character_id,y,x
	var load_monster = [];
	if(map_data.length > 8)
	{
		for(var i = 0; i < map_data[8].length; i++)
		{
			load_monster[i] = 
			{
				y: parseInt(map_data[8][i][2]),
				x: parseInt(map_data[8][i][3]),
				character_id: parseInt(map_data[8][i][0]),
				quick_stat_id: parseInt(map_data[8][i][1])
			}
		}
	}
	//onsole.log(load_monster);
	
	//map_data[9] = map_id (MapName)
	if(map_data.length > 9)
	{
		var map_id = map_data[9];
		game.map_id = map_id
		$('#map-id').val(map_id);
		$('#loading-text').html('Loading area');//: '+map_id+'...');
	}
	
	//map_data[10] is map size, located above
	
	game.area_settings[game.area_id] = map_data[11];
	
	game.area_settings[game.area_id].HasMap = parseInt(map_data[11].HasMap);
	game.area_settings[game.area_id].UseLos = parseInt(map_data[11].UseLos);
	game.area_settings[game.area_id].MapMemory = parseInt(map_data[11].MapMemory);
	game.area_settings[game.area_id].BattleBgIndex = parseInt(map_data[11].BattleBgIndex);
	game.area_settings[game.area_id].DarknessFactor = parseFloat(map_data[11].DarknessFactor);
	game.area_settings[game.area_id].HasMist = parseInt(map_data[11].HasMist);
	game.area_settings[game.area_id].HasRain = parseInt(map_data[11].HasRain);
	game.area_settings[game.area_id].ChanceMist = parseInt(map_data[11].ChanceMist);
	game.area_settings[game.area_id].ChanceRain = parseInt(map_data[11].ChanceRain);
	//game.area_settings[game.area_id].Description
	//onsole.log(game.area_settings[game.area_id]);
	
	//set all the inputs on the edit screen
	if(GameController.edit)
	{
		//onsole.log(game.area_settings[game.area_id]);
		if(game.area_settings[game.area_id].HasMap) $('#HasMap').prop('checked',true);
		if(game.area_settings[game.area_id].UseLos) $('#UseLos').prop('checked',true);
		if(game.area_settings[game.area_id].MapMemory) $('#MapMemory').attr('checked','checked');
		$('#BattleBgIndex').val(game.area_settings[game.area_id].BattleBgIndex);
		$('input:radio[name=DarknessFactor]').val([game.area_settings[game.area_id].DarknessFactor]);
		
		if(game.area_settings[game.area_id].HasMist) $('#HasMist').prop('checked',true);
		if(game.area_settings[game.area_id].HasRain) $('#HasRain').prop('checked',true);
		$('#ChanceMist').val(game.area_settings[game.area_id].ChanceMist);
		$('#ChanceRain').val(game.area_settings[game.area_id].ChanceRain);
	}
	
	if(game.area_settings[game.area_id].HasMist || game.area_settings[game.area_id].HasRain)
	{
		game.area_settings[game.area_id].showWeather = true;
	}
	else
	{
		game.area_settings[game.area_id].showWeather = false;
	}
	
	//this characters memory of the map
	if(game.area_settings[game.area_id].MapMemory)
	{
		if(game.area_id in game.vision_layer_remember_map_history)
		{
			game.vision_layer_remember_map = $.parseJSON(game.vision_layer_remember_map_history[game.area_id]);
		}
		else
		{
			if(map_data.length > 12 && map_data[12] != 0)
			{
				for(var y = 0; y < map_data[12].length; y++)
				{
					for(var x = 0; x < map_data[12][0].length; x++)
					{
						game.vision_layer_remember_map[y][x] = parseInt(map_data[12][y][x]);
					}
				}
			}
		}
	}
	game.set_canvas_size();//can call any time, edit has set canvas size
	
	for(var i = 0; i < load_monster.length; i++)
	{
		//if already loaded, skip
		//remove non PCs //change to keep all loaded characters
		var character_already_loaded = false;
		for(var j=0; j<game.characters.length; j++)
		{
			if(game.characters[j].character_stats.character_id == load_monster[i].character_id)
			{
				character_already_loaded = true;
			}
		}
		if(character_already_loaded)
		{
			continue;
		}
		
		//load monster character image, and poly image if there is one
		game.sprites_loading = game.sprites_loading + 2;//up to 2 images
		//has this characters quick_stats already been loaded by previous monster load
		var quickstat_character_stats_index = CharacterController.get_quickstat_character_stats_index(load_monster[i].quick_stat_id)
		
		//console.log('quickstat_character_stats_index: '+quickstat_character_stats_index);
		
		if(quickstat_character_stats_index == -1)
		{
		    
		    //alert('loading character player_character_id ':game.player.character_id});
			
			//load full data non-asynchronously so that has a chance to load before loading next character 
			ajax_action('load_character_data.php',load_monster[i].character_id,{'player_character_id':game.player.character_id},CharacterController.LoadCharacterCallback, false);
		}
		else
		{
			//have a pre-existing quickstats for character, only load mastercharacter stats and fill rest in afterwards
			ajax_action('load_mastercharacter_data.php',load_monster[i].character_id,{'player_character_id':game.player.character_id},CharacterController.LoadCharacterCallback);
		}
	}
	
	game.resources_loaded++
	//onsole.log('map loaded');
	
	GameController.WaitUntilLevelLoaded();
}

GameController.WaitUntilLevelLoaded = function()
{
	var game = GameController;
	var loadingTimer = setInterval(function()
	{
		//onsole.log(game.resources_loaded,game.resources_loading);
		//update loading bar
		var resources_loading_total = game.resources_loading + game.tilesets_loading + game.sprites_loading + game.icons_loading;
		var resources_loaded_total = game.resources_loaded + game.tilesets_loaded + game.sprites_loaded + game.icons_loaded;
		var percentDone = (resources_loaded_total+2)/resources_loading_total*100;
		percentDone = percentDone > 100 ? 100 : percentDone;
		$('#loading-bar').css('width', percentDone+'%');
		
		if(resources_loaded_total == resources_loading_total && (game.edit || MenuController.mainMenu != 0))
		{
			
			clearInterval(loadingTimer);
			//onsole.log('game.resources_loaded');
			
			/*
			if(game.loading_from_history)
			{
				game.wall_pit_fence_door_graphic_layer = $.parseJSON(game.wall_pit_fence_door_graphic_layer_history[game.area_id]);
				game.floor_graphic_layer = $.parseJSON(game.floor_graphic_layer_history[game.area_id]);
				//onsole.log(game.wall_pit_fence_door_graphic_layer[0].length, game.wall_pit_fence_door_graphic_layer.length);
			}
			else
			{
				game.calc_wall_and_floor_graphics();
				game.wall_pit_fence_door_graphic_layer_history[game.area_id] = JSON.stringify(game.wall_pit_fence_door_graphic_layer);
				game.floor_graphic_layer_history[game.area_id] = JSON.stringify(game.floor_graphic_layer);
			}
			*/
			WeatherController.start();
			game.calc_wall_and_floor_graphics();
			if(game.player != 0)
			{
				game.player_moving_direction(0);
			}
			
			//onsole.log('game.draw');
			game.draw();
			
			game.in_event = 0;
			$('#loading').hide();
			$('#loading-text').html('');
			$('#loading-bar').css('width', '0%');
			
			//on edit set game-map-container to scroll
			//if(game.edit) $('#game-map-container').css('width','auto').css('height','auto').css('max-width','740px').css('max-height','640px').css('overflow','scroll');
			
			//if not loading map editor, show mobile movment buttons
			if(window.mobile && !game.edit) $('#game-map-buttons').show();
			
			//show top menu
			$('#play-menu-icon-container').show();
			
			GameController.in_event = 0;
			//run the area start event, for now just running event located at the position player arrives on
			if(!game.edit && game.event_layer[game.map_start_y][game.map_start_x] != 0)
			{
				var event_id = game.event_layer[game.map_start_y][game.map_start_x];
				game.RunEvent(event_id);
			}
			
			$('#loading').css('background-image','none');
	
			/*
			//show intro if at start
			if(game.load_from_save && game.characters[0].character_stats.area_id == 0)
			{
				CutsceneController.Play('intro');
			}
			*/
			//scroll up to top
			window.scrollTo(0, 0);
		}
	}, 500);
}

GameController.SaveGame = function(showMessages, characters_to_save)
{
	if(arguments.length < 1)
	{
		showMessages = 1;
	}
	
	if(arguments.length < 2)
	{
		characters_to_save = 0;
	}
	
	if(showMessages)
	{
		GameController.in_event = 1;
	}
	
	//update buttons to say saving
	if(showMessages) $('#save-buttons').html('Saving...');
	//save your position and area id
	save_game_callback = function()
	{
		GameController.saveGameAjaxCall = 0;
		GameController.in_event = 0;
		if(showMessages)
		{
			var message = 'Saved<br/><br/>'; 
			message += '<div style="margin-top:15px;" id="save-buttons"><span id="selected-button" class="button selected" onclick="MenuController.MenuClose();">Ok</span></div>';
			MenuController.DisplayMessage(message);
		}
	}
	if(characters_to_save == 0)
	{
		//only save characters in this area
		var characters_to_save = [];
		for(var i in GameController.characters)
		{
			if(GameController.characters[i].character_stats.area_id == GameController.area_id
				//or if the players character, after reset gets area id = 0
				|| GameController.characters[i].character_stats.character_id == GameController.player.character_id)
			{
				//only send relevant data
				var character = GameController.characters[i];
				var characterSaveData = {
						'x':character.x,
						'y':character.y,
						'character_stats': {
								'character_id':character.character_stats.character_id,
								'area_id':character.character_stats.area_id,
								'hp_damage':character.character_stats.hp_damage,
								'asp_used':character.character_stats.asp_used,
								'dsp_used':character.character_stats.dsp_used,
								'summoned_by_character_id':character.character_stats.summoned_by_character_id,
								'is_polymorph_qsid':character.character_stats.is_polymorph_qsid,
								'is_familiar':character.character_stats.is_familiar,
								'effects':[]
							}
					};
				//if player character, send weapon, armor, equipment info
				if(GameController.characters[i].character_stats.character_id == GameController.player.character_id)
				{
					var equip_info = [];
					for(var j=0; j<GameController.characters[i].character_stats.WeaponArr.length; j++)
					{
						equip_info.push({
							'type': 'weapon', 
							'id': GameController.characters[i].character_stats.WeaponArr[j].WeaponID, 
							'equipped': GameController.characters[i].character_stats.WeaponArr[j].Equipped, 
							'off_hand': GameController.characters[i].character_stats.WeaponArr[j].off_hand
							});
					}
					for(var j=0; j<GameController.characters[i].character_stats.ArmorArr.length; j++)
					{
						equip_info.push({
							'type': 'armor', 
							'id': GameController.characters[i].character_stats.ArmorArr[j].ArmorID, 
							'equipped': GameController.characters[i].character_stats.ArmorArr[j].Equipped
							});
					}
					for(var j=0; j<GameController.characters[i].character_stats.EquipArr.length; j++)
					{
						equip_info.push({
							'type': 'equipment', 
							'id': GameController.characters[i].character_stats.EquipArr[j].EquipID, 
							'equipped': GameController.characters[i].character_stats.EquipArr[j].Equipped
							});
					}
					characterSaveData.EquipInfo = equip_info;
				}
				//set character effect data that will be saved
				for(var j=0; j<character.character_stats.effects.length; j++)
				{
					characterSaveData.character_stats.effects.push({
							'EffectID':character.character_stats.effects[j].EffectID,
							'EffectTypeTable':character.character_stats.effects[j].EffectTypeTable,
							'CharacterIDWhoCasted':character.character_stats.effects[j].CharacterIDWhoCasted,
							'CastedByCreatureTypeID':character.character_stats.effects[j].CastedByCreatureTypeID,
							'CastedBySubTypes':character.character_stats.effects[j].CastedBySubTypes,
							'ActionLevel':character.character_stats.effects[j].action_level,
							'TotalDuration':character.character_stats.effects[j].TotalDuration,
							'RoundsLeft':character.character_stats.effects[j].RoundsLeft,
							'InitiativeStarted':character.character_stats.effects[j].InitiativeStarted,
							'SaveDC':character.character_stats.effects[j].SaveDC,
							'EffectData':JSON.stringify(character.character_stats.effects[j].EffectData),
							'DiceRollResult':character.character_stats.effects[j].DiceRollResult ? character.character_stats.effects[j].DiceRollResult : 0 
						});
				}
				characters_to_save.push(characterSaveData);
			}
		}
	}
	
	var save_data = {
		'save_game': 1, 
		'AreaID': GameController.area_id,
		'Xpos': GameController.characters[GameController.active_player_index].x,
		'Ypos': GameController.characters[GameController.active_player_index].y,
		'characters': characters_to_save,
		'player_completed_events': GameController.player_completed_events,
		'player_knowledge_tags': GameController.player_knowledge_tags,
	}
	//cancel current savegame call if waiting
	if(GameController.saveGameAjaxCall != 0)
	{
		try{GameController.saveGameAjaxCall.abort();}//sometimes throws an error??
		catch(err){}
		GameController.saveGameAjaxCall = 0;
	}
	GameController.saveGameAjaxCall = ajax_action('save_game.php', GameController.player.character_id, save_data, save_game_callback);
}

GameController.RunEvent = function(event_id)
{
	console.log('event_id: '+event_id);
	if (typeof event_id == 'undefined')
	{
		return 0;
	}
	//return false to stop player from moving to square
	var game = GameController;
	var allow_player_move = 1;
	var eventData = 0;
	
	find_event_loop:
	for(var event_index in game.events)
	{
		if(game.events[event_index].EventID == event_id)// && parseInt(event.AreaID) == game.area_id)
		{
			eventData = game.events[event_index];
			break find_event_loop;//use event_index later to remove this event
		}
	}
	//onsole.log(eventData);
	//event only gets run once and has already run *** NEED TO SAVE TO PLAYER
	if(eventData.IsOnlyOnce && $.inArray(event_id, game.player_completed_events) > -1) return true;//true means player can move, false stops player form moving
	
	//onsole.log('eventData.ToAreaID',eventData.ToAreaID,GameController.area_id);
	
	if(eventData.ToAreaID > 0)
	{
		if(eventData.ToAreaID != GameController.area_id)
		{
			GameController.in_event = 1;
			allow_player_move = 0;
			if(eventData.AskChange)
			{
				var message = 'Leave this area?';//<br/><br/>Move to: '+eventData.ToMapName+'<br/><br/>'; 
				message += '<div style="margin-top:15px;"><span id="selected-button" class="button selected" onclick="GameController.EventChangeAreaClick('+eventData.ToAreaID+','+eventData.ToX+','+eventData.ToY+');">OK</span>';
				message += ' <span id="" class="button" onclick="GameController.EndEvent(); MenuController.MenuClose();">Cancel</span></div>';
				MenuController.DisplayMessage(message);
			}
			else
			{
				GameController.EventChangeAreaClick(eventData.ToAreaID,eventData.ToX,eventData.ToY);
			}
		}
		//else if moving to same area, then pop on over
		else
		{
			GameController.in_event = 1;
			GameController.player_moving = 1;
			$('#loading-text').html('');
			$('#loading-bar').css('width', '0%');
			$('#loading').fadeIn(300, function()
			{
					GameController.player_moving_direction(0);//to stop smooth move
					GameController.trigger_player_move(eventData.ToX, eventData.ToY, true);//true == isEventMove
					GameController.redraw_map_on_player_position(true);
					GameController.in_event = 0;
					GameController.player_moving = 0;
					$('#loading').fadeOut();
				});
		}
	}
	
	//if battle event
	
	//if cutscene event
	console.log(eventData.Cutscene);
	if(eventData.Cutscene)
	{
		//onsole.log('play');
		CutsceneController.Play(eventData.Cutscene);
	}
	
	//if conversation event
	if(eventData.ConversationID > 0)
	{
		//
	}
	
	//if event items here
	if(eventData.EventItems.length > 0)
	{
		//open store with the items
		ShopController.DisplayEventItems(event_index);
	}
	
	if($.inArray(event_id, game.player_completed_events) == -1) game.player_completed_events.push(event_id);
	
	return allow_player_move;
}

GameController.EndEvent = function()
{
	GameController.in_event = 0;
}

GameController.EventChangeAreaClick = function(ToAreaID,ToX,ToY)
{
	MenuController.MenuClose();
	//save without messages, saves all characters in the area before leaving
	GameController.SaveGame(false);
	
	if(ToX > 0 && ToY > 0)
		GameController.load_level(ToAreaID, ToX, ToY);
	else
		GameController.load_level(ToAreaID);
}

GameController.trigger_player_move = function(x,y,isEventMove)
{
	if(GameController.smooth_move_distance != 0 || GameController.smooth_move_interval != 0) return false;
	
	if(GameController.player_moving_direction() == 'left' || GameController.player_moving_direction() == 'right')
	{
		GameController.characters[GameController.active_player_index].facing = GameController.player_moving_direction();
	}
	
	if(x<0 || y<0 || x>=GameController.get_area_width() || y>=GameController.get_area_height())
	{
		GameController.player_moving_direction(0);
		return false;
	}
	
	if(arguments.length < 3) isEventMove = false;
	if(GameController.drawing_map) return false;
	
	if(!isEventMove)
	{
		if(GameController.player_moving || GameController.in_event) return false;
	}
	
	if(MenuController.MenuVisible) MenuController.MenuClose();
	
	//if going to an event run the event
	//if RunEvent returns false, don't move player
	if(GameController.event_layer[y][x] != 0)
	{
		var event_id = GameController.event_layer[y][x];
		var allow_move = GameController.RunEvent(event_id);
		if(!allow_move)
		{
			return false;
		}
	}
	
	//effect duration decrease every 2nd move made
	//CHANGE TO REFLECT SPEED OF MOVEMENT
	GameController.player_move_duration_countdown++;
	if(GameController.player_move_duration_countdown >= 4)
	{
		GameController.player_move_duration_countdown = 0;
		EffectController.DecreaseAllDuration();
		//refresh active character's status in top display
		CharacterController.ShowCharacterDisplay(GameController.active_player_index);
	}
	
	GameController.player_moving = 1;
	//if player is trying to change positions
	if(GameController.characters[GameController.active_player_index].y != y || GameController.characters[GameController.active_player_index].x != x)
	{
		//GameController.move_player returns true if player position has changed
		if(GameController.move_player(y,x,isEventMove))
		{
			CharacterAiController.move_npc_monster();
			//Update the image
			GameController.redraw_map_on_player_position();//initiate smooth move in .draw
		}
	}
	
	if(GameController.mobile_continuous_move == 0)
	{
		GameController.mobile_continuous_move = setInterval(function(){
			requestAnimationFrame(function(){
				GameController.player_moving = 0;
				//if player holding down mobile movement button, move player again
				if(GameController.smooth_move_distance == 0 && GameController.smooth_move_interval == 0 && GameController.player_moving_direction() != 0)
				{
					$('#game-map-buttons').trigger('touchstart');
				}
				else if(GameController.player_moving_direction() == 0)
				{
					clearInterval(GameController.mobile_continuous_move);
					GameController.mobile_continuous_move = 0;
				}
				
			})
		}, 100);
	}
}

GameController.move_player = function(y,x,isEventMove)
{
	var game=GameController;
	
	if(GameController.in_event == 1 && !isEventMove) return false;
	/*
	if(game.resources_loaded != game.resources_loading){
		return false;
	}
	*/
	
	//if off grid return false//now checking in trigger move
	
	var player_has_moved = false;
	
	if(game.player_look || game.player_talk)
	{
		game.GameMapClicked(y,x);
		if(game.player_look) $('#game-menu-top-look').trigger(window.mobile?'touchend':'click');
		if(game.player_talk) $('#game-menu-top-talk').trigger(window.mobile?'touchend':'click');
		return false;
	}
	
	//if a bridge or stairs
	var allow_move_object_tileset = false;
	for(var i=0; i<game.object_layer[y][x].length; i++)
	{
		if(game.object_layer[y][x][i].tileset_index == 13)
		{
			allow_move_object_tileset = true;
		}
	}
	
	//if the wanted place is empty
	if(
		game.floor_wall_pit_fence_door_layer[y][x]===0 || game.floor_wall_pit_fence_door_layer[y][x]===4 
		//or if a bridge or stairs
		|| allow_move_object_tileset
	)
	{
		//game.functionSpeedTimerThen = Date.now();
		//clear battle_info_context 
		BattleController.battle_info_context.clearRect(0,0,BattleController.battle_info_canvas.width,BattleController.battle_info_canvas.height);
		//cancel current selected action
		if(BattleController.process_battle_action_args != 0) MenuController.BattleMenuClearAction();
		player_has_moved = true;
		
		//move chain of players behind leader
		//create array of PCs in formation
		var walking_order = [];
		walking_order.push(game.characters[game.active_player_index]);
		for(var i = 0; i < game.characters.length; i++)
		{
			if(CharacterController.IsPartyMember(game.characters[i]) && i != game.active_player_index)
			{
				walking_order.push(game.characters[i]);
			}
		}
		for(var i = walking_order.length-1; i >= 0; i--)
		{
			if(i > 0 && (walking_order[i-1].x != walking_order[i].x || walking_order[i-1].y != walking_order[i].y))
			{
				walking_order[i].direction = 0;
				if(walking_order[i].x > walking_order[i-1].x)//left
				{
					walking_order[i].direction = 'left';
					walking_order[i].facing = 'left';
				}
				if(walking_order[i].x < walking_order[i-1].x)//right
				{
					walking_order[i].direction = 'right';
					walking_order[i].facing = 'right';
				}
				if(walking_order[i].y > walking_order[i-1].y)//left
				{
					walking_order[i].direction = 'up';
				}
				if(walking_order[i].y < walking_order[i-1].y)//right
				{
					walking_order[i].direction = 'down';
				}
				walking_order[i].x = walking_order[i-1].x;
				walking_order[i].y = walking_order[i-1].y;
			}
		}
		
		//move player
		game.characters[game.active_player_index].x = x;
		game.characters[game.active_player_index].y = y;
		
		//if stnding inside clear weather effects
		if(game.facade_layer[y][x] != 0 && WeatherController.timer != 0)
		{
			WeatherController.stop();
		}
		else if(game.facade_layer[y][x] == 0 && WeatherController.timer != 0)
		{
			WeatherController.start();//checks to see if there should be weather displayed
		}
		
		if(game.event_layer[y][x]!=0)
		{
			//place event here
		}
		//game.functionSpeedTimerNow = Date.now();
		//onsole.log((game.functionSpeedTimerNow-game.functionSpeedTimerThen),'end move player');
	}
	/*
	if(!GameController.sound_mute)
	{
		var random_sound = Math.floor(Math.random()*(2));
		var sound = game.sound['footstep_dirt_0'+random_sound];
		sound.currentTime = 0;
		sound.play();
	}
	*/
	return player_has_moved;
}

GameController.burst_radius = function(layer,clickY,clickX,burst_size)
{
	var game=GameController;
	burst_size = Math.floor(burst_size);
	var rect_left = clickX - burst_size;
	var rect_top = clickY - burst_size;
	
	//loop through all squares in rect
	for(var y=rect_top,height=(burst_size*2 + 1); y<=rect_top+height; y++)
	{
		if(y<0 || y>=layer.length) continue;
		for(var x=rect_left,width=(burst_size*2 + 1); x<=rect_left+width; x++)
		{
			if(x<0 || x>=layer[0].length) continue;
			if(Math.sqrt(Math.pow(Math.abs(clickX - x),2) + Math.pow(Math.abs(clickY - y),2)) <= burst_size + 0.5)
			{
				layer[y][x]++;
			}
		}
		//$('#output-event').val($('#output-event').val() + "\n");
	}
	return layer.slice(0);
}

GameController.check_los = function(radiusClose,radiusFar,checkY,checkX,checkToY,checkToX)
{
	var check_target_square = true;
	//if checkTo arguments not given, check LoS for entire field
	if(arguments.length < 6)
	{
		check_target_square = false;
	}
	
	var game=GameController;

	var level = game.floor_wall_pit_fence_door_layer;
	
	if(check_target_square)
		var vision_fog_layer = game.vision_fog_single_check_layer;
	else
		var vision_fog_layer = game.vision_fog_layer;
		
	var vision_fog_layer_already_checked_flag = game.vision_fog_layer_already_checked_flag;
	var ts = game.tile_size();
	
	var player_y = game.characters[game.active_player_index].y;
	var player_x = game.characters[game.active_player_index].x;
	/*
	onsole.log('start los');
	game.functionSpeedTimerThen = Date.now();
	*/
	//$('#output-event').val('');
	
	//loop through all squares and set clear vision_fog_layer to 0 (0 = can't see, 1 = see poorly, 2 = see well)
	//set clear vision_fog_layer_already_checked_flag = 0 (0 = not checked, 1 = already checked in the process thus far)
	for(var y=0,height=game.get_area_height(); y<height; y++)
	{
		for(var x=0,width=game.get_area_width(); x<width; x++)
		{
			vision_fog_layer[y][x]=0;
			vision_fog_layer_already_checked_flag[y][x]=0;
		}
	}
	
	//limit to a burst around start point
	vision_fog_layer=game.burst_radius(vision_fog_layer,checkY,checkX,radiusFar);
	vision_fog_layer=game.burst_radius(vision_fog_layer,checkY,checkX,radiusClose);
	
	//if checking sight to single square, and is outside of vision range, player is out of sight, return false
	if(check_target_square && vision_fog_layer[checkToY][checkToX] == 0) return false;
	
	//set start point position to visible
	vision_fog_layer[checkY][checkX] = 2;
	
	//get pixel coord centre of starting square
	var checkStartYpx = checkY * ts+ (ts/2);
	var checkStartXpx = checkX * ts + (ts/2);
	var canSee = 1;

	if(check_target_square)
	{
		//if given a target square, check to see if LoS to target square is clear
		y=checkToY;
		x=checkToX;
		check_los_to_target_square(y,x, checkY, checkX);
	}
	else
	{
		//loop through all squares
		for(var y=0,height=game.get_area_height(); y<height; y++)
		{
			for(var x=0,width=game.get_area_width(); x<width; x++)
			{
				if(vision_fog_layer_already_checked_flag[y][x] == 0)
				{
					check_los_to_target_square(y,x, checkY, checkX);
				}
			}
		}
	}
	
	function check_los_to_target_square(y,x, originY, originX)
	{
		if(arguments.length < 4)
		{
			originY = -1;
			originX = -1;
		}
		//get pixel centre of non-wall squares
		canSee = true;
		//if target tile within distance of radiusFar (vision_fog_layer[y][x] > 0)
		//if target tile not a wall or door (level[y][x] != 1 || level[y][x] != 4)
		//->if target tile is a door and player is on door let monster see and therefore move to door
			//might need to add later - if target is a door on a fence then ok (level[y][x] != 4 || game.tileset_type_layer[y][x][0][0] == 0)
		//if target tile not on starting position (y != checkY || x != checkX)
		if(vision_fog_layer[y][x] > 0 && level[y][x] != 1 && level[y][x] != 4 && (y != checkY || x != checkX))
		{
			//draw a line and check every 1/2 tile_size() pixels to see if being blocked by a wall or door
			var checkEndYpx = y * ts + (ts/2);
			var checkEndXpx = x * ts + (ts/2);
			//how long is the line
			var checkLineLength = Math.sqrt(Math.pow(Math.abs(checkStartYpx - checkEndYpx),2) + Math.pow(Math.abs(checkStartXpx - checkEndXpx),2));
			//divide by tile_size to see how many checks should be made along line
			var checkNumTimes = Math.floor(checkLineLength/(ts));
			//how many px y and x change for each check
			var checkYchange = (checkEndYpx - checkStartYpx)/checkNumTimes;
			var checkXchange = (checkEndXpx - checkStartXpx)/checkNumTimes;
			//check every 10px on line to see if blocked by a wall
			
			//$('#output-event').val(checkStartYpx+'-'+checkStartXpx+' to '+checkEndYpx+'-'+checkEndXpx+' ('+checkYchange+','+checkXchange+') '+checkLineLength+':'+checkNumTimes+"\n");
			
			check_loop:
			for(var i=0; i<=checkNumTimes; i++)
			{
				var checkYpx=checkStartYpx+(checkYchange*i);
				var checkXpx=checkStartXpx+(checkXchange*i);
				//if make 2 checks offsetting x&y px by -1 deals with issue of 1 offs
				var checkYsqr1 = Math.floor(checkYpx/ts);
				var checkXsqr1 = Math.floor(checkXpx/ts);
				var checkYsqr2 = Math.floor((checkYpx-1)/ts);
				var checkXsqr2 = Math.floor((checkXpx-1)/ts);
				
				//$('#output-event').val($('#output-event').val()+checkYsqr+'-'+checkXsqr+"\n");
				//if square is not on player position, 
					//if square is a wall or door block vision
					//if door is not on a fence then ok (game.tileset_type_layer[y][x][0][0] != 0)
				if(
					(originY != checkYsqr1 || originX != checkXsqr1) 
					&& (originY != checkYsqr2 || originX != checkXsqr2) 
					&& (level[checkYsqr1][checkXsqr1] == 1 || (level[checkYsqr1][checkXsqr1] == 4 && game.tileset_type_layer[checkYsqr1][checkXsqr1][0][0] != 0))
					&& (level[checkYsqr2][checkXsqr2] == 1 || level[checkYsqr2][checkXsqr2] == 4 && game.tileset_type_layer[checkYsqr2][checkXsqr2][0][0] != 0))
				{
					//can't see target square because its blocked
					canSee = false;
					//set blocking tile(s) to can't see and checked
					vision_fog_layer[checkYsqr1][checkXsqr1] = 0;
					vision_fog_layer[checkYsqr2][checkXsqr2] = 0;
					vision_fog_layer_already_checked_flag[checkYsqr1][checkXsqr1] = 1;
					vision_fog_layer_already_checked_flag[checkYsqr2][checkXsqr2] = 1;
					//stop looking along this path
					break check_loop;
				}
				
				//can see current tile(s) at [checkYsqr1,checkXsqr1] && if different, at [checkYsqr2,checkXsqr2], set to checked (default burst radius gives can see value 1 = long range, 2 = short range)
				vision_fog_layer_already_checked_flag[checkYsqr1][checkXsqr1] = 1;
				vision_fog_layer_already_checked_flag[checkYsqr2][checkXsqr2] = 1;
				
			}
		}
		//if not start position then its a door or wall so can't see it
		else if(y != checkY || x != checkX)
		{
			canSee = false;
		}
		
		if(vision_fog_layer_already_checked_flag[y][x] == 0)
		{
			//lets the monster know he can see the target
			vision_fog_layer[y][x] = canSee ? vision_fog_layer[y][x]+1 : 0;
		}
		vision_fog_layer_already_checked_flag[y][x] = 1;
	}
	
	return canSee;
	/*
	game.functionSpeedTimerNow = Date.now();
	onsole.log((game.functionSpeedTimerNow-game.functionSpeedTimerThen),'end los');
	*/
}
