
var SpriteAnimController = SpriteAnimController || {};

SpriteAnimController.sprite_images_count = 0;
SpriteAnimController.sprite_images_loaded = 0;

SpriteAnimController.canvas_buffer = document.createElement('canvas');
SpriteAnimController.canvas_buffer.height = 544;
SpriteAnimController.canvas_buffer.width = 544;
SpriteAnimController.context_buffer = SpriteAnimController.canvas_buffer.getContext('2d');
SpriteAnimController.context_buffer.imageSmoothingEnabled = false;

SpriteAnimController.test_mode = 0;

// SpriteAnimController.Spriteset object
SpriteAnimController.Spriteset = function(image)
{
	this.image = new Image();
	SpriteAnimController.sprite_images_count ++;
	this.image.onload = SpriteAnimController.sprite_images_loaded++;
	this.image.src = image;
}

// Animation object
SpriteAnimController.Animation = function(frames, frameDuration, leftX, topY, tileWidth, tileHeight)
{
	this.frames = frames;

	this.frameDuration = frameDuration;
	
	this.leftX = leftX;
	this.topY = topY;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
}

// PlayAnimation objects held by SpriteAnimController.Sprite.playAnimationHandler (to play multiple animations simultaneously)
SpriteAnimController.PlayAnimation = function(animationName, x, y, scale, character_index)//, numCycles)
{
	this.animationName = animationName;
	this.x = x;
	this.y = y;
	//this.numCycles = numCycles;
	
	this.scale = scale;
	this.character_index = character_index;
	
	this.currentFrame = 0;
	this.frameTimer = Date.now();
	
	this.cycleDone = 0;
}

// Sprite object
SpriteAnimController.Sprite = function(spriteset, animationList)
{
	this.spriteset = spriteset;
	this.animationList = animationList;
	//playAnimationHandler array holds SpriteAnimController.PlayAnimation objects
	this.playAnimationHandler = [];
}

SpriteAnimController.SpriteAnimation =
{
	'canvas': 0,
	'ctx': 0,
	
	//must set up sprite in init function
	'sprites': [],
	
	'then': Date.now(),

	// drawImage to canvas
	'drawAnimationFrame': function(spriteIndex, playAnimation)
	{
		var spriteanimation = SpriteAnimController.SpriteAnimation;
		
		var animationName = playAnimation.animationName;
		var animation = spriteanimation.sprites[spriteIndex].animationList[animationName];
		
		//if testing give a background color so can see frame size
		if(SpriteAnimController.test_mode)
		{
			SpriteAnimController.context_buffer.fillStyle="#003";
			SpriteAnimController.context_buffer.fillRect(Math.floor(playAnimation.x - animation.tileWidth/2), Math.floor(playAnimation.y - animation.tileHeight/2), animation.tileWidth, animation.tileHeight);
		}
		
		//if no more frames don't draw, allows last image to be deleted by clearRect
		if (playAnimation.currentFrame < animation.frames.length)
		{
			if(playAnimation.scale != 1)
			{
				SpriteAnimController.context_buffer.save();
				//only flip x axis when scale is negative
				SpriteAnimController.context_buffer.scale(playAnimation.scale, Math.abs(playAnimation.scale));
			}
			
			//if a character anim then dont move up 50%
			var play_x_px_offset = (playAnimation.character_index == -1) ? -animation.tileWidth/2 : GameController.characters[playAnimation.character_index].sprite_offset[0];
			var play_y_px_offset = (playAnimation.character_index == -1) ? -animation.tileHeight/2 : 0;
			
			//if character anim, and character is highlighted, draw the outline
			/*
			if(playAnimation.character_index != -1 && playAnimation.character_index == BattleController.highlight_character_selected_index)
			{
				var canvas = document.createElement("canvas");
				canvas.width = animation.tileWidth;
				canvas.height = animation.tileHeight;
				var context = canvas.getContext('2d');
				context.drawImage(
					spriteanimation.sprites[spriteIndex].spriteset.image,
					animation.leftX + (animation.frames[playAnimation.currentFrame].split(',')[0] * animation.tileWidth),
					animation.topY + (animation.frames[playAnimation.currentFrame].split(',')[1] * animation.tileHeight),
					animation.tileWidth,
					animation.tileHeight);
				BattleController.outline_sprite([255,70,70,100], canvas, Math.floor(playAnimation.x + play_x_px_offset), Math.floor(playAnimation.y + play_y_px_offset), SpriteAnimController.context_buffer, 2, animation.tileWidth, animation.tileHeight);
			}
			*/
			SpriteAnimController.context_buffer.drawImage(
				spriteanimation.sprites[spriteIndex].spriteset.image, 
				animation.leftX + (animation.frames[playAnimation.currentFrame].split(',')[0] * animation.tileWidth),
				animation.topY + (animation.frames[playAnimation.currentFrame].split(',')[1] * animation.tileHeight),
				animation.tileWidth,
				animation.tileHeight,
				Math.floor(playAnimation.x + play_x_px_offset),
				Math.floor(playAnimation.y + play_y_px_offset),
				animation.tileWidth,
				animation.tileHeight
			);
			
			if(playAnimation.scale != 1)
			{
				SpriteAnimController.context_buffer.restore();
			}
		}
	},

	// update animation frame
	'updateAnimation': function(spriteIndex, playAnimation)
	{
		var spriteanimation = this;
		
		var animationName = playAnimation.animationName;
		var animation = spriteanimation.sprites[spriteIndex].animationList[animationName];
		if (Date.now() - playAnimation.frameTimer > animation.frameDuration) {
			if (playAnimation.currentFrame < animation.frames.length-1)
			{
				playAnimation.currentFrame ++;
			}
			else
			{
				playAnimation.currentFrame = 0;
				playAnimation.cycleDone = 1;
			}
			playAnimation.frameTimer = Date.now();
		}
	},
	
	'clearAnimations': function(character_index)
	{
		if(arguments.length < 1)
		{
			character_index = -1;
		}
		
		var spriteanimation = this;
		for(var spriteIndex = 0;  spriteIndex < spriteanimation.sprites.length; spriteIndex++)
		{
			var sprite = spriteanimation.sprites[spriteIndex];
			
			for(var i = sprite.playAnimationHandler.length-1; i >= 0; i--)
			{
				//clear all or just for the character given
				if(character_index == -1 || sprite.playAnimationHandler[i].character_index == character_index)
				{
					//set characters hide_sprite = 0
					//make sure the index exists before accessing, default is -1
					if(sprite.playAnimationHandler[i].character_index > -1)
					{
						GameController.characters[sprite.playAnimationHandler[i].character_index].hide_sprite = 0;
					}
					//remove this animation from list
					sprite.playAnimationHandler.splice(i, 1);
				}
			}
		}
	},
	
	'init': function(canvas)
	{
		var spriteanimation = this;
		
		SpriteAnimController.SpriteAnimation.canvas = canvas;
		SpriteAnimController.SpriteAnimation.ctx = canvas.getContext('2d');
		SpriteAnimController.SpriteAnimation.ctx.imageSmoothingEnabled = false;

		//set sprite sheet (sprites index 0)
		var newSprite0 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/effects.png'),
			{
				'anim1': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0'], 100, 7, 54, 54, 86), 
				'anim2': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0', '5,0', '6,0', '7,0'], 100, 13, 453, 66, 92), 
				'anim3': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0','5,0', '6,0', '7,0', '8,0', '9,0', '10,0', '11,0', '12,0', '13,0'], 100, 7, 870, 130, 70),
				'anim4': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0', '5,0'], 100, 1286, 722, 90, 70),
				'anim5': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0'], 100, 565, 106, 70, 90),
				'anim6': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0', '5,0'], 100, 916, 106, 45, 84),
				'anim7': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0', '5,0', '6,0', '7,0'], 100, 387, 383, 94, 54),
				'anim8': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0', '5,0'], 100, 1352, 794, 79, 74),
				'anim9': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0'], 100, 1451, 156, 75, 68),
				'anim10': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0'], 100, 1297, 499, 36, 32),
				'anim11': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0'], 100, 1571, 335, 51, 48),
				'anim12': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0','0,0', '1,0', '2,0', '3,0', '4,0'], 100, 1330, 335, 48, 48),
				'anim13': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0','5,0', '6,0', '7,0', '8,0', '9,0'], 100, 1356, 384, 47, 31),
				'anim14': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0'], 100, 543, 452, 37, 47),
				'anim15': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0'], 100, 973, 831, 44, 33),
				'anim16': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0'], 100, 6, 796, 16, 15),
				'anim17': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0'], 100, 87, 796, 16, 15),
				'anim18': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0'], 100, 168, 796, 16, 15),
				'anim19': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0'], 100, 249, 796, 16, 15),
				'anim20': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0'], 100, 330, 796, 16, 15),
				'anim21': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0'], 100, 411, 796, 16, 15),
				'anim22': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0', '5,0', '6,0', '7,0', '8,0'], 100, 6, 197, 101, 76),
				'anim23': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0', '5,0', '6,0', '7,0', '8,0'], 100, 34, 323, 84, 58),
				'anim24': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0'], 30, 516, 12, 31, 28),
				'anim25': new SpriteAnimController.Animation(['0,0', '1,0', '2,0', '3,0', '4,0', '5,0'], 100, 695, 12, 41, 28)
			}
		);
		spriteanimation.sprites.push(newSprite0);
		
		//set sprite sheet (sprites index 1)
		var newSprite1 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/loading_book.png'),
			{
				'loading': new SpriteAnimController.Animation(['0,0', '0,1', '0,2', '0,3','0,0', '0,1', '0,2', '0,3','0,0', '0,1', '0,2', '0,3','0,0', '0,1', '0,2', '0,3'], 100, 0, 0, 48, 64)
			}
		);
		spriteanimation.sprites.push(newSprite1);
		
		//set skeleton sprite sheet (sprites index 2)
		var newSprite2 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/character/skeleton_anim.png'),
			{
				'attack': new SpriteAnimController.Animation(['0,0', '0,1', '0,2', '0,3', '0,4', '0,5', '0,6', '0,7', '0,8', '0,9'], 100, 0, 0, 100, 50)
			}
		);
		spriteanimation.sprites.push(newSprite2);
		
		//set rogue sprite sheet (sprites index 3)
		var newSprite3 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/character/rogue_anim.png'),
			{
				'attack': new SpriteAnimController.Animation(['0,0', '0,1', '0,2', '0,3', '0,4', '0,5', '0,6', '0,7', '0,8', '0,9', '0,10', '0,11', '0,12', '0,13'], 100, 0, 0, 80, 80)
			}
		);
		spriteanimation.sprites.push(newSprite3);
		
		//set sprite sheet (sprites index 4)
		var newSprite4 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/character/faces_anim.png'),
			{
				'attack': new SpriteAnimController.Animation(['0,0', '0,1', '0,2', '0,3', '0,4',  '0,8', '0,5', '0,6', '0,5', '0,4'], 100, 0, 0, 160, 170)
			}
		);
		spriteanimation.sprites.push(newSprite4);
		
		//set sprite sheet (sprites index 5)
		var newSprite5 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/character/lancelot_anim.png'),
			{
				'attack': new SpriteAnimController.Animation(['0,0', '0,1', '0,2', '0,3', '0,4', '0,5', '0,6', '0,7', '0,8', '0,9', '0,10'], 100, 0, 0, 220, 85)
			}
		);
		spriteanimation.sprites.push(newSprite5);
		
		//set sprite sheet (sprites index 6)
		var newSprite6 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/character/ninja_anim.png'),
			{
				'attack': new SpriteAnimController.Animation(['0,0', '0,1', '0,2', '0,3', '0,4', '0,5', '0,6', '0,7', '0,8', '0,9', '0,10', '0,11', '0,12', '0,13', '0,14', '0,15'], 60, 0, 0, 260, 125)
			}
		);
		spriteanimation.sprites.push(newSprite6);
		
		//set sprite sheet (sprites index 7)
		var newSprite7 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/character/spirits_anim.png'),
			{
				'attack': new SpriteAnimController.Animation(['0,0', '0,1', '0,2', '0,3'], 100, 0, 0, 90, 100)
			}
		);
		spriteanimation.sprites.push(newSprite7);
		
		//set sprite sheet (sprites index 8)
		var newSprite8 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/character/wolf_anim.png'),
			{
				'attack': new SpriteAnimController.Animation(['0,0', '0,1', '0,2', '0,3', '0,4', '0,5'], 60, 0, 0, 210, 57),
				'damage': new SpriteAnimController.Animation(['0,6', '0,7', '0,8', '0,9', '0,10', '0,11', '0,12', '0,13', '0,14'], 150, 0, 0, 210, 57),
				'random_idle': new SpriteAnimController.Animation(['0,15', '0,16', '0,15', '0,16', '0,15', '0,16', '0,15', '0,16', '0,15', '0,16', '0,15', '0,16', '0,15', '0,16'], 100, 0, 0, 210, 57)
			}
		);
		spriteanimation.sprites.push(newSprite8);
		
		//set sprite sheet (sprites index 9)
		var newSprite9 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/character/mummy_anim.png'),
			{
				'attack': new SpriteAnimController.Animation(['0,2', '0,3', '0,4', '0,5', '0,6'], 100, 0, 0, 105, 76),
				'idle': new SpriteAnimController.Animation(['0,0', '0,1'], 300, 0, 0, 210, 57)
			}
		);
		spriteanimation.sprites.push(newSprite9);
		
		//set sprite sheet (sprites index 10)
		var newSprite10 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/character/skullopede_anim.png'),
			{
				'attack': new SpriteAnimController.Animation(['0,2', '0,3', '0,4', '0,4'], 100, 0, 0, 110, 57),
				'idle': new SpriteAnimController.Animation(['0,0', '0,1'], 300, 0, 0, 110, 57)
			}
		);
		spriteanimation.sprites.push(newSprite10);
		
		//set sprite sheet (sprites index 11)
		var newSprite11 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/character/monk_anim.png'),
			{
				'attack': new SpriteAnimController.Animation(['0,1', '0,2', '0,3', '0,4', '0,5', '0,6', '0,7', '0,8', '0,9', '0,10', '0,11', '0,12', '0,13', '0,14', '0,15', '0,16', '0,17', '0,18', '0,19', '0,20'], 80, 0, 0, 216, 140),
				'damage': new SpriteAnimController.Animation(['0,21', '0,22', '0,23', '0,24'], 100, 0, 0, 216, 140),
				'dodge': new SpriteAnimController.Animation(['0,25', '0,26', '0,27', '0,28'], 100, 0, 0, 216, 140)
			}
		);
		spriteanimation.sprites.push(newSprite11);
		
		//set sprite sheet (sprites index 12)
		var newSprite12 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/character/vampire_anim.png'),
			{
				'attack': new SpriteAnimController.Animation(['0,5', '0,6', '0,7', '0,8', '0,9', '0,10', '0,11'], 80, 0, 0, 256, 256),
				'damage': new SpriteAnimController.Animation(['0,12', '0,13', '0,13', '0,14', '0,15'], 120, 0, 0, 256, 256),
				'dodge': new SpriteAnimController.Animation(['0,29', '0,30', '0,30', '0,30', '0,29'], 120, 0, 0, 256, 256),
				'cast': new SpriteAnimController.Animation(['0,29', '0,30', '0,31', '0,32', '0,32', '0,33', '0,33'], 60, 0, 0, 256, 256)//,
				//'random_idle': new SpriteAnimController.Animation(['0,15', '0,16', '0,15', '0,16', '0,15', '0,16', '0,15', '0,16', '0,15', '0,16', '0,15', '0,16', '0,15', '0,16'], 100, 0, 0, 210, 57)
			}
		);
		spriteanimation.sprites.push(newSprite12);
			
		//set sprite sheet (sprites index 13)
		var newSprite13 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/character/pharo_anim.png'),
			{
				'attack': new SpriteAnimController.Animation(['0,5', '0,6', '0,7', '0,8', '0,9', '0,10', '0,11', '0,12', '0,13', '0,14'], 100, 0, 0, 180,160),//done
				'damage': new SpriteAnimController.Animation(['0,19', '0,20', '0,21'], 100, 0, 0, 180,160),
				'dodge': new SpriteAnimController.Animation(['0,29', '0,30', '0,30', '0,30', '0,29'], 100, 0, 0, 180,160),
				'cast': new SpriteAnimController.Animation(['0,5', '0,6', '0,7', '0,8', '0,9', '0,10', '0,11', '0,12', '0,13', '0,14'], 100, 0, 0, 180,160),//done
				'idle': new SpriteAnimController.Animation(['0,1', '0,2', '0,3', '0,4'], 30, 0, 0, 180,160),//done
				'random_idle': new SpriteAnimController.Animation(['0,15', '0,16', '0,17', '0,18'], 30, 0, 0, 180,160)//done
			}
		);
		spriteanimation.sprites.push(newSprite13);
			
		//NEW
		//INSERT sprite data into database->Sprites
		//use sprite-manager.php to save info to database  (sprite index to database->Sprites->DefaultSpriteScale, AnimSpritesIndex)
		//***
		//set sprite sheet (sprites index 14)
		/*
		var newSprite14 = new SpriteAnimController.Sprite(
			new SpriteAnimController.Spriteset('./images/spriteset/character/vampire_anim.png'),
			{
				'attack': new SpriteAnimController.Animation(['0,5', '0,6', '0,7', '0,8', '0,9', '0,10', '0,11'], 80, 0, 0, 256, 256),
				'damage': new SpriteAnimController.Animation(['0,12', '0,13', '0,13', '0,14', '0,15'], 120, 0, 0, 256, 256),
				'dodge': new SpriteAnimController.Animation(['0,29', '0,30', '0,30', '0,30', '0,29'], 120, 0, 0, 256, 256),
				'cast': new SpriteAnimController.Animation(['0,29', '0,30', '0,31', '0,32', '0,32', '0,33', '0,33'], 60, 0, 0, 256, 256)//,
				'random_idle': new SpriteAnimController.Animation(['0,15', '0,16', '0,15', '0,16', '0,15', '0,16', '0,15', '0,16', '0,15', '0,16', '0,15', '0,16', '0,15', '0,16'], 100, 0, 0, 210, 57)
			}
		);
		spriteanimation.sprites.push(newSprite14);
		*/
		
	},
	
	'init_test_buttons': function()
	{
		//SpriteAnimController.StartAnimation(0, 'anim8', targetX, targetY);
		
		SpriteAnimController.test_mode = 1;
		$('#load-anim-test-buttons').html('Test animations: ');
		//loop through all animations and put a button on the screen to test it
		for(var i=0; i < SpriteAnimController.SpriteAnimation.sprites.length; i++)
		{
			$('#load-anim-test-buttons').append('<br/>Sheet #: '+i+'<br/>');
			var spritesheet = SpriteAnimController.SpriteAnimation.sprites[i];
			for(var animation in spritesheet.animationList)
			{
				$('#load-anim-test-buttons').append('<button onclick="SpriteAnimController.StartAnimation('+i+', \''+animation+'\', 150, 150); return false;">'+animation+'</button>');
			}
		}
		
	}
}

	
SpriteAnimController.StartAnimation = function(spriteIndex, animationName, x, y, scale, character_index)
{
	if(arguments.length < 5)
	{
		scale = 1;
	}
	if(arguments.length < 6)
	{
		character_index = -1;
	}
	
	//check if animation exists first
	if(typeof spriteIndex === 'undefined' || spriteIndex > SpriteAnimController.SpriteAnimation.sprites.length-1)
	{
		console.log('spriteIndex doesn\'t exist: ',spriteIndex);
		return false;
	}
	var anim_exists = false;
	for(var i in Object.keys(SpriteAnimController.SpriteAnimation.sprites[spriteIndex].animationList))
	{
		if(animationName == Object.keys(SpriteAnimController.SpriteAnimation.sprites[spriteIndex].animationList)[i])
		{
			anim_exists = true;
			//exit loop
			break;
		}
	}
	if(!anim_exists)
	{
		//onsole.log('animationName doesn\'t exist: ',animationName);
		return false;
	}
	//play animation
	var playAnimation = new SpriteAnimController.PlayAnimation(animationName, x, y, scale, character_index);
	SpriteAnimController.SpriteAnimation.sprites[spriteIndex].playAnimationHandler.push(playAnimation);
	
	requestAnimationFrame(function(){
			SpriteAnimController.main();
			if(character_index != -1)
			{
				GameController.characters[character_index].hide_sprite = 1;
				BattleController.draw();
			}
		});
	
	//return approx time animation takes to complete
	var this_animation = SpriteAnimController.SpriteAnimation.sprites[spriteIndex].animationList[animationName];
	if(SpriteAnimController.test_mode == 1)
	{
		console.log('sprite sheet #:'+spriteIndex,'animation name:'+animationName,'duration:'+(this_animation.frames.length * this_animation.frameDuration));
	}
	
	//adding a bit extra to time
	return this_animation.frames.length * this_animation.frameDuration * 1.2;
}

// main loop
SpriteAnimController.main = function()
{
	//keep track if any animations are running on any spritesheet
	var keepPlaying = false;
	
	//clear buffer canvas
	SpriteAnimController.context_buffer.clearRect(0, 0, SpriteAnimController.SpriteAnimation.canvas.width, SpriteAnimController.SpriteAnimation.canvas.height);

	//loop through all sprite sets and animate playing sprites
	for(var spriteIndex = 0;  spriteIndex < SpriteAnimController.SpriteAnimation.sprites.length; spriteIndex++)
	{
		var sprite = SpriteAnimController.SpriteAnimation.sprites[spriteIndex];
		
		//keep track of playing animations in sprite.playAnimationHandler array
		//keep track of animation name and positions in SpriteAnimController.PlayAnimation, properties: animation name, positionX, positionY, number of cycles to play
		//for each SpriteAnimController.PlayAnimation in sprite.playAnimationHandler update animation
		for(var i = 0; i < sprite.playAnimationHandler.length; i++)
		{
			var animationName = sprite.playAnimationHandler[i].animationName;
			var animation = sprite.animationList[animationName];
			var playAnimation = sprite.playAnimationHandler[i];
			
			if (SpriteAnimController.sprite_images_count == SpriteAnimController.sprite_images_loaded && playAnimation.cycleDone == 0)
			{
				SpriteAnimController.SpriteAnimation.drawAnimationFrame(spriteIndex, playAnimation);
			}
			SpriteAnimController.SpriteAnimation.updateAnimation(spriteIndex, sprite.playAnimationHandler[i]);
			SpriteAnimController.SpriteAnimation.then = Date.now();
		}
		
		//if no more animations to run clear timer and clear playAnimationHandler array
		//var clearTimer = true;//NOT USING CLEAR TIMER, removing from playlist one at a time with splice
		for(var i = sprite.playAnimationHandler.length -1; i >= 0; i--)
		{
			if(sprite.playAnimationHandler[i].cycleDone == 0)
			{
				//clearTimer = false;
				keepPlaying = true;
			}
			else
			{
				//if this sprite is an animated character, call the draw function to redraw staic character now that animation has finished 
				if(sprite.playAnimationHandler[i].character_index > -1)
				{
					//onsole.log(sprite.playAnimationHandler[i].character_index)
					GameController.characters[sprite.playAnimationHandler[i].character_index].hide_sprite = 0;
					//no requestAnimationFrame to have it draw immediately
					BattleController.draw();
				}
				sprite.playAnimationHandler.splice(i, 1);
			}
		}
	}
	
	SpriteAnimController.SpriteAnimation.ctx.clearRect(0, 0, SpriteAnimController.SpriteAnimation.canvas.width, SpriteAnimController.SpriteAnimation.canvas.height);
	SpriteAnimController.SpriteAnimation.ctx.drawImage(SpriteAnimController.canvas_buffer, 0, 0);
	
	if(keepPlaying)
	{
		requestAnimationFrame(SpriteAnimController.main);
	}
	else
	{
		SpriteAnimController.SpriteAnimation.ctx.clearRect(0, 0, SpriteAnimController.SpriteAnimation.canvas.width, SpriteAnimController.SpriteAnimation.canvas.height);
	}
}

//SpriteAnimController.SpriteAnimation.init( document.getElementById('battle-weapons-effects') );
