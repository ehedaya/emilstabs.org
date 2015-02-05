<?php

// grab the files
$files = scandir(dirname(__FILE__));

// remove "." and ".." (and anything else you might not want)
$output = array();
foreach ($files as $file)
  if (!in_array($file, array(".", "..", ".DS_Store", "index.php")))
    $output[] = $file;

// out we go
header("Content-type: text/json");
echo json_encode($output);

?>