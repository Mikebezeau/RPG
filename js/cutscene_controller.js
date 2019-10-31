
var CutsceneController = CutsceneController || {};

//hold scenes, default 0, set to array of scene objects when playing scene
CutsceneController.scenes = {};

CutsceneController.scene = function(text, buttons, imageFile, style, imageWidth, imageHeight)
{
	if(arguments.length < 2 || buttons == 0)
	{
		var finishButton = '<span id="selected-button" class="button selected" onclick="CutsceneController.End();">Close</span>';
		buttons = [finishButton];
	}
	if(arguments.length < 3)
	{
		imageFile = 0;
	}
	if(arguments.length < 4)
	{
		style = 0; //'page': letter on a scroll
	}
	if(arguments.length < 5)
	{
		imageWidth = 544;
		imageHeight = 300;
	}
	
	this.text = text;
	this.buttons = buttons;
	this.imageFile = imageFile;
	this.style = style;
	this.imageSize = {'width': imageWidth, 'height': imageHeight};
}

CutsceneController.init = function()
{
	$('#cutscene-next, #cutscene-image').click(function(){
		CutsceneController.LoadCutsceneFadeIn();
	});
	
	/*
	$('#cutscene-next, #cutscene-container').bind(window.mobile?'touchend':'click',function(e){
		e.stopPropagation();
		e.preventDefault();
		CutsceneController.LoadCutsceneFadeIn();
	});
	*/
	
	var text = '';
	
	//set scenes
	var nextButton = '<span id="selected-button" class="button selected" onclick="CutsceneController.ShowNextScene();">Next</span>';
	var readButton = '<span id="selected-button" class="button selected" onclick="CutsceneController.ShowNextScene();">Read the letter</span>';
	
	//inrto scene"
	//text = 'You are sitting in a tavern, in another dull town in some nameless province.<br/><br/>Outside, a fog lies over the town this evening, draping everything in its clammy grasp. The damp cobbled street shines as the light of street lanterns dances across the slick stones.';// The cold fog chills the bones and shivers the soul of anyone outside.';
	text = 'You are sitting in a tavern; outside, a fog lies over the town this evening. The damp cobbled street shines as the light of street lanterns dances across the slick stones.';// The cold fog chills the bones and shivers the soul of anyone outside.';
	var scene1 = new CutsceneController.scene(text, [nextButton], 'cutscene/village.jpg');
	
	//text = 'Yet inside these tavern walls the food is hearty and the ale is warm and frothy. A fire blazes in the hearth and the tavern is alive with the tumbling voices of country folk.';
	text = 'Yet inside these tavern walls the food is hearty. A fire blazes in the hearth and the tavern is alive with the tumbling voices of country folk.';
	var scene2 = new CutsceneController.scene(text, [nextButton], 'cutscene/tavern_2.jpg');
	
	//text = 'Suddenly, a hush falls over the tavern. Even the flagons of ale seem to silence themselves.<br/><br/>The tavern door swings open. Framed by the lamp-lit fog, a form strides into the room. His heavy, booted footfalls and the jingle of his coins shatter the silence. His dark clothes are draped in loose folds about him and his hat hangs askew, hiding his eyes in shadows.<br/><br/>Without hesitation, he walks directly up to your table and stands proudly in a wide stance with folded arms.';
	text = 'The tavern door swings open. Framed by the lamp-lit fog, a form strides into the room. His heavy, booted footfalls and the jingle of his coins shatter the silence. His dark clothes are draped in loose folds about him and his hat hangs askew, hiding his eyes in shadows.<br/><br/>He walks directly towards your table.';
	var scene3 = new CutsceneController.scene(text, [nextButton], 'cutscene/gypsy.jpg');
	
	//text = 'His accented voice speaks, "I have been sent to you to deliver this message! If you be creatures of honor, you will come to my master\'s aid at first light. It is not advisable to travel the Svalich woods at night!"<br/><br/>He pulls from his tunic a sealed letter, addressed to all of you in beautiful flowing script. He drops the letter on the table.<br/><br/>"Take the west road from here some five hours march down through the Svalich woods. There you will find my master in Barovia."';
	text = 'In his accented voice, he speaks, "I have been sent to you to deliver this message!"<br/><br/>He pulls from his tunic a sealed letter, and drops the letter on the table.<br/><br/>"Take the west road from here some five hours march down through the Svalich woods. There you will find my master in Barovia."';
	var scene4 = new CutsceneController.scene(text, [nextButton], 0);
	
	//text = 'Amid the continued silent stares of the patronage, the gypsy strides to the bar and says to the wary barkeeper.<br/><br/>"Fill the glasses, one and all. Their throats are obviously parched."<br/><br/>He drops a purse heavy with gold on the bar. With that, he leaves. The babble of tavern voices resumes, although somewhat subdued.<br/><br/>The letter is lying before you. Dated yesterday, the ink is still not dry and the parchment is crisp. The seal is of a crest you don\'t recognize.';
	text = 'The letter is lying before you. Dated yesterday, the ink is still not dry and the parchment is crisp. The seal is of a crest you don\'t recognize.';
	var scene5 = new CutsceneController.scene(text, [readButton], 0);
	
	text = '<br/>Hail to thee of might and valor:<br/><br/><br/>I, a lowly servant of the township of Barovia, send honor to thee. We plead for thy so desperately needed assistance within our community.<br/><br/>The love of my life, Ireena Kolyana, has been afflicted by an evil so deadly that even the good people of our town cannot protect her.<br/><br/>She languishes from her wound and I would have her saved from this menace.';
	var scene6 = new CutsceneController.scene(text, [nextButton], 0, 'page');
	
	text = '<br/><br/>There is much wealth in this community. I offer all that might be had to thee and thy fellows if thou shah but answer my desperate plea.<br/><br/><br/>Come quickly for her time is at hand! All that I have shall be thine!<br/><br/><br/><br/>Kolyan Indrirovich,<br/><br/>Burgomaster';
	var scene7 = new CutsceneController.scene(text, 0, 0, 'page');
	
	CutsceneController.scenes.intro = [scene1, scene2, scene3, scene4, scene5, scene6, scene7];
	//------------------
	for(var i=0; i<CutsceneController.scenes.intro.length; i++)
	{
		if(CutsceneController.scenes.intro[i].imageFile != 0)
		{
			var imageHtml = '<img id="cutscene-image-'+'intro'+'-'+i+'" src="./images/'+CutsceneController.scenes.intro[i].imageFile+'"/>';
			$('#image-preload').append(imageHtml);
		}
	}
	
	//forest
	text = 'Towering trees, whose tops are lost in heavy gray mist, block out all save a death-gray light.<br/><br/>The tree trunks almost touch. The thick, damp undergrowth presses in on you, making it impossible even to see one another at all times.<br/><br/>The woods have the silence of a forgotten grave, yet exude the feeling of an unsounded scream.';
	scene1 = new CutsceneController.scene(text, 0, 'cutscene/forest.jpg');
	//------------------
	CutsceneController.scenes.forestintro = [scene1];
	for(var i=0; i<CutsceneController.scenes.forestintro.length; i++)
	{
		if(CutsceneController.scenes.forestintro[i].imageFile != 0)
		{
			var imageHtml = '<img id="cutscene-image-'+'forestintro'+'-'+i+'" src="./images/'+CutsceneController.scenes.forestintro[i].imageFile+'"/>';
			$('#image-preload').append(imageHtml);
		}
	}
	
	//gates
	text = 'Jutting from the impenetrable woods on both sides of the road, high stone buttresses loom up gray in the fog. A huge iron gates hangs open on the stonework. Dew clings with cold tenacity to the rusted bars. Two statues of armed guardians silently flank the gate. They greet you only with silence.';
	scene1 = new CutsceneController.scene(text, [nextButton], 'cutscene/gates.jpg');
	text = 'Passing through the gates, they suddenly close behind you, and it seems as though they will not open for you again.<br/><br/>You head along the road and soon approach at a small town.';
	scene2 = new CutsceneController.scene(text, [nextButton], 0);
	text = 'Tall shapes loom out of the dense fog that surrounds everything. The muddy ground underfoot gives way to slick, wet cobblestones. The tall shapes become recognizable as the dwellings of the village of Barovia. The windows of each house stare out from pools of black nothingness. No sound cuts the silence except for a single mournful sobbing that echoes through the streets from a distance.';
	scene3 = new CutsceneController.scene(text, 0, 'cutscene/dark_village.jpg');
	//------------------
	CutsceneController.scenes.baroviagate = [scene1,scene2,scene3];
	for(var i=0; i<CutsceneController.scenes.baroviagate.length; i++)
	{
		if(CutsceneController.scenes.baroviagate[i].imageFile != 0)
		{
			var imageHtml = '<img id="cutscene-image-'+'baroviagate'+'-'+i+'" src="./images/'+CutsceneController.scenes.baroviagate[i].imageFile+'"/>';
			$('#image-preload').append(imageHtml);
		}
	}
	
	//readbloodyletter
	text = 'Hail thee of might and valor:<br/><br/>I, the Burgomaster of Barovia send you honor — with despair.<br/><br/>My adopted daughter, the fair Ireena, has been these past nights bitten by a creature calling its race "vampyr."<br/><br/>For over 400 years he has drained this land of the life-blood of its people.<br/><br/>Now, my dear Ireena languishes and dies from an unholy wound caused by this vile beast. Yet I fear, too, that the creature has some more cunning plan in mind. He has become too powerful to be fought any longer.';
	scene1 = new CutsceneController.scene(text, [nextButton], 'cutscene/blood_spatter.png', 'page');
	text = 'So I say to you, give us up for dead and encircle this land with the symbols of good. Let holy men call upon their power that the evil one may be contained within the walls of weeping Barovia.<br/><br/>There is much wealth entrapped in this community. Return for your reward after we are all departed for a better life.<br/><br/><br/>Kolyan Indirovich,<br/><br/>Burgomaster';
	scene2 = new CutsceneController.scene(text, 0, 'cutscene/blood_spatter.png', 'page');
	//------------------
	CutsceneController.scenes.readbloodyletter = [scene1,scene2];
	
	//BAROVIANOWAYBACK
	text = 'There\'s no way back.';
	scene1 = new CutsceneController.scene(text, 0, 0);
	//------------------
	CutsceneController.scenes.barovianowayback = [scene1];
	
	
}

CutsceneController.Play = function(cutscene_id)
{
	console.log(cutscene_id);
	//CutsceneController.End();
	//return false;
	CutsceneController.current_cutscene_id = cutscene_id;
	CutsceneController.current_scene = CutsceneController.scenes[cutscene_id];
	console.log(CutsceneController.current_scene);
	//hide map and battlemap
	$('#display-game-map').hide();
	$('#battle-container').hide();
	$('#top-buttons').hide();
	$('#game-map-buttons').hide();
	$('#cutscene-container').fadeIn();
	WeatherController.stop();
	CutsceneController.ShowScene(0);
}

CutsceneController.current_scene_index = 0;

CutsceneController.ShowNextScene = function()
{
	if($('#load-cutscene').css('display') == 'none')
	{
		CutsceneController.LoadCutsceneFadeIn();
		return false;
	}
	
	CutsceneController.current_scene_index++;
	if(CutsceneController.current_scene_index >= CutsceneController.current_scene.length)
	{
		CutsceneController.End();
		return false;
	}
	CutsceneController.ShowScene(CutsceneController.current_scene_index);
}

CutsceneController.ShowScene = function(scene_index)
{
	CutsceneController.current_scene_index = scene_index;
	//display scene
	var scene = CutsceneController.current_scene[scene_index];
	$('#load-cutscene').html('');
	
	if(scene_index == 0) $('#cutscene-image').html('');
	
	var message = scene.text; 
	
	var buttons = ''; 

	for(var i=0; i<CutsceneController.current_scene[scene_index].buttons.length; i++)
	{
		buttons += CutsceneController.current_scene[scene_index].buttons[i];
	}
	
	if(scene.style == 'page')
	{
		$('#cutscene-image').html('');
		$('#load-cutscene').html($("#game-menu-inner-scroll").clone());
		$('#load-cutscene #game-menu-inner-scroll-list').html((scene.imageFile ? '<img src="./images/'+scene.imageFile+'" style="position:absolute; top:0; left:0;"/>' : '')+'<div id="cutscene-page-text">'+message+'</div>');
		$('#load-cutscene #game-menu-inner-scroll-list').append(buttons);
		$('#load-cutscene #game-menu-inner-scroll').fadeIn();
	}
	else
	{
		message = message+'<br/><br/>'; 
		MenuController.DisplayMessage(message+buttons, false, '#load-cutscene', 500, 600);
		
		if(scene.imageFile != 0)
		{
			$('#load-cutscene').hide();
			var imageHtml = '<img src="./images/'+scene.imageFile+'" style="width:'+scene.imageSize.width+'px;" />';
			$('#cutscene-image').html(imageHtml);
			var imageHeight = $("#cutscene-image-"+CutsceneController.current_cutscene_id+'-'+scene_index).height();
			var top = 600/2 - imageHeight/2;
			if(top == 300 || top < 0) top = 0;
			$('#cutscene-image').css('top', top+'px');
			$('#cutscene-next').fadeIn();
		}
		else
		{
			CutsceneController.LoadCutsceneFadeIn();
		}
	}
}

CutsceneController.LoadCutsceneFadeIn = function()
{
	$('#cutscene-next').hide();
	$('#load-cutscene').fadeIn();
}

CutsceneController.End = function()
{
	$('#cutscene-container').hide();
	$('#load-cutscene').html('');
	$('#cutscene-image').html('');
	
	$('#top-buttons').show();
	if(mobile) $('#game-map-buttons').show();
	
	//map and battlemap
	if(GameController.in_encounter)
	{
		$('#battle-container').fadeIn();
	}
	else
	{
		$('#display-game-map').fadeIn();
		WeatherController.FadeIn();
	}
}