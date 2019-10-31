var mobile = 0;
var allow_zoom = 0;
//if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
//take out iPad
if(/Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
{
	$('body').addClass('mobile');
	mobile = 1;
	//set zoom for mobile
	var viewportmeta = document.querySelector('meta[name="viewport"]');
	if (viewportmeta)
	{
		viewportmeta.content = 'width=544, user-scalable=0';
	}
	
	if(MenuController)
	{
		MenuController.centerX = Math.floor((544 - 72) / 2);
		MenuController.centerY = Math.floor((544 - 32 - 72) / 2);
	}
	
	// Hides mobile browser's address bar when page is done loading.
  window.addEventListener('load', function(e) {
    setTimeout(function() { window.scrollTo(0, 1); }, 1);
		console.log('scrollTo');
  }, false);
	
	/*
	//adding to eliminate text input browser freeze
	var scroll = 0;    
	var selectors = ".mobile-input-fix";
	$(selectors).bind("touchstart", function (e) {
			scroll = document.body.scrollTop;
	});
	//I stripped away some of Binke's code because we were only having an issue with INPUT controls
	$(selectors).bind("touchend", function (e) {
			if (scroll == document.body.scrollTop) { 
					if (e.target.nodeName.toString().toUpperCase() == 'INPUT') {
							e.preventDefault(); 
							e.target.focus();  
							e.target.setSelectionRange(e.target.value.length, e.target.value.length);
					} 
			}
	});
	$(selectors).bind('keydown', function (e) {
			alert(e.which);
			if (e.which == 8 || e.which == 46) { // BACKSPACE OR DELETE
					$(this).val($(this).val().substring(0, ($(this).val().length - 1)));
					return false;
			}
			else { return true; }
	});
	$(selectors).bind("keypress", function (e) {
			if (e.which != 8 && e.which != 46) {
					$(this).val($(this).val() + String.fromCharCode(e.which));
			}
			return false;
	});
	*/
}

function toggle_zoom()
{
	var viewportmeta = document.querySelector('meta[name="viewport"]');
	if(allow_zoom == 0)
	{
		allow_zoom = 1;
		viewportmeta.content = 'width=544, user-scalable=1';
		$('#game-menu-top-zoom-icon').attr('src','./images/battle_icons/zoom_clicked.png');
	}
	else
	{
		allow_zoom = 0;
		viewportmeta.content = 'width=544, user-scalable=0';
		$('#game-menu-top-zoom-icon').attr('src','./images/battle_icons/zoom.png');
	}
}

var just_testing_mobile = 0;
/*
$('body').addClass('mobile');
mobile = 1;
just_testing_mobile = 1;
*/