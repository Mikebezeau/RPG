
var EquipmentController = EquipmentController || {};

//for each player, has a list of what items are held by what characters in their world
EquipmentController.SavePCWorldItems = function()
{
	//onsole.log('SavePCWorldItems',GameController.pc_world_itmes);
	console.log('saving world items');
	//save all differing item owners and locations for this PC
	$.ajax({
		type: 'POST',
		async: true,
		url: './php/character_save/character_save_items.php',
		data: {'save_world_items':1, 'player_character_id':GameController.player.character_id, 'items': JSON.stringify(GameController.pc_world_itmes)}
	})
		.done(function(data) {
				//data = $.parseJSON(data);
				//onsole.log();
			});
}


EquipmentController.EquipSlots = 
{
	'Head': {'top':100, 'left':66, 'defaultIcon': 'battle_icons/armor/C_Elm01.png'},
	'Face': {'top':100, 'left':291, 'defaultIcon': 'battle_icons/special/mask1.png'},
	'Throat': {'top':166, 'left':49, 'defaultIcon': 'battle_icons/special/Ac_Necklace01.png'},
	'Shoulders': {'top':166, 'left':307, 'defaultIcon': 'battle_icons/special/shoulder1.png'},
	'Body': {'top':226, 'left':49, 'defaultIcon': 'battle_icons/special/cape1.png'},
	'Torso': {'top':226, 'left':307, 'defaultIcon': 'battle_icons/armor/A_Clothing02.png'},
	'Arms': {'top':286, 'left':49, 'defaultIcon': 'battle_icons/special/bracer1.png'},
	'Hands': {'top':286, 'left':307, 'defaultIcon': 'battle_icons/armor/Ac_Gloves01.png'},
	'R-Ring': {'top':351, 'left':66, 'defaultIcon': 'battle_icons/ring.png'},
	'L-Ring': {'top':351, 'left':290, 'defaultIcon': 'battle_icons/ring.png'},
	'Waist': {'top':412, 'left':66, 'defaultIcon': 'battle_icons/special/belt1.png'},
	'Feet': {'top':412, 'left':290, 'defaultIcon': 'battle_icons/armor/A_Shoes01.png'},
	'Main-Hand': {'top':320, 'left':140, 'defaultIcon': 'battle_icons/blank_border.png'},
	'Off-Hand': {'top':350, 'left':220, 'defaultIcon': 'battle_icons/blank_border.png'},
	'Armor': {'top':260, 'left':180, 'defaultIcon': 'battle_icons/blank_border.png'}//,
	//'Save': {'top':434, 'left':164, 'defaultIcon': 'battle_icons/blank_border.png'}
}

//icon images
EquipmentController.GetEquipmentIcon = function(type, equip)
{
	//onsole.log('equip.Icon',equip.Icon);
	//get set icon
	if(equip.Icon)
	{
		return 'battle_icons/'+equip.Icon;
	}
	
	//get default icon
	if(equip.arr_weapon_id > 0)
	{
		equip.WeaponID = equip.arr_weapon_id;
	}
	
	if(equip.weapon_class_id > 0)
	{
		equip.WeaponClassID = equip.weapon_class_id;
	}
	
	if(equip.weapon_type_id > 0)
	{
		equip.WeaponTypeID = equip.weapon_type_id;
	}
	var icon = '';
	
	if(type == 'weapon')
	{
		var icon;
		switch(parseInt(equip.WeaponTypeID))
		{
			case 0://unarmed attack
				icon = 'weapon/W_Fist001';
				break;
			case 1://light melee
				icon = 'melee';
				break;
			case 2://one handed melee
				icon = 'melee';
				break;
			case 3://two handed melee
				icon = 'melee';
				break;
			case 4://ranged weapon
				icon = 'ranged';
				break;
			case 5://ammunition
				icon = 'ranged';
				break;
			default:
				icon = 'melee';
				break;
		}
		
		switch(parseInt(equip.WeaponClassID))
		{
			case 0://axes
				icon = 'weapon/W_Axe002';
				if(parseInt(equip.WeaponTypeID) == 3) icon = 'weapon/two_handed_axe';
				break;
			case 1://heavy blade
				icon = 'weapon/two_handed_sword';
				break;
			case 2://light blade
				icon = 'weapon/scimitar';
				break;
			case 3://bow
				icon = 'ranged';
				break;
			case 4://close
				icon = 'weapon/W_Fist003';
				break;
			case 5://crossbow
				icon = 'weapon/crossbow_light';
				if(parseInt(equip.WeaponID) == 18) icon = 'weapon/crossbow_heavy';
				break;
			case 6://double
				icon = 'weapon/spear';
				break;
			case 7://flail
				icon = 'weapon/flail';
				break;
			case 8://hammer
				icon = 'weapon/W_Mace003';
				break;
			case 9://monk
				icon = 'weapon/W_Fist001';
				if(parseInt(equip.WeaponID) == 0) icon = 'weapon/staff';
				break;
			case 10://pole arm
				icon = 'weapon/spear';
				break;
			case 11://spear
				icon = 'weapon/spear';
				break;
			case 12://thrown
				icon = 'weapon/star';
				break;
			case 13://gun
				icon = 'weapon/gun';
				break;
			case 14://primary natural
				icon = 'weapon/unarmed';
				break;
			case 15://natural
				icon = 'weapon/unarmed';
				if(parseInt(equip.WeaponID) == 11) icon = 'weapon/W_Fist001';//human fist
				break;
				
			default:
				break;
		}
		icon = 'battle_icons/'+icon+'.png';
		
		return icon;
	}
	
	else if(type == 'armor')
	{
		var icon;
		if(equip.Shield)
		{
			icon = 'shield/E_Metal04';
			
			if(equip.ArmorType == 'M')
			{
				if(equip.Material == 'metal')
				{
					icon = 'shield/E_Metal04';
				}
				if(equip.Material == 'wood')
				{
					icon = 'shield/E_Wood03';
				}
			}
			else if(equip.ArmorType == 'L')
			{
				if(equip.Material == 'metal')
				{
					icon = 'shield/E_Metal02';
				}
				if(equip.Material == 'wood')
				{
					icon = 'shield/E_Wood01';
				}
			}
		}
		else
		{
			switch(equip.ArmorType)
			{
				case 'H'://heavy
					icon = 'torso/full_plate.png';
					break;
				
				case 'M'://medium
					icon = 'torso/icon_13.png';
					break;
					
				case 'L'://light
					icon = 'torso/icon_185.png';
					break;
			}
		}
		icon = 'battle_icons/'+icon;
		
		return icon;
	}
	
	else if(type == 'equipment')
	{
		var icon;
		//onsole.log(EquipmentController.EquipSlots);
		//onsole.log(equip);
		if(equip.Slot == 'None')
		{
			switch(equip.Name)
			{
				case 'Torch':
					icon = 'battle_icons/weapon/W_Mace001.png';
					break;
				
				default:
					icon = 'battle_icons/shovel.png';
					break;
				
			}
		}
		else
		{
			icon = EquipmentController.EquipSlots[equip.Slot].defaultIcon;
		}
		return icon;
	}
	
}

