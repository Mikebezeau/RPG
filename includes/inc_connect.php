<?php
	function dbConnect() {

		$host="localhost";
		$username="mikebeze_mikeb";
		$password="canItbe1";
		$database="mikebeze_planewalker";
	
		$link = mysqli_connect($host, $username, $password, $database);
					
		if (mysqli_connect_errno()) {
			printf(mysqli_connect_error());
			exit();
		} // End if
		
		return $link;
	
	} // End dbConnect
?>