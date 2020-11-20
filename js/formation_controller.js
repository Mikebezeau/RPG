
var FormationController = FormationController || {};

FormationController.Init = function() //called in 'GameController.init'
{
	//vars
	
	$(document).on("click", ".formation-table-gridbox", function()
	{
		FormationController.ShowFormationMenu(this);
	});
	
	//set formation table'
	var formationHtml='';
	formationHtml += '<tr><td colspan="5" style="height:auto"><span class="fltlft">Back</span><span class="fltrt">Front</span></td></tr><tr>';
	for(i=0; i<5; i++)
	{
		formationHtml += '<tr>';
		for(j=0; j<5; j++)
		{
			formationHtml += '<td id="formation-coord'+j+''+i+'" data-x="'+j+'" class="formation-table-gridbox" data-y="'+i+'"></td>';
		}
		formationHtml += '</tr>';
	}
	$('#formation-table').html(formationHtml);
	
	var clickEvent = 'onclick="$(\'#formation\').fadeOut();"';
	var closeButton = new MenuController.MenuItem('battle_icons/formation.png', 'Close', 0, [])
	$("#formation").append(closeButton.CreateRingIcon(clickEvent, 20, 20, true, false));
}

FormationController.SetFormationMenu = function()
{
	FormationController.formationPartyMenu = [];
	for(var index in GameController.characters)
	{
		if(CharacterController.IsPartyMember(GameController.characters[index]))
		{
			//add character menu
			MenuController.formationPartyMenu.push(
				new MenuController.MenuItem(
					'char/thumb/charthumb_'+GameController.characters[index].character_stats.thumb_pic_id+'.png', 
					GameController.characters[index].character_stats.character_name, 
					'FormationController.FormationSelectCharacter('+index+')', 
					[], 0, 0, index)
			);
		}
	}
}

FormationController.ChangeFormation = function()
{
	MenuController.MenuClose();
	$('#formation').fadeIn();
}

FormationController.SetFormationGrid = function()
{
	$('.formation-table-gridbox').html('');
	for(var i=0; i<GameController.characters.length; i++)
	{
		if(CharacterController.IsPartyMember(GameController.characters[i]))
		{
			var gridSelector = '#formation-coord'+GameController.characters[i].sprite_coords[0]+''+GameController.characters[i].sprite_coords[1];
			$(gridSelector).html('<img src="./images/char/thumb/charthumb_'+GameController.characters[i].character_stats.thumb_pic_id+'.png"/>');
		}
	}
}

FormationController.ShowFormationMenu = function(e)
{
	FormationController.formation_select_coords = $(e).data();
	position = $(e).position();
	//onsole.log(position);
	position.left=position.left+2;
	//position.top=position.top-72;
	MenuController.CreateMenu(-1, CharacterController.GetPartySize(), MenuController.formationPartyMenu, position);
}

FormationController.FormationSelectCharacter = function(character_index)
{
	MenuController.MenuClose();
	//for each character, if there is someone in that spot, make their position -1,-1
	for(var i=0; i<GameController.characters.length; i++)
	{
		if(CharacterController.IsPartyMember(GameController.characters[i]))
		{
			if(GameController.characters[i].sprite_coords == [FormationController.formation_select_coords.x, FormationController.formation_select_coords.y])
			{
				GameController.characters[i].sprite_coords = [-1,-1];
			}
		}
	}
	//place selected character in spot
	GameController.characters[character_index].sprite_coords = [FormationController.formation_select_coords.x, FormationController.formation_select_coords.y];
	FormationController.SetFormationGrid();
}

FormationController.SetFormation = function()
{
	var sprite_count = 0;
	var partysize = CharacterController.GetPartySize();
	if(partysize == 1 || partysize == 2) sprite_count = 1;
	for(var i=0; i<GameController.characters.length; i++)
	{
		if(CharacterController.IsPartyMember(GameController.characters[i]))
		{
			sprite_count = sprite_count+1;
			GameController.characters[i].sprite_coords = [7, sprite_count*3-1];
			if(sprite_count > 3)
			{
				GameController.characters[i].sprite_coords = [5, (sprite_count-3)*3];
			}
			if(sprite_count > 5)
			{
				GameController.characters[i].sprite_coords = [3, (sprite_count-5)*3-1];
			}
			if(sprite_count > 8)
			{
				GameController.characters[i].sprite_coords = [1, (sprite_count-6)*3];
			}
		}
	}
}
