<?php

//used when loading and a sprite image is not found, remove from the database
if(isset($_POST['delete_sprite_id']))
{
	function DeleteSpriteEntry($SpriteID)
	{
		// database connect function
		include_once("../includes/inc_connect.php"); 
		
		// Connect to database using function from "inc_connect.php"
		$link = dbConnect();
			
		$query = 'DELETE FROM Sprites WHERE SpriteID = '.$SpriteID;
		$result = mysqli_query($link,$query);
	}
	$SpriteID = $_POST['delete_sprite_id'];
	DeleteSpriteEntry($SpriteID);
	echo 'SpriteID: '.$SpriteID.' deleted from database';
	exit;
}


function GetFileList($dir, $recurse=false)
{
	$retval = array();

	// add trailing slash if missing
	if(substr($dir, -1) != "/") $dir .= "/";

	// open pointer to directory and read list of files
	$d = @dir($dir) or die("GetFileList: Failed opening directory $dir for reading");
	while(false !== ($entry = $d->read()))
	{
		// skip hidden files
		if($entry[0] == ".") continue;
		if(is_dir("$dir$entry"))
		{
			if($recurse && is_readable("$dir$entry/"))
			{
				$retval[$entry] = GetFileList("$dir$entry/", true);
			}
		}
		elseif(is_readable("$dir$entry"))
		{
			$retval[] = '<img id="image-'.(str_replace('.png','',$entry)).'" data-file="'.(str_replace('./images/','',$dir.$entry)).'" data-name="'.(str_replace('.png','',$entry)).'" src="'.$dir.$entry.'"/>';
		}
	}
	$d->close();

	return $retval;
}

function ListImages($imageList)
{
	//first output images
	foreach($imageList as $i => $image)
	{
		if(!is_array($image))
		{
			echo($image);
		}
	}
	//list images in the sub directories last
	$listKeys = array_keys($imageList);
	foreach($imageList as $i => $image)
	{
		if(is_array($image))
		{
			//echo('<br/>'.$listKeys[$i].' '.$i.'<br/>');
			echo('<br/><br/><br/>'.ucfirst($i).'<br/>');
			ListImages($image);
		}
	}
}
?>