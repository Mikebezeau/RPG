
var EventEditController = EventEditController || {};

EventEditController.Init = function()
{
	GameController.view_events = 1;
	
	$(document).on("click", "#event-new", function()
	{
		EventEditController.EventNew();
	});
	
	$(document).on("click", "#event-load", function()
	{
		EventEditController.EventLoad(true, 0, GameController.area_id);
	});
	
	$(document).on("click", "#event-save", function()
	{
		EventEditController.EventSave();
	});

	$(document).on("click", "#event-edit-done", function()
	{
		$('#edit-event').hide();
	});

	$(document).on("click", "#edit-event-battle", function()
	{
		$('#load-event-battle-edit-form').html($('#template-event-battle-edit-form').html());
	});

	$(document).on("click", "#edit-event-change-location", function()
	{
		$('#load-event-change-location-edit-form').html($('#template-event-change-location-edit-form').html());
	});

	$(document).on("click", "#edit-event-place-items", function()
	{
		$('#load-edit-event-place-items-form').html($('#template-edit-event-place-items-edit-form').html());
	});

	$(document).on("click", "#edit-event-add-items", function()
	{
		$('#load-edit-event-place-items-form .edit-event-place-items-edit-form').append($('#template-edit-event-item-form').html());
	});

	$(document).on("click", ".edit-event-remove-item", function()
	{
		$(this).parent().remove();
	});

}

EventEditController.ShowAreaEvent = function()
{
	//load './php/event_load_json.php?get_all'
	var callback = function(data)
	{
		var eventData = $.parseJSON(data);
		$('#edit-event-view-area-sub-menu').html('');
		$('#edit-event-view-area-sub-menu').append('This Area, AreaID '+GameController.area_id+'<div style="clear:both;"></div>');
		for(var i in eventData)
		{
			$('#edit-event-view-area-sub-menu').append('<div class="box">AreaID '+eventData[i].AreaID+', EventID '+eventData[i].EventID+'<br/>Title: '+eventData[i].Title+'<br/><span class="menu-style-button load-event-button" onclick="EventEditController.EventLoad(true, '+eventData[i].EventID+')">Load</span> <span class="menu-style-button" onclick="EventEditController.EventDelete('+eventData[i].EventID+')">X</span></div>');
		}
		if(eventData.length == 0) $('#edit-event-view-area-sub-menu').html('No area events');
	}
	ajax_action('event_load_json.php?get_all_area&area_id='+GameController.area_id, 0, 0, callback);
}

EventEditController.LoadEventAreaSelect = function()
{
	callback = function(data)
	{
		$('.options-event-map-load').html(data);
	}
	ajax_action('load_map_selection.php?only_options',0,0,callback);
}

EventEditController.ShowAllEvent = function()
{
	EventEditController.ShowAreaEvent();
	
	//don't show other areas anymore
	return true;
	
	//load './php/event_load_json.php?get_all'
	var callback = function(data)
	{
		var eventData = $.parseJSON(data);
		var eventsHTML = 'Other Areas';
		$('#edit-event-view-all-sub-menu').html('');
		for(var i in eventData)
		{
			if(i != GameController.area_id)
			{
				eventsHTML += '<hr style="clear:both;"/>AreaID '+i+'<div style="clear:both;"></div>';
				for(var j in eventData[i])
				{
					eventsHTML += '<div class="box">AreaID '+eventData[i][j].AreaID+', EventID '+eventData[i][j].EventID+'<br/>Title: '+eventData[i][j].Title+'<br/><span class="menu-style-button load-event-button" onclick="EventEditController.EventLoad(true, '+eventData[i][j].EventID+')">Load</span> <span class="menu-style-button" onclick="EventEditController.EventDelete('+eventData[i][j].EventID+')">X</span></div>';
				}
			}
			if(eventData.length == 0) $('#edit-event-view-all-sub-menu').html('No events');
			else $('#edit-event-view-all-sub-menu').html(eventsHTML);
		}
	}
	ajax_action('event_load_json.php?get_all', 0, 0, callback);
}

EventEditController.EventNew = function()
{
	$('#load-event-battle-edit-form').html('');
	$('#load-event-change-location-edit-form').html('');
	$('#load-edit-event-place-items-form').html('');
	$('#load-event').html($('#template-event-edit-form').html());
	$('#load-event').find('.AreaID').val(GameController.area_id);
	EventEditController.LoadEventAreaSelect();
}

EventEditController.EventLoad = function(show, event_id, area_id)
{
	if(arguments.length<2) event_id=0;
	if(arguments.length<3) area_id=-1;
	
	//EventEditController.LoadEventAreaSelect();
	
	//clear fields and forms
	EventEditController.EventNew();
	
	//load './php/event_load_json.php?event_id'
	var callback = function(data)
	{
		var eventData = $.parseJSON(data);
		//onsole.log(eventData);
		$('#load-event').find('.AreaID').val(eventData.AreaID);
		$('#load-event').find('.EventID').val(eventData.EventID);
		$('#load-event').find('.Title').val(eventData.Title);
		$('#load-event').find('.Description').val(eventData.Description);
		$('#load-event').find('.ActionType').val(eventData.ActionType);
		$('#load-event').find('input:radio[name=IsOnlyOnce]').val([eventData.IsOnlyOnce]);
		$('#load-event').find('.X').val(eventData.X);
		$('#load-event').find('.Y').val(eventData.Y);
		$('#load-event').find('.Cutscene').val(eventData.Cutscene);
		
		//character ids to put in battle
		if(eventData.CharacterIDarr.length > 0)
		{
			$('#load-event-battle-edit-form').html($('#template-event-battle-edit-form').html());
			for(var i=0; i<eventData.CharacterIDarr.length; i++)
			{
				$('#load-event-battle-edit-form').find('.CharacterID').eq(i).val(eventData.CharacterIDarr[i]);
			}
		}
		
		//if changing location
		if(eventData.ToAreaID > 0)
		{
			$('#load-event-change-location-edit-form').html($('#template-event-change-location-edit-form').html());
			$('#load-event-change-location-edit-form').find('.ToAreaID').val(eventData.ToAreaID);
			$('#load-event-change-location-edit-form').find('.AskChange').prop('checked', (eventData.AskChange ? true : false));
			$('#load-event-change-location-edit-form').find('.ToX').val(eventData.ToX);
			$('#load-event-change-location-edit-form').find('.ToY').val(eventData.ToY);
		}
		
		//event items
		if(eventData.EventItems.length > 0)
		{
			$('#load-edit-event-place-items-form').html($('#template-edit-event-place-items-edit-form').html());
			for(var i=0; i<eventData.EventItems.length; i++)
			{
				//add an item for each item in array
				$('#load-edit-event-place-items-form .edit-event-place-items-edit-form').append($('#template-edit-event-item-form').html());
				
				$('#load-edit-event-place-items-form').find('.ItemID').eq(i).val(eventData.EventItems[i].ItemID);
				$('#load-edit-event-place-items-form').find('.ItemType').eq(i).val(eventData.EventItems[i].ItemType);
				$('#load-edit-event-place-items-form').find('.Name').eq(i).val(eventData.EventItems[i].Name);
				$('#load-edit-event-place-items-form').find('.Description').eq(i).val(eventData.EventItems[i].Description);
				$('#load-edit-event-place-items-form').find('.TriggerEventID').eq(i).val(eventData.EventItems[i].TriggerEventID);
			}
		}
		
		$('#edit-event-editor-button').trigger('click');
	}
	ajax_action('event_load_json.php?event_id', event_id, 0, callback);
}

EventEditController.EventDelete = function(event_id)
{
	callback = function(){
		EventEditController.ShowAllEvent();
		alert('event_id '+event_id+' deleted');
	}
	if(confirm('Delete event_id '+event_id+'?'))
	{
		ajax_action('event_save.php?event_id&delete', event_id, 0, callback);
	}
}

EventEditController.EventSave = function()
{
	var event_id = $('#load-event').find('.EventID').val();
	
	//set event data
	EventEditController.eventData = {};
	EventEditController.eventData.AreaID = $('#load-event').find('.AreaID').val() == 0 ? GameController.area_id : $('#load-event').find('.AreaID').val();
	EventEditController.eventData.Title = $('#load-event').find('.Title').val();
	EventEditController.eventData.Description = $('#load-event').find('.Description').val();
	EventEditController.eventData.ActionType = $('#load-event').find('.ActionType').val();
	EventEditController.eventData.X = $('#load-event').find('.X').val();
	EventEditController.eventData.Y = $('#load-event').find('.Y').val();
	EventEditController.eventData.Cutscene = $('#load-event').find('.Cutscene').val();
	EventEditController.eventData.IsOnlyOnce = $('#load-event').find('input:radio[name=IsOnlyOnce]:checked').val();
	
	//character ids to put in battle
	EventEditController.eventData.CharacterIDarr = [];
	for(var i=0; i<$('#load-event-battle-edit-form').find('.CharacterID').length; i++)
	{
		if($('#load-event-battle-edit-form').find('.CharacterID').eq(i).val() != '')
			EventEditController.eventData.CharacterIDarr.push($('#load-event').find('.CharacterID').eq(i).val());
	}
	
	//if changing location
	EventEditController.eventData.ToAreaID = $('#load-event-change-location-edit-form').find('.ToAreaID').val();
	EventEditController.eventData.AskChange = $('#load-event-change-location-edit-form .AskChange').is(':checked') ? 1 : 0;
	EventEditController.eventData.ToX = $('#load-event-change-location-edit-form').find('.ToX').val();
	EventEditController.eventData.ToY = $('#load-event-change-location-edit-form').find('.ToY').val();
	
	//if event items here
	EventEditController.eventData.EventItems = 0;
	if(typeof $('#load-edit-event-place-items-form').find('.ItemID').eq(0).val() != 'undefined')
	{
		EventEditController.eventData.EventItems = {};
		EventEditController.eventData.EventItems.ItemID = $('#load-edit-event-place-items-form').find('.ItemID').serializeArray();
		EventEditController.eventData.EventItems.ItemType = $('#load-edit-event-place-items-form').find('.ItemType').serializeArray();
		EventEditController.eventData.EventItems.Name = $('#load-edit-event-place-items-form').find('.Name').serializeArray();
		EventEditController.eventData.EventItems.Description = $('#load-edit-event-place-items-form').find('.Description').serializeArray();
		EventEditController.eventData.EventItems.TriggerEventID = $('#load-edit-event-place-items-form').find('.TriggerEventID').serializeArray();
	}
	//onsole.log('EventEditController.eventData',EventEditController.eventData);
	
	//check for event_id in event layer, set to [y][x] = 0
	//when saves will update with new location
	EventEditController.MoveEvent(event_id, EventEditController.eventData.X, EventEditController.eventData.Y);
	
	//'./php/event_save.php'
	var callback = function(data)
	{
		var event_id = parseInt(data);
		$('#load-event').find('.EventID').val(event_id);
		EventEditController.ShowAllEvent();
		
		//if event is in this current area and has a location on map
		if(EventEditController.eventData.AreaID == GameController.area_id && EventEditController.eventData.X >= 0 && EventEditController.eventData.Y >= 0 && EventEditController.eventData.X != '' && EventEditController.eventData.Y != '')
		{
			GameController.event_layer[EventEditController.eventData.Y][EventEditController.eventData.X] = event_id;
			//set event data in GameController.events (used in draw)
			GameController.events[event_id] = EventEditController.eventData;
			//redraw to show "E" on map at event location
			GameController.redraw_map_on_player_position();
		}
		
		alert('Event Saved');
	}
	ajax_action('event_save.php?event_id', event_id, EventEditController.eventData, callback);
	
}

EventEditController.MoveEvent = function(event_id, toX, toY)
{
	var game = GameController;
	var event_layer = game.event_layer;
	var end_y = event_layer.length ;
	var end_x = event_layer[0].length ;
	
	for(var y=0; y < end_y; y++)
	{
		for(var x=0; x < end_x; x++)
		{
			if(event_layer[y][x] == event_id)
			{
				event_layer[y][x] = 0;
			}
		}
	}
	if(toX >= 0 && toY >= 0)
	{
		event_layer[toY][toX] = event_id;
	}
}
