<?php
	
	// connect for in page queries
	// database connect function
	include_once("includes/inc_connect.php"); 
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Plainscape Online - Spell Description</title>
<link href="css/main.css" rel="stylesheet" type="text/css" />
<!-- Main Menu -->
<link href="css/main_nav.css" rel="stylesheet" type="text/css" />
<link href="css/parchment.css" rel="stylesheet" type="text/css" />
<link href="css/spell_and_feat_description.css" rel="stylesheet" type="text/css" />
<!-- functions for use with tables: ShowHide, HighlightRow -->
<script type="text/javascript" src="js/show_hide.js"></script>
<!-- Main Menu -->
<script type="text/javascript" src="js/main_nav.js"></script>
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
<body>
<div id="container">
  <div id="header">
    <!--<h1><img src="images/graphic/parchment_logo.png" width="583" height="61" alt="Pathfinder Planescape" /></h1>-->
  </div>
	
  <div id="maincontent">
    <?php
		//***************************************************
		//QUERY SPELL DATA
		$spell_id = $_GET["spell_id"];
		// Prepare Query for Spells table
		$query = 'SELECT html FROM Spells WHERE SpellID = '.$spell_id;
		// Perform Spells Query
		$result = mysqli_query($link,$query);
		//Get resulting rows from query
		while($row = mysqli_fetch_object($result))
		{
			//****************************************
			//DISPLAY SPELL DATA ON SCREEN
			//<link rel='stylesheet'href='PF.css'> included in database
			//$row->html = str_replace('<link rel="stylesheet" href="PF.css">','', $row->html);
			$row->html = str_replace('PF.css','', $row->html);
			echo $row->html;
		} // end while
	?>
  <!-- end #maincontent -->
</div>
<!-- This clearing element should immediately follow the #maincontent div in order to force the #container div to contain all child floats -->
<br class="clearfloat" />
<!-- end #container -->
</div>
</body>
<?php mysqli_close($link); ?>
</html>