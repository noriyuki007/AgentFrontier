<?php
echo "Searching everywhere for Requests.php...\n";
$it = new RecursiveDirectoryIterator(__DIR__);
foreach(new RecursiveIteratorIterator($it) as $file) {
    if (basename($file) == 'Requests.php') {
        echo $file . "\n";
    }
}
echo "Done.\n";
