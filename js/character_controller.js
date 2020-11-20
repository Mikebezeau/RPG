

$(document).on("keydown", "#character-name", function(e)
{
	var code = e.which; // recommended to use e.which, it's normalized across browsers
  if(code==13)e.preventDefault();
	if(code==32||code==13||code==188||code==186)
	{
		CharacterController.CharacterNameDone();
	}
	$('#character-name-next').show();
});

//var CharacterController = CharacterController || {};
//character creation
var CharacterController = {

	'new_character_selection':
	{
		'new': 1,
		'page': 1,
		'player_id': -1,
		'character_id': -1,
		'name': '',
		'gender': '',
		'class_id': -1,//not used in form save
		'arr_classid': [],
		'class_name': '',
		'class_file_abbr': '',
		'arr_level': [6],
		'race': -1,
		'race_file_abbr': '',
		'arr_attvalue': [10,10,10,10,10,10],
		'arr_att_race_bonus': [0,0,0,0,0,0],
		'sprite_id': -1,
		'thumb_pic_id': -1,
		'skill_ranks': [],
		'feats': [],
		'new_spell_list': [],
		'new_spell_level': [],
		'learned_class_id': [],
		'equipment_data': 0,
		'weapon_style_id': -1,
		'armorid_new': -1,
		'shieldid_new': -1,
		'weaponid_new': -1,
		'weaponid_new2': -1,
		'selecting_weapon2': 0,
		'selecting_ranged': 0,
		'selecting_shield': 0
	},

	
	//var classes = ['Alchemist','Antipaladin','Barbarian','Bard','Cavalier','Cleric','Druid','Fighter','Inquisitor','Knight','Magus','Monk','Mystic Theurge','Oracle','Paladin','Ranger','Rogue','Sorcerer','Summoner','Vangaurd','Witch','Wizard'];
	//var classes = ['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Wizard'];
	//var class_id = ['1','2','3','4','5','6','7','8','9','10','11'];
	'classes': ['Barbarian','Bard','Cleric','Druid','Fighter','Paladin','Ranger','Rogue','Sorcerer','Wizard'],
	
	'class_id': [1,2,3,4,5,7,8,9,10,11],
	
	'class_image': ['battle_icons/weapon/two_handed_axe.png',
		'battle_icons/effect/scroll.png',
		'battle_icons/spells/domain/9.png',
		'battle_icons/spells/domain/1.png',
		'battle_icons/weapon/two_handed_sword.png',
		//'battle_icons/feats.png',
		'battle_icons/weapon/sword_gold.png',
		'battle_icons/ranged.png',
		'battle_icons/weapon/poison_dagger.png',
		'battle_icons/effect/clairvoyance.png',
		'battle_icons/spells_Wizard.png'],
		
	'ClickCreateBack': function()
	{
		MenuController.MenuClose();
		var current_page = CharacterController.new_character_selection.page;
		switch(current_page){
			case 1:
				$('#create-character-page').hide();
				$('#create-character-back-button').hide();
				if(GameController.new_player)
				{
					GameController.Exit();
				}
				else
				{
					GameController.GameBegin();
				}
				break;
			case 2:
				CharacterController.NewCharacter();
				break;
			case 3:
				CharacterController.SelectRace();
				break;
			case 4:
				CharacterController.SelectClass();
				break;
			case 5:
				CharacterController.SelectClass();
				break;
			case 100:
				CharacterController.AttributesMenu();
				break;
			case 6:
				CharacterController.SelectAttributes();
				break;
			case 7:
				CharacterController.SelectSprite();
				break;
			case 8:
				CharacterController.SelectThumb();
				break;
			case 9:
				if($.inArray(CharacterController.new_character_selection.class_id, [3,4,10,11]) == -1)//if no spells
				{
					CharacterController.SelectThumb();
				}
				else
				{
					CharacterController.SelectSpells();
				}
				break;
			case 10:
				if(CharacterController.new_character_selection.class_id == 10 || CharacterController.new_character_selection.class_id == 11)//if no style
				{
					CharacterController.SelectSpells();
				}
				else if(CharacterController.new_character_selection.class_id == 6)//if no style and no spell
				{
					CharacterController.SelectThumb();
				}
				else
				{
					CharacterController.SelectStyle();
				}
				break;
			case 11:
				CharacterController.SelectWeapon();
				break;
			case 'ranged':
				CharacterController.new_character_selection.selecting_ranged = 0;
				CharacterController.SelectWeapon();
				break;
			case 13:
				CharacterController.SelectWeapon();
				break;
			case 14:
				if($.inArray(CharacterController.new_character_selection.class_id, [2, 5, 8, 9]) == -1)//if no ranged
				{
					CharacterController.SelectWeapon();
				}
				else
				{
					CharacterController.SelectRanged();
				}
				break;
			case 'shield':
				CharacterController.new_character_selection.selecting_shield = 0;
				CharacterController.SelectWeapon();
				break;
			case 15:
				CharacterController.SelectArmor();
				break;
		}
	},

	'NewCharacter': function()
	{
		CharacterController.new_character_selection.page = 1;
		
		WeatherController.stop();
		
		//reset attributes
		for(var i=0; i<6; i++)
		{
			CharacterController.new_character_selection.arr_attvalue[i] = 10;
		}
		
		$('#create-character-back-button').show();
		//display back button 
		var create_pc_back_button = '<span class="" onclick="CharacterController.ClickCreateBack();" style="position:relative; z-index: 100; top: 5px; left:5px;">';
		var back_button_icon = new MenuController.MenuItem('battle_icons/back_arrow.png', 'Back', 0, [])
		create_pc_back_button += back_button_icon.CreateRingIcon('', 0, 1, false, true);//if coords are 0,0 text doesn't get centred
		create_pc_back_button += '</span>';
		
		$('#create-character-back-button').show();
		$('#create-character-back-button').html(create_pc_back_button);
		
		//start character creation process
		CharacterController.new_character_selection.player_id = CharacterController.player_id;
		$('#play-page').hide();
		$('#create-character-page').html('<h2>Character Name</h2>');
		$('#create-character-page').append('<input type="text" id="character-name"/>');
		$('#create-character-page').append('<div style="margin-top:30px;"><span id="character-name-next" onclick="CharacterController.CharacterNameDone();" class="button intro-screen-option">Next</span></div>');
		$('#create-character-page').show();
		
		if(!mobile) $('#character-name-next').hide();
		
		if(!mobile) $('#character-name').focus();
	},
	
	'CharacterNameDone': function()
	{
		if($('#character-name').val() != '')
		{
			CharacterController.new_character_selection.name = $('#character-name').val();
			CharacterController.SelectRace();
		}
	},

	'SelectRace': function()
	{
		CharacterController.new_character_selection.page = 2;
		
		CharacterController.new_character_selection.race = -1;
		
		$('#create-character-page').html('<h2>Select Race</h2>');
		
		//selected class, now select race
		//var races = ['Human','Dwarf','Elf','Gnome','Half-Elf','Half-Orc','Halfling','Fey-touched','Tiefling','Bariaur'];
		var races = ['Human','Dwarf','Elf','Gnome','Half-Elf','Half-Orc','Halfling','Fey-borne','Tiefling'];
		var race_id = ['7','1','2','3','4','5','6','8','9','10'];
		var race_image = ['char/thumb/charthumb_3.png',
		'char/thumb/charthumb_88.png',
		'char/thumb/charthumb_5.png',
		'char/thumb/charthumb_87.png',
		'char/thumb/charthumb_11.png',
		'char/thumb/charthumb_16.png',
		'char/thumb/charthumb_1.png',
		'char/thumb/charthumb_10.png',
		'char/thumb/charthumb_89.png'];
		//'char/thumb/charthumb_13.png'];
		
		switchToMobileDisplay = 1;
		var class_selection_img_container = '<div style="font-size:'+(switchToMobileDisplay?'16':'12')+'px; line-height:1;">';
		for(var i = 0; i < races.length; i++)
		{
			var top = Math.floor(i/3) * (10 + switchToMobileDisplay*40);
			
			class_selection_img_container += '<span class="pc-select-race" onclick="CharacterController.ClickRace(this);" style="position:relative; top: '+top+'px; margin-left:25px; margin-right:119px; margin-bottom:60px;" data-id="'+race_id[i]+'">';
			var pcSelectIcon = new MenuController.MenuItem(race_image[i], races[i], 0, [])
			class_selection_img_container += pcSelectIcon.CreateRingIcon('', 0, 1, false, true);//if coords are 0,0 text doesn't get centred
			class_selection_img_container += '</span>';
		}
		class_selection_img_container += '</div>';
		
		$('#create-character-page').append(class_selection_img_container);
	},

	'ClickRace': function(e)
	{
		$('.pc-select-race').find('span').css('color','#FFF');
		$(e).find('span').css('color','#7F7');
		var race_id = $(e).data('id');
		CharacterController.new_character_selection.race = race_id;
		//$('#pc-character-race-next').show();

		var race_name = '';
		var att_bonus_names = '';
		var note = '';
		
		//set attribute bonuses
		switch (race_id) {
			case 7://human
				CharacterController.new_character_selection.arr_att_race_bonus = [0, 0, 0, 0, 0, 0];
				CharacterController.new_character_selection.race_file_abbr = 'h';
				race_name = 'Human';
				att_bonus_names = '+2 to any one attribute';
				note = '<br/><p>1 free special skill</p><br/><p>Bonus skill points</p><br/><p>Favored Class: Any</p>';
				break;
			
			case 1://dwarf
				CharacterController.new_character_selection.arr_att_race_bonus = [0, 0, 2, 0, 2, -2];
				CharacterController.new_character_selection.race_file_abbr = 'd';
				race_name = 'Dwarf';
				att_bonus_names = '+2 to Constitution and Wisdom<br/><br/>-2 Charasmia';
				note = '<br/><p>Dark-vision</p><br/><p>Improved resistance to magic and poison</p><br/><p>Favored Class: Fighter</p>';
				break;
			
			case 2://elf
				CharacterController.new_character_selection.arr_att_race_bonus = [0, 2, -2, 2, 0, 0];
				CharacterController.new_character_selection.race_file_abbr = 'e';
				race_name = 'Elf';
				att_bonus_names = '+2 to Dexterity and Intelligence<br/><br/>-2 Constitution';
				note = '<br/><p>Low-Light Vision</p><br/><p>Immunity to magic sleep effects</p><br/><p>Improved resistance to magic and poison</p><br/><p>Keen senses</p><br/><p>Favored Class: Wizard</p>';
				break;
				
			case 3://Gnome
				CharacterController.new_character_selection.arr_att_race_bonus = [-2, 0, 2, 2, 0, 0];
				CharacterController.new_character_selection.race_file_abbr = 'g';
				race_name = 'Gnome';
				att_bonus_names = '+2 to Dexterity and Intelligence<br/><br/>-2 Constitution';
				note = '<br/><p>Small Size</p><br/><p>Low-Light Vision</p><br/><p>Improved resistance to illusions</p><br/><p>Low-Light Vision</p><br/><p>Keen senses</p><br/><p>Favored Class: Bard</p>';
				break;
				
			case 4://Half-Elf
				CharacterController.new_character_selection.arr_att_race_bonus = [0, 0, 0, 0, 0, 0];
				CharacterController.new_character_selection.race_file_abbr = 'he';
				race_name = 'Half-Elf';
				att_bonus_names = '+2 to any one attribute';
				note = '<br/><p>Low-Light Vision</p><br/><p>Immunity to magic sleep effects</p><br/><p>Improved resistance to magic and poison</p><br/><p>Lesser Keen senses</p><br/><p>Favored Class: Any</p>';
				break;
				
			case 5://Half-Orc
				CharacterController.new_character_selection.arr_att_race_bonus = [0, 0, 0, 0, 0, 0];
				CharacterController.new_character_selection.race_file_abbr = 'ho';
				race_name = 'Half-Orc';
				att_bonus_names = '+2 to any one attribute';
				note = '<br/><p>Dark-vision</p><br/><p>Favored Class: Barbarian</p>';
				break;
				
			case 6://Halfling
				CharacterController.new_character_selection.arr_att_race_bonus = [-2, 2, 0, 0, 0, 0];
				CharacterController.new_character_selection.race_file_abbr = 'g';
				race_name = 'Halfling';
				att_bonus_names = '+2 Dexterity<br/><br/>-2 Strength';
				note = '<br/><p>Small Size</p><br/><p>Slightly improved resistances<p><br/><p>+2 on Climb, Jump, Listen, and Move Silently checks</p><br/><p>Bravery</p><br/><p>Favored Class: Rogue</p>';
				break;
				
			case 8://Fey-touched
				CharacterController.new_character_selection.arr_att_race_bonus = [0, 2, 0, -2, 2, 0];
				CharacterController.new_character_selection.race_file_abbr = 'ft';
				race_name = 'Fey-borne';
				att_bonus_names = '+2 to Dexterity and Wisdom<br/><br/>-2 Intelligence';
				note = '<br/><p>Low-Light Vision</p><br/><p>Improved resistance to magic</p><br/><p>Keen senses</p><br/><p>Favored Class: Druid</p>';
				break;
				
			case 9://Tiefling
				CharacterController.new_character_selection.arr_att_race_bonus = [0, 2, 0, 0, -2, 2];
				CharacterController.new_character_selection.race_file_abbr = 't';
				race_name = 'Tiefling';
				att_bonus_names = '+2 to Dexterity and Charasmia<br/><br/>-2 Wisdom';
				note = '<br/><p>Low-Light Vision</p><br/><p>Cast Darkness (spell) 1/day</p><br/><p>Favored Class: Sorcerer</p>';
				break;
				
			case 10://Bariaur
				CharacterController.new_character_selection.arr_att_race_bonus = [2, 0, 0, 0, 2, -2];
				CharacterController.new_character_selection.race_file_abbr = 'b';
				race_name = 'Bariaur';
				att_bonus_names = '+2 to Strength and Wisdom<br/><br/>-2 Charasmia';
				note = '<br/><p>Stability (4 legs)</p><br/><p>Favored Class: Ranger</p>';
				break;
		}
		var message = '<h2>'+race_name+'</h2><div><br/>'+att_bonus_names+'</div><div>'+note+'</div><br/>'; 
		message += '<div style="margin-top:15px;"><span id="pc-race-select" class="button" onclick="MenuController.MenuClose(); CharacterController.RaceDone();">Select</span> <span id="pc-race-cancel" class="button" onclick="MenuController.MenuClose();">Close</span></div>';
		MenuController.DisplayMessage(message, false, true, 500);
	},

	'RaceDone': function()
	{
		if(CharacterController.new_character_selection.race != -1)
		{
			CharacterController.SelectClass();
		}
	},

	'GetClassNameIcon': function(class_id)
	{
		var class_name = '';
		var class_pic = '';
		for(var i in CharacterController.classes)
		{
			if(CharacterController.class_id[i] == class_id) break;
		}
		class_name = CharacterController.classes[i];
		class_pic = CharacterController.class_image[i];
		return {'name':class_name, 'icon':class_pic};
	},
	
	'SelectClass': function()
	{
		
		CharacterController.new_character_selection.page = 3;
		$('#create-character-page').html('<h2>Select Class</h2>');
		
		CharacterController.new_character_selection.arr_classid = [];
		
		var classes = CharacterController.classes;
		var class_id = CharacterController.class_id;
		var class_image = CharacterController.class_image;
		
		CharacterController.new_character_selection.arr_class_decription = {
			'Barbarian': 'A barbarian relies on a berserker fury and unmatched durability to overwhelm foes. Many barbarians are chaotic, but the feral rage that this class channels burns in almost any heart',//Barbarian
			'Bard': '',//Bard
			'Cleric': '',//Cleric
			'Druid': '',//Druid
			'Fighter': '',//Fighter
			'Paladin': '',//Paladin
			'Ranger': '',//Ranger
			'Rogue': '',//Rogue
			'Sorcerer': '',//Sorcerer
			'Wizard': ''//Wizard
		};
		
		var class_selection_img_container = '<div style="font-size:'+(switchToMobileDisplay?'16':'12')+'px; line-height:1;">';
		for(var i = 0; i < classes.length; i++)
		{
			var top = Math.floor(i/3) * (10 + switchToMobileDisplay*40);
			class_selection_img_container += '<span class="pc-select-class" onclick="CharacterController.ClickClass(this);" style="position:relative; top: '+top+'px; margin-left:25px; margin-right:119px; margin-bottom:60px;" data-id="'+class_id[i]+'">';
			var pcSelectIcon = new MenuController.MenuItem(class_image[i], classes[i], 0, [])
			class_selection_img_container += pcSelectIcon.CreateRingIcon('', 0, 1, false, true);//if coords are 0,0 text doesn't get centred
			class_selection_img_container += '</span>';
		}
		class_selection_img_container += '</div>';
		$('#create-character-page').append(class_selection_img_container);
		//$('#create-character-page').append('<div style="margin-top:'+(top+90)+'px;"><span id="pc-character-class-next" class="button" onclick="CharacterController.ClassDone();" style="display:none; cursor:pointer;">Next</span></div>');
		
		$('#create-character-page').show();
	},

	'ClickClass': function(e)
	{
		var className = CharacterController.new_character_selection.class_name = $(e).find('span').html();
		var decription = CharacterController.new_character_selection.arr_class_decription[className];
		//onsole.log(decription);
		CharacterController.ClickClassGender(e);
	},
	
	'ClickClassGender': function(e)
	{
		$('.pc-select-class').find('span').css('color','#FFF');
		$(e).find('span').css('color','#7F7');
		var class_id = $(e).data('id');
		CharacterController.new_character_selection.class_id = class_id;
		CharacterController.new_character_selection.class_name = $(e).find('span').html();
		$('#pc-character-class-next').show();
		//var class_dmposter_image = './images/character_creation/class_'+CharacterController.new_character_selection.class_name.toLowerCase()+'.jpg';
		
		var html = '<div style="position:absolute; width:544px; top:70px; left:0;">';
			//html += '<img style="width:544px;" src="'+class_dmposter_image+'"/>';
		//got when user selected race (1 or 2 character code for race)
		var race_file_abbr = CharacterController.new_character_selection.race_file_abbr;
		//lowercase file naming
		var class_file_abbr = CharacterController.new_character_selection.class_name.toLowerCase();
			html += '<div data-gender="m" class="create-class-pic" onclick="CharacterController.ClickClassPic(this);" style="cursor:pointer; position:relative; border:5px solid #99c; width:250px; height:450px; margin-top:20px; margin-left:8px; float:left; background-position:center center; background-size:cover; background-image:URL(\'images/char/full/character_create/'+race_file_abbr+'-m-'+class_file_abbr+'.jpg\');">';
			html += '<div style="position:absolute; bottom:30px; width:100%"><span class="pc-character-gender" class="button" onclick="" style="background-color:#000; margin:0 auto;">Male</span></div>';
			html += '</div>';
			
			html += '<div data-gender="f" class="create-class-pic" onclick="CharacterController.ClickClassPic(this);" style="cursor:pointer; position:relative; border:5px solid #99c; width:250px; height:450px; margin-top:20px; margin-right:8px; float:right; background-position:center center; background-size:cover; background-image:URL(\'images/char/full/character_create/'+race_file_abbr+'-f-'+class_file_abbr+'.jpg\');">';
			html += '<div style="position:absolute; bottom:30px; width:100%"><span class="pc-character-gender" class="button" onclick="" style="background-color:#000; margin:0 auto;">Female</span></div>';
			html += '</div>';
			
			html += '<div style="clear:both; height:30px;"></div>';
			html += '<span id="pc-character-class-next" class="button" onclick="CharacterController.ClassDone();" style="display:none; clear:both;">Next</span>';
		html += '</div>';
		$('#create-character-page').html(html);
		CharacterController.new_character_selection.page = 4;//puts it a page ahead so it'll reshow the class page on back button press
	},

	'ClickClassPic': function(e)
	{
		/*
		if(arguments.length == 0 || $(e).css('width') == '518px')
		{
			$('.create-class-pic').css('width','250px');
			$('.create-class-pic').css('background-position','center center');
			$('.create-class-pic').show();
			$('#pc-character-class-next').hide();
			$('.pc-character-gender').show();
			CharacterController.new_character_selection.page = 4;
			return false;
		}
		else
		{
			$('.create-class-pic').hide();
			$(e).show();
			$(e).css('width','518px');
			$(e).css('background-position','center top');
			$('#pc-character-class-next').show();
			$('.pc-character-gender').hide();
			CharacterController.new_character_selection.page = 5;
		}
		*/
		if($(e).data('gender') == 'm')
		{
			CharacterController.new_character_selection.gender = 'Male';
		}
		else
		{
			CharacterController.new_character_selection.gender = 'Female';
		}
		//return true;
		
		//skip show large pic
		CharacterController.ClassDone();
	},

	'ClassDone': function(e)
	{
		CharacterController.new_character_selection.arr_classid.push(CharacterController.new_character_selection.class_id);
		
		CharacterController.AttributesMenu();
		//CharacterController.SelectGender();
	},

	'AttributesMenu': function()
	{
		CharacterController.new_character_selection.page = 5;
		
		$('#create-character-page').html('<h2>Select Attributes</h2>');
		
		var message = '<h2>Select Mode</h2>'; 
		message += '<div style="margin-top:15px;"><span id="" class="button" onclick="CharacterController.easyAttributes = 1; CharacterController.SelectAttributes(); CharacterController.AttributesAuto(); MenuController.MenuClose();">Easy</span> ';
		message += '<span id="" class="button" onclick="CharacterController.easyAttributes = 0; CharacterController.SelectAttributes(); MenuController.MenuClose();">Custom</span></div>';
		MenuController.DisplayMessage(message);
		$('#message-box-container').css('top',(window.mobile?'180px':'140px'));
	},
	
	'SelectAttributes': function(esyMode)//selected class, now select race
	{
		easyMode = CharacterController.easyAttributes;
		CharacterController.new_character_selection.page = 100;
		$('#create-character-page').html('<h2>Select Attributes</h2>');
		
		var attr = ['Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma'];
			
		var attr_selection = '';
		
		attr_selection += '<div style="font-family:beebregular; font-size:16px;"><div id="attr-title" style="margin-bottom:40px;">'+(easyMode ? 'Roll' : 'Increase')+' Your Ability Scores</div>';
		
		attr_selection += '<div style="position:relative; top:-30px;"><span id="" class="button" onclick="CharacterController.AttributesAuto();">Re-roll stats?</span></div>';
		attr_selection += '<div style="text-align:left; padding-left:'+(easyMode ? '150' : (window.mobile ? '45' : '75'))+'px;">';
		
		attr_selection += '<div style="font-size:75%; font-family:exocetheavy; margin-bottom:'+(switchToMobileDisplay?'10':'20')+'px;"><span style="display:inline-block; width:200px;">Ability Name</span>';
		attr_selection += '<span style="display:inline-block; width:65px;">Score</span>';
		attr_selection += '<span style="display:inline-block;'+(easyMode ? ' display:none; ' : '')+'width:'+(window.mobile?'120':'60')+'px;" >Custom</span>';
		attr_selection += '<span style="display:inline-block;'+(easyMode ? ' display:none; ' : '')+'width:100px;" >Point Cost</span></div>';
		
		for(var i = 0; i < attr.length; i++)
		{
			attr_selection += '<div class="pc-attr" data-id="'+i+'" style="margin-bottom:'+(switchToMobileDisplay?'10':'20')+'px;"><span style="display:inline-block; width:200px;">'+attr[i]+'</span>';
			attr_selection += '<span class="attr-score" style="display:none;">'+CharacterController.new_character_selection.arr_attvalue[i]+'</span>';
			attr_selection += '<span class="attr-score-modified" style="display:inline-block; width:60px; '+(CharacterController.new_character_selection.arr_att_race_bonus[i]>0 ? 'color:#7f7;' : '')+' '+(CharacterController.new_character_selection.arr_att_race_bonus[i]<0 ? 'color:#aaa;' : '')+'">'+(CharacterController.new_character_selection.arr_attvalue[i] + CharacterController.new_character_selection.arr_att_race_bonus[i])+'</span> ';
			attr_selection += '<span class="button pc-attr-up" style="cursor:pointer;'+(easyMode ? ' display:none; ' : '')+'background-color:#000; border:1px solid #fff; border-radius:3px; padding:'+(mobile?'20':'5')+'px; margin-top:0;" onclick="CharacterController.ClickAbilityUp(this);">+</span> ';
			attr_selection += '<span class="button pc-attr-down" style="cursor:pointer;'+(easyMode ? ' display:none; ' : '')+'background-color:#000; border:1px solid #fff; border-radius:3px; padding:'+(mobile?'20':'5')+'px; margin-top:0;"  onclick="CharacterController.ClickAbilityDown(this);">-</span>';
			attr_selection += '<span class="attr-point-cost" style="display:inline-block;'+(easyMode ? ' display:none; ' : '')+'width:60px; padding-left:36px" >Point Cost</span></div>';
		}
		attr_selection += '</div>';
		
		attr_selection += '<div id="attr-points-remaining" style="margin-top:40px;'+(easyMode ? ' display:none; ' : '')+'">Points Remaining: <span id="attr-points"><!--25--></span></div>';
		attr_selection += '</div>';
		$('#create-character-page').append(attr_selection);
		$('#create-character-page').append('<div style="margin-top:0px;"><span id="pc-character-attr-next" class="button selected" style="display:none;" onclick="CharacterController.AttributesDone();">Next</span></div>');
		//$('#pc-character-attr-next').hide();
		CharacterController.CalcAbilityPoints();
	},

	'AttributesAutoSetList': [
			{'roll_set':0, 'switcharoo': 0, 'switcharoo2': 0},
			{'roll_set':1, 'switcharoo': 0, 'switcharoo2': 0},
			{'roll_set':0, 'switcharoo': 1, 'switcharoo2': 0},
			{'roll_set':1, 'switcharoo': 1, 'switcharoo2': 0},
			{'roll_set':0, 'switcharoo': 0, 'switcharoo2': 1},
			{'roll_set':1, 'switcharoo': 0, 'switcharoo2': 1},
			{'roll_set':0, 'switcharoo': 1, 'switcharoo2': 1},
			{'roll_set':1, 'switcharoo': 1, 'switcharoo2': 1}
		],
	'AttributesAutoSetListCount': 0,
	'AttributesAuto': function()
	{
		$('.attr-score').html('10');
		
		//var classes = ['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer'];
		//var class_id = ['1','2','3','4','5','6','7','8','9','10','11'];
		var class_stat = 0;
		var class_stat_2 = 0;
		var class_stat_3 = 0;
		switch(CharacterController.new_character_selection.class_id)
		{
			case 1://Barbarian
				class_stat = 2;
				class_stat_2 = 0;
				class_stat_3 = 1;
				break;
			
			case 2://Bard
				class_stat = 5;
				class_stat_2 = 0;
				class_stat_3 = 3;
				break;
			
			case 3://Cleric
				class_stat = 4;
				class_stat_2 = 2;
				class_stat_3 = 0;
				break;
				
			case 4://Druid
				class_stat = 4;
				class_stat_2 = 0;
				class_stat_3 = 2;
				break;
				
			case 5://Fighter
				class_stat = 0;
				class_stat_2 = 2;
				class_stat_3 = 1;
				break;
				
			case 6://Monk
				class_stat = 0;
				class_stat_2 = 4;
				class_stat_3 = 2;
				break;
				
			case 7://Paladin
				class_stat = 2;
				class_stat_2 = 5;
				class_stat_3 = 0;
				break;
				
			case 8://Ranger
				class_stat = 0;
				class_stat_2 = 1;
				class_stat_3 = 4;
				break;
				
			case 9://Rogue
				class_stat = 1;
				class_stat_2 = 0;
				class_stat_3 = 3;
				break;
				
			case 10://Sorcerer
				class_stat = 5;
				class_stat_2 = 2;
				class_stat_3 = 0;
				break;
				
			case 11://Wizard
				class_stat = 3;
				class_stat_2 = 1;
				class_stat_3 = 2;
				break;
			
		}
		
		var i=0;
		var stat_id_arr = [0,1,2,3,4,5];
		
		//0s
		if(CharacterController.new_character_selection.race == 7 || CharacterController.new_character_selection.race == 4 || CharacterController.new_character_selection.race == 5)
		{
			$('.attr-score-modified').css('color','#fff');
			CharacterController.new_character_selection.arr_att_race_bonus = [0,0,0,0,0,0];
		}
		CharacterController.SelectAttributes();
		
		//roll set 1 or 2
		//var roll_set = Math.floor(Math.random()*(2));
		var roll_set = CharacterController.AttributesAutoSetList[CharacterController.AttributesAutoSetListCount].roll_set;
		//var switcharoo = Math.floor(Math.random()*(4));
		var switcharoo = CharacterController.AttributesAutoSetList[CharacterController.AttributesAutoSetListCount].switcharoo;
		//var switcharoo2 = Math.floor(Math.random()*(3));
		var switcharoo2 = CharacterController.AttributesAutoSetList[CharacterController.AttributesAutoSetListCount].switcharoo2;
		
		CharacterController.AttributesAutoSetListCount++;
		if(CharacterController.AttributesAutoSetListCount >= CharacterController.AttributesAutoSetList.length) CharacterController.AttributesAutoSetListCount = 0;
		
		if(switcharoo == 1)
		{
			class_stat = [class_stat_2, class_stat_2 = class_stat][0];
		}
		if(switcharoo2 == 1)
		{
			class_stat_2 = [class_stat_3, class_stat_3 = class_stat_2][0];
		}
		
		
		//down
		/*
		roll_set == 0
			9, 9, 9
		*/
		stat_id_arr[class_stat] = -1;
		stat_id_arr[class_stat_2] = -1;
		stat_id_arr[class_stat_3] = -1;
		for(i=0; i<=5; i++)
		var random_stat_down = Math.floor(Math.random()*(3));
		
		var random_stat_down_2 = -1;
		if(roll_set == 0)//lower low stats
		{
			do
			{
				random_stat_down_2 = Math.floor(Math.random()*(3));
			}while(random_stat_down_2 == random_stat_down)
		}
		
		var is_stat_down = 0;
		for(i=0; i<=5; i++)
		{
			if(stat_id_arr[i] != -1)
			{
				if(roll_set == 0)
				{
					if(is_stat_down == random_stat_down)
					{
						$('.pc-attr').eq(i).find('.pc-attr-down').trigger(window.mobile?'touchend':'click');
						$('.pc-attr').eq(i).find('.pc-attr-down').trigger(window.mobile?'touchend':'click');
					}
					if(is_stat_down == random_stat_down_2)
					{
						$('.pc-attr').eq(i).find('.pc-attr-down').trigger(window.mobile?'touchend':'click');
						$('.pc-attr').eq(i).find('.pc-attr-down').trigger(window.mobile?'touchend':'click');
					}
				}
				
				else if(roll_set == 1)
				{
					$('.pc-attr').eq(i).find('.pc-attr-down').trigger(window.mobile?'touchend':'click');
					$('.pc-attr').eq(i).find('.pc-attr-down').trigger(window.mobile?'touchend':'click');
					if(is_stat_down == random_stat_down)
					{
						$('.pc-attr').eq(i).find('.pc-attr-down').trigger(window.mobile?'touchend':'click');
					}
				}
				is_stat_down++;
			}
		}
		
		//up
		var random_bonus_stat = -1;
		if($.inArray(2, CharacterController.new_character_selection.arr_att_race_bonus) == -1)
		{
			random_bonus_stat = class_stat;
			$('.pc-attr').eq(random_bonus_stat).find('.pc-attr-up').trigger(window.mobile?'touchend':'click');
		}
		
		for(i=0; i<(roll_set == 0 ? 8:7); i++)
			$('.pc-attr').eq(class_stat).find('.pc-attr-up').trigger(window.mobile?'touchend':'click');
		
		for(i=0; i<(roll_set == 0 ? 5:7); i++)
			$('.pc-attr').eq(class_stat_2).find('.pc-attr-up').trigger(window.mobile?'touchend':'click');
		
		for(i=0; i<(roll_set == 0 ? 4:5); i++)
			$('.pc-attr').eq(class_stat_3).find('.pc-attr-up').trigger(window.mobile?'touchend':'click');
	},

	'ClickAbilityUp': function(e)
	{
		var score = parseInt($(e).parent().find('.attr-score').html());
		var id = parseInt($(e).parent().data('id'));
		//onsole.log(CharacterController.new_character_selection.arr_att_race_bonus,$.inArray(2, CharacterController.new_character_selection.arr_att_race_bonus));
		if($.inArray(2, CharacterController.new_character_selection.arr_att_race_bonus) == -1)
		{
			CharacterController.new_character_selection.arr_att_race_bonus[id] = 2;
			$(e).parent().find('.attr-score-modified').css('color','#7f7');
		}
		else
		{
			score = (score < 18) ? score+1 : score;
			$(e).parent().find('.attr-score').html(score);
			CharacterController.CalcAbilityPoints();
		}
		$(e).parent().find('.attr-score-modified').html(score + CharacterController.new_character_selection.arr_att_race_bonus[id])
	},

	'ClickAbilityDown': function(e)
	{
		var score = parseInt($(e).parent().find('.attr-score').html());
		var id = parseInt($(e).parent().data('id'));
		if(CharacterController.new_character_selection.arr_att_race_bonus[id] == 2 && (CharacterController.new_character_selection.race == 7 || CharacterController.new_character_selection.race == 4 || CharacterController.new_character_selection.race == 5))
		{
			CharacterController.new_character_selection.arr_att_race_bonus = [0,0,0,0,0,0];
			$(e).parent().find('.attr-score-modified').css('color','#fff');
		}
		else
		{
			score = (score > 7) ? score-1 : score;
			$(e).parent().find('.attr-score').html(score)
			CharacterController.CalcAbilityPoints();
		}
		$(e).parent().find('.attr-score-modified').html(score + CharacterController.new_character_selection.arr_att_race_bonus[id])
	},

	'AbilityPointsCost': 
	{
		7: -4,
		8: -2,
		9: -1,
		10: 0,
		11: 1,
		12: 2,
		13: 3,
		14: 5,
		15: 7,
		16: 10,
		17: 13,
		18: 17
	},

	'CalcAbilityPoints': function()
	{
		var count = 0;
		var points = 25;
		$('.attr-score').each(function()
		{
			var score = parseInt($(this).html());
			points = points - CharacterController.AbilityPointsCost[score];
			$('.attr-point-cost').eq(count).html(CharacterController.AbilityPointsCost[score])
			count++;
			//onsole.log('score',CharacterController.AbilityPointsCost[score]);
		});
		$('#attr-points').html(points);
		if(points < 0)
		{
			$('#attr-points-remaining').css('color','#F66');
		}
		else
		{
			$('#attr-points-remaining').css('color','#FFF');
			if(points == 0) $('#pc-character-attr-next').show();
		}
		if(points == 0)
		{
			$('#pc-character-attr-next').show();
			window.scrollTo(0, 600);
		}
		else $('#pc-character-attr-next').hide();
	},
		
	'AttributesDone': function()
	{
		//check to make sure all points are used up
		if(parseInt($('#attr-points').html()) != 0)
		{
			$('#attr-title').html('You may proceed when you<br/>have 0 points remaning');
			$('#attr-points-remaining').css('color','#F66');
			setTimeout(function(){$('#attr-points-remaining').css('color','#FFF')}, 2000);
			return false;
		}
		
		//set scores
		for(var i=0; i<6; i++)
		{
			CharacterController.new_character_selection.arr_attvalue[i] = parseInt($('.attr-score').eq(i).html());
		}
		//move on to next step
		CharacterController.SelectSprite();
	},

	'SelectSprite': function()
	{
		CharacterController.new_character_selection.page = 6;
		
		$('#create-character-page').html('<h2>Select Character Image</h2>');
		
		$.ajax({
			type: 'POST',
			async: true,
			url: './php/character_create/get_sprites.php',
			data: CharacterController.new_character_selection
		})
			.done(function(data) { 
					$('#create-character-page').append('<div id="character-create-sprites">'+data+"</div>");
					resize_element = function(e){
						var width = $(e).get(0).naturalWidth;
						width = width * parseFloat($(e).data('scale'));
						width = Math.floor(width*1.5);
						$(e).css('width', width+'px');
						$(e).css('margin', '10px');
					}
					
					$("#create-character-page img").on('load', function() {
						resize_element(this);
					}).each(function() {
						if(this.complete) $(this).trigger('load');
					});
					
					$('#create-character-page img').click(function(){
						CharacterController.ClickSprite(this);
					});
				});
	},

	'ClickSprite': function(e)
	{
		var id = $(e).data('id');
		CharacterController.new_character_selection.sprite_id = id;
		//onsole.log(CharacterController.new_character_selection.sprite_id);
		//$('#create-character-page img').css('background-color', 'transparent');
		//$(e).css('background-color', '#3C3');
		
		//show confirm message box
		var message = '<span>Select this image?</span><br/><br/>'+($(e)[0].outerHTML)+'<br/><br/>';
		message += '<span id="selected-button" class="button selected" style="margin:5px;" onclick="CharacterController.SpriteDone(); MenuController.MenuClose();">Yes</span>';
		message += '<span id="" class="button" onclick="MenuController.MenuClose();">Cancel</span>';
		MenuController.DisplayMessage(message);
		var width = $(window).width();
		$('#message-box-container').css('position','fixed');
		$('#message-box-container').css('top','200px');
		$('#message-box-container').css('left',Math.floor(width/2 - 200)+'px');
	},

	'SpriteDone': function(e)
	{
		if(CharacterController.new_character_selection.sprite_id > -1)
		{
			CharacterController.SelectThumb();
		}
	},

	'SelectThumb': function()
	{
		CharacterController.new_character_selection.page = 7;
		
		$('#create-character-page').html('<h2>Select Character Portrait</h2>');
		$('#create-character-page').append('<div id="load-character-thumb-pics">Loading...</div>');
		
		$.ajax({
			type: 'POST',
			async: true,
			url: './php/character_create/get_thumb_pics.php?s='+(CharacterController.new_character_selection.gender == 'Male' ? 'm' : 'f'),
			data: {}
		})
			.done(function(data) { 
					$('#load-character-thumb-pics').html(data);
					$('#load-character-thumb-pics img').click(function(){
						CharacterController.ClickThumb(this);
					});
				});
	},

	'ClickThumb': function(e)
	{
		var id = $(e).data('id');
		CharacterController.new_character_selection.thumb_pic_id = id;
		//onsole.log(CharacterController.new_character_selection.thumb_pic_id);
		//$('#create-character-page img').css('background-color', 'transparent');
		//$(e).css('background-color', '#3C3');
		
		//show confirm message box
		var message = '<span>Select this image?</span><br/><br/>'+($(e)[0].outerHTML)+'<br/><br/>';
		message += '<span id="selected-button" class="button selected" style="margin:5px;" onclick="CharacterController.ThumbDone(); MenuController.MenuClose();">Yes</span>';
		message += '<span id="" class="button" onclick="MenuController.MenuClose();">Cancel</span>';
		MenuController.DisplayMessage(message);
		var width = $(window).width();
		$('#message-box-container').css('position','fixed');
		$('#message-box-container').css('top','200px');
		$('#message-box-container').css('left',Math.floor(width/2 - 200)+'px');
	},

	'ThumbDone': function(e)
	{
		if(CharacterController.new_character_selection.thumb_pic_id > -1)
		{
			CharacterController.SelectSpells();
		}
	},

	'spell_data': [],

	'SelectSpells': function()
	{
		CharacterController.new_character_selection.page = 8;
		
		if($.inArray(CharacterController.new_character_selection.class_id, [2,7,8, 3,4,10,11]) == -1) //if these class ids not found
		{
			CharacterController.SpellDone();
			return false;
		}
		
		$('#create-character-page').html('<h2>Loading Spells...</h2>');
		$.ajax({
			type: 'POST',
			async: true,
			url: './php/character_create/get_spells.php',
			data: CharacterController.new_character_selection
		})
			.done(function(data) {
					CharacterController.spell_data = $.parseJSON(data);
					var spell_data = CharacterController.spell_data;
					//if no spells to choose skip this step
					/*
					if(spell_data.spell_id.length == 0)
					{
						CharacterController.SpellDone();
						return false;
					}
					*/
					$('#create-character-page').html('<h2>'+CharacterController.new_character_selection.class_name+' Spells</h2>');
					
					var spell_selection_img_container = '<div style="font-size:'+(mobile?'16':'12')+'px; line-height:1;">';
					var row_counter = 0;
					var top = 60;
					var spell_level_display = 0;
					
					//for the firt header, some classes have no level 0 spells
					if(spell_data.spell_level[0] == 0)
					{
						spell_selection_img_container += '<h1>Level 0 ~ Select 4</h1>';
					}
					else
					{
						spell_selection_img_container += '<h1>Level 1 ~ Select 2</h1>';
						spell_level_display = 1;
					}
					
					list_spell_loop:
					for(var i=0; i<spell_data.spell_id.length; i++)
					{
						//only spells with effects
						//if in edit mode then show all spells
						if(GameController.dev_mode || spell_data.spell_image[i] != 'battle_icons/spells/default.png')
						{
							//onsole.log(top)
							if(spell_level_display != spell_data.spell_level[i])
							{
								spell_level_display++;
								//bard
								if(CharacterController.new_character_selection.class_id == 2)
								{
									if(spell_level_display == 3) break list_spell_loop;
								}
								//other classes that have limited spells
								else if($.inArray(CharacterController.new_character_selection.class_id, [5,7,8]) != -1) //if these class ids found
								{
									break list_spell_loop;
								}
								top = top + 10;
								//onsole.log('row_counter',row_counter)
								row_counter = (row_counter%3 == 0) ? row_counter : row_counter + (3-row_counter%3);
								//onsole.log('row_counter',row_counter)
								
								spell_selection_img_container += '<h1 style="position:relative; top:'+(top+(switchToMobileDisplay*40))+'px; width:100%;">Level '+(spell_level_display)+' ~ Select '+(5-spell_level_display)+'</h1>';
							}
							
							top = Math.floor(row_counter/3) * (10 + switchToMobileDisplay*40);
							
							
							//auto select all available spells
							//CharacterController.SpellSelect(spell_data.spell_id[i]);
							
							//removed for auto-select//
							spell_selection_img_container += '<span class="pc-select-spell" onclick="CharacterController.ClickSpell('+i+');" style="position:relative; top: '+top+'px; margin-left:25px; margin-right:119px; margin-bottom:60px;" data-id="'+spell_data.spell_id[i]+'">';
							var pcSelectIcon = new MenuController.MenuItem(spell_data.spell_image[i], spell_data.spell_name[i], 0, [])
							spell_selection_img_container += pcSelectIcon.CreateRingIcon('', 0, 1, false, true);//if coords are 0,0 text doesn't get centred
							spell_selection_img_container += '</span>';
							row_counter++;
							//
							
						}
					}
					//auto selected all available spells skip to next step
					//CharacterController.SpellDone();
					
					//removed for auto-select//
					spell_selection_img_container += '</div>';
					$('#create-character-page').append(spell_selection_img_container);
					$('#create-character-page').append('<div style="margin-top:'+(top+90)+'px; margin-bottom:60px;"><span id="pc-character-spells-next" class="button" onclick="CharacterController.SpellDone();">Next</span></div>');
					CharacterController.SpellHighlightSelected();
					//
					
				});
	},

	'ClickSpell': function(spell_data_index)
	{
		/*
		$('#spell-description-messagebox').remove();
		var message = CharacterController.spell_data.spell_description[spell_data_index]
			+ '<div style="margin-top:15px;"><span id="pc-spell-select" class="button" onclick="CharacterController.SpellSelect('+spell_data_index+');">Select</span> <span id="pc-spell-cancel" class="button" onclick="CharacterController.SpellCancel('+spell_data_index+');">Cancel</span></div>';
		var messagebox_html = MenuController.DisplayMessage(message, true);
		$('#create-character-page').append('<div id="spell-description-messagebox" onclick="$(\'#spell-description-messagebox\').remove();" style="position:fixed; top:30px; font-family: beebregular;">'+messagebox_html+'</div>');
		*/
		var message = '';
		var spell_id = CharacterController.spell_data.spell_id[spell_data_index];
		var description = CharacterController.spell_data.spell_description[spell_data_index];
		//onsole.log(spell_id);
		if(spell_id == 0) message += '';
		else if(spell_id == 882) message += '<h2>Spark</h2>'+description;
		else if(spell_id == 321) message += '<h2>Mage Hand</h2>'+description;
		else if(spell_id == 121) message += '<h2>Daze</h2>  This spell clouds the mind of a humanoid creature with 4 or fewer Hit Dice so that it takes no actions.';
		else if(spell_id == 163) message += '<h2>Disrupt Undead</h2>'+description;
		else if(spell_id == 212) message += '<h2>Flare</h2>This cantrip creates a burst of light. If you cause the light to burst in front of a single creature  that creature is dazzled for 1 minute unless it makes a successful Fortitude save.';
		else if(spell_id == 312) message += '<h2>Light</h2>This spell creates a light source, like a torch. Light is shed in a 20-foot radius.';
		else if(spell_id == 139) message += '<h2>Detect Poison</h2>You determine whether a creature  object  or area has been poisoned or is poisonous.';
		else if(spell_id == 234) message += '<h2>Ghost Sound</h2>Create illusionary sounds that may distract those able to hear it.';
		else if(spell_id == 45) message += '<h2>Bleed</h2>This spell causes 1 point of damage to the target, undead creatures are not effected.';
		
		else if(spell_id == 108) message += '<h2>Cure Light Wounds</h2>When laying your hand upon a living creature, you channel positive energy that cures 1d8 points of damage + 1 point per caster level (maximum +5).<br/><br/>Since undead are powered by negative energy, this spell deals damage to them instead of curing their wounds.';
		
		//mage 1
		else if(spell_id == 336) message += '<h2>Magic Missle</h2>A missile of magical energy darts forth from your fingertip and strikes its target, dealing 1d4+1 points of force damage. For every two caster levels beyond 1st  you gain an additional missile, to a maximum of five missiles at 9th level or higher.';
		else if(spell_id == 796) message += '<h2>Gravity Bow</h2>Gravity bow significantly increases the weight and density of arrows or bolts fired from your bow or crossbow the instant before they strike their target and then return them to normal a few moments later. Any arrow fired from a bow or crossbow you are carrying when the spell is cast deals more damage.';
		else if(spell_id == 480) message += '<h2>Shield</h2>Shield creates an invisible shield of force that hovers in front of you. It negates magic missile attacks directed at you. The disk also provides a +4 shield bonus to AC. This bonus applies against incorporeal touch attacks (ghosts) since it is a force effect.';
		else if(spell_id == 191) message += '<h2>Expeditious Retreat</h2>This spell increases your base land speed by 30 feet. This adjustment is treated as an enhancement bonus.';
		else if(spell_id == 64) message += '<h2>Cause Fear</h2>'+description;
		else if(spell_id == 57) message += '<h2>Burning Hands</h2>A cone of searing flame, ten feet in length, shoots from your fingertips. Any creature in the area of the flames takes 1d4 points of fire damage per caster level (maximum 5d4).';
		else if(spell_id == 493) message += '<h2>Sleep</h2>A sleep spell causes a magical slumber to come upon 4 HD of creatures.';
		else if(spell_id == 87) message += '<h2>Comprehend Languages</h2>You can understand the spoken words of creatures, or read otherwise incomprehensible written messages.<br/>The spell enables you to understand or read an unknown language  not speak or write it.';
		else if(spell_id == 916) message += '<h2>Vanish</h2>This spell functions like invisibility, except the effect only lasts for 1 round per caster level (maximum of 5 rounds). Like invisibility, the spell immediately ends if the subject attacks any creature.';
		
		//mage 2
		else if(spell_id == 34) message += '<h2>Bear\'s Endurance</h2>The affected creature gains greater vitality and stamina. The spell grants the subject a +4 enhancement bonus to Constitution,  which adds the usual benefits to: hit points, Fortitude saves, Constitution checks, and so forth.';
		else if(spell_id == 50) message += '<h2>Blindness-Deafness</h2>You call upon the powers of unlife to render the subject blinded and deafened.';
		else if(spell_id == 52) message += '<h2>Blur</h2>The subject\'s outline appears blurred, shifting and wavering. This distortion grants the subject concealment (20% chance to evade any attacks).';
		else if(spell_id == 119) message += '<h2>Darkvision</h2>The subject gains the ability to see 60 feet, even in total darkness.';
		else if(spell_id == 466) message += '<h2>See Invisibility</h2>You can see any objects or beings that are invisible within your range of vision, as well as any that are ethereal (ghosts), as if they were normally visible. Such creatures are visible to you as translucent shapes, allowing you easily to discern the difference between visible, invisible, and ethereal creatures.';
		else if(spell_id == 528) message += '<h2>Summon Monster II</h2>Casting this spell summons monsters for a limited time. These creatures will aid you in battle. You can summon one 2nd-level creature, or 1d3 1st-level creatures.';
		else if(spell_id == 711) message += '<h2>Burning Gaze</h2>Your eyes burn like hot coals, allowing you to set objects or foes alight with a glance. As a standard action as long as this spell\'s effects persist, you may direct your burning gaze against a single creature or object within 30 feet of your location.';
		else if(spell_id == 773) message += '<h2>Fire Breath</h2>Up to thrice during this spell\'s duration, you can belch forth a cone of fire as a standard action. The first cone deals 2d6 points of fire damage to every creature in the area.';
		
		//mage 3
		else if(spell_id == 36) message += '<h2>Beast Shape I</h2>When you cast this spell, you can assume some traits of a wild beast. You gain the Scent ability, +2 strength, +2 dexterity, +2 natural armor class, and +10 feet base land movement.';
		else if(spell_id == 254) message += '<h2>Halt Undead</h2>This spell renders as many as three undead creatures immobile. The effect is broken if the halted creatures are attacked or take damage.';
		else if(spell_id == 302) message += '<h2>Invisibility Sphere</h2>'+description;
		else if(spell_id == 307) message += '<h2>Keen Edge</h2>This spell makes a weapon magically keen, improving its ability to deal telling blows. This doubles the critical threat range of the weapon.';
		else if(spell_id == 313) message += '<h2>Lightning Bolt</h2>You release a powerful stroke of electrical energy that deals 1d6 points of electricity damage per caster level (maximum 10d6) to each creature within its area. The bolt begins at your fingertips, and is 120 feet long. If the bolt breaks through an interposing barrier, it may continue beyond the barrier if the spell\'s range permits.';
		else if(spell_id == 495) message += '<h2>Slow</h2>An affected creature moves and attacks at a drastically slowed rate. Creatures affected by this spell are staggered and can take only a single move action or standard action each turn. Additionally, it takes a -1 penalty on attack rolls, AC, and Reflex saves. A slowed creature moves at half its normal speed.';
		
		//driud 0
		else if(spell_id == 418) message += '<h2>Purify Food and Drink</h2>This spell makes spoiled  rotten  diseased  poisonous  or otherwise contaminated food and water pure and suitable for eating and drinking.';
		else if(spell_id == 427) message += '<h2>Read Magic</h2>You can decipher magical inscriptions on objects-books  scrolls  weapons  and the like-that would otherwise be unintelligible.';
		else if(spell_id == 444) message += '<h2>Resistance</h2>'+description;
		else if(spell_id == 515) message += '<h2>Stabilize</h2>'+description;
		
		//driud 1
		else if(spell_id == 185) message += '<h2>Entangle</h2>This spell causes tall grass  weeds  and other plants to wrap around foes in the area of effect or those that enter the area. Creatures that fail their save gain the entangled condition. Creatures that make their save can move as normal  but those that remain in the area must save again at the end of your turn. Creatures that move into the area must save immediately. Those that fail must end their movement and gain the entangled condition.';
		else if(spell_id == 815) message += '<h2>Keen Senses</h2>'+description;
		else if(spell_id == 409) message += '<h2>Produce Flame</h2>Flames as bright as a torch appear in your open hand. The flames harm neither you nor your equipment. In addition to providing illumination. The flames can be hurled with a ranged touch attack, dealing fire damage equal to 1d6 + 1 point per caster level (maximum +5, range 120 feet).';
		else if(spell_id == 781) message += '<h2>Flare Burst</h2>'+description;
		else if(spell_id == 265) message += '<h2>Hide From Animals</h2>'+description;
		else if(spell_id == 367) message += '<h2>Pass Without Trace</h2>'+description;
		else if(spell_id == 333) message += '<h2>Magic Fang</h2>'+description;
		else if(spell_id == 69) message += '<h2>Charm Animal</h2>This charm makes an animal regard you as its trusted friend and ally (treat the target\'s attitude as friendly). If the creature is currently being threatened or attacked by you or your allies, however, it receives a +5 bonus on its saving throw.';
		else if(spell_id == 376) message += '<h2>Pass Without Trace</h2>'+description;
		
		//driud 2
		else if(spell_id == 129) message += '<h2>Delay Poison</h2>'+description;
		else if(spell_id == 33) message += '<h2>Barkskin</h2>Barkskin toughens a creature\'s skin. The effect grants a +2 enhancement bonus to the creature\'s existing natural armor bonus. This enhancement bonus increases by 1 for every three caster levels above 3rd, to a maximum of +5.';
		else if(spell_id == 209) message += '<h2>Flame Blade</h2>A 3-foot-long, blazing beam of red-hot fire springs forth from your hand. You wield this blade-like beam as if it were a scimitar. Attacks with the flame blade are melee touch attacks. The blade deals 1d8 points of fire damage + 1 point per two caster levels (maximum +11).';
		else if(spell_id == 211) message += '<h2>Flaming Sphere</h2>A burning globe of fire rolls in whichever direction you point and burns those it strikes. If it enters a space with a creature it stops moving for the round and deals 3d6 points of fire damage to that creature, though a successful Reflex save negates that damage.';
		else if(spell_id == 373) message += '<h2>Owl\'s Wisdom</h2>The transmuted creature becomes wiser. The spell grants a +4 enhancement bonus to Wisdom, adding the usual benefit to Wisdom-related skills and abilities.';
		else if(spell_id == 537) message += '<h2>Summon Nature\'s Ally II</h2>This spell summons creatures to aid you in battle. You can summon one 2nd-level creature, or 1d3 1st-level creatures.';
		else if(spell_id == 112) message += '<h2>Bulls\'s Strength</h2>'+description;
		
		//driud 3
		else if(spell_id == 112) message += '<h2>Cure Moderate Wounds</h2>'+description;
		else if(spell_id == 120) message += '<h2>Daylight</h2>This spell causes a bright light to shine. Creatures that take penalties in bright light take them while within the 60-foot radius of this magical light. Despite its name, this spell is not the equivalent of daylight for the purposes of creatures that are damaged or destroyed by such light.';
		else if(spell_id == 334) message += '<h2>Magic Fang Greater</h2>'+description;
		else if(spell_id == 365) message += '<h2>Neutralize Poison</h2>You detoxify any sort of venom in the creature or object touched.';
		else if(spell_id == 395) message += '<h2>Poison</h2>'+description;
		else if(spell_id == 436) message += '<h2>Remove Disease</h2>Remove disease can cure all diseases from which the subject is suffering. The spell also kills some hazards and parasites, including green slime and others.';
		else if(spell_id == 538) message += '<h2>Summon Nature\'s Ally III</h2>This spell summons creatures to aid you in battle. You can summon one 3rd-level creature, 1d3 2nd-level creatures, or 1d4+1 1st-level creatures.';
		else if(spell_id == 600) message += '<h2>Water Breathing</h2>'+description;
		else if(spell_id == 93) message += '<h2>Contagion</h2>The subject contracts a terrible disease. It effects the target immediatly, with no onset period.';
		
		//ranger / bard
		else if(spell_id == 954) message += '<h2>Unbreakable Heart</h2>The target creature gains a +4 morale bonus on saving throws against mind-affecting effects that rely on negative emotions (such as crushing despair, rage, or fear effects) or that would force him to harm an ally (such as confusion). If the target is already under such an effect when receiving this spell, that effect is cancelled.';
		else if(spell_id == 526) message += '<h2>Summon Instrument</h2>This spell summons one handheld musical instrument.';
		else if(spell_id == 319) message += '<h2>Lullaby</h2>Any creature within the area that fails a Will save becomes drowsy and inattentive, taking a -5 penalty on Perception checks and a -2 penalty on Will saves against sleep effects while the lullaby is in effect.';
		else if(spell_id == 68) message += '<h2>Charm Person</h2>This charm makes the target regard you as its trusted friend and ally (treat the target\'s attitude as friendly). If the creature is currently being threatened or attacked by you or your allies, however, it receives a +5 bonus on its saving throw.';
		else if(spell_id == 281) message += '<h2>Identify</h2>This spell allows you to identify the properties and command words of magic items in your possession.';
		else if(spell_id == 263) message += '<h2>Heroism</h2>'+description;
		
		//cleric
		else if(spell_id == 46) message += '<h2>Bless</h2>'+description;
		else if(spell_id == 165) message += '<h2>Divine Favor</h2>'+description;
		else if(spell_id == 967) message += '<h2>Weapons Against Evil</h2>'+description;
		else if(spell_id == 403) message += '<h2>Prayer</h2>'+description;
		
		//paladin
		else if(spell_id == 591) message += '<h2>Virtue</h2>'+description;
		
		else message += description;
		message += '<div style="margin-top:15px;"><span id="selected-button" class="button selected" onclick="MenuController.MenuClose(); CharacterController.SpellSelect('+spell_data_index+');">Select</span> <span id="" class="button" onclick="MenuController.MenuClose(); CharacterController.SpellCancel('+spell_data_index+');">Cancel</span></div>';
		
		
		MenuController.DisplayMessage(message, false, true, 500);
		var width = $(window).width();
		$('#message-box-container').css('position','fixed');
		$('#message-box-container').css('top','200px');
		$('#message-box-container').css('left',Math.floor(width/2 - 250)+'px');
	},

	'SpellSelect': function(spell_data_index)
	{
		var spell_already_selected = false;
		for(var i=0; i < CharacterController.new_character_selection.new_spell_list.length; i++)
		{
			if(CharacterController.new_character_selection.new_spell_list[i] == CharacterController.spell_data.spell_id[spell_data_index])
			{
				spell_already_selected = true;
			}
		}
		if(!spell_already_selected)
		{
			CharacterController.new_character_selection.new_spell_list.push(CharacterController.spell_data.spell_id[spell_data_index]);
			CharacterController.new_character_selection.new_spell_level.push(CharacterController.spell_data.spell_level[spell_data_index]);
			CharacterController.new_character_selection.learned_class_id.push(CharacterController.new_character_selection.class_id);
			CharacterController.SpellHighlightSelected();
		}
	},

	'SpellCancel': function(spell_data_index)
	{
		for(var i = CharacterController.new_character_selection.new_spell_list.length - 1; i >= 0; i--)
		{
			//remove spell from array
			if(CharacterController.new_character_selection.new_spell_list[i] == CharacterController.spell_data.spell_id[spell_data_index])
			{
				CharacterController.new_character_selection.new_spell_list.splice(i, 1);
				CharacterController.new_character_selection.new_spell_level.splice(i, 1);
				CharacterController.new_character_selection.learned_class_id.splice(i, 1);
			}
		}
		CharacterController.SpellHighlightSelected();
	},

	'SpellHighlightSelected': function()
	{
		//onsole.log(CharacterController.new_character_selection.new_spell_list);
		$('.pc-select-spell').find('span').css('color','#fff');
		for(var i=0; i < CharacterController.new_character_selection.new_spell_list.length; i++)
		{
			$(".pc-select-spell[data-id='" + CharacterController.new_character_selection.new_spell_list[i] + "']").find('span').css('color','#7F7');
		}
	},

	'SpellDone': function()
	{
		CharacterController.SelectStyle();
	},

	'SelectStyle': function()
	{
		CharacterController.new_character_selection.page = 9;
		CharacterController.new_character_selection.weapon_style_id = -1;
		
		$('#create-character-page').html('<h2>Select Weapon Style</h2>');
		
		var icon_html = CharacterController.GetWeaponStyles();
		//if class has no weapon styles
		if(icon_html == 0) CharacterController.SelectWeapon();
		
		$('#create-character-page').append('<div style="font-size:'+(mobile?'16':'12')+'px;">'+icon_html+'</div>');
	},

	'GetWeaponStyles': function()
	{
		var icon_html = '<div style="font-size:'+(mobile?'16':'12')+'px; line-height:1;">';
		var function_name = 'ClickStyle';
		
		var i_counter = 0;
		var top = 0;
		
		//monk and sorcerer have spelcial list
		if($.inArray(CharacterController.new_character_selection.class_id, [6,10,11]) != -1)//these classes
		{
			return '';
		}
		else
		{
			var icon_image = 'battle_icons/melee.png';
			var icon_name = 'Single handed';
			var id = 0;
			icon_html += '<span class="pc-select-class" onclick="CharacterController.'+function_name+'(this);" style="position:relative; top: '+top+'px; margin-left:25px; margin-right:119px; margin-bottom:60px;" data-id="'+id+'">';
			var pcSelectIcon = new MenuController.MenuItem(icon_image, icon_name, 0, [])
			icon_html += pcSelectIcon.CreateRingIcon('', 0, 1, false, true);//if coords are 0,0 text doesn't get centred
			icon_html += '</span>';
			i_counter++;
				
			if($.inArray(CharacterController.new_character_selection.class_id, [2, 8, 9]) == -1)//not these classes
			{
				var icon_image = 'battle_icons/weapon/two_handed_sword.png';
				var icon_name = 'Two<br/>Handed';
				var id = 1;
				icon_html += '<span class="pc-select-class" onclick="CharacterController.'+function_name+'(this);" style="position:relative; top: '+top+'px; margin-left:25px; margin-right:119px; margin-bottom:60px;" data-id="'+id+'">';
				var pcSelectIcon = new MenuController.MenuItem(icon_image, icon_name, 0, [])
				icon_html += pcSelectIcon.CreateRingIcon('', 0, 1, false, true);//if coords are 0,0 text doesn't get centred
				icon_html += '</span>';
				i_counter++;
			}
			
			var icon_image = 'battle_icons/shield.png';
			var icon_name = 'Weapon and Shield';
			var id = 2;
			icon_html += '<span class="pc-select-class" onclick="CharacterController.'+function_name+'(this);" style="position:relative; top: '+top+'px; margin-left:25px; margin-right:119px; margin-bottom:60px;" data-id="'+id+'">';
			var pcSelectIcon = new MenuController.MenuItem(icon_image, icon_name, 0, [])
			icon_html += pcSelectIcon.CreateRingIcon('', 0, 1, false, true);//if coords are 0,0 text doesn't get centred
			icon_html += '</span>';
			i_counter++;
			top = Math.floor(i_counter/3) * (10 + switchToMobileDisplay*40);
			
			var icon_image = 'battle_icons/melee_mult.png';
			var icon_name = 'Two<br/>Weapon';
			var id = 3;
			icon_html += '<span class="pc-select-class" onclick="CharacterController.'+function_name+'(this);" style="position:relative; top: '+top+'px; margin-left:25px; margin-right:119px; margin-bottom:60px;" data-id="'+id+'">';
			var pcSelectIcon = new MenuController.MenuItem(icon_image, icon_name, 0, [])
			icon_html += pcSelectIcon.CreateRingIcon('', 0, 1, false, true);//if coords are 0,0 text doesn't get centred
			icon_html += '</span>';
			
			/*
			top = Math.floor(i_counter/3) * 60;
			
			var icon_image = 'battle_icons/ranged.png';
			var icon_name = 'Ranged';
			var id = 4;
			icon_html += '<span class="pc-select-class" onclick="CharacterController.'+function_name+'(this);" style="position:relative; top: '+top+'px; margin-left:25px; margin-right:119px; margin-bottom:60px;" data-id="'+id+'">';
			var pcSelectIcon = new MenuController.MenuItem(icon_image, icon_name, 0, [])
			icon_html += pcSelectIcon.CreateRingIcon('', 0, 1, false, true);//if coords are 0,0 text doesn't get centred
			icon_html += '</span>';
			*/
		}
		
		icon_html += '</div>';
		
		return icon_html;
	},

	'ClickStyle': function(e)
	{
		var id = $(e).data('id');
		CharacterController.new_character_selection.weapon_style_id = id;
		CharacterController.SelectWeapon()
	},

	'SelectSecondWeapon': function()
	{
		CharacterController.SelectWeapon();
		CharacterController.new_character_selection.page = 11;
		CharacterController.new_character_selection.selecting_weapon2 = 1;
		$('#create-character-page h2').html('Select Second Weapon');
	},

	'SelectWeapon': function()
	{
		CharacterController.new_character_selection.page = 10;
		CharacterController.new_character_selection.selecting_weapon2 = 0;

		$('#create-character-page').html('<h2>Select Weapon</h2>');
		if(CharacterController.new_character_selection.weapon_style_id == 3) $('#create-character-page h2').html('Select First Weapon');
		$('#create-character-page').append('<div id="load-weapon">Loading...</div>');
		
		
		function ShowWeapons()
		{
			$('#load-weapon').html('');
			var icon_html = '';
			
			if(CharacterController.new_character_selection.class_id == 6)//monk
			{
				var icon_html = '<div style="line-height:1;">';
				icon_html += CharacterController.GetWeaponIcons(0);
				icon_html += CharacterController.GetWeaponIcons(13);
				icon_html += '</div>';
				icon_html += '<div style="margin-top:90px; clear:both;"></div>';
				icon_html += '<div style="margin-top:0px;"><span id="pc-weapon-next" class="button" onclick="CharacterController.WeaponDone();" style="display:none;">Next</span></div>';
			}
			else if(CharacterController.new_character_selection.class_id == 10 || CharacterController.new_character_selection.class_id == 11)//wiz or sorcerer
			{
				var icon_html = '<div style="font-size:'+(mobile?'16':'12')+'px; line-height:1;">';
				icon_html += CharacterController.GetWeaponIcons(0);
				icon_html += CharacterController.GetWeaponIcons(10);
				icon_html += '</div>';
				icon_html += '<div style="margin-top:90px; clear:both;"></div>';
				icon_html += '<div style="margin-top:0px;"><span id="pc-weapon-next" class="button" onclick="CharacterController.WeaponDone();" style="display:none;">Next</span></div>';
			}
			else
			{
				icon_html = CharacterController.GetWeaponIcons();
			}
			
			$('#load-weapon').append(icon_html);
		}
		
		if(CharacterController.new_character_selection.equipment_data == 0)
		{
			$.ajax({
				type: 'POST',
				async: true,
				url: './php/character_create/get_equipment.php',
				data: {}
			})
				.done(function(data) {
					data = $.parseJSON(data);
					CharacterController.new_character_selection.equipment_data = data;
					ShowWeapons();
				});
		}
		else
		{
			ShowWeapons();
		}
	},

	'ClickWeapon': function(e)
	{
		var id = $(e).data('id');
		if(CharacterController.new_character_selection.selecting_weapon2)
		{
			CharacterController.new_character_selection.weaponid_new2 = id;
		}
		else if(CharacterController.new_character_selection.selecting_ranged)
		{
			CharacterController.new_character_selection.weaponid_new_ranged = id;
		}
		else
		{
			CharacterController.new_character_selection.weaponid_new = id;
			//onsole.log(CharacterController.new_character_selection.weaponid_new);
		}
		
			//onsole.log(CharacterController.new_character_selection.weaponid_new, CharacterController.new_character_selection.selecting_ranged, CharacterController.new_character_selection.selecting_weapon2);
		//onsole.log(CharacterController.new_character_selection.thumb_pic_id);
		//$('#create-character-page span').css('color', '#FFF');
		//$(e).find('span').css('color', '#7F7');
		
		//$('#pc-weapon-next').show();
		var equipName = $(e).find('.game-menu-item-description span').html();
		var message = ($(e)[0].outerHTML)+'<br/><br/><br/><br/><br/>'; 
		message += '<div style="margin-top:15px;"><span id="" class="button" onclick="CharacterController.WeaponDone(); MenuController.MenuClose();">Select</span> ';
		message += '<span id="" class="button" onclick="MenuController.MenuClose();">Cancel</span></div>';
		
		MenuController.DisplayMessage(message);
		$('#menu-message-box .pc-select-class').css('top','0px');
		$('#message-box-container').css('position','fixed');
		$('#message-box-container').css('top','200px');
		var width = $(window).width();
		$('#message-box-container').css('left',Math.floor(width/2 - 200)+'px');
	},

	'WeaponDone': function()
	{
		//onsole.log(CharacterController.new_character_selection.weaponid_new,CharacterController.new_character_selection.weapon_style_id,CharacterController.new_character_selection.selecting_weapon2);
		
		//selecting ranged weapon
		if(CharacterController.new_character_selection.selecting_ranged)
		{
			CharacterController.new_character_selection.selecting_ranged = 0;
			//onsole.log('SelectArmor');
			//not wizards
			CharacterController.SelectArmor();
			return true;
		}
		
		if(CharacterController.new_character_selection.weaponid_new > -1)
		{
			//weapon and shield
			if(CharacterController.new_character_selection.weapon_style_id == 2)
			{
				//onsole.log('SelectShield');
				CharacterController.SelectShield();
				return true;
			}
			//two weapon
			if(CharacterController.new_character_selection.weapon_style_id == 3)
			{
				//if finished selecting 2nd weapon
				if(CharacterController.new_character_selection.selecting_weapon2)
				{
					//onsole.log('SelectRanged');
					CharacterController.new_character_selection.selecting_weapon2 = 0;
					CharacterController.SelectRanged();
				}
				else
				{
					//onsole.log('SelectSecondWeapon');
					CharacterController.SelectSecondWeapon();
				}
				return true;
			}
			
			//onsole.log('SelectRanged2');
			CharacterController.SelectRanged();
		}
	},

	'SelectRanged': function()
	{
		if($.inArray(CharacterController.new_character_selection.class_id, [2, 5, 8, 9]) == -1)//if no ranged
		{
			if(CharacterController.new_character_selection.class_id != 11) CharacterController.SelectArmor();
			else CharacterController.SaveNewCharacter()
			return false;
		}
		
		CharacterController.new_character_selection.selecting_ranged = 1;
		CharacterController.SelectWeapon();
		CharacterController.new_character_selection.page = 'ranged';
		$('#create-character-page h2').html('Select Ranged Weapon');
	},
	'SelectShield': function()
	{
		CharacterController.new_character_selection.selecting_shield = 1;
		CharacterController.SelectArmor();
		CharacterController.new_character_selection.page = 'shield';
	},
	'SelectArmor': function()
	{
		CharacterController.new_character_selection.page = 14;
		
		if(CharacterController.new_character_selection.class_id == 6)
		{
			CharacterController.SaveNewCharacter();
			return false;
		}
		
		if(CharacterController.new_character_selection.selecting_shield)
		{
			$('#create-character-page').html('<h2>Select Shield</h2>');
			$('#create-character-page').append(CharacterController.GetEquipmentIcons('shield'))
		}
		else
		{
			$('#create-character-page').html('<h2 style="margin-bottom:10px;">Select Armor</h2>');
			if($.inArray(CharacterController.new_character_selection.class_id, [1, 2, 4, 8, 9, 10]) == -1)//if not one of these classes
			{
				$('#create-character-page').append('<div style="clear:both;; padding-top:30px; margin-bottom:30px;">Heavy Armor</div>');
				$('#create-character-page').append(CharacterController.GetEquipmentIcons('heavy'));
			}
			if($.inArray(CharacterController.new_character_selection.class_id, [10]) == -1)//if not one of these classes
			{
				$('#create-character-page').append('<div style="clear:both; padding-top:30px; margin-bottom:30px;">Medium Armor</div>');
				$('#create-character-page').append(CharacterController.GetEquipmentIcons('medium'));
			}
			if(1)//($.inArray(CharacterController.new_character_selection.class_id, [1, 2, 4, 8, 9]) == -1)//if not one of these classes
			{
				$('#create-character-page').append('<div style="clear:both;; padding-top:30px; margin-bottom:30px;">Light Armor</div>');
				$('#create-character-page').append(CharacterController.GetEquipmentIcons('light'));
			}
		}
		
		//$('#create-character-page').append('<div id="pc-armor-next" style="display:none; margin-top:40px;"><span class="button" onclick="CharacterController.ArmorDone();">Next</span></div>');

	},
	'ClickEquipment': function(e)
	{
		var id = $(e).data('id');
		//onsole.log('ggg',id);
		if(CharacterController.new_character_selection.selecting_shield)
		{
			CharacterController.new_character_selection.shieldid_new = id;
		}
		else
		{
			CharacterController.new_character_selection.armorid_new = id;
		}
		//$('#create-character-page span').css('color', '#FFF');
		//$(e).find('span').css('color', '#7F7');
		
		//$('#pc-armor-next').show();
		var equipName = $(e).find('.game-menu-item-description span').html();
		var message = ($(e)[0].outerHTML)+'<br/><br/><br/><br/><br/>'; 
		message += '<div style="margin-top:15px;"><span id="" class="button" onclick="CharacterController.ArmorDone(); MenuController.MenuClose();">Select</span> ';
		message += '<span id="" class="button" onclick="MenuController.MenuClose();">Cancel</span></div>';
		MenuController.DisplayMessage(message);
		$('#menu-message-box .pc-select-class').css('top','0px');
		$('#message-box-container').css('position','fixed');
		$('#message-box-container').css('top','200px');
		var width = $(window).width();
		$('#message-box-container').css('left',Math.floor(width/2 - 200)+'px');
	},
	'ArmorDone': function()
	{
		if(CharacterController.new_character_selection.armorid_new > -1 || CharacterController.new_character_selection.shieldid_new > -1)
		{
			//weapon and shield
			if(CharacterController.new_character_selection.selecting_shield)
			{
				CharacterController.new_character_selection.selecting_shield = 0;
				CharacterController.SelectRanged();
				return true;
			}
			//onsole.log(CharacterController.new_character_selection.weaponid_new);
			CharacterController.SaveNewCharacter();
		}
	},
	'SaveNewCharacter' : function()
	{
		
		CharacterController.new_character_selection.page = 99;//anything != 1 is ok
		
		$('#create-character-page').html('<h1>Creating Character...</h1>');
		
		//onsole.log(CharacterController.new_character_selection);
		CharacterController.new_character_selection.player_id = CharacterController.player_id;
		CharacterController.new_character_selection.equipment_data = 0;
		
		//adjust attributes to include race bonus
		//CharacterController.new_character_selection.arr_attvalue
		//CharacterController.new_character_selection.arr_att_race_bonus
		for(var i in CharacterController.new_character_selection.arr_attvalue)
		{
			CharacterController.new_character_selection.arr_attvalue[i] += CharacterController.new_character_selection.arr_att_race_bonus[i];
		}
		
		$.ajax({
			type: 'POST',
			async: true,
			url: './php/character_create/character_update.php',
			data: CharacterController.new_character_selection
		})
			.done(function(data) {
					console.log(data);
					data = $.parseJSON(data);
					CharacterController.new_character_selection.character_id = data.character_id;
					GameController.new_player = 0;
					//onsole.log(data);
					//$('#create-character-page').html('<h1>Done</h1>character_id '+data.character_id);
					$('#create-character-page').hide();
					$('#create-character-back-button').hide();
					GameController.GameBegin();
				});
	},
		
	'GetWeaponIcons': function(only_id)
	{
		if(arguments.length < 1) only_id = -1;
		var weapon = CharacterController.new_character_selection.equipment_data.weapon;
		var function_name = 'ClickWeapon';
		var icon_html = '';
		if(only_id == -1) icon_html += '<div style="font-size:'+(mobile?'16':'12')+'px; line-height:1;">';
		var i_counter = 0;
		for(var i=0; i<weapon.length; i++)
		{
			if(only_id == -1)
			{
				//Ranged
				//if(CharacterController.new_character_selection.weapon_style_id == 4)
				if(CharacterController.new_character_selection.selecting_ranged)
				{
					if(weapon[i].WeaponTypeID != 4) continue;
				}
				else
				{
					//Single handed
					if(CharacterController.new_character_selection.weapon_style_id == 0)
					{
						if(weapon[i].WeaponTypeID != 1 && weapon[i].WeaponTypeID != 2) continue;
					}
					//Two handed
					if(CharacterController.new_character_selection.weapon_style_id == 1)
					{
						if(weapon[i].WeaponTypeID != 3) continue;
					}
					//Weapon and Shield
					if(CharacterController.new_character_selection.weapon_style_id == 2)
					{
						if(weapon[i].WeaponTypeID != 1 && weapon[i].WeaponTypeID != 2) continue;
					}
					//Two Weapon
					if(CharacterController.new_character_selection.weapon_style_id == 3)
					{
						if(weapon[i].WeaponTypeID != 1 && weapon[i].WeaponTypeID != 2) continue;
					}
				}
			}
			if(only_id == -1 || only_id == weapon[i].WeaponID)
			{
				var icon_image = EquipmentController.GetEquipmentIcon('weapon', weapon[i]);
				var icon_name = weapon[i].WeaponName;
				var id = weapon[i].WeaponID;
				
				var top = Math.floor(i_counter/3) * (10 + switchToMobileDisplay*40);
				i_counter++;
				
				icon_html += '<span class="pc-select-class" onclick="CharacterController.'+function_name+'(this);" style="position:relative; top: '+top+'px; margin-left:25px; margin-right:119px; margin-bottom:60px;" data-id="'+id+'">';
				var pcSelectIcon = new MenuController.MenuItem(icon_image, icon_name, 0, [])
				icon_html += pcSelectIcon.CreateRingIcon('', 0, 1, false, true);//if coords are 0,0 text doesn't get centred
				icon_html += '</span>';
			}
		}
		if(only_id == -1)
		{
			icon_html += '</div>';
			icon_html += '<div style="margin-top:'+(top+90)+'px; clear:both;"></div>';
			icon_html += '<div style="margin-top:0px;"><span id="pc-weapon-next" class="button" onclick="CharacterController.WeaponDone();" style="display:none;">Next</span></div>';
		}
		return icon_html;
	},

	'GetEquipmentIcons': function(type, only_id)
	{
		if(arguments.length < 2) only_id = -1;
		var equipment = CharacterController.new_character_selection.equipment_data.armor;
		var function_name = 'ClickEquipment';
		var icon_html = '';
		if(only_id == -1) icon_html += '<div style="font-size:'+(mobile?'16':'12')+'px; line-height:1;">';
		var i_counter = 0;
		for(var i=0; i<equipment.length; i++)
		{
			if(only_id == -1)
			{
				/*
				ArmorID
				ArmorName
				ACBonus
				MaxDex
				SkillPenalty
				SpellFail
				ArmorType
				ArmorSize
				Material
				Shield
				Description
				*/
				equipment[i].Shield = parseInt(equipment[i].Shield);
				switch(type)
				{
					case 'heavy':
						if(equipment[i].ArmorType != 'H' || equipment[i].Shield) continue;
						break;
					case 'medium':
						if(equipment[i].ArmorType != 'M' || equipment[i].Shield) continue;
						break;
					case 'light':
						if(equipment[i].ArmorType != 'L' || equipment[i].Shield) continue;
						break;
					case 'shield':
						if(!equipment[i].Shield) continue;
						break;
				}
			}
			if(only_id == -1 || only_id == equipment[i].equipmentID)
			{
				var icon_image = EquipmentController.GetEquipmentIcon('armor', equipment[i]);
				var icon_name = equipment[i].ArmorName;
				var id = equipment[i].ArmorID;
				
				var top = Math.floor(i_counter/3) * (10 + switchToMobileDisplay*40);
				i_counter++;
				
				icon_html += '<span class="pc-select-class" onclick="CharacterController.'+function_name+'(this);" style="position:relative; top: '+top+'px; margin-left:25px; margin-right:119px; margin-bottom:60px;" data-id="'+id+'">';
				var pcSelectIcon = new MenuController.MenuItem(icon_image, icon_name, 0, [])
				icon_html += pcSelectIcon.CreateRingIcon('', 0, 1, false, true);//if coords are 0,0 text doesn't get centred
				icon_html += '</span>';
			}
		}
		
		if(only_id == -1)
		{
			icon_html += '</div>';
			icon_html += '<div style="margin-top:'+(top+90)+'px; clear:both;"></div>';
		}
		
		return icon_html;
	},

}

CharacterController.player_id = -1;

//LOADING CHARACTER FUNCTIONS used in game.load_level and action controller - summon monsters
CharacterController.get_quickstat_character_stats_index = function(quick_stat_id)
{
	var quickstat_character_stats_index = -1;
	find_index_loop:
	for(var i = 0; i < GameController.quickstat_character_stats.length; i++)
	{
		if(GameController.quickstat_character_stats[i].quick_stat_id == quick_stat_id)
		{
			quickstat_character_stats_index = i;
			break find_index_loop;
		}
	}
	return quickstat_character_stats_index;
}

CharacterController.fill_character_stats_data_with_loaded_quick_stat = function(monster_index)
{
	var game = GameController;
	//find quick_stat that corresponds to this monster by comparing
	//(game.characters[monster_index].character_stats.quick_stat_id == game.quickstat_character_stats[loop_index].quick_stat_id)
	//has this characters quick_stats already been loaded by previous monster load
	var quickstat_character_stats_index = CharacterController.get_quickstat_character_stats_index(game.characters[monster_index].character_stats.quick_stat_id);
	
	//onsole.log(game.characters[monster_index].character_stats.character_name,game.characters[monster_index].character_stats['effects']);
	
	//for all properties of characters character stats object that are null or [], get value from related quick_stat object
	Object.keys(game.characters[monster_index].character_stats).forEach(function(key,index)
	{ 
		//key = the name of the object key //index = the ordinal position of the key within the object
		
		//onsole.log(key + '=' + game.characters[monster_index].character_stats[key]);
		//skip effects, action data and items
		if(key != 'effects' && key != 'action_data' && key != 'arr_quick_items_id')
		{
			//property
			if(game.characters[monster_index].character_stats[key] === null)
				game.characters[monster_index].character_stats[key] = game.quickstat_character_stats[quickstat_character_stats_index].character_stats[key];
			
			//property that is an array
			if(game.characters[monster_index].character_stats[key] !== null && game.characters[monster_index].character_stats[key].constructor === Array && game.characters[monster_index].character_stats[key].length == 0)
				game.characters[monster_index].character_stats[key] = game.quickstat_character_stats[quickstat_character_stats_index].character_stats[key];
		}
		
	});
	//action_data object doesn't need to be a separate copy, always the same abilities for monster types
	game.characters[monster_index].character_stats.action_data = game.quickstat_character_stats[quickstat_character_stats_index].character_stats.action_data;
}

CharacterController.LoadCharacterCallback = function(data)
{
	var game = GameController;
	var character_stats = $.parseJSON(data);
	var character_id = character_stats.character_id;
	
	//console.log(character_stats);
	
	//if character found in DB
	if(character_id > 0)
	{
		var poly_sprite = 0;
		if(character_stats.poly_character_stats != 0)
		{
			//onsole.log('character_stats.poly_character_stats.sprite_file',character_stats.poly_character_stats.sprite_file);
			poly_sprite = new Image();
			poly_sprite.src = "./images/"+character_stats.poly_character_stats.sprite_file;
			poly_sprite.onload = function(){
					game.sprites_loaded++;
				}
		}
		else
		{
			//not loading a sprite for alternate character form
			game.sprites_loaded++;
		}
		game.characters.push(
			{
				'character_stats': character_stats,
				//polymorph sprite
				'poly_sprite': poly_sprite,
				'quick_stat_id': character_stats.quick_stat_id,
				'conversation': 0,
				'PC': 0,
				'party_id': -1,
				'in_encounter': 0,
				'highlight': 0,
				'x': 0,
				'y': 0,
				'facing': 'right',
				'direction': 0,
				'move_destination_y': -1,
				'move_destination_x': -1,
				'character_sprite': new Image(),
				'sprite_coords': [-1,-1],
				'sprite_offset': [0,0]
			});
		
		var preloadImagePath;
		preloadImagePath = './images/char/thumb/charthumb_'+character_stats.thumb_pic_id+'.png';
		$('#image-preload').append('<img style="clear:both;" src="'+preloadImagePath+'"/>');
		/*
		if(character_stats.full_pic_file_name !== null) // IS THIS ERROR WITH image = 0?
		{
			preloadImagePath = './images/images/char/full/'+character_stats.full_pic_file_name;
			$('#image-preload').append('<img style="clear:both;" src="'+preloadImagePath+'"/>');
		}
		*/
		var monster_index = game.characters.length - 1;
		//if only master_character_stats returned, fill in data from previously loaded quickstat_character_stats array
		if(game.characters[monster_index].character_stats.hd === null && game.characters[monster_index].character_stats.hp === null)
		{
			CharacterController.fill_character_stats_data_with_loaded_quick_stat(monster_index);
			//onsole.log('character loaded with existing quickstat data');
		}
		//if full character_stats returned, save character_stats as quick_stats for future reference (to reduce loading)
		else
		{
			character_stats.action_data = ActionController.SetCharacterActionData(character_stats, monster_index);
			game.quickstat_character_stats.push({'quick_stat_id':character_stats.quick_stat_id, 'character_stats': character_stats});
		}
		
		game.characters[monster_index].character_stats.hp = parseInt(game.characters[monster_index].character_stats.hp);
		game.characters[monster_index].character_stats.hp_damage = parseInt(game.characters[monster_index].character_stats.hp_damage);
		
		//go through characters effects and parse JSON EffectData / each character has own copy of their effects / effect data
		for(var i in game.characters[monster_index].character_stats.effects)
		{
			if(game.characters[monster_index].character_stats.effects[i].EffectData)
				game.characters[monster_index].character_stats.effects[i].EffectData = $.parseJSON(game.characters[monster_index].character_stats.effects[i].EffectData);
		}
		
		//x y pos
		game.characters[monster_index].character_stats.area_id = parseInt(game.characters[monster_index].character_stats.area_id);
		game.characters[monster_index].y = parseInt(game.characters[monster_index].character_stats.y_pos);
		game.characters[monster_index].x = parseInt(game.characters[monster_index].character_stats.x_pos);
		
		//set goodguy or badguy
		game.characters[monster_index].character_stats.GoodGuy = (game.characters[monster_index].character_stats.quick_stat_catagory_id == 3)? 0: 1;
		
		//check player party for if this creature was summoned/charmed by a player character
		//if so have them join the player group
		if(game.characters[monster_index].character_stats.summoned_by_character_id)
		{
			for(var i=0; i<game.characters.length; i++)
			{
				if(game.characters[i].party_id == GameController.player.party_id && game.characters[i].character_stats.character_id == game.characters[monster_index].character_stats.summoned_by_character_id)
				{
					CharacterController.AddCharacterToParty(monster_index);
					break;
				}
			}
		}
		
		//if dead add skeleton to object_layer in x y pos
		//console.log('IsCharacterAlive',GameController.characters[monster_index].character_stats.character_id,CharacterController.IsCharacterAlive(GameController.characters[monster_index].character_stats));
		//console.log(GameController.characters[monster_index].character_stats);
		if(!CharacterController.IsCharacterAlive(GameController.characters[monster_index].character_stats))
		{
			if(GameController.object_layer[GameController.characters[monster_index].y][GameController.characters[monster_index].x] == 0)
			{
				GameController.object_layer[GameController.characters[monster_index].y][GameController.characters[monster_index].x] = [];
			}
			GameController.object_layer[GameController.characters[monster_index].y][GameController.characters[monster_index].x].push({'layer': 0, 'tileset_index': 25, 'tileset_pos': [0, 10]});
		}
		
		//game.characters[monster_index].character_sprite.src = "./images/char/sprite/char/"+game.characters[monster_index].character_stats.sprite_id+".png";
		game.characters[monster_index].character_sprite.src = "./images/"+game.characters[monster_index].character_stats.sprite_file;
		game.characters[monster_index].character_sprite.onload = function(){
				game.sprites_loaded++;
			}
		
		//using in editor - should use everywhere, for saving map while playing
		game.character_layer[game.characters[monster_index].y][game.characters[monster_index].x] = {'character_id':game.characters[monster_index].character_stats.character_id,'character_index':monster_index};
	
		//load conversation if game.characters[monster_index].character_stats.conversation_id > 0
		if(!game.edit && game.characters[monster_index].character_stats.conversation_id > 0)
		{
			ConvEditController.ConversationLoad(false, game.characters[monster_index].character_stats.conversation_id, monster_index)
		}
		
		//remove items handed to player character
		for(var item_index in GameController.pc_world_itmes)
		{
			var item = GameController.pc_world_itmes[item_index];
			//if this pc wold item came from this monster (compare from id to character id)
			if(item.FromCharacterID == game.characters[monster_index].character_stats.character_id)
			{
				//item list of the type: 'weapon', 'armor', 'equipment
				var quick_items_id_list = game.characters[monster_index].character_stats.arr_quick_items_id[item.ItemType];
				//check item list for item to remove
				remove_item_loop:
				for(var list_index in quick_items_id_list)
				{
					if(item.ItemID == quick_items_id_list[list_index])
					{
						//item has been handed over to someone else
						//remove from npc's list
						quick_items_id_list.splice(list_index, 1);
						break remove_item_loop;
					}
				}
			}
		}
		
	}
	else
	{
		//could not find character, so continue without it
		game.sprites_loaded++;//main sprite
		game.sprites_loaded++;//poly sprite
		//GameController //if(sprites_loaded == player_character_stats.length * 2) //must use sprites loaded
	}
}

//ADD CHARACTER TO PARTY
CharacterController.IsPartyMember = function(character)
{
	return (character.party_id == GameController.player.party_id) ? 1 : 0;
}
//ADD CHARACTER TO PARTY
CharacterController.AddCharacterToParty = function(character_index)
{
	var character = GameController.characters[character_index];
	character.GoodGuy = 1;
	character.party_id = GameController.player.party_id;
	//create menu (first load ability data if player character type)
	CharacterController.SetAbilityDataMenu(character_index);
	FormationController.SetFormation();
	FormationController.SetFormationMenu();
}

//SETTING (AND LOADING) CHARACTER ABILITY DATA FOR MENUS
CharacterController.SetAbilityDataMenu = function(character_index)
{
	var character = GameController.characters[character_index];
	
	if(character.character_stats.quick_stat_catagory_id == 1)//1 = Player Character type
	{
		CharacterController.AbilityDataLoad(character_index);
	}
	else
	{
		character.character_stats.action_data = ActionController.SetCharacterActionData(character.character_stats, character_index);
		var menu_data = MenuController.CreateCharacterMenuItems(character_index);
		GameController.characters[character_index].character_stats.menu_data = menu_data;
		if(character.party_id == GameController.player.party_id && GameController.menus_loading == GameController.menus_loaded)
		{
			MenuController.SetMasterMenu();
		}
	}
}

CharacterController.AbilityDataLoad = function(character_index)
{
	GameController.menus_loading++;
	MenuController.MenuLoading = true;
	var character_id = GameController.characters[character_index].character_stats.character_id;
	ajax_action('character_ability_data_load_json.php', character_id, {'party_stats_index': character_index}, CharacterController.AbilityDataLoadCallback);
}

CharacterController.AbilityDataLoadCallback = function(data)
{
	var ability_data_returned = $.parseJSON(data);
	//onsole.log(ability_data_returned);
	GameController.characters[ability_data_returned.party_stats_index].character_stats.ability_data = ability_data_returned;
	
	//onsole.log(ability_data_returned);
	var action_data = ActionController.SetCharacterActionData(GameController.characters[ability_data_returned.party_stats_index].character_stats, ability_data_returned.party_stats_index);
	GameController.characters[ability_data_returned.party_stats_index].character_stats.action_data = action_data;
	
	//set PC  menu as part of their character_stats
	var menu_data = MenuController.CreateCharacterMenuItems(ability_data_returned.party_stats_index);
	GameController.characters[ability_data_returned.party_stats_index].character_stats.menu_data = menu_data;
	
	GameController.menus_loaded++;
	if(GameController.menus_loading == GameController.menus_loaded)
	{
		MenuController.MenuClose();
		//if message is being displayed, close and CreateMenu()
		MenuController.SetMasterMenu();
		CharacterController.ShowCharacterDisplay(0);
	}
}

//CHARACTER UTILITY FUNCTIONS
CharacterController.CanCharacterSenseCharacter = function(character_stats, target_character_stats)
{
	var canSee = true;
	//is character vision good enough to see target; check distance, vision type, conditions
	//var effect_vision_mods = EffectController.GetEffectTypeMods(character_stats, 'vision');
	
	if(EffectController.CheckEffectConditions(character_stats, 'Blinded')) canSee = false;
	//if character can see target; is target invisible or hiding
	if(canSee && EffectController.CheckEffectConditions(target_character_stats, 'Invsible')) canSee = false;
	return canSee;
}

CharacterController.HasFeat = function(character_stats, feat_name)
{
	if(typeof character_stats.ability_data == 'undefined') return false;
	if(typeof character_stats.ability_data.feat == 'undefined') return false;//not sure if this is needed
	for(var i=0; i<character_stats.ability_data.feat.length; i++)
	{
		if(character_stats.ability_data.feat[i].name == feat_name) return true;
	}
	return false;
}

CharacterController.GetStat = function(character_stats, stat_key, secondary_key, vs_character_stats)
{
	if(arguments.length < 3) secondary_key = -1;
	if(arguments.length < 4) vs_character_stats = 0;
	
	var stat_val = 0;
	var effect_mod = 0;
	var effect_note_list = [];
	switch(stat_key)
	{
		//move, swim, fly, size, space, reach
		//***polymorph stats***
		case 'move':
			effect_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectMovementMod', 0);//0==land speed
			var move_effect_mod = effect_mod.total_mod;
			if(character_stats.poly_character_stats == 0)
				stat_val = character_stats.move;
			else
			{
				stat_val = 0;
				move_effect_mod += character_stats.poly_character_stats.move;
			}
			return {'stat_val':stat_val, 'effect_mod':move_effect_mod, 'effect_note_list':effect_mod.effect_note_list};
			break;
			
		case 'swim':
			effect_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectMovementMod', 1);//1==swim speed
			var swim_effect_mod = effect_mod.total_mod;;
			if(character_stats.poly_character_stats == 0)
				stat_val = character_stats.swim;
			else
			{
				stat_val = 0;
				swim_effect_mod += character_stats.poly_character_stats.swim;
			}
			return {'stat_val':stat_val, 'effect_mod':swim_effect_mod, 'effect_note_list':effect_mod.effect_note_list};
			break;
			
		case 'fly':
			effect_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectMovementMod', 2);//2==fly speed
			var fly_effect_mod = effect_mod.total_mod;;
			if(character_stats.poly_character_stats == 0)
				stat_val = character_stats.fly;
			else
			{
				stat_val = 0;
				fly_effect_mod += character_stats.poly_character_stats.fly;
			}
			return {'stat_val':stat_val, 'effect_mod':fly_effect_mod, 'effect_note_list':effect_mod.effect_note_list};
			break;
				
		case 'size_name':
			if(character_stats.poly_character_stats == 0)
				stat_val = character_stats.size_name;
			else
			{
				stat_val = 0;
				effect_mod = character_stats.poly_character_stats.size_name;
			}
			return {'stat_val':stat_val, 'effect_mod':effect_mod, 'effect_note_list':[]};//effect_note_list
			break;
					
		case 'space':
			if(character_stats.poly_character_stats == 0)
				stat_val = character_stats.space;
			else
			{
				stat_val = 0;
				effect_mod = character_stats.poly_character_stats.space;
			}
			return {'stat_val':stat_val, 'effect_mod':effect_mod, 'effect_note_list':[]};//effect_note_list
			break;
				
		case 'reach':
			if(character_stats.poly_character_stats == 0)
				stat_val = character_stats.reach;
			else
			{
				stat_val = 0;
				effect_mod = character_stats.poly_character_stats.reach;
			}
			return {'stat_val':character_stats.reach, 'effect_mod':effect_mod, 'effect_note_list':[]};//effect_note_list
			break;
		
		case 'ac':
		case 'touch':
		case 'flat_footed':
			//***polymorph stats***
			
			//armor & deflect
			//noc & monster Quickstats
			if(character_stats.poly_character_stats != 0)//use polymorphed stats
			{
				var armor_mod = character_stats.poly_character_stats.Armor;
				var deflect_mod = character_stats.poly_character_stats.DeflectAC;
				//var dex_mod = character_stats.poly_character_stats.dex_mod;
				var dodge_mod = 0;//includes mosters dex bonus so don't add //character_stats.poly_character_stats.Dodge;//Quickstats dodge
				var sizemod = character_stats.poly_character_stats.size_mod;
				var nat_ac_mod = character_stats.poly_character_stats.NaturalAC;
			}
			else
			{
				//NPC / MONSTER
				var armor_mod = character_stats.Armor;
				var deflect_mod = character_stats.DeflectAC;
				var dodge_mod = character_stats.Dodge;//Quickstats dodge
				var sizemod = character_stats.size_mod;
				var nat_ac_mod = character_stats.NaturalAC;
				
				//PLAYER
				if(typeof character_stats.ArmorArr != 'undefined')
				{
					for(var i=0; i<character_stats.ArmorArr.length; i++)
					{
						//armor
						if(character_stats.ArmorArr[i].Equipped && character_stats.ArmorArr[i].Shield == 0) armor_mod = parseInt(character_stats.ArmorArr[i].ACBonus);
						//shield
						if(character_stats.ArmorArr[i].Equipped && character_stats.ArmorArr[i].Shield == 1) deflect_mod = parseInt(character_stats.ArmorArr[i].ACBonus);
					}
				}
			}
			
			//get all AC effect mods
			// vs_character_stats, so if vs evil, protect from evil
			// if vs_character_stats == 0, then will get all, also returns an effect_note_list
			var ac_effect_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectACMod', vs_character_stats);
			effect_note_list = ac_effect_mod.effect_note_list;
			
			//armor effect
			var armor_effect_mod = ac_effect_mod.effect_mod_type_list[2].mod;// 2 == Armor
			//onsole.log('armor_effect_mod',armor_effect_mod);
			//if the 'armor_effect_mod' is more then the 'armor_mod', then subtract and the mod is only as effective as the diffence (i.e. has armor but cast the mage armor spell, then the spell adds less armor)
			armor_effect_mod = (armor_effect_mod > armor_mod) ? (armor_effect_mod - armor_mod) : 0;
			
			//deflect effect
			deflect_effect_mod = ac_effect_mod.effect_mod_type_list[5].mod;// 5 == Deflection
			//onsole.log('deflect_effect_mod',deflect_effect_mod);
			//if the 'deflect_effect_mod' is more then the 'deflect_mod', then subtract and the mod is only as effective as the diffence (i.e. has a shield but cast the shield spell, then the shield spell adds less deflect)
			deflect_effect_mod = (deflect_effect_mod > deflect_mod) ? (deflect_effect_mod - deflect_mod) : 0;
			
			//dex
			var dex_mod = character_stats.dex_mod;//for polymorph: use the characters dex mod plus effect modifiers for shape change, done below
			var dex_effect_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectAttributeMod', 1);// 1 == dex
			dex_effect_mod = dex_effect_mod.total_mod;
			
			//dodge
			dodge_mod += CharacterController.HasFeat(character_stats, 'Dodge') ? 1 : 0;
			var dodge_effect_mod = ac_effect_mod.effect_mod_type_list[6].mod;// 6 == Dodge
			//onsole.log('dodge_effect_mod',dodge_effect_mod);
			
			//size
			var effect_sizemod = character_stats.size_mod;
			
			//natural ac
			var nat_ac_effect_mod = ac_effect_mod.effect_mod_type_list[12].mod;// 12 == Natural armor
			//onsole.log('nat_ac_effect_mod',nat_ac_effect_mod);
			nat_ac_effect_mod = (nat_ac_effect_mod > nat_ac_mod) ? (nat_ac_effect_mod - nat_ac_mod) : 0;
			
			//total up remaining mods and lump then into 'other_ac_mods'
			var other_ac_mods = 0;
			//onsole.log('ac_effect_mod',ac_effect_mod);
			//total the mods
			for(var i=1; i<= 18; i++) //should be from 1 to 18
			{
				if(i!=2 && i!=5 && i!=6 && i!=12) other_ac_mods += ac_effect_mod.effect_mod_type_list[i].mod;
			}
			//onsole.log('ac_effect_mod',ac_effect_mod);
			//onsole.log('other_ac_mods',other_ac_mods);
			
			//onsole.log(armor_mod, deflect_mod, dex_mod, dodge_mod, sizemod, nat_ac_mod);
			stat_val = 10 + (stat_key != 'touch' ? armor_mod : 0) + deflect_mod + (stat_key != 'flat_footed' || dex_mod < 0 ? dex_mod : 0) + (stat_key != 'flat_footed' ? dodge_mod : 0) + sizemod + (stat_key != 'touch' ? nat_ac_mod : 0);
			//onsole.log(armor_effect_mod, deflect_effect_mod, dex_effect_mod, dodge_effect_mod, effect_sizemod, nat_ac_effect_mod, other_ac_mods);
			effect_mod = (stat_key != 'touch' ? armor_effect_mod : 0) + deflect_effect_mod + (stat_key != 'flat_footed' || dex_effect_mod < 0 ? dex_effect_mod : 0) + (stat_key != 'flat_footed' ? dodge_effect_mod : 0) + effect_sizemod + (stat_key != 'touch' ? nat_ac_effect_mod : 0) + other_ac_mods;
			
			break;
		
		case 'CMD'://??? in ResolveAttack?
			stat_val = 0;
			effect_mod = 0;
			break;
			
		
		case 'fort':
		case 'ref':
		case 'will':
			if(stat_key == 'fort')
			{
				var feat_mod = CharacterController.HasFeat(character_stats, 'Improved Fortitude') ? 1 : 0;
				var attr_effect_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectAttributeMod', 2, vs_character_stats);// 2 == con
				var get_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectSaveMod', 0);
			}
			else if(stat_key == 'ref')
			{
				var feat_mod = CharacterController.HasFeat(character_stats, 'Improved Relfexes') ? 1 : 0;
				var attr_effect_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectAttributeMod', 1, vs_character_stats);// 1 == dex
				var get_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectSaveMod', 1);
			}
			else if(stat_key == 'will')
			{
				var feat_mod = CharacterController.HasFeat(character_stats, 'Improved Willpower') ? 1 : 0;
				var attr_effect_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectAttributeMod', 4, vs_character_stats);// 4 == wiz
				var get_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectSaveMod', 2);
			}
			stat_val = character_stats[stat_key] + feat_mod;
			effect_mod = attr_effect_mod.total_mod + get_mod.total_mod;
			effect_note_list = get_mod.effect_note_list;
			break;
			
		case 'hp':
			//feat & favoured class bonus included in php
			stat_val = character_stats[stat_key];
			var attr_effect_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectAttributeMod', 2);// 2 == con
			var get_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectHPMod', 2);// 2 == TempHP
			effect_mod = (attr_effect_mod.total_mod * character_stats.hd) + get_mod.total_mod;
			//onsole.log(character_stats.effects);
			//onsole.log(get_mod);
			break;
			
		case 'initiative':
			stat_val = character_stats[stat_key];
			//base dex and feat included in php
			//var feat_mod = CharacterController.HasFeat(character_stats, 'Improved Initiative') ? 4 : 0;
			var attr_effect_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectAttributeMod', 1);// 1 == dex
			//var get_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectInitMod');//this effect mod doesn't exist yet
			effect_mod = attr_effect_mod.total_mod;// + get_mod.total_mod
			break;
			
		case 'skill':
			stat_val = character_stats.arr_skill_roll[secondary_key];
			//var feat_mod = CharacterController.HasFeat(character_stats, 'Improved Skill??') ? 4 : 0;//this isn't going to work!
			var attr_effect_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectAttributeMod', GameController.skill_arr[secondary_key].AttributeID, vs_character_stats);//skill attribute bonus
			var get_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectSkillMod', secondary_key);
			effect_mod = attr_effect_mod.total_mod + get_mod.total_mod
			break;
			
		case 'pass_dr':
			//only used here for display stats
			stat_val = 0;//no stat does this, unless an outsider, then alignment?
			var get_mod = EffectController.GetEffectTypeMods(character_stats, 'EffectAttackMod', 'pass_dr');
			effect_note_list = get_mod.effect_note_list;
			break;
	}
	
	if(effect_note_list.length == 0) effect_note_list.push('');
	
	return {'stat_val':stat_val, 'effect_mod':effect_mod, 'total_val':stat_val+effect_mod, 'effect_note_list':effect_note_list};
}

CharacterController.GetNumActions = function(character_stats)
{
	//0 = no actions (dead, KO'd, sleeping, held, paralysed
	//check HP and effects
	if(0)
	{
		return 0;
	}
	//0.5=half action (1 standard action)
	//1=full actions
	//2=extra action
	return 1
}

CharacterController.GetAttributeBonus = function(character_stats, attribute_id)
{
	var modifier = 0;
	
	var effect_mods = EffectController.GetEffectTypeMods(character_stats, 'EffectAttributeMod', attribute_id);
	modifier += effect_mods.total_mod;
	
	switch(attribute_id)
	{
		case 0: return modifier + character_stats.str_mod;
		case 1: return modifier + character_stats.dex_mod;
		case 2: return modifier + character_stats.con_mod;
		case 3: return modifier + character_stats.int_mod;
		case 4: return modifier + character_stats.wis_mod;
		case 5: return modifier + character_stats.cha_mod;	
	}
	//return 0 if anything else, a -1 id is no bonus
	return 0;
}

CharacterController.GetDamageResisted = function(character_stats, hp_mod_name, dice_roll_result, action_data)
{
	if(arguments.length < 4) action_data = 0;
	else special_attack_effects = action_data.effects;
	var damage_resisted = 0;
	//onsole.log('special_attack_effects',special_attack_effects);
	
	//damage reduction 'evil' is overcome by evil aligned weapons
	
	//immunity - no damage
	
	//vulnerability +50% more damage
	
	//resistant - reduce damage by modifier
	
	//onsole.log('damage_resisted',damage_resisted);
	return 0;
}

CharacterController.IsCharacterAlive = function(character_stats)
{
	var get_stat = CharacterController.GetStat(character_stats, 'hp');
	var hp = get_stat.total_val;
	if(character_stats.hp_damage >= hp) return false;
	return true;
}

CharacterController.IsPlayerAlive = function()
{
	var player_alive = false;
	for(i in GameController.characters)
	{
		var character = GameController.characters[i];
		if(CharacterController.IsPartyMember(character) && CharacterController.IsCharacterAlive(character.character_stats)) 
			player_alive = true;
	}
	if(player_alive == false)
	{
		if(GameController.in_encounter)
		{
			//deselect highlighted characters
			BattleController.current_character_stats_index = -1;
			BattleController.player_character_selected_index = -1;
			BattleController.highlight_character_selected_index = -1;
			BattleController.draw();
			$('#battle-container').fadeOut(500, function(){
				$('#game-map-container').fadeIn();
			});
		}
		GameController.GameOver();
		return false;
	}
	return true;
}

CharacterController.DeleteCharacter = function()
{
	var message = 'Are you sure you want to delete this character?<br/><br/>'; 
	message += '<div style="margin-top:15px;" id=""><span id="" class="button" onclick="CharacterController.DeleteCharacterConfirmed();">OK</span> ';
	message += ' <span id="" class="button" onclick="MenuController.MenuClose();">Cancel</span></div>';
	MenuController.DisplayMessage(message);
}

CharacterController.DeleteCharacterConfirmed = function()
{
	var character_id = $('#pc-selection').val();
	
	var message = 'Deleteing...'; 
	MenuController.DisplayMessage(message);
	
	$.ajax({
			type: 'POST',
			async: false,
			url: './php/character_create/character_delete.php',
			data: {'character_id': character_id}
		})
			.done(function() { 
					var message = 'Character has been deleted.<br/><br/>'; 
					message += ' <span id="selected-button" class="button selected" onclick="MenuController.MenuClose();">OK</span></div>';
					MenuController.DisplayMessage(message);
					GameController.GameBegin();
				});
}

CharacterController.ResetCharacter = function()
{
	var message = 'Reset Character<br/>Are you sure?<br/><br/>'; 
	message += '<div style="margin-top:15px;" id=""><span id="" class="button" onclick="CharacterController.ResetCharacterConfirmed();">OK</span> ';
	message += ' <span id="" class="button" onclick="MenuController.MenuClose();">Cancel</span></div>';
	MenuController.DisplayMessage(message);
}

CharacterController.ResetCharacterConfirmed = function()
{
	var message = 'Reseting...'; 
	MenuController.DisplayMessage(message);
	var callback = function()
	{
		var message = 'Character has been reset.<br/><br/>'; 
		message += ' <span id="selected-button" class="button selected" onclick="MenuController.MenuClose();">OK</span></div>';
		MenuController.DisplayMessage(message);
	}
	var character_id = parseInt($('#pc-selection').find(':selected').data('character-id'));
	ajax_action('character_create/character_reset.php', character_id, 0, callback);
}

CharacterController.PCSaveItems = function()
{
	var character_index = 0;
	var data = {
		'save_equipment': 1,
		'character_id': GameController.characters[character_index].character_stats.character_id,
		'WeaponArr': GameController.characters[character_index].character_stats.WeaponArr,
		'ArmorArr': GameController.characters[character_index].character_stats.ArmorArr,
		'EquipArr': GameController.characters[character_index].character_stats.EquipArr
	}
	
	$.ajax({
		type: 'POST',
		async: true,
		url: './php/character_save/character_save_items.php',
		data: data
	})
		.done(function(data) {
				//onsole.log(GameController.characters[character_index].character_stats.WeaponArr);
			});
}

CharacterController.UpdateWorldItems = function()
{
	var data = {
		'save_world_items': 1,
		'player_character_id': GameController.player.character_id,
		'items': GameController.pc_world_itmes
	}
	console.log('update world items');
	$.ajax({
		type: 'POST',
		async: true,
		url: './php/character_save/character_save_items.php',
		data: data
	})
		.done(function(data) {
				data = $.parseJSON(data);
				//onsole.log(data);
			});
}

CharacterController.GetDisplay = {

	'GetThumb' : function(character_index, align, is_message_box_display) {
			var character_stats = GameController.characters[character_index].character_stats;
			var html = '<div class="character-display-thumb" style="float:'+align+'; '+(is_message_box_display?'margin: 0 0 20px 10px;':'')+'">';
			html += '<div class="trans_background_75"></div><img src="./images/char/thumb/charthumb_'+character_stats.thumb_pic_id+'.png" style="position:absolute; left:0;" class=""/></div>';
			return html;
		},
	'GetName' : function(character_index, align, is_message_box_display) {
			var character_stats = GameController.characters[character_index].character_stats;
			var html = '<div class="character-display-info" style="float:'+align+';">'+character_stats.character_name+'</div><br/>';
			return html;
		},
	'GetHearts' : function(character_index, align, is_message_box_display) {
			var character_stats = GameController.characters[character_index].character_stats;
			var heartTclass = '';
			var heartDclass = '';
			
			var hp = CharacterController.GetStat(character_stats, 'hp');
			var hp = hp.total_val;
			var totalHearts = Math.ceil(hp / 12);
			var hp_damage = character_stats.hp_damage;
			var remainingHp = hp-hp_damage;
			var thisLoopHp = 0;
			var diffHp = 0;
			var html = '<div title="Hit Points: '+remainingHp+'/'+hp+'" class="character-display-info" style="float:'+align+';">';
			if(is_message_box_display) html += '<div style="float:left;">Hit Points: '+remainingHp+'/'+hp+'</div><br/>';
			for(var i=1; i<=totalHearts; i++)
			{
				thisLoopHp = i*12;
				if(thisLoopHp <= remainingHp)
				{
					heartDclass = 'heart heart-d-full';
				}
				else
				{
					if(thisLoopHp > hp)
					{
						diffHp = thisLoopHp - hp;
						if(diffHp <= 3) heartTclass = 'heart heart-t-3-4';
						else if(diffHp <= 6) heartTclass = 'heart heart-t-2-4';
						else heartTclass = 'heart heart-t-1-4';
					}
					else heartTclass = 'heart heart-t-full';
					
					if(thisLoopHp > remainingHp)
					{
						diffHp = thisLoopHp - remainingHp;
						if(diffHp <= 3) heartDclass = 'heart heart-d-3-4';
						else if(diffHp <= 6) heartDclass = 'heart heart-d-2-4';
						else if(diffHp <= 9) heartDclass = 'heart heart-d-1-4';
						else heartDclass = '';//no health in this heart
					}
				}
				html += '<span style="float:'+align+'; position:relative;" class="heart-container '+heartTclass+'"><span style="float:'+align+';  position:absolute; top:0; '+align+':0px;" class="'+heartDclass+'"></span></span>';
			}
			html += '</div>';
			return html;
		},
	
	'GetMagicPoints' : function(character_index, align, is_message_box_display) {
			var character_stats = GameController.characters[character_index].character_stats;
			//magic points
			var container_width_a = 0;
			var container_width_d = 0;
			var html = '';
			html += '<div class="character-display-info" style="float:left;">';
			if(character_stats.asp > 0)
			{
				html += is_message_box_display?'<br/>':'';
				//4 = left + right borders, 2 ea.
				//Math.floor(character_stats.asp/100) * 12 - little chunks each 10px wide, has 2px margin right
				container_width_a = 4 + (Math.floor(character_stats.asp/50) * 10) + (character_stats.asp%50) * 2;
				var num_little_chuncks_a = Math.floor((character_stats.asp-character_stats.asp_used-1)/50);
				//set minimum width to allow big bar to be full after first little chunk used up
				var min_width_a = num_little_chuncks_a>0 ? (4 + ((num_little_chuncks_a) * 10) + 100) : 0;
				container_width_a = min_width_a > container_width_a ? min_width_a : container_width_a;
				var big_inner_width_a = (character_stats.asp-character_stats.asp_used-1)%50 * 2 + 2;
				if(is_message_box_display) html += '<div style="float:left;">Arcane Spell Points: '+(character_stats.asp-character_stats.asp_used)+'/'+character_stats.asp+'</div><br/>';
				html += '<div class="character-display-bar-container" title="Arcane Spell Points: '+(character_stats.asp-character_stats.asp_used)+'/'+character_stats.asp+'" style="float:'+align+'; width:'+container_width_a+'px; background-color:#099;">';
				for(var i=0; i<num_little_chuncks_a; i++) html += '<div class="character-display-bar-inner" style="float:'+align+'; width:8px; margin-'+align+':2px; background-color:#9fd;"></div>';
				html += '<div class="character-display-bar-inner" style="float:'+align+'; '+align+':2px; width:'+big_inner_width_a+'px; background-color:#1fd;"></div></div>';
			}
			
			if(character_stats.dsp > 0)
			{
				html += is_message_box_display?'<br/>':'';
				html += is_message_box_display&&character_stats.asp > 0?'<br/>':'';
				//				_d  ... D! not b B
				container_width_d = 4 + (Math.floor(character_stats.dsp/50) * 10) + (character_stats.dsp%50) * 2;
				var num_little_chuncks_d = Math.floor((character_stats.dsp-character_stats.dsp_used-1)/50);
				//set minimum width to allow big bar to be full after first little chunk used up
				var min_width_d = num_little_chuncks_d>0 ? (4 + ((num_little_chuncks_d) * 10) + 100) : 0;
				container_width_d = min_width_d > container_width_d ? min_width_d : container_width_d;
				//place_br?
				var place_br = (container_width_a + container_width_d) > 193 ? 1 : 0;
				var big_inner_width_d = (character_stats.dsp-character_stats.dsp_used-1)%50 * 2 + 2;
				if(place_br) html += '<br/>';
				if(is_message_box_display) html += '<div style="float:left;">Divine Spell Points: '+(character_stats.dsp-character_stats.dsp_used)+'/'+character_stats.dsp+'</div><br/>';
				html += '<div class="character-display-bar-container" title="Divine Spell Points: '+(character_stats.dsp-character_stats.dsp_used)+'/'+character_stats.dsp+'" style="'+(container_width_a>0 && !place_br && !is_message_box_display ? 'margin-'+align+':2px; ' : '')+'float:'+align+'; width:'+container_width_d+'px; background-color:#04f;">';
				for(var i=0; i<num_little_chuncks_d; i++) html += '<div class="character-display-bar-inner" style="float:'+align+'; width:8px; margin-'+align+':2px; background-color:#9df;"></div>';
				html += '<div class="character-display-bar-inner" style="float:'+align+'; '+align+':2px; width:'+big_inner_width_d+'px; background-color:#1bf;"></div></div>';
			}
			html += '</div>';
			html += '<br/>';
			return html;
		},
		
	'GetEffects' : function(character_index, align, is_message_box_display) {
			//onsole.log('character_stats.effects',character_stats.effects);
			var character_stats = GameController.characters[character_index].character_stats;
			var effect_list = [];
			var img_src = '';
			var display = '';
			var html = '<div class="character-display-bar-status" style="text-align:'+align+';">';
			if(is_message_box_display) html += '<br/>';
			//onsole.log('GetCharacterDisplay effects',character_stats.effects);
			for(var i in character_stats.effects)
			{
				display = '';
				//if effect has conditions, show conditions instead of effect info
				if(character_stats.effects[i].effect.EffectConditionID != 0)
				{
					//for each condition this effect is applying on the character
					for(var j in character_stats.effects[i].effect.EffectCondition)
					{
						var condition_name = character_stats.effects[i].effect.EffectCondition[j].ConditionName;
						img_src = character_stats.effects[i].effect.EffectIconName;
						if(typeof effect_list[condition_name] == 'undefined' || effect_list[condition_name].img_src != img_src)
						{
							var rounds_left = character_stats.effects[i].RoundsLeft;
							var total_duration = character_stats.effects[i].TotalDuration;
							if(is_message_box_display) display += '<div style="clear:both;">';
							display += '<img '+(is_message_box_display?'style="float:left;':'')+' title="'+condition_name+', duration: '+rounds_left+'/'+total_duration+'" src="./images/'+img_src+'"/>';
							if(is_message_box_display) display += '<span style="position:relative; top:10px; float:left;">'+condition_name+'<br/>duration: '+rounds_left+'/'+total_duration+'</span></div>';
							effect_list[condition_name] = {};
							effect_list[condition_name].img_src = img_src;
							effect_list[condition_name].display = display;
						}
					}
				}
				else
				{
					var effect_name = EffectController.CleanName(character_stats.effects[i].EffectName);
					var rounds_left = character_stats.effects[i].RoundsLeft;
					var total_duration = character_stats.effects[i].TotalDuration;
					if(is_message_box_display) display += '<div style="clear:both;" onclick="EffectController.RemoveEffect('+character_index+', '+i+', 1);">';
					display += '<img '+(is_message_box_display?'style="float:left;':'')+' title="'+effect_name+', duration: '+rounds_left+'/'+total_duration+'" src="./images/'+character_stats.effects[i].effect.EffectIconName+'"/>';
					if(is_message_box_display) display += '<span style="position:relative; top:10px; float:left;">'+effect_name+'<br/>duration: '+rounds_left+'/'+total_duration+'</span></div>';
					effect_list[effect_name] = display;
					effect_list[effect_name] = {};
					effect_list[effect_name].img_src = img_src;
					effect_list[effect_name].display = display;
				}
			}
			for(effect in effect_list) html += effect_list[effect].display;
			if(effect_list.length > 0) html += '<p>(Click effect to cancel it)</p>';
			html += '</div>';
			return html;
		}
}

CharacterController.GetPartySize = function()
{
	var partySize = 0;
	for(var i=0; i<GameController.characters.length; i++)
	{
		if(CharacterController.IsPartyMember(GameController.characters[i]))
		{
			partySize++;
		}
	}
	return partySize;
}

CharacterController.SetHighlightAll = function(highlight)
{
	for(var i=0; i<GameController.characters.length; i++)
	{
		GameController.characters[i].highlight = highlight;
	}
}

CharacterController.HighlightInAoe = function(effects)
{
	//will set entire effect targets using TargetTypeID's from effect subcategories
	var target_type_id = 0;//0=any target, 1=allies, 2=enemies
	target_type_id = EffectController.GetEffectsTargetsID(effects); //default 0
	
	var target_character_index_array = [];
	for(var i=0; i<GameController.characters.length; i++)
	{
		GameController.characters[i].highlight = 0;
		//if character is in the encounter
		if(GameController.in_encounter && GameController.characters[i].in_encounter)
		{
			//if in AOE
			if(BattleController.battle_grid[GameController.characters[i].sprite_coords[0]][GameController.characters[i].sprite_coords[1]] != 0)
			{
				if(target_type_id == 0 || (target_type_id == 1 && GameController.characters[i].character_stats.GoodGuy) || (target_type_id == 2 && !GameController.characters[i].character_stats.GoodGuy))
				{
					GameController.characters[i].highlight = 1;
					target_character_index_array.push(i);
				}
			}
		}
		else if(!GameController.in_encounter)
		{
			if((CharacterController.IsPartyMember(GameController.characters[i]) || GameController.characters[i].character_stats.area_id == GameController.area_id) && GameController.vision_fog_layer[GameController.characters[i].y][GameController.characters[i].x] != 0 &&  GameController.select_layer[GameController.characters[i].y][GameController.characters[i].x] != 0)
			{
				//select character based on target type
				if(target_type_id == 0 || (target_type_id == 1 && GameController.characters[i].character_stats.GoodGuy) || (target_type_id == 2 && !GameController.characters[i].character_stats.GoodGuy))
				{
					GameController.characters[i].highlight = 1;
					target_character_index_array.push(i);
				}
			}
		}
	}
	return target_character_index_array;
}

CharacterController.SpriteCoordsTaken = function(sprite_coords)//[x,y]
{
	//check each character to see if position is taken
	for(var i=0; i<GameController.characters.length; i++)
	{
		if(GameController.characters[i].in_encounter)//in the encounter and alive
		{
			if(GameController.characters[i].sprite_coords[0] == sprite_coords[0] && GameController.characters[i].sprite_coords[1] == sprite_coords[1])
			{
				return true;
			}
		}
	}
	return false;
}

//******
CharacterController.SpritePxX = function(character, isGetCenterTile, flipX)
{
	if(arguments.length < 2) isGetCenter = false;
	if(arguments.length < 3) flipX = false;
	if(flipX == -1) flipX = true;
	var t = GameController.in_encounter ? BattleController.tile_size() : GameController.tile_size();
	var x;
	var this_sprite_scale = CharacterController.GetSpriteScale(character);
	var character_sprite = CharacterController.GetSprite(character);
	
	if(GameController.in_encounter)
	{
		if(isGetCenterTile)
		{
			//not using this_sprite_scale for center of tile
			var centerOffesetX = t/2;	
			//adding sprite_offset[0] for battle map sprite shaking animation
			x = Math.round(character.sprite_coords[0]*t + centerOffesetX);
			var offset = character.sprite_offset[0] * (this_sprite_scale>0?1:-1);
			x = x+offset;
		}
		else
		{
			var centerOffesetX = Math.round((t - (character_sprite.naturalWidth * this_sprite_scale)) / 2);	
			//adding sprite_offset[0] for battle map sprite shaking animation
			x = Math.floor((character.sprite_coords[0]*t) * 1/this_sprite_scale + centerOffesetX);
			var offset = character.sprite_offset[0] * (this_sprite_scale>0?1:-1);
			x = x+offset;
		}
	}
	else
	{
		if(isGetCenterTile)
		{
			var centerOffesetX = GameController.tileset_tile_size/2;
			x = Math.round(((character.x - GameController.display_start_x()) * GameController.tileset_tile_size  + centerOffesetX) * (1/GameController.scale_sprite));
		}
		else
		{
			//altering by sprite scale value, cannot have map_scale included here
			var centerOffesetX = Math.round((GameController.tileset_tile_size - character_sprite.naturalWidth * this_sprite_scale * GameController.scale_sprite)/2*(1/this_sprite_scale/GameController.scale_sprite));
			if(flipX) centerOffesetX = centerOffesetX*-1 + GameController.tileset_tile_size*(1/this_sprite_scale/GameController.scale_sprite);
			//altering by map scale value, adding centerOffesetX
			x = Math.round((character.x - GameController.display_start_x()) * GameController.tileset_tile_size * (1/this_sprite_scale/GameController.scale_sprite) + centerOffesetX);
		}
	}
	return x;
}

CharacterController.SpritePxY = function(character, isGetCenterTile)
{
	if(arguments.length < 2) isGetCenterTile = false;
	var t = GameController.in_encounter ? BattleController.tile_size() : GameController.tile_size();
	var y;
	var this_sprite_scale = CharacterController.GetSpriteScale(character);
	var character_sprite = CharacterController.GetSprite(character);
	
	if(GameController.in_encounter)
	{
		if(isGetCenterTile)
		{
			var centerOffesetY = t/2;
			//adding sprite_offset[1] for battle map sprite shaking animation
			y = 20 +  Math.round(character.sprite_coords[1]*t + character.sprite_offset[1] + centerOffesetY);
		}
		else
		{
			var centerOffesetY = Math.round(t - (character_sprite.naturalHeight * this_sprite_scale));
			//adding sprite_offset[1] for battle map sprite shaking animation
			y = 20 +  Math.round((character.sprite_coords[1]*t + character.sprite_offset[1] + centerOffesetY) * 1/this_sprite_scale);
		}
	}
	else
	{
		if(isGetCenterTile)
		{
			var centerOffesetY = GameController.tileset_tile_size/2 - GameController.tileset_tile_size/5;
			//adding sprite_offset[1] for battle map sprite shaking animation
			y = Math.round(((character.y - GameController.display_start_y()) * GameController.tileset_tile_size + centerOffesetY) * (1/GameController.scale_sprite));
		}
		else
		{
			//altering by sprite scale value, cannot have map_scale included here
			var centerOffesetY = Math.round((GameController.tileset_tile_size * 4/5 - character_sprite.naturalHeight * this_sprite_scale * GameController.scale_sprite)*(1/this_sprite_scale/GameController.scale_sprite));
			//altering by map scale value, adding centerOffesetY
			y = Math.round((character.y - GameController.display_start_y()) * GameController.tileset_tile_size * (1/this_sprite_scale/GameController.scale_sprite) + centerOffesetY);
		}
	}
	return y;
}
//******
	
CharacterController.GetSprite = function(character)
{
	return (character.character_stats.poly_character_stats == 0 ? character.character_sprite : character.poly_sprite);
}

CharacterController.GetSpriteScale = function(character)
{
	return (character.character_stats.poly_character_stats == 0 ? character.character_stats.sprite_scale : character.character_stats.poly_character_stats.sprite_scale);
}
	
CharacterController.GetSpriteSheet = function(character)
{
	return (character.character_stats.poly_character_stats == 0 ? character.character_stats.anim_sprites_index : character.character_stats.poly_character_stats.anim_sprites_index);
}

CharacterController.SpritePxXnew = function(character, isGetCenterTile, this_scale)
{
	if(arguments.length < 3) this_scale = 1;
	if(arguments.length < 2) isGetCenter = false;
	
	var t = GameController.in_encounter ? BattleController.tile_size() : GameController.tile_size();
	var x;
	var character_sprite = CharacterController.GetSprite(character);
	
	if(GameController.in_encounter)
	{
		if(isGetCenterTile)
		{
			//not using this_scale for center of tile
			var centerOffesetX = t/2/this_scale;	
		}
		else
		{
			var centerOffesetX = Math.round((t/this_scale - character_sprite.naturalWidth) / 2);
		}
		//adding sprite_offset[0] for battle map sprite shaking animation
		x = character.sprite_coords[0]*t / this_scale + centerOffesetX;
		var offset = character.sprite_offset[0] / this_scale * (CharacterController.IsPartyMember(character)?1:-1);//***********************************
		x = Math.floor(x+offset);
	}
	else
	{
		if(isGetCenterTile)
		{
			var centerOffesetX = GameController.tileset_tile_size/2;
			x = Math.floor(((character.x - GameController.display_start_x()) * GameController.tileset_tile_size  + centerOffesetX) * (1/GameController.scale_sprite));
		}
		else
		{
			//altering by sprite scale value, cannot have map_scale included here
			var centerOffesetX = Math.round((GameController.tileset_tile_size - character_sprite.naturalWidth * this_scale * GameController.scale_sprite)/2*(1/this_scale/GameController.scale_sprite));
			//altering by map scale value, adding centerOffesetX
			x = Math.floor((character.x - GameController.display_start_x()) * GameController.tileset_tile_size * (1/this_scale/GameController.scale_sprite) + centerOffesetX);
		}
	}
	return x;
}

CharacterController.SpritePxYnew = function(character, isGetCenterTile, this_scale)
{
	if(arguments.length < 3) this_scale = 1;
	if(arguments.length < 2) isGetCenterTile = false;
	this_scale = Math.abs(this_scale);
	
	var t = GameController.in_encounter ? BattleController.tile_size() : GameController.tile_size();
	var y;
	var character_sprite = CharacterController.GetSprite(character);
	
	if(GameController.in_encounter)
	{
		if(isGetCenterTile)
		{
			var centerOffesetY = t/2/this_scale;
		}
		else
		{
			var centerOffesetY = Math.floor(t/this_scale - character_sprite.naturalHeight);
		}
		//adding sprite_offset[1] for battle map sprite shaking animation
		y = Math.floor(((20 + character.sprite_coords[1]*t) + character.sprite_offset[1]) / this_scale + centerOffesetY);
	}
	else
	{
		if(isGetCenterTile)
		{
			var centerOffesetY = GameController.tileset_tile_size/2 - GameController.tileset_tile_size/5;
			//adding sprite_offset[1] for battle map sprite shaking animation
			y = Math.floor(((character.y - GameController.display_start_y()) * GameController.tileset_tile_size + centerOffesetY) * (1/GameController.scale_sprite));
		}
		else
		{
			//altering by sprite scale value, cannot have map_scale included here
			var centerOffesetY = (GameController.tileset_tile_size * 4/5 - character_sprite.naturalHeight * this_scale * GameController.scale_sprite)*(1/this_scale/GameController.scale_sprite);
			//altering by map scale value, adding centerOffesetY
			y = Math.floor((character.y - GameController.display_start_y()) * GameController.tileset_tile_size * (1/this_scale/GameController.scale_sprite) + centerOffesetY);
		}
	}
	return y;
}

CharacterController.SpriteGridX = function(character)
{
	var x;
	if(GameController.in_encounter)
	{
		x = character.sprite_coords[0];
	}
	else
	{
		x = character.x;
	}
	return x;
}

CharacterController.SpriteGridY = function(character)
{
	var y;
	if(GameController.in_encounter)
	{
		y = character.sprite_coords[1];
	}
	else
	{
		y = character.y;
	}
	return y;
}

CharacterController.HpChange = function(action_return_data_alter_hp_damage, target_character_index, duration)
{
	//update hp right away, no delay
	GameController.characters[target_character_index].character_stats.hp_damage += action_return_data_alter_hp_damage;
	
	//if character dead add a skeleton, dont do in timeout or wont get drawn
	if(GameController.characters[target_character_index].character_stats.hp_damage >= GameController.characters[target_character_index].character_stats.hp)
	{
		//add skeleton object to object layer in monsters position
		if(GameController.object_layer[GameController.characters[target_character_index].y][GameController.characters[target_character_index].x] == 0)
		{
			GameController.object_layer[GameController.characters[target_character_index].y][GameController.characters[target_character_index].x] = [];
		}
		GameController.object_layer[GameController.characters[target_character_index].y][GameController.characters[target_character_index].x].push({'layer': 0, 'tileset_index': 25, 'tileset_pos': [0, 10]});
	}
	//visual and sound effects
	setTimeout(function(character_index)
	{
		var character = GameController.characters[character_index];
		if(!GameController.in_encounter)
		{
			var scale = GameController.in_encounter ? 1 : GameController.map_scale*GameController.scale_sprite;
			BattleController.battle_info_context.save();
			//only flip x axis when scale is negative
			BattleController.battle_info_context.scale(scale, Math.abs(scale));
		}
		//if character dead
		if(character.character_stats.hp_damage >= character.character_stats.hp)
		{
			//play a noise
			if(!GameController.sound_mute) GameController.sound.death.play();
			//remove all effects
			EffectController.RemoveAllEffects(character_index);
		}
		//display damage above target
		BattleController.battle_info_context.fillStyle = action_return_data_alter_hp_damage > 0 ? 'red': 'green';
		BattleController.battle_info_context.font = GameController.in_encounter ? "bold 22px beebregular" : "bold 18px beebregular";
		BattleController.battle_info_context.lineWidth = 4;
		BattleController.battle_info_context.strokeStyle = 'black';
		BattleController.battle_info_context.textAlign = 'center';
		BattleController.battle_info_context.strokeText(Math.abs(action_return_data_alter_hp_damage), 
			CharacterController.SpritePxX(character, true), 
			CharacterController.SpritePxY(character, true) - 50);
		BattleController.battle_info_context.fillText(Math.abs(action_return_data_alter_hp_damage), 
			CharacterController.SpritePxX(character, true), 
			CharacterController.SpritePxY(character, true) - 50);
		if(!GameController.in_encounter)
		{
			BattleController.battle_info_context.restore();
		}
	}, duration, target_character_index);
	
	//remove after 1.2 seconds
	BattleController.battle_info_clear_timeout = setTimeout(function(SpritePxCoords)
		{
			if(!GameController.in_encounter)
			{
				var scale = GameController.map_scale*GameController.scale_sprite;
				BattleController.battle_info_context.save();
				BattleController.battle_info_context.scale(scale, scale);
			}
			
			BattleController.battle_info_context.clearRect(
				SpritePxCoords[0] - 30, 
				SpritePxCoords[1] - 100,
				SpritePxCoords[0] + 80,
				SpritePxCoords[1] + 0);
			
			//BattleController.battle_info_context.clearRect(0,0,BattleController.battle_info_canvas.width,BattleController.battle_info_canvas.height);
			if(!GameController.in_encounter)
			{
				BattleController.battle_info_context.restore();
			}
		}, 
		duration+1200, 
		//give coords of sprite to clear, will be set to -1,-1 if character dies so include in timeout call
		[CharacterController.SpritePxX(GameController.characters[target_character_index], true), CharacterController.SpritePxY(GameController.characters[target_character_index], true)]
	);
}

CharacterController.MpChange = function(sp_cost, magic_type, target_character_index, duration)
{
	//check if has enough spell points
	//update sp
	if(magic_type == 'arcane')
	{
		if(GameController.characters[target_character_index].character_stats.asp - (GameController.characters[target_character_index].character_stats.asp_used + sp_cost) < 0) return false;
		GameController.characters[target_character_index].character_stats.asp_used += sp_cost;
		//check armor spell fail chance
		
	}
	else
	{
		if(GameController.characters[target_character_index].character_stats.dsp - (GameController.characters[target_character_index].character_stats.dsp_used + sp_cost) < 0) return false;
		GameController.characters[target_character_index].character_stats.dsp_used += sp_cost;
	}
	
	//visual effect
	setTimeout(function(character_index)
	{
		var character = GameController.characters[character_index];
		if(!GameController.in_encounter)
		{
			var scale = GameController.in_encounter ? 1 : GameController.map_scale*GameController.scale_sprite;
			BattleController.battle_info_context.save();
			//only flip x axis when scale is negative
			BattleController.battle_info_context.scale(scale, Math.abs(scale));
		}
		//display sp used above target
		BattleController.battle_info_context.fillStyle = 'blue';
		BattleController.battle_info_context.font = GameController.in_encounter ? "bold 22px beebregular" : "bold 18px beebregular";
		BattleController.battle_info_context.lineWidth = 4;
		BattleController.battle_info_context.strokeStyle = 'black';
		BattleController.battle_info_context.textAlign = 'center';
		BattleController.battle_info_context.strokeText('-'+sp_cost, 
			CharacterController.SpritePxX(character, true), 
			CharacterController.SpritePxY(character, true) - 50);
		BattleController.battle_info_context.fillText('-'+sp_cost, 
			CharacterController.SpritePxX(character, true), 
			CharacterController.SpritePxY(character, true) - 50);
		if(!GameController.in_encounter)
		{
			BattleController.battle_info_context.restore();
		}
	}, duration, target_character_index);
	
	//remove after 1.2 seconds
	BattleController.battle_info_clear_timeout = setTimeout(function(SpritePxCoords)
		{
			if(!GameController.in_encounter)
			{
				var scale = GameController.map_scale*GameController.scale_sprite;
				BattleController.battle_info_context.save();
				BattleController.battle_info_context.scale(scale, scale);
			}
			
			BattleController.battle_info_context.clearRect(
				SpritePxCoords[0] - 30, 
				SpritePxCoords[1] - 100,
				SpritePxCoords[0] + 80,
				SpritePxCoords[1] + 0);
			
			//BattleController.battle_info_context.clearRect(0,0,BattleController.battle_info_canvas.width,BattleController.battle_info_canvas.height);
			if(!GameController.in_encounter)
			{
				BattleController.battle_info_context.restore();
			}
		}, 
		duration+1200, 
		//give cooords of sprite to clear, will be set to -1,-1 if character dies so include in timeout call
		[CharacterController.SpritePxX(GameController.characters[target_character_index], true), CharacterController.SpritePxY(GameController.characters[target_character_index], true)]
	);
	return true;
}

CharacterController.ShowCharacterDisplay = function(character_index)
{
	if(arguments.length < 1) character_index = BattleController.current_character_stats_index;
	
	var showGoodGuyID = -1;
	var showBadGuytID = -1;
	
	//always show good guy on left and bad guy on right
	if(GameController.characters[character_index].character_stats.GoodGuy) showGoodGuyID = character_index;
	else  showBadGuytID = character_index;
	
	if(BattleController.highlight_character_selected_index != -1 && GameController.characters[BattleController.highlight_character_selected_index].character_stats.GoodGuy) showGoodGuyID = BattleController.highlight_character_selected_index;
	else  showBadGuytID = BattleController.highlight_character_selected_index;
	
	//show active character info in #show-character-a
	if(showGoodGuyID != -1)
	{
		$('#show-character-a').html(CharacterController.GetCharacterDisplay(showGoodGuyID, 'left'));
		$('#show-character-a').attr('onclick','CharacterController.ShowCharacterStatusBox('+showGoodGuyID+')');
	}
	
	//show target in #show-character
	if(showBadGuytID != -1 && BattleController.highlight_character_selected_index != character_index)
	{
		$('#show-character-b').html(CharacterController.GetCharacterDisplay(showBadGuytID, 'right'));
		$('#show-character-b').attr('onclick','CharacterController.ShowCharacterStatusBox('+showBadGuytID+')');
	}
	else
	{
		$('#show-character-b').html('');
		$('#show-character-b').attr('onclick','');
	}
}

CharacterController.ShowCharacterStatusBox = function(character_index)
{
	var align = 'left';
	var is_message_box_display = true;
	var html = '<div id="show-characters" style="text-align:left;" onclick="MenuController.MenuClose();">';
	html += '<table><tr><td>';
	html += CharacterController.GetDisplay.GetThumb(character_index, align, is_message_box_display);
	html += '<br/><br/></td><td>';
	html += CharacterController.GetDisplay.GetName(character_index, align, is_message_box_display);
	html += '</td></tr>';
	html += '<tr><td colspan="2" style="padding-left:20px;">';
	html += CharacterController.GetDisplay.GetHearts(character_index, align, is_message_box_display);
	html += '</td></tr><tr><td colspan="2" style="padding-left:20px;">';
	html += CharacterController.GetDisplay.GetMagicPoints(character_index, align, is_message_box_display);
	html += '</td></tr><tr><td colspan="2" style="padding-left:20px;">';
	html += CharacterController.GetDisplay.GetEffects(character_index, align, is_message_box_display);
	html += '</td></tr></table></div>';
	
	html += '<div style="clear:both;"></div>';
	html += '<div style="margin-top:15px;" id=""><span id="selected-button" class="button selected" onclick="MenuController.MenuClose();">Close</span></div>';
	
	MenuController.DisplayMessage(html);
}

CharacterController.GetCharacterDisplay = function(character_index, align)
{
	var is_message_box_display = false;
	var html = '';
	html = '<div style="margin-top:6px; width:100%; float:'+align+';">';
	html += CharacterController.GetDisplay.GetThumb(character_index, align, is_message_box_display);
	html += CharacterController.GetDisplay.GetName(character_index, align, is_message_box_display);
	html += CharacterController.GetDisplay.GetHearts(character_index, align, is_message_box_display);
	html += '<br/>';
	html += CharacterController.GetDisplay.GetMagicPoints(character_index, align, is_message_box_display);
	html += CharacterController.GetDisplay.GetEffects(character_index, align, is_message_box_display);
	html += '</div>';
	return html;
}