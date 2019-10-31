<?php
$id = $_POST['id'];
$data = $_POST['data'];
$results = print_r($data, true);
file_put_contents('../txt_data/character_design_'.$id.'.txt', $results);
?>