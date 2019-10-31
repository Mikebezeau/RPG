<?php
//save sprite info
if(isset($_POST['id']))
{
	$SpriteID = $_POST['id'];
	$data = json_decode($_POST['data'], true);
	$FilePathName = $data['file'];
	$DefaultSpriteScale = $data['scale'];
	$AnimSpritesIndex = $data['anim_sprites_index'];
	echo 'saving sprite '.$SpriteID.' -> '.$DefaultSpriteScale.', '.$FilePathName;
	
	include_once("./includes/inc_connect.php"); 
	// Connect to database using function from "inc_connect.php"
	$link = dbConnect();
	
	echo $query = "SELECT * FROM Sprites WHERE SpriteID = '$SpriteID'";
	//perform Encounters Query
	$result = mysqli_query($link,$query);
	if($row = mysqli_fetch_object($result))
	{
		//update
		echo $query = "UPDATE Sprites SET FilePathName = '$FilePathName', DefaultSpriteScale = '$DefaultSpriteScale', AnimSpritesIndex = '$AnimSpritesIndex' WHERE SpriteID = '$SpriteID'";
		$result = mysqli_query($link,$query);
	}
	else
	{
		//insert
		echo $query = "INSERT INTO Sprites (SpriteID, FilePathName, DefaultSpriteScale, AnimSpritesIndex) VALUES ('$SpriteID', '$FilePathName', $DefaultSpriteScale, $AnimSpritesIndex)";
		$result = mysqli_query($link,$query);
	}
	mysqli_close($link);
	
	exit;
}

//image transform

if(isset($_REQUEST['transform']))
{

	function ImageFlip($im, $mode)
	{
			$width = imagesx($im);
			$height = imagesy($im);
			$src_x = 0;
			$src_y = 0;
			$src_width = $width;
			$src_height = $height;

			switch($mode)
			{
					case '1': //vertical
							$src_y                =    $height -1;
							$src_height           =    -$height;
					break;

					case '2': //horizontal
							$src_x                =    $width -1;
							$src_width            =    -$width;
					break;

					case '3': //both
							$src_x                =    $width -1;
							$src_y                =    $height -1;
							$src_width            =    -$width;
							$src_height           =    -$height;
					break;

					default:
							return $im;

			}

			$imgdest = imagecreatetruecolor($width, $height);
			imageAlphaBlending($imgdest, false);
			imageSaveAlpha($imgdest, true);
					
			if(imagecopyresampled($imgdest, $im, 0, 0, $src_x, $src_y , $width, $height, $src_width, $src_height))
			{
					return $imgdest;
			}

			return 0;
	}
	
	//flip the image horizontally
	$src=$_REQUEST['src'];
	$im=imagecreatefrompng($src);
	$mode=2;
	if($im = ImageFlip($im, $mode))
	{
		//save to file
		imagepng($im, $src);
		echo 'success';
	}
	imagedestroy($im);
	exit;
}
?><!DOCTYPE html>

<html>
	
	<head>
		
		<title>PlaneScape Sprite Manager</title>
		
		<script src="./js/jquery-2.1.3.min.js"></script>

		<meta charset="UTF-8" />

	</head>
	
	<body style="background-color: #000; color:#fff;">
		
		<div id="sprite-form" style="display:none; z-index:100; background-color:#000; position:fixed; left:100px; top:100px; border:4px solid #fff;">
			<img src=""/>
			<div>Scale: <span id="sprite-scale">1</span> <button id="scale-plus">+</button> <button id="scale-minus">-</button></div>
			<input type="text" value="0" id="sprite-id"/>
			<input type="text" value="0" id="sprite-file-path-name"/>
			<input type="text" value="0" id="anim-sprites-index"/>
			<div id="sprite-flip" style="cursor:pointer; background-color:#aaa; color:#000; text-align:center;">FLIP HORIZ.</div>
			<div id="sprite-form-submit" style="cursor:pointer; background-color:#ddd; color:#000; text-align:center;">SAVE</div>
			<div id="sprite-form-cancel" onclick="$('#sprite-form').hide();" style="cursor:pointer; background-color:#ccc; color:#000; text-align:center;">CLOSE</div>
		</div>
		
		<div id="loading">LOADING...</div>
		
		<style>
		#column-1 img{
			background-color:#500;
		}
		
		img{
			image-rendering: optimizeSpeed;
			image-rendering: -moz-crisp-edges;          /* Firefox                        */
			image-rendering: -o-crisp-edges;            /* Opera                          */
			image-rendering: -webkit-optimize-contrast; /* Chrome (and eventually Safari) */
			image-rendering: pixelated; 								/* Chrome */
			image-rendering: optimize-contrast;         /* CSS3 Proposed                  */
			-ms-interpolation-mode: nearest-neighbor;   /* IE8+                           */
		}
		</style>
		<div id="column-1" style="min-height:1000px; position:relative;">
			<div id="save-all-unsaved" style="cursor:pointer; background-color:#ddd; color:#000; text-align:center;">SAVE ALL UNSAVED SPRITES</div>
			
			<?php
				//query sprite information
				// database connect function
				
				include_once("./includes/inc_connect.php"); 
				// Connect to database using function from "inc_connect.php"
				$link = dbConnect();
				//query
				$query = 'SELECT * FROM Sprites';
				//perform Encounters Query
				$result = mysqli_query($link,$query);
				$sprite_arr = array();
				while($row = mysqli_fetch_object($result))
				{
					$sprite_arr[] = $row;
				}
				mysqli_close($link);
				
				include_once('./php/get_images.php');
				echo('<br/>Male<br/>');
				ListImages(GetFileList('./images/char/sprite/char/male', true));
				echo('<br/><br/><br/>Female<br/>');
				ListImages(GetFileList('./images/char/sprite/char/female', true));
				echo('<br/><br/><br/>Townsfolk<br/>');
				ListImages(GetFileList('./images/char/sprite/char/folk', true));
				echo('<br/><br/><br/>Cat<br/>');
				ListImages(GetFileList('./images/char/sprite/char/cats', true));
				echo('<br/><br/><br/>Animals<br/>');
				ListImages(GetFileList('./images/char/sprite/char/animal', true));
				echo('<br/><br/><br/>Monsters<br/>');
				ListImages(GetFileList('./images/char/sprite/char/monster', true));
			?>
		</div>

	</body>
</html>

<script>
$(window).load(function(){
	
	var sprite_data = <?php echo json_encode($sprite_arr); ?>;
	
	//ajax call to php/get_images.php to delete sprite image files that aren't found
	function DeleteSprite(SpriteID)
	{
		$.ajax({
			type: "POST",
			async: true,
			url: "./php/get_images.php",
			data: {'delete_sprite_id' : SpriteID}
		})
	}
	
	for(var i=0; i<sprite_data.length; i++)
	{
		try
		{
			var width = $('#image-'+sprite_data[i].SpriteID).get(0).naturalWidth;
			width = width * parseFloat(sprite_data[i].DefaultSpriteScale);
			$('#image-'+sprite_data[i].SpriteID).css('width', width+'px');
			$('#image-'+sprite_data[i].SpriteID).css('background-color', '#000');
		}
		catch(err)
		{
			console.log('deleting sprite:',sprite_data[i]);
			DeleteSprite(sprite_data[i].SpriteID);
		}
	}
	
	$('#loading').hide();
	//$('#column-1').show();
	
	$('#column-1 > img').click(function()
	{
		$('#sprite-form > img').attr('src', $(this).attr('src'));
		$('#sprite-form #sprite-scale').html('1');
		for(var i=0; i<sprite_data.length; i++)
		{
			//onsole.log(sprite_data[i]);
			if(parseInt(sprite_data[i].SpriteID) == parseInt($(this).data('name')))
			{
				$('#sprite-form #sprite-scale').html(sprite_data[i].DefaultSpriteScale);
			}
		}
		$('#sprite-form #sprite-id').val(parseInt($(this).data('name')));
		$('#sprite-form #sprite-file-path-name').val($(this).data('file'));
		
		var width = $(this).get(0).naturalWidth;
		//onsole.log('width',width);
		var scale = parseFloat($('#sprite-form #sprite-scale').html());
		width = width * scale;
		//onsole.log('width * scale',width);
		$('#sprite-form img').css('width', width+'px');
		
		$('#sprite-form').show();
	});
	
	$('#scale-plus').click(function()
	{
		var scale = parseFloat($('#sprite-form #sprite-scale').html());
		scale += 0.1;
		scale = scale.toFixed(1);
		$('#sprite-form #sprite-scale').html(scale);
		
		var width = $('#sprite-form img').get(0).naturalWidth;
		//onsole.log('width',width);
		width = width * scale;
		//onsole.log('width * scale',width);
		$('#sprite-form img').css('width', width+'px');
		$('#image-'+$('#sprite-form #sprite-id').val()).css('width', width+'px');
	});
	
	$('#scale-minus').click(function()
	{
		var scale = parseFloat($('#sprite-form #sprite-scale').html());
		scale -= 0.1;
		scale = scale.toFixed(1);
		$('#sprite-form #sprite-scale').html(scale);
		
		var width = $('#sprite-form img').get(0).naturalWidth;
		//onsole.log('width',width);
		width = width * scale;
		//onsole.log('width * scale',width);
		$('#sprite-form img').css('width', width+'px');
		$('#image-'+$('#sprite-form #sprite-id').val()).css('width', width+'px');
	});
	
	
	$('#sprite-flip').click(function()
	{
		var id = $('#sprite-form #sprite-id').val();
		var src = './images/'+$('#sprite-form #sprite-file-path-name').val();
		
		$.ajax({
			type: "POST",
			async: false,
			url: "#",
			data: {transform : 0, src : src}
		})
			.done(function(returnData) { 
					//onsole.log(returnData);
					//reload image
					var d = new Date();
					$('#image-'+id).attr('src', src+'?'+d.getTime());
					$('#sprite-form img').attr('src', src+'?'+d.getTime());
				});
	});
	
	$('#sprite-form-submit').click(function()
	{
		var id = $('#sprite-form #sprite-id').val();
		id = parseInt(id);
		var data = {
				'file': $('#sprite-form #sprite-file-path-name').val(),
				'scale': parseFloat($('#sprite-form #sprite-scale').html()).toFixed(1),
				'anim_sprites_index': parseInt($('#sprite-form #anim-sprites-index').val())
			};
			
		$.ajax({
			type: "POST",
			async: false,
			url: "#",
			data: {id : id, data : JSON.stringify(data)}
		})
			.done(function(returnData) { 
					var found = false;
					for(var i=0; i<sprite_data.length; i++)
					{
						if(parseInt(sprite_data[i].SpriteID) == id)
						{
							found = true;
							sprite_data[i].DefaultSpriteScale = data.scale;
						}
					}
					if(!found)
					{
						sprite_data.push({'SpriteID': id, 'DefaultSpriteScale': data.scale});
					}
					
					$('#image-'+id).css('background-color', '#000');
					$('#sprite-form').hide();
					if(!bulk_save) alert('Sprite saved');
				});
	});
	
	
	var bulk_save = false;
	$('#save-all-unsaved').click(function(){
		bulk_save = true;
		//save all
		$('#column-1 > img').each(function()
		{
			$(this).trigger('click');
			
			var found = false;
			for(var i=0; i<sprite_data.length; i++)
			{
				if(parseInt(sprite_data[i].SpriteID) == parseInt($('#sprite-form #sprite-id').val()))
				{
					found = true;
				}
			}
			if(!found)
			{
				$('#sprite-form-submit').trigger('click');
			}
			else
			{
				$('#sprite-form-cancel').trigger('click');
			}
		});
		bulk_save = false;
	});
	
});
</script>