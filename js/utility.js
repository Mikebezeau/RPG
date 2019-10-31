//console.log override
//var preserveConsoleLog = console.log;


if(mobile && !just_testing_mobile)
{
	console.log = function()
	{
		//don't do console.log on mobile
	}
}

function handleError(evt) {
	//if(GameController.dev_mode && mobile)
	if(evt.srcElement.tagName == 'IMG' || evt.target.tagName == 'IMG')
	{
	
	}
	else
	{
		var message;
		var browser = '';
		var userAgent;
		
		if (evt.message)
		{ // Chrome sometimes provides this
			message = "error: "+evt.message +"  at linenumber: "+evt.lineno+" of file: "+evt.filename;
		}
		else
		{
			message = "error: "+evt.type+" from element: "+(evt.srcElement || evt.target);
		}
			
		alert(message);
		
		// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
		// don't borther with this one, coming up if chrome
		//if(!!window.opera || navigator.userAgent.indexOf(' OPR/')) browser += 'Opera ';
		
    // Firefox 1.0+
		if(typeof InstallTrigger !== 'undefined') browser += 'Firefox ';   
		
		// At least Safari 3+: "[object HTMLElementConstructor]"
		if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0)  browser += 'Safari ';
		
		// Chrome 1+
		if(!!window.chrome && browser != 'Opera') browser += 'Chrome ';   
		
		// At least IE6
		if(/*@cc_on!@*/false || !!document.documentMode) browser += 'IE '; 

		if(browser == '') browser = 'unknown';
		
		userAgent += "Browser CodeName: " + navigator.appCodeName + " / ";
		userAgent += "Browser Name: " + navigator.appName + " / ";
		userAgent += "Browser Version: " + navigator.appVersion + " / ";
		userAgent += "Cookies Enabled: " + navigator.cookieEnabled + " / ";
		userAgent += "Browser Language: " + navigator.language + " / ";
		userAgent += "Browser Online: " + navigator.onLine + " / ";
		userAgent += "Platform: " + navigator.platform + " / ";
		userAgent += "User-agent header: " + navigator.userAgent;
		
		ajax_action('errors/error_save.php',0,{'mobile':window.mobile, 'browser':browser, 'userAgent':userAgent, 'message':message})
	}
}

window.addEventListener("error", handleError, true);


function ajax_action(file_name,id,data,callback,async)
{
	if(arguments.length < 5) async = true;
	if(arguments.length < 4) callback = function(data){};
	$.ajax({
		type: "POST",
		async: async,
		url: "./php/"+file_name,
		data: {'id' : id, 'data' : JSON.stringify(data)}
	})
		.done(function(data) { 
				callback(data);
			});
}

// toggle visibility of element and corresponding button image
function ShowHide(element_name, button_pic_id)
{
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