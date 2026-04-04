<?php
require_once(__DIR__ . '/wp-load.php');

$ghost_ids = [4255, 4254, 4253, 4252, 4251];

echo "--- Ghost Post Audit (ID range 4251-4255) ---\n";
foreach ($ghost_ids as $id) {
    $post = get_post($id);
    if ($post) {
        $meta = get_post_meta($id);
        $thumb_id = get_post_thumbnail_id($id);
        echo "ID: {$id}\n";
        echo "  Title: {$post->post_title}\n";
        echo "  Status: {$post->post_status}\n";
        echo "  Permalink: " . get_permalink($id) . "\n";
        echo "  Content Length: " . strlen($post->post_content) . " chars\n";
        echo "  Featured Image ID: " . ($thumb_id ? $thumb_id : "None") . "\n";
        echo "  Featured Image URL: " . ($thumb_id ? wp_get_attachment_url($thumb_id) : "N/A") . "\n";
    } else {
        echo "ID: {$id} | NOT FOUND in WordPress database\n";
    }
}

echo "\n--- Recent Posts Scoped Audit ---\n";
$recent = get_posts(['numberposts' => 10, 'post_status' => 'any']);
foreach ($recent as $p) {
    echo "ID: {$p->ID} | Title: {$p->post_title} | Status: {$p->post_status} | Link: " . get_permalink($p->ID) . "\n";
}

// 403 Audit for /review
echo "\n--- Reviews Page Audit ---\n";
$review_page = get_page_by_path('review');
if ($review_page) {
    echo "Review Page ID: " . $review_page->ID . " | Link: " . get_permalink($review_page->ID) . "\n";
} else {
    echo "Review Page NOT FOUND by path 'review'\n";
    // Check categories
    $cat = get_category_by_slug('review');
    if ($cat) {
        echo "Review CATEGORY exists (ID: {$cat->term_id}) | Link: " . get_category_link($cat->term_id) . "\n";
    }
}
?>
