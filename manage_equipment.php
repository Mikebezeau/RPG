<!DOCTYPE html>

<html>
	<link rel="shortcut icon" href="./favi.ico">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>PlaneScape Online - Manage Equipment</title>
	<link href="css/main.css" rel="stylesheet" type="text/css" />
	<link href="css/manage_equipment.css" rel="stylesheet" type="text/css" />
	<script src="./js/jquery-2.1.3.min.js"></script>
	<script src="./js/game_controller.js?v12"></script>
	<script src="./js/game_editor_controller.js"></script>
	<script src="./js/effect_controller.js"></script>
	<script src="js/character_sheet/show_hide.js" type="text/javascript"></script>
	<script src="./js/sprite_anim_controller.js"></script>
	<script src="./js/canvas_effect_anim_controller.js"></script>
</head>

<body>
	
	<?php
	include_once("includes/inc_connect.php");
	$link = dbConnect();
	?>
	
	<div id="container">

		<div id="maincontent">

			<!-- InstanceBeginEditable name="main_content" -->
		<h1>Manage Equipment</h1>
		<?php
			include_once("classes/Equipment.php"); 
			
			//WEAPONS***************************************************************
			echo '<a name="weapons"><h2>Weapons</h2></a>';
			echo '<form id="weapon_list" method="post" action="./php/edit/equipment/weapon_update.php" autocomplete="off">';
			// Prepare Query for CharacterParty MasterCharacter Catagories tables
			$query="SELECT * FROM Weapon ORDER BY WeaponName";
			//perform Query
			if($result = mysqli_query($link,$query)) {
				//get resulting rows from query
				$arr_weapon = array();
				while($row = mysqli_fetch_object($result)) {
					$weapon = new Weapon();
					$weapon->weapon_id =  $row->WeaponID;
					$weapon->weapon_type_id =  $row->WeaponTypeID;
					$weapon->weapon_class_id =  $row->WeaponClassID;
					$weapon->weapon_name =  $row->WeaponName;
					$weapon->damage_die_type =  $row->DamageDieType;
					$weapon->damage_die_num =  $row->DamageDieNum;
					$weapon->damage_mod =  $row->DamgeMod;
					$weapon->two_hand =  $row->TwoHand;
					$weapon->crit_range =  $row->CritRange;
					$weapon->crit_mult =  $row->CritMult;
					$weapon->range_base =  $row->RangeBase;
					$weapon->weapon_size =  $row->WeaponSize;
					$weapon->damage_type =  $row->DamageType;
					$weapon->sme =  $row->SME;
					$weapon->use_dex =  $row->UseDex;
					$weapon->thrown =  $row->Thrown;
					$weapon->weapon_desc =  $row->Description;
					$weapon->Icon = $row->Icon;
					
					$arr_weapon[] = $weapon;
				} //end while
				
				//display weapons grouped by weapon type
				$query="SELECT * FROM WeaponType";
				//perform Query
				if($result = mysqli_query($link,$query)) {
					//get resulting rows from query
					$arr_weapon_type_id = array();
					$arr_weapon_type = array();
					while($row = mysqli_fetch_object($result)) {
						$arr_weapon_type_id[] = $row->WeaponTypeID;
						$arr_weapon_type[] = $row->TypeName;
					} //end while
					
					//array to hold Simple, Martial, Exotic
					$arr_sme = array('Simple', 'Martial', 'Exotic');
					$arr_sme_id = array('S', 'M', 'E');
					
					//foreach WeaponType
					foreach($arr_weapon_type_id as $i=>$value) {
						//do not show ammunition - dont know what to do with it
						if($arr_weapon_type_id[$i] != 5) {
							echo '<h3>'.$arr_weapon_type[$i].'</h3>';
							echo '<table style="width:1000px;">
										<tr class="bold">
										<td>Name</td>
										<td>Damage</td>
										<td>Crit</td>
										<td>Range</td>
										<td>Size</td>
										<td>Type</td>
										<td>Icon</td>
										<td>Effect</td>
										<td>Info</td>
										<td>Remove</td>
										</tr>';
							//if unarmed or ranged, dont group by SME
							if($arr_weapon_type_id[$i] == 0 || $arr_weapon_type_id[$i] == 5) {
								foreach ($arr_weapon as $j=>$value) {
									if($arr_weapon[$j]->weapon_type_id == $arr_weapon_type_id[$i]) {
										$arr_weapon[$j]->display_weapon($j);
									} //end if weapon type match
								} //end foreach arr_weapon
							} //end if unarmed or ranged
							else {
								//group further into Simple Martial and Exotic
								foreach ($arr_sme as $k=>$value) {
									echo '<tr><td><p>'.$arr_sme[$k].'</p></td></tr>';
									foreach ($arr_weapon as $j=>$value) {
										if($arr_weapon[$j]->weapon_type_id == $arr_weapon_type_id[$i] 
												&& $arr_weapon[$j]->sme == $arr_sme_id[$k]) {
											$arr_weapon[$j]->display_weapon($j);
										} //end if weapon type match
									} //end foreach arr_weapon
								} //end foreach $SME
							} //end else group by SME
							echo '</table>';
						} //end if dont show ammo
					} //end foreach arr_weapon_type_id
				} //end if result
			} //end if result
			echo '<input type="submit" value="Save changes to Weapons" />';
			echo '</form>';
			//CREATE NEW WEAPON
			echo '<input type="submit" value="Create New Weapon" onclick="ShowHide(\'create_weapon\'); ShowHide(\'weapon_info_new\')"/>';
			echo '<div name="create_weapon" class="hide">';
			echo '<form id="new_weapon" method="post" action="./php/edit/equipment/weapon_new.php">
					<table>
						<tr class="small">
						<td>Name</td>
						<td>Damage</td>
						<td>Crit</td>
						<td>Range</td>
						<td>Size</td>
						<td>Type</td>
						<td>Icon</td>
						<td>Effect</td>
						<td></td>
						<td></td>
						</tr>';
			$weapon = new Weapon();
			$weapon->display_weapon('_new');
			echo '</table>
					<input type="submit" value="Save Weapon" />
					</form>';
			echo '</div>';	
			
			//ARMOR**********************************************************
			$query="SELECT * FROM Armor ORDER BY ACBonus, ArmorName";
			//perform Query
			if($result = mysqli_query($link,$query)) {
				//get resulting row from query
				$arr_armor = array();
				while($row = mysqli_fetch_object($result)) {
					$armor = new Armor();
					$armor->armor_id = $row->ArmorID;
					$armor->armor_name = $row->ArmorName;
					$armor->ac_bonus = $row->ACBonus;
					$armor->max_dex = $row->MaxDex;
					$armor->skill_penalty = $row->SkillPenalty;
					$armor->spell_fail = $row->SpellFail;
					$armor->armor_type = $row->ArmorType;
					//$armor->armor_size = $row->ArmorSize;
					$armor->material = $row->Material;
					$armor->Icon = $row->Icon;
					$armor->shield = $row->Shield;
					$armor->armor_desc = $row->Description;
					
					$arr_armor[] = $armor;
				} //end while

			
				$arr_lmh = array('L', 'M', 'H');
				$arr_lmh_name = array('Light', 'Medium', 'Heavy');
						
				echo '<a name="armor"><h2>Armor</h2></a>';
				echo '<form id="armor_list" method="post" action="./php/edit/equipment/armor_update.php">';
				//foreach Armor Type
				//DISPLAY ARMOR SUITS
				foreach($arr_lmh as $i=>$value) {
					echo '<h3>'.$arr_lmh_name[$i].'</h3>';
					echo '<table>
							<tr class="bold">
								<td>Name</td>
								<td>AC</td>
								<td>MaxDex</td>
								<td>Penalty</td>
								<td>SplFail</td>
								<td>Type</td>
								
								<td>Material</td>
								<td>Icon</td>
								<td>Effect</td>
								<td>Info</td>
								<td>Remove</td>
							</tr>';
							//<td>Size</td>
					foreach ($arr_armor as $j=>$value) {
						if($arr_armor[$j]->shield == 0 && $arr_armor[$j]->armor_type == $arr_lmh[$i]) {
							$arr_armor[$j]->display_armor($j);
						} //end if armor type match
					} //end foreach arr_armor_id

					echo '</table>';
				} //end foreach arr_lmh
				
				//DISPLAY SHIELDS
				echo '<h3>Shields</h3>';
					echo '<table>
							<tr class="bold">
								<td>Name</td>
								<td>AC</td>
								<td>MaxDex</td>
								<td>Penalty</td>
								<td>SplFail</td>
								<td>Type</td>
								<td>Material</td>
								<td>Icon</td>
								<td>Effect</td>
								<td>Info</td>
								<td>Remove</td>
							</tr>';
							//<td>Size</td>
					//display all armor
					foreach ($arr_armor as $j=>$value) {
						if($arr_armor[$j]->shield == 1) {
							$arr_armor[$j]->display_armor($j);
						} //end if armor type match
					} //end foreach arr_armor_id

					echo '</table>';
					
			} //end if result
			echo '<input type="submit" value="Save changes to Armor" />';
			echo '</form>';
			
			//CREATE NEW ARMOR
			echo '<input type="submit" value="Create New Armor" onclick="ShowHide(\'create_armor\'); ShowHide(\'armor_info_new_armor\')"/>';
			echo '<div name="create_armor" class="hide">';
				echo '<form id="new_armor" method="post" action="./php/edit/equipment/armor_new.php">
						<table>
							<tr class="bold">
								<td>Name</td>
								<td>AC</td>
								<td>MaxDex</td>
								<td>Penalty</td>
								<td>SplFail</td>
								<td>Type</td>
								<td>Material</td>
								<td>Icon</td>
							</tr>';
							//<td>Size</td>
				$armor = new Armor();
				$armor->display_armor('_new_armor');
				echo '</table>
						<input type="submit" value="Save Armor" />
						</form>';
			echo '</div>';
			echo '</table>';
			
			//CREATE NEW SHIELD
			echo '<br/><input type="submit" value="Create New Shield" onclick="ShowHide(\'create_shield\'); ShowHide(\'armor_info_new_shield\')"/>';
			echo '<div name="create_shield" class="hide">';
				echo '<form id="new_shield" method="post" action="./php/edit/equipment/armor_new.php?shield=1">
						<table>
							<tr class="bold">
								<td>Name</td>
								<td>AC</td>
								<td>MaxDex</td>
								<td>Penalty</td>
								<td>SplFail</td>
								<td>Type</td>
								<td>Material</td>
								<td>Icon</td>
							</tr>';
							//<td>Size</td>
				$armor = new Armor();
				$armor->display_armor('_new_shield');
				echo '</table>
						<input type="submit" value="Save Shield" />
						</form>';
			echo '</div>';
			echo '</table>';
			
			//EQUIPMENT**********************************************************
			$query="SELECT * FROM Equipment ORDER BY EquipName";
			//perform Query
			if($result = mysqli_query($link,$query)) {
				//get resulting row from query
				$arr_equip = array();
				while($row = mysqli_fetch_object($result)) {
					$equip = new Equipment();
					$equip->EquipID = $row->EquipID;
					$equip->EquipName = $row->EquipName;
					$equip->Description = $row->Description;
					$equip->Magical = $row->Magical;
					$equip->Slot = $row->Slot;
					$equip->Icon = $row->Icon;
					
					$arr_equip[] = $equip;
				} //end while
				
				echo '<a name="equip"><h2>Items</h2></a>';
				echo '<form id="equip_list" method="post" action="./php/edit/equipment/equip_update.php">';
				//DISPLAY EQUIPMENT
				echo '<table>
						<tr class="bold">
							<td>Name</td>
							<td>Slot</td>
							<td>Icon</td>
							<td>Effect</td>
							<td>Remove</td>
						</tr>';
				foreach ($arr_equip as $j=>$value) {
					$arr_equip[$j]->display_equip($j);
				} //end foreach arr_armor_id

				echo '</table>';
				
			} //end if result
			echo '<input type="submit" value="Save changes to Items" />';
			echo '</form>';
			
			//CREATE NEW EQUIP
			echo '<input type="submit" value="Create New Item" onclick="ShowHide(\'create_equip\');"/>';
			echo '<div name="create_equip" class="hide">';
				echo '<form id="new_equip" method="post" action="./php/edit/equipment/equip_new.php">
						<table>
							<tr class="bold">
								<td>Name</td>
								<td>Slot</td>
								<td>Icon</td>
							</tr>';
							//<td>Size</td>
				$equip = new Equipment();
				$equip->display_equip('_new_equip');
				echo '</table>
						<input type="submit" value="Save Item" />
						</form>';
			echo '</div>';

		?>
		
		</div>

	</div>
	
	<div id="effect-editor-load" style="position:absolute; top:0; left:0; z-index:20000; background-color:#ddd; color: #000; text-align: left; font-family: beebregular; font-size: 16px; width: 544px;"></div>
	<div id="load-effect-gen-icon-select" style="display:none;"></div>
	
	<div id="animations-container" style="position:absolute; left:0px; top:0px; z-index:200; pointer-events:none; width:544px; height:544px;">
		<canvas id="battle-particle-effects" style="position:absolute; left:0px; top:0px; pointer-events:none;"></canvas>
		<canvas id="battle-weapons-effects" style="position:absolute; left:0px; top:0px; pointer-events:none;"></canvas>
	</div>
	
	<?php
	mysqli_close($link);
	?>

	</body>

</html>

<script>

$(document).on("click", ".edit-effect", function()
	{
		if($(this).data('name') == '')
		{
			alert('Enter name');
			return false;
		}
		var title = 'Equipment_'+$(this).data('name');
		var effecttype = $(this).data('type');//weapon, armor or equipment
		var id = $(this).data('id');
		$('#effect-editor-load').html('<h1>LOADING EFFECT EDITOR</h1>');
		$.ajax({
			type: "GET",
			async: true,
			url: './effect-gen.php?title='+title+'&effecttype='+effecttype+'&effecttypeid='+id,
			data: 0
		}).done(function(result){
			$('#effect-editor-load').html(result);
			$('#effect-editor-load #select-icon-image-list').html($('#load-effect-gen-icon-select').html());
			$('#effect-editor-load #select-icon-image-list img').each(function()
			{
				if($(this).data('file') == $('#icon-path').val())
				{
					$(this).css('border','4px solid #00f');
				}
			});
		});
		
		$('#effect-editor-load').show();
		//scroll to top of page
		window.scrollTo(0, 0);
	});

$(document).ready(function()
{
	CanvasAnimController.Init(document.getElementById('battle-particle-effects'));
	SpriteAnimController.SpriteAnimation.init(document.getElementById('battle-weapons-effects'));
	GameController.init_set_edit_button_events();
	//pre load effect editor icon selection div - does job of pre loading effect icons
	$('#load-effect-gen-icon-select').load('./load_effect_gen_icon_list.php');
	GameController.init_set_edit_menu_button_events();
});

</script>