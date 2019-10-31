<?php
/*
$map_file_array = scandir('../txt_data/map');

$select_box = '<select id="start-map-selection">';

foreach($map_file_array as $map_file_name)
{
	if($map_file_name != '.' && $map_file_name != '..')
	{
		$map_file_name = str_replace('map_', '', $map_file_name);
		$map_file_name = str_replace('.txt', '', $map_file_name);
		//if not _tileset in file name
		if(strpos($map_file_name, '_tileset') === false)
		{
			$select_box .= '<option value="'.$map_file_name.'">'.$map_file_name.'</option>';
		}
	}
}

$select_box .= '</select>';
*/
$select_box = '';

if(!isset($_GET['only_options']))
{
	$select_box = '<select id="start-map-selection">';
}

// database connect function
include_once("../includes/inc_connect.php");
//Connect to database using function from "inc_connect.php"
$link = dbConnect();
$query = "SELECT * FROM Areas";
$result = mysqli_query($link,$query);
while($row = mysqli_fetch_object($result))
{
	$select_box .= '<option value="'.$row->AreaID.'" title="'.$row->Description.'">'.$row->MapName.'</option>';
}

if(!isset($_GET['only_options']))
{
	$select_box .= '</select>';
}

echo($select_box);
?>