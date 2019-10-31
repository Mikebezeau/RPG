<!DOCTYPE html>

<html>
	
	<head>
		
		<title>PlaneScape Online Sprite Tester</title>
		
		<script src="./js/jquery-2.1.3.min.js"></script>
		<script src="./js/sprite_anim_controller.js"></script>
		<script src="./js/canvas_effect_anim_controller.js"></script>

		<meta charset="UTF-8" />

	</head>
	
	<body style="background-color: #000; color:#fff;">

		<div id="column-1" style="min-height:1000px; position:relative;">
			<div id="load-anim-test-buttons"></div>
			
			<div id="game-screen-container" style="position:relative; z-index:10; width:544px;">
				
				<div id="battle-container" style="position:absolute; left:0px; top:0px; z-index:100;">
					<div id="battle-canvas-container" style="position:relative; z-index:10; width:544px; height:544px;">
						<canvas id="battle-particle-effects" style="position:absolute; left:0px; top:0px; pointer-events:none;" width="544" height="544"></canvas>
						<canvas id="battle-weapons-effects" style="position:absolute; left:0px; top:0px; pointer-events:none;" width="544" height="544"></canvas>
					</div>
				</div>

			</div>
			
		</div>

	</body>
</html>

<script>
window.onload=function()
{
	CanvasAnimController.Init(document.getElementById('battle-particle-effects'));
	SpriteAnimController.SpriteAnimation.init(document.getElementById('battle-weapons-effects'));
	SpriteAnimController.SpriteAnimation.init_test_buttons();
};
</script>