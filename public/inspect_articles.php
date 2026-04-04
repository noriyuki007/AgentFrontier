<?php
require_once(__DIR__ . '/wp-load.php');

// 1. Get info for specific IDs
$ids = [3868, 3972, 3961];
echo "--- Specific Articles ---\n";
foreach ($ids as $id) {
    $post = get_post($id);
    if ($post) {
        $cats = wp_get_post_categories($id, ['fields' => 'names']);
        echo "ID: {$id} | Title: {$post->post_title} | Category: " . implode(', ', $cats) . "\n";
        // Check for unwanted text
        if (strpos($post->post_content, 'まだ自社のフェーズに迷っていますか？') !== false) {
            echo "  [FOUND] Unwanted text present\n";
        }
    } else {
        echo "ID: {$id} | NOT FOUND\n";
    }
}

// 2. Get articles in "AIスタートアップ最前線" (ID 17 per config.js)
echo "\n--- AIスタートアップ最前線 Articles ---\n";
$startup_posts = get_posts([
    'category' => 17,
    'post_status' => 'any',
    'numberposts' => -1
]);

foreach ($startup_posts as $post) {
    echo "ID: {$post->ID} | Title: {$post->post_title} | Status: {$post->post_status}\n";
    if (strpos($post->post_content, 'まだ自社のフェーズに迷っていますか？') !== false) {
        echo "  [FOUND] Unwanted text present\n";
    }
}

// 3. Count total posts with unwanted text
$all_posts = get_posts([
    'post_type' => 'post',
    'post_status' => 'any',
    'numberposts' => -1,
    's' => 'まだ自社のフェーズに迷っていますか？'
]);
echo "\nTotal posts containing unwanted text: " . count($all_posts) . "\n";
?>
