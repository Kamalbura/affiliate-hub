# TechDeals Hub - Amazon Affiliate Website

## Setup Instructions

### Prerequisites
- PHP 7.0 or higher
- Apache web server with mod_rewrite enabled
- Write permissions for the `img/products` directory

### Installation
1. Clone this repository to your web server directory
2. Ensure the PHP proxy script at `proxy/amazon-image.php` has execute permissions
3. Make sure the `img/products` directory exists and has proper write permissions
4. If using Apache, the included .htaccess file should work automatically
5. If using Nginx, configure similar rules to those in the .htaccess file

### Image Loading System
The site uses a multi-tiered approach to product images:

1. First tries to load images from the local `/img/products/` directory
2. If not available locally, tries to fetch from Amazon using the product ASIN
3. Uses a proxy script to avoid CORS issues when fetching from Amazon
4. Falls back to a generated placeholder if both methods fail

### Adding New Products
When adding new products, you can either:

1. Manually add images to the `/img/products/` directory using the product title as the filename (lowercase, hyphenated)
2. Let the system automatically fetch images from Amazon based on the affiliate link

### Troubleshooting
- If images aren't loading, check browser console for errors
- Verify that the proxy script has proper permissions
- Check server logs for any PHP errors
- Make sure all product cards have proper Amazon affiliate links with valid ASINs

### Security Notes
- The proxy script only accepts valid Amazon ASINs (10-character alphanumeric strings)
- It has a built-in timeout to prevent abuse
- Consider adding rate limiting if the site receives high traffic
