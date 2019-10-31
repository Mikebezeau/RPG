<?php
//EffectQuery
if(!function_exists('EffectQuery'))
{
	function EffectQuery($link, $effectTypeTable, $effectTypeFieldID, $effectTypeID)
	{
		return 0;
	}
}

// FEATS KNOWN *****************************************************
// Prepare Query for CharacterFeat table
$query = 'SELECT CharacterFeat.FeatID, Feats.FeatName , Feats.Description 
			FROM CharacterFeat INNER JOIN Feats ON CharacterFeat.FeatID = Feats.FeatID
			WHERE CharacterID = '.$character_id;
	
// Perform CharacterSpell Query
if ($result = mysqli_query($link,$query)) {
	
	$arr_feat_id = array();
	$arr_feat_name = array();
	$arr_feat_desc = array();
	//Get resulting rows from query
	while($row = mysqli_fetch_object($result))
	{
		$arr_feat_id[] = $row->FeatID;
		$arr_feat_name[] = $row->FeatName;
		$arr_feat_desc[] = $row->Description;
		$effectTypeTable = 'EffectsFeats';
		$effectTypeFieldID = 'FeatID';
		$effectTypeID = $row->FeatID;
		$arr_feat_effect[] = EffectQuery($link, $effectTypeTable, $effectTypeFieldID, $effectTypeID);
	} // end while
	
} //end if

/*
$arr_feat_id[]
$arr_feat_name[]
$arr_feat_desc[]

*/

?>
