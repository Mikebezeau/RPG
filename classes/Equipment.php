<?php
	class Weapon {
		
		public $weapon_id;
		public $weapon_type_id;
		public $weapon_class_id;
		public $weapon_name;
		public $damage_die_type;
		public $damage_die_num;
		public $damage_mod;
		public $two_hand;
		public $crit_range;
		public $crit_mult;
		public $range_base;
		public $weapon_size;
		public $damage_type;
		public $sme;
		public $use_dex;
		public $thrown;
		public $weapon_desc;
		public $Icon;
		
		//make these static and use a get method to run query and return the arrays
		private $arr_weapon_type_id = array();
		private $arr_weapon_type = array();
		private $arr_weapon_class_id = array();
		private $arr_weapon_class_name = array();
		//make static
		private $arr_sme_id = array('S', 'M', 'E');
		private $arr_sme = array('Simple', 'Martial', 'Exotic');
				
		//CONSTRUCTOR
		function __construct() {
			$local_link = dbConnect();
			
			//store weapon type info
			$query="SELECT * FROM WeaponType";
			//perform Query
			if($result = mysqli_query($local_link,$query)) {
				//get resulting rows from query
				while($row = mysqli_fetch_object($result)) {
					$this->arr_weapon_type_id[] = $row->WeaponTypeID;
					$this->arr_weapon_type[] = $row->TypeName;
				} //end while
			} //end if
			
			//store weapon class info
			$query="SELECT * FROM WeaponClass";
			//perform Query
			if($result = mysqli_query($local_link,$query)) {
				//get resulting rows from query
				while($row = mysqli_fetch_object($result)) {
					$this->arr_weapon_class_id[] = $row->WeaponClassID;
					$this->arr_weapon_class_name[] = $row->ClassName;
				} //end while
			} //end if
			
			mysqli_close($local_link);
		} //end constructor
		
		//Display weapon data in a table row
		public function display_weapon($num) {
			//weapon name (id)
			echo '<tr><td><input name="arr_weapon_name[]" class="input_name" type="text" value="'.$this->weapon_name.'" />';
			
			//echo '<input class="hide" name="arr_weapon_id[]" type="text" size="1" maxlength="2" value="'.$this->weapon_id.'" />
			echo '<input name="arr_weapon_id[]" type="text" size="1" maxlength="2" value="'.$this->weapon_id.'" />
				</td>';
				
			//damage
			echo '<td>
					<input name="arr_damage_die_num[]" class="input_number" type="text" value="'.$this->damage_die_num.'" />d
					<input name="arr_damage_die_type[]" class="input_number" type="text" value="'.$this->damage_die_type.'" />
					+<input name="arr_damage_mod[]" class="input_number" type="text" value="'.$this->damage_mod.'" />';
					
			//crit
			echo '</td><td>';
			echo '<input name="arr_crit_range[]" class="input_number" type="text" value="'.(20-$this->crit_range).'" />-20';
			echo ' x<input name="arr_crit_mult[]" class="input_number" type="text" value="'.$this->crit_mult.'" /></td><td>';
			
			//range
			echo '<input name="arr_range_base[]" class="input_range" type="text" value="';
			if ($this->range_base > 0) { echo $this->range_base; }
			else { echo 'n/a'; }
			echo '" />';
			
			//size
			echo '<td><select name="arr_weapon_size[]">';
				echo '<option '; if ($this->weapon_size == "S") { echo 'selected="selected" '; } echo 'value="S">S</option>';
				echo '<option '; if ($this->weapon_size == "M") { echo 'selected="selected" '; } echo 'value="M">M</option>';
				echo '<option '; if ($this->weapon_size == "L") { echo 'selected="selected" '; } echo 'value="L">L</option>';
			echo '</select></td>';
			
			//damage type
			echo '<td><select name="arr_damage_type[]">';
				echo '<option '; if ($this->damage_type == "B") { echo 'selected="selected" '; } echo 'value="B">B</option>';
				echo '<option '; if ($this->damage_type == "P") { echo 'selected="selected" '; } echo 'value="P">P</option>';
				echo '<option '; if ($this->damage_type == "S") { echo 'selected="selected" '; } echo 'value="S">S</option>';
			echo '</select></td>';
			
			//icon
			echo '<td><input class="input_name" name="arr_weapon_icon[]" type="text" size="69" maxlength="200" value="'.$this->Icon.'" /><br/>'.($this->Icon ? '<img class="" style="position:relative;" src="./images/battle_icons/'.$this->Icon.'">' : '').'</td>';
			
			if(is_string($num)) {
				echo '</tr>';				
			} //end if _new
			else {
				
				//effect
				echo '<td><img class="edit-effect" data-type="weapon" data-name="'.str_replace(' ','_',$this->weapon_name).'" data-id="'.$this->weapon_id.'" style="position:relative;" src="./images/battle_icons/edit.png"></td>';
				
				//TOGGLE BUTTON for weapon notes and extra info
				echo '<td><img id="toggle_weapon_info'.$num.'" 
						style="cursor: pointer;	cursor: hand;" 
						src="images/graphic/expand_arrow.png" 
						onclick="ShowHide(\'weapon_info'.$num.'\', \'toggle_weapon_info'.$num.'\')" />
						</td>';
				//DELETE CHECKBOX for weapon
				echo '<td><input name="arr_delete_weapon_id[]" type="checkbox" value="'.$this->weapon_id.'" />
						</td></tr>';
			} //end else is not _new
					
			//ROW extra info, HIDDEN div
			echo '<tr class="blank"><td class="blank" colspan="10">';
			echo '<div name="weapon_info'.$num.'" class="hide">';
				//checkbox wont exist in array if not selected, cant use array append weapon id to name
				//rsnged weapons all use dex to hit by default, do not give option
				/*
				echo '<span>Use dex to hit 
					<input name="use_dex'.$weapon_id.'" type="checkbox" value="1"';
						if($this->use_dex == true) { echo ' checked="checked"'; }
				echo '" /></span>';
				*/
				//if a weapon is a two handed melee weapon its 2 hand is true
				/*
				echo '<span> 2 Handed 
					<input name="arr_two_hand'.$weapon_id.'" type="checkbox" value="1" ';
					if($this->two_hand == true) { echo ' checked="checked"'; }
				echo '" /></span>';
				*/
				
				//***************************
				//select weapon type / weapon class / SME
				echo '<select name="arr_weapon_type_id[]">';
				foreach($this->arr_weapon_type_id as $i=>$value) {
					echo '<option '; 
					if ($this->weapon_type_id == $this->arr_weapon_type_id[$i]) { echo 'selected="selected" '; }
					echo 'value="'.$this->arr_weapon_type_id[$i].'">'.$this->arr_weapon_type[$i].'</option>';
				} //end foreach arr_weapon_type_id
				echo '</select>';

				echo '<select name="arr_weapon_class_id[]">';
				foreach($this->arr_weapon_class_id as $i=>$value) {
					echo '<option '; 
					if ($this->weapon_class_id == $this->arr_weapon_class_id[$i]) { echo 'selected="selected" '; }
					echo 'value="'.$this->arr_weapon_class_id[$i].'">'.$this->arr_weapon_class_name[$i].'</option>';
				} //end foreach arr_weapon_class_id
				echo '</select>';
				
				echo '<select name="arr_sme[]">';
					echo '<option '; if ($this->sme == "S") { echo 'selected="selected" '; } echo 'value="S">Simple</option>';
					echo '<option '; if ($this->sme == "M") { echo 'selected="selected" '; } echo 'value="M">Martial</option>';
					echo '<option '; if ($this->sme == "E") { echo 'selected="selected" '; } echo 'value="E">Exotic</option>';
				echo '</select>';
				
			//close ROW weapon info
			echo '</div></td></tr>';
			
			//ROW weapon notes bonuses, HIDDEN div
			echo '<tr class="blank"><td class="blank" colspan="10"><div name="weapon_info'.$num.'" class="hide" style="width:100%;">';
			if($this->weapon_desc == '') {
				echo '<input class="input_desc" name="arr_weapon_desc[]" type="text" size="64" maxlength="200" value="" />';
			}
			else {
				echo '<input class="input_desc" name="arr_weapon_desc[]" type="text" size="64" maxlength="200" value="'.$this->weapon_desc.'" />';
			}
			//close ROW weapon notes
			echo '<br/><br/></div></td></tr>';
			
		} //end display weapon
		
	} //end Weapon

	class Armor {
		
		public $armor_id;
		public $armor_name;
		public $ac_bonus;
		public $max_dex;
		public $skill_penalty;
		public $spell_fail;
		public $armor_type;
		public $armor_size;
		public $material;
		public $shield;
		public $armor_desc;
		public $Icon;
		
		//make static
		private $arr_armor_type = array('L', 'M', 'H');
		private $arr_armor_type_name = array('Light', 'Medium', 'Heavy');
		
		//Display armor data in a table row
		public function display_armor($num) {
			echo '<tr><td><input name="arr_armor_name[]" class="input_name" type="text" value="'.$this->armor_name.'" />'.
					//'<input class="hide" name="arr_armor_id[]" type="text" size="1" maxlength="2" value="'.$this->armor_id.'" /></td>'.
					'<input name="arr_armor_id[]" type="text" size="1" maxlength="2" value="'.$this->armor_id.'" /></td>'.
            		'<td><input name="arr_ac_bonus[]" class="input_number" type="text" value="'.$this->ac_bonus.'" /></td>';
			
			//max dex
			echo '<td><input name="arr_max_dex[]" class="input_number" type="text" value="';
			if($this->max_dex > 9) { echo '-'; } else { echo $this->max_dex; }
			echo '" /></td>';
			
			echo '<td><input name="arr_skill_penalty[]" class="input_number" type="text" value="'.$this->skill_penalty.'" /></td>
			
			<td><input name="arr_spell_fail[]" class="input_number" type="text" value="'.$this->spell_fail.'" /></td>';
			
			//SELECT BOX
			echo '<td><input name="arr_armor_type[]" class="input_number" type="text" value="'.$this->armor_type.'" /></td>';
			
			//SELECT BOX
			//echo '<td><input name="arr_armor_size[]" class="input_number" type="text" value="'.$this->armor_size.'" /></td>';
			
			echo '<td><input name="arr_material[]" class="input_number" style="width:80px;" type="text" value="'.$this->material.'" />
				<input name="arr_shield[]" type="hidden" value="'.$this->shield.'" /></td>';
			
			//icon
			echo '<td><input class="input_name" name="arr_armor_icon[]" type="text" size="69" maxlength="200" value="'.$this->Icon.'" /><br/>'.($this->Icon ? '<img class="" style="position:relative;" src="./images/battle_icons/'.$this->Icon.'">' : '').'</td>';
			
			if(is_string($num)) {
				echo '</tr>';				
			} //end if _new_armor or _new_shield
			else {
				
				//effect
				echo '<td><img class="edit-effect" data-type="armor" data-name="'.str_replace(' ','_',$this->armor_name).'" data-id="'.$this->armor_id.'" style="position:relative;" src="./images/battle_icons/edit.png"></td>';
				
				//TOGGLE BUTTON for armor notes and extra info
				echo '<td><img id="toggle_armor_info'.$num.'" 
						style="cursor: pointer;	cursor: hand;" 
						src="images/graphic/expand_arrow.png" 
						onclick="ShowHide(\'armor_info'.$num.'\', \'toggle_armor_info'.$num.'\')" />
						</td>';
				//DELETE CHECKBOX for armor
				echo '<td><input name="arr_delete_armor_id[]" type="checkbox" value="'.$this->armor_id.'" />
						</td></tr>';
			} //end else is not new
			//ROW extra info, HIDDEN div
			echo '<tr class="blank"><td class="blank" colspan="11">';
			echo '<div name="armor_info'.$num.'" class="hide">';
			if($this->armor_desc == '') {
				echo '<input class="input_desc" name="arr_armor_desc[]" type="text" size="69" maxlength="200" value="" />';
			}
			else {
				echo '<input class="input_desc" name="arr_armor_desc[]" type="text" size="69" maxlength="200" value="'.$this->armor_desc.'" />';
			}
			//close ROW
			echo '<br/></div></td></tr>';			
		} //end display armor
		
	} //end Armor

	class Equipment {
		
		public $EquipID;
		public $EquipName;
		public $Description;
		public $Magical;
		public $Slot;
		public $Icon;
		
		//make static
		private $arr_equip_slot_name = array('None','Head','Face','Throat','Shoulders','Body','Torso','Arms','Hands','Ring','Waist','Feet');

		//Display equip data in a table row
		public function display_equip($num) {
			echo '<tr><td><input name="arr_equip_name[]" class="input_name" type="text" value="'.$this->EquipName.'" />'.
					//<input class="hide" name="arr_equip_id[]" type="text" size="1" maxlength="2" value="'.$this->EquipID.'" /></td>';
					'<input name="arr_equip_id[]" type="text" size="1" maxlength="2" value="'.$this->EquipID.'" /></td>';
			
			echo '<td><input class="input_name" name="arr_equip_slot[]" type="text" size="69" maxlength="200" value="'.$this->Slot.'" /></td>';
			
			echo '<td><input class="input_name" name="arr_equip_icon[]" type="text" size="69" maxlength="200" value="'.$this->Icon.'" /><br/>'.($this->Icon ? '<img class="" style="position:relative;" src="./images/battle_icons/'.$this->Icon.'">' : '').'</td>';
			
			if(is_string($num)) {
				echo '<td></td></tr>';				
			} //end if _new_equip
			else {
				
				//effect
				echo '<td><img class="edit-effect" data-type="equipment" data-name="'.str_replace(' ','_',$this->EquipName).'" data-id="'.$this->EquipID.'" style="position:relative;" src="./images/battle_icons/edit.png"></td>';
				
				//DELETE CHECKBOX for equip
				echo '<td><input name="arr_delete_equip_id[]" type="checkbox" value="'.$this->EquipID.'" /></td></tr>';
			} //end else is not new
		
			//description
			echo '<tr><td colspan="3"><input class="input_desc" name="arr_equip_desc[]" type="text" size="69" maxlength="200" value="'.$this->Description.'" /></td></tr><tr><td><br/></td></tr>';
			
		} //end display equip
		
	} //end Equipment

?>