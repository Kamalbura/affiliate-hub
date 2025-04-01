<?php
/**
 * Indian Product Image Search Proxy
 * 
 * This script searches for product images from Indian sources
 * and returns results in JSON format.
 */

header('Content-Type: application/json');

// Get search query
$query = isset($_GET['q']) ? $_GET['q'] : null;

if (!$query) {
    http_response_code(400);
    echo json_encode(['error' => 'No search query provided']);
    exit;
}

// Rate limiting
session_start();
$now = time();
$rate_limit_window = 60; // 60 seconds
$rate_limit_max = 5; // 5 searches per minute

// Initialize session variables if needed
if (!isset($_SESSION['search_rate_limit_count'])) {
    $_SESSION['search_rate_limit_count'] = 0;
    $_SESSION['search_rate_limit_start'] = $now;
}

// Reset counter if time window has passed
if ($now - $_SESSION['search_rate_limit_start'] > $rate_limit_window) {
    $_SESSION['search_rate_limit_count'] = 0;
    $_SESSION['search_rate_limit_start'] = $now;
}

// Check if rate limit is exceeded
if ($_SESSION['search_rate_limit_count'] >= $rate_limit_max) {
    http_response_code(429);
    echo json_encode(['error' => 'Rate limit exceeded']);
    exit;
}

// Increment request counter
$_SESSION['search_rate_limit_count']++;

// Create a cache key from the query
$cacheKey = md5($query);
$cacheFile = __DIR__ . '/../cache/image_search_' . $cacheKey . '.json';
$cacheDir = __DIR__ . '/../cache/';

// Create cache directory if it doesn't exist
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0755, true);
}

// Check if we have cached results
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < 86400)) { // 24 hours cache
    $cachedData = file_get_contents($cacheFile);
    echo $cachedData;
    exit;
}

// Function to search for product images
function searchImages($query) {
    // Add Indian context to the search query
    $query = $query . ' product India';
    
    // Prepare the search URL (using a free API or public source)
    // Note: In a production environment, you should use a paid API with proper authentication
    $searchUrl = "https://serpapi.com/search.json?q=" . urlencode($query) . "&tbm=isch&ijn=0";
    
    // For demonstration purposes, we'll simulate search results
    // In a real implementation, you would make an actual API call
    
    $simulatedResults = [
        'images' => [
            [
                'title' => 'Product 1',
                'url' => 'https://via.placeholder.com/300x300.jpg?text=Indian+Product'
            ],
            [
                'title' => 'Product 2',
                'url' => 'https://via.placeholder.com/300x300.jpg?text=Made+In+India'
            ]
        ]
    ];
    
    // In a real implementation, you would:
    // 1. Make an API call to a proper image search API
    // 2. Parse the results and format them
    // 3. Filter for relevant product images
    
    return $simulatedResults;
}

try {
    $results = searchImages($query);
    
    // Cache the results
    file_put_contents($cacheFile, json_encode($results));
    
    echo json_encode($results);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Search failed: ' . $e->getMessage()]);
}
?>
