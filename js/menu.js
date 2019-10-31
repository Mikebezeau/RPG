
var MenuController = MenuController || {};

MenuController.MenuLoading = true;

MenuController.CreateMessageBox = function(message)
{
	var html = "<div id='message-box-container' style='width:100%;'>"+
			//transparent background
			"<div class='trans_background_75'></div>"+
			//top and bottom bars
			"<div style='position:absolute; left:0; top:0; width:100%; height:8px; background-image:URL(\"./images/menu/menu1/h_bar.png\")'></div>"+
			"<div style='position:absolute; left:0; bottom:0; width:100%; height:8px; background-image:URL(\"./images/menu/menu1/h_bar.png\")'></div>"+
			//left and right bars
			"<div style='position:absolute; left:0; top:0; width:8px; height:100%; background-image:URL(\"./images/menu/menu1/v_bar.png\")'></div>"+
			"<div style='position:absolute; right:0; top:0; width:8px; height:100%; background-image:URL(\"./images/menu/menu1/v_bar.png\")'></div>"+
			//corners
			"<img src='./images/menu/menu1/top_left.png' style='position:absolute; left:0; top:0;'/>"+
			"<img src='./images/menu/menu1/top_right.png' style='position:absolute; right:0; top:0;'/>"+
			"<img src='./images/menu/menu1/bottom_left.png' style='position:absolute; left:0; bottom:0;'/>"+
			"<img src='./images/menu/menu1/bottom_right.png' style='position:absolute; right:0; bottom:0;'/>"+
			//message text
			"<div id='menu-message-box'>"+message+"</div>"+
		"</div>"
		return html;
}

MenuController.DisplayMessage = function(message, is_return_html, placeInElementSelector, width, parentHeight)
{
	if(arguments.length < 2) is_return_html = false;
	if(arguments.length < 3 || placeInElementSelector == true)
	{
		placeInElementSelector = '#game-menu-inner';
		$('#game-menu').css('pointer-events', 'auto');
		$("#game-menu").show();
	}
	if(arguments.length < 4) width = 400;
	if(arguments.length < 5) parentHeight = 580;
	
	var messagebox_html = MenuController.CreateMessageBox(message)
	
	if(is_return_html) return messagebox_html;
	
	$(placeInElementSelector).html(messagebox_html);
	
	//set the position of messagebox, to center on screen
	$(placeInElementSelector).show();
	var messageBoxHeight = $("#message-box-container").height();
	var top = parentHeight/2 - messageBoxHeight/2 - 100;
	if(top < 40) top = 40;
	//$(placeInElementSelector).css('height', (top+messageBoxHeight+100)+'px');
	var position_left = 544/2 - width/2;
	$(placeInElementSelector+" #message-box-container").css('width', width+'px');
	$(placeInElementSelector+" #message-box-container").css('left', position_left+'px');
	$(placeInElementSelector+" #message-box-container").css('top', top+'px');
	if(placeInElementSelector == '#game-menu-inner' && !MenuController.MenuVisible)
	{
		$("#game-menu").fadeIn();
	}
	MenuController.MenuVisible = 1;
}

MenuController.HighlightKnowledgeTags = function(string)
{
	//in testringxt replace '{{' with '<span class="knowledge-tag">' and '}}' with '</span>'
	string = string.replace(/{{/g, '<span class="knowledge-tag">');
	string = string.replace(/}}/g, '</span>');
	string = string.replace(/player_name/gi, GameController.characters[GameController.active_player_index].character_stats.character_name);
	return string;
}

MenuController.DisplayConversation = function(conversationIndex, conversationPathIndex, imagePath, imageStyle)
{
	if(arguments.length < 3)
	{
		imagePath = 0;
	}
	if(arguments.length < 4)
	{
		imageStyle = 'float:left; margin:-10px 10px 10px 0px;';
	}
	
	var conversation = GameController.current_conversation;
	var message = '';
	
	//if has a KnowledgeTagID add to GameController.player_knowledge_tags array
	if(conversation.paths[conversationPathIndex].GivenKnowledgeTags.length > 0)
	{
		GameController.player_knowledge_tags = $.merge(GameController.player_knowledge_tags, conversation.paths[conversationPathIndex].GivenKnowledgeTags);
	}
	
	if(imagePath != 0)
	{
		/*
		.parent-element {
			-webkit-transform-style: preserve-3d; -moz-transform-style: preserve-3d; transform-style: preserve-3d;
		}

		.element {
			position: relative; top: 50%; transform: translateY(-50%);
		}
		*/
		var v_center = '';//(window.mobile ? '' : 'position: relative; top: 50%; transform: translateY(-50%);');
		message = 
			'<div style="padding-bottom:10px;">'+
				'<img style="'+imageStyle+'" src="'+imagePath+'">'+
				'<div id="conversation-message-container" style="-webkit-transform-style: preserve-3d; -moz-transform-style: preserve-3d; transform-style: preserve-3d;">'+
					'<div style="'+v_center+'">' + MenuController.HighlightKnowledgeTags(conversation.paths[conversationPathIndex].CPText) + '</div>'+
					'<div style="clear:both;"></div>'+
				'</div>'+
				'<div style="clear:both;"></div>'+
			'</div>';
	}
	else
	{
		message +=  MenuController.HighlightKnowledgeTags(conversation.paths[conversationPathIndex].CPText);
	}
	
	var options = conversation.paths[conversationPathIndex].options;
	var optionsHTML = '<div id="conversation">';
	var visibleOptionCount = 0;
	for(i in options)
	{
		//if GameController.player_knowledge_tags has NeededKnowledgeTagID, and doesn't have RestrictKnowledgeTagID
		var hasNeededKnowledgeTagID = false;
		var hasRestrictKnowledgeTagID = false;
		for(var j=0; j < GameController.player_knowledge_tags.length; j++) {
			if (GameController.player_knowledge_tags[j].KnowledgeTagID == options[i].NeededKnowledgeTagID) hasNeededKnowledgeTagID = true;
			if (GameController.player_knowledge_tags[j].KnowledgeTagID == options[i].RestrictKnowledgeTagID) hasRestrictKnowledgeTagID = true;
		}
		if((parseInt(options[i].NeededKnowledgeTagID) == 0 || hasNeededKnowledgeTagID) && !hasRestrictKnowledgeTagID)
		{
			visibleOptionCount++;
			optionsHTML = optionsHTML+'<div '+(parseInt(options[i].LinkToCPOrder)!=0?'':'onclick="MenuController.MenuClose()"')+' class="conversation-option" data-conversationindex="0" data-event-type="'+options[i].event.CPEType+'" data-imagepath="'+imagePath+'" data-linktocporder="'+options[i].LinkToCPOrder+'">'+MenuController.HighlightKnowledgeTags(options[i].CPOptionText)+'</div>';
		}
	}
	//if no options, but empty option array passes, give optin to say goodbye
	if(visibleOptionCount == 0 && arguments.length > 1 && options.length == 0)
	{
		optionsHTML = optionsHTML+'<div class="conversation-option" onclick="MenuController.MenuClose()">Goodbye</div>';
	}
	optionsHTML = optionsHTML+'</div>';
	
	MenuController.DisplayMessage(message+optionsHTML);
	/*
	$("#game-menu").css('pointer-events', 'auto');

	$("#game-menu-inner").html(MenuController.CreateMessageBox(message+optionsHTML, 400));
	
	//set height of #conversation-message-container to center text vertically
	//must be visible to determine height
	var isVisible = $("#game-menu").css('display') == 'block' ? 1 : 0;
	if(!isVisible) $("#game-menu").show();
	$("#game-menu-inner").show();
	//get height
	var divHeight = $("#conversation-message-container").height();
	//also set the position of enitre messagebox, to ceter on screen
	var messageBoxHeight = $("#message-box-container").height();
	var top = 544/2 - messageBoxHeight/2;
	$("#message-box-container").css('top', top+'px');
	//to fade in hide again (if not already visible from previous conversation path)
	if(!isVisible) $("#game-menu").hide();
	else $("#menu-message-box").hide();
	//set the css height to allow child element to position itself (non-mobile only, set in CSS file) 
	$("#conversation-message-container").css('height',divHeight+'px');
	//fade in the menu screen or just the inner message (conversation transition)
	if(!isVisible)
	{
		$("#game-menu").stop();
		$("#game-menu").fadeIn();
	}
	else
	{
		$("#menu-message-box").stop();
		$("#menu-message-box").fadeIn();
	}
	MenuController.MenuVisible = 1;
	*/
}

MenuController.MenuItemDisabled = function()
{
	MenuController.DisplayMessage('You cannot do this while shape shifted.<br/><span id="selected-button" class="button selected" onclick=\'MenuController.MenuClose();\'>Ok</span>');
}

$(document).on(window.mobile?'touchend':'click', '.conversation-option', function(e)
{
	e.stopPropagation();
	e.preventDefault();
	var conversationIndex = parseInt($(this).data('conversationindex'));
	var LinkToCPOrder = parseInt($(this).data('linktocporder')) - 1;
	var imagePath = $(this).data('imagepath');
	var eventType = $(this).data('event-type');
	if(eventType == 'join')
	{
		//do event
		var character_joining_index = GameController.current_conversation.character_index;
		GameController.characters[character_joining_index].party_id = GameController.player.party_id;
		GameController.characters[character_joining_index].character_stats.GoodGuy = 1;
		
		//add new character to party
		CharacterController.AddCharacterToParty(character_joining_index);
		
		//set formation character selection menu
		FormationController.SetFormationMenu();
		//give default position in formation
		FormationController.SetFormation();
		//update formation grid
		FormationController.SetFormationGrid();
		//save party
		var character_id_arr = []
		for(i in GameController.characters)
		{
			//only save non-summoned creatures to the party
			//is not saving location in formation, will update to save formation data so summoned creatures use it too
			if(CharacterController.IsPartyMember(GameController.characters[i]) && GameController.characters[i].character_stats.summoned_by_character_id == 0)
			{
				character_id_arr.push(GameController.characters[i].character_stats.character_id);
			}
		}
		ajax_action('party_character_data.php', GameController.player.character_id, {'save_character_party': 1, 'character_id_arr': character_id_arr}, function(){});
		//give the game a save in the background
		GameController.SaveGame(false);
	}
	//make option in menu to talk to characters in the party, do not display the join party option paths there
	else if(eventType == 'shop')
	{
		//do event
		var character_shop_index = GameController.current_conversation.character_index;
		ShopController.DisplayShop(character_shop_index);
	}
	
	//onsole.log(conversation);
	
	if(LinkToCPOrder >= 0)
	{
		MenuController.DisplayConversation(conversationIndex, LinkToCPOrder, imagePath);
	}
});

MenuController.preloadImages = [];

//use player character_stats index
MenuController.mainMenu = 0;
MenuController.formationPartyMenu = [];
MenuController.menuBackList = [];
MenuController.MenuVisible = 0;
MenuController.currentMenuItem = 0;

//MenuController.equipmentChanged = 0;

MenuController.editEffects = 0;

MenuController.MenuItem = function(imageFile, description, menuItemAction, subMenuArray, isSecondaryMenu, action_data, this_character_index)
{
	if(arguments.length < 7)
	{
		this_character_index = -1;
	}
	if(arguments.length < 6)
	{
		action_data = 0;
	}
	if(arguments.length < 5)
	{
		isSecondaryMenu = 0;
	}
	
	if(Array.isArray(imageFile))
	{
		this.imageFile = imageFile[0];
		this.imageFileArr = imageFile;
	}
	else
	{
		this.imageFile = imageFile;
		this.imageFileArr = [];
	}
	
	this.description = description;
	this.menuItemAction = menuItemAction;
	this.subMenuArray = subMenuArray;
	this.isSecondaryMenu = isSecondaryMenu;
	this.action_data = action_data;
	this.this_character_index = this_character_index;
	this.disable = false;
	
	this.GetActionOnClickHtml = function()
	{
		var clickFunction = '';
		
		if(this.disable)
		{
			return "onclick='MenuController.MenuItemDisabled();'";
		}
		
		var action_data = this.action_data;
		if(action_data != 0)
		{
			//if two weapon fighting
			if(typeof action_data.main != 'undefined')
			{
				clickFunction = "onclick='ActionController.process_battle_action(\"attack\",["+action_data.main.data_index+","+action_data.off.data_index+"],-1,"+this_character_index+");' ";
			}
			else
			{
				clickFunction = "onclick='ActionController.process_battle_action(\""+action_data.action_type+"\","+action_data.data_index+",-1,"+this_character_index+");' ";
			}
			
			//for racial, class, feat, faction, special and spell must use action_data.party_stats_index
			if(typeof action_data.party_stats_index != 'undefined' && action_data.party_stats_index > -1)
			{
				if(action_data.action == 'spells')
				{
					var data_index = "["+action_data.caster_class_index+", "+action_data.spell_level_index+", "+action_data.spell_index+"]";;
				}
				else
				{
					var data_index = action_data.data_index
				}
				clickFunction = "onclick='ActionController.process_battle_action(\""+action_data.action_type+"\","+data_index+",-1,"+this_character_index+");' ";
			}
			return clickFunction;
		}
		return false;
	}
	
	this.GetIconHtml = function(clickFunction, top, left, goBack, showDescription, classes, showBackgroundBorder)
	{
		actionClickFunction = this.GetActionOnClickHtml();
		clickFunction = actionClickFunction ? actionClickFunction : clickFunction;
		var html = "<div class='"+classes+" mobile-switch-touch' "+clickFunction+" style='top:"+top+"px; left:"+left+"px; '>"+
			(showBackgroundBorder ? "<img style='position:absolute; top:0; left:0;' src='images/battle_icons/blank_border.png'/>" : '');
		
		html += "<img class='icon-image' style='position:absolute; top:"+(window.mobile?'-1':'0')+"; left:"+(window.mobile?'-1':'0')+"px;' src='images/"+this.imageFile+"'/>";
		if(this.imageFileArr.length>1)
		{
			html += "<img class='icon-image' style='position:absolute; top:"+(window.mobile?'-1':'0')+"; left:"+(window.mobile?'-1':'0')+"px;' src='images/"+this.imageFileArr[1]+"'/>";
		}
		html += (goBack ? "<img style='position:absolute; top:0; left:0;' src='images/battle_icons/back_arrow.png'/>" : '')+
			(showDescription ? "<div class='game-menu-item-description'><span style='background-color:#000;'>"+(this.disable ? '<span style="color:grey;">' : '')+this.description+(this.disable ? '</span>' : '')+"</span></div>" : '')+
		"</div>";
		return html;
	}
	
	this.CreateRingIcon = function(clickFunction, top, left, goBack, showDescription, showBackgroundBorder)
	{
		if(arguments.length < 4) goBack = false;
		if(arguments.length < 5) showDescription = true;
		if(arguments.length < 6) showBackgroundBorder = true;
		return this.GetIconHtml(clickFunction, top, left, goBack, showDescription, 'game-menu-item-container', showBackgroundBorder);
	}
	
	this.CreateRowIcon = function(clickFunction, goBack, showDescription, hasFloat, showBackgroundBorder)
	{
		if(arguments.length < 2) goBack = false;
		if(arguments.length < 3) showDescription = true;
		if(arguments.length < 4) hasFloat = true;
		if(arguments.length < 5) showBackgroundBorder = true;
		return this.GetIconHtml(clickFunction, 0, 0, goBack, showDescription, 'game-menu-item-container-row '+(hasFloat ? '' : 'fltlft'), showBackgroundBorder);
	}
	
	this.CreateListIcon = function(clickFunction, goBack)
	{
		if(arguments.length < 2) goBack = false;
		
		actionClickFunction = this.GetActionOnClickHtml();
		clickFunction = actionClickFunction ? actionClickFunction : clickFunction;
		
		var html = '';
		var description = (goBack && this.description == '') ? '<h3 style="margin-top:-4px; font-family:exocetlight;">Return to index</h3>' : this.description;
		if(goBack)
		{
			html += "<div style='clear:both; height:20px;'></div>";
			imageHtml = "<img style='position:absolute; top:0; left:0;' src='images/battle_icons/back_arrow.png'/>";
			//description = 'Back';
		}
		
		html += "<div class='game-menu-item-list-container mobile-switch-touch' "+clickFunction+">"+
					"<img style='position:absolute; top:4px; left:4px;' src='images/battle_icons/spells/blank.png'/>"+
					"<img style='float:left; position:relative;' src='images/"+this.imageFile+"'/>"+
					(goBack ? "<img style='position:absolute; top:4px; left:4px;' src='images/battle_icons/back_arrow.png'/>" : '')+
					"<div style='position:relative; top:12px;'><span>"+description+"</span></div>"+
					"<div style='clear:both;'></div>"+
				"</div>";
		return html;
	}
}

MenuController.LoadImages = function()
{
	//put the messagebox border images in the preloadImages array
	MenuController.preloadImages = [
		'./images/bg/scroll/scroll_bg_top.png', 
		'./images/bg/scroll/scroll_bg_bottom.png', 
		'./images/bg/scroll/scroll_bg_repeat.png', 
		'./images/menu/menu1/h_bar.png', 
		'./images/menu/menu1/v_bar.png', 
		'./images/menu/menu1/v_bar.png', 
		'./images/menu/menu1/top_left.png', 
		'./images/menu/menu1/top_right.png',
		'./images/menu/menu1/bottom_left.png', 
		'./images/menu/menu1/bottom_right.png',
		'./images/battle_icons/back_arrow.png',
		'./images/battle_icons/sheet.png',
		'./images/battle_icons/solo.png',
		'./images/battle_icons/formation.png',
		'./images/battle_icons/melee.png',
		'./images/battle_icons/ranged.png',
		'./images/battle_icons/items.png',
		'./images/battle_icons/party.png',
		'./images/battle_icons/spells_Wizard.png',
		'./images/battle_icons/spells_Cleric.png',
		'./images/battle_icons/spells_Druid.png',
		'./images/battle_icons/dice.png',
		'./images/battle_icons/map.png',
		'./images/battle_icons/ranged.png',
		'./images/battle_icons/level0.png',
		'./images/battle_icons/level1.png',
		'./images/battle_icons/level2.png',
		'./images/battle_icons/level3.png',
		'./images/battle_icons/level4.png',
		'./images/battle_icons/level5.png',
		'./images/battle_icons/level6.png',
		'./images/battle_icons/level7.png',
		'./images/battle_icons/level8.png',
		'./images/battle_icons/spells/default.png',
		'./images/battle_icons/level9.png'
	];
	//is only PCs in characters array at this point
	for(var i in GameController.characters)
	{
		MenuController.preloadImages.push('./images/char/thumb/charthumb_'+GameController.characters[i].character_stats.thumb_pic_id+'.png');
	}
	
	//preload menu images
	var preloadImagesHtml = '';
	for(i in window.MenuController.preloadImages)
	{
		preloadImagesHtml += '<img style="clear:both;" src="'+window.MenuController.preloadImages[i]+'"/>';
	}
	$('#image-preload').append(preloadImagesHtml);
}

MenuController.MenuInit = function()
{
	//if clicking outside of menu, close menu
	$('#game-menu-inner').bind((window.mobile && !just_testing_mobile) ? 'touchend' : 'click', function(e){
			if(e.target.id == 'game-menu-inner' && !GameController.in_event) MenuController.MenuClose();
		});
	
	if(window.mobile)
	{
		MenuController.centerX = Math.floor((544 - 72) / 2);
		MenuController.centerY = Math.floor((544 - 32 - 72) / 2 + 5);
	}
	else
	{
		MenuController.centerX = Math.floor((544 - 48) / 2);
		MenuController.centerY = Math.floor((544 - 32 - 48) / 2 + 5);
	}
}

MenuController.SetMasterMenu = function()
{
	//first layer of main menu is characters
	var mainMenuList = [];
	var partyMenuList = [];
	
	var partySize = CharacterController.GetPartySize();
	
	//if partySize < 4 then add directly to main menu, else add to party menu item
	for(var index in GameController.characters)
	{
		if(CharacterController.IsPartyMember(GameController.characters[index]))
		{
			//add character menu to party list menu (list of party members)
			var characterMenuItem = 
				new MenuController.MenuItem(
					'char/thumb/charthumb_'+GameController.characters[index].character_stats.thumb_pic_id+'.png', 
					GameController.characters[index].character_stats.character_name, 
					0, GameController.characters[index].character_stats.menu_data.main_menu, 0, 0, index
				);
			
			//set character menu as main menu if only one character in party
			if(partySize == 1)
			{
				mainMenuList = GameController.characters[index].character_stats.menu_data.main_menu;
			}
			else if(partySize < 4)
			{
				//add character to main menu
				mainMenuList.push(characterMenuItem);
			}
			else
			{
				//add character menu to party list menu (list of party members)
				partyMenuList.push(characterMenuItem);
			}
		}
	}
	
	//if then add directly to main menu, else add to party menu item (also add formmation item to party menu list
	if(partySize > 3)
	{
		//formation button
		partyMenuList.push(new MenuController.MenuItem('battle_icons/formation.png', 'Formation', 'FormationController.ChangeFormation()', []));
		//party button
		var partyMenuItem = new MenuController.MenuItem('battle_icons/formation.png', 'Party', 0, partyMenuList);
		mainMenuList.push(partyMenuItem);
	}
	else if(partySize > 1)
	{
		//formation button
		mainMenuList.push(new MenuController.MenuItem('battle_icons/formation.png', 'Formation', 'FormationController.ChangeFormation()', []));
	}
	/*
	var itemsMenu = 
		[
			new MenuController.MenuItem('battle_icons/melee.png', 'Weapons', 0, []),
			new MenuController.MenuItem('battle_icons/armor.png', 'Armor', 0, []),
			new MenuController.MenuItem('battle_icons/ring.png', 'Accesory', 0, []),
			new MenuController.MenuItem('battle_icons/potion.png', 'Consumable', 0, []),
			new MenuController.MenuItem('battle_icons/shovel.png', 'Utility', 0, []),
			new MenuController.MenuItem('battle_icons/key.png', 'Quest', 0, [])
		];
	*/
	//mainMenuList.push(new MenuController.MenuItem('battle_icons/map.png', 'Map', 'MenuController.ViewMap()', []));
	//mainMenuList.push(new MenuController.MenuItem('battle_icons/items.png', 'Items', 0, itemsMenu));
	
	//final menu
	MenuController.mainMenu = mainMenuList;
	MenuController.MenuLoading = false;
}
	
MenuController.CreateCharacterAttackMenuItems = function(character_index)
{
	var character_stats = GameController.characters[character_index].character_stats;
	//attacks and special ability use action data (from quickstat)
	var attackMenu = [];
	
	var attack_action_data = character_stats.action_data.attack_action_data;
	
	var main_hand_index = -1;
	var off_hand_index = -1;
	
	for(var i in attack_action_data)
	{
		var attack_name = attack_action_data[i].attack_name+'<br/>(+'+attack_action_data[i].arr_attack_bonus+')';
		var attack_image = EquipmentController.GetEquipmentIcon('weapon', attack_action_data[i]);
		if(!$.inArray(attack_image, MenuController.preloadImages))
		{
			MenuController.preloadImages.push(attack_image);
		}
		var action_data = attack_action_data[i];
		//if main hand unshift / if offhand (is reverse order)
		if(action_data.OffHand)
		{
			off_hand_index = i;
			//don't add offhand to menu items - set two weapon fighting as single option (below)
		}
		else
		{
			main_hand_index = i;
			attackMenu.push(new MenuController.MenuItem(attack_image, attack_name, 0, [], 0, action_data, character_index));
		}
	}
	
	//two weapon fighting
	if(main_hand_index != -1 && off_hand_index != -1)
	{
		attackMenu = [];
		var attack_name = attack_action_data[main_hand_index].attack_name+'/'+attack_action_data[off_hand_index].attack_name+'<br/>(+'+attack_action_data[main_hand_index].arr_attack_bonus+'/+'+attack_action_data[off_hand_index].arr_attack_bonus+')';
		var attack_image = EquipmentController.GetEquipmentIcon('weapon', attack_action_data[main_hand_index]);
		var action_data = {'main':attack_action_data[main_hand_index], 'off':attack_action_data[off_hand_index]};
		attackMenu.push(new MenuController.MenuItem(attack_image, attack_name, 0, [], 0, action_data, character_index));
	}
	return attackMenu;
}

MenuController.CreateCharacterMenuItems = function(character_index)
{
	var character_stats = GameController.characters[character_index].character_stats;
	
	//onsole.log(character_stats);
	
	var abilityData = character_stats.ability_data;
	
	var attackMenu = MenuController.CreateCharacterAttackMenuItems(character_index);
	
	var specialabilityMenu = [];
	var special_action_data = character_stats.action_data.special_action_data;
	for(var i in special_action_data)
	{
		if(special_action_data[i].effects)//just in case there's no effect set for this ability
		{
			var specialability_name = special_action_data[i].name;
			if(special_action_data[i].effects[0] != 0 && special_action_data[i].effects[0].EffectIconName != '')
			{
				specialability_image = special_action_data[i].effects[0].EffectIconName;
			}
			else
			{
				specialability_image = 'battle_icons/racial.png';
			}
			if(!$.inArray(specialability_image, MenuController.preloadImages))
			{
				MenuController.preloadImages.push(specialability_image);
			}
			var action_data = special_action_data[i];
			specialabilityMenu.push(new MenuController.MenuItem(specialability_image, specialability_name, 0, [], 0, action_data, character_index));
		}
	}
	
	var spellMenu = [];
	var raceabilityMenu = [];
	var classabilityMenu = [];
	var factionabilityMenu = [];
	var featsMenu = [];
	if(typeof abilityData !== 'undefined')
	{
		//spell menu: spellMenu
		//for each spell caster class, add menu item if has spells known in that class
		for(var casterClassIndex in abilityData.spells)
		{
			var casterClass = abilityData.spells[casterClassIndex];
			
			//if spells are known for this class
			if(Object.keys(casterClass.spell_level).length > 0)
			{
				//for each spell level in this class
				var classSpellLevelMenu = [];
				var only_one_spell_level = Object.keys(casterClass.spell_level).length == 1 ? true : false;
				
				for(var spellLevelIndex in casterClass.spell_level)
				{
					var spellLevel = casterClass.spell_level[spellLevelIndex];
					//for each spell in this level, add the spell to the level menu
					var spellsInLevelMenu = [];
					for(var spellIndex in spellLevel)
					{
						var ability_data = spellLevel[spellIndex];
						//add class_index and level_index to find spell data on casting action
						ability_data.caster_class_index = parseInt(casterClassIndex);
						ability_data.spell_level_index = parseInt(spellLevelIndex);
						ability_data.spell_index = parseInt(spellIndex);
						if(ability_data.effects != 0 && ability_data.effects[0].EffectIconName != '')
						{
							ability_data.image = ability_data.effects[0].EffectIconName;
						}
						else
						{
							ability_data.image = 'battle_icons/spells/'+ability_data.image+'.png'
						}
						if(!$.inArray(ability_data.image, MenuController.preloadImages))
						{
							MenuController.preloadImages.push(ability_data.image);
						}
						spellsInLevelMenu.push(new MenuController.MenuItem(ability_data.image, ability_data.name, 0, [], 0, ability_data, character_index));
					}
					
					//only one spell level so don't show spell level selection
					if(only_one_spell_level)
						classSpellLevelMenu = spellsInLevelMenu;
					//add this spell level (and menu of this levels spells) to the menu for the class
					else
						classSpellLevelMenu.push(new MenuController.MenuItem('battle_icons/level'+spellLevelIndex+'.png', '', 0, spellsInLevelMenu, 1));
				}
				//if only one spell level, clicking the spellbook will bring up that spell list right away
				var isSecondaryMenu = only_one_spell_level;
				spellMenu.push(new MenuController.MenuItem('battle_icons/spells_'+casterClass.class_name+'.png', casterClass.class_name, 0, classSpellLevelMenu, isSecondaryMenu));	
			}
		}
		//onsole.log(abilityData.spells);
		
		for(var i in abilityData.racial)
		{
			ability_data = abilityData.racial[i];
			var raceability_name = ability_data.name;
			var raceability_image;
			if(ability_data.effects != 0 && ability_data.effects[0].EffectIconName != '')
			{
				raceability_image = ability_data.effects[0].EffectIconName;
			}
			else
			{
				raceability_image = 'battle_icons/racial.png';
			}
			if(!$.inArray(raceability_image, MenuController.preloadImages))
			{
				MenuController.preloadImages.push(raceability_image);
			}
			raceabilityMenu.push(new MenuController.MenuItem(raceability_image, raceability_name, 0, [], 0, ability_data, character_index));
		}
		
		if(abilityData.class.length > 0)
		{
			var thisClassabilityMenu = [];
			var thisClassContinuousMenu = [];
			var only_one_ability_class = 1;
			var prev_learned_class = -1;
		}
		for(var i in abilityData.class)
		{
			ability_data = abilityData.class[i];
			if(prev_learned_class != ability_data.learned_class)
			{
				if(prev_learned_class != -1) only_one_ability_class = 0;
				thisClassabilityMenu[ability_data.learned_class] = [];
				thisClassContinuousMenu[ability_data.learned_class] = [];
			}
			prev_learned_class = ability_data.learned_class;
			var classability_name = ability_data.name;
			var classability_image;
			if(ability_data.effects != 0 && ability_data.effects[0].EffectIconName != '')
			{
				classability_image = ability_data.effects[0].EffectIconName;
			}
			else
			{
				classability_image = 'battle_icons/class.png';
			}
			if(!$.inArray(classability_image, MenuController.preloadImages))
			{
				MenuController.preloadImages.push(classability_image);
			}
			//if a continuous or reflexive type effect, don't add to menu - always in effect, for ChooseClassAbilities show in main unless has been chosen
			if((GameController.dev_mode || ability_data.effects != 0) && (ability_data.effects == 0 || (ability_data.effects.length > 1 && ability_data.effects[0].IsChooseClassAbility == 1) || (ability_data.effects[0].ActionTypeID != 5 && ability_data.effects[0].ActionTypeID != 6)))
			{
				//display select class abilities with gold text
				if(ability_data.effects.length > 1 && ability_data.effects[0].IsChooseClassAbility == 1) classability_name = '<span style="color:gold;">'+classability_name+'</span>';
				thisClassabilityMenu[prev_learned_class].push(new MenuController.MenuItem(classability_image, classability_name, 0, [], 0, ability_data, character_index));
			}
			//if a continuous type effect, add to 'thisClassContinuousMenu'
			else if(ability_data.effects != 0 && (ability_data.effects[0].ActionTypeID == 5 || ability_data.effects[0].ActionTypeID == 6))
			{
				thisClassContinuousMenu[prev_learned_class].push(new MenuController.MenuItem(classability_image, classability_name, 0, [], 0, ability_data, character_index));
			}
		}
		if(abilityData.class.length > 0)
		{
			var class_ability_icon_arr = [];
			if(only_one_ability_class)
			{
				classabilityMenu = thisClassabilityMenu[prev_learned_class];
				var class_icon_info = CharacterController.GetClassNameIcon(prev_learned_class);
				class_ability_icon_arr.push(class_icon_info.icon);
				//add continuous effects if exist
				if(thisClassContinuousMenu[prev_learned_class].length > 0)
				{
					classabilityMenu.push(new MenuController.MenuItem(class_icon_info.icon, 'Passive Abilities', 0, thisClassContinuousMenu[prev_learned_class], 0));
				}
			}
			else
			{
				for(var i in thisClassabilityMenu)
				{
					var class_icon_info = CharacterController.GetClassNameIcon(i);
					class_ability_icon_arr.push(class_icon_info.icon);
					//add continuous effects if exist
					if(thisClassContinuousMenu[i].length > 0)
					{
						thisClassabilityMenu[i].push(new MenuController.MenuItem(class_icon_info.icon, 'Passive Abilities', 0, thisClassContinuousMenu[i], 0));
					}
					classabilityMenu.push(new MenuController.MenuItem(class_icon_info.icon, class_icon_info.name, 0, thisClassabilityMenu[i], 0));
				}
			}
		}
		
		for(var i in abilityData.faction)
		{
			ability_data = abilityData.faction[i];
			var factionability_name = ability_data.name;
			var factionability_image;
			if(ability_data.effects != 0 && ability_data.effects[0].EffectIconName != '')
			{
				factionability_image = ability_data.effects[0].EffectIconName;
			}
			else
			{
				factionability_image = 'battle_icons/faction.png';
			}
			if(!$.inArray(factionability_image, MenuController.preloadImages))
			{
				MenuController.preloadImages.push(factionability_image);
			}
			factionabilityMenu.push(new MenuController.MenuItem(factionability_image, factionability_name, 0, [], 0, ability_data, character_index));
		}
		
		for(var i in abilityData.feat)
		{
			ability_data = abilityData.feat[i];
			var feat_name = ability_data.name;
			var feat_image;
			if(ability_data.effects != 0 && ability_data.effects[0].EffectIconName != '')
			{
				feat_image = ability_data.effects[0].EffectIconName;
			}
			else
			{
				feat_image = 'battle_icons/feats.png';
			}
			if(!$.inArray(feat_image, MenuController.preloadImages))
			{
				MenuController.preloadImages.push(feat_image);
			}
			featsMenu.push(new MenuController.MenuItem(feat_image, feat_name, 0, [], 0, ability_data, character_index));
		}
	}
	
	//set equipment icon
	var equipIcon = new MenuController.MenuItem('battle_icons/melee_mult.png', 'Equip', 'MenuController.ViewEquipAction('+character_index+')', [], 0, 0, character_index);
	var itemsIcon = new MenuController.MenuItem('battle_icons/items.png', 'Items', 'MenuController.ViewItemsAction('+character_index+')', [], 0, 0, character_index);
		
	//SET MENUS
	var menuItems =  
		{
			//main menu organization for map screen main menu
			'main_menu' : 
				[
					new MenuController.MenuItem('battle_icons/sheet.png', 'Status', 'MenuController.ViewSheetAction('+character_index+')', []),
					//not showing skills menu item (blank)
					//new MenuController.MenuItem('battle_icons/dice.png', 'Skills', 0, [])
				],
			//menu for battle screen
			'battle_menu' : []
		}
	
	//only putting the equip and items icon on main characters menu
	if(character_index == 0)
	{
		menuItems.main_menu.push(itemsIcon);
	}
	
	var partySize = CharacterController.GetPartySize();
	if(partySize > 1)
	{
		//solo not ready
		//menuItems.main_menu.push(new MenuController.MenuItem('battle_icons/solo.png', 'Solo', 'MenuController.SoloAction('+character_index+')', []));
	}
	
	if(attackMenu.length > 0) menuItems.battle_menu.push(new MenuController.MenuItem('battle_icons/melee_mult.png', 'Attack', 0, attackMenu));
	menuItems.battle_menu.push(new MenuController.MenuItem('battle_icons/shield.png', 'Defend', 'BattleController.end_character_turn()', []));
	menuItems.battle_menu.push(new MenuController.MenuItem('battle_icons/feats.png', 'Move', 0, []));
	menuItems.battle_menu.push(new MenuController.MenuItem('battle_icons/accesory/icons-good-s_167.png', 'Special', 0, []));
	
	//only putting the equip and items icon on main characters menu
	if(character_index == 0)
	{
		menuItems.main_menu.push(equipIcon);
	}
	
	if(spellMenu.length > 0)
	{
		//if only one caster class set that to replace list of caster classes
		if(spellMenu.length == 1)
		{
			menuItems.main_menu.push(spellMenu[0]);
		}
		else
		{
			menuItems.main_menu.push(new MenuController.MenuItem('battle_icons/spells_Wizard.png', 'Spells', 0, spellMenu));
		}
		for(var i=0; i<spellMenu.length; i++)
		{
			menuItems.battle_menu.push(spellMenu[i]);
		}
	}
	if(raceabilityMenu.length > 0) menuItems.battle_menu.push(new MenuController.MenuItem('battle_icons/racial.png', 'Racial', 0, raceabilityMenu));
	if(classabilityMenu.length > 0)
	{
		var classabilityMenuItem = new MenuController.MenuItem(class_ability_icon_arr, 'Abilities', 0, classabilityMenu);
		menuItems.main_menu.push(classabilityMenuItem);
		menuItems.battle_menu.push(classabilityMenuItem);
	}
	
	if(factionabilityMenu.length > 0) menuItems.battle_menu.push(new MenuController.MenuItem('battle_icons/faction.png', 'Faction', 0, factionabilityMenu));
	if(featsMenu.length > 0) menuItems.battle_menu.push(new MenuController.MenuItem('battle_icons/feats.png', 'Feats', 0, featsMenu));
	
	if(specialabilityMenu.length > 0)
	{
		var specialabilityMenuItem = new MenuController.MenuItem('battle_icons/racial.png', 'S.Ability', 0, specialabilityMenu);
		menuItems.main_menu.push(specialabilityMenuItem);
		menuItems.battle_menu.push(specialabilityMenuItem);
	}
	
	//add this later
	//menuItems.battle_menu.push(equipIcon);
	
	return menuItems;
}

MenuController.CreateMenu = function(character_index, ringSize, menu_items_array, position, isOverTopCurrentMenu)
{
	//currently not character_index using to automatically bring up characters menu
	//if not loaded return
	if(MenuController.mainMenu == 0 || MenuController.MenuLoading)
	{
		var message = 'Menu loading...<br/><br/>'; 
		message += '<div style="margin-top:15px;" id=""><span id="selected-button" class="button selected" onclick="MenuController.MenuClose();">OK</span></div>';
		MenuController.DisplayMessage(message);
		return 0;
	}
	
	if(arguments.length < 1)
	{
		character_index = -1;
	}
	
	if(arguments.length < 3)
	{
		menu_items_array = MenuController.mainMenu;
		
		//changed** reduce rings to match number of items
		ringSize = menu_items_array.length;
		
		//show all items in main menu
		//ringSize = 6;
		//ringSize = ringSize  < menu_items_array.length ? menu_items_array.length : ringSize;
	}
	
	if(arguments.length < 4)
	{
		position = 0;
	}
	
	if(arguments.length < 5)
	{
		isOverTopCurrentMenu = false;
	}
	
	if(window.mobile) $("#game-map-buttons").css('opacity','0.5');
	
	MenuController.MenuVisible = 1;
	$('#game-menu-top-menu-icon').attr('src','./images/battle_icons/menu_clicked.png');
	
	if(!isOverTopCurrentMenu)
	{
		$("#game-menu-inner").show();
		$("#game-menu-inner-scroll").hide();
		MenuController.currentMenuItem = 0;
		MenuController.menuBackList.length = 0;
		$("#game-menu-inner").html('');
	}
	else
	{
		//add a dark background under menu that is overtop
		$("#game-menu-overtop").append('<div class="trans_background_75"></div>');
	}
	
	$("#game-menu").css('pointer-events', 'auto');
	var temparray;
	var i = 0;
	var ringCount = 1;
	do
	{
		temparray = menu_items_array.slice(i,i+ringSize);
		//isOverTopCurrentMenu is true for equipment menu
		MenuController.CreateRing(ringCount, ringSize, temparray, position, isOverTopCurrentMenu);
		ringCount++;
		i += ringSize;
		ringSize = ringSize * 2;
	}
	while (i < menu_items_array.length)
	
	//if character_index selected, auto click on that character menu item
	//not using this now
	if(character_index >= 0)
	{
		$('#game-menu-inner').children('.game-menu-item-container').eq(character_index).trigger(window.mobile?'touchend':'click');
		//set BattleController.current_character_stats_index
		BattleController.current_character_stats_index = character_index;
	}
	
	if(!isOverTopCurrentMenu) $("#game-menu").fadeIn();
	
}

MenuController.ShowSubMenu = function(selectedMenuIndex, showSecondaryMenu)
{
	if(arguments.length == 0)
	{
		showSecondaryMenu = 0;
	}
	if(selectedMenuIndex != -1)
	{
		MenuController.menuBackList.push(MenuController.currentMenuItem);
		if(MenuController.currentMenuItem)
		{
			MenuController.currentMenuItem = MenuController.currentMenuItem.subMenuArray[selectedMenuIndex];
		}
		else
		{
			MenuController.currentMenuItem = MenuController.mainMenu[selectedMenuIndex];
		}
	}
	if(!showSecondaryMenu)
	{
		$("#game-menu-inner").show();
		$("#game-menu-inner-scroll").hide();
		var backMenuEvent = "onclick='MenuController.MenuGoBack()'";
		
		$('#game-menu-inner').html('');
		//show first click item with a back button icon on top to return to previous menu
		$('#game-menu-inner').append(MenuController.currentMenuItem.CreateRingIcon(backMenuEvent, MenuController.centerY, MenuController.centerX, true, false));
		//display ring of sub menu items from firstClickItem
		//number of items in first ring will be minimum 6, or more (looks best to be a multiple of two)
		var numItems = MenuController.currentMenuItem.subMenuArray.length;//6;
		/*if(MenuController.currentMenuItem.subMenuArray.length > 6)
		{
			numItems = Math.ceil(MenuController.currentMenuItem.subMenuArray.length/2) * 2;
		}*/
		MenuController.CreateRing(1, numItems, MenuController.currentMenuItem.subMenuArray);
	}
	//if secondClickItem, show second ring of icons
	//now showing a list on a page
	//if(secondClickItem)
	else if(showSecondaryMenu)
	{
		var menuArray = MenuController.currentMenuItem.subMenuArray;
		var numItems = menuArray.length;
		MenuController.CreateRing(2, numItems, menuArray);
	}
}

MenuController.CreateRing = function(ringNumber, ringSize, menu_items_array, position, isOverTopCurrentMenu)
{
	var posX = MenuController.centerX;
	var posY = MenuController.centerY;
	//
	if(arguments.length < 5)
	{
		//isOverTopCurrentMenu = true: secondary ring menu instead of list
		isOverTopCurrentMenu = false;
	}
	
	//if given a position to place the menu set x and y
	if(arguments.length > 3 && position != 0)
	{
		posX = position.left;
		posY = position.top;
	}
	
	//if 2nd ring make a vertical list
	if(ringNumber == 2 && !isOverTopCurrentMenu)
	{
		$("#game-menu-inner").hide();
		$("#game-menu-inner-scroll").show();
		var backMenuEvent = "onclick='MenuController.MenuGoBack()'";
		$("#game-menu-inner-scroll-list").html(MenuController.currentMenuItem.CreateListIcon(backMenuEvent, true));
	}
	
	//var r = ringNumber*70;//ringNumber is always == 1
	var r = ringNumber*80;//ringNumber is always == 1
	//if mobile then make bigger
	if(window.mobile)
	{
		r = r*1.5;
	}
	//if lots of icons make bigger
	if(ringSize > 6)
	{
		r = r+r*((ringSize-6)/5);
	}
	var circleOffset = (window.mobile) ? 36 : 24;
	
	if(!isOverTopCurrentMenu)
		$("#game-menu-inner").prepend('<div class="circle-background" style="top:'+(posY-(r*1.5)+circleOffset)+'px; left:'+(posX-(r*1.5)+circleOffset)+'px; height:'+(r*3)+'px; width:'+(r*3)+'px;"></div>');
	
	for(var i = 0; i < ringSize; i++)
	{
		
		//var x = posX + r * Math.cos(2 * Math.PI * i / ringSize);
		//var y = posY + r * Math.sin(2 * Math.PI * i / ringSize);
		if(menu_items_array.length > i)
		{
			var imageFile = menu_items_array[i].imageFile;
			var description = menu_items_array[i].description;
			var menuItemAction = menu_items_array[i].menuItemAction;
			
			if(menu_items_array[i].this_character_index != -1 && GameController.characters[menu_items_array[i].this_character_index].character_stats.poly_character_stats != 0 && (description == 'Items' || description == 'Equip'))
			{
				menu_items_array[i].disable = true;
			}
			else
			{
				menu_items_array[i].disable = false;
			}
			
			var ringPosition = Math.floor( (((ringSize - 2) * ringNumber - i)/ringSize)*1000) / 1000;
			//first position is at top: ringPosition = -0.25
			var ringPosOffset = 0.25 + Math.floor( (((ringSize - 2) * ringNumber - 0)/ringSize)*1000) / 1000;
			
			//onsole.log(ringPosition, ringPosOffset, description, ringPosition - ringPosOffset);
			
			ringPosition = ringPosition - ringPosOffset;
			
			var x = Math.floor(posX + r * Math.cos(2 * Math.PI * ringPosition));
			var y = Math.floor(posY + r * Math.sin(2 * Math.PI * ringPosition));
			var subMenuEvent = '';
			if(menu_items_array[i].subMenuArray.length > 0)
			{
				//if this is a secondary menu
				if(menu_items_array[i].isSecondaryMenu)
				{
					subMenuEvent = "onclick='MenuController.ShowSubMenu("+i+", true)'";
				}
				else
				{
					subMenuEvent = "onclick='MenuController.ShowSubMenu("+i+")'";
				}
			}
			//if click doesnt open another menu, then onclick is menuItemAction
			else
			{
				subMenuEvent = "onclick='"+menuItemAction+"'";
			}
			//if 2rd ring then make a vertical list
			//if(window.mobile && ringNumber == 2)
			if(ringNumber == 2 && !isOverTopCurrentMenu)
			{
				$("#game-menu-inner-scroll-list").append(menu_items_array[i].CreateListIcon(subMenuEvent));
			}
			else
			{
				if(isOverTopCurrentMenu)
					$("#game-menu-overtop").append(menu_items_array[i].CreateRingIcon(subMenuEvent, y, x));
				else
					$("#game-menu-inner").append(menu_items_array[i].CreateRingIcon(subMenuEvent, y, x));
			}
		}
	}
	//if 2rd ring on a mobile then make a space at bottom
	if(ringNumber == 2 && !isOverTopCurrentMenu)
	{
		$("#game-menu-inner-scroll-list").append("<div style='clear:both; height:20px;'></div>");
		var list_height = $("#game-menu-inner-scroll-list").height();
		if(list_height < 544)
		{
			var list_top_offset = (544 - list_height) / 2;
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

MenuController.MenuGoBack = function()
{
	if(MenuController.menuBackList.length > 0)
	{
		//set current menu to last element of menuBackList
		MenuController.currentMenuItem = MenuController.menuBackList[MenuController.menuBackList.length - 1];
		//remove last element of menuBackList
		MenuController.menuBackList.pop();	
		//display menu
		
		if(MenuController.menuBackList.length == 0)
		{
			MenuController.CreateMenu();
		}
		else
		{
			MenuController.ShowSubMenu(-1)
		}
	}
}

MenuController.MenuClear = function()
{
	$("#game-menu-inner").html('');
	MenuController.CreateMenu();
}

MenuController.MenuClose = function()
{
	MenuController.MenuVisible = 0;
	$('#game-menu-top-menu-icon').attr('src','./images/battle_icons/menu.png');
	if(window.mobile) $("#game-map-buttons").css('opacity','0.5');
	
	MenuController.menuBackList.length = 0;
	//$("#game-menu").fadeOut(function(){$('#game-menu-inner-scroll').hide()});
	$("#game-menu").hide();
	//for clearing the equipment - tends to pop up in battle??
	$("#game-menu-inner").html('');
	//--
	$('#game-menu-inner-scroll').hide();
	$('#game-menu-overtop').html('');
	$("#game-menu").css('pointer-events', 'none');
}

MenuController.MenuCloseOvertop = function()
{
	$("#game-menu-overtop").html('');
}

MenuController.ViewSheetAction = function(character_index)
{
	var html = window.GetQuickStatCharacterSheet(GameController.characters[character_index].character_stats);
	$("#game-menu-inner").html(html);
	if(window.mobile) $("#game-map-buttons").hide();
	MenuController.menuBackList.push(MenuController.currentMenuItem);
	var partySize = CharacterController.GetPartySize();
	if(MenuController.currentMenuItem)
	{
		MenuController.currentMenuItem = MenuController.currentMenuItem.subMenuArray[0];//All characters: 0 is the index of the character sheet menu item
	}
	//single player party has character menu as main menu, in that case no currentMenuItem yet
	else
	{
		MenuController.currentMenuItem = MenuController.mainMenu[0];
	}
	
	var backMenuEvent = "onclick='if(window.mobile) $(\"#game-map-buttons\").show(); MenuController.MenuGoBack()'";
	$("#game-menu-inner").append(MenuController.currentMenuItem.CreateRingIcon(backMenuEvent, 20, 20, true, false));
	//if(GameController.dev_mode)
	//{
		var editCharacterButton = new MenuController.MenuItem('battle_icons/edit.png', 'Edit', 0, [])
		var editCharacterEvent = '';
		$("#game-menu-inner").append('<a id="menu-edit-character-link" href="./character_sheet.php?character_id='+GameController.characters[character_index].character_stats.character_id+'" target="_blank" style=";">'+editCharacterButton.CreateRingIcon(editCharacterEvent, 20, (window.mobile?450:480), false, true)+'</a>');
	//}
}

MenuController.ViewItemsAction = function(character_index, isRedraw)
{
	if(arguments.length < 2)
	{
		isRedraw = false;
	}
	
	$('#game-menu-inner').addClass('menu-text-align-top');
	
	var character_stats = GameController.characters[character_index].character_stats;
	var html = MenuController.GetItemsSheet();
	$("#game-menu-inner").html(html);
	
	//if menu item is on the main battle menu, does not have a current menu item to add to back list
	if(!isRedraw && !GameController.in_encounter)
	{
		MenuController.menuBackList.push(MenuController.currentMenuItem);
		if(MenuController.currentMenuItem)
		{
			MenuController.currentMenuItem = MenuController.currentMenuItem.subMenuArray[1];//Main player character only: 1 is the index of the items sheet menu item
		}
		//single player party has character menu as main menu, in that case no currentMenuItem yet
		else
		{
			MenuController.currentMenuItem = MenuController.mainMenu[1];
		}
	}
	
	//if menu item is on the main battle menu, does not have a current menu item to add to back list
	if(GameController.in_encounter)
	{
		$("#game-menu").show();
		$("#game-menu").css('pointer-events', 'auto');
		var backMenuEvent = "onclick='MenuController.MenuClose(); $(\"#game-menu-inner\").removeClass(\"menu-text-align-top\");'";
		var backButton = new MenuController.MenuItem('battle_icons/melee_mult.png', 'Back', 0, [], 0);
		$("#game-menu-inner").append(backButton.CreateRingIcon(backMenuEvent, 50, 80, true, false));
	}
	else
	{
		var backMenuEvent = "onclick='MenuController.MenuGoBack(); $(\"#game-menu-inner\").removeClass(\"menu-text-align-top\");'";
		$("#game-menu-inner").append(MenuController.currentMenuItem.CreateRingIcon(backMenuEvent, (window.mobile?20:50), 80, true, false));
	}
	
	//for each item
	var  top = 0;
	var  left = 0;
	
	var item_list = GameController.characters[character_index].character_stats.EquipArr;
	var pageNum = 0;
	var item_count = 0;
	var icon_display_count = 0;
	for(var i=0; i < item_list.length; i++)
	{
		var item = GameController.characters[character_index].character_stats.EquipArr[i];
		if(item_count >= pageNum*15 && item_count < (pageNum+1)*15 && !item.Equipped) 
		{
			top = (window.mobile ? 62 : 74) + Math.floor(icon_display_count/3) * 68;
			left = (window.mobile ? 98 : 110) + Math.floor(icon_display_count%3) * 68;
			var onclick = 'onclick="MenuController.SelectItem('+character_index+','+i+')"';
			var icon_image = (typeof item.Icon == 'undefined' || item.Icon == '') ? EquipmentController.GetEquipmentIcon('equipment', item) : 'battle_icons/'+item.Icon;
			var itemIcon = new MenuController.MenuItem(icon_image, item.EquipName, 0, []);
			$("#items_view_menu").append(itemIcon.CreateRingIcon(onclick, top, left, false, true, false));
			icon_display_count++
		}
		item_count++;
	}
	
}

MenuController.GetItemsSheet = function(character_name)
{
	var html = '';
	html += '<div class="trans_background_75"></div>';
	
	html += '<div id="quick_stats_view_menu">';
	html += '<div id="items_view_menu" class="menu-text-align-top" style="position:relative; top:40px; width:404px; margin:0 auto;">';
	
	html += '<img src="./images/character_sheet/backpack.png" style="">';

	html += "</div> <!-- end div 'items_view_menu' -->";
	html += "</div> <!-- end div 'quick_stats_view_menu' -->";
	
	return html;
}

MenuController.SelectItem = function(character_index, equip_index)
{
	var item = GameController.characters[character_index].character_stats.EquipArr[equip_index];
	//start event
	if(item.TriggerEventID > 0)
	{
		GameController.RunEvent(item.TriggerEventID);
	}
	//activate items power
	if(item.effects != 0)
	{
		//does effect require an action, similar to spell casting
		ActionController.process_battle_action('equipment', equip_index, -1, character_index);
		MenuController.MenuClose();
	}
}

MenuController.ViewEquipAction = function(character_index, isRedraw)
{
	if(arguments.length < 2)
	{
		isRedraw = false;
	}
	
	$('#game-menu-inner').addClass('menu-text-align-top');
	
	var character_stats = GameController.characters[character_index].character_stats;
	var html = MenuController.GetEquipSheet(character_stats);
	$("#game-menu-inner").html(html);
	
	//if menu item is on the main battle menu, does not have a current menu item to add to back list
	if(!isRedraw && !GameController.in_encounter)
	{
		MenuController.menuBackList.push(MenuController.currentMenuItem);
		if(MenuController.currentMenuItem)
		{
			MenuController.currentMenuItem = MenuController.currentMenuItem.subMenuArray[2];//Main player character only: 2 is the index of the equip sheet menu item
		}
		//single player party has character menu as main menu, in that case no currentMenuItem yet
		else
		{
			MenuController.currentMenuItem = MenuController.mainMenu[2];
		}
	}
	
	//if menu item is on the main battle menu, does not have a current menu item to add to back list
	if(GameController.in_encounter)
	{
		$("#game-menu").show();
		$("#game-menu").css('pointer-events', 'auto');
		//var backMenuEvent = "onclick='CharacterController.UpdateEquipment("+character_index+"); MenuController.MenuClose(); $(\"#game-menu-inner\").removeClass(\"menu-text-align-top\");'";
		var backMenuEvent = "onclick='MenuController.MenuClose(); $(\"#game-menu-inner\").removeClass(\"menu-text-align-top\");'";
		var backButton = new MenuController.MenuItem('battle_icons/melee_mult.png', 'Back', 0, [], 0);
		$("#game-menu-inner").append(backButton.CreateRingIcon(backMenuEvent, 50, 80, true, false));
	}
	else
	{
		//var backMenuEvent = "onclick='CharacterController.UpdateEquipment("+character_index+"); MenuController.MenuGoBack(); $(\"#game-menu-inner\").removeClass(\"menu-text-align-top\");'";
		var backMenuEvent = "onclick='MenuController.MenuGoBack(); $(\"#game-menu-inner\").removeClass(\"menu-text-align-top\");'";
		$("#game-menu-inner").append(MenuController.currentMenuItem.CreateRingIcon(backMenuEvent, (window.mobile?20:50), 80, true, false));
	}
	
	//for each equip slot show equipped item
	for(var slotName in EquipmentController.EquipSlots)
	{
		//var equip = new MenuController.MenuItem(EquipmentController.EquipSlots[slotName].defaultIcon, slotName, 0, []);
		//make default icon blank
		var equip = new MenuController.MenuItem('battle_icons/blank_border.png', slotName, 0, []);
		var onclick = 'onclick="MenuController.SelectEquipItem('+character_index+',\''+slotName+'\')"';
		//if(slotName == 'Save') onclick = 'onclick="CharacterController.SaveCharacter('+character_index+')"';
		
		switch(slotName)
		{
			case 'Main-Hand':
			case 'Off-Hand':
				var isMainTwoHanded = false;
				for(var weaponIndex in character_stats.WeaponArr)
				{
					var weaponEquip = character_stats.WeaponArr[weaponIndex];
					if(weaponEquip.TwoHand && weaponEquip.Equipped) isMainTwoHanded = true;
					if(
						(slotName == 'Main-Hand' && weaponEquip.Equipped && !weaponEquip.OffHand)
						|| (slotName == 'Off-Hand' && weaponEquip.Equipped && weaponEquip.OffHand)
					)
					{
						var icon_image = EquipmentController.GetEquipmentIcon('weapon', weaponEquip);
						equip = new MenuController.MenuItem(icon_image, weaponEquip.WeaponName, 0, []);
					}
				}
				//if weapon is two handed
				if(isMainTwoHanded)
				{
					if(slotName == 'Off-Hand' && isMainTwoHanded)
					{
						onclick = '';
						equip = new MenuController.MenuItem('battle_icons/level0.png', '(n/a)', 0, []);
					}
				}
				//shield
				if(slotName == 'Off-Hand')
				{
					for(var armorIndex in character_stats.ArmorArr)
					{
						var armorEquip = character_stats.ArmorArr[armorIndex];
						if(armorEquip.Equipped && armorEquip.Shield)
						{
							onclick = 'onclick="MenuController.SelectEquipItem('+character_index+',\''+slotName+'\',1)"';//last parameter = isShield
							var icon_image = EquipmentController.GetEquipmentIcon('armor', armorEquip);
							equip = new MenuController.MenuItem(icon_image, armorEquip.ArmorName, 0, []);
						}
					}
				}
				break;
			
			case 'Armor':
				for(var armorIndex in character_stats.ArmorArr)
				{
					var armorEquip = character_stats.ArmorArr[armorIndex];
					if(armorEquip.Equipped && !armorEquip.Shield)
					{
						var icon_image = EquipmentController.GetEquipmentIcon('armor', armorEquip);
						equip = new MenuController.MenuItem(icon_image, armorEquip.ArmorName, 0, []);
					}
				}
				break;
			
			default:
				for(var equipIndex in character_stats.EquipArr)
				{
					var charEquip = character_stats.EquipArr[equipIndex];
					if(slotName == charEquip.Slot && charEquip.Equipped == 1)
					{
						var icon_image = EquipmentController.GetEquipmentIcon('equipment', charEquip);
						if(icon_image == '') icon_image = EquipmentController.EquipSlots[slotName].defaultIcon
						equip = new MenuController.MenuItem(icon_image, charEquip.EquipName, 0, []);
					}
				}
				break;
		}
		
		$("#equip_view_menu").append(equip.CreateRingIcon(onclick, EquipmentController.EquipSlots[slotName].top, EquipmentController.EquipSlots[slotName].left));
	};
}

MenuController.GetEquipSheet = function(character_stats)
{
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
			
		case 8://Fey-touched
			char_full_image_src = 'ft';
			race_name = 'Fey-touched';
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
	//add male or female '-m' or '-f'
	char_full_image_src +=  character_stats.Gender=='Male'?'-m-':'-f-';
	//add class
	char_full_image_src += character_stats.ClassArr[0].ClassName.toLowerCase();
	
	var html = '';
	html += '<div class="trans_background_75"></div>';
	
	html += '<div id="quick_stats_view_menu">';
	html += '<div id="equip_view_menu" class="menu-text-align-top" style="background-image:URL(\'./images/char/full/character_create/'+char_full_image_src+'.jpg\');">';
	
	html += '<img src="./images/character_sheet/character_equip_trans.png" style="width:100%;">';
	html += '<div style="position:absolute; top:5px; text-align:center; width:100%;"><h1>'+character_stats.character_name+'</h1></div>';
	
	html += "</div> <!-- end div 'equip_view_menu' -->";
	html += "</div> <!-- end div 'quick_stats_view_menu' -->";
	
	return html;
}

MenuController.SelectEquipItem = function(character_index, equipSlot, isShield)
{
	if(arguments.length < 3) isShield = false;
	
	//get list of character items that may be Equipped in this slot
	var character_stats = GameController.characters[character_index].character_stats;
	var equipSlotMenu = [];
	//center menu on slot player clicked on
	var position = {'left': EquipmentController.EquipSlots[equipSlot].left+70, 'top': EquipmentController.EquipSlots[equipSlot].top+13};
	//weapon armor or other
	switch(equipSlot)
	{
		case 'Main-Hand':
		case 'Off-Hand':
			for(var weaponIndex in character_stats.WeaponArr)
			{
				var weapon = character_stats.WeaponArr[weaponIndex];
				//onsole.log(weapon);
				var icon_image = EquipmentController.GetEquipmentIcon('weapon', weapon);
				equipSlotMenu.push(new MenuController.MenuItem(icon_image, weapon.WeaponName, 'MenuController.EquipItem('+character_index+','+weaponIndex+',"'+equipSlot+'")', []));
			}
			//shield
			if(equipSlot == 'Off-Hand')
			{
				for(var armorIndex in character_stats.ArmorArr)
				{
					var armor = character_stats.ArmorArr[armorIndex];
					if(armor.Shield)
					{
						var icon_image = EquipmentController.GetEquipmentIcon('armor', armor);
						equipSlotMenu.push(new MenuController.MenuItem(icon_image, armor.ArmorName, 'MenuController.EquipItem('+character_index+','+armorIndex+',"'+equipSlot+'","'+isShield+'")', []));
					}
				}
			}
			break;
		
		case 'Armor':
			for(var armorIndex in character_stats.ArmorArr)
			{
				var armor = character_stats.ArmorArr[armorIndex];
				//not shields
				if(!armor.Shield)
				{
					var icon_image = EquipmentController.GetEquipmentIcon('armor', armor);
					equipSlotMenu.push(new MenuController.MenuItem(icon_image, armor.ArmorName, 'MenuController.EquipItem('+character_index+','+armorIndex+',"'+equipSlot+'")', []));
				}
			}
			break;
			
		default:
			for(var equipIndex in character_stats.EquipArr)
			{
				var equip = character_stats.EquipArr[equipIndex];
				//onsole.log(equip);
				if(equip.Slot == equipSlot)
				{
					var icon_image = EquipmentController.GetEquipmentIcon('equipment', equip);
					if(icon_image == '') icon_image = EquipmentController.EquipSlots[equipSlot].defaultIcon
					equipSlotMenu.push(new MenuController.MenuItem(icon_image, equip.EquipName, 'MenuController.EquipItem('+character_index+','+equipIndex+',"'+equipSlot+'")', []));
				}
			}
			break;
	}
	//if has equipment, show menu
	if(equipSlotMenu.length > 0)
	{
		equipSlotMenu.push(new MenuController.MenuItem('battle_icons/blank_border.png', 'Remove', 'MenuController.EquipItem('+character_index+',-1,"'+equipSlot+'")', []));
		//onsole.log('equipSlotMenu',equipSlotMenu);
		MenuController.CreateMenu(-1, 6, equipSlotMenu, position, true);
	}
}

MenuController.EquipItem = function(character_index, equipIndex, slotName, isShield)
{
	var character_stats = GameController.characters[character_index].character_stats;
	
	//for weapons and armor slot name is set
	
	//if removing, 'equipIndex' == -1 and 'slotName' is set
	if(arguments.length < 3)
	{
		slotName = character_stats.EquipArr[equipIndex].Slot;
	}
	
	if(arguments.length < 4)
	{
		isShield = 0;
	}
	
	switch(slotName)
	{
		
		case 'Main-Hand':
		case 'Off-Hand':
			//unequip any currently equipped weapon in that slot
			for(var i in character_stats.WeaponArr)
			{
				//if equipping main, un-equip all but the weapon in off hand
				//if equipping offhand, un-equip all but the weapon in main hand
				if(
					(slotName == 'Main-Hand' && !character_stats.WeaponArr[i].OffHand)
					|| (slotName == 'Off-Hand' && character_stats.WeaponArr[i].OffHand)
					//if equipping a two handed weapon, un-equip any off hand weapon or shield
					|| (equipIndex != -1 && character_stats.WeaponArr[equipIndex].TwoHand == 1)
				)
				{
					character_stats.WeaponArr[i].Equipped = 0;
					character_stats.WeaponArr[i].OffHand = 0;
				}
			}
			//equipping in off hand slot, or if equipping a 2 handed weapon, un-equip any currently equipped shield in that slot
			if(slotName == 'Off-Hand' || (equipIndex != -1 && character_stats.WeaponArr[equipIndex].TwoHand == 1))
			{
				for(var i in character_stats.ArmorArr)
				{
					if(character_stats.ArmorArr[i].Shield)
					{
						character_stats.ArmorArr[i].Equipped = 0;
					}
				}
			}
			//equip selected item
			if(equipIndex != -1)
			{
				if(isShield)
				{
					character_stats.ArmorArr[equipIndex].Equipped = 1;
				}
				else
				{
					character_stats.WeaponArr[equipIndex].Equipped = 1;
					//set directly if main-hand, case where character swapping main and off-hand weapon
					if(slotName == 'Main-Hand') character_stats.WeaponArr[equipIndex].OffHand = 0;
					//else if off hand, but not two handed, OffHand = 1
					else if(slotName == 'Off-Hand' && !character_stats.WeaponArr[equipIndex].TwoHand) character_stats.WeaponArr[equipIndex].OffHand = 1;
				}
			}
			//update attack menu
			ActionController.UpdateCharacterAttackActionData(character_stats, character_index);
			break;
			
		case 'Armor':
			//unequip any currently equipped armor
			for(var i in character_stats.ArmorArr)
			{
				if(!character_stats.ArmorArr[i].Shield) character_stats.ArmorArr[i].Equipped = 0;
			}
			//equip selected item
			if(equipIndex != -1)
			{
				character_stats.ArmorArr[equipIndex].Equipped = 1;
			}
			break;
			
		default:
			//unequip any currently equipped item in that slot
			for(var i in character_stats.EquipArr)
			{
				if(character_stats.EquipArr[i].Slot == slotName)
				{
					//unequip
					character_stats.EquipArr[i].Equipped = 0;
				}
			}
			//equip selected item
			if(equipIndex != -1)
			{
				character_stats.EquipArr[equipIndex].Equipped = 1;
			}
			break;
	}
	
	MenuController.MenuCloseOvertop();
	//redraw the character equipment menu with selected item equipped
	MenuController.ViewEquipAction(character_index, true);
}

MenuController.SoloAction = function(character_index)
{
	GameController.active_player_index = character_index;
	GameController.draw();
}

MenuController.ViewMap = function()
{
	MenuController.MenuClose();
	GameController.draw_mini_map();
	$('#game-map').fadeIn();
}
