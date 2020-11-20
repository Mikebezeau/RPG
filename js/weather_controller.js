//requires GameController to be defined first

var WeatherController = WeatherController || {};

WeatherController=
{
	'canvas':0,
	'ctx':0,
	'width': 0,
	'height': 0,
	 
	'cloud': 0,
	'cloud2': 0,
	'cloud_x': 0,
	'cloud2_x': 0,
	'cloud_y': 0,
	'cloud2_y': 0,
	'timer': 0,
	'fade': 0,
	'loaded': 0
}

WeatherController.init = function() //called in 'GameController.init'
{
	if(window.mobile) return false;
	
	var weather=WeatherController;
	
	weather.canvas = document.getElementById('display-game-weather-effects');
	weather.canvas.height = 544;//GameController.display_canvas.height;
	weather.canvas.width = 544;//GameController.display_canvas.width;
	weather.width = weather.canvas.width;
	weather.height = weather.canvas.height;
	weather.ctx = weather.canvas.getContext("2d");
	
	weather.ctx.globalAlpha=0.2;
	
	// init cloud
	weather.cloud = new Image();
	weather.cloud.src = './images/weather/cloud.png';
	weather.cloud.onload = function(){
		weather.cloud_x = -weather.cloud.width;
		weather.cloud_y = Math.floor(Math.random() * ((weather.height-(weather.cloud.naturalHeight/2)) - (-(weather.cloud.naturalHeight/2)))) + (-(weather.cloud.naturalHeight/2));
		WeatherController.loaded = 1;
	};
	// init cloud
	weather.cloud2 = new Image();
	weather.cloud2.src = './images/weather/cloud.png';
	weather.cloud2.onload = function(){
		weather.cloud2_x = 250;
		weather.cloud2_y = Math.floor(Math.random() * ((weather.height-(weather.cloud.naturalHeight/2)) - (-(weather.cloud.naturalHeight/2)))) + (-(weather.cloud.naturalHeight/2));
	};
}

WeatherController.update = function()
{
	var weather=WeatherController;
	
	weather.cloud_x += 0.5;
	if(weather.cloud_x > weather.width)
	{
		weather.cloud_x = -weather.cloud.width;
		weather.cloud_y = Math.floor(Math.random() * ((weather.height-(weather.cloud.naturalHeight/2)) - (-(weather.cloud.naturalHeight/2)))) + (-(weather.cloud.naturalHeight/2));
	}
	weather.cloud2_x += 0.75;
	if(weather.cloud2_x > weather.width)
	{
		weather.cloud2_x = -weather.cloud.width;
		weather.cloud2_y = Math.floor(Math.random() * ((weather.height-(weather.cloud.naturalHeight/2)) - (-(weather.cloud.naturalHeight/2)))) + (-(weather.cloud.naturalHeight/2));
	}
}

WeatherController.draw = function()
{
	var weather=WeatherController;
	var alpha = 0.2;
	if(WeatherController.loaded && WeatherController.fade < 50)
	{
		alpha = Math.floor(WeatherController.fade/250 * 100) / 100;
		WeatherController.fade++;
	}
	var dFactor = GameController.area_settings[GameController.area_id].DarknessFactor;
	alpha = alpha * dFactor;
	
	if(weather.ctx.globalAlpha != alpha) weather.ctx.globalAlpha = alpha;
	
	weather.ctx.clearRect(0,0,weather.width,weather.height);
	weather.ctx.drawImage(weather.cloud, weather.cloud_x, weather.cloud_y);
	weather.ctx.drawImage(weather.cloud2, weather.cloud2_x, weather.cloud2_y);
}

WeatherController.use_requestAnimationFrame = function()
{
	requestAnimationFrame(WeatherController.main_loop);
}

WeatherController.FadeIn = function()
{
	WeatherController.start();
	WeatherController.fade = 0;
	$('#display-game-weather-effects').hide();
}

WeatherController.start = function()
{
	if(window.mobile) return false;
	
	var game = GameController;
	if(game.edit || (game.active_player_index >= 0 && 
		(game.facade_layer[game.characters[game.active_player_index].y][game.characters[game.active_player_index].x] != 0  
		|| !game.area_settings[game.area_id].showWeather))
	)
	{
		WeatherController.stop();
		return false;
	}
	
	if(WeatherController.timer != 0)
	{
		WeatherController.fade = 50;
		WeatherController.timer = setInterval(WeatherController.use_requestAnimationFrame, 100);
		$('#display-game-weather-effects').show();
	}
}

WeatherController.stop = function()
{
	if(window.mobile) return false;
	
	clearInterval(WeatherController.timer);
	WeatherController.timer = 0;
	$('#display-game-weather-effects').hide();
}

WeatherController.main_loop = function()
{
	WeatherController.draw();
	WeatherController.update();
}
 
//WeatherController.init();