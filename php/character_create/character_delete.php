<?php
// database connect function
include_once("../../includes/inc_connect.php"); 
	
// Connect to database using function from "inc_connect.php"
$link = dbConnect();

$data = array();
$data['queries'] = array();

if(isset($_GET['character_id']))
{
	$character_id = $_GET['character_id'];	
}
if(isset($_POST['character_id']))
{
	$character_id = $_POST['character_id'];
}

if(isset($character_id))
{
	//delete everything
	$character_id = $_POST['character_id'];
	
	//get quickstat id
	$query = "SELECT QuickstatID, PartyID FROM MasterCharacter LEFT JOIN CharacterParty USING(CharacterID) WHERE CharacterID = ".$character_id;
	//perform query
	$result = mysqli_query($link,$query);
	$IDrow = mysqli_fetch_object($result);
	$quickstat_id = $IDrow->QuickstatID;
	$party_id = $IDrow->PartyID;
	
	//delete from party
	$query = "DELETE FROM CharacterParty WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);
	//delete party if now empty
	$query = "SELECT CharacterID FROM CharacterParty WHERE PartyID=".$party_id;
	if($result = mysqli_query($link,$query))
	{
		if(mysqli_num_rows($result) == 0)
		{
			$query = "DELETE FROM Parties WHERE PartyID=".$party_id;
			$result = mysqli_query($link,$query);
		}
	}
	
	//characters
	$query = "DELETE FROM Characters WHERE CharacterID = ".$character_id;
	$result = mysqli_query($link,$query);
	
	//mastercharacter
	$query = "DELETE FROM MasterCharacter WHERE CharacterID = ".$character_id;
	$result = mysqli_query($link,$query);
	
	// ATTRIBUTES
	$query = "DELETE FROM CharacterAttribute WHERE CharacterID = ".$character_id;
	$result = mysqli_query($link,$query);
	
	// CLASSES
	$query = "DELETE FROM CharacterClass WHERE CharacterID = ".$character_id;
	$result = mysqli_query($link,$query);

	// SKILLS
	$query = "DELETE FROM CharacterSkill WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);

	// SAVES
	$query = "DELETE FROM CharacterSave WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);

	// RESISTANCES
	$query = "DELETE FROM CharacterResistance WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);

	// PROFICIENCIES
	$query = "DELETE FROM CharacterProficiency WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);

	// EQUIPMENT
	$query = "DELETE FROM CharacterEquipment WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);

	$query = "DELETE FROM CharacterArmor WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);

	$query = "DELETE FROM CharacterWeapon WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);

	// SPECIAL ABILITIES
	// place CharacterSpecialAbility info into array
	$query = "DELETE FROM CharacterSpecialAbility WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);

	// FEATS
	$query = "DELETE FROM CharacterFeat WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);

	// SPELLS
	$query = "DELETE FROM CharacterSpell WHERE CharacterID=".$character_id;
	$result = mysqli_query($link,$query);

	
	//QUICKSTAT TABLES
	$query = "DELETE FROM QuickStats WHERE QuickStatID=".$quickstat_id;
	$result = mysqli_query($link,$query);
	
	//lookup attacks and attack hit rolls
	$query = "SELECT QuickAttackID FROM QuickAttack WHERE QuickStatID = ".$quickstat_id;
	//perform query
	$result = mysqli_query($link,$query);
	while($row = mysqli_fetch_object($result))
	{
		//delete attack hit rolls
		$quickattack_id = $attRow->QuickAttackID;
		$query = "DELETE FROM QuickAttackHitRolls WHERE QuickAttackID=".$quickattack_id;
		$delResult = mysqli_query($link,$query);
	}
	
	//delete attack
	$query = "DELETE FROM QuickAttack WHERE QuickStatID=".$quickstat_id;
	$result = mysqli_query($link,$query);
	
	$query = "DELETE FROM QuickASkill WHERE QuickStatID=".$quickstat_id;
	$result = mysqli_query($link,$query);
	
	$query = "DELETE FROM QuickSpecial WHERE QuickStatID=".$quickstat_id;
	$result = mysqli_query($link,$query);
	
	
	//PC WORLD RECORDS
	$included_from_delete = true;
	include_once('./character_reset.php');
	
}

mysqli_close($link);

echo json_encode($data);

?>