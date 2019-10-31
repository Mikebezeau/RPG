<?php
//EffectQuery
if(!function_exists('EffectQuery'))
{
	function EffectQuery($link, $effectTypeTable, $effectTypeFieldID, $effectTypeID)
	{
		return 0;
	}
}

// SPELLS KNOWN *****************************************************
// Prepare Query for CharacterSpell table
$query = 'SELECT CharacterSpell.SpellID, Spells.Name, Spells.Description, CharacterSpell.LearnedClassID, CharacterSpell.SpellLevel
			FROM CharacterSpell INNER JOIN Spells ON CharacterSpell.SpellID = Spells.SpellID
			WHERE CharacterID = '.$character_id;
	
// Perform CharacterSpell Query
if ($result = mysqli_query($link,$query)) {
	
	$arr_spell_id = array();
	$arr_spell_name = array();
	$arr_spell_desc = array();
	$arr_learned_class_id = array();
	$arr_spell_level = array();
	
	//Get resulting rows from query
	while($row = mysqli_fetch_object($result))
	{
		$arr_spell_id[] = $row->SpellID;
		$arr_spell_name[] = $row->Name;
		$arr_spell_desc[] = $row->Description;
		$arr_learned_class_id[] = $row->LearnedClassID;
		$arr_spell_level[] = $row->SpellLevel;
		//get spell effect
		$effectTypeTable = 'EffectsSpells';
		$effectTypeFieldID = 'SpellID';
		$effectTypeID = $row->SpellID;
		$arr_spell_effect[] = EffectQuery($link, $effectTypeTable, $effectTypeFieldID, $effectTypeID);
	} // end while
	
} //end if

/*
$arr_spell_id[{spell_id}]
$arr_spell_name[{spell_id}]
$arr_learned_class_id[{spell_id}]
$arr_spell_level[{spell_id}]
*/

?>
