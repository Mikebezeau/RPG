
GameController.init_set_edit_menu_button_events = function()
{
	var game=GameController;
	
	if(game.edit_menu_initialized) return false;
	//dev mode player, only init 1 time
	game.edit_menu_initialized = true;
	
	//main buttons for menus
	$(document.body).on('click','.menu-button',function(){
		$('.toggle-menu').hide();
		$('.toggle-sub-menu').hide();
		var dataShow;
		dataShow = $(this).data('show-id');
		$('#'+dataShow).show();
	});
	//main buttons for sub menus
	$(document.body).on('click','.sub-menu-button',function(){
		var dataShow;
		dataShow = $(this).data('show-id');
		//sub menu shows class with id
		if($('.'+dataShow).css('display') == 'none')
		{
			$('.toggle-sub-menu').hide();
			$('.'+dataShow).show();
		}
		else
		{
			$('.toggle-sub-menu').hide();
		}
	});
	//main buttons for sub menus
	$(document.body).on('click','.sub2-menu-button',function(){
		var dataShow;
		dataShow = $(this).data('show-id');
		//sub menu shows class with id
		if($('.'+dataShow).css('display') == 'none')
		{
			$('.toggle-sub2-menu').hide();
			$('.'+dataShow).show();
		}
		else
		{
			$('.toggle-sub2-menu').hide();
		}
	});
}

GameController.init_set_edit_button_events = function()
{
	var game=GameController;
	
	//FOR CHARACTER EDITOR
	//on clicking sprite image, put image in character edit form and put value in hidden input in form
	$(document).on("click", "#sprite-images img", function()
	{
		var id = $(this).data('name');
		var id = parseInt(id);
		$('#sprite_pic_id').val(id);
		$('#sprite_pic_sample').attr('src',$(this).attr('src'));
		$('#sprite-images').hide();
	});
	
	//on clicking thumb image, put image in character edit form and put value in hidden input in form
	$(document).on("click", "#thumb-images img", function()
	{
		var id = $(this).data('name').replace('charthumb_','');
		//id = parseInt(id);
		$('#thumb_pic_id').val(id);
		$('#thumb_pic_sample').attr('src',$(this).attr('src'));
		$('#thumb-images').hide();
	});
	
	//edit special abilities (NPC/Monster)
	$(document).on("click", ".edit-char-spc .game-menu-item-container-row", function()
	{
		var name = $(this).parent().children('.edit-special-name').val()
		if(name == '')
		{
			alert('Enter name');
			return false;
		}
		var title = 'Ability_'+name;
		var effecttype = 'special';
		var id = $(this).data('id');
		$('#effect-editor-load').html('<h1>LOADING EFFECT EDITOR</h1>');
		$.ajax({
			type: "GET",
			async: true,
			url: './effect-gen.php?title='+title+'&effecttype='+effecttype+'&effecttypeid='+id,
			data: 0
		}).done(function(result){
			$('#effect-editor-load').html(result);
			$('#effect-editor-load #select-icon-image-list').html($('#load-effect-gen-icon-select').html());
			$('#effect-editor-load #select-icon-image-list img').each(function()
			{
				if($(this).data('file') == $('#icon-path').val())
				{
					$(this).css('border','4px solid #00f');
				}
			});
		});
		
		$('#effect-editor-load').show();
	});
	
	//editor buttons
	
	$('#create-new-map').click(function(e)
	{
		//specify characters to remove from description string
		var map_id = $('#map-id-new').val().replace(/[&\/\\#+()$~%'.":*<>{}]/g, '');
	
		var height = $('#map-height').val();
		var width = $('#map-width').val();
		game.create_new_map(map_id,height,width,true);
	});
	
	$('#edit-level-side-bar .menu-button').click(function()
	{
		$('#edit-level-side-bar').css('z-index','1000');
		GameController.UnclickClickedButtons(0);
		$('.edit-map-select').hide();
		$('#object-select-container').hide();
	});
	
	$('#edit-level-side-bar .sub-menu-button').click(function()
	{
		$('.edit-map-select').hide();
		$('#object-select-container').hide();
	});
	
	$('#place-map-walls').click(function()
	{
		GameController.UnclickClickedButtons(this);
		//toggle place_map_walls
		game.place_map_walls = game.place_map_walls ? false : true;
	});

	$('#place-map-pits').click(function()
	{
		GameController.UnclickClickedButtons(this);
		//toggle place_map_pits
		game.place_map_pits = game.place_map_pits ? false : true;
	});
	
	$('#place-map-floors').click(function()
	{
		GameController.UnclickClickedButtons(this);
		//toggle place_map_floors
		game.place_map_floors = game.place_map_floors ? false : true;
	});
	
	$('#place-map-doors').click(function()
	{
		GameController.UnclickClickedButtons(this);
		//toggle place_map_floors
		game.place_map_doors = game.place_map_doors ? false : true;
		$('#place-map-doors').html(game.place_map_doors ? 'Done Placing Doors' : 'Place Doors');
	});
	
	$('#fill-map-area').click(function()
	{
		//toggle place_map_floors
		game.fill_map = game.fill_map ? false : true;
		$('#fill-map-area').html(game.fill_map ? 'Click to Stop Filling' : 'Click to Fill With Selected Terrain');
		if(game.fill_map) $(this).addClass('button-clicked');
		else $(this).removeClass('button-clicked');
	});
	
	$('#menu-button-edit-objects').click(function()
	{
		game.view_objects = 1;
	});
	
	//---
	$('#place-object').click(function()
	{
		GameController.UnclickClickedButtons(this);
		$('.edit-map-select').hide();
		game.place_object_tile_x = -1;
		game.place_object_tile_y = -1;
		
		//toggle
		if(game.place_object == false)
		{
			game.place_object = true;
			$('#place-object').html('Done');
			//show currently selected object tileset
			game.ShowSelectedObjectTileset();
			
			$('#object-select-container').show();
		}
		else
		{
			game.place_object = false;
			$('#place-object').html('Place Object');
			$('#object-select-container').hide();
		}
	});
	//
	$('#object-select-canvas').click(function(e)
	{
		var rect = game.canvas_object_select.getBoundingClientRect();
		var place_object_tile_x = Math.floor((e.clientX - rect.left)/game.tileset_tile_size);
		var place_object_tile_y = Math.floor((e.clientY - rect.top)/game.tileset_tile_size);
		
		//if selecting multiple tiles
		if($('#select-object-tiles').is(':checked'))
		{
			//if tile not already selected
			var tile_already_selected = 0;
			for(var i in game.seleted_object_tiles)
			{
				if(game.seleted_object_tiles[i].place_object_tile_x == place_object_tile_x && game.seleted_object_tiles[i].place_object_tile_y == place_object_tile_y)
				{
					tile_already_selected = 1;
				}
			}
			if(!tile_already_selected)
			{
				//set place_object_tile vars to top left corner of object image box
				if(game.place_object_tile_x < place_object_tile_x) game.place_object_tile_x = place_object_tile_x;
				if(game.place_object_tile_y < place_object_tile_y) game.place_object_tile_y = place_object_tile_y;
				
				game.seleted_object_tiles.push(
					{
						'place_object_tile_x': place_object_tile_x, 
						'place_object_tile_y': place_object_tile_y
					}
				);
				//highlight selected tile on tileset
				game.context_object_select.fillStyle='#ff7';
				game.context_object_select.globalAlpha=0.5;
				game.context_object_select.fillRect(place_object_tile_x*game.tileset_tile_size, place_object_tile_y*game.tileset_tile_size, game.tileset_tile_size, game.tileset_tile_size);
				game.context_object_select.globalAlpha=1;
			}
		}
		//selecting one tile for placement
		else
		{
			game.place_object_tile_x = place_object_tile_x;
			game.place_object_tile_y = place_object_tile_y;
			$('#edit-level-side-bar').css('z-index', '1');
		}
	});
	//
	$('#select-object-tiles').click(function()
	{
		game.seleted_object_tiles.length = 0;
		var tileset_index = game.current_object_tileset;
		//show currently selected object tileset // game.tileset_object[game.current_object_tileset]
		game.context_object_select.fillStyle = '#fff';
		game.context_object_select.fillRect(0, 0, game.canvas_object_select.width, game.canvas_object_select.height);
		game.context_object_select.drawImage(game.tileset_object[tileset_index], 0, 0);
	});
	//---
	
	$('#remove-object').click(function()
	{
		GameController.UnclickClickedButtons(this);
		//toggle remove_object
		game.remove_object = game.remove_object ? false : true;
		$('#remove-object').html(game.remove_object ? 'Done Removing Objects' : 'Remove Objects');
	});
	
	$('#toggle-objects').click(function()
	{
		//don't toggle any buttons
		//toggle view_facade
		game.view_objects = game.view_objects ? false : true;
		//game.redraw_object_bg_graphics = true;
		requestAnimationFrame(GameController.redraw_map_on_player_position);
	});
	
	$('#object-layer-show-fg').click(function()
	{
		//GameController.UnclickClickedButtons(this);
		game.view_only_foreground_objects = game.view_only_foreground_objects ? false : true;
		game.redraw_object_bg_graphics = true;
		game.draw();
	});
	
	$('#object-highlight-roof').click(function()
	{
		//GameController.UnclickClickedButtons(this);
		game.hightlight_facade_objects = game.hightlight_facade_objects ? false : true;
		game.view_selected_area = true;
		game.draw();
	});
	
	//---
	$('#object-toggle-place-facade-or-object').click(function()
	{
		//toggle place_facade_object
		game.place_facade_object = game.place_facade_object ? false : true;
		$('#object-toggle-place-facade-or-object').html(game.place_facade_object ? 'Roof & Wall Covering Layer' : 'Object Layer');
	});
	//
	$(document).on("change", "#object-select-layer input", function()
	{
		game.place_object_layer = $(this).val();
	});
	//---
	
	$('#toggle-facade').click(function()
	{
		//don't toggle any buttons
		//toggle view_facade
		game.view_facade = game.view_facade ? false : true;
		//game.redraw_object_bg_graphics = true;
		requestAnimationFrame(GameController.redraw_map_on_player_position);
	});
	
	$('#toggle-object-layer-click').click(function()
	{
		GameController.UnclickClickedButtons(this);
		//toggle remove_object
		game.reverse_layers = game.reverse_layers ? false : true;
		$('#toggle-object-layer-click').html(game.reverse_layers ? 'Done Reversing Layers' : 'Reverse Roof/Objects Layers');
	});
	
	$('#object-layer-make-bg').click(function()
	{
		//GameController.UnclickClickedButtons(this);
		//make all objects in the background layer
		if(confirm("Are you sure you'd like to push all objects into the background layer?"))
		{
			for(var y=0; y<GameController.object_layer.length; y++)
			{
				for(var x=0; x<GameController.object_layer[0].length; x++)
				{
					for(var index=0; index<GameController.object_layer[y][x].length; index++)
					{
						GameController.object_layer[y][x][index].layer = 0;
					}
				}
			}
			alert('Done');
		}
	});
	
	$('#floor-select').click(function()
	{
		$('.edit-map-select').hide();
		$('#floor-select-canvas').show();
	});
	$('#cancel-current-floor-type').click(function()
	{
		game.context_floor_select_current.clearRect(0,0,game.tileset_tile_size,game.tileset_tile_size);
		game.selected_floor_tile_x = -1;
		game.selected_floor_tile_y = -1;
	});
	$('#floor-select-canvas').click(function(e)
	{
		var rect = game.canvas_floor_select.getBoundingClientRect();
		game.selected_floor_tile_x = Math.floor((e.clientX - rect.left)/game.tileset_tile_size);
		game.selected_floor_tile_y = Math.floor((e.clientY - rect.top)/game.tileset_tile_size);
		game.context_floor_select_current.clearRect(0,0,game.tileset_tile_size,game.tileset_tile_size);
		game.context_floor_select_current.drawImage(game.tileset_floor,
				game.selected_floor_tile_x * game.floor_graphic_tileset_length.x * game.tileset_tile_size, 
				game.selected_floor_tile_y * game.floor_graphic_tileset_length.y * game.tileset_tile_size,
				game.tileset_tile_size, 
				game.tileset_tile_size, 
				0, 
				0, 
				game.tileset_tile_size, 
				game.tileset_tile_size);
	});
	
	$('#wall-select').click(function()
	{
		$('.edit-map-select').hide();
		$('#wall-select-canvas').show();
	});
	$('#cancel-current-wall-type').click(function()
	{
		game.context_wall_select_current.clearRect(0,0,game.tileset_tile_size,game.tileset_tile_size);
		game.selected_wall_tile_x = -1;
		game.selected_wall_tile_y = -1;
	});
	$('#wall-select-canvas').click(function(e)
	{
		var rect = game.canvas_wall_select.getBoundingClientRect();
		game.selected_wall_tile_x = Math.floor((e.clientX - rect.left)/game.tileset_tile_size);
		game.selected_wall_tile_y = Math.floor((e.clientY - rect.top)/game.tileset_tile_size);
		game.context_wall_select_current.clearRect(0,0,game.tileset_tile_size,game.tileset_tile_size);
		game.context_wall_select_current.drawImage(game.tileset_wall,
				(game.selected_wall_tile_x * game.wall_graphic_tileset_length.x + 1) * game.tileset_tile_size, 
				game.selected_wall_tile_y * game.wall_graphic_tileset_length.y * game.tileset_tile_size,
				game.tileset_tile_size, 
				game.tileset_tile_size, 
				0, 
				0, 
				game.tileset_tile_size, 
				game.tileset_tile_size);
	});
	
	$('#pit-select').click(function()
	{
		$('.edit-map-select').hide();
		$('#pit-select-canvas').show();
	});
	$('#cancel-current-pit-type').click(function()
	{
		game.context_pit_select_current.clearRect(0,0,game.tileset_tile_size,game.tileset_tile_size);
		game.selected_pit_tile_x = -1;
		game.selected_pit_tile_y = -1;
	});
	$('#pit-select-canvas').click(function(e)
	{
		var rect = game.canvas_pit_select.getBoundingClientRect();
		game.selected_pit_tile_x = Math.floor((e.clientX - rect.left)/game.tileset_tile_size);
		game.selected_pit_tile_y = Math.floor((e.clientY - rect.top)/game.tileset_tile_size);
		game.context_pit_select_current.clearRect(0,0,game.tileset_tile_size,game.tileset_tile_size);
		game.context_pit_select_current.drawImage(game.tileset_pit,
				game.selected_pit_tile_x * game.pit_graphic_tileset_length.x * game.tileset_tile_size, 
				game.selected_pit_tile_y * game.pit_graphic_tileset_length.y * game.tileset_tile_size,
				game.tileset_tile_size, 
				game.tileset_tile_size, 
				0, 
				0, 
				game.tileset_tile_size, 
				game.tileset_tile_size);
	});
	
	$('#view-events').click(function()
	{
		GameController.UnclickClickedButtons(this);
		game.view_events = game.view_events ? false : true;
		$('#view-events').html(game.view_events ? 'Done Viewing Events' : 'View Events');
		requestAnimationFrame(GameController.redraw_map_on_player_position);
	});
	
	$('#show-edit-descriptions').click(function()
	{
		GameController.DescriptionsShow();	
	});
	
	$('#edit-descriptions-new').click(function()
	{
		GameController.DescriptionNew();
	});
	
	$(document).on('click', '#edit-descriptions-save', function()
	{
		GameController.DescriptionSave();
	});
	
	$(document).on('click', '.edit-descriptions-edit', function()
	{
		var description_index = parseInt($(this).data('description-index'));
		GameController.DescriptionEdit(description_index);
	});
	
	$(document).on('click', '.edit-descriptions-delete', function()
	{
		var description_index = parseInt($(this).data('description-index'));
		GameController.DescriptionDelete(description_index);
	});
	
	$('#place-monster').click(function()
	{
		GameController.UnclickClickedButtons(this);
		//toggle place_npc_monster_sprite
		game.place_npc_monster_sprite = game.place_npc_monster_sprite ? false : 3;
		$('#place-monster').html(game.place_npc_monster_sprite ? 'Done' : 'Place Monster');
	});
	LoadMonsterSelect = function()
	{
		callback = function(data){
			$('#load-place-monster-selection').html(data);
		}
		ajax_action('load_place_character_selection.php',3,0,callback);
	}
	
	$(document).on("change", "#monster-selection", function()
	{
		//onsole.log('monster selected quickstatid'+$('#monster-selection option:selected').val());
		game.place_npc_monster_id = $('#monster-selection option:selected').val();
		game.place_npc_monster_sprite_id = parseInt($('#monster-selection option:selected').data('sprite-id'));
		var place_npc_monster_sprite_file = $('#monster-selection option:selected').data('sprite-file');
		var place_npc_monster_sprite_scale = parseFloat($('#monster-selection option:selected').data('sprite-scale')).toFixed(1);
		game.place_npc_monster_sprite_loaded = 0;
		game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id] = new Image();
		//game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id].src = "./images/char/sprite/char/"+game.place_npc_monster_sprite_id+".png";
		game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id].src = "./images/"+place_npc_monster_sprite_file;
		game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id].sprite_scale = place_npc_monster_sprite_scale;
		game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id].onload = function(){
			game.place_npc_monster_sprite_loaded = 1;
		};
	});
	$('#create-monster').click(function()
	{
		$('#load-create-character').html('<h1>LOADING CHARACTER EDITOR</h1>');
		$('#load-create-character').show();
		//load create character screen
		$.ajax({
			type: "POST",
			async: true,
			url: "./quick_stats_edit.php?new=true&quickstat_id=-1&catagory_id=3&character_id=-1",
			data: 0
		}).done(function(result){
			$('#load-create-character').html(result);
			$('#load-create-character').show();
		});
		
	});
	
	$('#place-npc').click(function()
	{
		GameController.UnclickClickedButtons(this);
		//toggle place_npc_monster_sprite
		game.place_npc_monster_sprite = game.place_npc_monster_sprite ? false : 2;
		$('#place-npc').html(game.place_npc_monster_sprite ? 'Done' : 'Place NPC');
	});
	LoadNpcSelect = function()
	{
		callback = function(data){
			$('#load-place-npc-selection').html(data);
		}
		ajax_action('load_place_character_selection.php',2,0,callback);
	}
	
	$(document).on("change", "#npc-selection", function()
	{
		//onsole.log('npc selected quickstatid'+$('#npc-selection option:selected').val());
		game.place_npc_monster_id = $('#npc-selection option:selected').val();
		game.place_npc_monster_sprite_id = parseInt($('#npc-selection option:selected').data('sprite-id'));
		var place_npc_monster_sprite_file = $('#npc-selection option:selected').data('sprite-file');
		var place_npc_monster_sprite_scale = parseFloat($('#npc-selection option:selected').data('sprite-scale')).toFixed(1);
		game.place_npc_monster_sprite_loaded = 0;
		game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id] = new Image();
		game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id].src = "./images/"+place_npc_monster_sprite_file;
		game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id].sprite_scale = place_npc_monster_sprite_scale;
		game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id].onload = function(){
			game.place_npc_monster_sprite_loaded = 1;
		};
		//onsole.log(game.place_npc_monster_id, game.place_npc_monster_sprite_id, place_npc_monster_sprite_file);
	});
	$('#create-npc').click(function()
	{
		$('#load-create-character').html('<h1>LOADING CHARACTER EDITOR</h1>');
		$('#load-create-character').show();
		//load create character screen
		$.ajax({
			type: "POST",
			async: true,
			url: "./quick_stats_edit.php?new=true&quickstat_id=-1&catagory_id=2&character_id=-1",
			data: 0
		}).done(function(result){
			$('#load-create-character').html(result);
			$('#load-create-character').show();
		});
		
	});
	
	
	$('#place-pc').click(function()
	{
		GameController.UnclickClickedButtons(this);
		//toggle place_npc_monster_sprite
		game.place_npc_monster_sprite = game.place_npc_monster_sprite ? false : 1;
		$('#place-pc').html(game.place_npc_monster_sprite ? 'Done' : 'Place PC');
	});
	LoadPcSelect = function()
	{
		callback = function(data){
			$('#load-place-pc-selection').html(data);
		}
		ajax_action('load_place_character_selection.php',1,0,callback);
	}
	
	$(document).on("change", "#pc-selection", function()
	{
		//onsole.log('npc selected quickstatid'+$('#npc-selection option:selected').val());
		game.place_npc_monster_id = $('#pc-selection option:selected').val();
		game.place_npc_monster_sprite_id = parseInt($('#pc-selection option:selected').data('sprite-id'));
		var place_npc_monster_sprite_file = $('#pc-selection option:selected').data('sprite-file');
		var place_npc_monster_sprite_scale = parseFloat($('#pc-selection option:selected').data('sprite-scale')).toFixed(1);
		game.place_npc_monster_sprite_loaded = 0;
		game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id] = new Image();
		game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id].src = "./images/"+place_npc_monster_sprite_file;
		game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id].sprite_scale = place_npc_monster_sprite_scale;
		game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id].onload = function(){
			game.place_npc_monster_sprite_loaded = 1;
		};
		//onsole.log(game.place_npc_monster_id, game.place_npc_monster_sprite_id, place_npc_monster_sprite_file);
		
		//set href for edit character sheet
		if(game.place_npc_monster_id > -1)
		{
			var href = './character_sheet.php?character_id='+game.place_npc_monster_id;
			$('#edit-pc').attr('href',href);
		}
		else $('#edit-pc').attr('href','');
	});
	
	$('#create-pc').click(function()
	{
		GameController.player.player_id = 99;
		CharacterController.NewCharacter();
	});
	
	$('#edit-pc').click(function()
	{
		if($('#edit-pc').attr('href') == '') return false;
	});
	
	//SUBMIT BUTTON for character create
	$(document).on("click", "#quick-stats-edit-submit", function()
	{
		data = $('#quick_update').serialize();
		$.ajax({
			type: "POST",
			async: true,
			url: "./php/quick_update.php",
			data: data
		})
			.done(function(result){
				LoadPcSelect();
				LoadNpcSelect();
				LoadMonsterSelect();
				alert('Character Saved');
				//no updates need to be done, because character_id and quickstat_id stay the same for updates
			});
		$('#load-create-character').hide();
	});
		
	$(document).on("click", "#quick-stats-edit-done", function()
	{
		$('#load-create-character').hide();
	});
	
	$('#delete-npc-monster').click(function()
	{
		GameController.UnclickClickedButtons(this);
		game.delete_npc_monster = game.delete_npc_monster ? false : true;
		$('#delete-npc-monster').html(game.delete_npc_monster ? 'Click NPC/Monster to Delete' : 'Delete NPC/Monster');
	});
	
	$('#btn-edit-npc-monster').click(function()
	{
		GameController.UnclickClickedButtons(this);
		game.edit_npc_monster = game.edit_npc_monster ? false : true;
		$('#btn-edit-npc-monster').html(game.edit_npc_monster ? 'Click NPC/Monster to Edit' : 'Edit NPC/Monster');
	});
	
	$('#select-start-point').click(function()
	{
		GameController.UnclickClickedButtons(this);
		game.select_start_point = game.select_start_point ? false : true;
		$('#select-start-point').html(game.select_start_point ? 'Done Selecting Start' : 'Select Start Point');
	});
	
	$('#save-map').click(function()
	{
		//specify characters to remove from description string
		var map_id = $('#map-id').val().replace(/[&\/\\#+()$~%'.":*<>{}]/g, '');
		game.save_map_file(map_id);
	});
	
	$('#load-map').click(function()
	{
		game.load_level($('#load-area-id').val());
	});
	
	$('#test-burst').click(function()
	{
		GameController.UnclickClickedButtons(this);
		game.test_burst = game.test_burst ? false : true;
		$('#test-burst').html(game.test_burst ? 'Done' : 'Test Burst');
	});
	
	$('#test-wall-graphics').click(function()
	{
		//don't toggle any buttons
		game.show_tileset_graphics = game.show_tileset_graphics ? false : true;
		game.redraw_wall_graphics = 1;
		if(game.show_tileset_graphics)
		{
			//redraw objects and facade
			game.view_objects = 1;
			game.view_facade = 1;
			//game.redraw_object_bg_graphics = 1;
		}
		game.calc_wall_and_floor_graphics();
		requestAnimationFrame(GameController.redraw_map_on_player_position);
	});
}
GameController.UnclickClickedButtons = function(e)
{
	//if e == 0 then calling button doesn't have or receive button-clicked class, only unclick buttons
	if(e == 0 || !$(e).hasClass('button-clicked'))
	{
		$('.button-clicked').each(function()
		{
			$(this).trigger('click');
		});
		$('.button-clicked').removeClass('button-clicked');
		if(e != 0)
		{
			$(e).addClass('button-clicked');
		}
	}
	else
	{
		$(e).removeClass('button-clicked');
	}
}
GameController.init_set_edit_mouse_events = function()
{
	var game=GameController;

	$(document.body).on('click','#page-top-graphic #edit-menu-top-menu',function()
	{
		if($('#edit-level-side-bar').css('z-index') == '1')
		{
			$('#edit-level-side-bar').css('z-index','1000');
		}
		else
		{
			$('#edit-level-side-bar').css('z-index', '1');
			$('.edit-map-select').hide();
		}
	});
	
	$(document.body).on('click','#page-top-graphic #map-buttons-left',function(e)//touchend
	{
		game.edit_start_x = game.edit_start_x - Math.floor(GameController.game_screen_num_tiles_width/2)/GameController.map_scale;
		game.edit_start_x = game.edit_start_x < 0 ? 0 : game.edit_start_x;
		game.redraw_characters = 1;
		requestAnimationFrame(GameController.redraw_map_on_player_position);
	});
	
	$(document.body).on('click','#page-top-graphic #map-buttons-up',function(e)//touchend
	{
		game.edit_start_y = game.edit_start_y - Math.floor(GameController.game_screen_num_tiles_height/2)/GameController.map_scale;
		game.edit_start_y = game.edit_start_y < 0 ? 0 : game.edit_start_y;
		game.redraw_characters = 1;
		requestAnimationFrame(GameController.redraw_map_on_player_position);
	});
	
	$(document.body).on('click','#page-top-graphic #map-buttons-right',function(e)//touchend
	{
		game.edit_start_x = game.edit_start_x + Math.floor(GameController.game_screen_num_tiles_width/2)/GameController.map_scale;
		game.edit_start_x = 
			Math.ceil(game.edit_start_x+game.game_screen_num_tiles_width/GameController.map_scale) > Math.ceil(game.get_area_width()) 
			? game.get_area_width() - game.game_screen_num_tiles_width/GameController.map_scale : game.edit_start_x;
		game.redraw_characters = 1;
		requestAnimationFrame(GameController.redraw_map_on_player_position);
	});
	
	$(document.body).on('click','#page-top-graphic #map-buttons-down',function(e)//touchend
	{
		game.edit_start_y = game.edit_start_y + Math.floor(GameController.game_screen_num_tiles_height/2)/GameController.map_scale;
		game.edit_start_y = 
			Math.ceil(game.edit_start_y+game.game_screen_num_tiles_height/GameController.map_scale) > game.get_area_height() 
			? game.get_area_height() - game.game_screen_num_tiles_height/GameController.map_scale : game.edit_start_y;
		game.redraw_characters = 1;
		requestAnimationFrame(GameController.redraw_map_on_player_position);
	});
	
	$('#object-select-tileset-select').click(function()
	{
		$('#object-select-canvas').hide();
		$('#object-tileset-select-container').show();
	});
	
	$('.object-tileset-select').click(function()
	{
		game.current_object_tileset = parseInt($(this).data('tileset-index'));
		game.ShowSelectedObjectTileset();
		$('#object-tileset-select-container').hide();
		$('#object-select-canvas').show();
	});
	
	$('#object-select-close').click(function()
	{
		$('#object-select-container').hide();
	});
	
	$('.edit-map-select').click(function()
	{
		$('.edit-map-select').hide();
	});
	
	$('#edit-level-side-bar').mouseover(function()
	{
		$('#edit-level-side-bar').css('z-index','1000');
	});
	$('#map-editor').mouseover(function()
	{
		$('#edit-level-side-bar').css('z-index','1');
	});
	/*
	$('#edit-level-side-bar').mouseout(function()
	{
		$('#edit-level-side-bar').css('height','75px').css('overflow','hidden');
	});
	*/
	var leftButtonDown = false;
	$(document).mousedown(function(e){
			// Left mouse button was pressed, set flag
			if(e.which === 1) leftButtonDown = true;
	});
	$(document).mouseup(function(e){
			// Left mouse button was released, clear flag
			if(e.which === 1) leftButtonDown = false;
	});
	
	$('#canvas').mousemove(function(e)
	{
		//if mouse is on a new tile
		var t = game.tile_size()
		var rect = game.canvas.getBoundingClientRect();
		var mouseY = Math.floor((e.clientY - rect.top)/t);
		var mouseX = Math.floor((e.clientX - rect.left)/t);
		if(game.player_mouse_grid_x != mouseX || game.player_mouse_grid_y != mouseY)
		{
			var player_mouse_grid_x_old = game.player_mouse_grid_x;
			var player_mouse_grid_y_old = game.player_mouse_grid_y;
			game.player_mouse_grid_x = mouseX;
			game.player_mouse_grid_y = mouseY;
			//show selected object, follows the mouse
			if(game.place_object_tile_x > -1 && game.place_object_tile_y > -1)
			{
				//placing all tiles in tileset, show entire tileset image
				if($('#place-all-object-tiles').is(':checked'))
				{
					game.context_select.clearRect(
						~~(player_mouse_grid_x_old*t), 
						~~(player_mouse_grid_y_old*t), 
						~~(game.tileset_object[game.current_object_tileset].naturalWidth), 
						~~(game.tileset_object[game.current_object_tileset].naturalHeight));
					
					game.context_select.drawImage(game.tileset_object[game.current_object_tileset], 
						0, 
						0, 
						~~(game.tileset_object[game.current_object_tileset].naturalWidth), 
						~~(game.tileset_object[game.current_object_tileset].naturalHeight), 
						~~(mouseX*t), 
						~~(mouseY*t), 
						~~(game.tileset_object[game.current_object_tileset].naturalWidth * game.map_scale), 
						~~(game.tileset_object[game.current_object_tileset].naturalHeight * game.map_scale)
						);
				}
				
				//if placing user selected tiles
				else if($('#select-object-tiles').is(':checked'))
				{
					//for each of selected tiles
					for(var i in game.seleted_object_tiles)
					{
						//offset so that selected tiles are positioned as close as possible to player mouse click location (top left of object group)
						//old mouse grid position
						var place_map_tile_y = player_mouse_grid_y_old + game.seleted_object_tiles[i].place_object_tile_y - game.place_object_tile_y;
						var place_map_tile_x = player_mouse_grid_x_old + game.seleted_object_tiles[i].place_object_tile_x - game.place_object_tile_x;
						
						//clear area in context_select on old position
						game.context_select.clearRect(
							~~(place_map_tile_x*t), 
							~~(place_map_tile_y*t), 
							~~((place_map_tile_x+1)*t), 
							~~((place_map_tile_y+1)*t));
					}
					//for each of selected tiles
					for(var i in game.seleted_object_tiles)
					{
						//offset so that selected tiles are positioned as close as possible to player mouse click location (top left of object group)
						//new mouse grid position
						var place_map_tile_y = mouseY + game.seleted_object_tiles[i].place_object_tile_y - game.place_object_tile_y;
						var place_map_tile_x = mouseX + game.seleted_object_tiles[i].place_object_tile_x - game.place_object_tile_x;
						
						//draw area in context_select in new position
						game.context_select.drawImage(game.tileset_object[game.current_object_tileset], 
						~~(game.seleted_object_tiles[i].place_object_tile_x * game.tileset_tile_size), 
						~~(game.seleted_object_tiles[i].place_object_tile_y * game.tileset_tile_size), 
						~~(game.tileset_tile_size), 
						~~(game.tileset_tile_size), 
						~~(place_map_tile_x*t), 
						~~(place_map_tile_y*t), 
						t, t);
					}
				}
				//if placing single tile
				else
				{
					game.context_select.clearRect(
						~~(player_mouse_grid_x_old*t), 
						~~(player_mouse_grid_y_old*t), 
						~~((player_mouse_grid_x_old+1)*t), 
						~~((player_mouse_grid_y_old+1)*t));
					game.context_select.drawImage(game.tileset_object[game.current_object_tileset], 
						~~(game.place_object_tile_x * game.tileset_tile_size), 
						~~(game.place_object_tile_y * game.tileset_tile_size), 
						~~(game.tileset_tile_size), 
						~~(game.tileset_tile_size), 
						~~(mouseX*t), 
						~~(mouseY*t), 
						t, t);
				}
			}
			//player may draw continuously by holding down the mouse button
			if(leftButtonDown && (game.remove_object || game.place_map_pits || game.place_map_walls || game.place_map_floors || game.place_map_doors))
			{
				$('#canvas').trigger('mousedown');
			}
			//show monster sprite, follows the mouse
			if(game.place_npc_monster_sprite && game.place_npc_monster_sprite_loaded)
			{
				//save context and scale sprite
				game.context_select.clearRect(
					~~((player_mouse_grid_x_old-1)*t), 
					~~((player_mouse_grid_y_old-2)*t), 
					~~((player_mouse_grid_x_old+2)*t), 
					~~((player_mouse_grid_y_old+1)*t));
				game.context_select.save();
				var this_sprite_scale = game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id].sprite_scale;
				game.context_select.scale(this_sprite_scale*game.scale_sprite*game.map_scale, this_sprite_scale*game.scale_sprite*game.map_scale);
				var offsetX = t/game.map_scale/3.5/this_sprite_scale/game.scale_sprite;
				var offsetY = t/game.map_scale/10/this_sprite_scale/game.scale_sprite;
				var positionY = (t*0.5 - game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id].naturalHeight);
				var positionX = (t*0.5 - game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id].naturalWidth) / 2;
				game.context_select.drawImage(
					game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id], 
					~~((mouseX*t)*(1/this_sprite_scale/game.scale_sprite/game.map_scale)+offsetX+positionX), 
					~~((mouseY*t+t*0.5)*(1/this_sprite_scale/game.scale_sprite/game.map_scale)+offsetY+positionY));
				game.context_select.restore();
			}
		}
	}).mouseout(function(){
		if((game.place_object_tile_x > -1 && game.place_object_tile_y > -1) || (game.place_npc_monster_sprite && game.place_npc_monster_sprite_loaded))
		{
			game.context_select.clearRect(0, 0, game.canvas.width, game.canvas.height);
		}
	});
	
	$('#canvas').mousedown(function()
	{
		var tileset_type_layer = game.tileset_type_layer;
		
		var clickY = game.edit_start_y + game.player_mouse_grid_y;
		var clickX = game.edit_start_x + game.player_mouse_grid_x;
		$('#output-mapinfo').val('AreaID: ' + game.area_id + ', Y: ' + clickY + ', X: ' + clickX + "\nTerrian type: " + game.floor_wall_pit_fence_door_layer[clickY][clickX]);
		var character_id = -1;
		if(game.character_layer[clickY][clickX] != 0)
		{
			character_id = game.character_layer[clickY][clickX].character_id;
			var conversation_id = game.characters[game.character_layer[clickY][clickX].character_index].character_stats.conversation_id;
			$('#output-mapinfo').val($('#output-mapinfo').val() + "\nCharID: "+character_id + ', ConvID: '+conversation_id);
			//load up character conversation
			if(conversation_id != 0)
			{
				ConvEditController.ConversationLoad(true, conversation_id, game.character_layer[clickY][clickX].character_index);
			}
			
		}
		if(game.event_layer[clickY][clickX] != 0)
		{
			$('#output-mapinfo').val($('#output-mapinfo').val() + "\nEventID: " + game.event_layer[clickY][clickX]);
		}
		
		//output objects and layer controls
		$('#object-layer-controls-load').html('');
		if(GameController.object_layer[clickY][clickX].length > 0)
		{
			var html = '';
			for(var i=0; i<GameController.object_layer[clickY][clickX].length; i++)
			{
				html += '<div data-object-index="'+i+'">'+(game.tileset_object[game.object_layer[clickY][clickX][i].tileset_index].src.substring(25))+' layer: ';
				html += '<input type="checkbox" onclick="GameController.ChangeObjLayer(this,'+clickY+','+clickX+');" data-object-layer="0"/>';
				html += '<input type="checkbox" onclick="GameController.ChangeObjLayer(this,'+clickY+','+clickX+');" data-object-layer="1"/>';
				html += '<input type="checkbox" onclick="GameController.ChangeObjLayer(this,'+clickY+','+clickX+');" data-object-layer="2"/></div>';
			}
			$('#object-layer-controls-load').append(html);
		}
		
		//give options for allowWalk and blockWalk
		
		
		
		//tileset_type_layer[y][x][0][0] = wall tilset start y tile
		//tileset_type_layer[y][x][0][1] = wall tilset start x tile
		//tileset_type_layer[y][x][1][0] = floor tilset start y tile
		//tileset_type_layer[y][x][1][1] = floor tilset start x tile
		//tileset_type_layer[y][x][2][0] = pit tilset start y tile
		//tileset_type_layer[y][x][2][1] = pit tilset start x tile
		
		
		if(game.edit_npc_monster)
		{
			if(character_id >= 0)
			{
				//found character to edit
				//load character editor
				$('#load-create-character').html('<h1>LOADING CHARACTER EDITOR</h1>');
				$('#load-create-character').show();
				//load create character screen
				var character = game.characters[game.character_layer[clickY][clickX].character_index];
				//catagory_id 3=monster 2=NPC
				var catagory_id = character.character_stats.GoodGuy == 0 ? 3 : 2;
				var quickstat_id = character.quick_stat_id;
				$.ajax({
					type: "POST",
					async: true,
					url: "./quick_stats_edit.php?new=false&quickstat_id="+quickstat_id+"&catagory_id="+catagory_id+"&character_id="+character_id,
					data: 0
				}).done(function(result){
					$('#load-create-character').html(result);
					$('#load-create-character').show();
				});
			}
			return true;
		}
		
		else if(game.fill_map)
		{
			//get fill area, based on tile type and if floor, wall, or pit
			game.select_layer = game.get_fill_area(clickY,clickX);
			
			var selected_tyle_type = -1;
			if(game.place_map_floors)
			{
				//make selected tiles all floor type
				selected_tyle_type = 0;
			}
			if(game.place_map_walls)
			{
				//make selected tiles all wall type
				selected_tyle_type = 1;
				//if current wall selection is a fence, make it a fence type fill
				//fences are the wall sets in the top row of the tileset 
				//make trees same as fence, row 17 (when starting from 0) 
				if(game.selected_wall_tile_y == 0 || game.selected_wall_tile_y == 17)
				{
					selected_tyle_type = 3;
				}
				
			}
			if(game.place_map_pits)
			{
				//make selected tiles all pit type
				selected_tyle_type = 2;
			}
			
			//loop through select_layer and change tiles in floor_wall_pit_fence_door_layer accordingly
			var start_y = 0;
			var start_x = 0;
			var end_y = game.get_area_height();
			var end_x = game.get_area_width();

			for(var y=start_y; y < end_y; y++)
			{
				for(var x=start_x; x < end_x; x++)
				{
					if(game.select_layer[y][x] != 0)
					{
						//if filling with a different tileset type
						if(game.selected_wall_tile_x > -1)
						{
							tileset_type_layer[y][x][0][0] = game.selected_wall_tile_y
							tileset_type_layer[y][x][0][1] = game.selected_wall_tile_x
						}
						if(game.selected_floor_tile_x > -1)
						{
							tileset_type_layer[y][x][1][0] = game.selected_floor_tile_y
							tileset_type_layer[y][x][1][1] = game.selected_floor_tile_x
						}
						if(game.selected_pit_tile_x > -1)
						{
							tileset_type_layer[y][x][2][0] = game.selected_pit_tile_y
							tileset_type_layer[y][x][2][1] = game.selected_pit_tile_x
						}
						
						//if changing selected area to floor, wall, pit, fence
						if(selected_tyle_type > -1)
						{
							game.floor_wall_pit_fence_door_layer[y][x] = selected_tyle_type;
						}
					}
				}
			}
			
			//game.view_selected_area = true;
			game.calc_wall_and_floor_graphics();
			game.redraw_wall_graphics = true;
			requestAnimationFrame(GameController.redraw_map_on_player_position);
			return true;
		}
		
		else if(game.place_map_floors)
		{
			game.floor_wall_pit_fence_door_layer[clickY][clickX] = 0;
			if(game.selected_floor_tile_x > -1)
			{
				tileset_type_layer[clickY][clickX][1][0] = game.selected_floor_tile_y
				tileset_type_layer[clickY][clickX][1][1] = game.selected_floor_tile_x
			}
			//set to re-draw graphic layer
			game.redraw_mouse_region = true;
			//re-calculate wall/floor/pit graphics
			game.calc_wall_and_floor_graphics();
			//Update the image
			requestAnimationFrame(GameController.redraw_map_on_player_position);
			return true;
		}
		
		else if(game.place_map_walls)
		{
			//placing a solid wall(1) or fence(3)
			//fences are the wall sets in the top row of the tileset 
			if(game.selected_wall_tile_y == 0 || game.selected_wall_tile_y == 17)
				game.floor_wall_pit_fence_door_layer[clickY][clickX] = 3;
			else
				game.floor_wall_pit_fence_door_layer[clickY][clickX] = 1;
			
			if(game.selected_wall_tile_x > -1)
			{
				tileset_type_layer[clickY][clickX][0][0] = game.selected_wall_tile_y
				tileset_type_layer[clickY][clickX][0][1] = game.selected_wall_tile_x
			}
			//set to re-draw graphic layer
			game.redraw_mouse_region = true;
			//re-calculate wall/floor/pit graphics
			game.calc_wall_and_floor_graphics();
			//Update the image
			requestAnimationFrame(GameController.redraw_map_on_player_position);
			return true;
		}
		
		else if(game.place_map_pits)
		{
			game.floor_wall_pit_fence_door_layer[clickY][clickX] = 2;
			if(game.selected_pit_tile_x > -1)
			{
				tileset_type_layer[clickY][clickX][2][0] = game.selected_pit_tile_y
				tileset_type_layer[clickY][clickX][2][1] = game.selected_pit_tile_x
			}
			//set to re-draw graphic layer
			game.redraw_mouse_region = true;
			//re-calculate wall/floor/pit graphics
			game.calc_wall_and_floor_graphics();
			//Update the image
			requestAnimationFrame(GameController.redraw_map_on_player_position);
			return true;
		}
		
		else if(game.place_map_doors)
		{
			game.floor_wall_pit_fence_door_layer[clickY][clickX] = 4;
			//if(game.selected_door_tile_x > -1)
			//{
			//	tileset_type_layer[clickY][clickX][3][0] = game.selected_door_tile_y
			//	tileset_type_layer[clickY][clickX][3][1] = game.selected_door_tile_x
			//}
			if(game.selected_floor_tile_x > -1)
			{
				tileset_type_layer[clickY][clickX][1][0] = game.selected_floor_tile_y
				tileset_type_layer[clickY][clickX][1][1] = game.selected_floor_tile_x
			}
			//set to re-draw graphic layer
			game.redraw_mouse_region = true;
			//re-calculate wall/floor/pit graphics
			game.calc_wall_and_floor_graphics();
			//Update the image
			requestAnimationFrame(GameController.redraw_map_on_player_position);
			return true;
		}
		
		else if(game.place_object || game.place_facade_object && !game.remove_object)
		{
			
			//if selected to draw all tiles in tileset
			if($('#place-all-object-tiles').is(':checked'))
			{
				//get num tiles width and height
				var num_tile_width = Math.floor(game.tileset_object[game.current_object_tileset].naturalWidth / game.tileset_tile_size);
				var num_tile_height = Math.floor(game.tileset_object[game.current_object_tileset].naturalHeight / game.tileset_tile_size);
				var object_or_facade_layer = game.place_object ? game.object_layer : game.facade_layer;
				//game.place_object_layer: 0 = background, 1 = midground, 2 = foreground
				for(var gridOffsetY = 0; gridOffsetY < num_tile_height; gridOffsetY++)
				{
					for(var gridOffsetX = 0; gridOffsetX < num_tile_width; gridOffsetX++)
					{
						var object = {
							'tileset_pos': [gridOffsetY, gridOffsetX],//if selecting specific tiles, change this
							'layer': game.place_object_layer,
							'tileset_index': game.current_object_tileset
						};
						var mapPosX = clickX + gridOffsetX;
						var mapPosY = clickY + gridOffsetY;
						if(object_or_facade_layer[mapPosY][mapPosX] == 0)
						{
							object_or_facade_layer[mapPosY][mapPosX] = [];
						}
						object_or_facade_layer[mapPosY][mapPosX].push(object);
					}
				}
				//redraw all visible map tiles
				//game.redraw_object_bg_graphics = true;//don't need this
			}
			else if($('#select-object-tiles').is(':checked'))
			{
				//for each of selected tiles
				for(var i in game.seleted_object_tiles)
				{
					var object_piece_pos_x = game.seleted_object_tiles[i].place_object_tile_x;
					var object_piece_pos_y = game.seleted_object_tiles[i].place_object_tile_y;
					
					//offset so that selected tiles are positioned as close as possible to player mouse click location (top left of object group)
					var place_map_tile_y = clickY + object_piece_pos_y - game.place_object_tile_y;
					var place_map_tile_x = clickX + object_piece_pos_x - game.place_object_tile_x;
					
					//if on map
					if(
							place_map_tile_y >= 0 && place_map_tile_y < game.area_height && 
							place_map_tile_x >= 0 && place_map_tile_x < game.area_width
						)
					{
						//set object object
						var object = {
							'tileset_pos': [object_piece_pos_y, object_piece_pos_x],
							'layer': game.place_object_layer,
							'tileset_index': game.current_object_tileset
						}; 
						
						if(game.place_facade_object)
						{
							if(game.facade_layer[place_map_tile_y][place_map_tile_x] == 0)
							{
								game.facade_layer[place_map_tile_y][place_map_tile_x] = [];
							}
							game.facade_layer[place_map_tile_y][place_map_tile_x].push(object);
						}
						else
						{
							if(game.object_layer[place_map_tile_y][place_map_tile_x] == 0)
							{
								game.object_layer[place_map_tile_y][place_map_tile_x] = [];
							}
							game.object_layer[place_map_tile_y][place_map_tile_x].push(object);
						}
					}
				}
			}
			else
			{
				var object = {
					'tileset_pos': [game.place_object_tile_y, game.place_object_tile_x],
					'layer': game.place_object_layer,
					'tileset_index': game.current_object_tileset
				};
				
				if(game.place_facade_object)
				{
					if(game.facade_layer[clickY][clickX] == 0)
					{
						game.facade_layer[clickY][clickX] = [];
					}
					game.facade_layer[clickY][clickX].push(object);
				}
				else
				{
					if(game.object_layer[clickY][clickX] == 0)
					{
						game.object_layer[clickY][clickX] = [];
					}
					game.object_layer[clickY][clickX].push(object);
				}
				//only redraw area around mouse
				game.redraw_mouse_region = true;
			}
			
			//set to re-draw graphic layer
			//Update the image
			requestAnimationFrame(GameController.redraw_map_on_player_position);
			return true;
		}
		
		//onsole.log(game.reverse_layers);
		if(game.reverse_layers)
		{
			var facade = game.facade_layer[clickY][clickX];
			var object = game.object_layer[clickY][clickX];
			
			game.facade_layer[clickY][clickX] = object;
			game.object_layer[clickY][clickX] = facade;
			
			//Update the image
			//only redraw area around mouse
			game.redraw_mouse_region = true;
			requestAnimationFrame(GameController.redraw_map_on_player_position);
			return true;
		}
		
		//onsole.log(game.remove_object);
		if(game.remove_object)
		{
			//onsole.log(game.place_facade_object);
			if(game.place_facade_object)
			{
				if(game.facade_layer[clickY][clickX] != 0)
				{
					game.facade_layer[clickY][clickX].pop();
					if(game.facade_layer[clickY][clickX].length == 0)
					{
						game.facade_layer[clickY][clickX] = 0
					}
				}
			}
			else
			{
				if(game.object_layer[clickY][clickX] != 0)
				{
					game.object_layer[clickY][clickX].pop();
					if(game.object_layer[clickY][clickX].length == 0)
					{
						game.object_layer[clickY][clickX] = 0
					}
				}
			}
			//set to re-draw graphic layer
			//game.redraw_object_bg_graphics = true;//don't need this
			//Update the image
			//only redraw area around mouse
			game.redraw_mouse_region = true;
			requestAnimationFrame(GameController.redraw_map_on_player_position);
			return true;
		}
		
		else if(game.place_npc_monster_sprite)
		{
			//create a new monster character based on template where QuickStatsID = selected value
			callback = function(data){
				data = $.parseJSON(data);
				
				var character_id = data.character_id;
				
				//remove this character if already exists on map (only possible for PCs)
				remove_pc_loop:
				for(var i=0; i<game.characters.length; i++)
				{
					if(game.characters[i].character_stats.character_id == character_id)
					{
						game.characters.splice(i, 1);
						break remove_pc_loop;
					}
				}
				
				data.GoodGuy = 0;
				game.characters.push(
					{
						'character_stats': data,
						'quick_stat_id': data.quick_stat_id,
						'PC': 0,
						'party_id': -1,
						'in_encounter': 0,
						'highlight': 0,
						'x': data.x_pos,
						'y': data.y_pos,
						'character_sprite': game.place_npc_monster_sprite_images[game.place_npc_monster_sprite_id],
						'sprite_coords': [-1,-1],
						'sprite_offset': [0,0]
					}
				);
				var index=game.characters.length-1;
				game.character_layer[data.y_pos][data.x_pos] = {'character_id':data.character_id, 'character_index':index};
			};
			var areaId = GameController.area_id;
			var quick_stat_catagory_id = game.place_npc_monster_sprite;
			//placing monster
			if(quick_stat_catagory_id == 3)
			{
				var place_npc_monster_name = $('#monster-selection option:selected').html();
				var place_npc_monster_thumb_pic_id = $('#monster-selection option:selected').data('thumb-pic-id');
			}
			//placing npc
			else if(quick_stat_catagory_id == 2)
			{
				var place_npc_monster_name = $('#npc-selection option:selected').html();
				var place_npc_monster_thumb_pic_id = $('#npc-selection option:selected').data('thumb-pic-id');
			}
			//placing npc
			else if(quick_stat_catagory_id == 1)
			{
				var place_npc_monster_name = $('#pc-selection option:selected').html();
				var place_npc_monster_thumb_pic_id = $('#pc-selection option:selected').data('thumb-pic-id');
			}
			if(game.place_npc_monster_sprite_loaded)
			{
				ajax_action('create_npc_monster.php', game.place_npc_monster_id, {'AreaID': areaId, 'x': clickX, 'y': clickY, 'name': place_npc_monster_name, 'quick_stat_catagory_id': quick_stat_catagory_id, 'sprite_id': game.place_npc_monster_sprite_id, 'thumb_pic_id': place_npc_monster_thumb_pic_id},callback,false);
			}
			//Update the image
			game.redraw_characters = true;
			requestAnimationFrame(GameController.redraw_map_on_player_position);
			return true;
		}
		
		else if(game.delete_npc_monster)
		{
			callback = function(data){}
			var character_id = game.character_layer[clickY][clickX].character_id;
			ajax_action('edit_map_delete_npc_monster.php', character_id, 0,callback);
			
			delete_npc_monster_loop:
			for(var i = 0; i < game.characters.length; i++)
			{
				if(game.characters[i].character_stats.character_id == character_id)
				{
					game.characters.splice(i, 1);
					break delete_npc_monster_loop;
				}
			}
			game.character_layer[clickY][clickX] = 0;
			//Update the image
			game.redraw_characters = true;
			requestAnimationFrame(GameController.redraw_map_on_player_position);
			return true;
		}
		
		else if(game.select_start_point)
		{
			game.select_layer[clickY][clickX] = 1;
			game.map_start_y = clickY;
			game.map_start_x = clickX;
			game.view_selected_area = true;
			game.redraw_characters = true;
			requestAnimationFrame(GameController.redraw_map_on_player_position);
			return true;
		}
		
		else if(game.test_burst)
		{
			game.burst_radius(game.select_layer,clickY,clickX,parseInt($('#test-burst-size').val()));
			game.view_selected_area = true;
			requestAnimationFrame(GameController.redraw_map_on_player_position);
			return true;
		}
		//if not editing, position center of map where player clicked
		else
		{
			game.edit_start_x = clickX - Math.floor(GameController.game_screen_num_tiles_width/2)/GameController.map_scale;
			game.edit_start_y = clickY - Math.floor(GameController.game_screen_num_tiles_height/2)/GameController.map_scale;
			game.edit_start_x = game.edit_start_x < 0 ? 0 : game.edit_start_x;
			game.edit_start_y = game.edit_start_y < 0 ? 0 : game.edit_start_y; 
			game.edit_start_x = game.edit_start_x > GameController.get_area_width() - Math.ceil(GameController.game_screen_num_tiles_width/GameController.map_scale) ? GameController.get_area_width() - Math.ceil(GameController.game_screen_num_tiles_width/GameController.map_scale) : game.edit_start_x;
			game.edit_start_y = game.edit_start_y > GameController.get_area_height() - Math.ceil(GameController.game_screen_num_tiles_height/GameController.map_scale) ? GameController.get_area_height() - Math.ceil(GameController.game_screen_num_tiles_height/GameController.map_scale) : game.edit_start_y;
			game.redraw_characters = 1;
			requestAnimationFrame(GameController.redraw_map_on_player_position);
		}
		
	});
}
GameController.SaveAdventure = function()
{
	var AdventureSaveCallback = function()
	{
		alert('Adventure Saved');
	}
	var data = {
			'AdventureID':0,//$('#edit-page-adventure-id').val(),
			'StartAreaID':$('#edit-page-adventure-start-map-load #start-map-selection').val(),
			'StartEventID':$('#edit-page-adventure-start-eventid').val(),
			'Image':'',
			'Title': $('#edit-page-adventure-title').val(),
			'Description':''
		};
	ajax_action('edit/adventure_save.php', 0, data, AdventureSaveCallback);
}

GameController.ChangeObjLayer = function(e, clickY, clickX)
{
	var layer = parseInt($(e).data('object-layer'));
	var index = parseInt($(e).parent().data('object-index'));
	GameController.object_layer[clickY][clickX][index].layer = layer;
	requestAnimationFrame(GameController.redraw_map_on_player_position);
}

GameController.ShowSelectedObjectTileset = function()
{
	var game = GameController;
	var tileset_index = game.current_object_tileset;
	//show currently selected object tileset // game.tileset_object[game.current_object_tileset]
	game.canvas_object_select.height = game.tileset_object[tileset_index].naturalHeight;
	game.canvas_object_select.width = game.tileset_object[tileset_index].naturalWidth;
	game.context_object_select.fillStyle = '#fff';
	game.context_object_select.fillRect(0, 0, game.canvas_object_select.width, game.canvas_object_select.height);
	game.context_object_select.drawImage(game.tileset_object[tileset_index], 0, 0);
}
GameController.edit_level = function(area_id)
{
	if(arguments.length < 1) area_id = 0;
	
	var game=GameController;
	
	$('#game-screen-container').show();
	$('#edit-level-side-bar').css('z-index','1000');
	
	if(!game.edit_initialized)
	{
		game.edit_initialized = true;
		game.init_load_all_tilesets();
		game.init_set_edit_menu_button_events();
		game.init_set_edit_button_events();
		game.init_set_edit_mouse_events();
	}
	
	game.edit = true;
	//trigger to place column-1 on the left side of screen
	$(window).trigger('resize');
	game.view_events = 1;
	game.area_id = area_id;
	EventEditController.Init();
	EventEditController.EventNew();
	EventEditController.ShowAllEvent();
	ConvEditController.Init();
	ConvEditController.ShowAllConversation();
	//x,y to control where on map player is editing
	game.edit_start_x = 0;
	game.edit_start_y = 0;
	
	$('#map-editor').css('top','100px');
	//$('#game-screen-container').css('top','150px');
	$('#play-menu-icon-container').hide();
	$('#edit-level-side-bar').show();
	$('#map-editor').show();
	$('#game-map-buttons').css('display','none');
	//$('#map-editor').css('max-width','740px').css('max-height','640px').css('overflow','scroll');
		
	//place buttons
	$('#page-top-graphic').html($('#edit-map-buttons').html());
	
	$('#page-top-graphic').append('<div id="edit-menu-top-menu" class="game-menu-item-container-row fltrt">'+
				'<img style="position:absolute; top:0; left:0;" src="images/battle_icons/blank.png"/>'+
				'<img id="game-menu-top-menu-icon" style="position:relative;" src="./images/battle_icons/menu.png"/>'+
				'<div style="position:relative;"><span style="background-color:#000;">Menu</span></div>'+
			'</div>');
	
	$('#page-top-graphic').append('<div id="zoom-in" class="game-menu-item-container-row fltrt" onclick="GameController.zoom_in();">'+
							'<img style="position:absolute; top:0; left:0;" src="images/battle_icons/blank.png"/>'+
							'<img id="game-menu-top-zoom-icon" style="position:relative;" src="./images/battle_icons/zoom.png"/>'+
							'<div style="position:relative;"><span style="background-color:#000;">Zoom-in</span></div>'+
						'</div>');
	
	$('#page-top-graphic').append('<div id="zoom-out" class="game-menu-item-container-row fltrt" onclick="GameController.zoom_out();">'+
							'<img style="position:absolute; top:0; left:0;" src="images/battle_icons/blank.png"/>'+
							'<img id="game-menu-top-zoom-icon" style="position:relative;" src="./images/battle_icons/zoom.png"/>'+
							'<div style="position:relative;"><span style="background-color:#000;">Zoom-out</span></div>'+
						'</div>');
	
	//load monster and npc select boxes
	LoadPcSelect();
	LoadNpcSelect();
	LoadMonsterSelect();
	
	game.canvas = document.getElementById('canvas');
	game.canvas_wall_and_floor_graphical = document.getElementById('canvas_wall_and_floor_graphical');
	game.canvas_object_bg = document.getElementById('canvas_object_bg');
	game.canvas_character = document.getElementById('canvas_character');
	game.canvas_object_fg = document.getElementById('canvas_object_fg');
	game.canvas_facade = document.getElementById('canvas_facade');
	
	game.context = game.canvas.getContext('2d');
	game.context_wall_and_floor_graphical = game.canvas_wall_and_floor_graphical.getContext('2d');
	game.context_object_bg = game.canvas_object_bg.getContext('2d');
	game.context_character = game.canvas_character.getContext('2d');
	game.context_object_fg = game.canvas_object_fg.getContext('2d');
	game.context_facade = game.canvas_facade.getContext('2d');
	game.context_select = game.canvas_select.getContext('2d');
	
	game.selected_floor_tile_x = -1;
	game.selected_floor_tile_y = -1;
	game.selected_wall_tile_x = -1;
	game.selected_wall_tile_y = -1;
	game.selected_pit_tile_x = -1;
	game.selected_pit_tile_y = -1;
	
	//preload character editor sprite and thumbnail graphic selection div
	//create-character-graphics-select-load
	
	function tilesetsLoaded()
	{
		//create the wall selection image (3 x 17 tiles of different wall types)
		game.canvas_wall_select.width = game.wall_graphic_number_tilesets_in_image.x * game.tileset_tile_size;
		game.canvas_wall_select.height = game.wall_graphic_number_tilesets_in_image.y * game.tileset_tile_size;
		for(var tilesetY = 0; tilesetY < game.wall_graphic_number_tilesets_in_image.y; tilesetY++)
		{
			for(var tilesetX = 0; tilesetX < game.wall_graphic_number_tilesets_in_image.x; tilesetX++)
			{
				game.context_wall_select.drawImage(game.tileset_wall,
				(tilesetX * game.wall_graphic_tileset_length.x + 1) * game.tileset_tile_size, 
				tilesetY * game.wall_graphic_tileset_length.y * game.tileset_tile_size,
				game.tileset_tile_size, 
				game.tileset_tile_size, 
				tilesetX * game.tileset_tile_size, 
				tilesetY * game.tileset_tile_size, 
				game.tileset_tile_size, 
				game.tileset_tile_size);
			}
		}
		
		//create the floor selection image (3 x 13 tiles of different floor types)
		game.canvas_floor_select.width = game.floor_graphic_number_tilesets_in_image.x * game.tileset_tile_size;
		game.canvas_floor_select.height = game.floor_graphic_number_tilesets_in_image.y * game.tileset_tile_size;
		for(var tilesetY = 0; tilesetY < game.floor_graphic_number_tilesets_in_image.y; tilesetY++)
		{
			for(var tilesetX = 0; tilesetX < game.floor_graphic_number_tilesets_in_image.x; tilesetX++)
			{
				game.context_floor_select.drawImage(game.tileset_floor,
				tilesetX * game.floor_graphic_tileset_length.x * game.tileset_tile_size, 
				tilesetY * game.floor_graphic_tileset_length.y * game.tileset_tile_size,
				game.tileset_tile_size, 
				game.tileset_tile_size, 
				tilesetX * game.tileset_tile_size, 
				tilesetY * game.tileset_tile_size, 
				game.tileset_tile_size, 
				game.tileset_tile_size);
			}
		}
		
		//create the pit selection image (1 x 16 tiles of different pit types)
		game.canvas_pit_select.width = game.pit_graphic_number_tilesets_in_image.x * game.tileset_tile_size;
		game.canvas_pit_select.height = game.pit_graphic_number_tilesets_in_image.y * game.tileset_tile_size;
		for(var tilesetY = 0; tilesetY < game.pit_graphic_number_tilesets_in_image.y; tilesetY++)
		{
			for(var tilesetX = 0; tilesetX < game.pit_graphic_number_tilesets_in_image.x; tilesetX++)
			{
				game.context_pit_select.drawImage(game.tileset_pit,
				tilesetX * game.pit_graphic_tileset_length.x * game.tileset_tile_size, 
				tilesetY * game.pit_graphic_tileset_length.y * game.tileset_tile_size,
				game.tileset_tile_size, 
				game.tileset_tile_size, 
				tilesetX * game.tileset_tile_size, 
				tilesetY * game.tileset_tile_size, 
				game.tileset_tile_size, 
				game.tileset_tile_size);
			}
		}
		
		game.load_level(area_id);
	}
	
	var loadingTimer = setInterval(function(){
			if(game.tilesets_loaded == game.tilesets_loading)
			{
				clearInterval(loadingTimer);
				tilesetsLoaded();
			}
		}, 500);
	
}
GameController.save_map_file = function(map_id, callback)
{
	var game = this;
	
	if(arguments.length<2)
	{
		callback = function(data){
			data = $.parseJSON(data);
			if(GameController.area_id != data.AreaID)
			{
				//clear characters array if saved as new map
				GameController.characters.length = 0;
				//clear conversation for new area
				GameController.conversation = 0;
				ConvEditController.conversationData = 0;
				ConvEditController.ConversationNew();
				ConvEditController.ShowAllConversation();
			}
			GameController.area_id = data.AreaID;
			alert(data.message);
		};
	}
	var event_array=[];
	/*//can use this position for something else
	for(var y=0,height=game.event_layer.length; y<height; y++)
	{
		for(var x=0,width=game.event_layer[0].length; x<width; x++)
		{
			if(game.event_layer[y][x] != 0)
			{
				event_array.push([game.event_layer[y][x],y,x]);
			}
		}
	}
	*/
	var object_array=[];
	for(var y=0,height=game.object_layer.length; y<height; y++)
	{
		for(var x=0,width=game.object_layer[0].length; x<width; x++)
		{
			if(game.object_layer[y][x] != 0)
			{
				for(var i in game.object_layer[y][x])
				{
					var object = game.object_layer[y][x][i];
					var tileset_pos_array = object.tileset_pos;
					var object_layer = object.layer;
					var object_tileset_index = object.tileset_index;
					object_array.push([tileset_pos_array, y, x, object_layer, object_tileset_index]);
				}
			}
		}
	}
	var facade_array=[];
	for(var y=0,height=game.object_layer.length; y<height; y++)
	{
		for(var x=0,width=game.object_layer[0].length; x<width; x++)
		{
			if(game.facade_layer[y][x] != 0)
			{
				for(var i in game.facade_layer[y][x])
				{
					var facade = game.facade_layer[y][x][i];
					var tileset_pos_array = facade.tileset_pos;
					var object_layer = facade.layer;
					var object_tileset_index = facade.tileset_index;
					facade_array.push([tileset_pos_array, y, x, object_layer, object_tileset_index]);
				}
			}
		}
	}
	
	var description_array = game.edit_description_array;
	
	var map_start_position = [game.map_start_y, game.map_start_x];
	//onsole.log('map_start_position',game.map_start_y, game.map_start_x);
	var map_size = [game.get_area_height(), game.get_area_width()];//y,x
	//specify characters to remove from description string
	var mapDescription = $('#map-description').val().replace(/[&\/\\#+()$~%'":*<>{}]/g, '');
	
	//settings
	var formData = $('#edit-map-settings').serializeArray();
	var settings_array = {};
	for(var i=0; i<formData.length; i++)
	{
		settings_array[formData[i].name] = formData[i].value;  
	}
	
	var filesSaved = 0;
	var mapData = 0;
	function MapSaveCallback(data)
	{
		//CALLBACK data ONLY WORKS FOR map *not* map_tilset
		filesSaved++;
		mapData = data;
		if(filesSaved == 2)
		{
			callback(data);
		}
	}
	//TilesetSaveCallback called twice for each map, in parts 1 and 2, otherwise could be too large for request
	function TilesetSaveCallback(data)
	{
		filesSaved++;
		if(filesSaved == 2)
		{
			callback(mapData);
		}
	}
	//character_array not needed, can use position 4 for something else
	//ajax_action('map_save.php', map_id, [game.floor_wall_pit_fence_door_layer, event_array, object_array, facade_array, character_array, map_start_position, map_size, mapDescription], MapSaveCallback);
	ajax_action('map_save.php', map_id, [game.floor_wall_pit_fence_door_layer, event_array, object_array, facade_array, description_array, map_start_position, map_size, mapDescription, settings_array], MapSaveCallback);
	
	//request to large error
	//break into 2 parts
	
	//	game.tileset_type_layer
	
	ajax_action('map_save.php?tileset&part=1',map_id, game.tileset_type_layer, TilesetSaveCallback);
	
}
GameController.create_new_map = function(map_id,height,width,isAlreadyInitialized)
{
	if(arguments.length < 4) isAlreadyInitialized = false;
	var game = this;
	game.isAlreadyInitialized = isAlreadyInitialized;
	game.default_wall_tileset_start = [1,1];
	game.default_floor_tileset_start = [4,1];
	game.default_pit_tileset_start = [14,0];
	
	//set default starting point
	game.map_start_y = 0;
	game.map_start_x = 0;
	
	game.area_height = height;
	game.area_width = width;
	
	game.tileset_type_layer.length = 0;
	game.event_layer.length = 0;
	game.object_layer.length = 0;
	game.character_layer.length = 0;
	
	for(var y=0; y<height; y++)
	{
		game.floor_wall_pit_fence_door_layer.push([]);
		game.tileset_type_layer.push([]);
		for(var x=0; x<width; x++)
		{
			game.floor_wall_pit_fence_door_layer[y].push(0);
			game.tileset_type_layer[y].push([game.default_wall_tileset_start, game.default_floor_tileset_start, game.default_pit_tileset_start]);
		}
	}
	
	function callback(data)
	{
		data = $.parseJSON(data);
		var area_id = data.AreaID;
		if(game.isAlreadyInitialized)
		{
			game.load_level(area_id);
		}
		//starting at intro screen
		else
		{
			game.edit_level(area_id);
		}
	}
	game.save_map_file(map_id, callback);
}

GameController.DeleteArea = function()
{
	var area_id = $('#select-start-map-load #start-map-selection').val();
	var area_name = $('#select-start-map-load #start-map-selection option[value="'+area_id+'"]').html();
	var callback = function()
	{
		$('#edit-page-adventure-start-map-load #start-map-selection option[value="'+area_id+'"]').remove();
		$('#select-start-map-load #start-map-selection option[value="'+area_id+'"]').remove();
		alert('Area deleted');
	}
	if(confirm('Delete Area: '+area_name+'?')) ajax_action('edit/area_delete.php', area_id, 0, callback);
}

GameController.get_fill_area = function(clickY, clickX, check_los)
{
	if(arguments.length < 3)
	{
		check_los = false;
	}
	
	var game=this;
	
	//onsole.log('start get_fill_area');
	//game.functionSpeedTimerThen = Date.now();
	
	//initialize fill analysis arrays
	var empty_layer = game.empty_layer;
	var open_grid = game.open_grid;
	var closed_grid = game.closed_grid;
	var cost_grid = game.cost_grid;
	/*//don't change lengths of arrays
	open_grid.length = 0;
	closed_grid.length = 0;
	cost_grid.length = 0;
	*/
	for(var y = 0; y < game.get_area_height(); y++)
	{
		for(var x = 0; x < game.get_area_width(); x++)
		{
			open_grid[y][x] = 0;
			closed_grid[y][x] = 0;
			cost_grid[y][x] = 0;
		}
	}
	
	//what type of terrain are we looking for (floor, wall, pit, or fence)
	var looking_for_terrain_type = game.floor_wall_pit_fence_door_layer[clickY][clickX];
	var open_grid_count = 1,
	checkY = clickY,
	checkX = clickX;
	
	function find_next_open()
	{
		//simply locate the next grid location to check its neighbours 
		var found = false;
		var next_open_y, next_open_x,check_count=0;
		
		//if checking los only check in squares visible on player map
		if(check_los)
		{
			var countY = Math.ceil(game.characters[game.active_player_index].y-9/game.map_scale);
			var countX = Math.ceil(game.characters[game.active_player_index].x-9/game.map_scale);
			var height = Math.ceil(game.characters[game.active_player_index].y+10/game.map_scale);
			var width = Math.ceil(game.characters[game.active_player_index].x+10/game.map_scale);
		}
		else
		{
			var countY = 0;
			var countX = 0;
			var height = game.get_area_height();//open_grid.length;
			var width = game.get_area_width();//open_grid[0].length;
		}
		
		find_next_open_loop:
		for(countY; countY < height; countY++)
		{
			if(countY >= 0 && countY < game.get_area_height())
			{
				for(countX; countX < width; countX++)
				{
					if(countX >= 0 && countX < game.get_area_width())
					{
						if(closed_grid[countY][countX] == 0 && open_grid[countY][countX] > 0 && (open_grid[countY][countX] < check_count || check_count == 0))
						{
							check_count = open_grid[countY][countX];
							next_open_y = countY;
							next_open_x = countX;
							found = true;
							break find_next_open_loop;
						}
					}
				}
				//reset loop X counter
				if(check_los)
				{
					countX = Math.ceil(game.characters[game.active_player_index].x-9/game.map_scale);
				}
				else
				{
					countX = 0;
				}
			}
		}
		if(!found) return false;
		return [next_open_y,next_open_x];
	}
	
	function check_square(check_y,check_x)
	{
		//if checking for los stop on walls (1) and doors (4)
		if(check_los && (game.floor_wall_pit_fence_door_layer[check_y][check_x] == 1 || game.floor_wall_pit_fence_door_layer[check_y][check_x] == 4))
		{
			closed_grid[check_y][check_x] = 1;
		}
		//if not terrain type to be filled close
		else if(!check_los && game.floor_wall_pit_fence_door_layer[check_y][check_x] != looking_for_terrain_type)
		{
			closed_grid[check_y][check_x] = 1;
		}
		//if not closed set and cost
		if(!closed_grid[check_y][check_x])
		{
			cost_grid[check_y][check_x] = 2;
			open_grid[check_y][check_x] = open_grid_count++;
		}
	}
	
	//start with squares around monster position
	open_grid[checkY][checkX] = open_grid_count++;
	
	var pathFound = 0;
	plot_route_loop:
	while(1)
	{
		//check find_next_open() neighbours to add to open 
		var next_open = find_next_open();
		if(!next_open)
		{
			//no more open spaces to check
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
			check_square(next_open_y,xMinus);
		if(next_open_x != xPlus)
			check_square(next_open_y,xPlus);
		if(next_open_y != yMinus)
			check_square(yMinus,next_open_x);
		if(next_open_y != yPlus)
			check_square(yPlus,next_open_x);
	}
	cost_grid[clickY][clickX] = 2;
	return cost_grid;
	
	//game.functionSpeedTimerNow = Date.now();
	//onsole.log((game.functionSpeedTimerNow-game.functionSpeedTimerThen),'end get_fill_area');
}
GameController.DescriptionNew = function()
{
	GameController.edit_description_index = GameController.edit_description_array.length;
	GameController.edit_description_array.push({'name': '', 'description': '', 'coord_array':[]});
	$('#edit-this-description').html($('#template-descriptions-edit-form').html());
	$('#edit-this-description').find('#edit-descriptions-save').data('description-index', GameController.edit_description_index);
}
GameController.DescriptionsShow = function()
{
	$('#load-descriptions').html('No descriptions saved for this map');
	if(GameController.edit_description_array.length > 0)
	{
		$('#load-descriptions').html('');
	}
	for(var i=0; i<GameController.edit_description_array.length; i++)
	{
		//if description = '' skip (deleted)
		if(GameController.edit_description_array[i].description != '')
		{
			$('#load-descriptions').append('<div>'+(GameController.edit_description_array[i].name != ''? GameController.edit_description_array[i].name : 'Un-named')+' <span class="edit-descriptions-edit menu-style-button" data-description-index="'+i+'">Edit</span><span class="edit-descriptions-delete menu-style-button" data-description-index="'+i+'">Delete</span></div>');
		}
	}
}
GameController.DescriptionSave = function()
{
	//set description text in array to text in textarea
	var description_index = $('#edit-this-description').find('#edit-descriptions-save').data('description-index');
	GameController.edit_description_array[description_index].name = $('#edit-this-description').find('.CoordDescriptionName').val();
	GameController.edit_description_array[description_index].description = $('#edit-this-description').find('.CoordDescription').val();
	//collect all selected tiles and put in coords data
	
	//remove description form
	$('#edit-this-description').html('');
	//show descriptions
	GameController.DescriptionsShow();
}
GameController.DescriptionEdit = function(description_index)
{
	GameController.edit_description_index = description_index;
	//fill in text and index number
	$('#edit-this-description').html($('#template-descriptions-edit-form').html());
	$('#edit-this-description').find('.CoordDescriptionName').val(GameController.edit_description_array[description_index].name);
	$('#edit-this-description').find('.CoordDescription').val(GameController.edit_description_array[description_index].description);
	$('#edit-this-description').find('#edit-descriptions-save').data('description-index', GameController.edit_description_index);
	//get list of coords and display on select layer
	//onsole.log(description_index);
}
GameController.DescriptionDelete = function(description_index)
{
	//set description text in array to empty string, so skipped on map save
	GameController.edit_description_array[description_index].description = '';
	//show descriptions
	GameController.DescriptionsShow();
}
// toggle visibility of element and corresponding button image
function ShowHide_Attacks() {
	//all div attack elements
	var attack_name_array = document.getElementsByName('attack_name');
	var div_array = document.getElementsByName('attack');
	
	// loop through element_name to toggle hide / show
	//skip first attack div, make sure first attack is always visible
	for (i = 1; i < div_array.length; i++)
	{
		if ((div_array[i].style.display == null) || (div_array[i].style.display == 'block'))
		{
			if (attack_name_array[i].value == null || attack_name_array[i].value == '')
				div_array[i].style.display = 'none';
		} //end if
		else
		{
			div_array[i].style.display = 'block';
		} //end else
	} //end for

    //switch button image the src, toggling between expand_arrow.png and collapse_arrow.png

	/*
	// - element_array not defined
	//check the last element in the array to see if elements are shown or hidden, change the pic depending
	if ((element_array[div_array.length - 1].style.display == null) || (element_array[div_array.length - 1].style.display == 'none'))
	{
		document.getElementById('toggle_attacks').src = 'images/graphic/expand_arrow.png';		
	} //end if
	else
	{
		document.getElementById('toggle_attacks').src = 'images/graphic/collapse_arrow.png';
	} //end else
	*/
} //end function