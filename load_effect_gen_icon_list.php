<?php //show all the effect icons
	//read from directory ./images/battle_icons/spells/school
	//read from directory ./images/battle_icons/spells/domain
	//read from directory ./images/battle_icons/effect (all subfolders, grouped) 
	include_once('./php/get_images.php');
	echo('<br/>Spell Schools<br/>');
	ListImages(GetFileList('./images/battle_icons/spells/school', true));
	echo('<br/>Domains<br/>');
	ListImages(GetFileList('./images/battle_icons/spells/domain', true));
	echo('<br/>General<br/>');
	ListImages(GetFileList('./images/battle_icons/effect', true));
?>