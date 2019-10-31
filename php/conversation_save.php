<?php

// database connect function
include_once("../includes/inc_connect.php"); 
	
// Connect to database using function from "inc_connect.php"
$link = dbConnect();

$returnData = array();

function ConversationDelete($link, $conversation_id)
{
	//delete old Conversation entry
	$query = 'SELECT CPID FROM ConversationPaths WHERE ConversationID='.$conversation_id;
	if($result = mysqli_query($link,$query))
	{
		while($ConversationPath = mysqli_fetch_object($result))
		{
			$CPID = $ConversationPath->CPID;
			$query = 'DELETE FROM ConvPathRequiredKnowledgeTags WHERE CPID='.$CPID;
			$resultDelete = mysqli_query($link,$query);
			$query = 'DELETE FROM ConversationPath WHERE CPID='.$CPID;
			$resultDelete = mysqli_query($link,$query);
			$query = 'DELETE FROM CPCharacterUnique WHERE CPID='.$CPID;
			$resultDelete = mysqli_query($link,$query);
			$query = 'DELETE FROM ConversationPathOptions WHERE CPID='.$CPID;
			$resultDelete = mysqli_query($link,$query);
			$query = 'DELETE FROM CPGiveKnowledgeTags WHERE CPID='.$CPID;
			$resultDelete = mysqli_query($link,$query);
			$query = 'DELETE FROM CPOptionRequirements WHERE CPID='.$CPID;
			$resultDelete = mysqli_query($link,$query);
			$query = 'DELETE FROM CPOptionEvent WHERE CPID='.$CPID;
			$resultDelete = mysqli_query($link,$query);
		}
	}
	$query = 'DELETE FROM Conversations WHERE ConversationID='.$conversation_id;
	$resultDelete = mysqli_query($link,$query);
	$query = 'DELETE FROM ConversationPaths WHERE ConversationID='.$conversation_id;
	$resultDelete = mysqli_query($link,$query);
	$query = 'DELETE FROM ConvRequiredKnowledgeTags WHERE ConversationID='.$conversation_id;
	$resultDelete = mysqli_query($link,$query);
}


if(isset($_GET['conversation_id']) && isset($_GET['delete']))
{
	$conversation_id = $_POST['id'];
	ConversationDelete($link, $conversation_id);
}

else if(isset($_GET['conversation_id']))
{
	$conversation_id = $_POST['id'];

	//delete old Conversation entry
	ConversationDelete($link, $conversation_id);
	
	//data (false makes it an object, true is array)
	$conversationData = json_decode($_POST['data'], false);
	
	//save Conversation
	$AreaID = $conversationData->AreaID;
	$CharacterID = $conversationData->CharacterID;
	$title = mysqli_real_escape_string($link, $conversationData->Title);
	$title = ($title == '') ? mysqli_real_escape_string($link, $conversationData->paths[0]->CPText) : $title;
	$description = mysqli_real_escape_string($link, $conversationData->Description);
	$query = "INSERT INTO Conversations (AreaID, CharacterID, Title, Description) VALUES('$AreaID', '$CharacterID', '$title', '$description')";
	$result = mysqli_query($link,$query);
	//get insert id
	$new_conversation_id = mysqli_insert_id($link);
	
	//save ConversationPaths
	for($i=0; $i<count($conversationData->paths); $i++)
	{
		$CPOrder = $i+1;
		$CPRankingValue = $conversationData->paths[$i]->CPRankingValue;
		$CPTitle = mysqli_real_escape_string($link, $conversationData->paths[$i]->CPTitle);
		$CPDescription = mysqli_real_escape_string($link, $conversationData->paths[$i]->CPDescription);
		$CPText = mysqli_real_escape_string($link, $conversationData->paths[$i]->CPText);
		$CPAreaRenownID = $conversationData->paths[$i]->CPAreaRenownID;
		$CPAreaRenownStrength = $conversationData->paths[$i]->CPAreaRenownStrength;
		$GivenKnowledgeTagID = $conversationData->paths[$i]->GivenKnowledgeTagID;
		
		//echo 
		$query = "INSERT INTO ConversationPaths (ConversationID, CPOrder, CPRankingValue, CPTitle, CPDescription, CPText, CPAreaRenownID, CPAreaRenownStrength) 
			VALUES ($new_conversation_id, '$CPOrder', '$CPRankingValue', '$CPTitle', '$CPDescription', '$CPText', '$CPAreaRenownID', '$CPAreaRenownStrength')";
		$result = mysqli_query($link,$query);
		//get insert id
		$CPID = mysqli_insert_id($link);
		$conversationData->paths[$i]->CPID = $CPID;
		//add to given knowledge tags
		if($GivenKnowledgeTagID > 0)
		{
			//echo 
			$tagQuery = "INSERT INTO CPGiveKnowledgeTags (CPID, KnowledgeTagID) VALUES ('$CPID', '$GivenKnowledgeTagID')";
			$tagResult = mysqli_query($link,$tagQuery);
		}
	}
	
	for($i=0; $i<count($conversationData->paths); $i++)
	{
		for($j=0; $j<count($conversationData->paths[$i]->options); $j++)
		{
			$CPID = $conversationData->paths[$i]->CPID;
			$CPOptionText = mysqli_real_escape_string($link, $conversationData->paths[$i]->options[$j]->CPOptionText);
			$NeededKnowledgeTagID = $conversationData->paths[$i]->options[$j]->NeededKnowledgeTagID;
			$RestrictKnowledgeTagID = $conversationData->paths[$i]->options[$j]->RestrictKnowledgeTagID;
			$EventType = $conversationData->paths[$i]->options[$j]->EventType;
			//this is the fake temp one
			$optionLinkCPIndex = $conversationData->paths[$i]->options[$j]->LinkToCPID;
			//must get the insert id for real CPID of links
			$LinkToCPID = $conversationData->paths[$optionLinkCPIndex-1]->CPID;
			//
			//echo 
			$query = "INSERT INTO ConversationPathOptions (CPID, CPOptionText, LinkToCPID, LinkToCPOrder, NeededKnowledgeTagID, RestrictKnowledgeTagID) 
				VALUES ($CPID, '$CPOptionText', '$LinkToCPID', '$optionLinkCPIndex', '$NeededKnowledgeTagID', '$RestrictKnowledgeTagID')";
			$result = mysqli_query($link,$query);
			
			//get insert id
			$ConversationPathOptionID = mysqli_insert_id($link);
			
			//insert conversation path option requirements
			//add to conversation path option event
			//if($EventType != 0)//not working?
			if($EventType == 'join' || $EventType == 'shop' || $EventType == 'battle' || $EventType == 'event')
			{
				$CPEType = $EventType;
				//$CPEStartEventID = $???
				//$eventQuery = "INSERT INTO CPOptionEvent (CPID, CPEType, CPEStartEventID) VALUES ($CPID, $ConversationPathOptionID, '$CPEType', '$CPEStartEventID')";
				//echo 
				$eventQuery = "INSERT INTO CPOptionEvent (CPID, CPOID, CPEType) VALUES ($CPID, $ConversationPathOptionID, '$CPEType')";
				$eventResult = mysqli_query($link,$eventQuery);
			}
		}
	}

	//update tables that are storing old $conversation_id to $new_conversation_id
	/*
	CharacterConvComplete
	*/
	
	echo $new_conversation_id;
}

else if(isset($_GET['knowledge_tags']))
{
	//data (false makes it an object, true is array)
	$knowledgeTagData = json_decode($_POST['data'], false);

	//save Conversation
	$AreaID = $_POST['id'];
	$TagName = mysqli_real_escape_string($link, $knowledgeTagData->TagName);
	
	if(isset($_GET['delete']))
	{
		$KnowledgeTagID = mysqli_real_escape_string($link, $knowledgeTagData->KnowledgeTagID);
		
		$query = "SELECT * FROM ConvRequiredKnowledgeTags WHERE RequiredKnowledgeTagID = '$KnowledgeTagID'";
		$result = mysqli_query($link,$query);
		if($row = mysqli_fetch_object($result))
		{
			echo 'error';
		}
		else
		{
			$query = "DELETE FROM KnowledgeTags WHERE KnowledgeTagID = '$KnowledgeTagID'";
			$result = mysqli_query($link,$query);
		}
	}
	else
	{
		$query = "SELECT * FROM KnowledgeTags WHERE AreaID = '$AreaID' and TagName = '$TagName'";
		$result = mysqli_query($link,$query);
		if($row = mysqli_fetch_object($result))
		{
			echo 'error';
		}
		else
		{
			//echo 
			$query = "INSERT INTO KnowledgeTags (AreaID, TagName, TagDescription) VALUES ('$AreaID', '$TagName', '')";
			$result = mysqli_query($link,$query);
		}
	}
}

mysqli_close($link);

?>