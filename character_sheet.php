<?php
	
	$character_id = $_GET['character_id'];

	// connect for in page queries
	// database connect function
	include_once("includes/inc_connect.php"); 
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Plainscape Online - Character Sheet</title>
	<!-- fonts -->
	<link rel="stylesheet" href="./stylesheet.css" type="text/css" charset="utf-8" />
			
	<link href="css/main.css" rel="stylesheet" type="text/css" />
	<link href="css/parchment.css" rel="stylesheet" type="text/css" />
	<link href="css/character_sheet.css" rel="stylesheet" type="text/css" />
	
	<script type="text/javascript" src="js/character_sheet/show_hide.js"></script>
	<script type="text/javascript" src="js/character_sheet/character_sheet.js"></script>

	<!-- set up onload event to call both 'init_character_sheet' and 'init_main_nav' -->
	<script type="text/javascript">
		window.onload = init_functions;
		function init_functions() {
			init_character_sheet();
		} //end init_functions
	</script>
	
	<link rel="icon" href="favi.ico" type="image/x-icon" />
	<link rel="shortcut icon" href="favi.ico" type="image/x-icon" />

</head>
<!-- get character data -->
<body>
<?php
	// get character info
	$character_sheet_display = 1;
	include_once("includes/inc_character_query_full.php");
?>

<div id="container">
  <!--<div id="header">
    <h1><img src="images/graphic/parchment_logo.png" width="583" height="61" alt="Pathfinder Planescape" /></h1>
  </div>-->
    <!--<hr id="header_hr" />-->
  <div id="maincontent">
  <form id="character_sheet" method="post" action="php/character_create/character_sheet/character_update.php?character_id=<?php echo $character_id; ?>" autocomplete="off">
    <h1><?php echo $charactername; ?></h1>
    <p class="heading">Character Info<input class="submit_right" type="submit" name="update" value="Update / Save all" /></p>
    <!-- INFO -->
    <div id="info">
    	<div class="inline-block">
    	<select  class="text" name="race" id="race" tabindex="2">
            <?php
				// RACE INFO *****************************************************
				// Prepare Query for Races table
				$query = 'SELECT * FROM Races';
				// Perform Races Query
				$result = mysqli_query($link,$query);
				//Get resulting rows from query
				while($row = mysqli_fetch_object($result))
				{
					if ($row->RaceID == $raceid) {
						echo '<option selected="selected" value="'.$row->RaceID.'">'.$row->RaceName.'</option>';
					}
					else {
						echo '<option value="'.$row->RaceID.'">'.$row->RaceName.'</option>';
					}
				} // end while
			?>
          </select>
          <p class="small">Race</p>
          </div>
          
          <div class="inline-block">
          <select class="text" name="gender" id="gender"  tabindex="3">
            <?php  // GENDER ************************************
				if ($gender == "Male") {
					echo '<option selected="selected" value="Male">Male</option>';
					echo '<option value="Female">Female</option>';
				}
				else {
					echo '<option value="Male">Male</option>';
					echo '<option selected="selected" value="Female">Female</option>';
				}
			  ?>
          </select>
          <p class="small">Gender</p>
          </div>
          
          <div class="inline-block">
          <select class="text" id="alignchaos" name="alignchaos">
            <?php
                echo '<option '; if ($alignchaosid == 0) { echo 'selected="selected" '; } echo 'value="0">Lawful</option>';
                echo '<option '; if ($alignchaosid == 1) { echo 'selected="selected" '; } echo 'value="1">Neutral</option>';
                echo '<option '; if ($alignchaosid == 2) { echo 'selected="selected" '; } echo 'value="2">Chaotic</option>';
            ?>
          </select>
          <select class="text" id="aligngood" name="aligngood">
            <?php
				echo '<option '; if ($aligngoodid == 0) { echo 'selected="selected" '; } echo 'value="0">Good</option>';
				echo '<option '; if ($aligngoodid == 1) { echo 'selected="selected" '; } echo 'value="1">Neutral</option>';
				echo '<option '; if ($aligngoodid == 2) { echo 'selected="selected" '; } echo 'value="2">Evil</option>';
			?>
          </select>
          <p class="small">Alignment</p>
          </div>
          
          <div class="inline-block">
          <select  class="text" id="faction" name="faction"  tabindex="4">
            <option value="99">None</option>
            <?php	// FACTION INFO *****************************************************
				// Prepare Query for Factions table
				$query = 'SELECT * FROM Factions';
				// Perform Factions Query
				$result = mysqli_query($link,$query);
				//Get resulting rows from query
				while($row = mysqli_fetch_object($result))
				{
					if ($row->FactionID == $factionid) {
						echo '<option selected="selected" value="'.$row->FactionID.'">'.$row->FactionName.'</option>';
					}
					else {
						echo '<option value="'.$row->FactionID.'">'.$row->FactionName.'</option>';
					}
				} // end while
			?>
          </select>
          <p class="small">Faction</p>
          </div>
          
          <div class="inline-block">
          <input class="text" id="deity" name="deity" type="text" title="deity" size="14" maxlength="14" value="<?php echo $deity; ?>" tabindex="8" />
        <p class="small">Deity</p>
        </div>
        
        <div class="inline-block">
        <input class="text"  style="width:320px" id="occupation" name="occupation" type="text" title="occupation" size="30" maxlength="300" value="<?php echo $occupation; ?>" />
        <p class="small">Occupation</p>
        </div>
        
        <div class="inline-block">
        <input class="text" style="width:80px;" id="height" name="height" type="text" title="height" size="7" maxlength="14" value="<?php echo $height; ?>" tabindex="5" />
        <p class="small">Height</p>
        </div>
        
        <div class="inline-block">
      <input class="text"  style="width:80px;" id="weight" name="weight" type="text" title="weight" size="7" maxlength="14" value="<?php echo $weight; ?>" tabindex="6" />
      <p class="small">Weight</p>
      </div>
      
      <div class="inline-block">
      <input class="text"  style="width:80px;" id="age" name="age" type="text" title="age" size="7" maxlength="14" value="<?php echo $age; ?>" tabindex="7" />
		<p class="small">Age</p>
        </div>
        <!-- <input class="text" id="languages" name="languages" type="text" title="languages" size="66" maxlength="66" value="" tabindex="9" /> -->
    
    </div>
    
    <!-- ATTRIBUTES ********************************************** -->
    <table class="fltrt">
      <tr class="small">
        <td>Ability Score</td>
        <td>Total</td>
        <td>Mod</td>
        <td>Base</td>
        <td>Bonus</td>
        <td>Enhance</td>
      </tr>
      <?php 
		foreach ($arr_attname as $i => $value) {
			echo '<tr><td class="title">'.$arr_attname[$i].'</td>
			<td class="main"><input id="'.$i.'_attribute_total" class="blank" name="'.$i.'_attribute_total" type="text" size="1" maxlength="2" value="'.($arr_attvalue[$i] + $arr_attbonus[$i] + $arr_attenhance[$i]).'" readonly="readonly" /></td>
			<td class="main"><input id="'.$i.'_attribute_mod" class="blank" name="'.$i.'_attribute_mod" type="text" size="1" maxlength="2" value="'.$arr_attmod[$i].'" readonly="readonly" /></td>
			<td class="input"><input id="'.$i.'_attribute_value" class="'.$i.'_attribute" name="arr_attvalue[]" type="text" size="1" maxlength="2" value="'.$arr_attvalue[$i].'" /></td>
			<td class="input"><input id="'.$i.'_attribute_bonus" class="'.$i.'_attribute" name="arr_attbonus[]" type="text" size="1" maxlength="2" value="'.$arr_attbonus[$i].'" /></td>
			<td class="input"><input id="'.$i.'_attribute_enhance" class="'.$i.'_attribute" name="arr_attenhance[]" type="text" size="1" maxlength="2" value="'.$arr_attenhance[$i].'" /></td>
			</tr>'; 
			//($arr_attvalue[$i] + $arr_attbonus[$i] + $arr_attenhance[$i])
			//<td class="main">'.$arr_attmod[$i]
		}
		?>
    </table>
    <br class="clearfloat" />

    <!-- left side div. skills on right -->
    <div class="fltlft">
    
      <!-- CLASS RECORDER ********************************************** -->
      <table>
        <tr>
          <td class="heading" colspan="2">Hit Points</td>
          <td class="heading" colspan="2">Class Name</td>
          <td class="heading" colspan="9">Class Recorder</td>
        </tr>
        <tr class="small">
          <td width="40px">HD</td>
          <td width="50px">HP</td>
          <td colspan="3">Class Name</td>
          <td>BAB</td>
          <td>Skills</td>
          <td>Fort</td>
          <td>Ref</td>
          <td>Will</td>
          <td>Levels</td>
        </tr>
        <?php
		// CLASSES INFO *****************************************************
		// Prepare Query for Classes table
		$query = 'SELECT ClassID, ClassName FROM Classes';
		// Perform Classes Query
		$result = mysqli_query($link,$query);
		//Get resulting rows from query
		$arr_classlistid = array();
		$arr_classlistname = array();
		while($row = mysqli_fetch_object($result))
		{
			$arr_classlistid[] = $row->ClassID;
			$arr_classlistname[] = $row->ClassName;
		} // end while
			
        foreach ($arr_classid as $i => $value) {
            echo '<tr><td class="dotted">d'.$arr_hd[$i].'</td><td class="dotted">'.$arr_hp[$i].'</td>
			<td colspan="3" class="dotted">
			<input class="hide" name="arr_classid[]" type="text" size="10" maxlength="20" value="'.$arr_classid[$i].'" />'.$arr_classname[$i].'</td>
					<td class="dotted">'.$arr_bab[$i].'</td><td class="dotted">'.$arr_classranks[$i].'</td><td class="dotted">'.$arr_classsaves[$i][$fort].'</td>
					<td class="dotted">'.$arr_classsaves[$i][$ref].'</td><td class="dotted">'.$arr_classsaves[$i][$will].'</td>
					<td class="input"><input class="box" name="arr_level[]" type="text" size="1" maxlength="2" value="'.$arr_level[$i].'" /></td>';
        }
        ?>
        <tr>
          <?php
			// insert 'add class' select input
			if (count($arr_classid) < 4) {
				echo '<tr><td class="blank" colspan="2"></td></td><td colspan="3">
						<select name="arr_classid[]">
						<option selected="selected" value="99">new class</option>';
	
				foreach ($arr_classlistid as $j => $value) {
					echo '<option value="'.$arr_classlistid[$j].'">'.$arr_classlistname[$j].'</option>';
				}
	
				echo '</select></td>
					<td class="blank" colspan="5"></td><td class="input"><input class="box" name="arr_level[]" type="text" size="1" maxlength="2" value="?" /></td>
					</tr>';
			}
			?>
          <td class="small">Con v</td>
          <td class="input"><input class="box" name="favoredhp" type="text" size="1" maxlength="2" value="<?php echo $favoredhp; ?>" /></td>
          <td class="small" colspan="4" style="text-align:center">< Favored Class Bonus > </td>
          <td class="input"><input class="box" name="favoredskill" type="text" size="1" maxlength="2" value="<?php echo $favoredskill; ?>" /></td>
          <td class="blank" colspan="4"></td>
        </tr>
        <tr>
          <td class="solid"><?php echo ($arr_attmod[$con]*$totallevel); ?></td>
          <td class="main"><?php echo $totalhp; ?></td>
          <td class="small" colspan="3" style="text-align:center">Totals</td>
          <td class="solid"><input id="total_bab" name="total_bab" class="blank" type="text" size="1" maxlength="2" value="<?php echo $totalbab ?>" readonly="readonly" /></td>
          <td class="solid"><?php echo $total_skill_ranks; ?></td>
          <td class="solid"><?php echo $arr_totalclasssaves[$fort]; ?></td>
          <td class="solid"><?php echo $arr_totalclasssaves[$ref]; ?></td>
          <td class="solid"><?php echo $arr_totalclasssaves[$will]; ?></td>
          <td class="main"><?php echo $totallevel; ?></td>
        </tr>
      </table>
      
      <!-- ATTACKS AND DEFENCE ********************************************** -->
      <table>
        <tr>
          <td class="heading" colspan="12">Attacks and Defense</td>
        </tr>
        <tr class="small">
          <td>Armor Class</td>
          <td>Total</td>
          <td style="width:10px"></td>
          <td>Armor</td>
          <td>Shield</td>
          <td>Dex</td>
          <td>Size</td>
          <td>Dodge</td>
          <td>Natural</td>
          <td>Deflect</td>
        </tr>
        <tr>
          <td class="title">AC</td>
          <td class="main">
		  	<input id="ac_total" name="ac_total" type="text" size="1" maxlength="2" value="<?php echo $totalac; ?>" readonly="readonly" /></td>
          <td class="small"  style="width:10px">=10+</td>
          <td class="dotted">
		  	<input id="ac_bonus" name="ac_bonus" type="text" size="1" maxlength="2" value="<?php echo $acbonus; ?>" readonly="readonly" /></td>
          <td class="dotted">
		  	<input id="ac_shield" name="ac_shield" type="text" size="1" maxlength="2" value="<?php echo $shieldacbonus; ?>" readonly="readonly" /></td>
          <td class="solid">
          	<input id="ac_dex_mod" name="ac_dex_mod" type="text" size="1" maxlength="2" value="<?php echo $arr_attmod[$dex]; ?>" readonly="readonly" /></td>
          <td class="dotted">
          	<input id="size_mod" name="size_mod" type="text" size="1" maxlength="2" value="<?php echo $sizemod ?>" readonly="readonly" /></td>
          <td class="input">
			<input id="ac_dodge" name="dodgebonus" class="ac" type="text" size="1" maxlength="2" value="<?php echo $dodgebonus; ?>" /></td>
          <td class="input">
          	<input id="ac_natural" name="naturalac" class="ac" type="text" size="1" maxlength="2" value="<?php echo $naturalac; ?>" /></td>
          <td class="input">
          	<input id="ac_deflect" name="deflectac" class="ac" type="text" size="1" maxlength="2" value="<?php echo $deflectac; ?>" /></td>
        </tr>
        <tr>
          <td class="title">Touch</td>
          <td class="main">
		  	<input id="touch_total" name="touch_total" type="text" size="1" maxlength="2" value="<?php echo $totaltouchac; ?>" readonly="readonly" /></td>
          <td class="small" style="width:10px">=10+</td>
          <td class="blank"></td>
          <td class="blank"></td>
          <td class="solid">
          	<input id="touch_dex_mod" name="touch_dex_mod" type="text" size="1" maxlength="2" value="<?php echo $arr_attmod[$dex]; ?>" readonly="readonly" /></td>
          <td class="dotted"><?php echo $sizemod; ?></td>
          <td class="dotted">
          	<input id="touch_dodge" name="touch_dodge" type="text" size="1" maxlength="2" value="<?php echo $dodgebonus; ?>" /></td>
          <td class="blank"></td>
          <td class="dotted">
          	<input id="touch_deflect" name="touch_deflect" type="text" size="1" maxlength="2" value="<?php echo $deflectac; ?>" /></td>
        </tr>
        <tr>
          <td class="title">Flat-foot</td>
          <td class="main">
          	<input id="ff_total" name="ff_total" type="text" size="1" maxlength="2" value="<?php echo $totalffac; ?>" readonly="readonly" /></td>
          <td class="small" style="width:10px">=10+</td>
          <td class="dotted">
		  	<input id="ff_bonus" name="ff_shield" type="text" size="1" maxlength="2" value="<?php echo $acbonus; ?>" readonly="readonly" /></td>
          <td class="dotted">
		  	<input id="ff_shield" name="ff_shield" type="text" size="1" maxlength="2" value="<?php echo $shieldacbonus; ?>" readonly="readonly" /></td>
          <td class="blank"></td>
          <td class="dotted"><?php echo $sizemod; ?></td>
          <td class="blank"></td>
          <td class="dotted">
          	<input id="ff_natural" name="ff_natural" type="text" size="1" maxlength="2" value="<?php echo $naturalac; ?>" readonly="readonly" /></td>
          <td class="dotted">
          	<input id="ff_deflect" name="ff_deflect" type="text" size="1" maxlength="2" value="<?php echo $deflectac; ?>" readonly="readonly" /></td>
        </tr>
        <tr class="small">
          <td colspan="2">Combat Maneuver Defense</td>
          <td style="width:10px"></td>
          <td>BAB</td>
          <td>Str</td>
          <td>Dex</td>
          <td>Size</td>
          <td>Bonus</td>
        </tr>
        <tr>
          <td class="title">CMD</td>
          <td class="main"><input id="total_cmd" name="total_cmd" class="cmd" type="text" size="1" maxlength="2" value="<?php echo $totalcmd ?>" readonly="readonly" /></td>
          <td class="small" style="width:10px">=10+</td>
          <td class="dotted"><?php echo $totalbab; ?></td>
          <td class="dotted"><input id="cmd_str_mod" name="cmd_str_mod" class="cmd" type="text" size="1" maxlength="2" value="<?php echo $arr_attmod[$str]; ?>" readonly="readonly" /></td>
          <td class="dotted"><input id="cmd_dex_mod" name="cmd_dex_mod" class="cmd" type="text" size="1" maxlength="2" value="<?php echo $arr_attmod[$dex]; ?>" readonly="readonly" /></td>
          <td class="dotted"><?php echo $sizemod; ?></td>
          <td class="input"><input id="cmdmod" name="cmdmod" class="cmd" type="text" size="1" maxlength="2" value="<?php echo $deflectac; ?>" /></td>
        </tr>
	  </table>
      <!-- CMD BONUSES ********************************************** -->
      <table>
        <tr class="small">
          <td colspan="6">Combat Maneuver Defense Bonuses</td>
        </tr>
        <tr>
          <td class="title">BullRush</td>
          <td class="input"><input id="bullrush_d" class="cmModifier" name="bullrush_d" type="text" size="1" maxlength="2" value="<?php echo $bullrush_d; ?>" /></td>
          <td class="title">Disarm</td>
          <td class="input"><input id="disarm_d" class="cmModifier" name="disarm_d" type="text" size="1" maxlength="2" value="<?php echo $disarm_d; ?>" /></td>
          <td class="title">Grapple</td>
          <td class="input"><input id="grapple_d" class="cmModifier" name="grapple_d" type="text" size="1" maxlength="2" value="<?php echo $grapple_d; ?>" /></td>
         </tr>
         <tr>
          <td class="title">Sunder</td>
          <td class="input"><input id="sunder_d" class="cmModifier" name="sunder_d" type="text" size="1" maxlength="2" value="<?php echo $sunder_d; ?>" /></td>
          <td class="title">Trip</td>
          <td class="input"><input id="trip_d" class="cmModifier" name="trip_d" type="text" size="1" maxlength="2" value="<?php echo $trip_d; ?>" /></td>
          <td class="title">Feint</td>
          <td class="input"><input id="feint_d" class="cmModifier" name="feint_d" type="text" size="1" maxlength="2" value="<?php echo $feint_d; ?>" /></td>
        </tr>
      </table>
      <!-- SECONDARY ARMOR STATS ********************************************** -->
      <table>
        <tr>
          <td class="title">ArmorPenalty</td>
          <td class="skill_main"><?php echo $effectiveskillpenalty; ?></td>
          <td class="blank" style="width:20px;"></td>
          <td class="title">Max Dex</td>
          <td class="skill_main"><?php if($effectivemaxdex > 9) { echo '-'; } else { echo $effectivemaxdex; } ?></td>
          <td class="blank" style="width:20px;"></td>
          <td class="title">Spell Fail</td>
          <td class="skill_main"><?php echo $effectivespellfail; ?></td>
        </tr>
      </table>
      <!-- SAVING THROWS ********************************************** -->
      <table>
        <tr class="small">
          <td>Saving Throws</td>
          <td>Total</td>
          <td>Class</td>
          <td>Ability</td>
          <td>Bonus</td>
          <td>Enhance</td>
          <td>Notes</td>
        </tr>
        <tr>
          <td class="title">Fortitude</td>
          <td class="main">
          	<input id="fort_total" name="fort_total" class="fort_save" type="text" size="1" maxlength="2" value="<?php echo $arr_totalsaveroll[$fort]; ?>" readonly="readonly" /></td>
          <td class="solid">
          	<input id="fort_class" name="fort_class" class="fort_save" type="text" size="1" maxlength="2" value="<?php echo $arr_totalclasssaves[$fort]; ?>" readonly="readonly" /></td>
          <td class="solid">
		  	<input id="fort_con_mod" name="fort_con_mod" class="fort_save" type="text" size="1" maxlength="2" value="<?php echo $arr_attmod[$con]; ?>" readonly="readonly" /></td>
          <td class="input">
          	<input id="fort_bonus" name="arr_savebonus[]" class="fort_save" type="text" size="1" maxlength="2" value="<?php echo $arr_savebonus[$fort]; ?>" /></td>
          <td class="input">
          	<input id="fort_mod" name="arr_savemod[]" class="fort_save" type="text" size="1" maxlength="2" value="<?php echo $arr_savemod[$fort]; ?>" /></td>
          <td>
          	<input name="arr_savenote[]" class="text" type="text" size="20" maxlength="50" value="<?php echo $arr_savenote[$fort]; ?>" /></td>
        </tr>
        <tr>
          <td class="title">Reflex</td>
          <td class="main">
		  	<input id="ref_total" name="ref_total" class="ref_save" type="text" size="1" maxlength="2" value="<?php echo $arr_totalsaveroll[$ref]; ?>" readonly="readonly" /></td>
          <td class="solid">
		  	<input id="ref_class" name="ref_class" class="ref_save" type="text" size="1" maxlength="2" value="<?php echo $arr_totalclasssaves[$ref]; ?>" readonly="readonly" /></td>
          <td class="solid">
		  	<input id="ref_dex_mod" name="ref_dex_mod" class="ref_save" type="text" size="1" maxlength="2" value="<?php echo $arr_attmod[$dex]; ?>" readonly="readonly" /></td>
          <td class="input">
          	<input id="ref_bonus" name="arr_savebonus[]" class="ref_save" type="text" size="1" maxlength="2" value="<?php echo $arr_savebonus[$ref]; ?>" /></td>
          <td class="input">
          	<input id="ref_mod" name="arr_savemod[]" class="ref_save" type="text" size="1" maxlength="2" value="<?php echo $arr_savemod[$ref]; ?>" /></td>
          <td class="notes">
          	<input name="arr_savenote[]" class="text" type="text" size="20" maxlength="50" value="<?php echo $arr_savenote[$ref]; ?>" /></td>
        </tr>
        <tr>
          <td class="title">Willpower</td>
          <td class="main">
		  	<input id="will_total" name="will_total" class="will_save" type="text" size="1" maxlength="2" value="<?php echo $arr_totalsaveroll[$will]; ?>" readonly="readonly" /></td>
          <td class="solid">
		  	<input id="will_class" name="will_class" class="will_save" type="text" size="1" maxlength="2" value="<?php echo $arr_totalclasssaves[$will]; ?>" readonly="readonly" /></td>
          <td class="solid">
		  	<input id="will_wis_mod" name="will_wis_mod" class="will_save" type="text" size="1" maxlength="2" value="<?php echo $arr_attmod[$wis]; ?>" readonly="readonly" /></td>
          <td class="input">
          	<input id="will_bonus" name="arr_savebonus[]" class="will_save" type="text" size="1" maxlength="2" value="<?php echo $arr_savebonus[$will]; ?>" /></td>
          <td class="input">
          	<input id="will_mod" name="arr_savemod[]" class="will_save" type="text" size="1" maxlength="2" value="<?php echo $arr_savemod[$will]; ?>" /></td>
          <td class="notes">
          	<input name="arr_savenote[]" class="text" type="text" size="20" maxlength="50" value="<?php echo $arr_savenote[$will]; ?>" /></td>
        </tr>
      </table>
      <!-- ATTACKS ********************************************** -->
      <table class="fltlft">
        <tr class="small">
          <td>Attacks</td>
          <td>Total</td>
          <td>BAB</td>
          <td>Ability</td>
          <td>Size</td>
          <!--<td>Notes</td>-->
        </tr>
        <tr>
          <td class="title">Melee</td>
          <td class="main">
		  	<input id="melee_total" name="melee_total" class="blank" type="text" size="1" maxlength="2" value="<?php echo $totalbab+$arr_attmod[$str]+$sizemod ?>" readonly="readonly" /></td>
          <td class="solid"><?php echo $totalbab ?></td>
          <td class="solid">
		  	<input id="melee_str_mod" name="melee_str_mod" class="blank" type="text" size="1" maxlength="2" value="<?php echo $arr_attmod[$str]; ?>" readonly="readonly" /></td>
          <td class="dotted"><?php echo $sizemod ?></td>
          <!--<td class="notes"><input name="melee_note" type="text" title="race" size="20" maxlength="20" /></td>-->
        </tr>
        <tr>
          <td class="title">Ranged</td>
          <td class="main">
		  	<input id="ranged_total" name="ranged_total" class="blank" type="text" size="1" maxlength="2" value="<?php echo $totalbab+$arr_attmod[$dex]+$sizemod ?>" readonly="readonly" /></td>
          <td class="solid"><?php echo $totalbab ?></td>
          <td class="solid">
		  	<input id="ranged_dex_mod" name="ranged_dex_mod" class="blank" type="text" size="1" maxlength="2" value="<?php echo $arr_attmod[$dex]; ?>" readonly="readonly" /></td>
          <td class="dotted"><?php echo $sizemod ?></td>
          <!--<td class="notes"><input name="ranged_note" type="text" title="race" size="20" maxlength="20" /></td>-->
        </tr>
        <tr class="small">
          <td colspan="2">Combat Maneuver Bonus</td>
          <td>BAB</td>
          <td>Str</td>
          <td>Size</td>
          <td>Bonus</td>
        </tr>
        <tr>
          <td class="title">CMB</td>
          <td class="main"><input id="total_cmb" name="total_cmb" class="cmb" type="text" size="1" maxlength="2" value="<?php echo $totalcmb ?>" readonly="readonly" /></td>
          <td class="solid"><?php echo $totalbab ?></td>
          <td class="solid">
          	<input id="cmb_str_mod" name="cmb_str_mod" class="cmb" type="text" size="1" maxlength="2" value="<?php echo $arr_attmod[$str]; ?>" readonly="readonly" /></td>
          <td class="dotted">
		  	<?php echo $sizemod ?></td>
          <td class="input"><input id="cmbmod" name="cmbmod" class="cmb"  type="text" size="1" maxlength="2" value="<?php echo $cmbmod; ?>" /></td>
          <!--<td class="notes"><input name="cmb_note" type="text" title="race" size="20" maxlength="20" /></td>-->
        </tr>
      </table>
      <!-- SECONDARY STATS -->
      <table>
        <tr>
          <td class="title">Initiative</td>
          <td class="main">
		  	<input id="init_total" name="init_total" type="text" size="1" maxlength="2" value="<?php echo $totalinit; ?>" readonly="readonly" /></td>
        </tr>
        <tr>
          <td class="small">Initiative Bonus</td>
          <td class="input">
          	<input id="init_bonus" name="initbonus" type="text" size="1" maxlength="2" value="<?php echo $initbonus; ?>" /></td>
        </tr>
        <tr>
          <td class="title">Move Speed</td>
          <td class="main"><?php echo $movementrate; ?></td>
        </tr>
        <tr>
          <td class="title">Spell Resist</td>
          <td class="input">
          	<input class="box" name="sr" type="text" size="1" maxlength="2" value="<?php echo $sr; ?>" /></td>
        </tr>
        <tr>
          <td class="title">Action Points</td>
          <td class="main">0</td>
        </tr>
      </table>
      <br class="clearfloat" />
      <!-- CMB BONUSES ********************************************** -->
      <table>
        <tr class="small">
          <td colspan="6">Combat Maneuver Attack Bonuses</td>
        </tr>
        <tr>
          <td class="title">BullRush</td>
          <td class="input"><input id="bullrush_b" class="cmModifier" name="bullrush_b" type="text" size="1" maxlength="2" value="<?php echo $bullrush_b; ?>" /></td>
          <td class="title">Disarm</td>
          <td class="input"><input id="disarm_b"class="cmModifier" name="disarm_b" type="text" size="1" maxlength="2" value="<?php echo $disarm_b; ?>" /></td>
          <td class="title">Grapple</td>
          <td class="input"><input id="grapple_b"class="cmModifier" name="grapple_b" type="text" size="1" maxlength="2" value="<?php echo $grapple_b; ?>" /></td>
         </tr>
         <tr>
          <td class="title">Sunder</td>
          <td class="input"><input id="sunder_b"class="cmModifier" name="sunder_b" type="text" size="1" maxlength="2" value="<?php echo $sunder_b; ?>" /></td>
          <td class="title">Trip</td>
          <td class="input"><input id="trip_b"class="cmModifier" name="trip_b" type="text" size="1" maxlength="2" value="<?php echo $trip_b; ?>" /></td>
          <td class="title">Feint</td>
          <td class="input"><input id="feint_b"class="cmModifier" name="feint_b" type="text" size="1" maxlength="2" value="<?php echo $feint_b; ?>" /></td>
        </tr>
      </table>
      
      <!-- ABILITIES ********************************************** -->
      <table>
        <tr>
          <td class="heading" colspan="3">Abilities</td>
        </tr>
        <?php
	  	$rowcounter = 0;
		if(isset($arr_raceability[0])) {
			echo '<tr class="small"><td>Racial</td></tr>';
			foreach ($arr_raceability as $i => $value) {
				// start row
				if ($rowcounter == 0) { echo '<tr>'; }
				// row content
				echo '<td class="ability">'.$arr_raceability[$i].'</td>';
				// end row
				if ($rowcounter == 2) { echo '</tr>'; }
	
				$rowcounter++;
				if ($rowcounter == 3)
					$rowcounter = 0;
			}
		}
		
	  	$rowcounter = 0;
		if(isset($arr_classability[0])) {
			echo '<tr class="small"><td>Class</td></tr>';
			foreach ($arr_classability as $i => $value) {
				// start row
				if ($rowcounter == 0) { echo '<tr>'; }
				// row content
				echo '<td class="ability">'.$arr_classability[$i].'</td>';
				// end row
				if ($rowcounter == 2) { echo '</tr>'; }
	
				$rowcounter++;
				if ($rowcounter == 3)
					$rowcounter = 0;
			}
		}

		
	  	$rowcounter = 0;
		if(isset($arr_factionability[0])) {
			echo '<tr class="small"><td>Faction</td></tr>';
			foreach ($arr_factionability as $i => $value) {
				// start row
				if ($rowcounter == 0) { echo '<tr>'; }
				// row content
				echo '<td class="ability">'.$arr_factionability[$i].'</td>';
				// end row
				if ($rowcounter == 2) { echo '</tr>'; }
	
				$rowcounter++;
				if ($rowcounter == 3)
					$rowcounter = 0;
			}
		}
		
        ?>
      </table>
      
      <!-- FEATS -->
      <table>
        <tr>
          <td class="heading" colspan="3">Feats (x<?php echo $feat_count; ?>)<input class="submit_right" type="submit" name="submit_select_feats" value="Select Feats" /></td>
        </tr>
        <?php
		include_once("includes/inc_character_query_feat.php");
	  	$rowcounter = 0;
		//foreach feat
		foreach ($arr_feat_id as $feat_counter => $value) {
			// start row
			if ($rowcounter == 0) { echo '<tr>'; }
			// row content
			echo '<td class="ability"><a href="feat_description.php?feat_id='.$arr_feat_id[$feat_counter].'" target="_feat" title="'.$arr_feat_desc[$feat_counter].'">'.$arr_feat_name[$feat_counter].'</a></td>';
			// end row
			if ($rowcounter == 2) { echo '</tr>'; }
			$rowcounter++;
			if ($rowcounter == 3)
				$rowcounter = 0;
		}
		?>
      </table>
    <!-- end left side div -->
    </div>
    
    <!-- right side div -->
    <div class="fltrt" style="width:332px;">
   
    <!-- SKILLS ********************************************** -->
    <table>
      <tr>
        <td class="heading" colspan="9">Skills, <?php echo $spentskillranks.'/'.$total_skill_ranks; ?> ranks spent</td>
      </tr>
      <tr class="small">
        <td colspan="4">Class <!--Trained--></td>
        <td>Total</td>
        <td>Ranks</td>
        <td>Bonus</td>
        <td colspan="2">Enhance</td>
      </tr>
      <?php
		$skill_print_line = "";
		foreach ($arr_skillid as $i => $value) {
			if (($arr_skillid[$i] < 13 OR $arr_skillid[$i] > 22) OR ($arr_skillranks[$i] > 0)) {
				$skill_print_line = '<tr>';
			}
			else {
				$skill_print_line = '<tr class="hide">';
			}
			$skill_print_line .= '<td class="skill_title" colspan="4">';

			// class skill checked image			
			if ($arr_classskill[$i] == true) {
				$skill_print_line .= '<img src="./images/graphic/checked_box.png" width="14" height="15" alt="" />';
			}
			else {
				$skill_print_line .= '<img src="./images/graphic/empty_box.png" width="14" height="15" alt="" />';
			}
			/*
			// trained skill checked image
			if ($arr_classskill[$i] == true && $arr_skillranks[$i] > 0) {
				$skill_print_line .= '<img src="./images/graphic/checked_box.png" width="14" height="15" alt="" />';
			}
			else { 
				$skill_print_line .= '<img src="./images/graphic/empty_box.png" width="14" height="15" alt="" />';					
			}
			*/
			$skill_print_line .= $arr_skillname[$i].'</td>
				<td class="skill_main">
					<input id="'.$i.'_skill_total" class="blank" name="'.$i.'_skill_total" type="text" size="1" maxlength="2" value="'.$arr_skilltotalroll[$i].'" readonly="readonly" />
				</td>
				<td class="skill_input">
					<input id="'.$i.'_skill_rank" class="skill" name="arr_skillranks[]" type="text" size="1" maxlength="2" value="'.$arr_skillranks[$i].'" />
				</td>';
			$skill_print_line .= '<td class="skill_input">
					<input id="'.$i.'_skill_bonus" class="skill" name="arr_skillbonus[]" type="text" size="1" maxlength="2" value="'.$arr_skillbonus[$i].'" />
				</td>
				<td class="skill_input">
					<input id="'.$i.'_skill_enhance" class="skill" name="arr_skillenhance[]" type="text" size="1" maxlength="2" value="'.$arr_skillenhance[$i].'" />
				</td>
				<td class="small" style="width:40px;">'.$arr_skillattshortname[$i].'+
					<input id="'.$i.'_skill_attribute_bonus" name="'.$arr_skillatt[$i].'_skill_attribute_id" class="skill" style="width:10px;" type="text" value="'.$arr_attmod[$arr_skillatt[$i]].'" readonly="readonly" /></td></tr>';
			
			echo $skill_print_line;
		}
	?>
    </table>
    <p class="page"></p>
    <!-- DR / RESISTANCE -->
    <table>
      <tr>
        <td class="title">Damage Reduction</td>
        <td class="input"><input class="box" name="dr" type="text" size="25" maxlength="50" value="<?php echo $dr; ?>" /></td>
      </tr>
      <tr>
        <td class="heading" colspan="2">Resistances</td>
      <tr>
        <?php
			$rowcounter = 0;
			for ($i = 0; $i <= 5; $i++) {
				
				// start row
				if ($rowcounter == 0)
					echo '<tr>';

				echo '<td><input name="arr_resistance[]" class="text" type="text" size="25" maxlength="50" value="';	
							
				if(isset($arr_resistance[$i]))
					echo $arr_resistance[$i];
				
				echo '"></td>';
				 
				// end row
				if ($rowcounter == 1)
					echo '</tr>';
			
				$rowcounter++;
				if ($rowcounter == 2)
					$rowcounter = 0;
			}
		?>
    </table>
    <!-- PROFICIENCIES -->
    <table>
      <tr>
        <td class="heading" colspan="2">Proficiencies</td>
      <tr>
        <?php
			$rowcounter = 0;
			for ($i = 0; $i <= 7; $i++) {
				
				// start row
				if ($rowcounter == 0)
					echo '<tr>';

				echo '<td><input name="arr_proficiency[]" class="text" type="text" size="25" maxlength="50" value="';	
							
				if(isset($arr_proficiency[$i]))
					echo $arr_proficiency[$i];
				
				echo '"></td>';
				 
				// end row
				if ($rowcounter == 1)
					echo '</tr>';
			
				$rowcounter++;
				if ($rowcounter == 2)
					$rowcounter = 0;
			}
		?>
    </table>
    <!-- SPECIAL ABILITIES -->
    <table>
      <tr>
        <td class="heading" colspan="2">Special Abilities<input class="submit_right" type="submit" name="submit_edit_ability" value="Edit Ability Descriptions" /></td>
      <tr>
        <?php
			$rowcounter = 0;
			for ($i = 0; $i <= 7; $i++) {
				
				// start row
				if ($rowcounter == 0)
					echo '<tr>';

				echo '<td>
					<input name="arr_special_ability_desc[]" type="hidden" value="';

				if(isset($arr_special_ability_desc[$i]))
					echo $arr_special_ability_desc[$i];
					
					echo '">';
					
				echo '<input name="arr_special_ability[]" class="text" type="text" size="25" maxlength="50" value="';
							
				if(isset($arr_special_ability[$i]))
					echo $arr_special_ability[$i];
				
				echo '"></td>';
				 
				// end row
				if ($rowcounter == 1)
					echo '</tr>';
			
				$rowcounter++;
				if ($rowcounter == 2)
					$rowcounter = 0;
			} //end for i
		?>
    </table>
    <!-- end right side div -->
    </div>
    <br class="clearfloat" />
    <!-- ARMOR AND SHIELD ********************************************** -->
    <table>
      <tr>
        <td class="heading" colspan="11">Armor and Shield<input class="submit_right" type="submit" name="update" value="Update Equipment" /></td>
      </tr>
      <tr class="small">
        <td>Name</td>
        <td>Enhance</td>
        <td>AC</td>
        <td>MaxDex</td>
        <td>Penalty</td>
        <td>SplFail</td>
        <td>Type</td>
        <td>Size</td>
        <td>Material</td>
        <td>Info</td>
        <td>Remove</td>
      </tr>
      <?php
		//************************
		//ARMOR
        if(isset($armorid)) {
            echo '<tr><td class="ability">'.$armorname.'</td>
            <td class="input">
			<input class="hide" name="armorid" type="text" size="1" maxlength="2" value="'.$armorid.'" />
            <input class="box" name="armorenhance" type="text" size="1" maxlength="2" value="'.$armorenhance.'" />
            </td>
            <td class="dotted">'.$acbonus.'</td><td class="dotted">';
			if($maxdex > 9) { echo '-'; } else { echo $maxdex; }
			echo '</td><td class="dotted">'.$skillpenalty.'</td><td class="dotted">'.$spellfail.'</td><td class="dotted">'.$armortype.'</td><td class="dotted">'.$armorsize.'</td><td class="dotted">'.$material.'</td>';
			
			//TOGGLE BUTTON for armor notes and extra info
			echo '<td><img id="toggle_armor_info" 
					style="cursor: pointer;	cursor: hand;" 
					src="./images/graphic/expand_arrow.png" 
					onclick="ShowHide(\'armor_info\', \'toggle_armor_info\')" />
					</td>';
			//DELETE CHECKBOX for armor
			echo '<td><input name="delete_armor_shield[]" type="checkbox" value="'.$armorid.'" />
					</td></tr>';
			//ROW extra info, HIDDEN div
			echo '<tr class="blank"><td class="blank" colspan="11">';
			echo '<div name="armor_info" class="hide">';
			if($armornotes == '') {
				echo '<input class="text" name="armornotes" type="text" size="69" maxlength="200" value="notes" />';
			}
			else {
				echo '<input class="text" style="width:500px;" name="armornotes" type="text" size="69" maxlength="200" value="'.$armornotes.'" />';
			}
			echo ' AC Mod:<input class="input" name="ac_mod" type="text" size="1" maxlength="2" value="'.$ac_mod.'" />';
			echo ' <span class="dotted">Master Work 
				<input name="armor_mw" type="checkbox" value="1" ';
				if($armor_mw == true) { echo ' checked="checked"'; }
			echo '" /></span>';
			//close ROW
			echo '</div></td></tr>';
        } //end if isset armor
		
		//************************
		//SHIELD
		if(isset($shieldarmorid)) {
            echo '<tr><td class="ability">'.$shieldarmorname.'</td>
            <td class="input">	
			<input class="hide" name="shieldarmorid" type="text" size="1" maxlength="2" value="'.$shieldarmorid.'" />			
            <input class="box" name="shieldarmorenhance" type="text" size="1" maxlength="2" value="'.$shieldarmorenhance.'" />
            </td>
            <td class="dotted">'.$shieldacbonus.'</td><td class="dotted">';
			if($shieldmaxdex > 9) { echo '-'; } else { echo $shieldmaxdex; }
			echo '</td><td class="dotted">'.$shieldskillpenalty.'</td><td class="dotted">'.$shieldspellfail.'</td><td class="dotted">'.$shieldarmortype.'</td><td class="dotted">'.$shieldarmorsize.'</td><td class="dotted">'.$shieldmaterial.'</td>';
			
			//TOGGLE BUTTON for shield notes and extra info
			echo '<td><img id="toggle_shield_info" 
					style="cursor: pointer;	cursor: hand;" 
					src="./images/graphic/expand_arrow.png" 
					onclick="ShowHide(\'shield_info\', \'toggle_shield_info\')" />
					</td>';
			//DELETE CHECKBOX for shield
			echo '<td><input name="delete_armor_shield[]" type="checkbox" value="'.$shieldarmorid.'" />
					</td></tr>';
			//ROW extra info, HIDDEN div
			echo '<tr class="blank"><td class="blank" colspan="11">';
			echo '<div name="shield_info" class="hide">';
			if($shieldnotes == '') {
				echo '<input class="text" style="width:500px;" name="shieldnotes" type="text" size="69" maxlength="200" value="notes" />';
			}
			else {
				echo '<input class="text" style="width:500px;" name="shieldnotes" type="text" size="69" maxlength="50" value="'.$shieldnotes.'" />';
			}
			echo ' AC Mod:<input class="input" name="shield_ac_mod" type="text" size="1" maxlength="2" value="'.$shield_ac_mod.'" />';
			echo ' <span class="dotted">Master Work 
				<input name="shieldarmor_mw" type="checkbox" value="1" ';
				if($shieldarmor_mw == true) { echo ' checked="checked"'; }
			echo '" /></span>';
			//close ROW
			echo '</div></td></tr>';
		} //end if isset shield
		
		// CHANGE ARMOR SELECT BOX *****************************************************
		// Prepare Query for Armor table
		$query = 'SELECT ArmorID, ArmorName FROM Armor WHERE Shield=FALSE';
		// Perform Classes Query
		$result = mysqli_query($link,$query);
		//Get resulting rows from query
		$arr_armorlistid = array();
		$arr_armorlistname = array();
		while($row = mysqli_fetch_object($result))
		{
			$arr_armorlistid[] = $row->ArmorID;
			$arr_armorlistname[] = $row->ArmorName;
		} // end while
  
		// insert 'add armor' select input
		echo '<tr><td class="blank">
				<select name="armorid_new">
				<option selected="selected" value="-1">change armor</option>';

		foreach ($arr_armorlistid as $j => $value) {
			echo '<option value="'.$arr_armorlistid[$j].'">'.$arr_armorlistname[$j].'</option>';
		}
		
		echo '</select></td>';
		// add armor enhancement bonus input
		// echo '<input class="box" name="armorenhance_new" type="text" size="1" maxlength="2" value="0" />';
				
		// CHANGE SHIELD SELECT BOX *****************************************************
		// Prepare Query for Armor table
		$query = 'SELECT ArmorID, ArmorName FROM Armor WHERE Shield=TRUE';
		// Perform Classes Query
		$result = mysqli_query($link,$query);
		//Get resulting rows from query
		$arr_shieldlistid = array();
		$arr_shieldlistname = array();
		while($row = mysqli_fetch_object($result))
		{
			$arr_shieldlistid[] = $row->ArmorID;
			$arr_shieldlistname[] = $row->ArmorName;
		} // end while
  
		// insert 'add armor' select input
		echo '<td class="blank" colspan="3">
				<select name="shieldid_new">
				<option selected="selected" value="-1">change shield</option>';

		foreach ($arr_shieldlistid as $j => $value) {
			echo '<option value="'.$arr_shieldlistid[$j].'">'.$arr_shieldlistname[$j].'</option>';
		}
		
		echo '</select><td colspan="7" class="hide"><input class="submit_right" type="submit" name="update" value="Update and Save" /></td></tr>';
		// add shield enhancement bonus input
		//echo '<input class="box" name="shieldenhance_new" type="text" size="1" maxlength="2" value="0" />';
	?>
    </table>
    <br class="clearfloat" />
    <!-- WEAPONS ********************************************** -->
    <table>
      <tr>
        <td class="heading" colspan="13">Weapons and Attacks</td>
      </tr>
      <tr class="small">
        <td>Name</td>
        <td>Enhance</td>
        <td>Attack(s)</td>
        <td>Damage</td>
        <td>Crit</td>
        <td>Range</td>
        <td>Size</td>
        <td>Type</td>
        <td>Info</td>
        <td>Equiped</td>
        <td>Off-hand</td>
        <td>Remove</td>
      </tr>
      <?php 
  
	foreach ($arr_weaponname as $i => $value) {
		//weapon name / enhance
		if($arr_customname[$i] != '') {
			echo '<tr><td class="blank">
					<input class="text" name="arr_customname[]" type="text" size="40" maxlength="40" value="'.$arr_customname[$i].'" />
				</td>';
		} //end if
		else {
			echo '<tr><td class="ability">'.$arr_weaponname[$i].'</td>';
		} //end else
		echo '<td class="input">
				<input class="hide" name="arr_weaponid[]" type="text" size="1" maxlength="2" value="'.$arr_weaponid[$i].'" />
				<input class="box" name="arr_weaponenhance[]" type="text" size="1" maxlength="2" value="'.$arr_weaponenhance[$i].'" />
			</td>';
		//attacks
		echo '<td class="dotted">+'.$arr_totalattack[$i][0];
		for($j = 1; $j < 5; $j++) {
			if($arr_totalattack[$i][$j] > 0) { echo '/+'.$arr_totalattack[$i][$j]; }
		}
		echo '</td>';
		//damage
		echo '<td class="dotted">'.$arr_damagedienum[$i].'d'.$arr_damagedietype[$i];
		if ($arr_totaldamgemod[$i] > 0) { echo '+'.$arr_totaldamgemod[$i]; }
		//crit
		echo '</td><td class="dotted">';
		if ($arr_critrange[$i] == 0) { echo '20'; }
		else { echo 20-$arr_critrange[$i].'-20'; }
		echo 'x'.$arr_critmult[$i].'</td><td class="dotted">';
		//range
		if ($arr_rangebase[$i] > 0) { echo $arr_rangebase[$i].'/'.($arr_rangebase[$i]*2).'/'.($arr_rangebase[$i]*3); }
		else { echo 'n/a'; }
		//size
		echo '</td><td class="dotted">'.$arr_weaponsize[$i].'</td><td class="dotted">'.$arr_damagetype[$i].'</td>';
		//TOGGLE BUTTON for weapon notes and extra info
		echo '<td><img id="toggle_weapon_info'.$i.'" 
				style="cursor: pointer;	cursor: hand;" 
				src="./images/graphic/expand_arrow.png" 
				onclick="ShowHide(\'weapon_info'.$i.'\', \'toggle_weapon_info'.$i.'\')" />
				</td>';
		//EQUIPPED CHECKBOX for weapon
		echo '<td><input name="equip_weapon'.$i.'" type="checkbox" value="1" '.($arr_equipped[$i] == 1?'checked="checked"':'').'/>
				</td>';
		//OFFHAND EQUIP CHECKBOX for weapon
		echo '<td><input name="offhand_weapon'.$i.'" type="checkbox" value="1" '.($arr_offhand[$i] == 1?'checked="checked"':'').'/>
				</td>';
		//DELETE CHECKBOX for weapon
		echo '<td><input name="delete_weapon[]" type="checkbox" value="'.$arr_weaponid[$i].' "/>
				</td></tr>';
		//ROW extra info, HIDDEN div
		echo '<tr class="blank"><td class="blank" colspan="10">';
		echo '<div name="weapon_info'.$i.'" class="hide">';
		//if custom name is not set
		if($arr_customname[$i] == '') {
			//supply with textbox to enter custom name
			echo '<input class="text" name="arr_customname[]" type="text" size="27" maxlength="50" value="custom name" />';
		} //end if
		else {
			//else show weapons default name e.i.'Longsword'
			echo '<input class="ability" name="nothing" type="text" size="27" maxlength="50" value="Weapon Type: '.$arr_weaponname[$i].'" readonly="readonly"/>';
		}

		echo '<span class="dotted">Use dex to hit 
			<input name="use_dex'.$i.'" type="checkbox" value="1"';
				if($arr_usedex[$i] == true) { echo ' checked="checked"'; }
		echo '" /></span>';
		echo '<span class="dotted">Flurry / rapid attack 
				<input name="flurry'.$i.'" type="checkbox" value="1" ';
				if($arr_flurry[$i] == true) { echo ' checked="checked"'; }
		echo '" /></span>';
		echo '<span class="dotted"> Master Work 
			<input name="weapon_mw'.$i.'" type="checkbox" value="1" ';
			if($arr_weapon_mw[$i] == true) { echo ' checked="checked"'; }
		echo '" /></span>';
		echo '<span class="dotted"> 2 Handed 
			<input name="arr_twohand'.$i.'" type="checkbox" value="1" ';
			if($arr_twohand[$i] == true) { echo ' checked="checked"'; }
		echo '" /></span>';

		//close ROW weapon info
		echo '</div></td></tr>';
		
		//ROW weapon notes bonuses, HIDDEN div
		echo '<tr class="blank"><td class="blank" colspan="10"><div name="weapon_info'.$i.'" class="hide" style="width:100%;">';
		if($arr_weaponnotes[$i] == '') {
			echo '<input class="text" style="width:500px;" name="arr_weaponnotes[]" type="text" size="64" maxlength="200" value="notes" />';
		}
		else {
			echo '<input class="text" style="width:500px;" name="arr_weaponnotes[]" type="text" size="64" maxlength="200" value="'.$arr_weaponnotes[$i].'" />';
		}
		echo ' Hit Mod:<input class="weapon_hit_bonus" name="arr_hitbonus[]" type="text" size="1" maxlength="2" value="'.$arr_hitbonus[$i].'" />';
		echo ' Damage Mod:<input class="weapon_damage_bonus" name="arr_damagebonus[]" type="text" size="1" maxlength="2" value="'.$arr_damagebonus[$i].'" />';
		echo ' Crit Range Bonus:<input name="arr_crit_range_bonus[]" type="text" size="1" maxlength="2" value="'.$arr_crit_range_bonus[$i].'" />';
		//close ROW weapon notes
		echo '<br/><br/></div></td></tr>';
		
	} //end foreach weapon_name
	
	// ADD WEAPON SELECT BOX *****************************************************
	// Prepare Query for Weapon table
	$query = 'SELECT WeaponID, WeaponName FROM Weapon';
	// Perform Weapon Query
	$result = mysqli_query($link,$query);
	//Get resulting rows from query
	$arr_weaponlistid = array();
	$arr_weaponlistname = array();
	while($row = mysqli_fetch_object($result))
	{
		$arr_weaponlistid[] = $row->WeaponID;
		$arr_weaponlistname[] = $row->WeaponName;
	} // end while
	// insert 'add weapon' select input
	echo '<tr><td class="blank">
			<select name="weaponid_new">
			<option selected="selected" value="-1">add weapon</option>';

	foreach ($arr_weaponlistid as $j => $value) {
		echo '<option value="'.$arr_weaponlistid[$j].'">'.$arr_weaponlistname[$j].'</option>';
	}
	
	echo '</select></td><td colspan="9" class="hide"><input class="submit_right" type="submit" name="update" value="Update and Save" /></td></tr>';
	?>
    </table>
    <br class="clearfloat" />
    <?php
		//qury character equipment
		include_once("includes/inc_character_query_equipment.php");
		// PREPARE DATA FOR EQUIPMENT SELECTION BOXES *****************************************************
		// Prepare Query for Equipment table
		$query = 'SELECT EquipID, EquipName, Magical, Description FROM Equipment';
		// Perform Weapon Query
		$result = mysqli_query($link,$query);
		//Get resulting rows from query
		$arr_equipment_list_id = array();
		$arr_equipment_list_name = array();
		$arr_equipment_list_magic = array();
		$arr_equipment_list_desc = array();	
		while($row = mysqli_fetch_object($result))
		{
			$arr_equipment_list_id[] = $row->EquipID;
			$arr_equipment_list_name[] = $row->EquipName;
			$arr_equipment_list_magic[] = $row->Magical;
			$arr_equipment_list_desc[] = $row->Description;		
		} // end while
    ?>
    <table class="fltlft">
      <tr>
        <td class="heading">Equipment</td>
      </tr>
      <?php 
		for($i=0; $i < 9; $i++) {
			// insert select input
			echo '<tr><td class="blank">
				<select name="equip_id[]">';
			echo '<option value="99"></option>';
			foreach ($arr_equipment_list_id as $j => $value) {
				if($arr_equipment_list_magic[$j] == false) {
					echo '<option ';
					if(isset($arr_equip_id[$i])) {
						if($arr_equip_id[$i] == $arr_equipment_list_id[$j]) {
							echo 'selected="selected" ';
						} //end if selected
					} //end if isset
					echo 'value="'.$arr_equipment_list_id[$j].'">'.$arr_equipment_list_name[$j].'</option>';
				} //end if not magic
			} //end foreach j
			echo '</select></td></tr>'.PHP_EOL;
		} //end for i
		?>
    </table>
    <table class="fltlft">
      <tr>
        <td class="heading">Magical Equipment</td>
      </tr>
      <?php 
	  			for($i=0; $i < 9; $i++) {
			// insert select input
			echo '<tr><td class="blank">
				<select name="equip_id_magic[]">';
			echo '<option value="99"></option>';
			foreach ($arr_equipment_list_id as $j => $value) {
				if($arr_equipment_list_magic[$j] == true) {
					echo '<option ';
					if(isset($arr_equip_id_magic[$i])) {
						if($arr_equip_id_magic[$i] == $arr_equipment_list_id[$j]) {
							echo 'selected="selected" ';
						} //end if selected
					} //end if isset
					echo 'value="'.$arr_equipment_list_id[$j].'">'.$arr_equipment_list_name[$j].'</option>';
				} //end if not magic
			} //end foreach j
			echo '</select></td></tr>'.PHP_EOL;
		} //end for i
		?>
    </table>
    <table class="fltlft">
      <tr>
        <td class="heading" colspan="2">Worn Equipment</td>
      </tr>
      <tr class="small">
        <td colspan="2">Equipment Slots for Magical Items</td>
      </tr>
      <tr>
        <td class="small">Head</td>
        <td class="ability"></td>
      </tr>
      <tr>
        <td class="small">Face</td>
        <td class="ability"></td>
      </tr>
      <tr>
        <td class="small">Throat</td>
        <td class="ability"></td>
      </tr>
      <tr>
        <td class="small">Shoulders</td>
        <td class="ability"></td>
      </tr>
      <tr>
        <td class="small">Body</td>
        <td class="ability"></td>
      </tr>
      <tr>
        <td class="small">Torso</td>
        <td class="ability"></td>
      </tr>
      <tr>
        <td class="small">Arms</td>
        <td class="ability"></td>
      </tr>
      <tr>
        <td class="small">Hands</td>
        <td class="ability"></td>
      </tr>
      <tr>
        <td class="small">Ring</td>
        <td class="ability"></td>
      </tr>
      <tr>
        <td class="small">Ring</td>
        <td class="ability"></td>
      </tr>
      <tr>
        <td class="small">Waist</td>
        <td class="ability"></td>
      </tr>
      <tr>
        <td class="small">Feet</td>
        <td class="ability"></td>
      </tr>
    </table>
    <br class="clearfloat" />
    <!-- SPELL / ABILITY SAVE DCS ********************************************** -->
    <?php
	if($total_asp > 0 || $total_dsp > 0) {
		echo <<<EOT
		<table class="fltlft">
			<tr>
				<td class="heading" colspan="5">Spell Points</td>
			</tr>
			<tr class="small">
				<td class="blank"></td><td>Class</td><td>Attr.</td><td>Bonus</td><td>Total</td>
			</tr>
EOT;
		if($total_asp > 0) {
			$total_class_asp = 0;
			foreach($arr_class_asp as $class_counter => $value)
				$total_class_asp += $arr_class_asp[$class_counter];
			echo <<<EOT
			<tr>
				<td class="title">Arcane SP</td>
				<td class="dotted">$total_class_asp</td>
				<td class="dotted">$asp_attribute_bonus</td>
				<td class="input"><input id="asp_bonus" name="asp_bonus" class="asp" type="text" size="1" maxlength="2" value="$asp_bonus" /></td>
				<td class="dotted">$total_asp</td>
				</td>
			</tr>
EOT;
		} //end if has arcane sp
		if($total_dsp > 0 ) {
			$total_class_dsp = 0;
			foreach($arr_class_dsp as $class_counter => $value)
				$total_class_dsp += $arr_class_dsp[$class_counter];
			echo <<<EOT
			<tr>
				<td class="title">Divine SP</td>
				<td class="dotted">$total_class_dsp</td>
				<td class="dotted">$dsp_attribute_bonus</td>
				<td class="input"><input id="dsp_bonus" name="dsp_bonus" class="dsp" type="text" size="1" maxlength="2" value="$dsp_bonus" /></td>
				<td class="dotted">$total_dsp</td>
				</td>
			</tr>
EOT;
		} //end if has divine sp
		 echo '</table>';

	} //end if has spell points
     ?>
    <table>
      <tr>
        <td class="heading" colspan="11">Spell / Ability Saving Throw DCs</td>
      </tr>
      <tr class="small">
	    <td>Mod</td>
        <td>0</td>
        <td>1st</td>
        <td>2nd</td>
        <td>3rd</td>
        <td>4rth</td>
        <td>5th</td>
        <td>6th</td>
        <td>7th</td>
        <td>8th</td>
        <td>9th</td>
      </tr>
      <tr>
        <td class="main">Int</td>
		<?php
        	for ($i = 0; $i < 10; $i++) {
				echo '<td class="dotted">
						<input id="ability_3_level_'.$i.'" name="ability_dc" type="text" size="1" maxlength="2" value="'.($i + 10 + $arr_attmod[$int]).'" readonly="readonly" />
					</td>';
			} //end for i
		?>
      </tr>
      <tr>
        <td class="main">Wis</td>
        <?php
        	for ($i = 0; $i < 10; $i++) {
				echo '<td class="dotted">
						<input id="ability_4_level_'.$i.'" name="ability_dc" type="text" size="1" maxlength="2" value="'.($i + 10 + $arr_attmod[$wis]).'" readonly="readonly" />
					</td>';
			} //end for i
		?>
      </tr>
      <tr>
        <td class="main">Cha</td>
        <?php
        	for ($i = 0; $i < 10; $i++) {
				echo '<td class="dotted">
						<input id="ability_5_level_'.$i.'" name="ability_dc" type="text" size="1" maxlength="2" value="'.($i + 10 + $arr_attmod[$cha]).'" readonly="readonly" />
					</td>';
			} //end for i
		?>
      </tr>
    </table>
    <!-- SPELL LISTS ********************************************** -->
    <?php
		include_once("includes/inc_character_query_spell.php");
		//foreach class
		foreach ($arr_classid as $class_counter => $value) {
			//if class magic != "None"
			// find classes with spell lists
			if($arr_class_magic[$class_counter] != 'none') {
				//display class name and button to select spells
				echo '<div class="spell_list"><p class="heading">'.$arr_classname[$class_counter].' Spells
					<input class="submit_right" type="submit" name="submit_spells'.$arr_classid[$class_counter].'" value="Select '.$arr_classname[$class_counter].' Spells" /></p>
					<br class="clearfloat" />';
				//if character knows any spells
				if(isset($arr_spell_id)) {
					//display list of spells by spell level, each list in its div 'spell_level'
					//get lowest and highest spell level of known spells for current class
					$lowest_level = 9;
					$highest_level = -1;
					foreach($arr_spell_id as $spell_counter => $value) {
						if ($arr_spell_level[$spell_counter] < $lowest_level && $arr_learned_class_id[$spell_counter] == $arr_classid[$class_counter]) {
							$lowest_level = $arr_spell_level[$spell_counter];
						} //end if lowest level
						if ($arr_spell_level[$spell_counter] > $highest_level && $arr_learned_class_id[$spell_counter] == $arr_classid[$class_counter]) {
							$highest_level = $arr_spell_level[$spell_counter];
						} //end if higher level
					} //end foreach known spell
					//SHOW SPELLS FOR EACH SPELL LEVEL
					$column_counter = 1;
					for($spell_level_counter = $lowest_level; $spell_level_counter <= $highest_level; $spell_level_counter++) {
						echo "<div class='spell_level_list'><p>Level ".$spell_level_counter."</p>";
						//loop through known spells, display spells for this class / spell level in list
						foreach ($arr_spell_id as $known_spell_counter => $value) {
							if($arr_learned_class_id[$known_spell_counter] == $arr_classid[$class_counter] && $arr_spell_level[$known_spell_counter] == $spell_level_counter) {
							echo '<p><a href="spell_description.php?spell_id='.$arr_spell_id[$known_spell_counter].'" target="_spell" title="'.$arr_spell_desc[$known_spell_counter].'">'.$arr_spell_name[$known_spell_counter].'</a></p>';
							} //end if arr_learned_class_id
						} //end foreach spell
						echo '</div>'; //close spell_level div
						if($column_counter == 4) {
							echo '<br class="clearfloat" />';
							$column_counter = 1;
						}
						$column_counter++;
					} //end for spell_level
				} //end if isset arr_spell_id
				echo '<br class="clearfloat" />';
				echo '</div>'; //end div "spell_list"
			} //end if class_magic != None
		} //end foreach classid
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