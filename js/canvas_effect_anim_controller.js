
var CanvasAnimController = CanvasAnimController || {};

CanvasAnimController.Init = function(canvas)
{
	CanvasAnimController.timer = 0;
	CanvasAnimController.ctx = canvas.getContext("2d");
	CanvasAnimController.W = canvas.width;
	CanvasAnimController.H = canvas.height;
	CanvasAnimController.animations = [];
	
	CanvasAnimController.now;
	CanvasAnimController.then = Date.now();
	CanvasAnimController.interval = 90;
	CanvasAnimController.delta;
}

CanvasAnimController.StartAnimation = function(action_effect_data, start_x, start_y, end_x, end_y, beginAnim, endAnim)
{
	if(arguments.length < 8)
	{
		beginAnim = 0;
		endAnim = 0;
	}
	var canvas_animation = new CanvasAnimController.Animation(action_effect_data, start_x, start_y, end_x, end_y, beginAnim, endAnim);
	CanvasAnimController.animations.push(canvas_animation);
	requestAnimationFrame(CanvasAnimController.draw, 100);
	
	return canvas_animation.duration;
}

CanvasAnimController.Animation = function(action_effect_data, start_x, start_y, end_x, end_y, beginAnim, endAnim)
{
	//projectiles & explosions
	this.particle_count = 0;
	this.particles = [];
	//lightning & electricity
	this.shock_lines = 0;
	
	this.RGB_min = [0,0,0];
	this.RGB_max = [255,255,255];
		
	this.fameCounter = 0;
	this.endAnimation = 0;
	this.animationDone = 0;
	
	this.start_x = start_x;
	this.start_y = start_y;
	this.current_x = start_x;
	this.current_y = start_y;
	
	this.end_x = end_x;
	this.end_y = end_y;
	
	var travel_x = end_x - start_x;
	var travel_y = end_y - start_y;
	var travel_distance = Math.sqrt(Math.pow(Math.abs(travel_x),2) + Math.pow(Math.abs(travel_y),2));
	this.speed_x = 25 * travel_x/travel_distance;
	this.speed_y = 25 * travel_y/travel_distance;
	
	this.duration = 0;
	
	/*
	if(animationType == 'Fireball')
	{
		this.RGB_min = [100,0,0];
		this.RGB_max = [255,100,100];
		//create particles
		this.particle_count = 30;
	}
	else
	{
		this.RGB_min = [50,50,100];
		this.RGB_max = [150,150,255];
		//number of lightning bolts to draw on each frame
		this.shock_lines = 3;
	}
	*/
	this.RGB_min = [action_effect_data.R_min, action_effect_data.G_min, action_effect_data.B_min];
	this.RGB_max = [action_effect_data.R_max, action_effect_data.G_max, action_effect_data.B_max];
	this.particle_count = action_effect_data.particle_count;
	this.shock_lines = action_effect_data.shock_lines;
	
	//if particles needed create them
	for(var i = 0; i < this.particle_count; i++)
	{
		this.particles.push(new CanvasAnimController.Particle(this));
		//this.particles[i].radius = 7+Math.random()*5;
		this.particles[i].speed = {x: (this.speed_x)-1.5+Math.random()*3, y: (this.speed_y)-1.5+Math.random()*3};
	}
	
	if(this.particle_count > 0) this.duration = travel_distance/25*this.interval;
}

CanvasAnimController.draw = function()
{
	CanvasAnimController.now = Date.now();
  CanvasAnimController.delta = CanvasAnimController.now - CanvasAnimController.then;
	
  if(CanvasAnimController.delta > CanvasAnimController.interval)
	{
		CanvasAnimController.then = CanvasAnimController.now - (CanvasAnimController.delta % CanvasAnimController.interval);
		
		var ctx = CanvasAnimController.ctx;
		
		ctx.globalCompositeOperation = "source-over";
		ctx.clearRect(0,0, CanvasAnimController.W, CanvasAnimController.H);
		ctx.globalCompositeOperation = "lighter";
		
		var scale = GameController.in_encounter ? 1 : GameController.map_scale*GameController.scale_sprite;
		if(scale != 1)
		{
			ctx.save();
			ctx.scale(scale, scale);
		}
		
		for(var j = 0; j < CanvasAnimController.animations.length; j++)
		{
			var animation = CanvasAnimController.animations[j];
			
			animation.current_x = animation.current_x + animation.speed_x;
			animation.current_y = animation.current_y + animation.speed_y;

			//particle animations
			if(animation.particles.length > 0)
			{
				CanvasAnimController.drawParticles(animation);
			}
			//line animations
			else if(animation.shock_lines > 0)
			{
				CanvasAnimController.drawLineAnimationFrame(animation);
			}
		}
		if(scale != 1)
		{
			ctx.restore();
		}
	}
	
	//remove animations that are done playing
	var i = CanvasAnimController.animations.length;
	while (i--)
	{
		if(CanvasAnimController.animations[i].animationDone == 1)
		{
			CanvasAnimController.animations.splice(i,i+1);
		}
	}
	
	//if no more animations to run clear timer and canvas
	//onsole.log('CanvasAnimController.animations.length '+CanvasAnimController.animations.length);
	if(CanvasAnimController.animations.length == 0)
	{
		//clearInterval(CanvasAnimController.timer);
		CanvasAnimController.ctx.clearRect(0,0, CanvasAnimController.W, CanvasAnimController.H)
	}
	else
	{
		requestAnimationFrame(CanvasAnimController.draw);
	}
	
}

//particle classes ---------------------------------------------------------------------------
CanvasAnimController.drawParticles = function(animation)
{
	var ctx = CanvasAnimController.ctx;
	
	//final explosion
	if(animation.fameCounter > 20)
	{
		animation.endAnimation = 1;
	}
	for(var i = 0; i < animation.particles.length; i++)
	{
		var p = animation.particles[i];
		if(p.remaining_life > 0 && p.radius > 0)
		{
			ctx.beginPath();
			//changing opacity according to the life.
			//opacity goes to 0 at the end of life of a particle
			p.opacity = Math.round(p.remaining_life/p.life*100)/100;
			//a gradient instead of white fill
			var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
			gradient.addColorStop(0, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
			gradient.addColorStop(0.5, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
			gradient.addColorStop(1, "rgba("+p.r+", "+p.g+", "+p.b+", 0)");
			ctx.fillStyle = gradient;
			ctx.arc(p.location.x, p.location.y, p.radius, Math.PI*2, false);
			ctx.fill();
			//lets move the particles
			p.remaining_life--;
			p.radius--;
			p.location.x += p.speed.x;
			p.location.y += p.speed.y;
		}
		//regenerate particles
		if(!animation.endAnimation && (p.remaining_life < 0 || p.radius < 0))
		{
			//a brand new particle replacing the dead one
			animation.particles[i] = new CanvasAnimController.Particle(animation);
		}
		
	}
	animation.animationDone = 1;
	for(var i = 0; i < animation.particles.length; i++)
	{
		var p = animation.particles[i];
		if(p.remaining_life > 0 && p.radius > 0)
		{
			animation.animationDone = 0;
		}
	}
	if(animation.animationDone)
	{
		animation.particles.length = 0;
	}
}

CanvasAnimController.Particle = function(animation)
{
	this.speed = {x: (animation.speed_x/2)-1.5+Math.random()*3, y: (animation.speed_y/2)-1.5+Math.random()*3};
	this.location = {x: animation.current_x, y: animation.current_y};
	this.life = Math.random()*15;
	this.remaining_life = this.life;

	this.r = Math.floor(animation.RGB_min[0]+Math.random()*(animation.RGB_max[0]-animation.RGB_min[0]));
	this.g = Math.floor(animation.RGB_min[1]+Math.random()*(animation.RGB_max[1]-animation.RGB_min[1]));
	this.b = Math.floor(animation.RGB_min[2]+Math.random()*(animation.RGB_max[2]-animation.RGB_min[2]));
	
	this.radius = 13+Math.random()*5;
	//explosion once missile reaches end point, or if speed_x == 0 to make sure animation ends in any case
	if(
			((animation.speed_x >= 0 && animation.current_x >= animation.end_x) || (animation.speed_x <= 0 && animation.current_x <= animation.end_x))
				&&
			((animation.speed_y >= 0 && animation.current_y >= animation.end_y) || (animation.speed_y <= 0 && animation.current_y <= animation.end_y))
		)
	{
		animation.fameCounter++;
		this.location = {x: animation.end_x, y: animation.end_y};
		this.speed = {x: (1+Math.random()*3)*(Math.random() < 0.5 ? -1 : 1), y: (1+Math.random()*3)*(Math.random() < 0.5 ? -1 : 1)};
		this.radius = 10+Math.random()*25 + animation.fameCounter*4;
		this.life = 3+Math.random()*3;
	}
}

//line classes (lightning) ---------------------------------------------------------------------------
CanvasAnimController.drawLineAnimationFrame = function(animation)
{
	animation.fameCounter++;
	//frame duration of lightning
	if(animation.fameCounter > 10)
	{
		animation.endAnimation = 1;
		animation.animationDone = 1; //only need to set this really
	}
	//draw randomized bolts of lightning
	for(var i = 0; i < animation.shock_lines; i++)
	{
		CanvasAnimController.drawLightning(animation);
	}
}

CanvasAnimController.drawLine = function(start_x, start_y, end_x, end_y, width, color)
{
	var ctx = CanvasAnimController.ctx;
	ctx.beginPath();
	ctx.moveTo(start_x, start_y);
	ctx.lineTo(end_x, end_y);
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.stroke();
}

CanvasAnimController.createLightning = function(start_x, start_y, end_x, end_y, maxWidth, RGB_min, RGB_max)
{
	this.bolts = [];
	
	newBolt = new CanvasAnimController.createMainBolt(start_x, start_y, end_x, end_y, maxWidth, RGB_min, RGB_max);
	this.bolts.push(new CanvasAnimController.createSecondaryBolt(newBolt, RGB_max));
	this.bolts.push(new CanvasAnimController.createSecondaryBolt(newBolt, RGB_max));
	this.bolts.push(newBolt);
}

CanvasAnimController.createMainBolt = function(start_x, start_y, end_x, end_y, maxWidth, RGB_min, RGB_max)
{
	this.segmentPositions = [];
	this.maxWidth = maxWidth;
	//give main bolt RGB values in range
	
	this.r = Math.floor(RGB_min[0]+Math.random()*(RGB_max[0]-RGB_min[0]));
	this.g = Math.floor(RGB_min[1]+Math.random()*(RGB_max[1]-RGB_min[1]));
	this.b = Math.floor(RGB_min[2]+Math.random()*(RGB_max[2]-RGB_min[2]));
	
	
	var travel_x = end_x - start_x;
	var travel_y = end_y - start_y;
	var travel_distance = Math.sqrt(Math.pow(Math.abs(travel_x),2) + Math.pow(Math.abs(travel_y),2));
	for(var i = 0; i < travel_distance / 20; i++)
	{
		var position = [start_x + (travel_x / (travel_distance / 20)) * i, start_y + (travel_y / (travel_distance / 20)) * i];
		position[0] = (position[0])-10+Math.random()*20;
		position[1] = (position[1])-10+Math.random()*20;
		this.segmentPositions.push(position);
	}
	this.segmentPositions[0] = [start_x, start_y];
	this.segmentPositions.push([0,0]);
	this.segmentPositions[this.segmentPositions.length-1] = [end_x, end_y];
}
	
CanvasAnimController.createSecondaryBolt = function(bolt, RGB_max)
{
	this.segmentPositions = [];
	this.maxWidth = bolt.maxWidth/2;
	//give secondary bolts max RGB values
	this.r = Math.floor(RGB_max[0]);
	this.g = Math.floor(RGB_max[1]);
	this.b = Math.floor(RGB_max[2]);
	
	for(var i = 0; i < bolt.segmentPositions.length-1; i++)
	{
		var position = [bolt.segmentPositions[i][0], bolt.segmentPositions[i][1]];
		position[0] = (position[0])-5+Math.random()*10;
		position[1] = (position[1])-5+Math.random()*10;
		this.segmentPositions.push(position);
	}
	this.segmentPositions[0] = [bolt.segmentPositions[0][0], bolt.segmentPositions[0][1]];
	this.segmentPositions.push([0,0]);
	this.segmentPositions[this.segmentPositions.length-1] = [bolt.segmentPositions[bolt.segmentPositions.length-1][0], bolt.segmentPositions[bolt.segmentPositions.length-1][1]];
}
	
CanvasAnimController.drawLightning = function(animation)
{
	var lightning = new CanvasAnimController.createLightning(
		animation.start_x, animation.start_y, 
		animation.end_x, animation.end_y, 
		2, animation.RGB_min, animation.RGB_max);
	
	for(var i = 0; i < lightning.bolts.length; i++)
	{
		var thisBolt = lightning.bolts[i];
		for(var j = 0; j < thisBolt.segmentPositions.length-1; j++)
		{
			CanvasAnimController.drawLine(
				thisBolt.segmentPositions[j][0], thisBolt.segmentPositions[j][1], 
				thisBolt.segmentPositions[j+1][0], thisBolt.segmentPositions[j+1][1], 
				thisBolt.maxWidth, "rgb("+thisBolt.r+", "+thisBolt.g+", "+thisBolt.b+")");
		}
	}
}