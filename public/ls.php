<?php
echo "FILE LIST in " . getcwd() . ":\n";
$files = scandir('.');
foreach ($files as $file) {
    echo $file . "\n";
}
echo "\nWP-INCLUDES LIST:\n";
if (is_dir('wp-includes')) {
    $wp_files = scandir('wp-includes');
    foreach ($wp_files as $f) {
        echo $f . "\n";
    }
} else {
    echo "wp-includes is NOT A DIRECTORY\n";
}
?>
