
//character creation
var CharacterAiController = CharacterAiController || {};

CharacterAiController.move_npc_monster = function()
{
	var game=GameController;
	//onsole.log('start move monst');
	//game.functionSpeedTimerThen = Date.now();
	var player_character = game.characters[game.active_player_index];
	var characters = game.characters;
	for(var monster_index = 0; monster_index < characters.length; monster_index++)
	{
		if(game.characters[monster_index].character_stats.area_id != game.area_id || !CharacterController.IsCharacterAlive(game.characters[monster_index].character_stats))
		{
			continue;
		}
		
		game.character_layer[characters[monster_index].y][characters[monster_index].x] = {'character_id':characters[monster_index].character_stats.character_id, 'character_index':monster_index};
		
		//if not PC, computer controlled
		if(!CharacterController.IsPartyMember(characters[monster_index]))
		{
			var monster = characters[monster_index];
			monster.direction = 0;
			//if monster is already in battle with players, don't move or it will add to battle
			if(!monster.in_encounter)
			{
				var targetY = targetX = -1;
				//if npc
				if(monster.character_stats.GoodGuy == true)
				{
					//move in a random direction
				}
				//if monster
				else
				{
					//monster has nowhere to go so far
					targetY = targetX = -1;
					//can monster see player
					if(game.check_los(4, 6, monster.y, monster.x, player_character.y, player_character.x))
					{
						var visionCheck = CharacterController.CanCharacterSenseCharacter(monster.character_stats, player_character.character_stats);
						if(visionCheck)
						{
							targetY = monster.move_destination_y = player_character.y;
							targetX = monster.move_destination_x = player_character.x;
						}
					}
					//if cant see player, but has seen them before, move towards last place characters were spotted
					else
					{
						targetY = monster.move_destination_y;
						targetX = monster.move_destination_x;
					}
				}
				//if monster has a destination try to move there
				if(targetY != -1 && targetX != -1)
				{
					//set max distance (cost) for movement before algorithm gives up (to save processing time)
					var currentCost = 0;
					var maxCost = 20;
					//initialize movement cost analysis arrays
					var empty_layer = game.empty_layer;
					var open_grid = game.open_grid;
					var closed_grid = game.closed_grid;
					var cost_grid = game.cost_grid;
					var parent_grid = game.parent_grid;
					/*//don't change length of arrays
					open_grid.length = 0;
					closed_grid.length = 0;
					cost_grid.length = 0;
					parent_grid.length = 0;
					
					for(var i = 0; i < empty_layer.length; i++)
					{
						open_grid[i] = empty_layer[0].slice();
						closed_grid[i] = empty_layer[0].slice();
						parent_grid[i] = empty_layer[0].slice();
						cost_grid[i] = empty_layer[0].slice();
					}
					*/
					for(var y = 0; y < game.get_area_height(); y++)
					{
						for(var x = 0; x < game.get_area_width(); x++)
						{
							open_grid[y][x] = 0;
							closed_grid[y][x] = 0;
							parent_grid[y][x] = 0;
							cost_grid[y][x] = 0;
						}
					}
					
					//move monster towards player
					var open_grid_count = 2,
					checkY = monster.y,
					checkX = monster.x;
					
					function find_next_open()
					{
						//simply locate the next grid location to check its neighbours 
						var found = false;
						var next_open_y, next_open_x,check_count=0;
						for(var countY=0,height=game.get_area_height(); countY<height; countY++)
						{
							for(var countX=0,width=game.get_area_width(); countX<width; countX++)
							{
								if(closed_grid[countY][countX] == 0 && open_grid[countY][countX] > 0 && (open_grid[countY][countX] < check_count || check_count == 0))
								{
									check_count = open_grid[countY][countX];
									next_open_y = countY;
									next_open_x = countX;
									found = true;
								}
							}
						}
						if(!found) return false;
						return [next_open_y,next_open_x];
					}
					
					function check_square(from_y,from_x,check_y,check_x)
					{
						//checking this square for: valid place to move and distance from start
						
						//if not open terrain close //might be able to move through doors
						if(game.floor_wall_pit_fence_door_layer[check_y][check_x] != 0 && game.floor_wall_pit_fence_door_layer[check_y][check_x] != 4)
						{
							closed_grid[check_y][check_x] = 1;
						}
						//if not closed set parent and cost
						if(!closed_grid[check_y][check_x])
						{
							parent_grid[check_y][check_x] = [from_y,from_x];
							currentCost = cost_grid[check_y][check_x] = cost_grid[from_y][from_x]+1;
							open_grid[check_y][check_x] = open_grid_count++;
						}
						//if player party found //might be able to move through doors
						if((game.floor_wall_pit_fence_door_layer[check_y][check_x] == 0 || game.floor_wall_pit_fence_door_layer[check_y][check_x] == 4) && check_y == targetY && check_x == targetX)
						{
							return true;
						}
						return false;
					}
					
					//start with squares around monster position
					open_grid[checkY][checkX] = open_grid_count++;
					
					var pathFound = 0;
					plot_route_loop:
					while(!pathFound)
					{
						//check find_next_open() neighbours to add to open 
							//escape loop if checking squares to far away
						var next_open = find_next_open();
						if(!next_open || currentCost > maxCost)
						{
							//path hasn't been found, no more open spaces to check//pathFound=1;
							break plot_route_loop;
						}
						//next_open[0] = y, next_open[1] = x	
						var next_open_y = next_open[0];
						var next_open_x = next_open[1];
						//set to closed
						closed_grid[next_open_y][next_open_x] = 1;
						//add neighbours to open that are open terrain spaces, and not on closed grid (and not off the map)
						var yPlus = next_open_y < game.get_area_height()-1 ? next_open_y+1 : next_open_y;
						var yMinus = next_open_y > 0 ? next_open_y-1 : next_open_y;
						var xPlus = next_open_x < game.get_area_width()-1 ? next_open_x+1 : next_open_x;
						var xMinus = next_open_x > 0 ? next_open_x-1 : next_open_x;
						if(next_open_x != xMinus)
							if(check_square(next_open_y,next_open_x,next_open_y,xMinus)) pathFound=1;
						if(next_open_x != xPlus)
							if(check_square(next_open_y,next_open_x,next_open_y,xPlus)) pathFound=1;
						if(next_open_y != yMinus)
							if(check_square(next_open_y,next_open_x,yMinus,next_open_x)) pathFound=1;
						if(next_open_y != yPlus)
							if(check_square(next_open_y,next_open_x,yPlus,next_open_x)) pathFound=1;
					}
					
					//if pathFound, select route that goes to player
					if(pathFound)
					{
						//start at player square and work up through parents until find square one away from monster
						var move_monster_to_y = targetY;
						var move_monster_to_x = targetX;
						while(cost_grid[move_monster_to_y][move_monster_to_x] > 1)
						{
							var parent_coord = parent_grid[move_monster_to_y][move_monster_to_x];
							move_monster_to_y = parent_coord[0];
							move_monster_to_x = parent_coord[1];
						}
						//set movement direction and facing
						if(monster.x > move_monster_to_x)//left
						{
							monster.direction = 'left';
							monster.facing = 'left';
						}
						if(monster.x < move_monster_to_x)//right
						{
							monster.direction = 'right';
							monster.facing = 'right';
						}
						if(monster.y > move_monster_to_y)//left
						{
							monster.direction = 'up';
						}
						if(monster.y < move_monster_to_y)//right
						{
							monster.direction = 'down';
						}
						
						//move
						game.character_layer[monster.y][monster.x] = 0;
						monster.y = move_monster_to_y;
						monster.x = move_monster_to_x;
						game.character_layer[monster.y][monster.x] = {'character_id':monster.character_stats.character_id, 'character_index':monster_index};
						
						
						//if is a monster
						if(monster.character_stats.GoodGuy == 0)
						{
							//if monster is close to player, start a battle or add characters to battle
							if(Math.abs(monster.y - player_character.y) < 3 && Math.abs(monster.x - player_character.x) < 3)
							{
								monster.move_destination_y  = -1;
								monster.move_destination_x  = -1;
								//if already in a battle add this monster to it
								if(game.in_encounter)
								{
									BattleController.add_character_to_encounter(monster, false, monster_index);
								}
								else
								{
									//else start a new battle with this monster as the first to join
									BattleController.start_battle(monster_index);
								}
							}
						}
					}
					//game.select_layer = cost_grid;
				}
				
			}
		}//end if not PC
	}
	//game.functionSpeedTimerNow = Date.now();
	//onsole.log((game.functionSpeedTimerNow-game.functionSpeedTimerThen),'end move monst');
}

//special AI battle
CharacterAiController.strahd = {};
//***
CharacterAiController.vampire = CharacterAiController.strahd;
//***

//coding for custom AI
CharacterAiController.GetAiAction = function(character_index)
{
	var attack_action_index = -1;
	CharacterAiController.character = GameController.characters[character_index];//-----------------
	var aiIndex = CharacterAiController.character.character_stats.character_name.toLowerCase();
	if(typeof CharacterAiController[aiIndex] != 'undefined')
	{
		//special find target//i.e. agro, or focusing on one target
		//battle.highlight_character_selected_index == ?;
		
		//special actions
		var random = Math.random()*(9);//0-9
		//if hp is low escape
		if(random < 5 && CharacterAiController.GetActionIndex('Summon Wolves') > -1)//special action
		{
			attack_action_index = CharacterAiController.GetActionIndex('Summon Wolves');
		}
		else//do a regular attack
		{
			attack_action_index = -1;//regular attack handled in base AI code in battle controller
		}
	}
	return attack_action_index;
}

CharacterAiController.ai_action = function()
{
	var GoodGuy_target = 0;
	var attack_action_index = 0;
	
	//find a target
	//get random number: 1 to number of GoodGuy characters
	var num_GoodGuy = 0;
	for(var i in GameController.characters)
	{
		var character = GameController.characters[i];
		if(character.character_stats.GoodGuy && character.in_encounter) num_GoodGuy++;
	}
	GoodGuy_target = Math.floor(Math.random()*num_GoodGuy+1);
	var GoodGuy_count = 1;
	//the GoodGuys are always listed first in the character_stats array, but might as well be certain that enemy is selecting a PC
	for(var i in GameController.characters)
	{
		var character = GameController.characters[i];
		if(character.character_stats.GoodGuy && character.in_encounter)
		{
			if(GoodGuy_count == GoodGuy_target) BattleController.highlight_character_selected_index = i;
			GoodGuy_count++;
		}
	}
	//if has been ai programmed
	attack_action_index = CharacterAiController.GetAiAction(BattleController.current_character_stats_index);
	//if no programming or attack_action_index set to -1 to do a regular attack
	if(attack_action_index == -1)
	{
		attack_action_index = CharacterAiController.get_highest_attack_action_index();
		ActionController.process_battle_action('attack', attack_action_index, 0, BattleController.current_character_stats_index);
	}
	else//attack_action_index set to a special attack index
	{
		ActionController.process_battle_action('special', attack_action_index, 0, BattleController.current_character_stats_index);
	}
}

CharacterAiController.get_highest_attack_action_index = function()
{
	//find characters strongest attack
	var attack_roll_arr = GameController.characters[BattleController.current_character_stats_index].character_stats.arr_attack_bonus;
	var strong_attack_index = 0;
	for(var check_attack_index=0; check_attack_index < attack_roll_arr.length; check_attack_index++)
	{
		if(parseInt(attack_roll_arr[check_attack_index][0]) > parseInt(attack_roll_arr[strong_attack_index][0]))
		{
			strong_attack_index = check_attack_index;
		}
	}
	return strong_attack_index;
}

CharacterAiController.GetActionIndex = function(ability_name)
{
	var action_index = -1;
	var special_action_data = CharacterAiController.character.character_stats.action_data['special_action_data'];
	search_action_loop:
	for(var i=0; i<special_action_data.length; i++)
	{
		if(special_action_data[i].name.toLowerCase() == ability_name.toLowerCase() && special_action_data[i].effects != 0)
		{
			action_index = i;
			break search_action_loop;
		}
	}
	return action_index;
}