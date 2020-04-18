<?php
	/**
	*
	*/
	define('UPLOAD_DIR', 'images/');
	$face = $_POST['face'];

	$face = str_replace('data:image/jpeg;base64,', '', $face);
	$face = str_replace(' ', '+', $face);
	$face_data = base64_decode($face);

	$face_file = UPLOAD_DIR . "face/". uniqid() . '.jpeg';

	$face_res = file_put_contents($face_file, $face_data);

	
	if ($face_res){
		echo "[face path: ]" . $face_file;
	}
?>