
var ConvEditController = ConvEditController || {};

ConvEditController.knowledgeTags = [];
	
ConvEditController.Init = function()
{
	ConvEditController.numPaths = 0;
	ConvEditController.selectedPath = 0;
	ConvEditController.conversationData = 0;
	ConvEditController.conversationLoaded = 0;

	$(document).on("click", ".option-requirements-toggle", function(e)
	{
		var requirements_e = $(this).parent().children('.option-requirements');
		if(requirements_e.css('display') == 'none')
		{
			requirements_e.show();
		}
		else
		{
			requirements_e.hide();
		}
	});

	$(document).on("click", ".option-restrictions-toggle", function(e)
	{
		var restrictions_e = $(this).parent().children('.option-restrictions');
		if(restrictions_e.css('display') == 'none')
		{
			restrictions_e.show();
		}
		else
		{
			restrictions_e.hide();
		}
	});

	$(document).on("click", ".option-event-toggle", function(e)
	{
		var event_e = $(this).parent().children('.option-event');
		if(event_e.css('display') == 'none')
		{
			event_e.show();
		}
		else
		{
			event_e.hide();
		}
	});

	$("#show-edit-conversation").click(function()
	{
		$(".toggle-sub2-menu").hide();
		$(".edit-conv-editor").show();
	});

	$(document).on("click", "#edit-conv-view-all-sub-menu .load-conversation-button", function()
	{
		ConvEditController.ConversationNew();
		$(".toggle-sub2-menu").hide();
		$(".edit-conv-editor").show();
	});

	$(document).on("click", "#knowledge-tag-new", function()
	{
		ConvEditController.KnowledgeTagNewSave();
	});

	$(document).on("click", "#conversation-new", function()
	{
		ConvEditController.ConversationNew();
	});
	
	$(document).on("click", "#conversation-load", function()
	{
		console.log(GameController.area_id);
		ConvEditController.ConversationLoad(true, 0, -1, GameController.area_id);
	});
	
	$(document).on("click", "#conversation-save", function()
	{
		ConvEditController.ConversationSave();
	});

	$(document).on("click", "#conversation-edit-done", function()
	{
		$('#edit-conversation').hide();
	});

	$(document).on("click", ".conversation-add-path", function()
	{
		ConvEditController.AddPath();
	});

	$(document).on("click", ".conversation-add-option", function()
	{
		ConvEditController.AddPathOption();
	});

	$(document).on("click", ".option-new-link", function()
	{
		ConvEditController.AddPath();
		$(this).parent().find('.LinkToCPID').val(ConvEditController.numPaths);
	});

	$(document).on("click", ".option-follow-link", function()
	{
		ConvEditController.selectedPath = parseInt($(this).parent().find('.LinkToCPID').val());
		ConvEditController.GoToSelectedPath();
	});

	$(document).on("click", ".select-path", function()
	{
		ConvEditController.selectedPath = parseInt($(this).data('path-number'));
		ConvEditController.GoToSelectedPath();
	});

}

ConvEditController.ShowAllConversation = function()
{
	//load './php/conversation_load_json.php?conversation_id'
	var callback = function(data)
	{
		var conversationData = $.parseJSON(data);
		$('#edit-conv-view-all-sub-menu').html('');
		for(var i in conversationData)
		{
			$('#edit-conv-view-all-sub-menu').append('<div class="box">AreaID '+conversationData[i].AreaID+', ConvID '+conversationData[i].ConversationID+', CharID '+conversationData[i].CharacterID+'<br/>Title: '+conversationData[i].Title+'<br/><span class="menu-style-button load-conversation-button" onclick="ConvEditController.ConversationLoad(true, '+conversationData[i].ConversationID+')">Load</span> <span class="menu-style-button" onclick="ConvEditController.ConversationDelete('+conversationData[i].ConversationID+')">X</span></div>');
		}
	}
	ajax_action('conversation_load_json.php?get_all', 0, 0, callback);
	
}

ConvEditController.ShowConversation = function(conversationData)
{
	//onsole.log(conversationData);
	
	//open new conversation
	ConvEditController.ConversationNew();
	
	//set conversation data
	$('#load-conversation').find('.ConversationID').val(conversationData.ConversationID);
	$('#load-conversation').find('.CCharacterID').val(conversationData.CharacterID);
	$('#load-conversation').find('.CTitle').val(conversationData.Title);
	$('#load-conversation').find('.CDescription').val(conversationData.Description);
	
	//paths
	for(var i in conversationData.paths)
	{
		if(i>0)
		{
			ConvEditController.AddPath();
		}
		$('.path-edit-form').eq(i).find('.CPRankingValue').val(conversationData.paths[i].CPRankingValue);
		$('.path-edit-form').eq(i).find('.CPTitle').val(conversationData.paths[i].CPTitle);
		$('.path-edit-form').eq(i).find('.CPDescription').val(conversationData.paths[i].CPDescription);
		$('.path-edit-form').eq(i).find('.CPText').val(conversationData.paths[i].CPText);
		$('.path-edit-form').eq(i).find('.CPAreaRenownID').val(conversationData.paths[i].CPAreaRenownID);
		$('.path-edit-form').eq(i).find('.CPAreaRenownStrength').val(conversationData.paths[i].CPAreaRenownStrength);
		$('.path-edit-form').eq(i).find('.GivenKnowledgeTagID').val(conversationData.paths[i].GivenKnowledgeTags.length == 0 ? 0 : conversationData.paths[i].GivenKnowledgeTags[0].KnowledgeTagID);
		//path options
		for(var j in conversationData.paths[i].options)
		{
			//add paths after the first
			if(j>0)
			{
				ConvEditController.AddPathOption();
			}
			$('.path-edit-form').eq(i).children('.load-cp-options').children('.path-option').eq(j).find('.CPOptionText').val(conversationData.paths[i].options[j].CPOptionText);
			$('.path-edit-form').eq(i).children('.load-cp-options').children('.path-option').eq(j).find('.LinkToCPID').val(conversationData.paths[i].options[j].LinkToCPOrder);
			$('.path-edit-form').eq(i).children('.load-cp-options').children('.path-option').eq(j).find('.NeededKnowledgeTagID').val(conversationData.paths[i].options[j].NeededKnowledgeTagID);
			$('.path-edit-form').eq(i).children('.load-cp-options').children('.path-option').eq(j).find('.RestrictKnowledgeTagID').val(conversationData.paths[i].options[j].RestrictKnowledgeTagID);
			//if has a NeededKnowledgeTagID show option-requirements div
			if(conversationData.paths[i].options[j].NeededKnowledgeTagID > 0)
			{
				$('.path-edit-form').eq(i).children('.load-cp-options').children('.path-option').eq(j).find('.option-requirements').show();
			}//if has a RestrictKnowledgeTagID show option-restrictions div
			if(conversationData.paths[i].options[j].RestrictKnowledgeTagID > 0)
			{
				$('.path-edit-form').eq(i).children('.load-cp-options').children('.path-option').eq(j).find('.option-restrictions').show();
			}//if has an event select type
			if(conversationData.paths[i].options[j].event != 0)
			{
				$('.path-edit-form').eq(i).children('.load-cp-options').children('.path-option').eq(j).find('.option-event').show();
				$('.path-edit-form').eq(i).children('.load-cp-options').children('.path-option').eq(j).find('.CPOptionEventType').val(conversationData.paths[i].options[j].event.CPEType);
			}
		}
	}
	ConvEditController.selectedPath = 1;
	ConvEditController.GoToSelectedPath();
}

ConvEditController.ConversationNew = function()
{
	ConvEditController.numPaths = 1;
	ConvEditController.selectedPath = 1;
	$('#load-conversation').html($('#template-conversation-edit-form').html());
	$('.load-path').eq(0).append($('#template-path-edit-form').html());
	$('.path-edit-form').hide();
	$('.path-edit-form').eq(0).find('.path-number').html(ConvEditController.numPaths);
	$('.path-edit-form').eq(0).show();
		$('.path-edit-form').eq(0).children('.load-cp-options').append($('#template-option-edit-inputs').html());
	
	$('.view-path-selection').eq(0).html('<span class="menu-style-button select-path" data-path-number="1">1</span>');
}

ConvEditController.AddPath = function()
{
	ConvEditController.numPaths++;
	ConvEditController.selectedPath = ConvEditController.numPaths;
	$('.load-path').eq(0).append($('#template-path-edit-form').html());
	$('.path-edit-form').hide();
	$('.path-edit-form').eq(ConvEditController.numPaths-1).find('.path-number').html(ConvEditController.numPaths);
	$('.path-edit-form').eq(ConvEditController.numPaths-1).show();
		$('.path-edit-form').eq(ConvEditController.numPaths-1).children('.load-cp-options').append($('#template-option-edit-inputs').html());
	
	$('.view-path-selection').eq(0).append('<span class="menu-style-button select-path" data-path-number="'+ConvEditController.numPaths+'">'+ConvEditController.numPaths+'</span>');
}

ConvEditController.AddPathOption = function()
{
	$('.path-edit-form').eq(ConvEditController.selectedPath-1).children('.load-cp-options').append($('#template-option-edit-inputs').html());
}

ConvEditController.GoToSelectedPath = function()
{
	$('.path-edit-form').hide();
	$('.path-edit-form').eq(ConvEditController.selectedPath-1).show();
}

ConvEditController.ConversationLoad = function(show, conversation_id, character_index, area_id)
{
	if(arguments.length<2) conversation_id=0;
	if(arguments.length<3) character_index=-1;
	if(arguments.length<4) area_id=-1;
	//load up knowledge tags
	if(GameController.edit && ConvEditController.knowledgeTags.length == 0) ConvEditController.KnowTagLoad();
	
	//load './php/conversation_load_json.php?conversation_id'
	var callback = function(data)
	{
		var conversationData = $.parseJSON(data);
		//for editing
		ConvEditController.conversationData = conversationData;
		//set character conversation
		conversationData.CharacterID = 0;
		if(conversationData.character_index > -1)
		{
			conversationData.CharacterID = GameController.characters[conversationData.character_index].character_stats.character_id;
			GameController.characters[conversationData.character_index].conversation = conversationData;
		}
		//set area conversation
		else
		{
			GameController.conversation = ConvEditController.conversationData;
		}
		//if set to show edit screen
		if(ConvEditController.conversationData != 0)
		{
			if(show)
			{
				ConvEditController.ShowConversation(ConvEditController.conversationData);
			}
			ConvEditController.conversationLoaded = 1;
			//onsole.log('game.conversation loaded');
		}
	}
	
	ajax_action('conversation_load_json.php?conversation_id&area_id='+area_id+'&character_index='+character_index, conversation_id, 0, callback);
	
}

ConvEditController.Conversation = function()
{
	
}

ConvEditController.ConversationPath = function(CPOrder, CPRankingValue,CPTitle,CPDescription,CPText,CPAreaRenownID,CPAreaRenownStrength,GivenKnowledgeTagID)
{
	this.CPID = 0;
	this.CPOrder = CPOrder;
	this.CPRankingValue = CPRankingValue;
	this.CPTitle = CPTitle;
	this.CPDescription = CPDescription;
	this.CPText = CPText;
	this.CPAreaRenownID = CPAreaRenownID;
	this.CPAreaRenownStrength = CPAreaRenownStrength;
	this.GivenKnowledgeTagID = GivenKnowledgeTagID;
}

ConvEditController.PathOption = function(CPOptionText,LinkToCPID,LinkToCPOrder,NeededKnowledgeTagID,RestrictKnowledgeTagID,EventType)
{
	this.CPOptionText = CPOptionText;
	this.LinkToCPID = LinkToCPID;
	this.LinkToCPOrder = LinkToCPOrder;
	this.NeededKnowledgeTagID = NeededKnowledgeTagID;
	this.RestrictKnowledgeTagID = RestrictKnowledgeTagID;
	this.EventType = EventType;
}

ConvEditController.ConversationDelete = function(conversation_id)
{
	callback = function(){
		ConvEditController.ShowAllConversation();
		alert('conversation_id '+conversation_id+' deleted');
	}
	if(confirm('Delete conversation_id '+conversation_id+'?'))
	{
		ajax_action('conversation_save.php?conversation_id&delete', conversation_id, 0, callback);
	}
}

ConvEditController.ConversationSave = function()
{
	//set conversation data
	
	var conversation_id = $('#load-conversation').find('.ConversationID').val();
	
	ConvEditController.conversationData = new ConvEditController.Conversation();
	ConvEditController.conversationData.CharacterID = $('#load-conversation').find('.CCharacterID').val();
	ConvEditController.conversationData.AreaID = GameController.area_id;
	ConvEditController.conversationData.Title = $('#load-conversation').find('.CTitle').val();
	ConvEditController.conversationData.Description = $('#load-conversation').find('.CDescription').val();
	ConvEditController.conversationData.paths = [];
	//path objects
	for(var i=0; i<ConvEditController.numPaths; i++)
	{
		var CPRankingValue,CPTitle,CPDescription,CPText,CPAreaRenownID,CPAreaRenownStrength,GivenKnowledgeTagID = 0;
		CPRankingValue = $('.path-edit-form').eq(i).find('.CPRankingValue').val();
		CPTitle = $('.path-edit-form').eq(i).find('.CPTitle').val();
		CPDescription = $('.path-edit-form').eq(i).find('.CPDescription').val();
		CPText = $('.path-edit-form').eq(i).find('.CPText').val();
		CPAreaRenownID = $('.path-edit-form').eq(i).find('.CPAreaRenownID').val();
		CPAreaRenownStrength = $('.path-edit-form').eq(i).find('.CPAreaRenownStrength').val();
		GivenKnowledgeTagID = $('.path-edit-form').eq(i).find('.GivenKnowledgeTagID').val();
		
		var savePath = new ConvEditController.ConversationPath(i+1,CPRankingValue,CPTitle,CPDescription,CPText,CPAreaRenownID,CPAreaRenownStrength,GivenKnowledgeTagID);
		savePath.options = [];
		//path options
		var numOptions = $('.path-edit-form').eq(i).children('.load-cp-options').children('.path-option').length;
		for(var j=0; j<numOptions; j++)
		{
			var CPOptionText = $('.path-edit-form').eq(i).children('.load-cp-options').children('.path-option').eq(j).find('.CPOptionText').val();
			var LinkToCPID = LinkToCPOrder = $('.path-edit-form').eq(i).children('.load-cp-options').children('.path-option').eq(j).find('.LinkToCPID').val();
			var NeededKnowledgeTagID = $('.path-edit-form').eq(i).children('.load-cp-options').children('.path-option').eq(j).find('.NeededKnowledgeTagID').val();
			var RestrictKnowledgeTagID = $('.path-edit-form').eq(i).children('.load-cp-options').children('.path-option').eq(j).find('.RestrictKnowledgeTagID').val();
			var EventType = $('.path-edit-form').eq(i).children('.load-cp-options').children('.path-option').eq(j).find('.CPOptionEventType').val();
			
			//don't include blank options (show one blank one as default
			if(CPOptionText != '')
			{
				saveOption = new ConvEditController.PathOption(CPOptionText,LinkToCPID,LinkToCPOrder,NeededKnowledgeTagID,RestrictKnowledgeTagID, EventType);
				savePath.options.push(saveOption);
			}
		}
		
		ConvEditController.conversationData.paths.push(savePath);
	}
	
	//onsole.log('ConversationSave ConvEditController.conversationData',ConvEditController.conversationData);
	
	//'./php/conversation_save.php'
	var callback = function(data)
	{
		var conversation_id = parseInt(data);
		$('#load-conversation').find('.ConversationID').val(conversation_id);
		if(ConvEditController.conversationData.CharacterID > 0)
		{
			for(var i=0; i< GameController.characters.length; i++)
			{
				if(GameController.characters[i].character_stats.character_id == ConvEditController.conversationData.CharacterID)
				{
					GameController.characters[i].character_stats.conversation_id = conversation_id;
				}
			}
		}
		ConvEditController.ShowAllConversation();
		alert('Conversation Saved');
	}
	ajax_action('conversation_save.php?conversation_id', conversation_id, ConvEditController.conversationData, callback);
	
}

ConvEditController.KnowTagLoad = function(deletedId)
{
	if(arguments.length < 1) deletedId = 0;
	//get all knowledge tags
	//load './php/conversation_load_json.php?knowledge_tags'
	var callback = function(data)
	{
		var loadedKnowledgeTags = $.parseJSON(data);
		$('#load-knowledge-tags').html('<div>Knowledge Tags</div>');
		//add default option to select boxes
		if(ConvEditController.knowledgeTags.length == 0)
		{
			$('.KnowledgeTagID').append('<option value="0">Select</option>');
		}
		for(var i=0; i<loadedKnowledgeTags.length; i++)
		{
			$('#load-knowledge-tags').append('<span data-id="'+loadedKnowledgeTags[i].KnowledgeTagID+'">['+loadedKnowledgeTags[i].TagName+' <span class="menu-style-button" onclick="ConvEditController.DeleteKnowTag('+loadedKnowledgeTags[i].KnowledgeTagID+')">X</span>]</span> ');
			//if new tags then add to all the tag select boxes
			if(i >= ConvEditController.knowledgeTags.length)
			{
				$('.KnowledgeTagID').append('<option value="'+loadedKnowledgeTags[i].KnowledgeTagID+'">'+loadedKnowledgeTags[i].TagName+'</option>');
			}
		}
		if(deletedId > 0)
		{
			//remove deleted tags from select boxes
			$('.KnowledgeTagID').each(function(){
				console.log($(this).find('option[value="'+deletedId+'"]').html()+' delting..');
				$(this).find('option[value="'+deletedId+'"]').remove();
			});
		}
		ConvEditController.knowledgeTags = loadedKnowledgeTags;
		if(ConvEditController.knowledgeTags.length == 0) $('#load-knowledge-tags').append('none');
	}
	var area_id = 0;
	ajax_action('conversation_load_json.php?knowledge_tags', area_id, 0, callback, true);
}

ConvEditController.DeleteKnowTag = function(KnowledgeTagID)
{
	//set data
	var knowledgeTagData = {};
	knowledgeTagData.KnowledgeTagID = KnowledgeTagID;
	
	//'./php/conversation_save.php?'
	var callback = function(data)
	{
		if(data == 'error')
		{
			alert('Conversation uses this Tag, cannot delete');
		}
		else
		{
			ConvEditController.KnowTagLoad(KnowledgeTagID);
			alert('KnowledgeTag Deleted');
		}
	}
	var area_id = GameController.area_id;
	ajax_action('conversation_save.php?knowledge_tags&delete', area_id, knowledgeTagData, callback);
}

ConvEditController.KnowledgeTagNewSave = function()
{
	//set data
	var knowledgeTagData = {};
	knowledgeTagData.TagName = $('#knowledge-tag-name').val();
	
	//'./php/conversation_save.php?'
	var callback = function(data)
	{
		if(data == 'error')
		{
			alert('This tag already exists, cannot create a duplicate');
		}
		else
		{
			$('#knowledge-tag-name').val('');
			ConvEditController.KnowTagLoad();
			alert('KnowledgeTag Saved');
		}
	}
	var area_id = 0;
	ajax_action('conversation_save.php?knowledge_tags', area_id, knowledgeTagData, callback);
	
}
