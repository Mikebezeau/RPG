<?php
// database connect function
include_once("../includes/inc_connect.php"); 

// Connect to database using function from "inc_connect.php"
$link = dbConnect();

$id = $_POST["id"];
$quick_stat_id = $id;

$_POST = json_decode($_POST['data'], true);

$AreaID = $_POST["AreaID"];

$full_pic_id = 0;//not using this really anymore (unsigned value)

include_once("../classes/Quick_Stat.php");
$character_stats = new Quick_Stat();

//summoning creatures
if(isset($_POST["summoned_by_character_id"]))
{
	$quick_stat_catagory_id = $_POST['summoner_good_guy']?2:3;//for summoning
	
	$character_id_arr = array();
	
	//polymorphing, update PCCharacterInfo with polymorphed quick stat id
	if($_POST["is_polymorph"] > 0)
	{
		//no need to save now, only getting quick stat data
		//get basic quick stats of form polymporphed into
		$character_stats->get_data_stats($link, $quick_stat_id);
		//$character_stats->get_data_skill($link, $quick_stat_id);
		$character_stats->get_data_special($link, $quick_stat_id);
		$character_stats->get_data_attack($link, $quick_stat_id);
	}
	else
	{
		//must have sprite id in mastercharacter table, to join with sprites table in QuickStat
		$query = "SELECT Name, SpriteID, ThumbPicID FROM QuickStats WHERE QuickStatID = ".$quick_stat_id;
		$result = mysqli_query($link,$query);
		$row = mysqli_fetch_object($result);
		$name = $row->Name;
		$sprite_id = $row->SpriteID;
		$thumb_pic_id = $row->ThumbPicID;
		
		$num_summoned = $_POST["num_summoned"];
		for($i=0; $i<$num_summoned; $i++)
		{
			//get next available CharacterID and INSERT new MasterCharacter record
			//get next MasterCharacter CharacterID manually, not using AUTO_INCREMENT
			$query = "SELECT CharacterID FROM MasterCharacter ORDER BY CharacterID DESC LIMIT 1";
			$result = mysqli_query($link,$query);
			$row = mysqli_fetch_object($result);
			$character_id = $row->CharacterID + 1;
			$character_id_arr[] = $character_id;
			
			//FOR SUMMONING, SET MasterCharacter to not have an AreaID or X/Y position - AreaID = -1 for all summoned creatures
			//CatagoryID, if 'summoner_good_guy' GoodGuy or not NPC = 2, Monster = 3
			$query = "INSERT INTO MasterCharacter (AreaID, PlayerID, CharacterID, QuickStatID, CatagoryID, ListRank, CharacterName, HPDamage, ArcaneSPUsed, DivineSPUsed, Description, Xpos, Ypos, SpriteID, ThumbPicID, PortraitPicID, FullPicID)
				VALUES (-1, 99, ".$character_id.", ".$quick_stat_id.", ".($_POST['summoner_good_guy']?2:3).", 0, '".$name."', 0, 0, 0, '', 0, 0, ".$sprite_id.", ".$thumb_pic_id.", 0, ".$full_pic_id.")";
			$result = mysqli_query($link,$query);
			//create a number of creatures = num_summoned
			
			//must have this to get the correct info from QuickStat
			//insert into PCCharacterInfo the AreaID, X, Y, player_character_id, SummonedByCharacterID - ??? store duration remaining somewhere ???
			$query = "INSERT INTO PCCharacterInfo (PlayerCharacterID, CharacterID, Xpos, Ypos, AreaID, HPDamage, ArcaneSPUsed, DivineSPUsed, SummonedByCharacterID, IsPolymorphQSID, IsFamiliar)
				VALUES (".$_POST['player_character_id'].", ".$character_id.", ".$_POST["x"].", ".$_POST["y"].", ".$AreaID.", 0, 0, 0, ".$_POST["summoned_by_character_id"].", 0, ".$_POST["is_familiar"].")";
			$result = mysqli_query($link,$query);
		}
		//get character_stats of any of the IDs, all for same QuickStatID - character_id is put in correct character stats after summon complete
		$character_stats->get_all_data($link, $character_id, $_POST['player_character_id']);
	}
	
	mysqli_close($link);
	//return an array of CharacterIDs and $character_stats
	echo(json_encode(array($character_id_arr, $character_stats)));
	exit;
			
		//SELECT * FROM PCCharacterInfo WHERE SummonedbyCharacterID !=0;
		//SELECT * FROM MasterCharacter WHERE AreaID = -1;
		
		//DELETE FROM PCCharacterInfo WHERE SummonedbyCharacterID !=0;
		//DELETE FROM MasterCharacter WHERE AreaID = -1;
	
}
//used with map editor
else
{
	$quick_stat_catagory_id = $_POST["quick_stat_catagory_id"];
	
	if($quick_stat_catagory_id != 1)
	{
		$name = $_POST["name"];
		$sprite_id = $_POST["sprite_id"];
		$thumb_pic_id = $_POST["thumb_pic_id"];
		
		//get next available CharacterID and INSERT new MasterCharacter record
		//get next MasterCharacter CharacterID manually, not using AUTO_INCREMENT
		$query = "SELECT CharacterID FROM MasterCharacter ORDER BY CharacterID DESC LIMIT 1";
		$result = mysqli_query($link,$query);
		$row = mysqli_fetch_object($result);
		$character_id = $row->CharacterID + 1;
		
		//MASTER CHARACTER***********************
		//insert new character into MasterCharacter
		$check_query = $query = "INSERT INTO MasterCharacter (AreaID, PlayerID, CharacterID, QuickStatID, CatagoryID, ListRank, CharacterName, HPDamage, ArcaneSPUsed, DivineSPUsed, Description, Xpos, Ypos, SpriteID, ThumbPicID, PortraitPicID, FullPicID)
			VALUES
			($AreaID, 99, ".$character_id.", ".$quick_stat_id.", ".$quick_stat_catagory_id.", 0, '".$name."', 0, 0, 0, '', ".$_POST["x"].", ".$_POST["y"].", ".$sprite_id.", ".$thumb_pic_id.", 0, ".$full_pic_id.")";
		$result = mysqli_query($link,$query);
	}
	else
	{
		$character_id = $id;
		//updates a PC to be a GM controlled character, and places it on the map for all players to see in same location
		$query = "UPDATE MasterCharacter SET AreaID=$AreaID, PlayerID=99, Xpos=".$_POST["x"].", Ypos=".$_POST["y"]." WHERE CharacterID = ".$character_id;
		$result = mysqli_query($link,$query);
	}
	//get data to return to editor
	$character_stats->get_all_data($link, $character_id);
	mysqli_close($link);
	echo(json_encode($character_stats));
	//echo($check_query);
	exit;
}
?>

