<?php
	/*
	// database connect function
	include_once("../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	if($_POST['gender'] == 'Male')
	{
		$looking_for = 'male';
	}
	else
	{
		$looking_for = 'female';
	}
	
	$query = 'SELECT * FROM Sprites WHERE FilePathName LIKE "%/'.$looking_for.'%"';
	if($result = mysqli_query($link,$query))
	{
		while($row = mysqli_fetch_object($result))
		{
			echo('<img src="./images/'.$row->FilePathName.'" data-id="'.$row->SpriteID.'" data-scale="'.$row->DefaultSpriteScale.'">');
		}
	} //end if result Quickstats record exists
	
	mysqli_close($link);
	*/
	
$gender = 0;
if(isset($_GET['s']))
{
	$gender = $_GET['s'];
	
	$thumbTag = array(
		1=>'m',
		2=>'m',
		3=>'m',
		4=>'',
		5=>'f',
		6=>'m',
		7=>'m',
		8=>'m',
		9=>'m',
		10=>'f',
		11=>'m',
		12=>'m',
		13=>'',
		14=>'f',
		15=>'',
		16=>'m',
		17=>'',
		18=>'m',
		19=>'',
		20=>'',
		21=>'',
		22=>'m',
		22=>'',
		44=>'m',
		45=>'m',
		46=>'m',
		47=>'f',
		48=>'m',
		49=>'f',
		50=>'m',
		51=>'m',
		52=>'m',
		53=>'m',
		54=>'m',
		55=>'m',
		56=>'m',
		57=>'m',
		58=>'m',
		59=>'m',
		60=>'m',
		61=>'m',
		62=>'m',
		63=>'f',
		64=>'m',
		65=>'m',
		66=>'m',
		67=>'m',
		68=>'m',
		69=>'f',
		70=>'f',
		71=>'m',
		72=>'f',
		73=>'f',
		74=>'f',
		75=>'m',
		76=>'f',
		77=>'m',
		78=>'f',
		79=>'f',
		80=>'f',
		81=>'f',
		82=>'m',
		83=>'m',
		84=>'f',
		85=>'m',
		87=>'m',
		88=>'m',
		89=>'f'
	);
	
}

$dir = '../../images/char/thumb';
$recurse = false;

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
			//
		}
		elseif(is_readable("$dir$entry"))
		{
			$id = (int)str_replace('charthumb_','',(str_replace('.png','',$entry)));
			if(isset($thumbTag[$id]))
			{
				if($gender == '' || (isset($thumbTag[$id]) && ($gender == 'm' && $thumbTag[$id] == 'm') ||($gender == 'f' && $thumbTag[$id] == 'f')))
				{
					echo '<img data-id="'.$id.'" style="background-color:#fff; margin:10px; overflow:hidden; border-radius:5px;" src="'.(str_replace('../.','',$dir)).$entry.'"/>';
				}
			}
		}
	}
	$d->close();



?>