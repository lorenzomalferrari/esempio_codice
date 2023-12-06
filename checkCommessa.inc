<?php
	$name_odbc = $argv[1];
	$HTTP_HOST = $argv[2];
	$server_file = $argv[3];
	$local_file = $argv[4];
	
	$result = array(); 
	$result['message'] = '';
	$result['name_odbc'] = $name_odbc;
	$result['HTTP_HOST'] = $HTTP_HOST;
	$result['server_file'] = $server_file;
	$result['local_file'] = $local_file;
	$res_ssh2 = "";
	
	if( $name_odbc == 'portale_2' && ( strpos( $HTTP_HOST , 'lorenzomalferrari.com') !== false ) ){
		$ftp_ute = "FTP LM";
		$ftp_server = "ftp.lorenzomalferrari.com";
		$ftp_user_name = "tsLM_ute";
		$ftp_user_pass = "e3@!-lid34";
		$port = 22000;
		
		$root = "";
		include($root . "Net\\SFTP.php");

		$sftp = new Net_SFTP( $ftp_server , $port );
		if ( !$sftp->login( $ftp_user_name , $ftp_user_pass ) ) {
			$res_ssh2 = 'Login fallito';
		}
		else{
			$res_ssh2 = 'Login corretto';
		}
		
		//$sftp->login( $ftp_user_name , $ftp_user_pass );
		$sftp->put( $local_file , $server_file, NET_SFTP_LOCAL_FILE );
		$result['lista'] = $sftp->nlist();
		
	}else if( ( strpos( $HTTP_HOST , 'sviluppo.lorenzomalferrari') !== false ) ) {
		$lm = "ftp.sviluppo.lorenzomalferrari.com";
		
		$ftp_server = "ftp.sviluppo.lorenzomalferrari.com";
		$ftp_user_name = "xxx@aruba.it";
		$ftp_user_pass = "23@q23!!";
		
		$local_file = "/lorenzomalferrari.it/test_ftp/";
		
		$conn_id = ftp_connect($ftp_server, $port);
		$login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass);
		
		$local_file .= $newNameFile;
		$server_file = $newFile;
	//	jhp_log( "$local_file - $server_file");
		if (ftp_put($conn_id, $local_file, $server_file, FTP_BINARY)) {
			$res_ssh2 = $lm . " Dato caricato ";
		}
		else {
			$res_ssh2 = $lm . " Dato NON caricato ";
		}
		ftp_close($conn_id);
	}
	
	$result['message'] = $res_ssh2;

	echo json_encode($result); 
?>