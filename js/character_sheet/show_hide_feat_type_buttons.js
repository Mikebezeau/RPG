// toggle visibility of element and corresponding button image
function ShowHide_Feat_Type_Buttons(button_name) {
	
	// 'Prayer' 'Achievement' 'Combat' 'General' 'Item Creation' 'Local' 'Metamagic' 'Monster'
	//all div dropdown elements
	var prayer_div = document.getElementById('Prayer');
	var achievement_div = document.getElementById('Achievement');
	var combat_div = document.getElementById('Combat');
	var general_div = document.getElementById('General');
	var item_creation_div = document.getElementById('Item Creation');
	var local_div = document.getElementById('Local');
	var metamagic_div = document.getElementById('Metamagic');
	var monster_div = document.getElementById('Monster');
	
	//div element for selected button
	var showhide_div = document.getElementById(button_name);

	//hide all drop down divs
	prayer_div.style.display = 'none';
	achievement_div.style.display = 'none';
	combat_div.style.display = 'none';
	general_div.style.display = 'none';
	item_creation_div.style.display = 'none';
	local_div.style.display = 'none';
	metamagic_div.style.display = 'none';
	monster_div.style.display = 'none';
	//show the dropdown div for the button pressed
	showhide_div.style.display = 'block';
	
} //end function