<?php
$id = $_POST['id'];
if(file_exists('../txt_data/character_design_'.$id.'.txt'))
{
	$data = file_get_contents('../txt_data/character_design_'.$id.'.txt');
	echo $data;
}
?>