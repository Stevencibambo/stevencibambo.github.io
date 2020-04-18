<?php
	/**
	*
	*/
	define('UPLOAD_DIR', 'images/');
	$face = $_POST['face'];
	//$screen = $_POST['screen'];

	$face = str_replace('data:image/jpeg;base64,', '', $face);
	$face = str_replace(' ', '+', $face);
	$data = base64_decode($face);
	$file = UPLOAD_DIR."face/".uniqid() . '.jpeg';
	$success = file_put_contents($file, $data);

	echo $success ? $data : $_POST["face"];
?>