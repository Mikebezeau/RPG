<?php
$AreaID = $_POST['id'];
$post_data = json_decode($_POST['data'], false);
$player_character_id = $post_data->player_character_id;

// database connect function
include_once("../includes/inc_connect.php"); 
	//Connect to database using function from "inc_connect.php"
$link = dbConnect();
$query = "SELECT * FROM Areas WHERE AreaID = $AreaID";
$result = mysqli_query($link,$query);
$events = array();
$row = mysqli_fetch_assoc($result);
//get MapName (filename)
$MapName = $row['MapName'];
$SizeX = $row['SizeX'];
$SizeY = $row['SizeY'];

$AreaSettings = $row;

if(isset($_GET['tileset']))
{
	if(file_exists('../txt_data/map/map_'.$MapName.'.txt'))
	{
		$data = file_get_contents('../txt_data/map/map_'.$MapName.'_tileset.txt');
		echo $data;
	}
}
else
{
	if(file_exists('../txt_data/map/map_'.$MapName.'.txt'))
	{
		$data = file_get_contents('../txt_data/map/map_'.$MapName.'.txt');
		
		$data = json_decode($data);
		
		//$data[1] = events //get from database
		include_once('./event_load_json.php');
		$events = GetAllAreaEvents($link, $AreaID, $player_character_id);
		$data[1] = $events;
		
		//$data[4] = AreaID - already have
		//$data[5] = start position
		//$data[6] = size
		//$data[7] = description
	
		//$data[8] - add character data array $data[8][n] = [character_id, quick_stat_id, y, x]
		$data[8] = array();
		
		$query = "SELECT * FROM MasterCharacter WHERE (CatagoryID != 1 OR PlayerID = 99) AND CharacterID != 99 AND AreaID = $AreaID";
		$result = mysqli_query($link,$query);
		while($row = mysqli_fetch_object($result))
		{
			//exclude creatures not in this area according to PCCharacterInfo table
			//if $player_character_id?
			if($player_character_id)
			{
			
			}
			$data[8][] = array($row->CharacterID, $row->QuickStatID, $row->Ypos, $row->Xpos);
		}
		
		if($player_character_id)
		{
			//creatures located in this area according to PCCharacterInfo table
			//includes monsters created by spawn points, and creatures who are charmed, summoned, familiars, or creatures alternate forms - polymorph
			//for these temporary creatures: PCCharacterInfo.AreaID = this_area AND MasterCharacter.AreaID = -1
			$query = "SELECT MasterCharacter.CharacterID, MasterCharacter.QuickStatID, PCCharacterInfo.Ypos, PCCharacterInfo.Xpos FROM PCCharacterInfo INNER JOIN MasterCharacter USING(CharacterID) WHERE PlayerCharacterID = $player_character_id AND PCCharacterInfo.AreaID = $AreaID AND MasterCharacter.AreaID = -1";
			$result = mysqli_query($link,$query);
			while($row = mysqli_fetch_object($result))
			{
				$data[8][] = array($row->CharacterID, $row->QuickStatID, $row->Ypos, $row->Xpos);
			}
		}
		// SELECT MasterCharacter.CharacterID, MasterCharacter.QuickStatID, PCCharacterInfo.Ypos, PCCharacterInfo.Xpos FROM PCCharacterInfo INNER JOIN MasterCharacter USING(CharacterID) WHERE PlayerCharacterID = 10 AND PCCharacterInfo.AreaID = 3 AND MasterCharacter.AreaID != PCCharacterInfo.AreaID
		
		$data[9] = $MapName;
		
		$data[10] = array($SizeY, $SizeX);
		
		$data[11] = $AreaSettings;
		
		
		//player character map memory
		if(intval($AreaSettings['MapMemory']))
			$data[12] = array();//get from file in special folder for this player character
		else
			$data[12] = 0;
		
		
		echo json_encode($data);
	}
}

?>