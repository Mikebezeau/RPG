<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Plainscape Online - Edit Abilities</title>
	<link href="css/main.css" rel="stylesheet" type="text/css" />
	<link href="css/parchment.css" rel="stylesheet" type="text/css" />
	<link href="css/edit_ability.css" rel="stylesheet" type="text/css" />
	<!-- Favicon links -->
	<link rel="icon" href="favi.ico" type="image/x-icon" />
	<link rel="shortcut icon" href="favi.ico" type="image/x-icon" />
</head>
<!-- get character data -->
<?php
	//get character_id from cookie
	$character_id = $_GET['character_id'];
	
	// connect for in page queries
	// database connect function
	include_once("includes/inc_connect.php"); 
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
?>
<body>
<div id="container">
  <div id="maincontent" style="min-height:1000px;">
  
  <form id="update_character_ability" method="post" action="php/character_create/character_sheet/character_update_ability.php?character_id=<?php echo $character_id; ?>">
    <div class="center_text"><h1>Edit Abilities and Descriptions</h1>
	    <input type="submit" value="Save and Update Abilities" /><br />
    </div> <!-- end div center -->
    <?php
		//***************************************************
		//QUERY CHARACTER ABILITIES
		
		//get special abilitys names and descriptions
		$arr_special_ability = array();
		$arr_special_ability_desc = array();
		//prepare Query for CharacterSpecialAbility table
		$query = 'SELECT SpecialAbility, Description
					FROM CharacterSpecialAbility
					WHERE CharacterID = '.$character_id;
		//perform CharacterSpecialAbility Query
		if ($result = mysqli_query($link,$query)) {
			//Get resulting rows from query
			while($row = mysqli_fetch_object($result)) {
				$arr_special_ability[] = $row->SpecialAbility;
				$arr_special_ability_desc[] = $row->Description;
			} //end while
		} //end if

		//make feat list centered
		
		echo '<div id="ability_list">';
		for ($i = 0; $i <= 7; $i++) {
			//ability name
			echo '<p><input name="arr_special_ability[]" type="text" size="25" maxlength="50" value="';	
			
			if(isset($arr_special_ability[$i]))
				echo $arr_special_ability[$i];
			
			echo '"></p><p class="small">Ability Name</p>';
		
			//description
			echo '<p>
			<textarea name="arr_special_ability_desc[]" cols="100" rows="3">';
			
			if(isset($arr_special_ability_desc[$i]))
				echo $arr_special_ability_desc[$i];
			
			echo '</textarea></p><p class="small">Description</p></br>';
		} //end for i
			
    	echo '</div> <!--end ability list-->';
	?>
    
    </div> <!-- end center feat list -->
    </form>
  <!-- end #maincontent -->
</div>
<!-- This clearing element should immediately follow the #maincontent div in order to force the #container div to contain all child floats -->
<br class="clearfloat" />
<!-- end #container -->
</div>
</body>
<?php mysqli_close($link); ?>
</html>