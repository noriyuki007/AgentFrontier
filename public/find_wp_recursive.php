<?php
function list_dir($dir) {
    echo "D: $dir\n";
    $files = @scandir($dir);
    if (!$files) return;
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $path = $dir . '/' . $file;
        if (is_dir($path)) {
            if (strpos($file, 'node_modules') !== false) continue;
            list_dir($path);
        } else {
            if (strpos($file, 'wp-') === 0) {
                echo "FOUND WP FILE: $path\n";
            }
        }
    }
}
list_dir('.');
?>
