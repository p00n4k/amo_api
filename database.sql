USE amo_web;

-- ===================================
-- 🧱 DATABASE DESIGN FOR API (UPDATED)
-- ===================================

-- 1. ตาราง home_sliders
CREATE TABLE IF NOT EXISTS home_sliders (
    slider_id INT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(255) NOT NULL,
    display_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order)
);

-- 2. ตาราง brands
CREATE TABLE IF NOT EXISTS brands (
    brand_id INT PRIMARY KEY AUTO_INCREMENT,
    brand_name VARCHAR(100) NOT NULL,
    brand_image VARCHAR(255),
    main_type ENUM('Surface', 'Furnishing') NOT NULL,
    type VARCHAR(50),
    brand_url VARCHAR(255) DEFAULT 'https://amo.co.th',
    INDEX idx_main_type (main_type),
    INDEX idx_type (type)
);

-- 3. ตาราง product_focus
CREATE TABLE IF NOT EXISTS product_focus (
    focus_id INT PRIMARY KEY AUTO_INCREMENT,
    collection_name VARCHAR(100) NOT NULL,
    brand_id INT,
    description TEXT,
    made_in VARCHAR(50),
    type ENUM('Furnishing', 'Surface') NOT NULL,
    link VARCHAR(255),
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

-- 4. ตาราง product_focus_images
CREATE TABLE IF NOT EXISTS product_focus_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    focus_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    display_order INT,
    FOREIGN KEY (focus_id) REFERENCES product_focus(focus_id) ON DELETE CASCADE,
    INDEX idx_focus_id (focus_id)
);

-- 5. ตาราง projects
CREATE TABLE IF NOT EXISTS projects (
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(100) NOT NULL,
    data_update DATE NOT NULL,
    project_category ENUM('Residential', 'Commercial') NOT NULL,
    INDEX idx_category (project_category),
    INDEX idx_data_update (data_update)
);

-- 6. ตาราง project_images
CREATE TABLE IF NOT EXISTS project_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    display_order INT,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id)
);

-- 7. ตาราง collections (✅ เพิ่ม collection_name)
CREATE TABLE IF NOT EXISTS collections (
    collection_id INT PRIMARY KEY AUTO_INCREMENT,
    collection_name VARCHAR(100) NOT NULL,     -- ✅ ชื่อคอลเลคชัน
    type VARCHAR(100) NOT NULL,                -- ชนิดวัสดุ / series name
    brand_id INT,
    material_type ENUM('Surface', 'Furniture') NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    description TEXT,
    image VARCHAR(255),
    link VARCHAR(255),
    relate_link VARCHAR(255),
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

-- 8. ตาราง project_collections
CREATE TABLE IF NOT EXISTS project_collections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    collection_id INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES collections(collection_id) ON DELETE CASCADE,
    UNIQUE KEY unique_project_collection (project_id, collection_id)
);

-- 9. ตาราง product_main
CREATE TABLE IF NOT EXISTS product_main (
    id INT PRIMARY KEY AUTO_INCREMENT,
    collection_name VARCHAR(100) NOT NULL,
    brand_id INT,
    link VARCHAR(255),
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

-- 10. ตาราง product_main_images
CREATE TABLE IF NOT EXISTS product_main_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_main_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_main_id) REFERENCES product_main(id) ON DELETE CASCADE
);

-- 11. ตาราง product_surface_items
CREATE TABLE IF NOT EXISTS product_surface_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    image VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL
);

-- 12. ตาราง product_furnish_items
CREATE TABLE IF NOT EXISTS product_furnish_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    image VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL
);

-- ===================================
-- 🧩 MOCKUP DATA INSERTS (UPDATED)
-- ===================================

-- 🔹 Brands
INSERT INTO brands (brand_name, brand_image, main_type, type, brand_url) VALUES
('Potocco', '/uploads/brands/potocco.png', 'Furnishing', 'Wood', 'https://www.potocco.com'),
('Amo Surface', '/uploads/brands/amo_surface_logo.png', 'Surface', 'Ceramic', 'https://amo.co.th'),
('Amo Furniture', '/uploads/brands/amo_furniture_logo.png', 'Furnishing', 'Wood', 'https://amo.co.th'),
('Cattelan Italia', '/uploads/brands/cattelan_italia.png', 'Furnishing', 'Metal', 'https://www.cattelanitalia.com'),
('Amo Surface Premium', '/uploads/brands/amo_surface_premium.png', 'Surface', 'Porcelain', 'https://amo.co.th');

-- 🔹 Collections (✅ Updated to include collection_name)
INSERT INTO collections (collection_name, type, brand_id, material_type, status, description, image, link, relate_link) VALUES
('Marble White', 'Marble White', 2, 'Surface', TRUE, 'Italian marble surface with glossy finish', '/uploads/products/marble_white.jpg', 'https://example.com/products/marble_white', 'https://example.com/related/marble_series'),
('Oak Natural', 'Oak Natural', 3, 'Furniture', FALSE, 'Wood-inspired surface', '/uploads/products/oak_natural.jpg', 'https://example.com/products/oak_natural', 'https://example.com/related/wood_collection'),
('Onyx Grey', 'Onyx Grey', 5, 'Surface', TRUE, 'Luxurious porcelain surface with matte texture', '/uploads/products/onyx_grey.jpg', 'https://example.com/products/onyx_grey', 'https://example.com/related/onyx'),
('Walnut Deep', 'Walnut Deep', 3, 'Furniture', TRUE, 'Elegant deep walnut wood finish', '/uploads/products/walnut_deep.jpg', 'https://example.com/products/walnut_deep', 'https://example.com/related/walnut'),
('Travertine Classic', 'Travertine Classic', 2, 'Surface', TRUE, 'Natural travertine look surface', '/uploads/products/travertine_classic.jpg', 'https://example.com/products/travertine_classic', 'https://example.com/related/travertine');

