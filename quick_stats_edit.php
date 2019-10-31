
<?php
	include_once("./includes/inc_connect.php");
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
?>

<span id="quick-stats-edit-done" class="menu-style-button fltrt">Close</span>

<?php
include_once("./classes/Quick_Stat.php");
$quick_stats = new Quick_stat();

if(isset($_COOKIE['use_existing_quick_stat']))
{
	$use_existing_quick_stat =  $_COOKIE['use_existing_quick_stat'];
}
else
{
	$use_existing_quick_stat = -1;
}
//used for testing
//echo "<br/>COOKIE use_existing_quick_stat: ".$use_existing_quick_stat;

$new_character = $_GET['new'];
$view_quick_stat_id = $_GET['quickstat_id'];
$view_catagory_id = $_GET['catagory_id'];
$view_character_id = $_GET['character_id'];

// CATAGORIES *****************************************************
// Prepare Query for MasterCharacter table
$query = "SELECT * FROM Catagories";
// Perform MasterCharacter Query
$result = mysqli_query($link,$query);
//Get resulting row from query
$arr_catagory_id = array();
$arr_catagory_name = array();
while($row = mysqli_fetch_object($result))
{
	$arr_catagory_id[] =  $row->CatagoryID;
	$arr_catagory_name[] =  $row->CatagoryName;
}

//if create new and not using an existing template, set quick stats variables to 0 for fresh sheet
if($new_character == "true" && $use_existing_quick_stat < 0)
{
	//CREATING NEW TEMPLATE & MONSTER
	//echo "NEW CHARACTER";
	//user would like to create a new NPC or MONSTER template
	//set all quickstat variables to 0
	$quick_stats->temp_name = '';
	$quick_stats->temp_description = '';
	$quick_stats->size_id = 5;
	$quick_stats->align_good_id = 1;
	$quick_stats->align_chaos_id = 1;
	$quick_stats->CreatureTypeID = 8;
	$quick_stats->initiative = 0;
	/*
	$quick_stats->ac = 10;
	$quick_stats->touch = 10;
	$quick_stats->flat_footed = 10;
	*/
	$quick_stats->Armor = 0;
	$quick_stats->Deflect = 0;
	$quick_stats->Dodge = 0;
	$quick_stats->NaturalAC = 0;
	
	$quick_stats->dr = '';
	$quick_stats->sr = 0;
	$quick_stats->hd = 0;
	$quick_stats->hp = 0;
	$quick_stats->asp = 0;
	$quick_stats->dsp = 0;
	$quick_stats->fort = 0;
	$quick_stats->ref = 0;
	$quick_stats->will = 0;
	$quick_stats->move = 40;
	$quick_stats->swim = 0;
	$quick_stats->fly = 0;
	$quick_stats->space = 5;
	$quick_stats->reach = 5;
	$quick_stats->str_mod = 0;
	$quick_stats->dex_mod = 0;
	$quick_stats->con_mod = 0;
	$quick_stats->int_mod = 0;
	$quick_stats->wis_mod = 0;
	$quick_stats->cha_mod = 0;
	$quick_stats->bab = 0;
	$quick_stats->cmb = 0;
		$quick_stats->bullrush_b = 0;
		$quick_stats->disarm_b = 0;
		$quick_stats->grapple_b = 0;
		$quick_stats->sunder_b = 0;
		$quick_stats->trip_b = 0;
		$quick_stats->feint_b = 0;			
	$quick_stats->cmd = 0;
		$quick_stats->bullrush_d = 0;
		$quick_stats->disarm_d = 0;
		$quick_stats->grapple_d = 0;
		$quick_stats->sunder_d = 0;
		$quick_stats->trip_d = 0;
		$quick_stats->feint_d = 0;
	$quick_stats->sprite_id = 0;
	$quick_stats->thumb_pic_id = 0;
	$quick_stats->portrait_pic_id = 0;
	$quick_stats->full_pic_id = 0;
	//echo "</br>object test ".$quick_stats->sprite_id;
}
else if($use_existing_quick_stat >= 0)
{
	//QUICKSTAT FROM EXISTING TEMPLATE DATA, CREATING NEW MONSTER
	//echo "USE TEMPLATE";
	//query QuickStats to view character data
	//echo "<br/>view_quick_stat_id (from template): ".$view_quick_stat_id = $use_existing_quick_stat;
	$view_quick_stat_id = $use_existing_quick_stat;
	//get QuickStat data into $quick_stats object using template id
	$quick_stats->get_data_stats($link, $view_quick_stat_id);
}
else
{
	//QUICKSTAT FROM EXISTING QUICKSTAT CHARACTER DATA, EDITING MONSTER
	//get QuickStat data into $quick_stats object using given quickstatid
	$quick_stats->get_data_stats($link, $view_quick_stat_id);
}

//if no quickstats exist and is a player character, will get user to update character_sheet
//to have the system make new quickstats
//DO NOT DISPLAY DATA, USER MUST SAVE QUICKSTAT INFO FIRST
if($view_quick_stat_id < 0 && $view_catagory_id == 1)
{
	//character has no quickstats set up yet, and is a player character catagory
	echo "<br/><p><a onclick='SetCookie(\"character_id\",\"".$view_character_id."\",30)' href='character_sheet.php' >Update Character Sheet to save 'quick stats'</a></p>";
}
//else QuickStats exist DISPLAY ALL QUICKSTAT DATA
else
{
	//display data from QuickStats in fields.  quick_stat_id exists
	$key = array_search($view_catagory_id, $arr_catagory_id);
	$new_catagory_name = $arr_catagory_name[$key];

	//sprite & thumb image selection
	include_once('./php/get_images.php');
	?>


<!--FORM begins-->
<form id="quick_update" autocomplete="off">
	<input type="hidden" id="sprite_pic_id" name="sprite_pic_id" value="<?php echo $quick_stats->sprite_id; ?>">
	<input type="hidden" id="thumb_pic_id" name="thumb_pic_id" value="<?php echo $quick_stats->thumb_pic_id; ?>">
	<input type="hidden" id="full_pic_id" name="full_pic_id" value="<?php echo $quick_stats->full_pic_id; ?>">
	<?php
	
	//if has a character_id get master data
	if($view_character_id >= 0)
	{
		//get QuickStat data into $quick_stats object
		//***get items held
		$quick_stats->get_all_data($link, $view_character_id);
	}
	//else get template data
	else
	{
		$quick_stats->character_name = $character_name = $new_catagory_name."1";
		$quick_stats->master_description = '';
		//get QuickSkill data into $quick_stats object
		$quick_stats->get_data_skill($link, $view_quick_stat_id);				
		//get QuickSpecial data into $quick_stats object
		$quick_stats->get_data_special($link, $view_quick_stat_id);
		//get QuickAttack data into $quick_stats object
		$quick_stats->get_data_attack($link, $view_quick_stat_id);
	}
	
	//********
	//LEFT DIV BEGINS
	if($view_catagory_id == 1)//1='Player'
	{
		//PLAYER CHARACTER NAME
		echo "<h1>".$quick_stats->character_name."</h1>";
		//CHARACTER PICTURE
		//float right characters full picture
		echo '<div id="full_pic"><p><a href="select_full_pic.php?new='.$new_character.'&quickstat_id='.$view_quick_stat_id.'&catagory_id='.$view_catagory_id.'&character_id='.$view_character_id.'">select character picture</a></p>';
		//query for current picture
		$result = mysqli_query($link,'SELECT FileName, Width, Height, CharacterName FROM FullPics 
								 INNER JOIN MasterCharacter ON FullPics.FullPicID = MasterCharacter.FullPicID 
								 WHERE CharacterID = '.$quick_stats->character_id);
		if($result)
		{
			$row = mysqli_fetch_object($result);
			echo '<img src="images/char/full/'.$row->FileName.'" alt="'.$row->CharacterName.'" width="'.$row->Width.'" height="'.$row->Height.'" />';
		} //end if $result
		echo '</div>';
	}
	
	//NOT PLAYER CHARACTER
	else
	{
		if($new_character == "true")
		{
			echo "<h1>Create New ".$new_catagory_name."</h1>";
		}
		else
		{
			echo "<h1>Edit ".$new_catagory_name." Stats</h1>";
		}
	}
	?>

	<div id='info' class='box'>
		<p><?php echo($quick_stats->temp_name == '' ? 'Enter New ' : '');?>Template name<input autocomplete='off' class='mobile-input-fix' type='text' name='name' value='<?php echo $quick_stats->temp_name; ?>'/> 
		
		<?php
		$query = "SELECT * FROM CreatureTypes";
		$result = mysqli_query($link, $query);
		while($row = mysqli_fetch_object($result))
		{
			$html .= '<option value="'.$row->CreatureTypeID.'" '.($row->CreatureTypeID == $quick_stats->CreatureTypeID?'selected="selected"':'').'>'.$row->TypeName.'</option>';
		}
		echo '<br/>CreatureTypeID: <select id="CreatureTypeID" name="CreatureTypeID">'
			.'<option value="0">select</option>'.$html
			.'</select><br/>';
		?>
		
		<?php
		$query = "SELECT * FROM CreatureSubTypes";
		for($i=0; $i<2; $i++)
		{
			$html = '';
			$result = mysqli_query($link, $query);
			while($row = mysqli_fetch_object($result))
			{
				$html .= '<option value="'.$row->CreatureSubTypeID.'" '.($row->CreatureSubTypeID == $quick_stats->CreatureSubTypeID[$i]?'selected="selected"':'').'>'.$row->TypeName.'</option>';
			}
			echo '<br/>CreatureSubTypeID '.$i.': <select id="CreatureSubTypeID" name="CreatureSubTypeID[]">'
				.'<option value="0">select</option>'.$html
				.'</select><br/>';
		}
		?>
		
		<p>Description</p><textarea name='description' value='<?php echo $quick_stats->temp_description; ?>'></textarea>
		<!--<p>Description <input type='text' name='master_description' value='".$quick_stats->master_description."' /></p>-->
		<!--graphics-->
		<span class="menu-style-button" onclick="$('#sprite-images').show();">Select Sprite Image</span>
		<span class="menu-style-button" onclick="$('#thumb-images').show();">Select Thumb Image</span>
		<div id="sprite-images" style="display:none;">
			<div>Sprite Images</div>
			<div><span class="menu-style-button" onclick="$('#sprite-images').hide();">Close</span></div>
			<?php ListImages(GetFileList('./images/char/sprite/char', true)); ?>
		</div>
		<div id="thumb-images" style="display:none;">
		<div>Thumb Images</div>
			<div><span class="menu-style-button" onclick="$('#thumb-images').hide();">Close</span></div>
			<?php ListImages(GetFileList('./images/char/thumb', true)); ?>
		</div>
		</br>
		<img id="sprite_pic_sample" src="<?php echo($quick_stats->sprite_id>0 ? './images/'.$quick_stats->sprite_file : ''); ?>">
		<img id="thumb_pic_sample" src="<?php echo($quick_stats->thumb_pic_id>0 ? './images/char/thumb/charthumb_'.$quick_stats->thumb_pic_id.'.png' : ''); ?>">
		<div>
			<?php
			//SUBMIT BUTTON
			//only put update button if not viewing a player character, otherwise goto charactersheet to update player
			if($view_catagory_id != 1){ //1='Player' ?>	
				<span id='quick-stats-edit-submit' class='menu-style-button'>Save</span>
			<?php } ?>
		</div>
	</div>
	
	<div>
		<span class="sub2-menu-button" data-show-id="edit-char-align">Alignment</span>
		<span class="sub2-menu-button" data-show-id="edit-char-attr">Attributes</span>
		<span class="sub2-menu-button" data-show-id="edit-char-hp">Hit Points / HD</span>
		<span class="sub2-menu-button" data-show-id="edit-char-ac">Armor Class</span>
		<span class="sub2-menu-button" data-show-id="edit-char-sp">Spell Points / SR</span>
		<span class="sub2-menu-button" data-show-id="edit-char-move">Movement</span>
		<span class="sub2-menu-button" data-show-id="edit-char-saves">Saves</span>
		<span class="sub2-menu-button" data-show-id="edit-char-size">Size</span>
		<span class="sub2-menu-button" data-show-id="edit-char-spc">Special Abilities</span>
		<span class="sub2-menu-button" data-show-id="edit-char-skills">Skills</span>
		<span class="sub2-menu-button" data-show-id="edit-char-attack">Attacks</span>
		<span class="sub2-menu-button" data-show-id="edit-char-items">Items (or Shop)</span>
	</div>
	
	<div class="edit-char-align toggle-sub2-menu" style="display:none;">
		<div class='box'>
			Alignment
			<select name="align_chaos_id">
				<option <?php echo($quick_stats->align_chaos_id == 0 ? 'selected="selected"' : ''); ?> value="0">Lawful</option>
				<option <?php echo($quick_stats->align_chaos_id == 1 ? 'selected="selected"' : ''); ?> value="1">Neutral</option>
				<option <?php echo($quick_stats->align_chaos_id == 2 ? 'selected="selected"' : ''); ?> value="2">Chaotic</option>
			</select>
			<select name="align_good_id">
				<option <?php echo($quick_stats->align_good_id == 0 ? 'selected="selected"' : ''); ?> value="0">Good</option>
				<option <?php echo($quick_stats->align_good_id == 1 ? 'selected="selected"' : ''); ?> value="1">Neutral</option>
				<option <?php echo($quick_stats->align_good_id == 2 ? 'selected="selected"' : ''); ?> value="2">Evil</option>
			</select></p>
		</div>
	</div>
	
	<div class="edit-char-attr toggle-sub2-menu" style="display:none;">
		<div class='box'>
			<h3>Attribute Mods</h3>
			<p>Strength <input type='text' size='3' name='str_mod' value='<?php echo($quick_stats->str_mod); ?>' /></p>
			<p>Dexterity <input type='text' size='3' name='dex_mod' value='<?php echo($quick_stats->dex_mod); ?>' /></p>
			<p>Constitution <input type='text' size='3' name='con_mod' value='<?php echo($quick_stats->con_mod); ?>' /></p>
			<p>Intelligence <input type='text' size='3' name='int_mod' value='<?php echo($quick_stats->int_mod); ?>' /></p>
			<p>Wisdom <input type='text' size='3' name='wis_mod' value='<?php echo($quick_stats->wis_mod); ?>' /></p>
			<p>Charisma <input type='text' size='3' name='cha_mod' value='<?php echo($quick_stats->cha_mod); ?>' /></p>
			<br/>
			<p>Initiative <input type='text' size='3' name='initiative' value='<?php echo($quick_stats->initiative); ?>' /></p>
		</div>
	</div>
	
	<div class="edit-char-ac toggle-sub2-menu" style="display:none;">
		<div class='box'>
			<h3>Armor Class</h3>
			<p>Armor <input type='text' size='3' name='Armor' value='<?php echo($quick_stats->Armor); ?>' /></p>
			<p>DeflectAC <input type='text' size='3' name='DeflectAC' value='<?php echo($quick_stats->DeflectAC); ?>' /></p>
			<p>Dodge <input type='text' size='3' name='Dodge' value='<?php echo($quick_stats->Dodge); ?>' /></p>
			<p>NaturalAC <input type='text' size='3' name='NaturalAC' value='<?php echo($quick_stats->NaturalAC); ?>' /></p>
			<?php /*
			<p>Armor Class <input type='text' size='3' name='ac' value='<?php echo($quick_stats->ac); ?>' /></p>
			<p>~ Touch AC <input type='text' size='3' name='touch' value='<?php echo($quick_stats->touch); ?>' /></p>
			<p>~ Flat Ft. <input type='text' size='3' name='flat_footed' value='<?php echo($quick_stats->flat_footed); ?>' /></p>
			*/ ?>
			<br/>
			<!--<p>Damage Resist<br /><input type='text' size='12' name='dr' value='<?php echo($quick_stats->dr); ?>' /></p>-->
		</div>
	</div>
	
	<div class="edit-char-hp toggle-sub2-menu" style="display:none;">
		<div class='box'>
			<h3>Hit Points & HD</h3>
			<p>Hit Dice <input type='text' size='3' name='hd' value='<?php echo($quick_stats->hd == 0 ? 1 : $quick_stats->hd); ?>' /></p>
			<p>Hit Points <input type='text' size='4' name='hp' value='<?php echo($quick_stats->hp == 0 ? 5 : $quick_stats->hp); ?>' /></p>		
		</div>
	</div>
	
	<div class="edit-char-sp toggle-sub2-menu" style="display:none;">
		<div class='box'>
			<p>Arcane SP <input type='text' size='3' name='asp' value='<?php echo($quick_stats->asp); ?>' /></p>
			<p>Divine SP <input type='text' size='3' name='dsp' value='<?php echo($quick_stats->dsp); ?>' /></p>
			<br/>
			<p>Spell Resist <input type='text' size='3' name='sr' value='<?php echo($quick_stats->sr); ?>' /></p>
		</div>
	</div>
	
	<div class="edit-char-saves toggle-sub2-menu" style="display:none;">
		<div class='box'>
			<h3>Saves</h3>
			<p>Fortitude <input type='text' size='3' name='fort' value='<?php echo($quick_stats->fort); ?>' /></p>
			<p>Reflex <input type='text' size='3' name='ref' value='<?php echo($quick_stats->ref); ?>' /></p>
			<p>Willpower <input type='text' size='3' name='will' value='<?php echo($quick_stats->will); ?>' /></p>
		</div>
	</div>
	
	<div class="edit-char-move toggle-sub2-menu" style="display:none;">
		<div class='box'>
			<h3>Movement</h3>
			<p>Move <input type='text' size='3' name='move' value='<?php echo($quick_stats->move); ?>' /></p>
			<p>Swim <input type='text' size='3' name='swim' value='<?php echo($quick_stats->swim); ?>' /></p>
			<p>Fly <input type='text' size='3' name='fly' value='<?php echo($quick_stats->fly); ?>' /></p>
		</div>
	</div>
	
	<div class="edit-char-size toggle-sub2-menu" style="display:none;">
		<div class='box'>
		<h3>Size</h3>
		<p><select name='size_id'>
		<?php
	
			//query for sizes combobox
			$query = "SELECT SizeID, SizeName FROM Sizes";
			$result = $result = mysqli_query($link,$query);
			while($row = mysqli_fetch_object($result))
			{
				echo "<option value=".$row->SizeID." ";
				if($row->SizeID == $quick_stats->size_id) echo "selected='selected' ";
				echo ">".$row->SizeName."</option>";
			} //end while row
		?>
		</select>
		<p>Space <input type='text' size='3' name='space' value='<?php echo($quick_stats->space); ?>' /></p>
		<p>Reach <input type='text' size='3' name='reach' value='<?php echo($quick_stats->reach); ?>' /></p>
		</div>
	</div>
	
	<!--SPECIAL ABILITIES-->
	<div class="edit-char-spc toggle-sub2-menu" style="display:none;">
		<div class='box'>
			<h3>Special Abilities</h3>
			<p>name - description</p>
			<?php
			if($view_catagory_id != 1)
			{ //1='Player'
				for($i = 0; $i < 11; $i++)
				{
				?>
					<div style="clear:both;">
						<div id="" class='game-menu-item-container-row fltlft' onclick="" data-id="<?php echo $quick_stats->arr_special_id[$i]; ?>" data-name="<?php echo str_replace(' ','_',$quick_stats->arr_special_name[$i]); ?>">
							<img style='position:absolute; top:0; left:0;' src='images/battle_icons/blank_border.png'/>
							<img class="spc-abil-icon<?php echo $i;?>" style='position:relative;' src='./images/battle_icons/edit.png'/>
							<div style='position:relative;'><span style='background-color:#000;'>Edit</span></div>
						</div>
						
						<input type='hidden' name='arr_special_id[]' value='<?php 
							echo(isset($quick_stats->arr_special_id[$i]) ? $quick_stats->arr_special_id[$i] : '');?>'/>
						
						<input type='text' name='arr_special_name[]' value='<?php 
							echo(isset($quick_stats->arr_special_name[$i]) ? $quick_stats->arr_special_name[$i] : '');
							?>' size='10' maxsize='20' />
						
						<input type='text' name='arr_special_description[]' value='<?php
							echo(isset($quick_stats->arr_special_description[$i]) ? $quick_stats->arr_special_description[$i] : '');
							?>' size='25' maxsize='100' />
						<br/>
						<input type='text' name='arr_special_animname[]' value='<?php
							echo(isset($quick_stats->arr_special_animname[$i]) ? $quick_stats->arr_special_animname[$i] : '');
							?>' size='10' maxsize='50' />
					</div>
				<?php
				}
			}
			else
			{
				/*
				//display all character specials
				//recial, class, faction, feats
				include_once("classes/Detail_Stat.php");
				$details = new Detail_Stat();
				$details->get_abilities_feats();
				//$view_character_id
				*/
			}
			?>
		</div>
	</div>

	<!--SKILLS-->
	<div class="edit-char-skills toggle-sub2-menu" style="display:none;">
		<div class='box'>
			<h3>Skills
				<span class="fltrt" style="display:inline-block;font-size:8pt">
					show know skills 
					<img id="toggle_skill" style="cursor: pointer;	cursor: hand;" src="images/graphic/expand_arrow.png" onclick="ShowHide('knowledge_skills', 'toggle_skill')" />
				</span>
			</h3>
			<?php
			foreach($quick_stats->arr_skill_id as $i=>$value)
			{
				//hide knowledge skills
				if($quick_stats->arr_skill_id[$i] >= 13 && $quick_stats->arr_skill_id[$i] <= 22)
				{
				?>
					<p class='hide'  name='knowledge_skills'><?php echo $quick_stats->arr_skill_name[$i]; ?> +
						<input type='hidden' name='arr_skill_id[]' value='<?php echo $quick_stats->arr_skill_id[$i]; ?>'>
						<input type='text' size='3' name='arr_skill_roll[]' value='<?php echo $quick_stats->arr_skill_roll[$i]; ?>' maxlength='2'>
					</p>
				<?php
				}
				//show non knowledge skills
				else
				{
				?>
					<p><?php echo $quick_stats->arr_skill_name[$i]; ?> +
						<input type='hidden' name='arr_skill_id[]' value='<?php echo $quick_stats->arr_skill_id[$i]; ?>'>
						<input type='text' size='3' name='arr_skill_roll[]' value='<?php echo $quick_stats->arr_skill_roll[$i]; ?>' maxlength='2'>
					</p>
				<?php
				}
			}
			?>
		</div>
	</div>
	
	<!--ATTACKS-->
	<div class="edit-char-attack toggle-sub2-menu" style="display:none;">
		<!--COMBAT MANUVERS-->
		<div class='box'>
			<p>BAB<input type='text' size='3' name='bab' value='<?php echo $quick_stats->bab; ?>' /></p>
			
			<br />
			
			<p>CMB<input type='text' size='3' name='cmb' value='<?php echo $quick_stats->cmb; ?>' /></p>
			
			<p style="font-size:8pt">bonuses 
				<img id="toggle_cmb_bonuses" style="cursor: pointer; cursor: hand;" src="images/graphic/expand_arrow.png" 
					onclick="ShowHide('cmb_bonuses', 'toggle_cmb_bonuses')" />
			</p>
			
			<div name='cmb_bonuses' class='hide'>
				<p>Bullrush +<input type='text' size='3' name='bullrush_b' value='<?php echo $quick_stats->bullrush_b; ?>'/></p>
				<p>Disarm +<input type='text' size='3' name='disarm_b' value='<?php echo $quick_stats->disarm_b; ?>'/></p>
				<p>Grapple +<input type='text' size='3' name='grapple_b' value='<?php echo $quick_stats->grapple_b; ?>'/></p>
				<p>Sunder +<input type='text' size='3' name='sunder_b' value='<?php echo $quick_stats->sunder_b; ?>'/></p>
				<p>Trip +<input type='text' size='3' name='trip_b' value='<?php echo $quick_stats->trip_b; ?>'/></p>
				<p>Feint +<input type='text' size='3' name='feint_b' value='<?php echo $quick_stats->feint_b; ?>'/></p>
			</div>
			
			<br />
			
			<p>CMD<input type='text' size='3' name='cmd' value='<?php echo $quick_stats->cmd; ?>'/></p>
			
			<p style="font-size:8pt">bonuses 
				<img id="toggle_cmd_bonuses" style="cursor: pointer; cursor: hand;" src="images/graphic/expand_arrow.png" 
					onclick="ShowHide('cmd_bonuses', 'toggle_cmd_bonuses')"/>
			</p>
			
			<div name='cmd_bonuses' class='hide'>
				<p>Bullrush +<input type='text' size='3' name='bullrush_d' value='<?php echo $quick_stats->bullrush_d; ?>'/></p>
				<p>Disarm +<input type='text' size='3' name='disarm_d' value='<?php echo $quick_stats->disarm_d; ?>'/></p>
				<p>Grapple +<input type='text' size='3' name='grapple_d' value='<?php echo $quick_stats->grapple_d; ?>'/></p>
				<p>Sunder +<input type='text' size='3' name='sunder_d' value='<?php echo $quick_stats->sunder_d; ?>'/></p>
				<p>Trip +<input type='text' size='3' name='trip_d' value='<?php echo $quick_stats->trip_d; ?>'/></p>
				<p>Feint +<input type='text' size='3' name='feint_d' value='<?php echo $quick_stats->feint_d; ?>'/></p>
			</div>
		</div>
		<div class='box'>
			<?php //if player, cannot add attacks here
			if($view_catagory_id == 1)
				echo'<h3>Attacks</h3>';
			else { ?>
				<h3>
					Attacks
					<span class="fltrt" style="display:inline-block;font-size:8pt">add attacks 
						<img id="toggle_attacks" style="cursor: pointer;	cursor: hand;" src="images/graphic/expand_arrow.png" 
							onclick="ShowHide_Attacks()"/>
					</span>
				</h3>
			<?php } ?>
			
			<?php
			//display attack to screen
			for($i = 0; $i < 5; $i++)
			{ //hide attack div if blank - never hide first one
				?>
				<div name="attack" <?php echo(($quick_stats->arr_quick_attack_id[$i] == '' && $i != 0) ? 'class="hide"' : ''); ?>>
					<hr class="attack_separator"/>
					
					<input type='hidden' name='arr_quick_attack_id[]' value='<?php echo $quick_stats->arr_quick_attack_id[$i]; ?>'/>
					
					<!--using hidden input for use with javascript function to showhide-->
					<input type='hidden' name='attack_name' value='<?php 
						echo (isset($quick_stats->arr_attack_name[$i]) ? $quick_stats->arr_attack_name[$i] : ''); ?>'/>
					
					<p>
						<input type='text' name='arr_attack_name[]' value='<?php 
							echo(isset($quick_stats->arr_attack_name[$i]) ? $quick_stats->arr_attack_name[$i] : ''); ?>' size='10' maxlength='20'/>
						
						 <input type='text' name='arr_damage_die_num[]' value='<?php 
								echo(isset($quick_stats->arr_damage_die_num[$i]) ? $quick_stats->arr_damage_die_num[$i] : '0'); ?>' size='3' maxlength='2'/>D
						
						 <input type='text' name='arr_damage_die_type[]' value='<?php 
								echo(isset($quick_stats->arr_damage_die_type[$i]) ? $quick_stats->arr_damage_die_type[$i] : '0'); ?>' size='3' maxlength='2'/>+
						
						 <input type='text' name='arr_damage_mod[]' value='<?php 
								echo(isset($quick_stats->arr_damage_mod[$i]) ? $quick_stats->arr_damage_mod[$i] : '0'); ?>' size='3' maxlength='2' />
					</p>
					
					<p>
						<?php //display attack rolls to screen
						for($j = 0; $j < 5; $j++) { ?>
							<input type='text' name='arr_attack_bonus<?php echo $i; ?>[]' value='<?php
								echo(isset($quick_stats->arr_attack_bonus[$i][$j]) ? $quick_stats->arr_attack_bonus[$i][$j] : '0'); ?>' size='3' maxlength='2'/>
						<?php } ?>
					</p>
					
					<!--main/secondary attack-->
					<p>
						Main<input type='radio' name='arr_off_hand<?php echo $i; ?>' value='0'
							<?php 
							if(isset($quick_stats->arr_off_hand[$i]) && $quick_stats->arr_off_hand[$i] == 0) echo ' checked="checked"';
							elseif(!isset($quick_stats->arr_off_hand[$i]) && $i == 0) echo ' checked="checked"';
							?>/>
						Secondary<input type='radio' name='arr_off_hand<?php echo $i; ?>' value='1'
							<?php
							if(isset($quick_stats->arr_off_hand[$i]) && $quick_stats->arr_off_hand[$i] == 1) echo ' checked="checked"';
							elseif(!isset($quick_stats->arr_off_hand[$i]) && $i > 0) echo ' checked="checked"';
							?>/>
					</p>
					
					<!--display attack specials-->
					<p>
						2Hand<input type='checkbox' name='arr_two_hand<?php echo $i; ?>' <?php 
							echo(isset($quick_stats->arr_two_hand[$i]) && $quick_stats->arr_two_hand[$i] == 1 ? ' checked="checked"' : ''); ?>/>
						 throw<input type='checkbox' name='arr_thrown<?php echo $i; ?>' <?php
							echo(isset($quick_stats->arr_thrown[$i]) && $quick_stats->arr_thrown[$i] == 1 ? ' checked="checked"' : ''); ?>/>
						 flurry<input type='checkbox' name='arr_flurry<?php echo $i; ?>' <?php 
							echo(isset($quick_stats->arr_flurry[$i]) && $quick_stats->arr_flurry[$i] == 1 ? ' checked="checked"' : ''); ?>/>
					</p>
					
					<p>
						crit<input type='text' name='arr_crit_range[]' value='<?php 
							echo(isset($quick_stats->arr_crit_range[$i]) ? $quick_stats->arr_crit_range[$i] : '0'); ?>' size='3' maxlength='2' />
						 mult<input type='text' name='arr_crit_mult[]' value='<?php 
							echo(isset($quick_stats->arr_crit_mult[$i]) ? $quick_stats->arr_crit_mult[$i] : '2'); ?>' size='3' maxlength='2' />
						 rng<input type='text' name='arr_range_base[]' value='<?php 
							echo(isset($quick_stats->arr_range_base[$i]) ? $quick_stats->arr_range_base[$i] : '0'); ?>' size='3' maxlength='2' />
					</p>
					
					<p>Remove<input type='checkbox' name='delete_attack[]' value="<?php echo $quick_stats->arr_quick_attack_id[$i]; ?>" /></p>
					<br />
					
				</div>
			<?php
			} //end for 0-4 attack list
			?>
		</div>
	</div><!--END ATTACKS-->
	
	
	<!--ITEMS HELD, OR SHOP-->
	<div class="edit-char-items toggle-sub2-menu" style="display:none;">
		
		<?php
		//items held by the quickstat template (always will have these)
		$QSWeaponIDs = '';
		if(isset($quick_stats->arr_quick_items_id['weapon']))
		{
			//weapon
			for($i = 0; $i < count($quick_stats->arr_quick_items_id['weapon']); $i++)
			{
				$QSWeaponIDs .= $quick_stats->arr_quick_items_id['weapon'][$i].',';
			}
			$QSWeaponIDs = substr($QSWeaponIDs, 0, -1);
		}
		//adding items to this specific character
		$WeaponIDs = '';
		if(isset($quick_stats->arr_items_id['weapon']))
		{
			//weapon
			for($i = 0; $i < count($quick_stats->arr_items_id['weapon']); $i++)
			{
				$WeaponIDs .= $quick_stats->arr_items_id['weapon'][$i].',';
			}
			$WeaponIDs = substr($WeaponIDs, 0, -1);
		}
		?>
		<div>
			<h3>Weapons List</h3>
			<h3>Included with template: <?php echo $QSWeaponIDs; ?></h3>
			<input name="weapon_id_list" type="text" value="<?php echo($WeaponIDs); ?>" />
		</div>
		
		<?php
		//items held by the quickstat template (always will have these)
		$QSArmorIDs = '';
		if(isset($quick_stats->arr_quick_items_id['armor']))
		{
			//armor
			for($i = 0; $i < count($quick_stats->arr_quick_items_id['armor']); $i++)
			{
				$QSArmorIDs .= $quick_stats->arr_quick_items_id['armor'][$i].',';
			}
			$QSArmorIDs = substr($QSArmorIDs, 0, -1);
		}
		//adding items to this specific character
		$ArmorIDs = '';
		if(isset($quick_stats->arr_items_id['armor']))
		{
			//weapon
			for($i = 0; $i < count($quick_stats->arr_items_id['armor']); $i++)
			{
				$ArmorIDs .= $quick_stats->arr_items_id['armor'][$i].',';
			}
			$ArmorIDs = substr($ArmorIDs, 0, -1);
		}
		?>
		<div>
			<h3>Armor List</h3>
			<h3>Included with template: <?php echo $QSArmorIDs; ?></h3>
			<input name="armor_id_list" type="text" value="<?php echo($ArmorIDs); ?>" />
		</div>
		
		<?php
		//items held by the quickstat template (always will have these)
		$QSEquipmentIDs = '';
		if(isset($quick_stats->arr_quick_items_id['equipment']))
		{
			//equipment
			for($i = 0; $i < count($quick_stats->arr_quick_items_id['equipment']); $i++)
			{
				$QSEquipmentIDs .= $quick_stats->arr_quick_items_id['equipment'][$i].',';
			}
			$QSEquipmentIDs = substr($QSEquipmentIDs, 0, -1);
		}
		//adding items to this specific character
		$EquipmentIDs = '';
		if(isset($quick_stats->arr_items_id['equipment']))
		{
			//equipment
			for($i = 0; $i < count($quick_stats->arr_items_id['equipment']); $i++)
			{
				$EquipmentIDs .= $quick_stats->arr_items_id['equipment'][$i].',';
			}
			$EquipmentIDs = substr($EquipmentIDs, 0, -1);
		}
		?>
		<div>
			<h3>Equipment List</h3>
			<h3>Included with template: <?php echo $QSEquipmentIDs; ?></h3>
			<input name="equipment_id_list" type="text" value="<?php echo($EquipmentIDs); ?>" />
		</div>
		<?php
		//armor
		
		//euipment
		
		
		?>
		
		<?php
		//list of all the weapon ids
		$query = "SELECT * FROM Weapon";
		$result = $result = mysqli_query($link,$query);
		echo "<br/>Weapons<br/>";
		while($row = mysqli_fetch_object($result))
		{
			echo $row->WeaponID." ".$row->WeaponName."<br/>";
		} //end while row
		
		//list of all the armor ids
		$query = "SELECT * FROM Armor";
		$result = $result = mysqli_query($link,$query);
		echo "<br/>Armors<br/>";
		while($row = mysqli_fetch_object($result))
		{
			echo $row->ArmorID." ".$row->ArmorName."<br/>";
		} //end while row
		
		//list of all the equipment ids
		$query = "SELECT * FROM Equipment";
		$result = $result = mysqli_query($link,$query);
		echo "<br/>Equipment<br/>";
		while($row = mysqli_fetch_object($result))
		{
			echo $row->EquipID." ".$row->EquipName."<br/>";
		} //end while row
		?>
	</div>
	
	<input type='hidden' name='new' value='<?php echo $new_character; ?>'/>
	<input type='hidden' name='view_character_id' value='<?php echo $view_character_id; ?>'/>
	<input type='hidden' name='view_quick_stat_id' value='<?php echo $view_quick_stat_id; ?>'/>
	<input type='hidden' name='view_catagory_id' value='<?php echo $view_catagory_id; ?>'/>
	
</form>

<?php
} //end else ($view_quick_stat_id >= 0 and not a player character)
unset($quick_stats);
mysqli_close($link);
?>
