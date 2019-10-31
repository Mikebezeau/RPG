<?php
	// database connect function
	include_once("../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	$data = array();
	$data['queries'] = array();
	
	if(isset($_POST['save_equipment']))
	{
		$character_id = $_POST['character_id'];
		
		$query = "DELETE FROM CharacterArmor WHERE CharacterID=".$character_id;
		$result = mysqli_query($link,$query);
		for($i=0; $i<count($_POST['ArmorArr']); $i++)
		{
			$query = "INSERT INTO CharacterArmor (ArmorID, CharacterID, Enhance, MW, Equipped) 
				VALUES (".$_POST['ArmorArr'][$i]['ArmorID'].", ".$character_id.", FALSE, 0, ".$_POST['ArmorArr'][$i]['Equipped'].")";
			$result = mysqli_query($link,$query);
		}
		
		$query = "DELETE FROM CharacterWeapon WHERE CharacterID=".$character_id;
		$result = mysqli_query($link,$query);
		for($i=0; $i<count($_POST['WeaponArr']); $i++)
		{
			//if($i==0) print_r($_POST['WeaponArr'][0]);
			$query = "INSERT INTO CharacterWeapon (WeaponID, CharacterID, Enhance, MW, Equipped, TwoHand, UseDex, Flurry, CustomName, HitBonus, DamageBonus, CritRangeBonus, OffHand)
				VALUES (".$_POST['WeaponArr'][$i]['WeaponID'].", ".$character_id.", 0, FALSE, ".$_POST['WeaponArr'][$i]['Equipped'].", ".$_POST['WeaponArr'][$i]['TwoHand'].", FALSE, FALSE, '', 0, 0, 0, ".$_POST['WeaponArr'][$i]['OffHand'].")";
			$result = mysqli_query($link,$query);
		}
		
		$query = "DELETE FROM CharacterEquipment WHERE CharacterID=".$character_id;
		$result = mysqli_query($link,$query);
		for($i=0; $i<count($_POST['EquipArr']); $i++)
		{
			//if($i==0) print_r($_POST['EquipArr'][0]);
			if($_POST['EquipArr'][$i]['TriggerEventID'] == 0) $_POST['EquipArr'][$i]['TriggerEventID'] = 0;
			$query = "INSERT INTO CharacterEquipment (EquipID, CharacterID, Quantity, Equipped, TriggerEventID)
				VALUES (".$_POST['EquipArr'][$i]['EquipID'].", ".$character_id.", ".$_POST['EquipArr'][$i]['Quantity'].", ".$_POST['EquipArr'][$i]['Equipped'].", ".$_POST['EquipArr'][$i]['TriggerEventID'].")";
			$result = mysqli_query($link,$query);
		}
	}
	
	else if(isset($_POST['save_world_items']))
	{
		$player_character_id = $_POST['player_character_id'];
		$items =  json_decode($_POST['items'], true);
		
		//delete old list
		$query = "DELETE FROM PCWorldItemsHeld WHERE PlayerCharacterID = ".$player_character_id;
		$result = mysqli_query($link,$query);
		
		for($i=0; $i<count($items); $i++)
		{
			$item = $items[$i];
			
			$PCWorldItemsHeldID = $item['PCWorldItemsHeldID'];
			
			$FromCharacterID = $item['FromCharacterID'];
			$FromEventID = $item['FromEventID'];
			$TriggerEventID = $item['TriggerEventID'];
			$HeldByCharacterID = $item['HeldByCharacterID'];
			$ItemID = $item['ItemID'];
			$ItemType = $item['ItemType'];
			$DropXpos = $item['DropXpos'];
			$DropYpos = $item['DropYpos'];
			$DropAreaID = $item['DropAreaID'];
			
			$query = "INSERT INTO PCWorldItemsHeld (PlayerCharacterID, FromCharacterID, FromEventID, TriggerEventID, HeldByCharacterID, ItemID, ItemType, DropXpos, DropYpos, DropAreaID) VALUES(".$player_character_id.", ".$FromCharacterID.", ".$FromEventID.", ".$TriggerEventID.", ".$HeldByCharacterID.", ".$ItemID.", '".$ItemType."', ".$DropXpos.", ".$DropYpos.", ".$DropAreaID.")";
			$result = mysqli_query($link,$query);
		}
	}
	
	mysqli_close($link);
		
?>