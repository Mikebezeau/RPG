<?php
	// database connect function
	include_once("../includes/inc_connect.php"); 
	
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	if($_POST['id'] == 1)//pc, looking up mastercharacter instead of quickstat
	{
		$query = 'SELECT CharacterID AS QuickstatID, CharacterName AS Name, ThumbPicID, SpriteID, FilePathName, DefaultSpriteScale FROM MasterCharacter INNER JOIN Sprites USING(SpriteID) WHERE CatagoryID = 1 ORDER BY Name';
		$result = mysqli_query($link,$query);
		
		$select_box = '<select id="pc-selection"><option value="-1" data-sprite-id="-1">Select</option>';
		
		while($row = mysqli_fetch_object($result))
		{
			//$select_box .= '<option value="'.$row->QuickstatID.'" data-sprite-id="'.$row->SpriteID.'" data-thumb-pic-id="'.$row->ThumbPicID.'">'.$row->Name.'</option>';
			$select_box .= '<option value="'.$row->QuickstatID.'" data-sprite-id="'.$row->SpriteID.'" data-sprite-file="'.$row->FilePathName.'" data-sprite-scale="'.$row->DefaultSpriteScale.'" data-thumb-pic-id="'.$row->ThumbPicID.'">'.$row->Name.'</option>';
		}
		
		$select_box .= '</select>';
	}
	
	else if($_POST['id'] == 2)//npc
	{
		$query = 'SELECT QuickstatID, Name, ThumbPicID, SpriteID, FilePathName, DefaultSpriteScale FROM QuickStats INNER JOIN Sprites USING(SpriteID) WHERE CatagoryID = 2 ORDER BY Name';
		$result = mysqli_query($link,$query);
		
		$select_box = '<select id="npc-selection"><option value="-1" data-sprite-id="-1">Select</option>';
		
		while($row = mysqli_fetch_object($result))
		{
			//$select_box .= '<option value="'.$row->QuickstatID.'" data-sprite-id="'.$row->SpriteID.'" data-thumb-pic-id="'.$row->ThumbPicID.'">'.$row->Name.'</option>';
			$select_box .= '<option value="'.$row->QuickstatID.'" data-sprite-id="'.$row->SpriteID.'" data-sprite-file="'.$row->FilePathName.'" data-sprite-scale="'.$row->DefaultSpriteScale.'" data-thumb-pic-id="'.$row->ThumbPicID.'">'.$row->Name.'</option>';
		}
		
		$select_box .= '</select>';
	}
	
	else//3 monster
	{
		$query = 'SELECT QuickstatID, Name, ThumbPicID, SpriteID, FilePathName, DefaultSpriteScale FROM QuickStats INNER JOIN Sprites USING(SpriteID) WHERE CatagoryID = 3 ORDER BY Name';
		$result = mysqli_query($link,$query);
		
		$select_box = '<select id="monster-selection"><option value="-1" data-sprite-id="-1">Select</option>';
		
		while($row = mysqli_fetch_object($result))
		{
			$select_box .= '<option value="'.$row->QuickstatID.'" data-sprite-id="'.$row->SpriteID.'" data-sprite-file="'.$row->FilePathName.'" data-sprite-scale="'.$row->DefaultSpriteScale.'" data-thumb-pic-id="'.$row->ThumbPicID.'">'.$row->Name.'</option>';
		}
		
		$select_box .= '</select>';
	}
	
	mysqli_close($link);
	
	echo($select_box);
?>