<?php
// database connect function
include_once("../includes/inc_connect.php"); 
	
// Connect to database using function from "inc_connect.php"
$link = dbConnect();

if(isset($_GET['conversation_id']))
{
	$conversation_id = $_POST['id'];
	$area_id = isset($_GET['area_id']) ? $_GET['area_id'] : -1;
	
	//if no id given, check for an area conversation, if none get most recent conversation saved
	if($conversation_id == 0)
	{
		$query = "SELECT ConversationID FROM Conversations WHERE AreaID = '$area_id' and CharacterID = 0 ORDER BY ConversationID DESC LIMIT 1";
		$result = mysqli_query($link,$query);
		if($conversation = mysqli_fetch_object($result))
		{
			$conversation_id = $conversation->ConversationID;
		}
		else
		{
			/*
			$query = "SELECT ConversationID FROM Conversations ORDER BY ConversationID DESC LIMIT 1";
			$result = mysqli_query($link,$query);
			if($conversation = mysqli_fetch_object($result))
			{
				$conversation_id = $conversation->ConversationID;
			}
			*/
			//do not return sample conversation if noe exists for the area
			echo json_encode(0);
			exit;
		}
	}
	//query to retrieve Conversation entry
	$query = 'SELECT * FROM Conversations WHERE ConversationID='.$conversation_id;
	if($result = mysqli_query($link,$query))
	{
		$conversation = mysqli_fetch_object($result);
	}

	//if conversation exists
	if(isset($conversation))
	{
		$ConversationPaths = array();
		//get ConversationPaths
		$query = "SELECT * FROM ConversationPaths WHERE ConversationID='$conversation_id' ORDER BY CPOrder";
		$pathIndex = 0;
		if($pathRresult = mysqli_query($link,$query))
		{
			while($ConversationPath = mysqli_fetch_object($pathRresult))
			{
				$ConversationPaths[$pathIndex] = $ConversationPath;
				$CPID = $ConversationPath->CPID;
				/*
				//get conversation path requirements
				$queryRequirement = 'SELECT * FROM ConvPathRequiredKnowledgeTags WHERE CPID='.$CPID;
				$ConversationPaths[$pathIndex]->requirements = array();
				if($requirementResult = mysqli_query($link,$queryRequirement))
				{
					while($requirement = mysqli_fetch_object($requirementResult))
					{
						$ConversationPaths[$pathIndex]->requirements[] = $requirement;
					}
				}
				*/
				//get conversation path knowledge tags given when reaching this path item
				$queryGiveTag = 'SELECT KnowledgeTagID, TagName, TagDescription FROM CPGiveKnowledgeTags INNER JOIN KnowledgeTags USING(KnowledgeTagID) WHERE CPID='.$CPID;
				$ConversationPaths[$pathIndex]->GivenKnowledgeTags = array();
				if($giveTagRresult = mysqli_query($link,$queryGiveTag))
				{
					while($tag = mysqli_fetch_object($giveTagRresult))
					{
						$ConversationPaths[$pathIndex]->GivenKnowledgeTags[] = $tag;
					}
				}
				
				//add conversation path options to conversation path
				$queryOptions = 'SELECT * FROM ConversationPathOptions WHERE CPID='.$CPID;
				$ConversationPaths[$pathIndex]->options = array();
				$optionIndex = 0;
				if($optionRresult = mysqli_query($link,$queryOptions))
				{
					while($option = mysqli_fetch_object($optionRresult))
					{
						$ConversationPaths[$pathIndex]->options[$optionIndex] = $option;
						//get option requirements
						$optionRequirementQuery = 'SELECT * FROM CPOptionrequirements WHERE CPID='.$CPID;
						$ConversationPaths[$pathIndex]->options[$optionIndex]->requirements = array();
						if($optionRequirementResult = mysqli_query($link,$optionRequirementQuery))
						{
							while($optionRequirement = mysqli_fetch_object($optionRequirementResult))
							{
								$ConversationPaths[$pathIndex]->options[$optionIndex]->requirements[] =  $optionRequirement;
							}
						}
						//get option event
						$optionEventQuery = 'SELECT * FROM CPOptionEvent WHERE CPOID='.$option->ConversationPathOptionID;
						$ConversationPaths[$pathIndex]->options[$optionIndex]->event = 0;
						if($optionEventResult = mysqli_query($link,$optionEventQuery))
						{
							while($optionEvent = mysqli_fetch_object($optionEventResult))
							{
								$ConversationPaths[$pathIndex]->options[$optionIndex]->event = $optionEvent;
							}
						}
						$optionIndex++;
					}
				}
				$pathIndex++;
			}
		}
		$conversation->paths = $ConversationPaths;
		$conversation->character_index = isset($_GET['character_index']) ? $_GET['character_index'] : -1;
		echo json_encode($conversation);
	}
	else
	{
		echo 0;
	}
}//end isset conversation_id

elseif(isset($_GET['knowledge_tags']))
{
	$area_id = $_POST['id'];
	
	//query to retrieve Knowledge Tags
	$query = 'SELECT * FROM KnowledgeTags';
	//$query = 'SELECT * FROM KnowledgeTags WHERE AreaID='.$area_id;
	$knowledgeTags = array();
	if($result = mysqli_query($link,$query))
	{
		while($row = mysqli_fetch_object($result))
		{
			$knowledgeTags[] = $row;
		}
		echo json_encode($knowledgeTags);
	}
	else
	{
		echo 0;
	}
}

elseif(isset($_GET['get_all_area']) && isset($_GET['area_id']))
{
	$query = "SELECT ConversationID, Title, CharacterID FROM Conversations WHERE AreaID = ".$_GET['area_id'];
	$result = mysqli_query($link,$query);
	$conversations = array();
	while($row = mysqli_fetch_object($result))
	{
		$conversations[] = $row;
	}
	echo json_encode($conversations);
}

elseif(isset($_GET['get_all']))
{
	$query = "SELECT ConversationID, Title, AreaID, CharacterID FROM Conversations";
	$result = mysqli_query($link,$query);
	$conversations = array();
	while($row = mysqli_fetch_object($result))
	{
		$conversations[] = $row;
	}
	echo json_encode($conversations);
}

mysqli_close($link);
	
?>