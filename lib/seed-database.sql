-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert admin user if not exists
INSERT INTO admin_users (username, password, email)
VALUES ('admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin@example.com')
ON CONFLICT (username) DO NOTHING;

-- Insert test sellers if not exist
INSERT INTO sellers (id, name, username, password, email, logo, description, verified, rating, join_date, followers, location, specialties)
VALUES 
  (uuid_generate_v4(), 'Nike', 'nike', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'nike@example.com', '/placeholder.svg?height=100&width=100', 'Official Nike store offering the latest in athletic footwear, apparel, and accessories.', true, 4.8, NOW(), 15000, 'Beaverton, Oregon', ARRAY['Footwear', 'Athletic Apparel', 'Sports Equipment']),
  (uuid_generate_v4(), 'Adidas', 'adidas', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'adidas@example.com', '/placeholder.svg?height=100&width=100', 'Official Adidas store offering the latest in athletic footwear, apparel, and accessories.', true, 4.7, NOW(), 12000, 'Bavaria, Germany', ARRAY['Footwear', 'Athletic Apparel', 'Sports Equipment']),
  (uuid_generate_v4(), 'Puma', 'puma', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'puma@example.com', '/placeholder.svg?height=100&width=100', 'Official Puma store offering the latest in athletic footwear, apparel, and accessories.', true, 4.5, NOW(), 9000, 'Herzogenaurach, Germany', ARRAY['Footwear', 'Athletic Apparel', 'Sports Equipment']),
  (uuid_generate_v4(), 'Under Armour', 'underarmour', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'underarmour@example.com', '/placeholder.svg?height=100&width=100', 'Official Under Armour store offering the latest in athletic footwear, apparel, and accessories.', true, 4.6, NOW(), 7500, 'Baltimore, USA', ARRAY['Footwear', 'Athletic Apparel', 'Sports Equipment']),
  (uuid_generate_v4(), 'New Balance', 'newbalance', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'newbalance@example.com', '/placeholder.svg?height=100&width=100', 'Official New Balance store offering the latest in athletic footwear, apparel, and accessories.', true, 4.4, NOW(), 6000, 'Boston, USA', ARRAY['Footwear', 'Athletic Apparel', 'Sports Equipment'])
ON CONFLICT (username) DO NOTHING;

-- Insert test products
WITH seller_data AS (
  SELECT id, username FROM sellers WHERE username IN ('nike', 'adidas', 'puma', 'underarmour', 'newbalance')
)
INSERT INTO products (name, price, numeric_price, image, description, categories, product_id, source, user_code, quality, in_stock, rating, review_count, colors, sizes, featured, date_added, brand_id, seller_id)
SELECT
  CASE sd.username
    WHEN 'nike' THEN 'Nike Air Force 1'
    WHEN 'adidas' THEN 'Adidas Ultraboost'
    WHEN 'puma' THEN 'Puma RS-X'
    WHEN 'underarmour' THEN 'Under Armour HOVR'
    WHEN 'newbalance' THEN 'New Balance 990'
  END,
  CASE sd.username
    WHEN 'nike' THEN '45.99$'
    WHEN 'adidas' THEN '59.99$'
    WHEN 'puma' THEN '39.99$'
    WHEN 'underarmour' THEN '49.99$'
    WHEN 'newbalance' THEN '54.99$'
  END,
  CASE sd.username
    WHEN 'nike' THEN 45.99
    WHEN 'adidas' THEN 59.99
    WHEN 'puma' THEN 39.99
    WHEN 'underarmour' THEN 49.99
    WHEN 'newbalance' THEN 54.99
  END,
  '/placeholder.svg?height=300&width=300',
  CASE sd.username
    WHEN 'nike' THEN 'Classic Nike Air Force 1 in white colorway.'
    WHEN 'adidas' THEN 'Adidas Ultraboost running shoes with responsive cushioning.'
    WHEN 'puma' THEN 'Puma RS-X with chunky design and bold colors.'
    WHEN 'underarmour' THEN 'Under Armour HOVR running shoes with energy return technology.'
    WHEN 'newbalance' THEN 'New Balance 990 with premium materials and superior comfort.'
  END,
  CASE sd.username
    WHEN 'nike' THEN ARRAY['Shoes', 'Nike']
    WHEN 'adidas' THEN ARRAY['Shoes', 'Adidas', 'Running']
    WHEN 'puma' THEN ARRAY['Shoes', 'Puma', 'Casual']
    WHEN 'underarmour' THEN ARRAY['Shoes', 'Under Armour', 'Running']
    WHEN 'newbalance' THEN ARRAY['Shoes', 'New Balance', 'Running']
  END,
  CASE sd.username
    WHEN 'nike' THEN 'AF1001'
    WHEN 'adidas' THEN 'UB2001'
    WHEN 'puma' THEN 'RSX001'
    WHEN 'underarmour' THEN 'HOVR001'
    WHEN 'newbalance' THEN 'NB990'
  END,
  'WD',
  sd.username,
  CASE sd.username
    WHEN 'puma' THEN 'AA'
    ELSE 'AAA+'
  END,
  true,
  CASE sd.username
    WHEN 'nike' THEN 4.8
    WHEN 'adidas' THEN 4.9
    WHEN 'puma' THEN 4.5
    WHEN 'underarmour' THEN 4.7
    WHEN 'newbalance' THEN 4.8
  END,
  CASE sd.username
    WHEN 'nike' THEN 120
    WHEN 'adidas' THEN 150
    WHEN 'puma' THEN 80
    WHEN 'underarmour' THEN 95
    WHEN 'newbalance' THEN 110
  END,
  CASE sd.username
    WHEN 'nike' THEN ARRAY['White', 'Black', 'Red']
    WHEN 'adidas' THEN ARRAY['Black', 'White', 'Blue']
    WHEN 'puma' THEN ARRAY['White', 'Black', 'Yellow']
    WHEN 'underarmour' THEN ARRAY['Black', 'Gray', 'Red']
    WHEN 'newbalance' THEN ARRAY['Gray', 'Navy', 'Black']
  END,
  ARRAY['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
  CASE sd.username
    WHEN 'nike' THEN true
    WHEN 'adidas' THEN true
    WHEN 'puma' THEN false
    WHEN 'underarmour' THEN false
    WHEN 'newbalance' THEN true
  END,
  NOW(),
  CASE sd.username
    WHEN 'nike' THEN 1
    WHEN 'adidas' THEN 2
    WHEN 'puma' THEN 3
    WHEN 'underarmour' THEN 4
    WHEN 'newbalance' THEN 5
  END,
  sd.id
FROM seller_data sd
ON CONFLICT DO NOTHING;

-- Create seller_products junction entries
INSERT INTO seller_products (seller_id, product_id)
SELECT p.seller_id, p.id
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM seller_products sp
  WHERE sp.seller_id = p.seller_id AND sp.product_id = p.id
);
