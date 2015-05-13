<?php
$ds          = DIRECTORY_SEPARATOR;  //1
$ip          = $_POST['empId'];
$fp          = $_POST['folder'];
$tp          = $_POST['tipo'];
 
$storeFolder = 'img' . $ds . $fp . $ds . $ip;   //3

if (!file_exists($storeFolder)) {
    mkdir($storeFolder, 0777, true);
}

//echo $_POST;
 
if (!empty($_FILES)) {
     
    $tempFile = $_FILES['file']['tmp_name'];          //3             
      
    $targetPath = dirname( __FILE__ ) . $ds. $storeFolder . $ds;  //4
     
    $targetFile =  $targetPath. $tp. $_FILES['file']['name'];  //5
 
    move_uploaded_file($tempFile,$targetFile); //6
     
}
?>