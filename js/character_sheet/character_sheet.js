/*
	****************************************
	Webform validation for "character_sheet" form in character_sheet.php

	Author: Mike Bezeau
	Date:   7/01/2011
	

	********************
	Global variable list:
	
	The following variables are the id numbers for the characters 6 main attributes
		STR_ID = 0
		DEX_ID = 1
		CON_ID = 2
		INT_ID = 3
		WIS_ID = 4
		CHA_ID = 5

	csForm
		the 'character_sheet' form element
	
	bab
		base attack bonus (bab), common stat used to update many totals
		
	size
		characters size modifier, common stat used to update many totals
   
   
	********************
	Function List:

	init_character_sheet()
		Set up event listeners for all numerical input fields
	
	validNumPositive(element) 
		Use regular expression to test if string is vaild unsigned integer, max 2 digits
	
	validNum(element)
		Use regular expression to test if string is vaild poitive or negative integer, max 2 digits
	
	The following event handlers are called onchange, for elements of that class.
	i.e. skillChanged fires when any input field of class="skill" is changed, such as the skill rank and modifiers
	In all event handlers, validation is checked before allowing change to be made.
		skillChanged()

		ACChanged()

		cmdChanged()

		cmbChanged()

		cmModifierChanged()

		fortSaveChanged()

		refSaveChanged()

		willSaveChanged()

		initChanged()

	When the attributes are changed, many readonly input fields are changed to reflect new attribute score
		strChanged()
			call calcAttributeTotalAndSkills(STR_ID)
			Update:
				combat modifier defense (cmd) -> str mod, call calcCmd() (all calc function update total)
				combat modifier bonus (cmb) -> str mod, call calcCmb() to update total cmb
				melee attack modifier & melee attack total
			
		dexChanged()
			call calcAttributeTotalAndSkills(DEX_ID)
			Update:
				armor class (ac) -> dex mod, call calcAC() to update total
				combat modifier defense (cmd) -> dex mod, call calcCmd()
				reflex save -> dex mod, call calcRefSave()
				ranged attack modifier & ranged attack total
				initiative, call calcInit();
			
		conChanged()
			call calcAttributeTotalAndSkills(CON_ID)
			Update:
				fortitude save -> con mod, call calcFortSave()
		
		intChanged()
			call calcAttributeTotalAndSkills(INT_ID)
			Update:				
				skill points
				intelligence ability saving throw DC's
				
		wisChanged()
			call calcAttributeTotalAndSkills(WIS_ID)
			Update:
				willpower save -> wis mod, call calcWillSave()
				wisdom ability saving throw DC's
			
		chaChanged()
			call calcAttributeTotalAndSkills(CHA_ID)
			Update:
				charisma ability saving throw DC's
			
	Following functions are called to re-calculate totals when valid changes are made
	
		calcAC()
			calculate normal ac total
			carry updated modifiers through to readonly input fields for:
				touch ac (then calculate total)
				flat-footed ac (then calculate total)
				
		calcCmd()

		calcCmb()

		calcFortSave()

		calcRefSave()

		calcWillSave()

		calcInit()

		calcAttributeTotalAndSkills(attributeId)
			Update:
				attribute total & attribute modifier (given attributeId)
				skills attribute modifiers
					loop through skills that use this attribute modifier and set new modifier
					calculate each total skill roll by calling totalSkill(skillId)
			
		totalSkill(skillId)
			update total skill roll given skillId
*/

//must call init from html because main_nav uses onload
//window.onload = init_character_sheet;

var STR_ID = 0;
var DEX_ID = 1;
var CON_ID = 2;
var INT_ID = 3;
var WIS_ID = 4;
var CHA_ID = 5;

var csForm;
var bab;
var size;

function init_character_sheet() {
	//cs = character sheet
	csForm = document.forms["character_sheet"];
	bab = parseInt(csForm.total_bab.value);
	size = parseInt(csForm.size_mod.value);
	
	var allElems = document.getElementsByTagName("input");
	for(var i = 0; i < allElems.length; i++) {
		
		//if any numeric field contains an empty string set value = 0
		if(allElems[i].className != "text" && allElems[i].value == "") {
			allElems[i].value = 0;
		} //end if
		
		//check if skill element
		if(allElems[i].className == "skill") {
			//add event listeners to update each skill roll total
			allElems[i].onchange = skillChanged;
		} //end if
		
		//ac element
		else if(allElems[i].className == "ac") {
			allElems[i].onchange = ACChanged;
		} //end else if
		
		//cmd element
		else if(allElems[i].className == "cmd") {
			allElems[i].onchange = cmdChanged;
		} //end else if
		
		//cmb element
		else if(allElems[i].className == "cmb") {
			allElems[i].onchange = cmbChanged;
		} //end else if

		//combat modifer bonus
		else if(allElems[i].className == "cmModifier") {
			allElems[i].onchange = cmModifierChanged;
		} //end else if
		
		//fort save
		else if(allElems[i].className == "fort_save") {
			allElems[i].onchange = fortSaveChanged;
		} //end else if
		
		//ref save
		else if(allElems[i].className == "ref_save") {
			allElems[i].onchange = refSaveChanged;
		} //end else if
		
		//will save
		else if(allElems[i].className == "will_save") {
			allElems[i].onchange = willSaveChanged;
		} //end else if
		
		//will save
		else if(allElems[i].id == "init_bonus") {
			allElems[i].onchange = initChanged;
		} //end else if
		
		//else check if attribute element
		else {
			//add event listeners to update each attribute total
			switch(allElems[i].className) {
				//strength value
				case "0_attribute": {
					allElems[i].onchange = strChanged;
					break;
				} //end case
				
				//dexterity value
				case "1_attribute": {
					allElems[i].onchange = dexChanged;
					break;
				} //end case
				
				//constitution value
				case "2_attribute": {
					allElems[i].onchange = conChanged;
					break;
				} //end case
				
				//inteligence value
				case "3_attribute": {
					allElems[i].onchange = intChanged;
					break;
				} //end case
				
				//wisdom value
				case "4_attribute": {
					allElems[i].onchange = wisChanged;
					break;
				} //end case
				
				//charisma value
				case "5_attribute": {
					allElems[i].onchange = chaChanged;
					break;
				} //end case
			} //end switch
		} //end else
	} //end for allElems
} //end init

function validNumPositive(element) {
	regEx = /^\d{1,2}$/;
	if(regEx.test(element.value)) {
		return true;
	} //end if test pass
	else {
		element.value = 0;
		setTimeout("document.getElementById('" + element.id + "').select();",1);
		return false;
	} //end else
} //end validNum

function validNum(element) {
	regEx = /^-?\d{1,2}$/;
	if(regEx.test(element.value)) {
		return true;
	} //end if test pass
	else {
		element.value = 0;
		setTimeout("document.getElementById('" + element.id + "').select();",1);
		return false;
	} //end else
} //end validNum

function skillChanged() {
	validNum(this);
	var skillId = parseInt(this.id);
	totalSkill(skillId);
} //end skillChanged

function ACChanged() {
	validNum(this);
	calcAC();
} //end ACChanged 

function cmdChanged() {
	validNum(this);
	calcCmd();
} //end cmdChanged

function cmbChanged() {
	validNum(this);
	calcCmb();
} //end cmbChanged

function cmModifierChanged() {
	validNum(this);
} //end cmbChanged

function fortSaveChanged() {
	validNum(this);
	calcFortSave();
} //end fortSaveChanged

function refSaveChanged() {
	validNum(this);
	calcRefSave();
} //end refSaveChanged

function willSaveChanged() {
	validNum(this);
	calcWillSave();
} //end willSaveChanged

function initChanged() {
	validNum(this);
	calcInit();
} //end initChanged
			
function strChanged() {
	//if input field is attribute value only allow posotive numbers
	if(this.id == STR_ID + "_attribute_value") {
		validNumPositive(this);
	} //end if
	//else allow negative numbers for modifiers
	else {
		validNum(this);
	} //end else
	
	calcAttributeTotalAndSkills(STR_ID);
	
	//get new strength modifier
	var strMod = parseInt(document.getElementById(STR_ID + "_attribute_mod").value);
	
	//update all strength modifier fields (strMod)
	//cmd modifier
	document.getElementById("cmd_str_mod").value = strMod;
	calcCmd();
	//cmb modifier
	document.getElementById("cmb_str_mod").value = strMod;
	calcCmb();
	//melee attack modifier
	document.getElementById("melee_str_mod").value = strMod;
	//melee attack total
	total = strMod + bab + size;
	document.getElementById("melee_total").value = total;
} //end strengthChanged

function dexChanged() {
	//if input field is attribute value only allow posotive numbers
	if(this.id == DEX_ID + "_attribute_value") {
		 validNumPositive(this);
	} //end if
	//else allow negative numbers for modifiers
	else {
		validNum(this);
	} //end else
	
	calcAttributeTotalAndSkills(DEX_ID);
	
	//get new dexterity modifier
	var dexMod = parseInt(document.getElementById(DEX_ID + "_attribute_mod").value);
	
	//update all dexterity modifier fields (dexMod)
	//ac dex mod
	document.getElementById("ac_dex_mod").value = dexMod;
	calcAC();
	
	//cmd modifier
	document.getElementById("cmd_dex_mod").value = dexMod;
	calcCmd();
	
	//reflex save dex mod
	document.getElementById("ref_dex_mod").value = dexMod;
	calcRefSave();
	
	//ranged attack modifier
	document.getElementById("ranged_dex_mod").value = dexMod;
	//ranged attack total
	total = dexMod + bab + size;
	document.getElementById("ranged_total").value = total;
	
	//initiative
	calcInit();
} //end dexterityChanged

function conChanged() {
	//if input field is attribute value only allow posotive numbers
	if(this.id == CON_ID + "_attribute_value") {
		validNumPositive(this);
	} //end if
	//else allow negative numbers for modifiers
	else {
		validNum(this);
	} //end else
	
	calcAttributeTotalAndSkills(CON_ID);

	//get new consitution modifier
	var conMod = parseInt(document.getElementById(CON_ID + "_attribute_mod").value);
	
	//update all consitution modifier fields (wisMod)
	//fortitude save con mod
	document.getElementById("fort_con_mod").value = conMod;
	calcFortSave();
} //end conChanged

function intChanged() {
	//if input field is attribute value only allow posotive numbers
	if(this.id == INT_ID + "_attribute_value") {
		validNumPositive(this);
	} //end if
	//else allow negative numbers for modifiers
	else {
		validNum(this);
	} //end else
	
	calcAttributeTotalAndSkills(INT_ID);

	//get new intelligence modifier
	var intMod = parseInt(document.getElementById(INT_ID + "_attribute_mod").value);
	
	//update all intelligence modifier fields (intMod)
	//skill points
	
	
	//int ability save DC's
	for(var i = 0; i < 10; i++) {
		document.getElementById("ability_" + INT_ID + "_level_" + i).value = (i + 10 + intMod);
	} //end for i
} //end intChanged

function wisChanged() {
	var pass;
	//if input field is attribute value only allow posotive numbers
	if(this.id == WIS_ID + "_attribute_value") {
		validNumPositive(this);
	} //end if
	//else allow negative numbers for modifiers
	else {
		validNum(this);
	} //end else
	
	calcAttributeTotalAndSkills(WIS_ID);
	
	//get new wisdom modifier
	var wisMod = parseInt(document.getElementById(WIS_ID + "_attribute_mod").value);
	
	//update all wisdom modifier fields (wisMod)
	//willpower save wis mod
	document.getElementById("will_wis_mod").value = wisMod;
	calcWillSave();
	
	//wis ability save DC's
	for(var i = 0; i < 10; i++) {
		document.getElementById("ability_" + WIS_ID + "_level_" + i).value = (i + 10 + wisMod);
	} //end for i
} //end wisChanged

function chaChanged() {
	var pass;
	//if input field is attribute value only allow posotive numbers
	if(this.id == CHA_ID + "_attribute_value") {
		validNumPositive(this);
	} //end if
	//else allow negative numbers for modifiers
	else {
		validNum(this);
	} //end else
	
	calcAttributeTotalAndSkills(CHA_ID);
	
	//get new charisma modifier
	var chaMod = parseInt(document.getElementById(CHA_ID + "_attribute_mod").value);
	
	//update all charisma modifier fields (chaMod)
	//cha ability save DC's
	for(var i = 0; i < 10; i++) {
		document.getElementById("ability_" + _ID + "_level_" + i).value = (i + 10 + chaMod);
	} //end for i
} //end chaChanged

function calcAC() {
	//normal AC
	bonus = parseInt(document.getElementById("ac_bonus").value);
	shield = parseInt(document.getElementById("ac_shield").value);
	dexMod = parseInt(document.getElementById("ac_dex_mod").value);
	dodge = parseInt(document.getElementById("ac_dodge").value);
	natural = parseInt(document.getElementById("ac_natural").value);
	deflect = parseInt(document.getElementById("ac_deflect").value);
	total = 10 + bonus + shield + dexMod + size + dodge + natural + deflect;
	document.getElementById("ac_total").value = total;
	//touch AC
	document.getElementById("touch_dex_mod").value = dexMod;
	document.getElementById("touch_dodge").value = dodge;
	document.getElementById("touch_deflect").value = deflect;
	total = 10 + dexMod + size + dodge + deflect;
	document.getElementById("touch_total").value = total;
	//flat-footed AC
	document.getElementById("ff_bonus").value = bonus;
	document.getElementById("ff_shield").value = shield;
	document.getElementById("ff_natural").value = natural;
	document.getElementById("ff_deflect").value = deflect;
	total = 10 + bonus + shield + size + natural + deflect;
	document.getElementById("ff_total").value = total;
} //end calcAC

function calcCmd() {
	strMod = parseInt(document.getElementById("cmd_str_mod").value);
	dexMod = parseInt(document.getElementById("cmd_dex_mod").value);
	cmdmod = parseInt(document.getElementById("cmdmod").value);
	total = 10 + strMod + dexMod + bab + size + cmdmod;
	document.getElementById("total_cmd").value = total;
} //end calcCmd

function calcCmb() {
	strMod = parseInt(document.getElementById("cmb_str_mod").value);
	cmbmod = parseInt(document.getElementById("cmbmod").value);
	total = strMod + bab + size + cmbmod;
	document.getElementById("total_cmb").value = total;
} //end calcCmb

function calcFortSave() {
	var total;
	//update fort save
	fortClass = parseInt(document.getElementById("fort_class").value);
	conMod = parseInt(document.getElementById("fort_con_mod").value);
	bonus = parseInt(document.getElementById("fort_bonus").value);
	mod = parseInt(document.getElementById("fort_mod").value);
	total =  fortClass + conMod + bonus + mod;
	document.getElementById("fort_total").value = total;
} //end calcFortSave

function calcRefSave() {
	var total;
	//update fort save
	refClass = parseInt(document.getElementById("ref_class").value);
	dexMod = parseInt(document.getElementById("ref_dex_mod").value);
	bonus = parseInt(document.getElementById("ref_bonus").value);
	mod = parseInt(document.getElementById("ref_mod").value);
	total =  refClass + dexMod + bonus + mod;
	document.getElementById("ref_total").value = total;
} //end calcFortSave

function calcWillSave() {
	var total;
	//update fort save
	willClass = parseInt(document.getElementById("will_class").value);
	wisMod = parseInt(document.getElementById("will_wis_mod").value);
	bonus = parseInt(document.getElementById("will_bonus").value);
	mod = parseInt(document.getElementById("will_mod").value);
	total =  willClass + wisMod + bonus + mod;
	document.getElementById("will_total").value = total;
} //end calcFortSave

function calcInit() {
	//dex mod
	var dexMod = parseInt(document.getElementById(DEX_ID + "_attribute_mod").value);
	//initiative bonus
	initBonus = parseInt(document.getElementById("init_bonus").value);
	//initiative total
	total = dexMod + initBonus;
	document.getElementById("init_total").value = total;
} //end calcInit

function calcAttributeTotalAndSkills(attributeId) {
	var total;
	var attributeMod;
	//update attribute total
	value = parseInt(document.getElementById(attributeId + "_attribute_value").value);
	bonus = parseInt(document.getElementById(attributeId + "_attribute_bonus").value);
	enhance = parseInt(document.getElementById(attributeId + "_attribute_enhance").value);
	total =  value + bonus + enhance;
	document.getElementById(attributeId + "_attribute_total").value = total;
	//update attribute modifier
	attributeMod = Math.floor((total - 10) * 0.5);
	document.getElementById(attributeId + "_attribute_mod").value = attributeMod;
	//update skills attribute modifiers
	var skillId;
	//get skill list of all skills for that attribute
	skills = document.getElementsByName(attributeId + "_skill_attribute_id");
	//loop through attributes skill list
	for(var i = 0; i < skills.length; i++) {
		//update skills attribute modifier
		skills[i].value = attributeMod;
		//get skill id, then total skill roll
		skillId = parseInt(skills[i].id);
		totalSkill(skillId);
	} //end for i
} //end updateSkillMods

function totalSkill(skillId) {
	//update total skill roll
	ranks = parseInt(document.getElementById(skillId + "_skill_rank").value);
	bonus = parseInt(document.getElementById(skillId + "_skill_bonus").value);
	enhance = parseInt(document.getElementById(skillId + "_skill_enhance").value);
	mod = parseInt(document.getElementById(skillId + "_skill_attribute_bonus").value);
	total =  ranks + bonus + enhance + mod;
	document.getElementById(skillId + "_skill_total").value = total;
}