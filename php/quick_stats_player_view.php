<link href="css/quick_stats_view.css" rel="stylesheet" type="text/css" />

<?php
	include_once("../includes/inc_connect.php");
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();

	//data (false makes it an object, true is array)
	$data = json_decode($_POST['data'], false);
	$quick_stats = $data->character_stats;

	echo "<h1>".$quick_stats->character_name."</h1>";
	//CHARACTER PICTURE
	//float right characters full picture
	echo '<div id="full_pic" style="float:none; width:auto;">';
	echo '<img src="./images/char/full/'.$quick_stats->full_pic_file_name.'" alt="'.$quick_stats->character_name.'" width="'.$quick_stats->full_pic_width.'" height="'.$quick_stats->full_pic_height.'" />';
	echo '</div>';
	
	echo '<div id="left_column">';

	//STATS
	//echo "<h2>Stats</h2>";
	echo "<div class='box'>";
	echo ' Alignment <select name="align_chaos_id">
			<option '; if ($quick_stats->align_chaos_id == 0) { echo 'selected="selected" '; } echo 'value="0">Lawful</option>
			<option '; if ($quick_stats->align_chaos_id == 1) { echo 'selected="selected" '; } echo 'value="1">Neutral</option>
			<option '; if ($quick_stats->align_chaos_id == 2) { echo 'selected="selected" '; } echo 'value="2">Chaotic</option>
			</select>';
	echo '<select name="align_good_id">
			<option '; if ($quick_stats->align_good_id == 0) { echo 'selected="selected" '; } echo 'value="0">Good</option>
			<option '; if ($quick_stats->align_good_id == 1) { echo 'selected="selected" '; } echo 'value="1">Neutral</option>
			<option '; if ($quick_stats->align_good_id == 2) { echo 'selected="selected" '; } echo 'value="2">Evil</option>
			</select></p>';
	echo "</div><br class='clearfloat' />"; //end box
	
	echo "<div class='group_box'>";
		echo "<div class='box'>";
		echo "<h3>Attribute Mods</h3>";
		echo "<p>Strength <input type='text' size='3' name='str_mod' value='".$quick_stats->str_mod."' /></p>";
		echo "<p>Dexterity <input type='text' size='3' name='dex_mod' value='".$quick_stats->dex_mod."' /></p>";
		echo "<p>Constitution <input type='text' size='3' name='con_mod' value='".$quick_stats->con_mod."' /></p>";
		echo "<p>Intelligence <input type='text' size='3' name='int_mod' value='".$quick_stats->int_mod."' /></p>";
		echo "<p>Wisdom <input type='text' size='3' name='wis_mod' value='".$quick_stats->wis_mod."' /></p>";
		echo "<p>Charisma <input type='text' size='3' name='cha_mod' value='".$quick_stats->cha_mod."' /></p>";
		echo "</div><br />"; //end box
		
		echo "<div class='box'>";
		echo "<h3>Armor Class</h3>";
		echo "<p>Armor Class <input type='text' size='3' name='ac' value='".$quick_stats->ac."' /></p>";
		echo "<p>~ Touch AC <input type='text' size='3' name='touch' value='".$quick_stats->touch."' /></p>";
		echo "<p>~ Flat Ft. <input type='text' size='3' name='flat_footed' value='".$quick_stats->flat_footed."' /></p>";
		echo "</div><br />"; //end box
		
		echo "<div class='box'>";
		echo "<h3>Secondary</h3>";
		echo "<p>Initiative <input type='text' size='3' name='initiative' value='".$quick_stats->initiative."' /></p>";
		echo "<p>Damage Resist<br /><input type='text' size='12' name='dr' value='".$quick_stats->dr."' /></p>";
		echo "<p>Spell Resist <input type='text' size='3' name='sr' value='".$quick_stats->sr."' /></p>";
		echo "</div>"; //end box
	echo "</div>"; //end group_box
	
	echo "<div class='group_box'>";
		echo "<div class='box'>";
		echo "<h3>HD HP SP</h3>";
		echo "<p>Hit Dice <input type='text' size='3' name='hd' value='".$quick_stats->hd."' /></p>";
		echo "<p>Hit Points <input type='text' size='4' name='hp' value='".$quick_stats->hp."' /></p>";		
		echo "<p>Arcane SP <input type='text' size='3' name='asp' value='".$quick_stats->asp."' /></p>";
		echo "<p>Divine SP <input type='text' size='3' name='dsp' value='".$quick_stats->dsp."' /></p>";
		echo "</div><br />"; //end box
		
		echo "<div class='box'>";
		echo "<h3>Saves</h3>";
		echo "<p>Fortitude <input type='text' size='3' name='fort' value='".$quick_stats->fort."' /></p>";
		echo "<p>Reflex <input type='text' size='3' name='ref' value='".$quick_stats->ref."' /></p>";
		echo "<p>Willpower <input type='text' size='3' name='will' value='".$quick_stats->will."' /></p>";
		echo "</div><br />"; //end box
		
		echo "<div class='box'>";
		echo "<h3>Movement</h3>";
		echo "<p>Move <input type='text' size='3' name='move' value='".$quick_stats->move."' /></p>";
		echo "<p>Swim <input type='text' size='3' name='swim' value='".$quick_stats->swim."' /></p>";
		echo "<p>Fly <input type='text' size='3' name='fly' value='".$quick_stats->fly."' /></p>";
		echo "</div><br />"; //end box
		
		echo "<div class='box'>";
		echo "<h3>Size</h3>";
		echo "<p><select name='size_id'>";
			//query for sizes combobox
			$query = "SELECT SizeID, SizeName FROM Sizes";
			$result = $result = mysqli_query($link,$query);
			while($row = mysqli_fetch_object($result)) {
				echo "<option value=".$row->SizeID." ";
				if($row->SizeID == $quick_stats->size_id) echo "selected='selected' ";
				echo ">".$row->SizeName."</option>";
			} //end while row
			echo "</select>";
		echo "<p>Space <input type='text' size='3' name='space' value='".$quick_stats->space."' /></p>";
		echo "<p>Reach <input type='text' size='3' name='reach' value='".$quick_stats->reach."' /></p>";
		echo "</div>"; //end box
	echo "</div>"; //end group_box
	

	//*********
	//LEFT DIV ENDS
	echo '</div>'; //end div id="left_column"


	echo '<br class="clearfloat"/>';



	//********************************
	//SKILLS
	echo "<div class='box'>";
	echo '<h3>Skills
		<span class="fltrt" style="display:inline-block;font-size:8pt">
		show know skills 
		<img id="toggle_skill" style="cursor: pointer;	cursor: hand;" 
	src="images/graphic/expand_arrow.png" onclick="ShowHide(\'knowledge_skills\', \'toggle_skill\')" />
		</span></h3>';
	foreach($quick_stats->arr_skill_id as $i=>$value) {
		//hide knowledge skills
		if($quick_stats->arr_skill_id[$i] >= 13 && $quick_stats->arr_skill_id[$i] <= 22) 
			echo "<p class='hide'  name='knowledge_skills'>".$quick_stats->arr_skill_name[$i]." +
			<input type='hidden' name='arr_skill_id[]' value='".$quick_stats->arr_skill_id[$i]."'>
			<input type='text' size='3' name='arr_skill_roll[]' value='".$quick_stats->arr_skill_roll[$i]."' maxlength='2'></p>";
		//show non knowledge skills
		else
			echo "<p>".$quick_stats->arr_skill_name[$i]." +
			<input type='hidden' name='arr_skill_id[]' value='".$quick_stats->arr_skill_id[$i]."'>
			<input type='text' size='3' name='arr_skill_roll[]' value='".$quick_stats->arr_skill_roll[$i]."' maxlength='2'></p>";
	} //end while



	//RIGHT DIV ENDS
	echo "</div>"; //end box
	//echo '</div>';//<br class="clearfloat"/>'; //end div id="right_column"
	
	
	
	//********************************
	//ATTACKS
	//echo '<div id="left_column" class="fltrt" style="width:275px;">';
	echo "<div class='box'>";
	
	echo '<h3>Attacks</h3>';
	//display attack to screen
	for($i = 0; $i < 5; $i++) { 
		//hide attack div if blank - never hide first one
		if($quick_stats->arr_quick_attack_id[$i] == '' && $i != 0)
			echo '<div name="attack" class="hide">';
		//else show attack div
		else
			echo '<div name="attack">';
			
		echo "<input type='hidden' name='arr_quick_attack_id[]' value='".$quick_stats->arr_quick_attack_id[$i]."' />";
		
		//using hidden input for use with javascript function to showhide
		echo "<input type='hidden' name='attack_name' value='";
		if(isset($quick_stats->arr_attack_name[$i])) { echo $quick_stats->arr_attack_name[$i]; }
		echo "' />";
		
		echo "<p><input type='text' name='arr_attack_name[]' value='";
		if(isset($quick_stats->arr_attack_name[$i])) { echo $quick_stats->arr_attack_name[$i]; }
		echo "' size='10' maxlength='20' />";
		
		echo " <input type='text' name='arr_damage_die_num[]' value='";
		if(isset($quick_stats->arr_damage_die_num[$i])) { echo $quick_stats->arr_damage_die_num[$i]; }
		else echo "0";
		echo "' size='3' maxlength='2' />d";
		
		echo " <input type='text' name='arr_damage_die_type[]' value='";
		if(isset($quick_stats->arr_damage_die_type[$i])) { echo $quick_stats->arr_damage_die_type[$i]; }
		else echo "0";
		echo "' size='3' maxlength='2' />+";
		
		echo " <input type='text' name='arr_damage_mod[]' value='";
		if(isset($quick_stats->arr_damage_mod[$i])) { echo $quick_stats->arr_damage_mod[$i]; }
		else echo "0";
		echo "' size='3' maxlength='2' /></p>";
		
		//display attack rolls to screen
		echo "<p>";
		for($j = 0; $j < 5; $j++) {
			echo "<input type='text' name='arr_attack_bonus".$i."[]' value='";
			if(isset($quick_stats->arr_attack_bonus[$i][$j])) { echo $quick_stats->arr_attack_bonus[$i][$j]; }
			else echo "0";
			echo "' size='3' maxlength='2'/>";
		}
		echo "</p>";
		
		//display attack specials
		echo "<p>2Hand<input type='checkbox' name='arr_two_hand$i'";
		if(isset($quick_stats->arr_two_hand[$i])) {
			if($quick_stats->arr_two_hand[$i] == 1) { echo " checked='checked'"; }
		} //end if
		echo " />";
		
		echo " throw<input type='checkbox' name='arr_thrown$i'";
		if(isset($quick_stats->arr_thrown[$i])) {
			if($quick_stats->arr_thrown[$i] == 1) { echo " checked='checked'"; }
		} //end if
		echo " />";
		
		echo " flurry<input type='checkbox' name='arr_flurry$i'";
		if(isset($quick_stats->arr_flurry[$i])) {
			if($quick_stats->arr_flurry[$i] == 1) { echo " checked='checked'"; }
		} //end if
		echo " /></p>";
		
		echo "<p>crit<input type='text' name='arr_crit_range[]' value='";
		if(isset($quick_stats->arr_crit_range[$i])) { echo $quick_stats->arr_crit_range[$i]; }
		else echo "0";
		echo "' size='3' maxlength='2' />";
		
		echo " mult<input type='text' name='arr_crit_mult[]' value='";
		if(isset($quick_stats->arr_crit_mult[$i])) { echo $quick_stats->arr_crit_mult[$i]; }
		else echo "0";
		echo "' size='3' maxlength='2' />";
		
		echo " rng<input type='text' name='arr_range_base[]' value='";
		if(isset($quick_stats->arr_range_base[$i])) { echo $quick_stats->arr_range_base[$i]; }
		else echo "0";
		echo "' size='3' maxlength='2' /></p>";
		
		//DISPLAY REMOVE ATTACK CHK
		echo "<p>Remove<input type='checkbox' name='delete_attack[]' value=".$quick_stats->arr_quick_attack_id[$i]." /></p><br />";
		
		//extra fields to add atacks and attack rolls
		echo '</div>'; //<hr class="attack_separator" />'; //end attack box div
	} //end for 0-4 attack list
	//END ATTACKS
	echo "</div>"; //end box
	
	
	
	//****************************
	//COMBAT MANUVERS
	echo <<<EOT
		<div class='box'>
			<p>BAB<input type='text' size='3' name='bab' value='$quick_stats->bab' /></p>
			<br />
			<p>CMB<input type='text' size='3' name='cmb' value='$quick_stats->cmb' /></p>
			<p style="font-size:8pt">bonuses 
				<img id="toggle_cmb_bonuses" style="cursor: pointer; cursor: hand;" 
			src="images/graphic/expand_arrow.png" onclick="ShowHide('cmb_bonuses', 'toggle_cmb_bonuses')" />
				</p>
			<div name='cmb_bonuses' class='hide'>
				<p>Bullrush +<input type='text' size='3' name='bullrush_b' value='$quick_stats->bullrush_b' /></p>
				<p>Disarm +<input type='text' size='3' name='disarm_b' value='$quick_stats->disarm_b' /></p>
				<p>Grapple +<input type='text' size='3' name='grapple_b' value='$quick_stats->grapple_b' /></p>
				<p>Sunder +<input type='text' size='3' name='sunder_b' value='$quick_stats->sunder_b' /></p>
				<p>Trip +<input type='text' size='3' name='trip_b' value='$quick_stats->trip_b' /></p>
				<p>Feint +<input type='text' size='3' name='feint_b' value='$quick_stats->feint_b' /></p>
			</div>
			<br />
			<p>CMD<input type='text' size='3' name='cmd' value='$quick_stats->cmd' /></p>
			<p style="font-size:8pt">bonuses 
				<img id="toggle_cmd_bonuses" style="cursor: pointer; cursor: hand;" 
			src="images/graphic/expand_arrow.png" onclick="ShowHide('cmd_bonuses', 'toggle_cmd_bonuses')" />
				</p>
			<div name='cmd_bonuses' class='hide'>
				<p>Bullrush +<input type='text' size='3' name='bullrush_d' value='$quick_stats->bullrush_d' /></p>
				<p>Disarm +<input type='text' size='3' name='disarm_d' value='$quick_stats->disarm_d' /></p>
				<p>Grapple +<input type='text' size='3' name='grapple_d' value='$quick_stats->grapple_d' /></p>
				<p>Sunder +<input type='text' size='3' name='sunder_d' value='$quick_stats->sunder_d' /></p>
				<p>Trip +<input type='text' size='3' name='trip_d' value='$quick_stats->trip_d' /></p>
				<p>Feint +<input type='text' size='3' name='feint_d' value='$quick_stats->feint_d' /></p>
			</div>
		</div>
EOT;
	//echo "</div>"; //end right_column
	
	echo "<br class='clearfloat' /><br />";

	//FORM ENDS
	echo "</form>";								
	
	echo "</div> <!-- end div 'quick_stats_view' -->";

	unset($quick_stats);
	mysqli_close($link);
	
?>
