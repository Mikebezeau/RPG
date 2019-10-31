<!DOCTYPE html>

<html>
	<!-- v12 -->
	<head>
		
		<title>PlaneScape Online</title>
		<link rel="shortcut icon" href="./favi.ico">
		
		<script src="./js/jquery-2.1.3.min.js"></script>
		
		<!-- fonts -->
		<link rel="stylesheet" href="./stylesheet.css" type="text/css" charset="utf-8" />
		
		<link href="./css/main.css" rel="stylesheet" type="text/css" />
		<link href="./css/quick_stats_view.css" rel="stylesheet" type="text/css" />
		<link href="./css/font_awesome.css" rel="stylesheet" type="text/css" />
		<link href='https://fonts.googleapis.com/css?family=Petit+Formal+Script' rel='stylesheet' type='text/css'>
		
		<!-- 
		<script src="./js/jquery.mobile-1.4.5.min.js"></script>
    <link href="http://code.jquery.com/mobile/1.3.0/jquery.mobile-1.3.0.css" rel="stylesheet"/>
    <link href="http://code.jquery.com/mobile/1.3.0/jquery.mobile.structure-1.3.0.min.css" rel="stylesheet"/>
		CREATE IMAGES FOR ICONS 
		<link rel="apple-touch-icon" href="touch-icon-iphone.png"> 57 pixels by 57
		<link rel="apple-touch-icon" sizes="76x76" href="touch-icon-ipad.png">
		<link rel="apple-touch-icon" sizes="120x120" href="touch-icon-iphone-retina.png">
		<link rel="apple-touch-icon" sizes="152x152" href="touch-icon-ipad-retina.png">
		-->
		<!-- STARTUP IMAGE
		On iPhone and iPod touch, the image must be 320 x 480 pixels and in portrait orientation.
		<link rel="apple-touch-startup-image" href="/startup.png">
		<link rel="apple-touch-icon-precomposed" href="/static/images/identity/HTML5_Badge_64.png" />
		-->

		<script src="./js/game_controller.js?v12"></script>
		<script src="./js/game_editor_controller.js"></script>
		<script src="./js/character_controller.js?v2"></script>
		<script src="./js/sprite_anim_controller.js"></script>
		<script src="./js/canvas_effect_anim_controller.js"></script>
		<script src="./js/menu.js"></script>
		<script src="./js/menu_battle.js"></script>
		<script src="./js/shop_controller.js"></script>
		<script src="./js/quick_stats_player_view.js"></script>
		<script src="./js/conversation_editor.js"></script>
		<script src="./js/event_editor.js"></script>
		<script src="./js/battle_controller.js?v12"></script>
		<script src="./js/action_controller.js"></script>
		<script src="./js/jscolor/jscolor.js"></script>
		<script src="./js/effect_controller.js"></script>
		<script src="./js/weather_controller.js"></script>
		<script src="./js/equipment_controller.js"></script>
		<script src="./js/cutscene_controller.js"></script>
		
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		
	</head>
	
	<body style="background-color: #000; color:#fff;">

		<script src="./js/mobile_zoom.js"></script>
		<script src="./js/utility.js"></script>
		
		<div id="body-background"></div>
		
		<div id="image-preload" style="pointer-events:none; position:absolute; right:0; width:64px; height:500px; overflow-y:scroll; opacity:0;"></div>
		
		<div id="edit-level-side-bar" style="position:absolute; top:75px; right:0; z-index:1000; width:544px; background-color:#000; display:none;">
			
			<div>
				<span class="menu-button" data-show-id="edit-main">Main</span>
				<span class="menu-button" data-show-id="edit-terrain">Terrain</span>
				<span id="menu-button-edit-objects" class="menu-button" data-show-id="edit-objects">Objects</span>
				<span class="menu-button" data-show-id="edit-npc-monster">NPCs & Monsters</span>
				<span class="menu-button" data-show-id="edit-conversation" id="show-edit-conversation">Edit Conversations</span>
				<span class="menu-button" data-show-id="edit-event" id="show-edit-event">Edit Events / Place Items</span>
				<span class="menu-button" data-show-id="edit-descriptions" id="show-edit-descriptions">Edit Descriptions</span>
				<!--
				<input type="text" value="3" id="test-burst-size" style="width:30px;"/><button id="test-burst" type="button">Test Burst</button>
				-->
				<div>
					Info<br/><textarea id="output-mapinfo" style="width:80%; height:50px;"></textarea>
				</div>
				<div id="object-layer-controls-load"></div>
			</div>
			
			<div id="edit-main" class="toggle-menu" style="display:none;">
				<span id="select-start-point" class="sub-menu-button">Select Start Point</span>
				<span id="test-wall-graphics" class="menu-style-button">Toggle Map Graphics</span>
				<br/>
				
				<form id="edit-map-settings">
					<div>Has Map <input type="checkbox" id="HasMap" name="HasMap" value="1"/></div>
					<div>Use Los <input type="checkbox" id="UseLos" name="UseLos" value="1"/></div>
					<div>Display Map Memory <input type="checkbox" id="MapMemory" name="MapMemory" value="1"/></div>
					<br/>
					<div>Battle BG Index <input type="input" id="BattleBgIndex" name="BattleBgIndex" value="20"/></div>
					<br/>
					<div>
						<table style="text-align:left; margin:0 auto;">
							<tr><td>Darnkess</td><td>Value</td></tr>
							<tr><td>Normal</td><td style="text-align:center;"><input type="radio" name="DarknessFactor" value="1"/></td></tr>
							<tr><td>Dim</td><td style="text-align:center;"><input type="radio" name="DarknessFactor" value="0.7"/></td></tr>
							<tr><td>Dark</td><td style="text-align:center;"><input type="radio" name="DarknessFactor" value="0.3"/></td></tr>
						</table>
					</div>
					<br/>
					<div>
						<table style="text-align:left; margin:0 auto;">
							<tr><td>Weather Types</td><td></td><td>% Chance</td></tr>
							<tr><td>Mist</td><td style="text-align:center;"><input type="checkbox" id="HasMist" name="HasMist" value="1"/></td><td style="text-align:center;"><input style="width:100px;" type="input" name="ChanceMist" value="100"/></td></tr>
							<tr><td>Rain</td><td style="text-align:center;"><input type="checkbox" id="HasRain" name="HasRain" value="1"/></td><td style="text-align:center;"><input style="width:100px;" type="input" name="ChanceRain" value="100"/></td></tr>
						</table>
					</div>
				</form>
				
				<br/>
				<span class="sub-menu-button" data-show-id="edit-save-load">Save</span>
				<span class="sub-menu-button" data-show-id="edit-new-map">New Map</span>
				
				<div class="edit-save-load toggle-sub-menu" style="display:none;">
					<!--
					<div>
						Name: <input id="load-area-id" style="width:150px;" value="???"/>
					</div>
					<hr/>
					<span id="load-map" class="menu-style-button">Load Map</span>
					<hr/>
					-->
					<div>Description</div>
					<div><textarea id="map-description" style="width:80%;">???</textarea></div>
					Name: <input id="map-id" style="width:150px;" value="???"/>
					<input type="hidden" id="area-id" value="???"/>
					<span id="save-map" class="menu-style-button">Save Map</span>
				</div>
				
				<div class="edit-new-map toggle-sub-menu" style="display:none;">
					<div>
						Name: <input id="map-id-new" style="width:150px;" value="Enter Map Name"/><br/>
						Width: <input id="map-width" style="width:50px;" value="30"/><br/>
						Height: <input id="map-height" style="width:50px;" value="30"/><br/>
						<span id="create-new-map" class="menu-style-button">Create Map</span>
					</div>
				</div>
				
			</div>
			
			<div id="edit-terrain" class="toggle-menu" style="display:none;">
				
				<span id="place-map-walls" class="sub-menu-button" data-show-id="edit-terrain-walls">Walls</span>
				<span id="place-map-pits" class="sub-menu-button" data-show-id="edit-terrain-pits">Pits</span>
				<span id="place-map-floors" class="sub-menu-button" data-show-id="edit-terrain-floors">Floors</span>
				<span id="place-map-doors" class="sub-menu-button">Place Doors</span>
				
				<div class="edit-terrain-walls toggle-sub-menu" style="display:none;">
					Click on map to place wall tile<br/>
					<span id="wall-select" class="menu-style-button">Change Wall Type</span>
					<canvas id="current-wall-type"></canvas>
					<span id="cancel-current-wall-type" class="menu-style-button"><i class="fa fa-times"></i></span>
				</div>
				<div class="edit-terrain-pits toggle-sub-menu" style="display:none;">
					Click on map to place pit tile<br/>
					<span id="pit-select" class="menu-style-button">Change Pit Type</span>
					<canvas id="current-pit-type"></canvas>
					<span id="cancel-current-pit-type" class="menu-style-button"><i class="fa fa-times"></i></span>
				</div>
				<div class="edit-terrain-floors toggle-sub-menu" style="display:none;">
					Click on map to place floor tile<br/>
					<span id="floor-select" class="menu-style-button">Change Floor Type</span>
					<canvas id="current-floor-type"></canvas>
					<span id="cancel-current-floor-type" class="menu-style-button"><i class="fa fa-times"></i></span>
				</div>
				
				<span id="fill-map-area" class="menu-style-button edit-terrain-walls edit-terrain-pits edit-terrain-floors" style="display:none;">Click to Fill With Selected Terrain</span>
				
			</div>
			
			<div id="edit-objects" class="toggle-menu" style="display:none;">
				<span id="place-object" class="menu-style-button">Place Object</span>
				<div style="background-color:#003;">
					Currently Placing/Removing on:
					<span id="object-toggle-place-facade-or-object" class="menu-style-button">Object Layer</span>
					<div id="object-select-layer">
						Background<input name="object-layer" type="radio" value="0" checked="checked"/> 
						Midground<input name="object-layer" type="radio" value="1"/> 
						Foreground<input name="object-layer" type="radio" value="2"/> 
					</div>
				</div>
				<span id="remove-object" class="menu-style-button">Remove Objects</span>
				<hr/>
				<span id="toggle-objects" class="menu-style-button">Toggle Objects</span>
				<span id="toggle-facade" class="menu-style-button">Toggle Roofs & Wall Covering</span>
				<hr/>
				<span id="object-layer-show-fg" class="menu-style-button">Show only Foreground Objects</span>
				<span id="object-highlight-roof" class="menu-style-button">Highlight All Roof Tiles</span>
				<hr/>
				<span id="toggle-object-layer-click" class="menu-style-button">Reverse Roof/Objects Layers</span>
				<span id="object-layer-make-bg" class="menu-style-button">Make All Objects in background</span>
			</div>
			
			<!--<div>
				<input type="radio" id="draw-line" name="draw-style" checked="checked"/>Line
				<input type="radio" id="draw-square" name="draw-style"/>Square
			</div>-->
			
			<div id="edit-npc-monster" class="toggle-menu" style="display:none;">
				<span id="btn-edit-npc-monster" class="menu-style-button">Edit NPC/Monster</span>
				<hr/>
				<span id="place-monster" class="menu-style-button">Place Monster</span>
				<span id="create-monster" class="menu-style-button">Create Monster</span>
				<div id="load-place-monster-selection"></div>
				<hr/>
				<span id="place-npc" class="menu-style-button">Place NPC</span>
				<span id="create-npc" class="menu-style-button">Create NPC</span>
				<div id="load-place-npc-selection"></div>
				<hr/>
				<span id="place-pc" class="menu-style-button">Place PC</span>
				<span id="create-pc" class="menu-style-button">Create PC</span>
				<!--<span id="create-npc" class="menu-style-button">Create PC</span>-->
				<div id="load-place-pc-selection"></div>
				<a id="edit-pc" href="" target="_blank"><span id="" class="menu-style-button">Edit PC</span></a>
				<hr/>
				<span id="delete-npc-monster" class="menu-style-button">Delete NPC/Monster</span><br/>
				<span id="move-npc-monster" class="menu-style-button">Move NPC/Monster</span><br/>
			</div>
			
			<div id="object-select-container" style="position:absolute;background-color:#000; height:544px; width:544px; overflow:scroll; left:0; top:0px; z-index:21000; display:none;">
				<div>
					<span id="object-select-tileset-select" class="menu-style-button">Select Tileset</span>
					<span id="object-select-close" class="menu-style-button">Close</span>
				</div>
				<div id="object-tileset-select-container" style="display:none;">
					<span class="object-tileset-select menu-style-button" data-tileset-index="0">Basic</span>
					<br/>
					<span class="object-tileset-select menu-style-button" data-tileset-index="1">House 1</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="3">House 2</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="2">Castle 1</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="29">Castle Ravenloft</span>
					<br/>
					<span class="object-tileset-select menu-style-button" data-tileset-index="14">Indoor 1</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="15">Indoor Rich 1</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="27">Assorted</span>
					<br/>
					<span class="object-tileset-select menu-style-button" data-tileset-index="11">Outdoor1</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="4">Bridge</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="12">Outdoor Constructs 1</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="24">Cavern</span>
					<br/>
					<span class="object-tileset-select menu-style-button" data-tileset-index="13">Ladder Bridge Stairs 1</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="16">Forest 1</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="30">Forest</span>
					<br/>
					<span class="object-tileset-select menu-style-button" data-tileset-index="17">Evil</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="25">Evil 2</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="26">Evil 3</span>
					<br/>
					<span class="object-tileset-select menu-style-button" data-tileset-index="18">Cathedral outside</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="19">Church</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="20">Inn</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="21">Village</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="31">Village Inside</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="22">Village Obj.</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="23">Shack</span>
					<span class="object-tileset-select menu-style-button" data-tileset-index="28">Barovia</span>
				</div>
				Place all tiles <input type="checkbox" id="place-all-object-tiles"/>
				<br/>
				Select tiles to place <input type="checkbox" id="select-object-tiles"/>
				<br/>
				<div id="object-select-container" style="position:absolute; height:544px; width:544px; overflow:scroll; left:0; top90px;">
					<canvas id="object-select-canvas"></canvas>
				</div>
			</div>
			<canvas id="floor-select-canvas" class="edit-map-select" style="position:absolute; left:0; top:0px; z-index:21000; display:none;"></canvas>
			<canvas id="wall-select-canvas" class="edit-map-select" style="position:absolute; left:0; top:0px; z-index:21000; display:none;"></canvas>
			<canvas id="pit-select-canvas" class="edit-map-select" style="position:absolute; left:0; top:0px; z-index:21000; display:none;"></canvas>
			
			<div id="edit-descriptions" class="toggle-menu" style="display:none;">
				<div>
					<span id="edit-descriptions-new" class="menu-style-button">New Description</span>
				</div>
				<div id="edit-this-description"></div>
				<div id="load-descriptions" class="" style="border-top: 2px solid #333; margin-top: 6px; padding-top: 6px;">No descriptions saved for this map</div>
				
				<div id="template-descriptions-edit-form" style="display:none;">
					<form>
						<div>Name <input class="CoordDescriptionName" type="text"/></div>
						Description 
						<div><textarea class="CoordDescription" style="width:80%;"></textarea></div>
						Click all tiles on map that this description applies to
						<div>
							<span id="edit-descriptions-save" class="menu-style-button" data-description-index="0">Save</span>
						</div>
					</form>
				</div>
				
			</div>
			
		</div>
		
		<div id="column-1" style="position:relative; display:none;">
			
			<div id="page-top-graphic" style="z-index:500;width:544px; position:relative; margin-bottom:-25px;">
				<!--<div style="position:absolute; font-family:beebregular; z-index:-1;">0</div>-->
				<img src="./images/graphic/screen_top.png" style="width:100%;"/>
				
				<div id="battle-character-status-container" style="position:absolute; top:0; left:0;"></div>
				
				<div id="top-buttons" style="position:absolute; top:0; left:0; width:100%;">
					
					<div id="show-characters">
						<div id="show-character-a" class="show-character"></div>
						<div id="show-character-b" class="show-character"></div>
					</div>
					
					<span id="dev-mode-options" class="hide">
						<div id="toggle-edit-effect" class='game-menu-item-container-row fltlft' onclick="$(this).children('div').children('span').html(MenuController.editEffects?'Edit':'Off'); MenuController.editEffects = MenuController.editEffects?0:1;">
							<img style='position:absolute; top:0; left:0;' src='images/battle_icons/blank.png'/>
							<img id="game-menu-top-zoom-icon" style='position:relative;' src='./images/battle_icons/edit.png'/>
							<div style='position:relative;'><span style='background-color:#000;'>Edit</span></div>
						</div>
					</span>
					
					<span id="play-menu-icon-container" class="hide">
						<!--
						<div id="toggle-zoom" class='game-menu-item-container-row fltlft' onclick="toggle_zoom()">
							<img style='position:absolute; top:0; left:0;' src='images/battle_icons/blank.png'/>
							<img id="game-menu-top-zoom-icon" style='position:relative;' src='./images/battle_icons/zoom.png'/>
							<div style='position:relative;'><span style='background-color:#000;'>Zoom</span></div>
						</div>
						-->
						<div id="game-menu-top-menu" class='game-menu-item-container-row fltrt'>
							<img style='position:absolute; top:0; left:0;' src='images/battle_icons/blank.png'/>
							<img id="game-menu-top-menu-icon" style='position:relative;' src='./images/battle_icons/menu.png'/>
							<div style='position:relative;'><span style='background-color:#000;'>Menu</span></div>
						</div>
						
						<span id="game-menu-top-default">
							<!--
							<div id="game-menu-top-look" class='game-menu-item-container-row fltrt'>
								<img style='position:absolute; top:0; left:0;' src='images/battle_icons/blank.png'/>
								<img id="game-menu-top-look-icon" style='position:relative;' src='./images/battle_icons/look.png'/>
								<div style='position:relative;'><span style='background-color:#000;'>Look</span></div>
							</div>
							-->
							
							<div id="game-menu-top-system" class='game-menu-item-container-row fltrt'>
								<img style='position:absolute; top:0; left:0;' src='images/battle_icons/blank.png'/>
								<img id="game-menu-top-save-icon" style='position:relative;' src='./images/battle_icons/save.png'/>
								<div style='position:relative;'><span style='background-color:#000;'>Save</span></div>
							</div>
							
							<!--
							<div id="game-menu-top-talk" class='game-menu-item-container-row fltrt'>
								<img style='position:absolute; top:0; left:0;' src='images/battle_icons/blank.png'/>
								<img id="game-menu-top-talk-icon" style='position:relative;' src='./images/battle_icons/talk.png'/>
								<div style='position:relative;'><span style='background-color:#000;'>Talk</span></div>
							</div>
						-->
						</span>
						<span id="game-menu-top-action-confirm" class="hide fltrt">
						</span>
					</span>
				</div>
				
			</div>
			
			<div id="game-menu"style="z-index:400;">
				<div id="game-menu-inner"></div>
				<div id="game-menu-inner-scroll">
					<div class="trans_background_75"></div>
					<div class="scroll-background">
						<div class="scroll-bg-repeat-container">
							<div class="scroll-bg-repeat"></div>
						</div>
						<div class="scroll-bg-top"></div>
						<div class="scroll-bg-bottom"></div>
						<div id="game-menu-inner-scroll-list"></div>
					</div>
				</div>
			</div>
			
			<div id="loading" style="z-index:400; position:absolute; left:0; top:0; width:544px; height:100%; font-size:30px; text-align:center; display:none;">
				<div class="trans_background_75"></div>
				<div style="position:relative; top:180px;">
					<div id="loading-bar-container" style="height:30px; width:544px; position:absolute; top:0; left:0;">
						<div id="loading-bar" style="height:30px; width:0%; background-color:#99F; opacity:0.25;"></div>
					</div>
					<div id="loading-text"style="position:realative;">Loading...</div>
				</div>
			</div>
			
			<div id="create-character-back-button" style="z-index:600; display:none; position:absolute; top:0px; left:0px;"></div>
			
			<div id="intro-screen" style="z-index:200;">
				
				<div id="title-page" class="intro-screen-bg" style="padding-top:150px;">
				
					<div style="font-size:24px; opacity:0.75">~ Pathfinder ~</div>
					<div id="" style="font-size:72px; padding-bottom:68px;">Ravenloft</div>
					
					<input type="text" id="player-name" style="border:1px solid #fff; border-radius:3px; background-color:#000; font-size:24px; color:#fff; width:50%; padding-top: 4px; text-align: center;"/>
					<div style="font-size:12;">Enter your name</div>
					<div id="game-begin-button" style="margin-top:30px;">
						<span class="button">Next</span>
					</div>
				</div>
				
				<div id="edit-page" style="display:none; padding-top:150px;">
					<div>
						AdventureID <input id="edit-page-adventure-id" style="width:150px;" value="N/A"/><br/>
						Title <input id="edit-page-adventure-title" style="width:150px;" value="Castle Ravenloft"/><br/>
						Start Map <div id="edit-page-adventure-start-map-load"></div>
						Start EventID  <input id="edit-page-adventure-start-eventid" style="width:150px;" value="0"/><br/>
						<span id="edit-page-save-adventure" class="menu-style-button" onclick="GameController.SaveAdventure();">Save Adventure</span>
					</div>
					<br/>
					<br/>
					<div type="button" id="select-start-map-load" ></div>
					<span id="select-edit-mode" class="menu-style-button" style="display:none;">Load Map</span><br/>
					<span id="" class="menu-style-button" onclick="GameController.DeleteArea();">Delete Map</span>
					<br/>
					<br/>
					<div id="edit-page-new-map" style="display:none;">
						Name: <input id="edit-page-map-id-new" style="width:150px;" value="Enter Map Name"/><br/>
						Width: <input id="edit-page-map-width" style="width:50px;" value="30"/><br/>
						Height: <input id="edit-page-map-height" style="width:50px;" value="30"/><br/>
						<span id="edit-page-create-new-map" class="menu-style-button">Create Map</span>
					</div>
				</div>
				
				<div id="play-page" class="intro-screen-bg" style="display:none; padding-top:150px;">
					<div style="color:#000; margin-bottom:20px; margin-top: -12px; font-size: 34px;">Select</div>
					<div id="select-player-party-load"></div>
					<div>
						<div><span id="select-game-play-mode"><image src="./images/graphic/button_full.png" style=""/><span>Begin</span></span></div>
						<div><a href="./tutorial.php" target="_blank"><span id="show-tutorial" class="button selected">How to Play</span></a></div>
						<div><span id="reset-character" onclick="CharacterController.ResetCharacter();" class="button ">Reset Character Progress</span></div>
						<!-- map editor for dev -->
						<div><span id="show-edit-page" class="button intro-screen-dev-option" style="display:none;">Map Editor</span></div>
						<!--  -->
						<div><span id="new-pc-character" onclick="CharacterController.NewCharacter();" class="button">New Character</span></div>
						<div><span id="delete-pc-character" onclick="CharacterController.DeleteCharacter();" class="button">Delete Character</span></div>
						<div><span id="exit-button" onclick="GameController.Exit();" class="button">Exit</span></div>
					</div>
				</div>
				
				<div id="game-over-page" class="intro-screen-bg" style="display:none; padding-top:150px; height:100%;">
					<h1 style="color: #322; font-size: 60px;">GAME OVER</h1>
					<div style="margin-top:60px;"><span id="game-over-button" onclick="$('#game-over-page').hide(); $('#game-begin-button').trigger('click');" class="button">Continue</span></div>
					<div style="margin-top:60px;"><span id="game-over-exit-button" onclick="GameController.Exit();" class="button">Exit</span></div>
				</div>
				
				<div id="create-character-page" style="display:none; padding-top:90px;"></div>
				
			</div>
			
			<div id="cutscene-container" style="z-index:200; display:none;">
				<div id="cutscene-image" style=""></div>
				<div id="load-cutscene" style=""></div>
				<div id="cutscene-next">~ Click Image to Continue ~</div>
			</div>
			
			<canvas id="display-game-weather-effects" style="z-index:200; pointer-events:none; position:absolute; left:0px; top:72px;"></canvas>
			
			<div id="game-screen-container" style="position:relative; z-index:100; width:544px;">
				
				<div id="game-map-container" style="position:absolute; left:0px; top:0px;">
					
					<canvas id="display-game-map" style="position:absolute; left:0px; top:0px;"></canvas>
					<!--<canvas id="display-game-weather-effects" style="pointer-events:none; position:absolute; left:0px; top:0px;"></canvas>-->
					
					<div id="game-map" class="hide" onclick="$(this).fadeOut();">
						<!--<img style="width:544px; height:544px; position:absolute; left:0px; top:0px;" src="./images/map/ravenloft.png"/>-->
						<canvas id="mini-game-map" style="position:absolute; left:75px; top:90px; width:410px; height:410px;"></canvas>
					</div>
					<div id="formation" class="hide" style="width:544px; height:544px; position:absolute; left:0px; top:0px; background-color:#000;">
						CHANGE FORMATION
						<table id="formation-table">
						</table>
					</div>
					
					<!-- for edit -->
					<div id="map-editor" class="canvas-edit-mode" style="display:none; position:relative; width:544px; height:544px;">
						<canvas id="canvas" style="position:absolute; top:0; left:0;"></canvas>
						<canvas id="canvas_wall_and_floor_graphical" style="position:absolute; top:0; left:0; pointer-events: none;"></canvas>
						<canvas id="canvas_object_bg" style="position:absolute; top:0; left:0; pointer-events: none;"></canvas>
						<canvas id="canvas_character" style="position:absolute; top:0; left:0; pointer-events: none;"></canvas>
						<canvas id="canvas_object_fg" style="position:absolute; top:0; left:0; pointer-events: none;"></canvas>
						<canvas id="canvas_facade" style="position:absolute; top:0; left:0; pointer-events: none;"></canvas>
						<canvas id="display-edit-selections" style="position:absolute; top:0; left:0; pointer-events: none;"></canvas>
					</div>
					
				</div>
				
				
				<div id="quick-item-display"></div>
				
				<div id="game-map-buttons" style="display:none;"></div>
				
				<div id="edit-map-buttons" style="display:none;">
					<div id="map-buttons-left" class="direction-button" style="height:124px;">
						<i class="fa fa-arrow-circle-left"></i>
					</div>
					<div id="map-buttons-up" class="direction-button">
						<i class="fa fa-arrow-circle-up"></i>
					</div>
					<div id="map-buttons-down" class="direction-button">
						<i class="fa fa-arrow-circle-down"></i>
					</div>
					<div id="map-buttons-right" class="direction-button">
						<i class="fa fa-arrow-circle-right"></i>
					</div>
				</div>
				
				<div id="battle-container" style="position:absolute; left:0px; top:0px; z-index:100; background-color:#000; display:none;">
					
					<div id="battle-canvas-container" style="position:relative; z-index:10; width:544px; height:300px;">
						<canvas id="battlebg" style="position:absolute; left:0;"></canvas>
						<canvas id="battle" style="position:absolute; left:0;"></canvas>
						<canvas id="battle-staging" style="position:absolute; display:none;"></canvas>
					</div>
					

					<div id="battle-menu-container">
						<div id="character-name" style="width:97%; margin:0.5%; padding:1%;"></div>
						<div id="load-buttons" class=""></div>
						<div id="load-abilities-container">
							<div id="action-confirm" class="hide"></div>
							<div id="load-abilities"></div>
							<div style="clear:both;"></div>
						</div>
					</div>
					
					<div id="battle-menu-list-container">
						<div class="trans_background_75"></div>
						<div id="battle-scroll-container">
							<div class="scroll-background">
								<div class="scroll-bg-repeat-container">
									<div class="scroll-bg-repeat"></div>
								</div>
								<div class="scroll-bg-top"></div>
								<div class="scroll-bg-bottom"></div>
								<div id="battle-menu-list"></div>
							</div>
						</div>
					</div>
					
				</div>
				
				<div id="animations-container" style="position:absolute; left:0px; top:0px; z-index:200; pointer-events:none; width:544px; height:544px;">
					<canvas id="battle-particle-effects" style="position:absolute; left:0px; top:0px; pointer-events:none;"></canvas>
					<canvas id="battle-weapons-effects" style="position:absolute; left:0px; top:0px; pointer-events:none;"></canvas>
					<canvas id="battle-info-display" style="position:absolute; left:0px; top:0px; pointer-events:none;"></canvas>
				</div>
				
				<div id="select-target">SELECT TARGET</div>
				
			</div>
			
			<!-- EDITOR -->
			<div id="load-create-character" class="toggle-sub-menu" style="z-index:2000; width:100%; text-align:left; font-family:beebregular; font-size:12px; display:none; position:absolute; top:0; left:0; background-color:#000;"></div>
			
			<div id="edit-event" class="toggle-menu" style="min-height:200px; z-index:2000; width:100%; text-align:left; font-family:beebregular; font-size:12px; display:none; position:absolute; top:0; left:0; background-color:#000;">
				<div>
					<span id="edit-event-editor-button" class="sub2-menu-button" data-show-id="edit-event-editor">Editor</span>
					<span class="sub2-menu-button" data-show-id="edit-view-events">View Events</span>
					<span id="event-new" class="sub2-menu-button" data-show-id="edit-event-editor">New Event</span>
					<span id="event-edit-done" class="menu-style-button">Close</span>
				</div>
				
				<div id="edit-event-view-area-sub-menu" class="edit-view-events toggle-sub2-menu box" style="display: none;">
					<!--Show Area events-->
				</div>
				
				<div id="edit-event-view-all-sub-menu" class="edit-view-events toggle-sub2-menu box" style="display: none;">
					<!--Show All events-->
				</div>
				
				<div class="edit-event-editor toggle-sub2-menu" style="display: block;">
					<div id="load-event"></div>
					<div id="load-event-battle-edit-form"></div>
					<div id="load-event-change-location-edit-form"></div>
					<div id="load-edit-event-place-items-form"></div>
					<div style="clear:both;"></div>
					<span id="edit-event-battle" class="menu-style-button">Start Battle</span>
					<span id="edit-event-change-location" class="menu-style-button">Change Location</span>
					<span id="edit-event-place-items" class="menu-style-button">Place Items</span>
					<button id="event-save" class="menu-style-button" type="button">Save Event</button>
				</div>
				
				<div id="template-event-edit-form" style="display:none;">
					<form>
						<div>Event</div>
						<div>AreaID <input class="AreaID" name="AreaID" value="0"/></div>
						<div>EventID <input class="EventID" name="EventID" value="0"/></div>
						<div>Title <input class="Title" name="Title"/></div>
						<div>Description <input class="Description" name="Description"/></div>
						<div>Action Type <input class="ActionType" name="ActionType"/></div>
						<div>IsOnlyOnce? no:<input type="radio" name="IsOnlyOnce" checked="checked" value="0"/> yes:<input type="radio" name="IsOnlyOnce" value="1"/></div>
						<div>X <input class="X" name="X"/></div>
						<div>Y <input class="Y" name="Y"/></div>
						<div>Cutscene <input class="Cutscene" name="Cutscene" value=""/></div>
					</form>
				</div>
				
				<div id="template-event-battle-edit-form" style="display:none;">
					<form class="event-battle-edit-form box">
						<div>CharacterID <input class="CharacterID" name="CharacterID[]" value="0"/></div>
						<div>CharacterID <input class="CharacterID" name="CharacterID[]" value="0"/></div>
						<div>CharacterID <input class="CharacterID" name="CharacterID[]" value="0"/></div>
						<div>CharacterID <input class="CharacterID" name="CharacterID[]" value="0"/></div>
						<div>CharacterID <input class="CharacterID" name="CharacterID[]" value="0"/></div>
					</form>
				</div>
				
				<div id="template-event-change-location-edit-form" style="display:none;">
					<form class="event-change-location-edit-form box">
						<div>ToAreaID
							<select class="ToAreaID options-event-map-load" name="ToAreaID"></select>
						</div>
						<div>Optional:</div>
						<div>ToX <input class="ToX" name="ToX" value=""/></div>
						<div>ToY <input class="ToY" name="ToY" value=""/></div>
					</form>
				</div>
				
				<div id="template-edit-event-place-items-edit-form" style="display:none;">
					<form class="edit-event-place-items-edit-form box">
						<div>Item List <span id="edit-event-add-items">[ADD ITEM]</span></div>
						<form class="edit-event-place-items-edit-form box"></form>
					</form>
				</div>
				
				<div id="template-edit-event-item-form" style="display:none;">
					<!-- EventsItemsID is used to store if this item has been moved elsewhere -->
					<div class="box">
						<div>ItemID <input class="ItemID" name="ItemID" value=""/></div>
						<div>ItemType <input class="ItemType" name="ItemType" value=""/></div>
						<div>Name <input class="Name" name="Name" value=""/></div>
						<div>Description <input class="Description" name="Description" value=""/></div>
						<div>TriggerEventID <input class="TriggerEventID" name="TriggerEventID" value=""/></div>
						<div class="edit-event-remove-item">[REMOVE ITEM]</div>
					</div>
				</div>
			</div>
			
			<div id="edit-conversation" class="toggle-menu" style="z-index:2000; width:100%; text-align:left; font-family:beebregular; font-size:12px; display:none; position:absolute; top:0; left:0; background-color:#000;">
				<div>
					<span class="sub2-menu-button" data-show-id="edit-conv-editor">Editor</span>
					<span class="sub2-menu-button" data-show-id="edit-conv-all">View All</span>
					<span class="sub2-menu-button" data-show-id="edit-conv-tags">Knowledge Tags</span>
					<span id="conversation-edit-done" class="menu-style-button">Close</span>
				</div>
				
				<div id="edit-conv-view-all-sub-menu" class="edit-conv-all toggle-sub2-menu" style="display: none;">
					<!--Show All conversations-->
				</div>
				
				<div id="add-knowledge-tag" class="edit-conv-tags toggle-sub2-menu" style="display: none;">
					<input id="knowledge-tag-name" value=""/>
					<button id="knowledge-tag-new" class="menu-style-button" type="button">New Knowledge Tag</button>
					<div id="load-knowledge-tags"></div>
				</div>
				
				<div class="edit-conv-editor toggle-sub2-menu" style="display: block;">
					<div id="load-conversation"></div>

					<div>
						<button id="conversation-new" class="menu-style-button" type="button">New Conversation</button>
						<button id="conversation-load" class="menu-style-button" type="button">Load Area Conversation</button>
						<button id="conversation-save" class="menu-style-button" type="button">Save Conversation</button>
					</div>
				</div>
				
				<div id="template-conversation-edit-form" style="display:none;">
					<form>
						<div>Conversation</div>
						<div>ConversationID <input class="ConversationID" name="ConversationID" value="0"/></div>
						<div>CharacterID <input class="CCharacterID" name="CCharacterID" value="0"/></div>
						<div>Title <input class="CTitle" name="CTitle"/></div>
						<div>Description <input class="CDescription" name="CDescription"/></div>
						<div><button class="conversation-add-path menu-style-button" type="button">Add Path</button></div>
						<div>View Path: <span class="view-path-selection"></span></div>
					</form>
					<div class="load-path"></div>
				</div>
				
				<div id="template-path-edit-form" style="display:none;">
					<form class="path-edit-form box">
						<div>Path # <span class="path-number"></span></div>
						<div>CPRankingValue <input class="CPRankingValue" name="CPRankingValue" value="0"/></div>
						<div>CPTitle <input class="CPTitle" name="CPTitle"/></div>
						<div>CPDescription <input class="CPDescription" name="CPDescription"/></div>
						<div>CPText</div>
						<div><textarea class="CPText" name="CPText"></textarea></div>
						<div>CPAreaRenownID <input class="CPAreaRenownID" name="CPAreaRenownID" value="0"/></div>
						<div>CPAreaRenownStrength <input class="CPAreaRenownStrength" name="CPAreaRenownStrength" value="0"/></div>
						<div>GivenKnowledgeTagID <select class="KnowledgeTagID GivenKnowledgeTagID" name="GivenKnowledgeTagID"></select></div>
						<div class="load-cp-options"></div>
						<div><button class="menu-style-button conversation-add-option" type="button">Add Option</button></div>
					</form>
				</div>
				
				<div id="template-option-edit-inputs" style="display:none;">
					<div class="path-option box">
						<div>CPOptionText</div>
						<div><textarea class="CPOptionText" name="CPOptionText[]"></textarea></div>
						<div>LinkToCPID <input class="LinkToCPID" name="LinkToCPID[]"/></div>
						<button class="option-new-link menu-style-button" type="button">New Path</button>
						<button class="option-follow-link menu-style-button" type="button">Follow Path</button>
						<button class="option-requirements-toggle menu-style-button" type="button">Requirements</button>
						<button class="option-restrictions-toggle menu-style-button" type="button">Restrictions</button>
						<button class="option-event-toggle menu-style-button" type="button">Event</button>
						<div class="option-requirements" style="display:none;">NeededKnowledgeTagID <select class="KnowledgeTagID NeededKnowledgeTagID" name="NeededKnowledgeTagID"></select></div>
						<div class="option-restrictions" style="display:none;">RestrictKnowledgeTagID <select class="KnowledgeTagID RestrictKnowledgeTagID" name="RestrictKnowledgeTagID"></select></div>
						<div class="option-event" style="">Event 
							<select class="CPOptionEventType" name="CPOptionEventType">
								<option value="0">Select event</option>
								<option value="join">Join party</option>
								<option value="battle">Start Battle</option>
								<option value="shop">Open shop</option>
								<option value="0">Start Event ID (TBD)</option>
							</select>
						</div>
					</div>
				</div>
				
			</div>
			
			<!-- storing images-->
			<div id="create-character-graphics-select-load" style="display:none;"></div>
			
		</div>
		
		<!-- MOVED BATTLE OUTPUT AND TEST BUTTONS OUTSIDE REGULAR BATTLE WINDOW using for testing -->
		<div id="battle-secondary" style="position:absolute; width:544px; top:0; right:0; display:none;">
			<div id="battle-menu" style="width:97%; min-height:400px; margin:0.5%; padding:1%; background-color:#000;">
				<div id="battle-attack-output" style="overflow-y:scroll; text-align:left; width:100%; height:400px; background-color:#000;" ></div>
			</div>
			<div style="width:97%; margin:0.5%; padding:1%;">
				<button id="battle-next-button" type="button" style="width:30%; min-width:120px;" onclick="BattleController.end_character_turn()">Next</button>
				<button id="battle-heal-button" type="button" style="width:30%; min-width:120px;" onclick="BattleController.heal_all()">Heal all HPs</button>
			</div>
		</div>
		
		<div id="effect-editor-load" style="position:absolute; top:0; left:0; z-index:20000; background-color:#fff; color: #000; text-align: left; font-family: beebregular; font-size: 10px; width: 544px;"></div>
		<div id="load-effect-gen-icon-select" style="display:none;"></div>
	</body>
</html>

<script>


window.onbeforeunload = confirmExit;
function confirmExit() {
  return "Are you sure you wish to leave the page? Make sure you save your game first.";
}

$(document).ready(function()
{
	//FOR CROSS PLATFORM 'requestAnimationFrame'
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	// MIT license
	(function () {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}
		if(!window.requestAnimationFrame)
			window.requestAnimationFrame = function (callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				},
				timeToCall);
				lastTime = currTime + timeToCall;
				return id;
		};
		if(!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function (id) {
				clearTimeout(id);
		};
	}());
	
	
	GameController.init();
	BattleController.init();
	CanvasAnimController.Init(document.getElementById('battle-particle-effects'));
	SpriteAnimController.SpriteAnimation.init(document.getElementById('battle-weapons-effects'));
	CutsceneController.init();
	
	//stop any forms from processing on enter press
	if(!mobile)
	{
		$(window).keydown(function(event){
			if(event.keyCode == 13) {
				event.preventDefault();
				//pressing enter clicks selected button on pop ups
				$('#selected-button').trigger('click');
				return false;
			}
		});
	}
	
	var flag = false;
	$('#game-begin-button').bind('touchstart click', function(){
	//$('#test-start').bind('touchstart click', function(){
		if (!flag) {
			flag = true;
			setTimeout(function(){ flag = false; }, 100);
			//alert('g');
			GameController.GameBegin();
		}

		return false
	});

});

</script>