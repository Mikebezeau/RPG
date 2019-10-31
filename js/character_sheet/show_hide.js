// toggle visibility of element and corresponding button image
function ShowHide(element_name, button_pic_id) {
	// all elements in element_array will show/hide
	var element_array = [];

	//getElementsByName does not work in IE
	if (navigator.appName == 'Microsoft Internet Explorer') {
	//getElementsByName for IE
		var tag_array = document.all;
		for(var i = 0; i < tag_array.length; i++){
			att = tag_array[i].getAttribute('name');
			if(att == element_name) {
				element_array.push(tag_array[i]);
			} //end if
		} //end for
	} //end if
	//for all other browsers use getElementsByName function
	else {
			element_array = document.getElementsByName(element_name);
	} //end else
	
	// loop through element_name to toggle hide / show
	for (i = 0; i < element_array.length; i++)
	{
		if ((element_array[i].style.display == null) || (element_array[i].style.display == 'block'))
		{
			element_array[i].style.display = 'none';
		} //end if
		else
		{
			element_array[i].style.display = 'block';
		} //end else
	} //end for

    //if image id given, switch the src, toggling between expand_arrow.png and collapse_arrow.png
	if(button_pic_id) {
                //check the first element in the array to see if elements are shown or hidden, change the pic depending
		if ((element_array[0].style.display == null) || (element_array[0].style.display == 'none'))
		{
			document.getElementById(button_pic_id).src = 'images/graphic/expand_arrow.png';		
		} //end if
		else
		{
			document.getElementById(button_pic_id).src = 'images/graphic/collapse_arrow.png';
		} //end else
	} //end if
} //end function