<!DOCTYPE html>

<html>
	<!-- v12 -->
	<head>
		
		<title>PlaneScape Online</title>
		
		<script src="./js/jquery-2.1.3.min.js"></script>
		
		<!-- fonts -->
		<link rel="stylesheet" href="./stylesheet.css" type="text/css" charset="utf-8" />
		
		<link href="./css/main.css" rel="stylesheet" type="text/css" />
		
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		
	</head>
	<body style="background-color:#000; color:#eee; font-family:sans-serif; letter-spacing:normal;">
		
		<script src="./js/mobile_zoom.js"></script>
		
		<div style="position:fixed; text-align:center; bottom:60px; width:100%;">
			<span class="button" onclick="pageNext();">Next</span>
		</div>
		
		<div style="text-align:center; width:544px; margin:0 auto;">
		
			<div data-pageNumber="1" class="page page-selected">
				<h1 style="font-family:exocetheavy;">How to Play</h1>
				
				<br/>
				
				<h2>Movement</h2>
				<h3>Computer Keyboard / Phone Touch Buttons</h3>
				<br/>
				<img style="margin-right:25px; position:relative; top:-30px; width:200px;" src="./images/tutorial/keyboard_arrow_keys.png"/>
				<img style="margin-left:25px; width:200px;" src="./images/graphic/mobile_movement.png"/>
			</div>
			
			<div data-pageNumber="2" class="page">
				<table style="width:544px; margin:0 auto; text-align:center;">
				<tr><td colspan="2"><h2>Top Bar</h2><br/></td></tr>
				<tr><td style="width:50%;">Left<br/><br/><h3 style="margin-top:0;">Character status</h3><br/></td><td style="width:50%;">Right<br/><br/><h3 style="margin-top:0;">Buttons</h3><br/></td></tr>
				<tr><td><li>Hearts represent your health</li><br/></td><td><li>Save button saves your game</li><br/></td></tr>
				<tr><td><li>The bars show your magical energy</li><br/></td><td><li>Menu opens the <b>Character Menu</b></li><br/></td></tr>
				<tr><td colspan="2">
					<br/>
					<br/>
					<img style="margin:0 auto;" src="./images/tutorial/top_buttons.png"/>
					<br/>
					<br/>
				</td></tr>
				<tr><td><i>hover mouse overtop to see the numerical value</i></td><td></td></tr>
				</table>
			</div>
			
			<div data-pageNumber="3" class="page">
				<table style="width:544px; margin:0 auto; text-align:center;">
				<tr><td colspan="2"><h2>Character Menu</h2></td></tr>
				<tr><td colspan="2"><img style="margin:0 auto;" src="./images/tutorial/menu.png"/></td></tr>
				<tr><td colspan="2">
					<br/>
					<h2 style="margin:0;">Status</h2>
					Shows your character sheet
				</td></tr>
				<tr>
					<td style="width:50%;">
						<br/>
						<h2 style="margin:0;">Items</h2>
						Shows the contents of your backpack
					</td>
					<td style="width:50%;">
						<br/>
						<h2 style="margin:0;">Equip</h2>
						Select what equipment you are using
					</td>
				</tr>
				<tr><td colspan="2">
					<br/>
					<h2 style="margin:0;">Abilities</h2>
					View and use your special skills
				</td></tr>
				</table>
			</div>
			
			<div data-pageNumber="4" class="page">
				<h2>Conversations</h2>
				<p>Some characters have things to talk about. Click/Tap them or their speech bubble to begin talking to them</p>
				<br/>
				<br/>
				<img src="./images/tutorial/talk.png"/>
			</div>
			
		</div>
		
	</body>
</html>

<style>
.page{
	display:none;
}
.page-selected{
	display:block;
}
</style>

<script>

var pageNumber = 1;

var pageNext = function()
{
	$('.page[data-pageNumber = '+pageNumber+']').removeClass('page-selected');
	pageNumber++;
	$('.page[data-pageNumber = '+pageNumber+']').addClass('page-selected');
}

</script>