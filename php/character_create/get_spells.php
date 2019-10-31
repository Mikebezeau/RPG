<?php
	// database connect function
	include_once("../../includes/inc_connect.php"); 
		
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	$class_name = $_POST['class_name'];
	
	//***************************************************
	//QUERY SPELL DATA
	
	$minlevel = 0;
	$maxlevel = 3;
	
	$spell_level = array();
	$spell_id = array();
	$spell_name = array();
	$spell_description = array();
	$spell_image = array();
	$spell_skipped = array();
	
	//SHOW SPELLS FOR EACH SPELL LEVEL
	for($spell_level_count = $minlevel; $spell_level_count <= $maxlevel; $spell_level_count++)
	{
		// Prepare Query for Spells table
		$query = 'SELECT SpellID, Name, Description, EffectIconName FROM Spells LEFT JOIN EffectsSpells USING(SpellID) LEFT JOIN Effects USING(EffectID) WHERE Spells.'.$class_name.' = '.$spell_level_count;
		// Perform RaceAbility Query
		if($result = mysqli_query($link,$query))
		{
			while($row = mysqli_fetch_object($result))
			{
				if(strlen($row->Description) < 1000)
				{
					$spell_level[] = $spell_level_count;
					$spell_id[] = $row->SpellID;
					$spell_name[] = $row->Name;
					$spell_description[] = $row->Description;
					$spell_image[] = $row->EffectIconName == NULL ? 'battle_icons/spells/default.png' : $row->EffectIconName;
				}
				else
				{
					$spell_skipped[] = $row->Name;
				}
				//<a href="spell_description.php?spell_id='.$spell_id.'" target="_spell" title="'.$spell_description.'">'.$spell_name.'</a>
			} // end while
		} //end if show column (has spells of that level)
	} //end for $spell_level spell levels
	
	mysqli_close($link);
	
	echo json_encode(array('spell_skipped'=>$spell_skipped, 'spell_level'=>$spell_level, 'spell_id'=>$spell_id, 'spell_name'=>$spell_name, 'spell_description'=>$spell_description, 'spell_image'=>$spell_image));

?>