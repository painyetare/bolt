-- Create stored procedures for table creation and data seeding

-- Create brands table if it doesn't exist
CREATE OR REPLACE FUNCTION create_brands_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'brands') THEN
    CREATE TABLE brands (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      logo VARCHAR(255),
      website VARCHAR(255),
      featured BOOLEAN DEFAULT false,
      product_count INTEGER DEFAULT 0
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create collections table if it doesn't exist
CREATE OR REPLACE FUNCTION create_collections_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'collections') THEN
    CREATE TABLE collections (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      image VARCHAR(255),
      count INTEGER DEFAULT 0,
      featured BOOLEAN DEFAULT false
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create sellers table if it doesn't exist
CREATE OR REPLACE FUNCTION create_sellers_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sellers') THEN
    CREATE TABLE sellers (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      logo VARCHAR(255),
      description TEXT,
      verified BOOLEAN DEFAULT false,
      rating DECIMAL(3,1) DEFAULT 0,
      followers INTEGER DEFAULT 0,
      location VARCHAR(255),
      specialties TEXT[],
      products TEXT[],
      join_date DATE DEFAULT CURRENT_DATE
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create products table if it doesn't exist
CREATE OR REPLACE FUNCTION create_products_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products') THEN
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price VARCHAR(50) NOT NULL,
      numeric_price DECIMAL(10,2) NOT NULL,
      image VARCHAR(255),
      description TEXT,
      categories TEXT[],
      product_id VARCHAR(255),
      source VARCHAR(50),
      user_code VARCHAR(50),
      quality VARCHAR(50),
      in_stock BOOLEAN DEFAULT true,
      discount DECIMAL(5,2),
      rating DECIMAL(3,1),
      review_count INTEGER,
      colors TEXT[],
      sizes TEXT[],
      featured BOOLEAN DEFAULT false,
      date_added DATE DEFAULT CURRENT_DATE,
      brand_id INTEGER REFERENCES brands(id),
      additional_images TEXT[],
      qc_picture_url VARCHAR(255),
      product_link VARCHAR(255),
      gender VARCHAR(50)
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create product_requests table if it doesn't exist
CREATE OR REPLACE FUNCTION create_product_requests_table_if_not_exists()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product_requests') THEN
    CREATE TABLE product_requests (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      description TEXT,
      budget VARCHAR(100),
      category VARCHAR(100),
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Seed brands
CREATE OR REPLACE FUNCTION seed_brands()
RETURNS void AS $$
BEGIN
  -- Insert initial brands
  INSERT INTO brands (name, description, logo, website, featured, product_count)
  VALUES
    ('Nike', 'Just Do It', '/placeholder.svg?height=200&width=200', 'https://www.nike.com', true, 12),
    ('Adidas', 'Impossible is Nothing', '/placeholder.svg?height=200&width=200', 'https://www.adidas.com', true, 8),
    ('Jordan', 'Authentic Jordan brand replicas', '/placeholder.svg?height=200&width=200', 'https://www.nike.com/jordan', true, 10),
    ('Louis Vuitton', 'Luxury fashion house', '/placeholder.svg?height=200&width=200', 'https://www.louisvuitton.com', true, 6),
    ('Gucci', 'Italian luxury brand', '/placeholder.svg?height=200&width=200', 'https://www.gucci.com', false, 5)
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Seed collections
CREATE OR REPLACE FUNCTION seed_collections()
RETURNS void AS $$
BEGIN
  -- Insert initial collections
  INSERT INTO collections (name, description, image, count, featured)
  VALUES
    ('Trending Now', 'Our most popular products that are flying off the shelves', '/placeholder.svg?height=300&width=500', 12, true),
    ('New Arrivals', 'The latest additions to our catalog', '/placeholder.svg?height=300&width=500', 8, true),
    ('Budget Finds', 'Great quality products at affordable prices', '/placeholder.svg?height=300&width=500', 15, true),
    ('Luxury Items', 'Premium replicas of high-end luxury brands', '/placeholder.svg?height=300&width=500', 10, false)
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Seed sellers
CREATE OR REPLACE FUNCTION seed_sellers()
RETURNS void AS $$
BEGIN
  -- Insert initial sellers with hashed passwords
  INSERT INTO sellers (username, password, name, email, logo, description, verified, rating, followers, location, specialties, products)
  VALUES
    ('nike', encode(digest('password123', 'sha256'), 'hex'), 'Nike', 'nike@example.com', '/placeholder.svg?height=100&width=100', 'Official Nike store offering the latest in athletic footwear, apparel, and accessories.', true, 4.8, 15000, 'Beaverton, Oregon', ARRAY['Footwear', 'Athletic Apparel', 'Sports Equipment'], ARRAY[]::text[]),
    ('adidas', encode(digest('password123', 'sha256'), 'hex'), 'Adidas', 'adidas@example.com', '/placeholder.svg?height=100&width=100', 'Official Adidas store offering the latest in athletic footwear, apparel, and accessories.', true, 4.7, 12000, 'Bavaria, Germany', ARRAY['Footwear', 'Athletic Apparel', 'Sports Equipment'], ARRAY[]::text[])
  ON CONFLICT (username) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Seed products
CREATE OR REPLACE FUNCTION seed_products()
RETURNS void AS $$
BEGIN
  -- Insert initial products
  INSERT INTO products (name, price, numeric_price, image, description, categories, product_id, source, user_code, quality, in_stock, rating, review_count, colors, sizes, featured, date_added, brand_id, gender)
  VALUES
    ('Air Force 1 AF White', '39.99$', 39.99, '/placeholder.svg?height=300&width=300', 'Classic white Air Force 1 sneakers, perfect for any outfit.', ARRAY['Shoes', 'Nike', 'Bestseller'], '5634651234', 'WD', 'nike', 'AAA+', true, 4.8, 124, ARRAY['White', 'Black', 'Red'], ARRAY['US 7', 'US 8', 'US 9', 'US 10', 'US 11'], true, '2023-05-15', 1, 'men'),
    
    ('IGX Jordan 4 (20+ Styles)', '70.12$', 70.12, '/placeholder.svg?height=300&width=300', 'Premium Jordan 4 replicas available in over 20 different colorways.', ARRAY['Shoes', 'Jordan', 'Basketball'], '7231813766', 'WD', 'nike', 'AAA+', true, 4.9, 87, ARRAY['Bred', 'White Cement', 'Fire Red', 'Military Blue'], ARRAY['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'], true, '2023-06-20', 3, 'men'),
    
    ('Jordan 4 (Budget)', '28.51$', 28.51, '/placeholder.svg?height=300&width=300', 'Budget-friendly Jordan 4 replicas with great quality for the price.', ARRAY['Shoes', 'Jordan', 'Basketball', 'Budget'], '5478921345', 'WD', 'nike', 'Budget', true, 4.2, 56, ARRAY['Bred', 'White Cement'], ARRAY['US 7', 'US 8', 'US 9', 'US 10', 'US 11'], false, '2023-07-05', 3, 'men'),
    
    ('Yeezy 350v2 (10+ Styles)', '17.38$', 17.38, '/placeholder.svg?height=300&width=300', 'Comfortable Yeezy 350v2 replicas in multiple colorways.', ARRAY['Shoes', 'Yeezy', 'Adidas'], '6589123475', 'WD', 'adidas', 'AA', true, 4.5, 78, ARRAY['Zebra', 'Beluga', 'Black Red'], ARRAY['US 7', 'US 8', 'US 9', 'US 10', 'US 11'], false, '2023-08-10', 2, 'men'),
    
    ('Nike Tech Fleece Set', '59.99$', 59.99, '/placeholder.svg?height=300&width=300', 'Complete Nike Tech Fleece set including hoodie and joggers.', ARRAY['Clothing', 'Nike', 'Sets'], '3214569874', 'WD', 'nike', 'AAA+', true, 4.7, 92, ARRAY['Black', 'Gray', 'Navy'], ARRAY['S', 'M', 'L', 'XL'], true, '2023-04-20', 1, 'men'),
    
    ('Lululemon Align Leggings', '45.99$', 45.99, '/placeholder.svg?height=300&width=300', 'High-quality Lululemon Align leggings, perfect for yoga and everyday wear.', ARRAY['Clothing', 'Lululemon', 'Activewear'], '9876543210', 'WD', 'adidas', 'AAA+', true, 4.9, 105, ARRAY['Black', 'Navy', 'Burgundy'], ARRAY['XS', 'S', 'M', 'L'], true, '2023-05-10', 2, 'women')
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Seed product requests
CREATE OR REPLACE FUNCTION seed_product_requests()
RETURNS void AS $$
BEGIN
  -- Insert initial product requests
  INSERT INTO product_requests (name, email, product_name, description, budget, category, status)
  VALUES
    ('John Doe', 'john@example.com', 'Nike Air Jordan 4 Travis Scott', 'Looking for the latest Travis Scott collaboration in size US 10', '$300-400', 'Shoes', 'pending'),
    ('Sarah Smith', 'sarah@example.com', 'Louis Vuitton Keepall 55', 'Need the Keepall 55 in Monogram canvas, preferably new or like new condition', '$1000-1500', 'Bags', 'approved')
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;
