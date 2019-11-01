<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	//effect_query_funciton
	include_once("./character_ability_effect_query_funciton.php"); 
	
	$query = "SELECT * FROM Weapon";
	$arr_item_weapon = array();
	if($result = mysqli_query($link,$query))
	{
		while($row = mysqli_fetch_object($result))
		{
			$row->WeaponID = (int)$row->WeaponID;
			$row->ID = $row->WeaponID;
			$row->Name = $row->WeaponName;
			$row->Description = $row->Description;
			$row->Equipped = isset($row->Equipped)?(int)$row->Equipped:0;
			$row->TwoHand = (int)$row->TwoHand;
			$row->OffHand = isset($row->OffHand)?(int)$row->OffHand:0;
			
			//include all data for ActionController.SetCharacterActionData
			//for PCs, equipped weapons in 'character_stats.WeaponArr' are added directly to 'action_data.attack_action_data'
			$row->action = 'attack';
			$row->action_type = 'attack';
			$row->target = 1; //1 == select 1 target
			$row->data_index = -1;
			$row->party_stats_index = -1;
			$row->num_attacks = -1;
			$row->submit = 'm'; //first letter of submit name - s for single and m for multiple attack
			$row->attack_name = $row->WeaponName;
			$row->weapon_type_id = (int)$row->WeaponTypeID;
			$row->weapon_class_id = (int)$row->WeaponClassID;
			$row->arr_attack_bonus = 0;
			$row->attack_mod = 0;
			$row->num_dice = (int)$row->DamageDieNum;
			$row->die_type =(int)$row->DamageDieType;
			$row->damage_mod = 0;//DamgeMod
			$row->arr_range_base = (int)$row->RangeBase;
			$row->crit_range = (int)$row->CritRange;
			$row->crit_mult = (int)$row->CritMult;
			$row->two_hand = (int)$row->TwoHand;
			$row->equipped = 0;
			$row->off_hand = 0;
			
			//query for weapon effect
			$row->effects = EffectQuery($link, 'EffectsWeapons', 'ItemID', $row->ID);
			$arr_item_weapon[$row->WeaponID] = $row;
		}
	}
	
	$query = "SELECT * FROM Armor";
	$arr_item_armor = array();
	if($result = mysqli_query($link,$query))
	{
		while($row = mysqli_fetch_object($result))
		{
			$row->ArmorID = (int)$row->ArmorID;
			$row->ID = $row->ArmorID;
			$row->Name = $row->ArmorName;
			$row->Description = $row->Description;
			$row->Equipped = 0;//(int)$row->Equipped;//default is 0 for not equipped
			$row->Shield = (int)$row->Shield;
			//query for armor effect
			$row->effects = EffectQuery($link, 'EffectsArmor', 'ItemID', $row->ID);
			$arr_item_armor[$row->ArmorID] = $row;
		}
	}
	
	$query = "SELECT * FROM Equipment";
	$arr_item_equipment = array();
	if($result = mysqli_query($link,$query))
	{
		while($row = mysqli_fetch_object($result))
		{
			$row->EquipID = (int)$row->EquipID;
			$row->ID = $row->EquipID;
			$row->Name = $row->EquipName;
			$row->Description = $row->Description;
			$row->Icon = $row->Icon;
			$row->Equipped = 0;//(int)$row->Equipped;//default is 0 for not equipped
			$row->Quantity = 0;//(int)$row->Quantity;//default is 0
			$row->Magical = (int)$row->Magical;
			//query for equipment effect
			$row->effects = EffectQuery($link, 'EffectsEquipment', 'ItemID', $row->ID);
			$arr_item_equipment[$row->EquipID] = $row;
		}
	}
	
	mysqli_close($link);
	
	echo(json_encode(array('weapon_list' => $arr_item_weapon, 'armor_list' => $arr_item_armor, 'equipment_list' => $arr_item_equipment)));
?>