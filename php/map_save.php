<?php
$id = $_POST['id'];
$data = $_POST['data'];

$returnData = array();

if(isset($_GET['tileset']))
{
	file_put_contents('../txt_data/map/map_'.$id.'_tileset.txt',$data);
	$returnData['message'] = 'map_tileset_'.$id.' saved';
}
else
{
	//insert or update DB
	// database connect function
	include_once("../includes/inc_connect.php"); 

	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	$data = json_decode($data);

	//$data[4] -> descriptions and coords
	//$CoordDescription->description = description text, $CoordDescription->coord_array = [[y,x],[y,x],...] coords of this description
	
	//map data to save into DB from data array
	//$data[5] -> start position: 0=StartY, 1=StartX
	$StartX = $data[5][1];
	$StartY = $data[5][0];
	//$data[6] -> map size: 0=SizeY, 1=SizeX
	$SizeX = $data[6][1];
	$SizeY = $data[6][0];
	//$data[7] is map description
	$Description = $data[7];
	
	$query = "SELECT AreaID FROM Areas WHERE MapName = '$id'";
	$result = mysqli_query($link,$query);
	if($row = mysqli_fetch_object($result))
	{
		//record found, update
		$AreaID = $row->AreaID;
	}
	else
	{
		$query = "INSERT INTO Areas (MapName) VALUES ('$id')";
		$updateResult = mysqli_query($link,$query);
		$AreaID = mysqli_insert_id($link);
	}
	
	$HasMap = isset($data[8]->HasMap) ? 1 : 0;
	$UseLos = isset($data[8]->UseLos) ? 1 : 0;
	$MapMemory = isset($data[8]->MapMemory) ? 1 : 0;
	$BattleBgIndex = $data[8]->BattleBgIndex;
	$DarknessFactor = isset($data[8]->DarknessFactor) ? $data[8]->DarknessFactor : 1;
	$HasMist = isset($data[8]->HasMist) ? 1 : 0;
	$HasRain = isset($data[8]->HasRain) ? 1 : 0;
	$ChanceMist = $data[8]->ChanceMist;
	$ChanceRain = $data[8]->ChanceRain;
	
	$query = "UPDATE Areas SET MapName = '$id', StartX = '$StartX', StartY = '$StartY', SizeX = '$SizeX', SizeY = '$SizeY', Description = '$Description', 
		HasMap = '$HasMap', UseLos = '$UseLos', MapMemory = '$MapMemory', BattleBgIndex = '$BattleBgIndex', DarknessFactor = '$DarknessFactor', HasMist = '$HasMist', HasRain = '$HasRain', ChanceMist = '$ChanceMist', ChanceRain = '$ChanceRain'
		WHERE AreaID = $AreaID";
	$updateResult = mysqli_query($link,$query);
		
	file_put_contents('../txt_data/map/map_'.$id.'.txt',json_encode($data));
	
	$returnData['message'] = 'map_'.$id.' saved';
	$returnData['AreaID'] = $AreaID;
}
echo(json_encode($returnData));
?>