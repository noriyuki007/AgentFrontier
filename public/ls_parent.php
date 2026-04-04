<?php
echo "FILE LIST in " . realpath('..') . ":\n";
$files = scandir('..');
foreach ($files as $file) {
    echo $file . "\n";
}
?>
