<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Plainscape Online - Select Feats</title>
<link href="css/main.css" rel="stylesheet" type="text/css" />
<!-- Main Menu -->
<link href="css/parchment.css" rel="stylesheet" type="text/css" />
<link href="css/select_spell_and_feat.css" rel="stylesheet" type="text/css" />
<!-- functions for use with tables: ShowHide, HighlightRow -->
<script type="text/javascript" src="js/character_sheet/show_hide_feat_type_buttons.js"></script>

<!-- MEDIEVEL FONT -->
<!-- <link  href="http://fonts.googleapis.com/css?family=MedievalSharp:regular" rel="stylesheet" type="text/css" /> -->
<!-- Favicon links -->
<link rel="icon" href="favi.ico" type="image/x-icon" />
<link rel="shortcut icon" href="favi.ico" type="image/x-icon" />
<!--[if IE 5]>
<style type="text/css"> 
/* place css box model fixes for IE 5* in this conditional comment */
.twoColFixLt #sidebar1 { width: 230px; }
</style>
<![endif]-->
<!--[if IE]>
<style type="text/css"> 
/* place css fixes for all versions of IE in this conditional comment */
.twoColFixLt #sidebar1 { padding-top: 30px; }
.twoColFixLt #maincontent { zoom: 1; }
/* the above proprietary zoom property gives IE the hasLayout it needs to avoid several bugs */
</style>
<![endif]-->
</head>
<!-- get character data -->
<?php

	$character_id = $_GET['character_id'];

	// connect for in page queries
	// database connect function
	include_once("includes/inc_connect.php"); 
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	// get character info
	include_once("includes/inc_character_query_feat.php");

?>
<body>
<div id="container">
  <div id="maincontent" style="min-height:1000px;">
  
  <form id="update_character_feat" method="post" action="php/character_create/character_sheet/character_update_feat.php?character_id=<?php echo $character_id; ?>">
    <div class="center_text">
    	<h1>Select Feats</h1>
	    <input class="feat_button" type="submit" value="Save and Update Feats" />
        <br class="clearfloat"/>
    	<!--	<input class="feat_button" type=button name="achievement_btn" value="Achievement" onclick="ShowHide_Feat_Type_Buttons('Achievement')" /> -->
        <input class="feat_button" type=button name="combat_btn" value="Combat" onclick="ShowHide_Feat_Type_Buttons('Combat')" />
        <input class="feat_button" type=button name="general_btn" value="General" onclick="ShowHide_Feat_Type_Buttons('General')" />
        <input class="feat_button" type=button name="item_creation_btn" value="Item Creation" onclick="ShowHide_Feat_Type_Buttons('Item Creation')" />
    	<!--     <input class="feat_button" type=button name="local_btn" value="Local" onclick="ShowHide_Feat_Type_Buttons('Local')" /> -->
        <input class="feat_button" type=button name="metamagic_btn" value="Metamagic" onclick="ShowHide_Feat_Type_Buttons('Metamagic')" />
        <input class="feat_button" type=button name="monster_btn" value="Monster" onclick="ShowHide_Feat_Type_Buttons('Monster')" />
    	<!--     <input class="feat_button" type=button name="prayer_btn" value="Prayer" onclick="ShowHide_Feat_Type_Buttons('Prayer')" /> -->
    </div> <!-- end div center -->
    <?php
		//***************************************************
		//QUERY FEAT DATA
		
		//query FeatType TypeNames
		// 'Prayer' 'Achievement' 'Combat' 'General' 'Item Creation' 'Local' 'Metamagic' 'Monster'
		$query = 'SELECT FeatTypeID, TypeName FROM FeatType ORDER BY TypeName';
		// Perform Feats Query
		$result = mysqli_query($link,$query);
		//Get resulting rows from query
		$feat_type_id = array();
		$feat_type_name = array();
		while($row = mysqli_fetch_object($result)) {
			$feat_type_id[] = $row->FeatTypeID;
			$feat_type_name[] = $row->TypeName;
		}
		//make feat list centered
		echo '<div class="center_feat_list">'.PHP_EOL;
		foreach($feat_type_id as $i => $value) {
			//FeatType
			// Prepare Query for Feats table
			$query = 'SELECT FeatID, FeatName, Prerequisites, Description, Source 
					FROM Feats	WHERE FeatTypeID='.$feat_type_id[$i]; //.' AND Source="Pathfinder Core Rulebook"';
			// Perform Feats Query
			$result = mysqli_query($link,$query);
			//create FeatType Div, list feats
			echo '<div id="'.$feat_type_name[$i].'" name="'.$feat_type_name[$i].'"';
			//let combat be onscreen when page loads
			if($feat_type_name[$i] != 'Combat') { echo 'class="hide">'; } else { echo '>'; }
			echo '<h2 class="center_text">'.$feat_type_name[$i].'</h2>'.PHP_EOL;
			
			$item_counter = 1;
						
			//Get resulting feats from query
			while($row = mysqli_fetch_object($result))
			{
				$feat_id = $row->FeatID;
				$name = $row->FeatName;
				$prerequisites = $row->Prerequisites;
				$description = $row->Description;
				$source = $row->Source;
				//list feats
				echo '<div class="feat_list_item">'.PHP_EOL;
				
				//checkbox
					echo '<input class="fltlft" type="checkbox" name="arr_feat_id[]" value="'.$feat_id.'"';
					if(isset($arr_feat_id) && in_array($feat_id, $arr_feat_id)) {
						echo 'checked="checked" ';
					}
					echo '/>'.PHP_EOL;

				echo '<div class="item_name"><p ';
				
				//hoverover tooltip
					echo 'title="';
					//if any prerequisites show in tool tip
					if($prerequisites != '-') {
						echo 'Prerequisites: '.$prerequisites.'. ';
					}
					if($description != '') {
						echo 'Description: '.$description;
					}
					echo '" >';
				//
				echo $name.'</p></div></div>'.PHP_EOL;
				//'<br/>('.$source.')</span>';
				//every 4rth clearfloat
				if($item_counter == 4) {
					echo '<br class="clearfloat" /><hr /><!-- end row ****************** -->';
					$item_counter = 1;
				}
				else { $item_counter++; }
			} // end while
			echo '</div>';
			echo '<br class="clearfloat" />'.PHP_EOL;
		} //end foreach FeatType
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