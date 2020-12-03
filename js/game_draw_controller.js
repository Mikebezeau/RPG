GameController.redraw_map_on_player_position = function(skipSmoothMove)
{
	var game=GameController;
	
	game.redraw_wall_graphics = true;
	game.redraw_object_bg_graphics = true;
	game.draw(skipSmoothMove);
}

GameController.SmoothMove = function()
{
	var game = GameController;
	//increment step
	game.smooth_move_distance += game.distance_per_smooth_move;
	//check if has already reached the last step
	if(game.smooth_move_distance >= 32)
	{
		clearInterval(game.smooth_move_interval);
		game.smooth_move_interval = 0;
		requestAnimationFrame(function(){
				game.redraw_wall_graphics = true;
				game.redraw_object_bg_graphics = true;
				game.draw(true);
				game.smooth_move_distance = 0;
			});
		return false;
	}
	var shift_map_x = 0;
	var shift_map_y = 0;
	if(game.smooth_move_direction == 'up') shift_map_y = game.smooth_move_distance * game.map_scale;
	if(game.smooth_move_direction == 'down') shift_map_y = -game.smooth_move_distance * game.map_scale;
	if(game.smooth_move_direction == 'left') shift_map_x = game.smooth_move_distance * game.map_scale;
	if(game.smooth_move_direction == 'right') shift_map_x = -game.smooth_move_distance * game.map_scale;
	
	game.buffer_display_context.drawImage(game.canvas_wall_and_floor_graphical, 0, 0, 544, 544, shift_map_x, shift_map_y, 544, 544);
	game.buffer_display_context.drawImage(game.canvas_object_bg, 0, 0, 544, 544, shift_map_x, shift_map_y, 544, 544);
	game.buffer_display_context.drawImage(game.canvas_event_object, 0, 0, 544, 544, shift_map_x, shift_map_y, 544, 544);
	game.DrawCharacters(shift_map_x, shift_map_y);
	game.buffer_display_context.drawImage(game.canvas_character, 0, 0, 544, 544, shift_map_x, shift_map_y, 544, 544);
	game.buffer_display_context.drawImage(game.canvas_object_fg, 0, 0, 544, 544, shift_map_x, shift_map_y, 544, 544);
	game.buffer_display_context.drawImage(game.canvas_facade, 0, 0, 544, 544, shift_map_x, shift_map_y, 544, 544);
	game.buffer_display_context.drawImage(game.canvas_vision_fog, 0, 0, 544, 544, shift_map_x, shift_map_y, 544, 544);
	//buffer to screen
	game.display_context.drawImage(game.buffer_display_canvas, 0, 0, 544, 544);
}

GameController.draw = function(skipSmoothMove)
{
	if(arguments.length < 1) skipSmoothMove = false;
	
	var game = GameController;
	
	if(!game.edit)
	{
		if(!skipSmoothMove)
		{
			if(game.smooth_move_distance == 0 && game.player_moving_direction() != 0)
			{
				game.smooth_move_direction = game.player_moving_direction();
				game.smooth_move_interval = setInterval(function(){requestAnimationFrame(game.SmoothMove);}, 40);
				return false;
			}
			else if(game.smooth_move_interval != 0)
			{
				return false;
			}
		}
		else
		{
			//finish smoothmove, reset player_moving_direction to direction smoothmove was started on
			if(game.player_moving_direction() != 0) game.player_moving_direction(game.smooth_move_direction);
		}
	}
	else
	{
		var event_count = 1;
	}
	
	if(game.drawing_map) return false;
	game.drawing_map = 1;
	var t = game.tile_size();
	var map_scale = game.map_scale;
	var darkness = game.area_settings[game.area_id].DarknessFactor > 0 ? game.area_settings[game.area_id].DarknessFactor : 1;
	
	var ts_size = ~~(game.tileset_tile_size);
	var floor_wall_pit_fence_door_layer = game.floor_wall_pit_fence_door_layer;
	var random_ground_layer = game.random_ground_layer;
	var wall_pit_fence_door_graphic_layer = game.wall_pit_fence_door_graphic_layer;
	var floor_graphic_layer = game.floor_graphic_layer;
	//var pit_graphic_type = game.pit_graphic_type;
	var character_layer = game.character_layer;
	var object_layer = game.object_layer;
	var event_layer = game.event_layer;
	var select_layer = game.select_layer;
	var vision_fog_layer = game.vision_fog_layer;
	var facade_layer = game.facade_layer;
	
	var tileset_type_layer = game.tileset_type_layer;
	
	//onsole.log('start draw');
	//game.functionDrawSpeedTimerThen = Date.now();
	
	//clear game.player_mouse_grid_y wall_and_floor_graphic_layer
	if(game.redraw_mouse_region)
	{
		//clear part of canvas'
		game.context.clearRect(
			~~((game.player_mouse_grid_x-1)*t), 
			~~((game.player_mouse_grid_y-1)*t), t*3, t*3);
		
		game.context_wall_and_floor_graphical.clearRect(
			~~((game.player_mouse_grid_x-1)*t), 
			~~((game.player_mouse_grid_y-1)*t), t*3, t*3);
		
		game.context_object_bg.clearRect(
			~~((game.player_mouse_grid_x-1)*t), 
			~~((game.player_mouse_grid_y-1)*t), t*3, t*3);
		/*
		//not used in edit mode
		game.context_event_object.clearRect(
			~~((game.player_mouse_grid_x-1)*t), 
			~~((game.player_mouse_grid_y-1)*t), t*3, t*3);
		*/
		game.context_object_fg.clearRect(
			~~((game.player_mouse_grid_x-1)*t), 
			~~((game.player_mouse_grid_y-1)*t), t*3, t*3);
		
		game.context_facade.clearRect(
			~~((game.player_mouse_grid_x-1)*t), 
			~~((game.player_mouse_grid_y-1)*t), t*3, t*3);
	}
	else if(!game.edit && game.player_moving_direction() != 0)
	{
		var shift_map_x = 0;
		var shift_map_y = 0;
		if(game.player_moving_direction() == 'up') shift_map_y = 32*map_scale;
		if(game.player_moving_direction() == 'down') shift_map_y = -32*map_scale;
		if(game.player_moving_direction() == 'left') shift_map_x = 32*map_scale;
		if(game.player_moving_direction() == 'right') shift_map_x = -32*map_scale;
		
		//using buffer to move 'canvas_wall_and_floor_graphical' & 'canvas_object_bg'
		//so that canvases can be cleared before redrawn
		game.buffer_display_context.clearRect(0,0,game.buffer_display_canvas.width, game.buffer_display_canvas.height);
		game.buffer_display_context.drawImage(game.canvas_wall_and_floor_graphical, 0, 0, 544, 544, shift_map_x, shift_map_y, 544, 544);
		game.context_wall_and_floor_graphical.drawImage(game.buffer_display_canvas, 0, 0, 544, 544);
		
		game.buffer_display_context.clearRect(0,0,game.buffer_display_canvas.width, game.buffer_display_canvas.height);
		game.buffer_display_context.drawImage(game.canvas_object_bg, 0, 0, 544, 544, shift_map_x, shift_map_y, 544, 544);
		game.context_object_bg.clearRect(0,0,game.canvas_object_bg.width, game.canvas_object_bg.height);
		game.context_object_bg.drawImage(game.buffer_display_canvas, 0, 0, 544, 544);
		
		//clear
		game.context_event_object.clearRect(0,0,game.canvas_event_object.width,game.canvas_event_object.height);
		game.context_select.clearRect(0,0,game.canvas_select.width, game.canvas_select.height);
		game.redraw_characters = true;
		game.context_object_fg.clearRect(0,0,game.canvas_object_fg.width, game.canvas_object_fg.height);
		game.context_facade.clearRect(0,0,game.canvas_facade.width, game.canvas_facade.height);
		game.context_vision_fog.clearRect(0,0,game.canvas_vision_fog.width, game.canvas_vision_fog.height);
		//**************
	}
	else
	{
		//game.context.clearRect(0,0,game.canvas.width,game.canvas.height);
		//clear base canvas - paint black
		game.context.fillStyle='#000';
		game.context.fillRect(0,0,game.canvas.width,game.canvas.height);
		
		//clear wall_and_floor_graphic_layer
		if(game.redraw_wall_graphics || !game.show_tileset_graphics)
		{
			game.context_wall_and_floor_graphical.clearRect(0,0,game.canvas_wall_and_floor_graphical.width,game.canvas_wall_and_floor_graphical.height);
		}
		
		//clear object_bg_graphics
		if(game.redraw_object_bg_graphics || !game.show_tileset_graphics)
		{
			game.context_object_bg.clearRect(0,0,game.canvas_object_bg.width,game.canvas_object_bg.height);
		}
		
		game.context_event_object.clearRect(0,0,game.canvas_event_object.width,game.canvas_event_object.height);
		
		game.context_object_fg.clearRect(0,0,game.canvas_object_fg.width,game.canvas_object_fg.height);
		
		//clear select_layer
		game.context_select.clearRect(0,0,game.canvas_select.width,game.canvas_select.height);
		
		//clear vision_fog_layer
		game.context_vision_fog.clearRect(0,0,game.canvas_vision_fog.width,game.canvas_vision_fog.height);
		
		//clear facade layer
		game.context_facade.clearRect(0,0,game.canvas_facade.width,game.canvas_facade.height);
		
	}
	
	var start_y = game.display_start_y();// = Math.ceil(game.characters[game.active_player_index].y-(Math.floor(game.game_screen_num_tiles_height/2))/map_scale);
	var start_x = game.display_start_x();// = Math.ceil(game.characters[game.active_player_index].x-(Math.floor(game.game_screen_num_tiles_width/2))/map_scale);
			
	if(!game.edit)
	{
		var end_y = Math.ceil(game.characters[game.active_player_index].y+(Math.floor(game.game_screen_num_tiles_height/2))/map_scale);
		var end_x = Math.ceil(game.characters[game.active_player_index].x+(Math.floor(game.game_screen_num_tiles_width/2))/map_scale);
	}
	else
	{
		var end_y = Math.ceil(game.edit_start_y+game.game_screen_num_tiles_height/map_scale);//get_area_height();
		var end_x = Math.ceil(game.edit_start_x+game.game_screen_num_tiles_width/map_scale);//get_area_width();
	}
	
	//location on canvas where to start drawing (0,0 or to the left 1 and up 1 of where player clicked in edit mode to draw only a 3x3 area around mouse click)
	var draw_display_y = 0;
	var draw_display_x = 0;
	
	if(game.redraw_mouse_region)
	{
		draw_display_y = game.player_mouse_grid_y-1 < 0 ? 0 : game.player_mouse_grid_y-1;
		draw_display_x = game.player_mouse_grid_x-1 < 0 ? 0 : game.player_mouse_grid_x-1;
		//redraw part of canvas
		start_y = (game.edit_start_y + game.player_mouse_grid_y-1 <= 0)? 0: game.edit_start_y + game.player_mouse_grid_y-1;
		start_x = (game.edit_start_x + game.player_mouse_grid_x-1 <= 0)? 0: game.edit_start_x + game.player_mouse_grid_x-1;
		end_y = (game.edit_start_y + game.player_mouse_grid_y+1 >= end_y)? end_y: game.edit_start_y + game.player_mouse_grid_y+1;
		end_x = (game.edit_start_x + game.player_mouse_grid_x+1 >= end_x)? end_x: game.edit_start_x + game.player_mouse_grid_x+1;
	}
	
	//set vision fog
	if(!game.edit && (game.area_settings[game.area_id].UseLos || game.test_los))
	{
		//in inside only can see within LoS in area
		if(game.area_settings[game.area_id].UseLos 
			//|| facade_layer[game.characters[game.active_player_index].y][game.characters[game.active_player_index].x] != 0
		)
		{
			var character_light = 0;
			var character_darkvision = 0;
			
			//CHECK PLAYER VISION EFFECTS
			//var test_list = EffectController.GetEffectTypeMods(game.characters[game.active_player_index].character_stats, 'EffectACMod');
			//onsole.log(test_list);
			
			var effect_light_mods = EffectController.GetEffectTypeMods(game.characters[game.active_player_index].character_stats, 'vision');
			//onsole.log(effect_light_mods);
			
			if(darkness != 1)
			{
				if(effect_light_mods.effect_mod_type_list.Light_Minor == 1)
				{
					character_light = 2.5;
					darkness = darkness+0.3 < 0.95 ? darkness+0.3 : 0.95;
				}
				if(effect_light_mods.effect_mod_type_list.Light_Major == 1)
				{
					character_light = 5;
					darkness = darkness+0.5 < 0.95 ? darkness+0.5 : 0.95;
				}
				if(effect_light_mods.effect_mod_type_list.Darkvision == 1)
				{
					character_darkvision = 1;
				}
			}
			
			var min_los_range = darkness*6;
			if(character_darkvision) min_los_range = min_los_range<3.5 ? 3.5 : min_los_range;
			game.check_los(min_los_range,(darkness*10), game.characters[game.active_player_index].y, game.characters[game.active_player_index].x);
		}
		//can see outside (fill area)
		else
		{
			vision_fog_layer = game.get_fill_area(game.characters[game.active_player_index].y,game.characters[game.active_player_index].x, true);
		}
	}
	
	//if there is something new to draw
	if(game.redraw_mouse_region || game.redraw_wall_graphics || game.redraw_object_bg_graphics || (game.edit && game.view_events) || game.view_selected_area || BattleController.show_select_area)
	{
		for(var y=start_y; y <= end_y; y++)
		{
			if(y >= 0 && y < game.get_area_height())
			{
				for(var x=start_x; x <= end_x; x++)
				{
					if(x >= 0 && x < game.get_area_width())
					{
						if(!game.show_tileset_graphics)
						{
							switch(floor_wall_pit_fence_door_layer[y][x])
							{
								//Wall
								case 1:
									game.context.fillStyle='#555';
									game.context.fillRect(draw_display_x*t,draw_display_y*t,t,t);
								break;
								
								//Pit
								case 2:
									game.context.fillStyle='#140c1c';
									game.context.fillRect(draw_display_x*t,draw_display_y*t,t,t);
								break;
								
								//fence
								case 3:
									game.context.fillStyle='#888';
									game.context.fillRect(draw_display_x*t,draw_display_y*t,t,t);
								break;
								
								//Empty place
								default:
									if((x+y)%2==0)
									{
										game.context.fillStyle='#d4cff6';
									}
									else
									{
										game.context.fillStyle='#c8c2f4';
									}
									game.context.fillRect(draw_display_x*t,draw_display_y*t,t,t);
								break;
							}
						}
						
						if(game.redraw_mouse_region || (game.redraw_wall_graphics && game.show_tileset_graphics))
						{
							if(y == 0)
							{
								game.context_wall_and_floor_graphical.fillStyle='#000';
								game.context_wall_and_floor_graphical.fillRect(draw_display_x*t,(draw_display_y-1)*t,t,t);
								game.context_wall_and_floor_graphical.fillRect(draw_display_x*t,(draw_display_y-2)*t,t,t);
							}
							
							if(x == 0)
							{
								game.context_wall_and_floor_graphical.fillStyle='#000';
								game.context_wall_and_floor_graphical.fillRect((draw_display_x-1)*t,draw_display_y*t,t,t);
								game.context_wall_and_floor_graphical.fillRect((draw_display_x-2)*t,draw_display_y*t,t,t);
							}
							
							if(y == game.area_height-1)
							{
								game.context_wall_and_floor_graphical.fillStyle='#000';
								game.context_wall_and_floor_graphical.fillRect(draw_display_x*t,(draw_display_y+1)*t,t,t);
								game.context_wall_and_floor_graphical.fillRect(draw_display_x*t,(draw_display_y+2)*t,t,t);
							}
							
							if(x == game.area_width-1)
							{
								game.context_wall_and_floor_graphical.fillStyle='#000';
								game.context_wall_and_floor_graphical.fillRect((draw_display_x+1)*t,draw_display_y*t,t,t);
								game.context_wall_and_floor_graphical.fillRect((draw_display_x+2)*t,draw_display_y*t,t,t);
							}
							//if edit or player done moving, draw whole map
							//or if player moving, only draw the edge of map player moved towards to fill in that one line of squares
							if(game.edit ||  
									(
										game.player_moving_direction() == 0
										|| (game.player_moving_direction() == 'up' && draw_display_y == 0)
										|| (game.player_moving_direction() == 'down' && draw_display_y == end_y-start_y)//end_y-start_y is the height of displayed map (in tiles)
										|| (game.player_moving_direction() == 'left' && draw_display_x == 0)
										|| (game.player_moving_direction() == 'right' && draw_display_x == end_x-start_x)//end_y-start_y is the width of displayed map (in tiles)
									)
								)
							{
								var terrain_type = floor_wall_pit_fence_door_layer[y][x];
								//draw floor under fences and doors //floor = 0, fence = 3, door = 4
								if(terrain_type == 0 || terrain_type == 3 || terrain_type == 4)
								{
									var floor_graphic = game.floor_graphic_layer[y][x];
									try{
										//get tile from tileset where floor_graphic[0] is y coord and floor_graphic[1] is x coord
										var tileY = ~~((tileset_type_layer[y][x][1][0] * game.floor_graphic_tileset_length.y + floor_graphic.pos[0]) * ts_size);
										//var tileY=(game.floor_graphic_tileset_start.y * game.floor_graphic_tileset_length.y + floor_graphic.pos[0]) * ts_size;
										var tileX = ~~((tileset_type_layer[y][x][1][1] * game.floor_graphic_tileset_length.x + floor_graphic.pos[1]) * ts_size);
										
										//var tileX=(game.floor_graphic_tileset_start.x * game.floor_graphic_tileset_length.x + floor_graphic.pos[1]) * ts_size;
										game.context_wall_and_floor_graphical.drawImage(game.tileset_floor, tileX, tileY, ts_size, ts_size, ~~(draw_display_x*t), ~~(draw_display_y*t), t, t);
										//chance of random ground object drawn (only on {pos:[1,1]}, which is the open area
										if(floor_graphic.pos[1] == 1 && floor_graphic.pos[0] == 1 && random_ground_layer[y][x] == 1)
										{
											game.context_wall_and_floor_graphical.drawImage(game.tileset_random_ground, ~~(4 * ts_size), ~~(0 * ts_size), ts_size, ts_size, ~~(draw_display_x*t), ~~(draw_display_y*t), t, t);
										}
									}
									catch(err){}
								}
								//wall = 1
								if(terrain_type == 1)
								{
									var wall_graphic = game.wall_pit_fence_door_graphic_layer[y][x];
									try{
										//get tile from tileset where wall_graphic[0] is y coord and wall_graphic[1] is x coord
										var tileY = ~~((tileset_type_layer[y][x][0][0] * game.wall_graphic_tileset_length.y + wall_graphic.pos[0]) * ts_size);
										var tileX = ~~((tileset_type_layer[y][x][0][1] * game.wall_graphic_tileset_length.x + wall_graphic.pos[1]) * ts_size);
										game.context_wall_and_floor_graphical.drawImage(game.tileset_wall, tileX, tileY, ts_size, ts_size, ~~(draw_display_x*t), ~~(draw_display_y*t), t, t);
									}
									catch(err){}
								}
								//pit = 2
								if(terrain_type == 2)
								{
									var pit_graphic = game.wall_pit_fence_door_graphic_layer[y][x];
									try{
										//get tile from tileset where pit_graphic[0] is y coord and pit_graphic[1] is x coord
										var tileY = ~~((tileset_type_layer[y][x][2][0] * game.pit_graphic_tileset_length.y + pit_graphic.pos[0]) * ts_size);
										var tileX = ~~((tileset_type_layer[y][x][2][1] * game.pit_graphic_tileset_length.x + pit_graphic.pos[1]) * ts_size);
										game.context_wall_and_floor_graphical.drawImage(game.tileset_pit, tileX, tileY, ts_size, ts_size, ~~(draw_display_x*t), ~~(draw_display_y*t), t, t);
									}
									catch(err){}
								}
								//draw fences overtop of floor //fence = 3
								if(terrain_type == 3)
								{
									var fence_graphic = game.wall_pit_fence_door_graphic_layer[y][x];
									try{
										//get tile from tileset where fence_graphic[0] is y coord and fence_graphic[1] is x coord
										var tileY = ~~((tileset_type_layer[y][x][0][0] * game.wall_graphic_tileset_length.y + fence_graphic.pos[0]) * ts_size);
										var tileX = ~~((tileset_type_layer[y][x][0][1] * game.wall_graphic_tileset_length.x + fence_graphic.pos[1]) * ts_size);
										game.context_wall_and_floor_graphical.drawImage(game.tileset_wall, tileX, tileY, ts_size, ts_size, ~~(draw_display_x*t), ~~(draw_display_y*t), t, t);
									}
									catch(err){}
								}
								//draw doors overtop of floor //door = 4
								if(terrain_type == 4)
								{
									var door_graphic = game.wall_pit_fence_door_graphic_layer[y][x];
									try{
										var tileY = ~~(door_graphic.pos[0] * ts_size);
										var tileX = ~~(door_graphic.pos[1] * ts_size);
										game.context_wall_and_floor_graphical.drawImage(game.tileset_door_closed, tileX, tileY, ts_size, ts_size, ~~(draw_display_x*t), ~~(draw_display_y*t), t, t);
									}
									catch(err){}
								}
							}
						}
						
						if(game.redraw_mouse_region || (game.redraw_object_bg_graphics && game.show_tileset_graphics))
						{
							//not drawing foreground objects on first load up
							
							//object_layer[y][x] == 0 if no objects here
							if(object_layer[y][x] != 0 && game.view_objects)
							{
								//for each object in this location
								for(var i in object_layer[y][x])
								{
									//objectCount++;
									var object = object_layer[y][x][i];
									var tileY = ~~(object.tileset_pos[0]*ts_size);
									var tileX = ~~(object.tileset_pos[1]*ts_size);
									var context_object = game.context_object_bg;
									//place on background of foregrond layer
									/* //for now stacking all objects in background layer
									if(object.layer > 0)
									{
										context_object = game.context_object_fg;
									}
									*/
									//get tileset for this object
									var tileset = game.tileset_object[0];
									var tileset_index = object.tileset_index;
									var layer = object.layer;
									if(tileset_index > 0)
									{
										tileset = game.tileset_object[tileset_index];
									}
									//don't redraw background objects when player moving, unless drawing edge of map that is now visible
									if(
										(
											!game.player_moving_direction() ||
											(game.player_moving_direction() == 'up' && draw_display_y == 0) ||
											(game.player_moving_direction() == 'down' && start_y + draw_display_y == end_y) ||
											(game.player_moving_direction() == 'left' && draw_display_x == 0) ||
											(game.player_moving_direction() == 'right' && start_x + draw_display_x == end_x)
										)
										&& (layer == 0 || layer == 1) || (game.edit && !game.view_only_foreground_objects)) //background layer or see through place on map
									{
										context_object.drawImage(tileset, tileX, tileY, ts_size, ts_size, ~~(draw_display_x*t), ~~(draw_display_y*t), t, t);
									}
									//drawing in foreground
									if(layer != 0)
									{
										if(layer == 1)
										{
											//alpha 0.5
											game.context_object_fg.globalAlpha=0.5; //if midground, place semi-transparent object over any character that happens to be there
										}
										if(layer == 2)
										{
											//alpha 1
											game.context_object_fg.globalAlpha=1; //if foreground, place opaque object overtop of any characters there
										}
										game.context_object_fg.drawImage(tileset, tileX, tileY, ts_size, ts_size, ~~(draw_display_x*t), ~~(draw_display_y*t), t, t);
										//alpha 1
										game.context_object_fg.globalAlpha=1;
									}
								}
							}
							
							//if not using LOS?
							//old//if(game.edit && game.view_facade && facade_layer[y][x] != 0)
							//if(((game.edit && game.view_facade) || !game.area_settings[game.area_id].UseLos) && facade_layer[y][x] != 0)
							//if((game.edit && game.view_facade) || (!game.area_settings[game.area_id].UseLos && facade_layer[y][x] != 0))
							
							//if player under a facade tile, do not draw facade tiles where player can see (LOS)
								//or tiles in squares that are next to a square player can see (do this for nice walls)
							//if player not under facade tile, then draw all the facade tiles
							if(
								(game.edit && game.view_facade) || 
									(!game.edit && facade_layer[y][x] != 0 && 
										(facade_layer[game.characters[game.active_player_index].y][game.characters[game.active_player_index].x] == 0 ||
											(vision_fog_layer[y][x] == 0 &&
												//if square beside a visible square don't draw!
												((y == game.get_area_height() || vision_fog_layer[y+1][x] == 0) &&
													(x == game.get_area_width() || vision_fog_layer[y][x+1] == 0) &&
													(y == 0 || vision_fog_layer[y-1][x] == 0) &&
													(x == 0 || vision_fog_layer[y][x-1] == 0) &&
													(y == game.get_area_height() || x == game.get_area_width() || vision_fog_layer[y+1][x+1] == 0) &&
													(y == game.get_area_height() || x==0 || vision_fog_layer[y+1][x-1] == 0) &&
													(y==0 || x == game.get_area_width() || vision_fog_layer[y-1][x+1] == 0) &&
													(y==0 || x==0 || vision_fog_layer[y-1][x-1] == 0) 
												)
											)
										)
									)
								)
							{
								//for each object in this location
								for(var i in facade_layer[y][x])
								{
									//objectCount++;
									var facade = facade_layer[y][x][i];
									var tileY = ~~(facade.tileset_pos[0]*ts_size);
									var tileX = ~~(facade.tileset_pos[1]*ts_size);
									//get tileset for this object
									var tileset = game.tileset_object[0];
									var tileset_index = facade.tileset_index;
									if(tileset_index > 0)
									{
										tileset = game.tileset_object[tileset_index];
									}
									game.context_facade.drawImage(tileset, tileX, tileY, ts_size, ts_size, ~~(draw_display_x*t), ~~(draw_display_y*t), t, t);
								}
							}
							//---------------
						}
						
						switch(event_layer[y][x])
						{
							//no event (0's)
							case 0:
							break;
							
							//event in square (not 0's)
							default:
								
								if(game.edit && game.view_events)
								{
									game.context_select.fillStyle = 'white';
									var  font_size = 20 * map_scale;
									game.context_select.font = 'bold '+font_size+'px exocetheavy';
									game.context_select.textAlign = 'center';
									//EVENTS "E"
									var event_lable = "E";
									if(game.events[event_layer[y][x]].EventItems.length > 0) event_lable = "Item";
									if(game.events[event_layer[y][x]].ToAreaID > 0)
									{
										event_lable = "E"+event_count;
										/* //this doesnt work, not displaying in right location
										if(game.events[event_layer[y][x]].ToX > 0 && game.events[event_layer[y][x]].ToY > 0)
										{
											var event_move_to_lable = "F"+event_count;
											game.context_select.fillText(event_move_to_lable, game.events[event_layer[y][x]].ToX*t+t*0.5, game.events[event_layer[y][x]].ToY*t+t*0.95);
										}
										*/
									}
									game.context_select.fillText(event_lable, draw_display_x*t+t*0.5, draw_display_y*t+t*0.95);
									event_count++;
								}
								
								if(game.events[event_layer[y][x]].EventItems.length > 0)
								{
									var item_type = game.events[event_layer[y][x]].EventItems[0].ItemType;
									for(var i=0; i<game.items[item_type].length; i++)
									{
										if(game.itemImages[item_type][i] != 0 && game.events[event_layer[y][x]].EventItems[0].ItemID == game.items[item_type][i].ID)
										{
											//display item icon on map
											//if player one step away from item, show with green outline
											if(Math.abs(y-game.characters[game.active_player_index].y) <= 1 && Math.abs(x-game.characters[game.active_player_index].x) <= 1)
											{
												BattleController.outline_sprite([70,255,70,100], game.itemImages[item_type][i], ~~(draw_display_x*t), ~~(draw_display_y*t), game.context_event_object, 2, t * game.scale_sprite, t * game.scale_sprite);
											}
											game.context_event_object.drawImage(game.itemImages[item_type][i], 0, 0, game.itemImages[item_type][i].naturalWidth, game.itemImages[item_type][i].naturalHeight, ~~(draw_display_x*t), ~~(draw_display_y*t), t * game.scale_sprite, t * game.scale_sprite);	
										}
									}
								}
								break;
						}
						
						if(game.view_selected_area || BattleController.show_select_area)
						{
							switch(select_layer[y][x])
							{
								case 0:
								break;
								
								default:
									game.context_select.fillStyle='#ff7';
									game.context_select.globalAlpha=0.5;
									game.context_select.fillRect(draw_display_x*t, draw_display_y*t, t, t);
									game.context_select.globalAlpha=1;
									select_layer[y][x]=0;
								break;
							}
							
							if(game.hightlight_facade_objects)
							{
								if(game.facade_layer[y][x] != 0)
								{
									game.context_select.fillStyle='#ff7';
									game.context_select.globalAlpha=0.5;
									game.context_select.fillRect(draw_display_x*t, draw_display_y*t, t, t);
									game.context_select.globalAlpha=1;
									select_layer[y][x]=0;
								}
							}
						}
						
					}
					//increment display draw grid x position
					draw_display_x++;
				}
			}
			//reset display draw grid x position
			if(game.redraw_mouse_region)
			{
				draw_display_x = game.player_mouse_grid_x-1 < 0 ? 0 : game.player_mouse_grid_x-1;
			}
			else
			{
				draw_display_x = 0;
			}
			//increment display draw grid y position
			draw_display_y++;
		}
	}
	
	if(!game.edit && (game.area_settings[game.area_id].UseLos || game.test_los))
	{
		//vision fog set at start of draw
		//drawing vision fog
		//draw vision fog (only draw on tiles player can see)
		start_y = game.display_start_y();
		start_x = game.display_start_x();
		end_y = Math.ceil(game.characters[game.active_player_index].y+(Math.floor(game.game_screen_num_tiles_height/2))/map_scale);
		end_x = Math.ceil(game.characters[game.active_player_index].x+(Math.floor(game.game_screen_num_tiles_width/2))/map_scale);
		
		draw_display_y = 0;
		draw_display_x = 0;
		game.context_vision_fog.fillStyle='#000';
		for(var y=start_y; y <= end_y; y++)
		{
			if(y >= 0 && y <  game.get_area_height())
			{
				for(var x=start_x; x <= end_x; x++)
				{
					if(x >= 0 && x <  game.get_area_width())
					{
						//game.context_vision_fog.fillStyle='#000';
						//onsole.log(select_layer[y][x]);
						var alphaVal;
						var is_wall = floor_wall_pit_fence_door_layer[y][x] == 1;
						var is_door = floor_wall_pit_fence_door_layer[y][x] == 4;
						
						//if door then don't draw facade
							//if door has a visible tiles in any of 4 directions then don't draw the facade tile on top
						if(!is_door || (vision_fog_layer[y+1][x] == 0 && vision_fog_layer[y-1][x] == 0 && vision_fog_layer[y][x+1] == 0 && vision_fog_layer[y][x-1] == 0))
						{
							//if can't see on this square (vision_fog_layer[y][x] == 0) then draw facade
							// //if player on a facade tile then don't draw facade tiles
							if(
								vision_fog_layer[y][x] == 0 &&
								facade_layer[y][x] != 0 &&
								facade_layer[game.characters[game.active_player_index].y][game.characters[game.active_player_index].x] == 0
							)
							{
								//show this tile because it's a visible facade
								//this not supposed to be here//vision_fog_layer[y][x] == 1;
								//for each object in this location
								for(var i in facade_layer[y][x])
								{
									//objectCount++;
									var facade = facade_layer[y][x][i];
									var tileY = ~~(facade.tileset_pos[0]*ts_size);
									var tileX = ~~(facade.tileset_pos[1]*ts_size);
									//get tileset for this object
									var tileset = game.tileset_object[0];
									var tileset_index = facade.tileset_index;
									if(tileset_index > 0)
									{
										tileset = game.tileset_object[tileset_index];
									}
									//safari?
									try{
									game.context_facade.drawImage(tileset, tileX, tileY, ts_size, ts_size, ~~(draw_display_x*t), ~~(draw_display_y*t), t, t);
									}catch(err){}
								}
								
							}
						}
						
						//onsole.log(game.area_settings[game.area_id].MapMemory, game.vision_layer_remember_map[y][x]);
						alphaVal = 0;
						switch(vision_fog_layer[y][x])
						{
							//alphaVal != 0 will be covered up by alphaVal darkness
							//can't see (vision_fog_layer 0's)
							case 0:
								alphaVal = 1;
								//alphaVal = (facade_layer[y][x] != 0 && facade_layer[game.characters[game.active_player_index].y][game.characters[game.active_player_index].x] != 0) ? 0 : alphaVal;
								//alphaVal = (vision_fog_layer[y][x] > 0 && facade_layer[y][x] != 0 && facade_layer[game.characters[game.active_player_index].y][game.characters[game.active_player_index].x] != 0) ? 0 : alphaVal;
								
								//get coords of nearby tiles
								var yPlus = y <  game.get_area_height()-1 ? y+1 : y;
								var yMinus = y > 0 ? y-1 : y;
								var xPlus = x <  game.get_area_width()-1 ? x+1 : x;
								var xMinus = x > 0 ? x-1 : x;
								
								//special conditions, make tile brighter under these conditions (alpha 0.5)
								//if space is a wall and there is a visible space on a diagonal, let the corner be visible
								if(is_wall && (vision_fog_layer[yPlus][xPlus] || vision_fog_layer[yPlus][xMinus] || vision_fog_layer[yMinus][xPlus] || vision_fog_layer[yMinus][xMinus]))
								{
									//set to see partially
									alphaVal = 0.5;
									//if nearby square is 'see well', set this one to see well also
									alphaVal = vision_fog_layer[yPlus][xPlus] > 1 ? 0 : alphaVal;
									alphaVal = vision_fog_layer[yPlus][xMinus] > 1 ? 0 : alphaVal;
									alphaVal = vision_fog_layer[yMinus][xPlus] > 1 ? 0 : alphaVal;
									alphaVal = vision_fog_layer[yMinus][xMinus] > 1 ? 0 : alphaVal;
								}
								
								//if the space is a wall or door and next to a visible square let wall be visible
								if((is_wall || is_door) && (vision_fog_layer[yPlus][x] || vision_fog_layer[yMinus][x] || vision_fog_layer[y][xPlus] || vision_fog_layer[y][xMinus]))
								{
									alphaVal = 0.5;
									alphaVal = vision_fog_layer[yPlus][x] > 1 ? 0 : alphaVal;
									alphaVal = vision_fog_layer[yMinus][x] > 1 ? 0 : alphaVal;
									alphaVal = vision_fog_layer[y][xPlus] > 1 ? 0 : alphaVal;
									alphaVal = vision_fog_layer[y][xMinus] > 1 ? 0 : alphaVal;
								}
							break;
							
							//can see partially
							//change this to can see well, and let darkness factor do surrounding light
							case 1:
								alphaVal = 0;
								//alphaVal = 0.5;
							break;
							
							//can see well
							case 2:
							default:
								alphaVal = 0;
							break;
						}
						
						//if it's a roof tile and player not under roof tile then show
						if(facade_layer[y][x] != 0 && facade_layer[game.characters[game.active_player_index].y][game.characters[game.active_player_index].x] == 0)
						{
							//game.context_vision_fog.fillStyle='#0f0';
							alphaVal = 0;
						}
						//if(alphaVal)//now drawing shadows in all squares for a diminishing light effect
						//{
							//set diminishing light as squares get further away
							if(darkness < 1)
							{
								var distanceDark = Math.floor(Math.sqrt(Math.pow(Math.abs(x - game.characters[game.active_player_index].x),2) + Math.pow(Math.abs(y - game.characters[game.active_player_index].y),2)));
								if(alphaVal != game.vision_remember_map_alpha) alphaVal = alphaVal + (distanceDark/darkness/8);
								//add a bit of light near character if has a light source
								if(character_light)
								{
									if(Math.sqrt(Math.pow(Math.abs(x-game.characters[game.active_player_index].x),2) + Math.pow(Math.abs(y-game.characters[game.active_player_index].y),2)) <= character_light) alphaVal = alphaVal - 0.2;
								}
								//if dark vision and within 60 feet, allow sight character_darkvision
								if(character_darkvision)
								{
									if(Math.sqrt(Math.pow(Math.abs(x-game.characters[game.active_player_index].x),2) + Math.pow(Math.abs(y-game.characters[game.active_player_index].y),2)) <= 3.5) alphaVal = alphaVal>=1 ? 1 : 0;
								}
							}
							
							//add more darkness!
							if(!character_light && game.area_settings[game.area_id].DarknessFactor < 1)
							{
								alphaVal = alphaVal + 1 - game.area_settings[game.area_id].DarknessFactor;//inverse
							}
							
							//finally, if a remembered tile, always show at minimum rememberdness brightness
							//if on remembered tile (and using map memory), set alphaVal to default remember_alpha
							//so if MapMemory then set alphaVal = 1, 100% darkness, can't see this square
							if(game.vision_remember_map_alpha < alphaVal && game.area_settings[game.area_id].MapMemory && game.vision_layer_remember_map[y][x])
							{
								//game.context_vision_fog.fillStyle='#f00';
								alphaVal = game.vision_remember_map_alpha;	
							}
							
							//maximum darkness 100% dark
							alphaVal = (alphaVal >= 1) ? 1 : alphaVal
							//minimum darkness 0% dark
							alphaVal = (alphaVal < 0) ? 0 : alphaVal
							
							//is player blinded?
							if(EffectController.CheckEffectConditions(game.characters[game.active_player_index].character_stats, 'Blinded')) alphaVal = 1;
			
							game.context_vision_fog.globalAlpha = alphaVal;
							game.context_vision_fog.fillRect(draw_display_x*t, draw_display_y*t, t, t);
						//}
						
						
						//***************
						//add visible tiles on screen to game.vision_layer_remember_map
						if(alphaVal < 1)
						{
							game.vision_layer_remember_map[y][x] = 1;
						}
						////***************
					}
					draw_display_x++;
				}
			}
			draw_display_x = 0;
			draw_display_y++;
		}
	}
	
	//game.functionDrawSpeedTimerNow = Date.now();
	//onsole.log((game.functionDrawSpeedTimerNow-game.functionDrawSpeedTimerThen),'end draw');
	
	if(!game.edit || game.redraw_characters)
	{
		GameController.DrawCharacters();
	}
	
	//if in edit mode then show symbol for map_start_position
	if(game.edit)
	{
		game.context_select.fillStyle = 'black';
		var  font_size = 40 * map_scale;
		game.context_select.font = 'bold '+font_size+'px exocetheavy';
		game.context_select.textAlign = 'center';
		//STARTING POSITION "S"
		game.context_select.fillText("S", Math.floor((game.map_start_x - game.edit_start_x)*t+t*0.5), Math.floor((game.map_start_y - game.edit_start_y)*t+t*0.95));
	}
	
	//copy buffers to display
	if(!game.edit)
	{
		game.buffer_display_context.drawImage(game.canvas, 0, 0, 544, 544);
		game.buffer_display_context.drawImage(game.canvas_wall_and_floor_graphical, 0, 0, 544, 544);
		game.buffer_display_context.drawImage(game.canvas_object_bg, 0, 0, 544, 544);
		game.buffer_display_context.drawImage(game.canvas_event_object, 0, 0, 544, 544);
		game.buffer_display_context.drawImage(game.canvas_select, 0, 0, 544, 544);
		game.buffer_display_context.drawImage(game.canvas_character, 0, 0, 544, 544);
		game.buffer_display_context.drawImage(game.canvas_object_fg, 0, 0, 544, 544);
		game.buffer_display_context.drawImage(game.canvas_facade, 0, 0, 544, 544);
		game.buffer_display_context.drawImage(game.canvas_vision_fog, 0, 0, 544, 544);
		
		//buffer to screen
		game.display_context.drawImage(game.buffer_display_canvas, 0, 0, 544, 544);
		/*
		function grayScale(context, canvas) {
			var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
					var pixels  = imgData.data;
					for (var i = 0, n = pixels.length; i < n; i += 4) {
					var grayscale = pixels[i] * .3 + pixels[i+1] * .59 + pixels[i+2] * .11;
					pixels[i  ] = grayscale;        // red
					pixels[i+1] = grayscale;        // green
					pixels[i+2] = grayscale;        // blue
					//pixels[i+3]              is alpha
			}
			//redraw the image in black & white
			context.putImageData(imgData, 0, 0);
		}
		//add the function call in the imageObj.onload
		imageObj.onload = function(){
				context.drawImage(imageObj, destX, destY);
				grayScale(context, canvas);
		};
		*/
	}
				
	game.redraw_wall_graphics = 0;
	game.redraw_mouse_region = 0;
	game.redraw_object_bg_graphics = 0;
	game.redraw_characters = 0;
	game.view_selected_area = 0;
	
	game.drawing_map = 0;
	//game.functionDrawSpeedTimerNow = Date.now();
	//onsole.log((game.functionDrawSpeedTimerNow-game.functionDrawSpeedTimerThen),'end draw');
	//onsole.log('objectCount',objectCount);

}

GameController.DrawCharacters = function(shift_map_x, shift_map_y)
{
	var game = GameController;
	var t = game.tile_size();
	var shift_char_x, shift_char_y, shift_x_scaled, shift_y_scaled = 0;
	var smooth_move_draw = 0;
	
	if(arguments.length < 2) smooth_move_draw = 0;
	else smooth_move_draw = 1;
	
	var ts_size = ~~(game.tileset_tile_size);
	var use_los = game.area_settings[game.area_id].UseLos;
	var player_blinded = game.edit ? 0 : EffectController.CheckEffectConditions(game.characters[game.active_player_index].character_stats, 'Blinded');
	if(player_blinded) console.log('you can\'t see!');
	
	//clear character_layer
	game.context_character.clearRect(0,0,game.canvas_character.width,game.canvas_character.height);
	var visibe_char_index_arr = [];
	if(!player_blinded)
	{
		for(var i in game.characters)
		{
			//put visible characters indexes in array, ordered by background to foreground
			if(CharacterController.IsPartyMember(game.characters[i]) || game.characters[i].character_stats.area_id == game.area_id)
			{
				if(game.edit || !use_los || game.vision_fog_layer[game.characters[i].y][game.characters[i].x] != 0 && ((Math.abs(game.characters[i].y - game.characters[0].y) <= (Math.floor(game.game_screen_num_tiles_height/2)) && Math.abs(game.characters[i].x - game.characters[0].x) <= (Math.floor(game.game_screen_num_tiles_width/2)))))
				{
					//is this character visible to player (invisible, hiding, etc.)
					insert_index_loop:
					for(var index = 0; index < visibe_char_index_arr.length; index++)
					{
						//if y is higher then current, add as previous element in array //keep PC characters in front of NPCs if on same level //keep the player's PC (active pc) above the other party members
						if(game.characters[i].y < game.characters[visibe_char_index_arr[index]].y || (game.characters[i].y == game.characters[visibe_char_index_arr[index]].y && (!CharacterController.IsPartyMember(game.characters[i]) || visibe_char_index_arr[index] == game.active_player_index)))
						{
							visibe_char_index_arr.splice(index, 0, i);
							break insert_index_loop;
						}
						//if reached last element add to end of array
						else if(index == visibe_char_index_arr.length - 1)
						{
							visibe_char_index_arr.push(i);
							break insert_index_loop;
						}
					}
					//insert the first one into index array of length 0 to get things started
					if(visibe_char_index_arr.length == 0)
					{
						visibe_char_index_arr.push(i);
					}
				}
			}
		}
	}
	
	for(index in visibe_char_index_arr)
	{
		var i = visibe_char_index_arr[index];
		//if not editing && dead don't draw
		//newly created characters in edit mode, once placed on map error from 'EffectController.GetEffectTypeMods' -> 'special_action_data' is undefined
		if(!game.edit && !CharacterController.IsCharacterAlive(game.characters[i].character_stats))
		{
			continue;
		}
		var this_sprite_scale = CharacterController.GetSpriteScale(game.characters[i]);
		game.context_character.save();
		var scale_x = 1;
		if(game.characters[i].facing == 'left') scale_x = -1;
		game.context_character.scale(this_sprite_scale*game.scale_sprite*game.map_scale*scale_x, this_sprite_scale*game.scale_sprite*game.map_scale);
		
		var SpritePxX = CharacterController.SpritePxX(game.characters[i], false, scale_x==-1?1:0) * scale_x;
		var SpritePxY = CharacterController.SpritePxY(game.characters[i]);
		
		//if smooth_move_draw and this character moving, give them an increment of a step in the direction instead of full tile
		if(smooth_move_draw)
		{
			shift_char_x = shift_char_y = 0;
			if(i == game.active_player_index)
			{
				//if player or character moving in same direction as player
				shift_char_x = shift_map_x*-1;
				shift_char_y = shift_map_y*-1;
			}
			else
			{
				//moved left
				if(shift_map_x > 0)
					shift_char_x = - t;//try * inverse of map scale and not 't'
				//right
				else if(shift_map_x < 0)
					shift_char_x = t;
				//up
				if(shift_map_y > 0)
					shift_char_y = -t;
				//down
				else if(shift_map_y < 0)
					shift_char_y = t;
					
				if(game.characters[i].direction != 0)
				{
					if(game.characters[i].direction == 'left')
						shift_char_x += game.smooth_move_distance * game.map_scale;
					else if(game.characters[i].direction == 'right')
						shift_char_x -= game.smooth_move_distance * game.map_scale;
					else if(game.characters[i].direction == 'up')
						shift_char_y += game.smooth_move_distance * game.map_scale;
					else if(game.characters[i].direction == 'down')
						shift_char_y -= game.smooth_move_distance * game.map_scale;
				}
			}
			shift_x_scaled = Math.round(shift_char_x * scale_x * (1/(game.scale_sprite * this_sprite_scale)));
			shift_y_scaled = Math.round(shift_char_y * (1/(game.scale_sprite * this_sprite_scale)));
			SpritePxX += shift_x_scaled;
			SpritePxY += shift_y_scaled;
		}
		
		if(game.characters[i].highlight)
		{
			var colorRGBA = 0;
			//if selecting fellow good guy make it green, if enemy selecting make it red
			if(game.characters[i].character_stats.GoodGuy == 1)
			{
				colorRGBA = [70,255,70,100];
			}
			else
			{
				colorRGBA = [255,70,70,100];
			}
			BattleController.outline_sprite(colorRGBA, CharacterController.GetSprite(game.characters[i]), SpritePxX, SpritePxY, game.context_character);
		}
		
		//polymorph sprite
		game.context_character.drawImage(CharacterController.GetSprite(game.characters[i]), SpritePxX, SpritePxY);
		
		game.context_character.globalAlpha = 1;
		game.context_character.restore();
		
		if(!smooth_move_draw && game.characters[i].character_stats.conversation_id && CharacterController.IsCharacterAlive(game.characters[i].character_stats) && !CharacterController.IsPartyMember(game.characters[i]))
		{
			//if conversation, draw the talk icon by character
			var x = (game.characters[i].x - GameController.display_start_x()) * t;
			var y = (game.characters[i].y - GameController.display_start_y()) * t;
			game.context_object_fg.drawImage(game.tileset_object[0], 256, 0, ts_size, ts_size, x+t, y-t, t, t);
		}
	}
}

GameController.draw_mini_map = function()
{
	var game = GameController;
	var map_shrink = 180;
	var t = map_shrink/game.get_area_height();
	t = game.get_area_width() > game.get_area_height() ? map_shrink/game.get_area_width() : t;
	t = Math.floor(t);
	
	var floor_wall_pit_fence_door_layer = game.floor_wall_pit_fence_door_layer;
	
	for(var y=0; y < game.get_area_height(); y++)
	{
		for(var x=0; x < game.get_area_width(); x++)
		{
			switch(floor_wall_pit_fence_door_layer[y][x])
			{
				//Wall
				case 1:
					game.mini_map_context.fillStyle='#555';
					game.mini_map_context.fillRect(x*t*2,y*t,t*2,t);
				break;
				
				//Pit
				case 2:
					game.mini_map_context.fillStyle='#140c1c';
					game.mini_map_context.fillRect(x*t*2,y*t,t*2,t);
				break;
				
				//fence
				case 3:
					game.mini_map_context.fillStyle='#888';
					game.mini_map_context.fillRect(x*t*2,y*t,t*2,t);
				break;
				
				//Empty place
				default:
					if((x+y)%2==0)
					{
						game.mini_map_context.fillStyle='#d4cff6';
					}
					else
					{
						game.mini_map_context.fillStyle='#c8c2f4';
					}
					game.mini_map_context.fillRect(x*t*2,y*t,t*2,t);
				break;
			}
		}
	}
}

GameController.set_canvas_size = function()
{
	var game = GameController;

	if(game.edit)
	{
		/*
		game.canvas.height = game.get_area_height()*game.tile_size();
		game.canvas.width = game.get_area_width()*game.tile_size();
		game.display_canvas.height = game.canvas.height;
		game.display_canvas.width = game.canvas.width;
		$('#map-editor').css('width',game.canvas.width+'px').css('height',game.canvas.height+'px');
		*/
		//$('#map-editor').css('width','544px').css('height','544px');
		game.canvas_wall_select_current.height = game.tileset_tile_size;
		game.canvas_wall_select_current.width = game.tileset_tile_size;
		game.canvas_pit_select_current.height = game.tileset_tile_size;
		game.canvas_pit_select_current.width = game.tileset_tile_size;
		game.canvas_floor_select_current.height = game.tileset_tile_size;
		game.canvas_floor_select_current.width = game.tileset_tile_size;
	}
	
	game.display_canvas.height = 544;
	game.display_canvas.width = 544;
	
	game.buffer_display_canvas.height = 544;
	game.buffer_display_canvas.width = 544;
	
	game.canvas.height = 544;//game.get_area_height()*game.tile_size();
	game.canvas.width = 544;//game.get_area_width()*game.tile_size();
	
	game.canvas_wall_and_floor_graphical.height=game.canvas.height;
	game.canvas_wall_and_floor_graphical.width=game.canvas.width;

	game.canvas_object_bg.height=game.canvas.height;
	game.canvas_object_bg.width=game.canvas.width;

	game.canvas_event_object.height=game.canvas.height;
	game.canvas_event_object.width=game.canvas.width;

	game.canvas_character.height=game.canvas.height;
	game.canvas_character.width=game.canvas.width;

	game.canvas_object_fg.height=game.canvas.height;
	game.canvas_object_fg.width=game.canvas.width;

	game.canvas_select.height=game.canvas.height;
	game.canvas_select.width=game.canvas.width;

	game.canvas_vision_fog.height=game.canvas.height;
	game.canvas_vision_fog.width=game.canvas.width;
	
	game.canvas_facade.height=game.canvas.height;
	game.canvas_facade.width=game.canvas.width;
}

GameController.calc_wall_and_floor_graphics = function()
{
	var game = GameController;
	
	var level = game.floor_wall_pit_fence_door_layer;
	var graphic_layer = game.wall_pit_fence_door_graphic_layer;
	var floor_graphic_layer = game.floor_graphic_layer;
	var tileset_type_layer = game.tileset_type_layer;
	
	var start_y = 0;
	var start_x = 0;
	var end_y = game.get_area_height() - 1;
	var end_x = game.get_area_width() - 1;
	
	if(game.redraw_mouse_region){
		start_y = (game.edit_start_y + game.player_mouse_grid_y - 1 <= 0)? 0: game.edit_start_y + game.player_mouse_grid_y - 1;
		start_x = (game.edit_start_x + game.player_mouse_grid_x - 1 <= 0)? 0: game.edit_start_x + game.player_mouse_grid_x - 1;
		end_y = (game.edit_start_y + game.player_mouse_grid_y + 1 >= game.get_area_height()-1)? game.get_area_height()-1: game.edit_start_y + game.player_mouse_grid_y + 1;
		end_x = (game.edit_start_x + game.player_mouse_grid_x + 1 >= game.get_area_width()-1)? game.get_area_width()-1: game.edit_start_x + game.player_mouse_grid_x + 1;
	}
	
	for(var y=start_y; y <= end_y; y++)
	{
		for(var x=start_x; x <= end_x; x++)
		{
			var yPlus = y < game.get_area_height() - 1 ? y+1 : y;
			var yMinus = y > 0 ? y - 1 : y;
			var xPlus = x < game.get_area_width() - 1 ? x+1 : x;
			var xMinus = x > 0 ? x - 1 : x;
			
			graphic_layer[y][x] = 0;
			floor_graphic_layer[y][x] = 0;
			
			//calculate wall graphics
			
			if(level[y][x] == 1)
			{
				//single piece //south end
				graphic_layer[y][x] = {pos:[1,1]};
				
				//intersection
				if(x != xMinus && x != xPlus && y != yPlus && y != yMinus && $.inArray(level[yPlus][x], [1,4]) > -1 && $.inArray(level[yMinus][x], [1,4]) > -1 && $.inArray(level[y][xPlus], [1,4]) > -1 && $.inArray(level[y][xMinus], [1,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[1,4]};
				}
				//north east south T
				else if(x != xPlus && y != yMinus && y != yPlus && $.inArray(level[yPlus][x], [1,4]) > -1 && $.inArray(level[yMinus][x], [1,4]) > -1 && $.inArray(level[y][xPlus], [1,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[1,3]};
				}
				//north south west T
				else if(x != xMinus && y != yMinus && y != yPlus && $.inArray(level[yPlus][x], [1,4]) > -1 && $.inArray(level[yMinus][x], [1,4]) > -1 && $.inArray(level[y][xMinus], [1,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[1,5]};
				}
				//east south west T
				else if(x != xMinus && x != xPlus && y != yPlus && $.inArray(level[yPlus][x], [1,4]) > -1 && $.inArray(level[y][xPlus], [1,4]) > -1 && $.inArray(level[y][xMinus], [1,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[0,4]};
				}
				//north east west T
				else if(x != xMinus && x != xPlus && y != yMinus && $.inArray(level[yMinus][x], [1,4]) > -1 && $.inArray(level[y][xPlus], [1,4]) > -1 && $.inArray(level[y][xMinus], [1,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[2,4]};
				}
				//north west corner
				else if(x != xPlus && y != yPlus && $.inArray(level[y][xPlus], [1,4]) > -1 && $.inArray(level[yPlus][x], [1,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[0,0]};
				}
				//north east corner
				else if(x != xMinus && y != yPlus && $.inArray(level[yPlus][x], [1,4]) > -1 && $.inArray(level[y][xMinus], [1,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[0,2]};
				}
				//south west corner
				else if(x != xPlus && y != yMinus && $.inArray(level[yMinus][x], [1,4]) > -1 && $.inArray(level[y][xPlus], [1,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[2,0]};
				}
				//south east corner
				else if(x != xMinus && y != yMinus && $.inArray(level[yMinus][x], [1,4]) > -1 && $.inArray(level[y][xMinus], [1,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[2,2]};
				}
				//solid horiz. //east end //west end
				else if($.inArray(level[y][xPlus], [1,4]) > -1 && $.inArray(level[y][xMinus], [1,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[0,1]};
				}
				//solid vert
				else if($.inArray(level[yPlus][x], [1,4]) > -1 && $.inArray(level[yMinus][x], [1,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[1,0]};
				}
				//north end
				else if(y != yPlus && $.inArray(level[yPlus][x], [1,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[1,0]};
				}
				//east end
				else if(x != xMinus && $.inArray(level[y][xPlus], [1,4]) < 0 && $.inArray(level[y][xMinus], [1,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[0,1]};
				}
				//west end
				else if(x != xPlus && $.inArray(level[y][xPlus], [1,4]) > -1 && $.inArray(level[y][xMinus], [1,4]) < 0)
				{
					graphic_layer[y][x] = {pos:[0,1]};
				}
				
			}
			
			//calculate fence graphics (same as walls)
			
			//single piece //south end
			if(level[y][x] == 3)
			{
				//doesnt exist for fence -> //graphic_layer[y][x] = {pos:[1,1]};
				graphic_layer[y][x] = {pos:[0,1]};
				
				//intersection
				if(x != xMinus && x != xPlus && y != yPlus && y != yMinus && $.inArray(level[y][x], [3,4]) > -1 && $.inArray(level[yPlus][x], [3,4]) > -1 && $.inArray(level[yMinus][x], [3,4]) > -1 && $.inArray(level[y][xPlus], [3,4]) > -1 && $.inArray(level[y][xMinus], [3,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[1,4]};
				}
				//north east south T
				else if(x != xPlus && y != yMinus && y != yPlus && $.inArray(level[y][x], [3,4]) > -1 && $.inArray(level[yPlus][x], [3,4]) > -1 && $.inArray(level[yMinus][x], [3,4]) > -1 && $.inArray(level[y][xPlus], [3,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[1,3]};
				}
				//north south west T
				else if(x != xMinus && y != yMinus && y != yPlus && $.inArray(level[y][x], [3,4]) > -1 && $.inArray(level[yPlus][x], [3,4]) > -1 && $.inArray(level[yMinus][x], [3,4]) > -1 && $.inArray(level[y][xMinus], [3,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[1,5]};
				}
				//east south west T
				else if(x != xMinus && x != xPlus && y != yPlus && $.inArray(level[y][x], [3,4]) > -1 && $.inArray(level[yPlus][x], [3,4]) > -1 && $.inArray(level[y][xPlus], [3,4]) > -1 && $.inArray(level[y][xMinus], [3,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[0,4]};
				}
				//north east west T
				else if(x != xMinus && x != xPlus && y != yMinus && $.inArray(level[y][x], [3,4]) > -1 && $.inArray(level[yMinus][x], [3,4]) > -1 && $.inArray(level[y][xPlus], [3,4]) > -1 && $.inArray(level[y][xMinus], [3,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[2,4]};
				}
				//north west corner
				else if(x != xPlus && y != yPlus && $.inArray(level[y][x], [3,4]) > -1 && $.inArray(level[y][xPlus], [3,4]) > -1 && $.inArray(level[yPlus][x], [3,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[0,0]};
				}
				//north east corner
				else if(x != xMinus && y != yPlus && $.inArray(level[y][x], [3,4]) > -1 && $.inArray(level[yPlus][x], [3,4]) > -1 && $.inArray(level[y][xMinus], [3,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[0,2]};
				}
				//south west corner
				else if(x != xPlus && y != yMinus && $.inArray(level[y][x], [3,4]) > -1 && $.inArray(level[yMinus][x], [3,4]) > -1 && $.inArray(level[y][xPlus], [3,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[2,0]};
				}
				//south east corner
				else if(x != xMinus && y != yMinus && $.inArray(level[y][x], [3,4]) > -1 && $.inArray(level[yMinus][x], [3,4]) > -1 && $.inArray(level[y][xMinus], [3,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[2,2]};
				}
				//solid horiz. //east end //west end
				else if($.inArray(level[y][x], [3,4]) > -1 && $.inArray(level[y][xPlus], [3,4]) > -1 && $.inArray(level[y][xMinus], [3,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[0,1]};
				}
				//solid vert
				else if($.inArray(level[y][x], [3,4]) > -1 && $.inArray(level[yPlus][x], [3,4]) > -1 && $.inArray(level[yMinus][x], [3,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[1,0]};
				}
				//north end
				else if(y != yPlus && $.inArray(level[y][x], [3,4]) > -1 && $.inArray(level[yPlus][x], [3,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[1,0]};
				}
				//south end
				else if(y != yMinus && $.inArray(level[y][x], [3,4]) > -1 && $.inArray(level[yMinus][x], [3,4]) > -1)
				{
					graphic_layer[y][x] = {pos:[1,0]};
				}
				
			}
			
			
			//calculate floor graphics
			function IsWallFenceDoorOrNotMatchingFloorType(checkY, checkX, y, x)
			{
				var result = -1;
				result = $.inArray(level[checkY][checkX], [0,3,4]);
				//if floorType of checkY,checkX is not same as floorType y,x, return -1
				//this separates all the different floor types with the floor tiles that have the border
				if(tileset_type_layer[checkY][checkX][1][0] != tileset_type_layer[y][x][1][0] || tileset_type_layer[checkY][checkX][1][1] != tileset_type_layer[y][x][1][1])
				{
					result = -1;
				}
				//some floor types belong inside other floor types (have matching borders)
				for(var i=5; i<9; i++)
				{
					if(
						(tileset_type_layer[y][x][1][0] == i && tileset_type_layer[y][x][1][1] == 0)
						&& 
						(
							(tileset_type_layer[checkY][checkX][1][0] == i-4 && tileset_type_layer[checkY][checkX][1][1] == 1)
							|| (tileset_type_layer[checkY][checkX][1][0] == i-4 && tileset_type_layer[checkY][checkX][1][1] == 2)
							|| (tileset_type_layer[checkY][checkX][1][0] == i && tileset_type_layer[checkY][checkX][1][1] == 2)
							|| (tileset_type_layer[checkY][checkX][1][0] == i+4 && tileset_type_layer[checkY][checkX][1][1] == 0)
						)
						)
					{
						result = 1;
					}
				}
				return result;
			}
			
			//calculate if floor fence or door (shows ground tile underneath fence and doors)
			if($.inArray(level[y][x], [0,3,4]) > -1)
			{
				//single floor tile no neighbours
				floor_graphic_layer[y][x] = {pos:[0,5]};
				
				//intersection
				//if(level[y][x] == 0 && level[yPlus][x] == 0 && level[yMinus][x] == 0 && level[y][xPlus] == 0 && level[y][xMinus] == 0)
				//if($.inArray(level[yPlus][x], [0,3]) > -1 && $.inArray(level[yMinus][x], [0,3]) > -1 && $.inArray(level[y][xPlus], [0,3]) > -1 && $.inArray(level[y][xMinus], [0,3]) > -1)
				if(IsWallFenceDoorOrNotMatchingFloorType(yPlus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(yMinus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xPlus, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xMinus, y,x) > -1)
				{
					floor_graphic_layer[y][x] = {pos:[1,1]};
				}
				//north east west T
				//else if(y != yMinus && $.inArray(level[yPlus][x], [0,3]) < 0 && $.inArray(level[yMinus][x], [0,3]) > -1 && $.inArray(level[y][xPlus], [0,3]) > -1 && $.inArray(level[y][xMinus], [0,3]) > -1)
				else if(y != yMinus && IsWallFenceDoorOrNotMatchingFloorType(yPlus,x, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(yMinus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xPlus, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xMinus, y,x) > -1)
				{
					floor_graphic_layer[y][x] = {pos:[2,1]};
				}
				//north east south T
				//else if(x != xPlus && $.inArray(level[yPlus][x], [0,3]) > -1 && $.inArray(level[yMinus][x], [0,3]) > -1 && $.inArray(level[y][xPlus], [0,3]) > -1 && $.inArray(level[y][xMinus], [0,3]) < 0)
				else if(x != xPlus && IsWallFenceDoorOrNotMatchingFloorType(yPlus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(yMinus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xPlus, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xMinus, y,x) < 0)
				{
					floor_graphic_layer[y][x] = {pos:[1,0]};
				}
				//north south west T
				//else if(x != xMinus && $.inArray(level[yPlus][x], [0,3]) > -1 && $.inArray(level[yMinus][x], [0,3]) > -1 && $.inArray(level[y][xPlus], [0,3]) < 0 && $.inArray(level[y][xMinus], [0,3]) > -1)
				else if(x != xMinus && IsWallFenceDoorOrNotMatchingFloorType(yPlus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(yMinus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xPlus, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(y,xMinus, y,x) > -1)
				{
					floor_graphic_layer[y][x] = {pos:[1,2]};
				}
				//east south west T
				//else if(y != yPlus && $.inArray(level[yPlus][x], [0,3]) > -1 && $.inArray(level[yMinus][x], [0,3]) < 0 && $.inArray(level[y][xPlus], [0,3]) > -1 && $.inArray(level[y][xMinus], [0,3]) > -1)
				else if(y != yPlus && IsWallFenceDoorOrNotMatchingFloorType(yPlus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(yMinus,x, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(y,xPlus, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xMinus, y,x) > -1)
				{
					floor_graphic_layer[y][x] = {pos:[0,1]};
				}
				//north west corner
				//else if(y != yPlus && x != xMinus && $.inArray(level[yPlus][x], [0,3]) > -1 && $.inArray(level[yMinus][x], [0,3]) < 0 && $.inArray(level[y][xPlus], [0,3]) > -1 && $.inArray(level[y][xMinus], [0,3]) < 0)
				else if(y != yPlus && x != xMinus && IsWallFenceDoorOrNotMatchingFloorType(yPlus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(yMinus,x, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(y,xPlus, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xMinus, y,x) < 0)
				{
					floor_graphic_layer[y][x] = {pos:[0,0]};
				}
				//north east corner
				//else if(y != yPlus && x != xPlus && $.inArray(level[yPlus][x], [0,3]) > -1 && $.inArray(level[yMinus][x], [0,3]) < 0 && $.inArray(level[y][xPlus], [0,3]) < 0 && $.inArray(level[y][xMinus], [0,3]) > -1)
				else if(y != yPlus && x != xPlus && IsWallFenceDoorOrNotMatchingFloorType(yPlus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(yMinus,x, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(y,xPlus, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(y,xMinus, y,x) > -1)
				{
					floor_graphic_layer[y][x] = {pos:[0,2]};
				}
				//south west corner
				//else if(y != yMinus && x != xMinus && $.inArray(level[yPlus][x], [0,3]) < 0 && $.inArray(level[yMinus][x], [0,3]) > -1 && $.inArray(level[y][xPlus], [0,3]) > -1 && $.inArray(level[y][xMinus], [0,3]) < 0)
				else if(y != yMinus && x != xMinus && IsWallFenceDoorOrNotMatchingFloorType(yPlus,x, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(yMinus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xPlus, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xMinus, y,x) < 0)
				{
					floor_graphic_layer[y][x] = {pos:[2,0]};
				}
				//south east corner
				//else if(y != yMinus && x != xPlus && $.inArray(level[yPlus][x], [0,3]) < 0 && $.inArray(level[yMinus][x], [0,3]) > -1 && $.inArray(level[y][xPlus], [0,3]) < 0 && $.inArray(level[y][xMinus], [0,3]) > -1)
				else if(y != yMinus && x != xPlus && IsWallFenceDoorOrNotMatchingFloorType(yPlus,x, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(yMinus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xPlus, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(y,xMinus, y,x) > -1)
				{
					floor_graphic_layer[y][x] = {pos:[2,2]};
				}
				//north end
				//else if(y != yPlus && $.inArray(level[yPlus][x], [0,3]) > -1 && $.inArray(level[yMinus][x], [0,3]) < 0 && $.inArray(level[y][xPlus], [0,3]) < 0 && $.inArray(level[y][xMinus], [0,3]) < 0)
				else if(y != yPlus && IsWallFenceDoorOrNotMatchingFloorType(yPlus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(yMinus,x, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(y,xPlus, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(y,xMinus, y,x) < 0)
				{
					floor_graphic_layer[y][x] = {pos:[0,3]};
				}
				//south end
				//else if(y != yMinus && $.inArray(level[yPlus][x], [0,3]) < 0 && $.inArray(level[yMinus][x], [0,3]) > -1 && $.inArray(level[y][xPlus], [0,3]) < 0 && $.inArray(level[y][xMinus], [0,3]) < 0)
				else if(y != yMinus && IsWallFenceDoorOrNotMatchingFloorType(yPlus,x, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(yMinus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xPlus, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(y,xMinus, y,x) < 0)
				{
					floor_graphic_layer[y][x] = {pos:[2,3]};
				}
				//east end
				//else if(x != xPlus && $.inArray(level[yPlus][x], [0,3]) < 0 && $.inArray(level[yMinus][x], [0,3]) < 0 && $.inArray(level[y][xPlus], [0,3]) < 0 && $.inArray(level[y][xMinus], [0,3]) > -1)
				else if(x != xPlus && IsWallFenceDoorOrNotMatchingFloorType(yPlus,x, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(yMinus,x, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(y,xPlus, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(y,xMinus, y,x) > -1)
				{
					floor_graphic_layer[y][x] = {pos:[1,6]};
				}
				//west end
				//else if(x != xMinus && $.inArray(level[yPlus][x], [0,3]) < 0 && $.inArray(level[yMinus][x], [0,3]) < 0 && $.inArray(level[y][xPlus], [0,3]) > -1 && $.inArray(level[y][xMinus], [0,3]) < 0)
				else if(x != xMinus && IsWallFenceDoorOrNotMatchingFloorType(yPlus,x, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(yMinus,x, y,x) < 0 && IsWallFenceDoorOrNotMatchingFloorType(y,xPlus, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xMinus, y,x) < 0)
				{
					floor_graphic_layer[y][x] = {pos:[1,4]};
				}
				//solid horiz.
				//else if($.inArray(level[y][xPlus], [0,3]) > -1 && $.inArray(level[y][xMinus], [0,3]) > -1)
				else if(IsWallFenceDoorOrNotMatchingFloorType(y,xPlus, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(y,xMinus, y,x) > -1)
				{
					floor_graphic_layer[y][x] = {pos:[1,5]};
				}
				//solid vert
				//else if($.inArray(level[yPlus][x], [0,3]) > -1 && $.inArray(level[yMinus][x], [0,3]) > -1)
				else if(IsWallFenceDoorOrNotMatchingFloorType(yPlus,x, y,x) > -1 && IsWallFenceDoorOrNotMatchingFloorType(yMinus,x, y,x) > -1)
				{
					floor_graphic_layer[y][x] = {pos:[1,3]};
				}
				
			}
			
			//calculate pits
			if(level[y][x] == 2)
			{
				//area surrounded by pits on north east west, and NE and NW corners
				if(level[yMinus][x] == 2 && level[y][xPlus] == 2 && level[y][xMinus] == 2 && level[yMinus][xPlus] == 2 && level[yMinus][xMinus] == 2)
				{
					graphic_layer[y][x] = {pos:[1,1]};
				}
				//north east west T
				else if(level[yMinus][x] == 2 && level[y][xMinus] == 2 && level[y][xPlus] == 2 && level[yMinus][xMinus] != 2 && level[yMinus][xPlus] != 2)
				{
					graphic_layer[y][x] = {pos:[0,6]};
				}
				//north south west T
				else if(level[yMinus][x] == 2 && level[y][xMinus] == 2 && level[y][xPlus] != 2 && level[yMinus][xMinus] != 2)
				{
					graphic_layer[y][x] = {pos:[1,5]};
				}
				//north south west T
				else if(level[yMinus][x] == 2 && level[y][xPlus] == 2 && level[y][xMinus] != 2 && level[yMinus][xPlus] != 2)
				{
					graphic_layer[y][x] = {pos:[1,6]};
				}
				//right corner
				else if(level[yMinus][x] == 2 && level[y][xPlus] == 2 && level[y][xMinus] == 2 && level[yMinus][xPlus] != 2)
				{
					graphic_layer[y][x] = {pos:[0,7]};
				}
				//left corner
				else if(level[yMinus][x] == 2 && level[y][xPlus] == 2 && level[y][xMinus] == 2 && level[yMinus][xMinus] != 2)
				{
					graphic_layer[y][x] = {pos:[0,5]};
				}
				//right top
				else if(level[yMinus][x] != 2 && level[y][xPlus] != 2 && level[y][xMinus] == 2)
				{
					graphic_layer[y][x] = {pos:[0,2]};
				}
				//left top
				else if(level[yMinus][x] != 2 && level[y][xPlus] == 2 && level[y][xMinus] != 2)
				{
					graphic_layer[y][x] = {pos:[0,0]};
				}
				//sides
				else if(level[yMinus][x] == 2 && level[y][xPlus] != 2 && level[y][xMinus] != 2)
				{
					graphic_layer[y][x] = {pos:[1,4]};
				}
				//top no sides
				else if(level[yMinus][x] != 2 && level[y][xPlus] != 2 && level[y][xMinus] != 2)
				{
					graphic_layer[y][x] = {pos:[0,4]};
				}
				//left
				else if(level[y][xPlus] == 2 && level[y][xMinus] != 2)
				{
					graphic_layer[y][x] = {pos:[1,0]};
				}
				//right
				else if(level[y][xMinus] == 2 && level[y][xPlus] != 2)
				{
					graphic_layer[y][x] = {pos:[1,2]};
				}
				//top
				else if(level[yMinus][x] != 2)
				{
					graphic_layer[y][x] = {pos:[0,1]};
				}
				
			}
			
			//calculate doors
			if(level[y][x] == 4)
			{
				//fence
				if(game.tileset_type_layer[y][x][0][0] == 0)
				{
					//horizontal
					graphic_layer[y][x] = {pos:[2,2]};
					//vertical
					if($.inArray(level[yPlus][x], [1,3,4]) > -1 || $.inArray(level[yMinus][x], [1,3,4]) > -1)
					{
						graphic_layer[y][x] = {pos:[2,3]};
					}
				}
				//solid wall
				else
				{
					//horizontal
					graphic_layer[y][x] = {pos:[0,0]};
					//vertical
					if($.inArray(level[yPlus][x], [1,3,4]) > -1 || $.inArray(level[yMinus][x], [1,3,4]) > -1)
					{
						graphic_layer[y][x] = {pos:[0,1]};
					}
				}
				
				
			}
			
		}
	}
}
