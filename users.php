<?

header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
header('Pragma: no-cache'); // HTTP 1.0.
header('Expires: 0'); // Proxies.

if(isset($_POST)){

    //echo '<pre>'; print_r($_POST['users']); echo'</pre>';exit;

    $file = 'js/data/users.js';
    $handle = fopen($file, 'w') or die('Cannot open file:  '.$file);
    
    $document = 'var users = [';
    
    foreach( $_POST['users'] as $key => $value){
        $document .= '{';
        foreach($value as $k => $val){
            $document .= $k.':"'.$val.'",';
        }
        $document = substr($document, 0, (strlen($document)-1));
        $document .= '},';
    }

    $document = substr($document, 0, (strlen($document)-1));
    $document .= '];';

    if(fwrite($handle, $document))
    	echo 'success';
    else
    	echo 'failure';

    return fwrite($handle, $document);

    fclose($handle);
    exit;
}

?>