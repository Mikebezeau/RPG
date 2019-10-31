<?php

// database connect function
include_once("inc_connect.php"); 

// Connect to database using function from "inc_connect.php"
$link = dbConnect();

// TOPICS INFO *****************************************************
// Prepare Query for Topics table
$query = 'SELECT TopicCatagory.CatagoryName, Topics.Title, Topics.TopicID, CAST(Topics.StartedDate AS DATE) AS StartedDate
			FROM TopicCatagory INNER JOIN Topics
			ON TopicCatagory.CatagoryID = Topics.CatagoryID
			WHERE Topics.CampaignID = '.$campaign_id.'
			ORDER BY TopicCatagory.CatagoryID ASC, StartedDate DESC';

// Perform Topics Query
if($result = mysqli_query($link,$query)) {
	//Get resulting row from query
	$arr_catname = array();
	$arr_title = array();
	$arr_topic_id = array();
	$arr_date = array();
	while($row = mysqli_fetch_object($result))
	{
		$arr_catname[] = $row->CatagoryName;
		$arr_title[] = $row->Title;
		$arr_topic_id[] = $row->TopicID;
		$arr_date[] = $row->StartedDate;
	}
}

$arr_num_posts = array();
foreach($arr_topic_id as $i => $value) {
	// Prepare Query for Topics table
	$query = 'SELECT Count(Posts.TopicID) AS NumPosts
				FROM Posts INNER JOIN Topics
				ON Posts.TopicID = Topics.TopicID
				WHERE Topics.TopicID = '.$arr_topic_id[$i].'
				GROUP BY Posts.TopicID';
	
	// Perform Topics Query
	if($result = mysqli_query($link,$query)) {
		$row = mysqli_fetch_object($result);
		$arr_num_posts[$i] = $row->NumPosts;
	} //end if result
	if(mysqli_num_rows($result) == 0)
		$arr_num_posts[$i] = 0;
} //end foreach

mysqli_close($link);

?>