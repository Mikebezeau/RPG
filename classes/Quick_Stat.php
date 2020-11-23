<?php	
	class Quick_Stat {
		
		//MasterCharacter
		public $character_id;
		public $quick_stat_id;
		public $quick_stat_catagory_id = 0;
		
		//for summoned/polymorphed creatures
		public $summoned_by_character_id = 0;
		public $is_polymorph_qsid = 0;
		public $poly_character_stats = 0;
		public $is_familiar = 0;
		
		public $character_name;
		public $RaceID = -1;
		public $CreatureTypeID;
		public $CreatureSubTypeID = array();
		public $CreatureSubTypeName = array();
				
		public $ClassArr = array();
		public $hp_damage;
		public $asp_used;
		public $dsp_used;
		public $init_roll;
		public $action_complete;
		public $area_id;
		public $x_pos;
		public $y_pos;
		public $master_description;
		public $conversation_id;
		//from template, or overridden from MasterCharacter table
		public $sprite_id;
		public $anim_sprite_index;
		public $sprite_file;
		public $sprite_scale;
		public $thumb_pic_id = null;
		public $thumb_pic_file = null;
		public $portrait_pic_id = null;
		public $full_pic_id = null;
		public $full_pic_file_name = null;
		public $full_pic_width = null;
		public $full_pic_height = null;	
		//Effects
		public $effects = array();
		
		//QuickStats
		public $temp_name; //template name
		public $temp_description; //template descritpion
		public $size_id;
		public $size_name;
		public $size_mod;
			public $align_good_id;
			public $align_chaos_id;
		public $initiative;
		/*
		public $ac;
		public $touch;
		public $flat_footed;
		*/
		public $Armor;
		public $DeflectAC;
		public $Dodge;
		public $NaturalAC;
				
			public $dr;
			public $sr;
		public $hd;
		public $hp;
		public $asp;
		public $dsp;
			public $fort;
			public $ref;
			public $will;
		public $move;
		public $swim;
		public $fly;
		public $space;
		public $reach;
			public $str_mod;
			public $dex_mod;
			public $con_mod;
			public $int_mod;
			public $wis_mod;
			public $cha_mod;
			public $str;
			public $dex;
			public $con;
			public $int;
			public $wis;
			public $cha;
		public $bab;
		public $cmb;
			public $bullrush_b;
			public $disarm_b;
			public $grapple_b;
			public $sunder_b;
			public $trip_b;
			public $feint_b;			
		public $cmd;
			public $bullrush_d;
			public $disarm_d;
			public $grapple_d;
			public $sunder_d;
			public $trip_d;
			public $feint_d;
		
		//QuickSkill
		//public $arr_skill_id = array();
		//public $arr_skill_name = array();
		public $arr_skill_roll = array();
		
		//QuickSpecial
		public $arr_special_id = array();
		public $arr_special_name = array();
		public $arr_special_description = array();
		public $arr_special_animname = array();
		public $arr_special_effect = array();
		
		//QuickAttack
		public $arr_quick_attack_id = array();
		public $arr_attack_name = array();
		public $arr_damage_die_type = array();
		public $arr_damage_die_num = array();
		public $arr_damage_mod = array();
		public $arr_equipped = array();
		public $arr_off_hand = array();
		public $arr_two_hand = array();
		public $arr_crit_range = array();
		public $arr_crit_mult = array();
		public $arr_range_base = array();
		public $arr_thrown = array();
		public $arr_flurry = array();
		public $arr_weapon_id = array();
		public $weapon_type_id = array();
		public $weapon_class_id = array();
		//QuickAttackHitRolls
		public $arr_attack_bonus = array();
		public $arr_attack_effect = array();
		
		//get data from all tables, including Characters (for player characters)
		public function get_all_pc_data($link, $character_id, $doQueryAll = true, $player_character_id = -1)
		{
			
			if($doQueryAll) $this->get_all_data($link, $character_id, $player_character_id);
			
			//basic character data
			$query = "SELECT * FROM Characters WHERE CharacterID = ".$character_id;
			if($result = mysqli_query($link,$query))
			{
				//Get resulting row from query
				$row = mysqli_fetch_object($result);
				//FavoredHP
				//FavoredSkill
				//SizeID
				$this->RaceID = (int)$row->RaceID;
				$this->Gender = $row->Gender;
				$this->Height = $row->Height;
				$this->Weight = $row->Weight;
				$this->AlignGoodID = (int)$row->AlignGoodID;
				$this->AlignChaosID = (int)$row->AlignChaosID;
				$this->Age = $row->Age;
				$this->Deity = $row->Deity;
				$this->Occupation = $row->Occupation;
				$this->FactionID = (int)$row->FactionID;
			}
			
			//actual attributes
			$query = "SELECT * FROM CharacterAttribute WHERE CharacterID = ".$character_id;
			if($result = mysqli_query($link,$query))
			{
				while($row = mysqli_fetch_object($result))
				{
					if($row->AttributeID == 0) (int)($this->str = $row->Value + $row->Bonus + $row->Enhance);
					if($row->AttributeID == 1) (int)($this->dex = $row->Value + $row->Bonus + $row->Enhance);
					if($row->AttributeID == 2) (int)($this->con = $row->Value + $row->Bonus + $row->Enhance);
					if($row->AttributeID == 3) (int)($this->int = $row->Value + $row->Bonus + $row->Enhance);
					if($row->AttributeID == 4) (int)($this->wis = $row->Value + $row->Bonus + $row->Enhance);
					if($row->AttributeID == 5) (int)($this->cha = $row->Value + $row->Bonus + $row->Enhance);
				}
			}
			
			//class name and level
			$query = "SELECT * FROM CharacterClass INNER JOIN Classes USING(ClassID) WHERE CharacterID = ".$character_id;
			if($result = mysqli_query($link,$query))
			{
				while($row = mysqli_fetch_object($result))
				{
					//$row->Level = (int)$row->Level;
					$this->ClassArr[] = $row;// ->ClassName & ->Level
				}
			}
			
			//weapons
			$this->WeaponArr = array();
			$query = "SELECT * FROM CharacterWeapon INNER JOIN Weapon USING(WeaponID) WHERE CharacterID = ".$character_id;
			if($result = mysqli_query($link,$query))
			{
				while($row = mysqli_fetch_object($result))
				{
					$row->WeaponID = (int)$row->WeaponID;
					$row->ID = $row->WeaponID;
					$row->Name = $row->WeaponName;
					$row->Description = $row->Description;
					$row->Equipped = (int)$row->Equipped;
					$row->TwoHand = (int)$row->TwoHand;
					$row->OffHand = (int)$row->OffHand;
					
					//might want these ones
					$row->MW = (int)$row->MW;
					$row->UseDex = (int)$row->UseDex;
					$row->Thrown = (int)$row->Thrown;
					$row->Flurry = (int)$row->Flurry;
					$row->DamageType = $row->DamageType;
					$row->WeaponSize = $row->WeaponSize;
					
					//include all data for ActionController.SetCharacterActionData
					//for PCs, equipped weapons in 'character_stats.WeaponArr' are added directly to 'action_data.attack_action_data'
					$row->action = 'attack';
					$row->action_type = 'attack';
					$row->target = 1; //1 == select 1 target
					$row->data_index = -1;
					$row->party_stats_index = 0; //is set when loading party members? default is 0
					$row->num_attacks = 1 + ($this->bab - 1)%5;
					$row->submit = 'm'; //first letter of submit name - s for single and m for multiple attack
					$row->attack_name = $row->WeaponName;
					$row->weapon_type_id = (int)$row->WeaponTypeID;
					$row->weapon_class_id = (int)$row->WeaponClassID;
					$row->attack_bonus = 0;
					$row->attack_mod = 0;
					$row->num_dice = (int)$row->DamageDieNum;
					$row->die_type =(int)$row->DamageDieType;
					$row->damage_mod = 0;//DamgeMod
					$row->range_base = (int)$row->RangeBase;
					$row->crit_range = (int)$row->CritRange;
					$row->crit_mult = (int)$row->CritMult;
					$row->two_hand = (int)$row->TwoHand;
					//$row->equipped = (int)$row->Equipped;
					$row->OffHand = (int)$row->OffHand;
					//$row->off_hand = (int)$row->OffHand;
					
					//query for weapon effect
					if(function_exists('EffectQuery'))
					{
						$row->effects = EffectQuery($link, 'EffectsWeapons', 'ItemID', $row->ID);
					}
					else
					{
						$row->effects = 0;
					}
					$this->WeaponArr[] = $row;
				}
			}
			
			//armors
			$this->ArmorArr = array();
			$query = "SELECT * FROM CharacterArmor INNER JOIN Armor USING(ArmorID) WHERE CharacterID = ".$character_id;
			if($result = mysqli_query($link,$query))
			{
				while($row = mysqli_fetch_object($result))
				{
					$row->ArmorID = (int)$row->ArmorID;
					$row->ID = $row->ArmorID;
					$row->Name = $row->ArmorName;
					$row->Description = $row->Description;
					$row->Equipped = (int)$row->Equipped;
					$row->Shield = (int)$row->Shield;
					//query for armor effect
					if(function_exists('EffectQuery'))
					{
						$row->effects = EffectQuery($link, 'EffectsArmor', 'ItemID', $row->ID);
					}
					else
					{
						$row->effects = 0;
					}
					$this->ArmorArr[] = $row;
				}
			}
			
			//equipment
			$this->EquipArr = array();
			$query = "SELECT * FROM CharacterEquipment INNER JOIN Equipment USING(EquipID) WHERE CharacterID = ".$character_id;
			if($result = mysqli_query($link,$query))
			{
				while($row = mysqli_fetch_object($result))
				{
					$row->EquipID = (int)$row->EquipID;
					$row->ID = $row->EquipID;
					$row->Name = $row->EquipName;
					$row->Description = $row->Description;
					$row->Icon = $row->Icon;
					$row->Equipped = (int)$row->Equipped;
					$row->Quantity = (int)$row->Quantity;
					$row->Magical = (int)$row->Magical;
					//query for equipment effect
					if(function_exists('EffectQuery'))
					{
						$row->effects = EffectQuery($link, 'EffectsEquipment', 'ItemID', $row->ID);
					}
					else
					{
						$row->effects = 0;
					}
					$this->EquipArr[] = $row;
				}
			}
		} //end get_all_pc_data

		//get data from all tables
		public function get_all_data($link, $character_id, $player_character_id = -1)
		{
			$this->get_data_master_character($link, $character_id);
			$this->get_data_stats($link, $this->quick_stat_id);
			$this->get_data_skill($link, $this->quick_stat_id);
			$this->get_data_special($link, $this->quick_stat_id);
			//if not a player character
			if($this->quick_stat_catagory_id != 1)
			{
				$this->get_data_attack($link, $this->quick_stat_id);
				$this->get_data_items($link, $this->quick_stat_id);
			}
			//if $player_character_id > -1 get PCWorldData here
			if($player_character_id != -1)
			{
				$this->get_data_character_pc_world($link, $character_id, $player_character_id);
			}
		} //end get_all_data

		//MASTERCHARACTER
		public function get_data_master_character($link, $character_id, $player_character_id = -1) {
			$query = "SELECT * FROM MasterCharacter INNER JOIN Sprites USING(SpriteID) WHERE CharacterID = ".$character_id;
			
			if($result = mysqli_query($link,$query)) {
				//Get resulting row from query
				if($row = mysqli_fetch_object($result))
				{
					$this->character_id = (int)$row->CharacterID;
					$this->quick_stat_id = (int)$row->QuickStatID;
					$this->character_name = $row->CharacterName;
					$this->quick_stat_catagory_id = (int)$row->CatagoryID;//this changes when creature summoned or charmed ? for charmed will need in PCCharacterInfo
					$this->hp_damage = (int)$row->HPDamage;
					$this->asp_used = (int)$row->ArcaneSPUsed;
					$this->dsp_used = (int)$row->DivineSPUsed;
					$this->init_roll = (int)$row->InitRoll;
					$this->action_complete = $row->ActionComplete;
					$this->area_id = (int)$row->AreaID;
					$this->x_pos = (int)$row->Xpos;
					$this->y_pos = (int)$row->Ypos;
					$this->master_description = $row->Description;
					
					$this->sprite_id = (int)$row->SpriteID;
					$this->anim_sprites_index = (int)$row->AnimSpritesIndex;
					$this->sprite_file = $row->FilePathName;
					$this->sprite_scale = floatval($row->CustomSpriteScale);
					$this->default_sprite_scale = floatval($row->DefaultSpriteScale);
					if($this->sprite_scale == 0)
					{
						$this->sprite_scale = $this->default_sprite_scale;
					}
					
					$this->thumb_pic_id = (int)$row->ThumbPicID;
					$this->portrait_pic_id = (int)$row->PortraitPicID;
					$this->full_pic_id = (int)$row->FullPicID;
					
					$this->conversation_id = 0;
					$result = mysqli_query($link,"SELECT * FROM Conversations WHERE CharacterID = ".$this->character_id);
					if($conversationData = mysqli_fetch_object($result))
					{
						$this->conversation_id = $conversationData->ConversationID;
					}
					
					//images
					if($this->character_id > 0)
					{
						$result = mysqli_query($link,"SELECT FileName FROM ThumbPics WHERE ThumbPicID = ".$this->thumb_pic_id);
						if($row = mysqli_fetch_object($result))
						{
							$this->thumb_pic_file = $row->FileName;//this should be upgraded
						}
					}
					
					if($this->full_pic_id > 0)
					{
						//query for current picture
						$result = mysqli_query($link,'SELECT FileName, Width, Height FROM FullPics WHERE FullPicID = '.$this->full_pic_id);
						$row = mysqli_fetch_object($result);
						$this->full_pic_file_name = $row->FileName;
						$this->full_pic_width = $row->Width;
						$this->full_pic_height = $row->Height;
					}
				}
			} //end if result
			else
			{
				//error checking
				echo("character_id:".$character_id);
			}
		} //end get_data_master_character
	
		//get PCCharacterInfo
		public function get_data_character_pc_world($link, $character_id, $player_character_id)
		{
			//getting Player specific data for their world
			//PC area id and X Y pos comes from here now
			$PCWorldQuery = "SELECT * FROM PCCharacterInfo WHERE PlayerCharacterID = ".$player_character_id." AND CharacterID = ".$character_id;
			if($PCWorldResult = mysqli_query($link, $PCWorldQuery))
			{
				if($PCWorldRow = mysqli_fetch_object($PCWorldResult))
				{
					$this->summoned_by_character_id = (int)$PCWorldRow->SummonedByCharacterID;
					$this->is_polymorph_qsid = (int)$PCWorldRow->IsPolymorphQSID;
					$this->is_familiar = (int)$PCWorldRow->IsFamiliar;
					$this->area_id = (int)$PCWorldRow->AreaID;
					$this->x_pos = (int)$PCWorldRow->Xpos;
					$this->y_pos = (int)$PCWorldRow->Ypos;
					$this->hp_damage = (int)$PCWorldRow->HPDamage;
					$this->asp_used = (int)$PCWorldRow->ArcaneSPUsed;
					$this->dsp_used = (int)$PCWorldRow->DivineSPUsed;
					
					//get quick stats of polymorphed form
					if($this->is_polymorph_qsid > 0)
					{
						$this->poly_character_stats = new Quick_Stat();
						$this->poly_character_stats->get_data_stats($link, $this->is_polymorph_qsid);
						//$this->poly_character_stats->get_data_skill($link, $this->is_polymorph_qsid);
						$this->poly_character_stats->get_data_special($link, $this->is_polymorph_qsid);
						$this->poly_character_stats->get_data_attack($link, $this->is_polymorph_qsid);
					}
				}
			}
			
			//GET EFFECTS
			if(function_exists('EffectQuery'))
			{
				$query = "SELECT * FROM CharacterEffects WHERE PlayerCharacterID = ".$player_character_id." AND CharacterID = ".$this->character_id;
				if($result = mysqli_query($link, $query))
				{
					while($characterEffect = mysqli_fetch_object($result))
					{
						$characterEffect->action_level = $characterEffect->ActionLevel; // :p
						$EffectData = $characterEffect->EffectData;
						$EffectTypeTable = $characterEffect->EffectTypeTable;
						CastAllToInt($characterEffect);
						$characterEffect->EffectData = $EffectData;//keep this string
						$characterEffect->EffectTypeTable = $EffectTypeTable;//keep this string
						//get this data from sub table 'CharacterEffectsCastedSubTypes' -> 'CharacterEffectID', 'CastedByCreatureSubTypeID'
						$characterEffect->CastedBySubTypes = array();//cast all subtypeids (int)
						$thisEffect = EffectQuery($link, $characterEffect->EffectTypeTable, 0, 0, 0, $characterEffect->EffectID);
						$characterEffect->effect = $thisEffect[0];//only one effect returned because search for specific effect id, 
						
						$characterEffect->EffectName = $characterEffect->effect->EffectName;//set 'EffectName' from effect data
						
						//set effect object as first element in returned array
						$this->effects[] = $characterEffect;
					}
				}
			}
		}
		
		//STATS
		public function get_data_stats($link, $quick_stat_id) {
			
			$this->quick_stat_id = $quick_stat_id;
			
			//prepare query of QuickStats table to get the rest of the information
			$query = "SELECT * FROM QuickStats WHERE QuickStatID = ".$quick_stat_id;
			if($result = mysqli_query($link,$query)) {
				//Get resulting row from query
				$row = mysqli_fetch_object($result);
				//assign varibales
				$this->quick_stat_catagory_id = ($this->quick_stat_catagory_id == 0) ? (int)$row->CatagoryID : $this->quick_stat_catagory_id;
				$this->temp_name = $row->Name; //thats templte name
				$this->temp_description = $row->Description; //template descritpion
				$this->size_id = (int)$row->SizeID;
				
				$this->size_name = '';
				//query for size name
				$query = "SELECT SizeID, SizeMod, SizeName FROM Sizes WHERE SizeID = ".$this->size_id;
				if($resultSize = mysqli_query($link,$query))
				{
					$rowSize = mysqli_fetch_object($resultSize);
					$this->size_name = $rowSize->SizeName;
					$this->size_mod = (int)$rowSize->SizeMod;
				}
				
					$this->align_good_id = (int)$row->AlignGoodID;
					$this->align_chaos_id = (int)$row->AlignChaosID;
				
				$this->CreatureTypeID = (int)$row->CreatureTypeID;
				$query = "SELECT TypeName FROM CreatureTypes WHERE QuickStatID = ".$quick_stat_id;
				if($typeResult = mysqli_query($link,$query)) {
					if($typeRow = mysqli_fetch_object($typeResult)) {
						$this->CreatureTypeName = $typeRow->TypeName;
					}
				}
				
				$query = "SELECT CreatureSubTypeID FROM QuickStatSubTypes WHERE QuickStatID = ".$quick_stat_id;
				if($subTypeResult = mysqli_query($link,$query)) {
					while($subTypeRow = mysqli_fetch_object($subTypeResult)) {
						$this->CreatureSubTypeID[] = $subTypeRow->CreatureSubTypeID;
						$query = "SELECT TypeName FROM CreatureSubTypes WHERE CreatureSubTypeID = ".$subTypeRow->CreatureSubTypeID;
						if($typeResult = mysqli_query($link,$query)) {
							if($typeRow = mysqli_fetch_object($typeResult)) {
								$this->CreatureSubTypeName[] = $typeRow->TypeName;
							}
						}
					}
				}
				
				$this->initiative = (int)$row->Initiative;
				/*
				$this->ac = (int)$row->AC;
				$this->touch =(int) $row->Touch;
				$this->flat_footed = (int)$row->FlatFooted;
				*/
				$this->Armor = (int)$row->Armor;
				$this->DeflectAC = (int)$row->DeflectAC;
				$this->Dodge = (int)$row->Dodge;
				$this->NaturalAC = (int)$row->NaturalAC;
				
					$this->dr = $row->DR;
					$this->sr = (int)$row->SR;
				$this->hd = (int)$row->HD;
				$this->hp = (int)$row->HP;
				$this->asp = (int)$row->ASP;
				$this->dsp = (int)$row->DSP;
					$this->fort = (int)$row->Fort;
					$this->ref = (int)$row->Ref;
					$this->will = (int)$row->Will;
				$this->move = (int)$row->Move;
				$this->swim = (int)$row->Swim;
				$this->fly = (int)$row->Fly;
				$this->space = (int)$row->Space;
				$this->reach = (int)$row->Reach;
					$this->str_mod = (int)$row->StrMod;
					$this->dex_mod = (int)$row->DexMod;
					$this->con_mod = (int)$row->ConMod;
					$this->int_mod =(int)$row->IntMod;
					$this->wis_mod = (int)$row->WisMod;
					$this->cha_mod = (int)$row->ChaMod;
					$this->str = (int)$row->StrMod*2 + 10;
					$this->dex = (int)$row->DexMod*2 + 10;
					$this->con = (int)$row->ConMod*2 + 10;
					$this->int =(int)$row->IntMod*2 + 10;
					$this->wis = (int)$row->WisMod*2 + 10;
					$this->cha = (int)$row->ChaMod*2 + 10;
				$this->bab = (int)$row->BAB;
				$this->cmb = (int)$row->CMB;
					$this->bullrush_b = (int)$row->BullRushB;
					$this->disarm_b = (int)$row->DisarmB;
					$this->grapple_b = (int)$row->GrappleB;
					$this->sunder_b = (int)$row->SunderB;
					$this->trip_b = (int)$row->TripB;
					$this->feint_b = (int)$row->FeintB;					
				$this->cmd = (int)$row->CMD;
					$this->bullrush_d = (int)$row->BullRushD;
					$this->disarm_d = (int)$row->DisarmD;
					$this->grapple_d = (int)$row->GrappleD;
					$this->sunder_d = (int)$row->SunderD;
					$this->trip_d = (int)$row->TripD;
					$this->feint_d = (int)$row->FeintD;
				if($this->sprite_id == null)
				{
					$this->sprite_id = (int)$row->SpriteID;
					$query = "SELECT * FROM Sprites WHERE SpriteID = ".$this->sprite_id;
					if($spriteResult = mysqli_query($link,$query))
					{
						//Get resulting row from query
						$spriteRow = mysqli_fetch_object($spriteResult);
						$this->sprite_file = $spriteRow->FilePathName;
						$this->sprite_scale = floatval($spriteRow->DefaultSpriteScale);
						$this->anim_sprites_index = (int)$spriteRow->AnimSpritesIndex;
					}
				}
				if($this->thumb_pic_id == null) $this->thumb_pic_id = (int)$row->ThumbPicID;
				if($this->portrait_pic_id == null) $this->portrait_pic_id = (int)$row->PortraitPicID;
				if($this->full_pic_id == null) $this->full_pic_id = (int)$row->FullPicID;
				
			} //end if result QuickStats
		} //end get_data_quick_stats
		
		//SKILL
		public function get_data_skill($link, $quick_stat_id) {
			//prepare Query for QuickSkills table
			$query = 'SELECT SkillList.SkillID, QuickSkill.SkillRoll, SkillList.SkillName
						FROM SkillList LEFT JOIN 
							(SELECT * FROM QuickSkill WHERE QuickSkill.QuickStatID = '.$quick_stat_id.') as QuickSkill
							ON SkillList.SkillID = QuickSkill.SkillID
						ORDER BY SkillName';
			//perform QuickStats Query
			if($result = mysqli_query($link,$query)) {
				//successful query
			} //end if result QuickSkills
			else {
				//query fail if no results for QuickSkill table
				// Prepare alternate Query of SkillList table to capture all skill names and ID's
				$query = 'SELECT SkillList.SkillID, SkillList.SkillName FROM SkillList ORDER BY SkillName';
				$result = mysqli_query($link,$query);
			} //end else
			
			//Get resulting row from either the QuickSkills query or the SkillList query to get the skill name
			while ($row = mysqli_fetch_object($result)) {
				$this->arr_skill_id[] = (int)$row->SkillID;
				$this->arr_skill_name[] = $row->SkillName;
				if(isset($row->SkillRoll)) {
					$this->arr_skill_roll[] =(int)$row->SkillRoll;
				}
				else {
					$this->arr_skill_roll[] = 0;
				}
			} //end while
		} //end get_data_skill
		
		//SPECIAL
		public function get_data_special($link, $quick_stat_id) {
			//prepare Query for QuickSpecial table
			$query = 'SELECT QuickSpecialID, SpecialName, Description, AnimName 
						FROM QuickSpecial WHERE QuickStatID = '.$quick_stat_id;
			if($result = mysqli_query($link,$query)) {
				while($row = mysqli_fetch_object($result)) {
					$this->arr_special_id[] = $row->QuickSpecialID;
					$this->arr_special_name[] = $row->SpecialName;
					$this->arr_special_description[] = $row->Description;
					$this->arr_special_animname[] = $row->AnimName;
					if(function_exists('EffectQuery'))
					{
						$this->arr_special_effect[] = EffectQuery($link, 'EffectsAbilities', 'QuickSpecialID', $row->QuickSpecialID);
					}
					else
					{
						$this->arr_special_effect[] = 0;
					}
				} //end while
			} //end if isset result
		} //end get_data_special
		
		//ATTACK
		public function get_data_attack($link, $quick_stat_id) {
			//perform QuickAttack Query
			$query = 'SELECT * FROM QuickAttack WHERE QuickStatID = '.$quick_stat_id;
			if($result = mysqli_query($link,$query)) {
				while($row = mysqli_fetch_object($result)) {
					$this->arr_quick_attack_id[] = (int)$row->QuickAttackID;
					$this->arr_attack_name[] = $row->AttackName;
					$this->arr_damage_die_type[] = (int)$row->DamageDieType;
					$this->arr_damage_die_num[] = (int)$row->DamageDieNum;
					$this->arr_damage_mod[] = (int)$row->DamgeMod;
					$this->arr_equipped[] = (int)$row->Equipped;
					$this->arr_off_hand[] = (int)$row->OffHand;
					$this->arr_two_hand[] = (int)$row->TwoHand;
					$this->arr_crit_range[] = (int)$row->CritRange;
					$this->arr_crit_mult[] = (int)$row->CritMult;
					$this->arr_range_base[] = (int)$row->RangeBase;
					$this->arr_thrown[] = (int)$row->Thrown;
					$this->arr_flurry[] = (int)$row->Flurry;
					$this->arr_weapon_id[] = (int)$row->WeaponID;
					$this->arr_attack_effect[] = 0;
					
					if($row->WeaponID != -1)
					{
						//get WeaponTypeID and WeaponClassID
						$queryWeapon = 'SELECT Weapon.WeaponTypeID, Weapon.WeaponClassID FROM Weapon WHERE WeaponID = '.$row->WeaponID;
						if($resultWeapon = mysqli_query($link, $queryWeapon)) {
							
							$rowWeapon = mysqli_fetch_object($resultWeapon);
							$this->weapon_type_id[] = (int)$rowWeapon->WeaponTypeID;
							$this->weapon_class_id[] = (int)$rowWeapon->WeaponClassID;
						} //end of resultWeapon
					}
					else
					{
						$this->weapon_type_id[] = -1;
						$this->weapon_class_id[] = -1;
					}
					
					//for each QuickAttack, query QuickAttackHitRolls to get list of multiple attack rolls
					$query = 'SELECT * FROM QuickAttackHitRolls 
								WHERE QuickAttackID = '.$row->QuickAttackID.' 
								ORDER BY AttackBonus DESC';
					if($hit_roll_result = mysqli_query($link,$query)) {
						$arr_attack_roll = array();
						while($row = mysqli_fetch_object($hit_roll_result)) {
							$arr_attack_roll[] = (int)$row->AttackBonus;
						} //end while
						$this->arr_attack_bonus[] = $arr_attack_roll;
					} //end if result QuickAttackHitRolls
				} //end while
			} //end if result QuickAttack
		} //end get_data_attack
		
		
		public function get_data_items($link, $quick_stat_id)
		{
			$this->arr_quick_items_id = array('weapon' => array(), 'armor' => array(), 'equipment' => array());
			$query = 'SELECT * FROM QuickStatItems WHERE QuickStatID = '.$quick_stat_id;
			if($result = mysqli_query($link,$query)) {
				while($row = mysqli_fetch_object($result)) {
					$row->ItemID = (int)$row->ItemID;
					$this->arr_quick_items_id[$row->ItemType][] = $row->ItemID;
				}
			}
		}
		
		//GET CharacterStatus by CharacterID
		
	} //end Quick_Stat

?>