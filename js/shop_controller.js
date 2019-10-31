
var ShopController = ShopController || {};

ShopController.create_shop_item_icon = function(index, item, type, top, isEventItem, event_item_index)
{
	if(arguments.length < 5)
	{
		isEventItem = 0;
		event_item_index = -1;
	}
	
	var list_html = '';
	var item_id = item.ID;
	var icon_name = item.Name;
	var icon_image = (typeof item.Icon == 'undefined' || item.Icon == '') ? EquipmentController.GetEquipmentIcon(type, item) : 'battle_icons/'+item.Icon;
	list_html += '<span class="pc-select-item" onclick="ShopController.SelectShopItem(\''+type+'\', '+index+', '+item_id+', '+isEventItem+', '+event_item_index+');">';
	var shopItemIcon = new MenuController.MenuItem(icon_image, icon_name, 0, [])
	list_html += shopItemIcon.CreateRingIcon('', 0, 1, false, true);//if coords are 0,0 text doesn't get centred
	list_html += '</span>';
	return list_html;
}

ShopController.DisplayShop = function(character_index, pageNum)
{
	if(arguments.length < 2)
	{
		pageNum = 0;
	}
	
	var top = 0;
	var list_html = '<div style="margin-bottom:20px;">Take item?</div>';
	var item_count = 0;
	var icon_display_count = 0;
	var switchToMobileDisplay = 1;
	var item_list = GameController.characters[character_index].character_stats.arr_quick_items_id.weapon;
	for(var i=0; i < item_list.length; i++)
	{
		if(item_count >= pageNum*9 && item_count < (pageNum+1)*9) 
		{
			var item = GameController.items.weapon[item_list[i]];
			//top = Math.floor(icon_display_count/3) * 80;
			top = Math.floor(icon_display_count/3) * (50 + switchToMobileDisplay*40);
			list_html += ShopController.create_shop_item_icon(character_index, item, 'weapon', top);
			icon_display_count++
		}
		item_count++;
	}
	
	var item_list = GameController.characters[character_index].character_stats.arr_quick_items_id.armor;
	for(var i=0; i < item_list.length; i++)
	{
		if(item_count >= pageNum*9 && item_count < (pageNum+1)*9) 
		{
			var item = GameController.items.armor[item_list[i]];
			//top = Math.floor(icon_display_count/3) * 80;
			top = Math.floor(icon_display_count/3) * (50 + switchToMobileDisplay*40);
			list_html += ShopController.create_shop_item_icon(character_index, item, 'armor', top);
			icon_display_count++
		}
		item_count++;
	}
	
	var item_list = GameController.characters[character_index].character_stats.arr_quick_items_id.equipment;
	for(var i=0; i < item_list.length; i++)
	{
		if(item_count >= pageNum*9 && item_count < (pageNum+1)*9) 
		{
			var item = GameController.items.equipment[item_list[i]];
			//top = Math.floor(icon_display_count/3) * 80;
			top = Math.floor(icon_display_count/3) * (50 + switchToMobileDisplay*40);
			list_html += ShopController.create_shop_item_icon(character_index, item, 'equipment', top);
			icon_display_count++
		}
		item_count++;
	}
	
	list_html += '<div style="clear:both;"></div>';
	if(pageNum > 0) list_html += '<span id="" class="button" onclick="ShopController.DisplayShop('+character_index+', '+(pageNum-1)+');" style="margin:0 10px;">Back</span>';
	if(item_count > (pageNum+1)*9) list_html += '<span id="" class="button" onclick="ShopController.DisplayShop('+character_index+', '+(pageNum+1)+');" style="margin:0 10px;">Next</span>';
	list_html += '<div style="clear:both;"></div>';
	list_html += '<span id="selected-button" class="button selected" onclick="MenuController.MenuClose();">Exit</span>';
	
	MenuController.DisplayMessage(list_html);
}

ShopController.SelectShopItem = function(type, char_event_index, item_id, isEventItem, event_item_index)
{
	if(arguments.length < 4) isEventItem = false;
	//move item from npc to players inventory
	//get base item from master game item list
	var item = GameController.items[type][item_id];
	var item_name = item.Name;
	//find item in npc list
	if(isEventItem)
	{
		var event_item_arr =  GameController.events[char_event_index].EventItems.splice(event_item_index, 1);
		var event_item = event_item_arr[0];
		item.FromEventID = GameController.events[char_event_index].EventID;
		item.TriggerEventID = event_item.TriggerEventID;
	}
	else
	{
		var item_list = GameController.characters[char_event_index].character_stats.arr_quick_items_id[type];
		search_item_loop:
		for(var item_index=0; item_index < item_list.length; item_index++)
		{
			if(item_list[item_index] == item_id)
			{
				//removing
				item_list.splice(item_index, 1);
				break search_item_loop;
			}
		}
	}
	
	//adding
	if(type == 'weapon'){
		GameController.characters[0].character_stats.WeaponArr.push(item);
	}
	else if(type == 'armor'){
		GameController.characters[0].character_stats.ArmorArr.push(item);
	}
	else{
		GameController.characters[0].character_stats.EquipArr.push(item);
	}
	
	//update PCWorldItemsHeld
	var item = {
		'PCWorldItemsHeldID': 0, 
		//'PlayerCharacterID': 0,
		'FromCharacterID': isEventItem ? 0 : GameController.characters[char_event_index].character_stats.character_id,
		'FromEventID': isEventItem ? GameController.events[char_event_index].EventID : 0,
		'TriggerEventID': isEventItem ? event_item.TriggerEventID : 0,
		'HeldByCharacterID': GameController.characters[0].character_stats.character_id,
		'ItemID': item_id,
		'ItemType': type,
		'DropXpos': 0,
		'DropYpos': 0,
		'DropAreaID': 0
	}
	
	GameController.pc_world_itmes.push(item);
	//update DB - saving that npc gave pc this item
	EquipmentController.SavePCWorldItems();
	//update DB - saving that pc has this new item
	CharacterController.PCSaveItems();
	//give game a save in the background as well
	GameController.SaveGame(false);
	
	//display confirmation message
	//option to exit or choose another item (if npc has more items)
	confirm_html = '';
	confirm_html += 'You have received:<br/>'+item_name+'<br/><br/>';
	if(
		(isEventItem && GameController.events[char_event_index].EventItems.length > 0)
		||
		(!isEventItem &&
			(
				GameController.characters[char_event_index].character_stats.arr_quick_items_id.weapon.length > 0
				|| GameController.characters[char_event_index].character_stats.arr_quick_items_id.armor.length > 0
				|| GameController.characters[char_event_index].character_stats.arr_quick_items_id.equipment.length > 0
			)
		)
	)
	{
		confirm_html += '<span id="" class="button" onclick="ShopController.DisplayShop('+char_event_index+');" style="margin:20px;">Back</span>';
	}
	confirm_html += '<span id="selected-buttom" class="button selected" onclick="MenuController.MenuClose();">Exit</span>';
	
	MenuController.DisplayMessage(confirm_html);
	//redraw
	GameController.redraw_map_on_player_position();
}

//display event items
ShopController.DisplayEventItems = function(event_index, pageNum)
{
	if(arguments.length < 2)
	{
		pageNum = 0;
	}
	
	var item_list = GameController.events[event_index].EventItems;
	
	var top = 0;
	var list_html = '<div style="margin-bottom:20px;">Take item?</div>';
	var item_count = 0;
	var icon_display_count = 0;
	var switchToMobileDisplay = 1;
			
	for(var event_item_index=0; event_item_index < item_list.length; event_item_index++)
	{
		if(item_count >= pageNum*9 && item_count < (pageNum+1)*9) 
		{
			var item = GameController.items[item_list[event_item_index].ItemType][item_list[event_item_index].ItemID];
			//onsole.log(item);
			top = Math.floor(icon_display_count/3) * (50 + switchToMobileDisplay*40);
			list_html += ShopController.create_shop_item_icon(event_index, item, item_list[event_item_index].ItemType, top, true, event_item_index);
			icon_display_count++
		}
		item_count++;
	}
	
	list_html += '<div style="clear:both;"></div>';
	if(pageNum > 0) list_html += '<span id="" class="button" onclick="ShopController.DisplayEventItems('+event_index+', '+(pageNum-1)+');"  style="margin:0 10px;">Previous</span>';
	if(item_count > (pageNum+1)*9) list_html += '<span id="" class="button" onclick="ShopController.DisplayEventItems('+event_index+', '+(pageNum+1)+');" style="margin:0 10px;">Next</span>';
	list_html += '<div style="clear:both;"></div>';
	list_html += '<span id="selected-button" class="button selected" onclick="MenuController.MenuClose();">Cancel</span>';
	
	MenuController.DisplayMessage(list_html);
}
