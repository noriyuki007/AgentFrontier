<?php
echo "Checking core core files...\n";
$file = __DIR__ . '/wp-includes/Requests/src/Requests.php';
if (file_exists($file)) {
    echo "Requests.php EXISTS at $file\n";
} else {
    echo "Requests.php MISSING at $file\n";
}

$Requests_php = __DIR__ . '/wp-includes/Requests.php';
if (file_exists($Requests_php)) {
    echo "Requests.php (old path) EXISTS at $Requests_php\n";
}

// Show where we are
echo "CWD: " . getcwd() . "\n";
