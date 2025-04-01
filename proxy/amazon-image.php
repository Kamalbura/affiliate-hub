<?php
/**
 * Amazon Image Proxy Script
 * 
 * This script serves as a proxy to fetch Amazon product images while bypassing CORS restrictions.
 * It attempts multiple image URL patterns for a given ASIN.
 */

// Set appropriate headers
header('Content-Type: image/jpeg');
header('Cache-Control: public, max-age=86400'); // Cache for 24 hours

// Get ASIN from request
$asin = isset($_GET['asin']) ? $_GET['asin'] : null;

if (!$asin || !preg_match('/^[A-Z0-9]{10}$/i', $asin)) {
    http_response_code(400);
    echo 'Invalid ASIN provided';
    exit;
}

// Amazon image URL patterns to try
$urlPatterns = [
    "https://images-na.ssl-images-amazon.com/images/I/$asin.jpg",
    "https://images-na.ssl-images-amazon.com/images/I/$asin._SL1500_.jpg",
    "https://images-na.ssl-images-amazon.com/images/I/$asin._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/$asin.jpg",
    "https://m.media-amazon.com/images/I/$asin}._AC_SY450_.jpg"
];

// Function to download image with cURL
function downloadImage($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    $data = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return $httpCode === 200 ? $data : false;
}

// Try each URL pattern until we find a working image
foreach ($urlPatterns as $url) {
    $imageData = downloadImage($url);
    if ($imageData) {
        echo $imageData;
        exit;
    }
}

// If all patterns fail, return a default placeholder
http_response_code(404);

// Use a simple placeholder image if we can't find the Amazon image
$placeholderSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <rect width="300" height="300" fill="#f0f0f0"/>
    <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#666" text-anchor="middle">Image not available</text>
</svg>';

header('Content-Type: image/svg+xml');
echo $placeholderSvg;
?>
