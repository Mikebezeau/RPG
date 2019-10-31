<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Plainscape Online - Select Spells</title>
	<link href="css/main.css" rel="stylesheet" type="text/css" />
	<link href="css/parchment.css" rel="stylesheet" type="text/css" />
	<link href="css/select_spell_and_feat.css" rel="stylesheet" type="text/css" />
	<!-- Favicon links -->
	<link rel="icon" href="favi.ico" type="image/x-icon" />
	<link rel="shortcut icon" href="favi.ico" type="image/x-icon" />
</head>
<!-- get character data -->
<?php

	$character_id = $_GET['character_id'];

	// connect for in page queries
	// database connect function
	include_once("includes/inc_connect.php"); 
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	// get character known spell info
	include_once("includes/inc_character_query_spell.php");

	$learned_class_id = $_GET["learned_class_id"]
?>
<body>
<div id="container">
  <div id="maincontent">
  
  <form id="update_character_spells" method="post" action="php/character_create/character_sheet/character_update_spell.php?character_id=<?php echo $character_id; ?>&learned_class_id=<?php echo $learned_class_id; ?>">
  	<?php
		//query learned_class_id classname
		$query = 'SELECT ClassName
			FROM Classes WHERE ClassID='.$learned_class_id;

		// Perform Classes Query
		$result = mysqli_query($link,$query);
	
		//Get resulting row from query
		$row = mysqli_fetch_object($result);
		$class_name = $row->ClassName;

		//header
		echo '<div class="center_text"><h1>Select '.$class_name.' Spells</h1>
		    <input type="submit" name="submit_update_spells" value="Save and Update Spells" />
		    <br class="clearfloat" /></div>'.PHP_EOL;
			
		//***************************************************
		//QUERY SPELL DATA
		
		$minlevel = 0;
		$maxlevel = 6;
		
		//SHOW SPELLS FOR EACH SPELL LEVEL
		$column_counter = 1;
		for($spell_level = $minlevel; $spell_level <= $maxlevel; $spell_level++) {
			// Prepare Query for Spells table
			$query = 'SELECT SpellID, Name, Description FROM Spells WHERE '.$class_name.' = '.$spell_level;
			// Perform RaceAbility Query
			$result = mysqli_query($link,$query);
			//if result spell list has more then 0 spells SHOW column
			if(mysqli_num_rows($result) > 0) {
				//Get resulting rows from query
				//display spell level list within a div
				echo '<div class="spell_level_list">';
				echo '<h2>'.$class_name.' Level '.$spell_level.'</h2>';
				while($row = mysqli_fetch_object($result))
				{
					//DISPLAY SPELL NAMES
					$spell_id = $row->SpellID;
					$spell_name = $row->Name;
					$spell_description = $row->Description;
					//two vars seperated by pipe '|' in value of select checkboxes. explode value to seperate data
					echo '<div class="spell_list_item"><input class="fltlft" name="new_spell_list[]" type="checkbox" value="'.$spell_id.'|'.$spell_level.'" ';
					if(isset($arr_spell_id) && in_array($spell_id, $arr_spell_id)) {
						$key = array_search($spell_id, $arr_spell_id); 
						if($arr_learned_class_id[$key] == $learned_class_id) {
							echo 'checked="checked" ';
						}
					}
					echo '/><div class="item_name"><a href="spell_description.php?spell_id='.$spell_id.'" target="_spell" title="'.$spell_description.'">'.$spell_name.'</a></div></div>'.PHP_EOL;
				} // end while
				//close spelllist div
				echo '</div>';
				if($column_counter == 4) {
					echo '<br class="clearfloat" />
						<div class="center"><input type="submit" name="submit_update_spells" value="Save and Update Spells" /></div>
						<br class="clearfloat" />'.PHP_EOL;
					$column_counter = 1;
				}
				$column_counter++;
			} //end if show column (has spells of that level)
		} //end for $spell_level spell levels
	?>
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