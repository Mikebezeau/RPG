
//var MenuController = MenuController || {};

MenuController.CreateBattleMenu = function()
{
	//if not loaded return
	if(GameController.characters[BattleController.current_character_stats_index].character_stats.menu_data.battle_menu < 1) alert('menu fail');
	
	var rowSize = mobile? 6 : 9;
	var menu_items_array = GameController.characters[BattleController.current_character_stats_index].character_stats.menu_data.battle_menu;
	
	MenuController.currentMenuItem = 0;
	MenuController.menuBackList.length = 0;
	
	//clear secondary menu
	$("#load-abilities").html('');
	//make sure list sub-menu is hidden
	$("#battle-menu-list-container").hide();
	$("#battle-menu-list").html('');
	//list menu item icons in row
	$("#load-buttons").html('');
	var iconCount = 0;
	for(i in menu_items_array)
	{
		var subMenuHasVisible = false;
		//attacks might not have effects, show anyways - always show defend and move
		if(menu_items_array[i].description == 'Attack' || menu_items_array[i].description == 'Defend' || menu_items_array[i].description == 'Move' || menu_items_array[i].description == 'Equip')
		{
			subMenuHasVisible = true;
		}
		else
		{
			for(j in menu_items_array[i].subMenuArray)
			{
				if(menu_items_array[i].subMenuArray[j].action_data.effect != 0)
				{
					subMenuHasVisible = true;
				}
			}
		}
		if(subMenuHasVisible || GameController.dev_mode)
		{
			clickEvent = "onclick='MenuController.SelectMainItem("+i+","+menu_items_array[i].isSecondaryMenu+");'";
			if(menu_items_array[i].menuItemAction != 0)
			{
				clickEvent = "onclick='"+menu_items_array[i].menuItemAction+"'";
			}
			$("#load-buttons").append(menu_items_array[i].CreateRowIcon(clickEvent, false));
			if((iconCount+1)%rowSize == 0 && iconCount != 0)
			{
				$("#load-buttons").append('<div style="clear:both;"></div>');
			}
			iconCount++;
		}
	}
}

MenuController.ShowBattleSubMenu = function(selectedMenuIndex, display_as_list)
{
	if(arguments.length < 2)
	{
		display_as_list = 0;
	}
	
	if(arguments.length > 0 && MenuController.currentMenuItem)
	{
		MenuController.menuBackList.push(MenuController.currentMenuItem);
		MenuController.currentMenuItem = MenuController.currentMenuItem.subMenuArray[selectedMenuIndex];
	}
	else if(!MenuController.currentMenuItem)
	{
		var main_menu = GameController.characters[BattleController.current_character_stats_index].character_stats.menu_data.battle_menu;
		MenuController.currentMenuItem = main_menu[selectedMenuIndex];
	}
	
	//show first click item with a back button icon on top to return to previous menu
	var backMenuEvent = "onclick='MenuController.BattleMenuGoBack()'";
	if(display_as_list)
	{
		$("#battle-menu-list").html(MenuController.currentMenuItem.CreateListIcon(backMenuEvent, true));
	}
	else if(MenuController.menuBackList.length > 0)
	{
		$("#load-abilities").html(MenuController.currentMenuItem.CreateRowIcon(backMenuEvent, true));
	}
	else
	{
		$('#load-abilities').html('');
		$("#battle-menu-list").html('');
	}
	
	var menu_items_array = MenuController.currentMenuItem.subMenuArray;
	
	for(var i = 0; i < menu_items_array.length; i++)
	{
		var clickEvent = '';
		if(menu_items_array[i].subMenuArray.length > 0)
		{
			//if this is a secondary menu
			if(menu_items_array[i].isSecondaryMenu)
			{
				clickEvent = "onclick='MenuController.ShowBattleSubMenu("+i+", true)'";
			}
			else
			{
				clickEvent = "onclick='MenuController.ShowBattleSubMenu("+i+")'";
			}
		}
		if(display_as_list)
		{
			$("#battle-menu-list").append(menu_items_array[i].CreateListIcon(clickEvent));
		}
		else
		{
			//if not in dev mode, only list menu items that have an effect saved
			if(GameController.dev_mode == false && menu_items_array[i].action_data.effect != 0);
			{
				$("#load-abilities").append(menu_items_array[i].CreateRowIcon(clickEvent, false));
			}
		}
	}
	//make a space at bottom
	if(display_as_list)
	{
		$("#battle-menu-list").append("<div style='clear:both; height:20px;'></div>");
		$("#battle-menu-list-container").show();
		var screen_height = $("#battle-scroll-container").height();
		var list_height = $("#battle-menu-list").height();
		if(list_height < screen_height)
		{
			var list_top_offset = (screen_height - list_height) / 2;
			$(".scroll-background").css('top',list_top_offset+'px');
			$(".trans_background_75").css('height','100%');
		}
		else
		{
			$(".scroll-background").css('top','0');
			$(".trans_background_75").css('height',list_height+'px');
		}
		$(".scroll-background").css('height',list_height+'px');
	}
}

MenuController.BattleMenuGoBack = function()
{
	if(MenuController.menuBackList.length > 0)
	{
		//hide battle list menu
		$("#battle-menu-list-container").hide();
		$("#battle-menu-list").html('');
	
		//set current menu to last element of menuBackList //remove last element of menuBackList
		MenuController.currentMenuItem = MenuController.menuBackList.pop();
		
		//display menu
		MenuController.ShowBattleSubMenu();
	}
	else
	{
		MenuController.CreateBattleMenu();
	}
}

MenuController.BattleReloadMenu = function()
{
	//MenuController.MenuLoading = true;
	
	MenuController.BattleMenuClose();
	//reload active characters menu
	var character_index = BattleController.current_character_stats_index;
	var character_id = GameController.characters[character_index].character_stats.character_id;
	
	//action data wont change unless quickstat character is reloaded
	var action_data = ActionController.SetCharacterActionData(GameController.characters[character_index].character_stats, character_index);
	GameController.characters[character_index].character_stats.action_data = action_data;
	
	//if a PC load ability data as well, then set menu
	if(GameController.characters[character_index].PC)
	{
		var callback_list = function(data)
		{
			if(GameController.dev_mode) console.log('character_ability_data_load_json');
			
			var ability_data_returned = $.parseJSON(data);
			
			GameController.characters[ability_data_returned.party_stats_index].character_stats.ability_data = ability_data_returned;
			//set PC  menu as part of their character_stats
			var menu_data = MenuController.CreateCharacterMenuItems(ability_data_returned.party_stats_index);
			GameController.characters[ability_data_returned.party_stats_index].character_stats.menu_data = menu_data;
			MenuController.CreateBattleMenu();
		}
		ajax_action('character_ability_data_load_json.php', character_id, {'party_stats_index': character_index}, callback_list, true);
	}
	else
	{
		var menu_data = MenuController.CreateCharacterMenuItems(character_index);
		GameController.characters[character_index].character_stats.menu_data = menu_data;
		MenuController.CreateBattleMenu();
	}
}

MenuController.BattleMenuClose = function()
{
	MenuController.menuBackList.length = 0;
	MenuController.currentMenuItem = 0;
	$("#battle-menu-list").html('');
	$("#battle-menu-list-container").hide();
	$("#load-abilities").html('');
	$("#load-buttons").html('');
}

MenuController.BattleMenuCancelAction = function()
{
	if(BattleController.highlight_character_selected_index == BattleController.current_character_stats_index)
	{
		BattleController.highlight_character_selected_index = -1;
	}
	//BattleController.target_character_index_array.length = 0;//cant reset here this is called on action confirm
	BattleController.action_confirmed = 0;
	BattleController.show_select_area=0;
	BattleController.process_battle_action_args = 0;
	BattleController.process_battle_action_data = 0;
	CharacterController.SetHighlightAll(0);
	BattleController.clear_select();
	if(GameController.in_encounter)
	{
		BattleController.draw();
	}
	else
	{
		$("#show-characters").show();
		$("#game-menu-top-menu").show();
		$("#game-menu-top-default").show();
	}
	$('#action-confirm').hide();
	$('#game-menu-top-default').show();
	$('#game-menu-top-action-confirm').hide();
	$('#select-target').hide();
	$('#select-target').html('SELECT TARGET');
	//this shows the attack icon after player cancels attack
	$('#load-abilities').show();
	//battle screen list menu
	if($('#battle-menu-list').html() != '')
	{
		$('#battle-menu-list-container').show();
	}
	//map screen list menu
	if($('#game-menu-inner').html() != '')
	{
		$('#game-menu').show();
	}
}

MenuController.BattleMenuClearAction = function()
{
	//clear menus
	MenuController.BattleMenuClose();
	MenuController.MenuClose();
	//just clear this so that there is no flash of menu fading out
	$('#game-menu-inner').html('')
	MenuController.BattleMenuCancelAction();
	//reset AOE area targeted characters
	BattleController.target_character_index_array.length = 0;
	//reset dice roll
	BattleController.process_battle_action_diceRoll.length = 0;
}

MenuController.SelectMainItem = function(selectedMenuIndex, isSecondaryMenu)
{
	if(arguments.length < 2) isSecondaryMenu = false;
	MenuController.menuBackList.length = 0;
	MenuController.currentMenuItem = 0;
	MenuController.BattleMenuCancelAction();
	$('#battle-menu-list-container').hide();
	
	/*
	if(arguments.length < 1) selectedMenuIndex = -1;
	//set for battle, previous action comes up automatically
	GameController.characters[BattleController.current_character_stats_index].last_round_action_click_button_index = selectedMenuIndex;
	*/
	
	MenuController.ShowBattleSubMenu(selectedMenuIndex, isSecondaryMenu);
	
	//if clicking first button (attack) and if there is only one option, trigger click of that attack option
	//instead of showing single option and having player click again to attack
	var attackSubMenuLength = GameController.characters[BattleController.current_character_stats_index].character_stats.menu_data.battle_menu[0].subMenuArray.length;
	if(selectedMenuIndex == 0 && attackSubMenuLength == 1)
	{
		//trigger click of only attack option automatically - changed for two weapon fighting
		$('#load-abilities .game-menu-item-container-row').eq(0).trigger(window.mobile?'touchend':'click');
		//stop from showing submenu
		//only close menu if character has selected a target and action will be carried out
		if(BattleController.highlight_character_selected_index != -1) MenuController.BattleMenuClose();
	}
	else
	{
		$('#load-abilities').show();
	}
}