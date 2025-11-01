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

-- 2. ตาราง brands (✅ เพิ่ม brand_url)
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

-- 7. ตาราง collections
CREATE TABLE IF NOT EXISTS collections (
    collection_id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(100) NOT NULL,
    brand_id INT,
    material_type ENUM('Surface', 'Furniture') NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    description TEXT,
    image VARCHAR(255),
    link VARCHAR(255),
    relate_link VARCHAR(255),
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

-- 8. ตาราง project_collections (Many-to-Many)
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
-- 🧩 MOCKUP DATA INSERTS
-- ===================================

-- 🔹 Brands (✅ เพิ่ม brand_url)
INSERT INTO brands (brand_name, brand_image, main_type, type, brand_url) VALUES
('Potocco', '/uploads/brands/potocco.png', 'Furnishing', 'Wood', 'https://www.potocco.com'),
('Amo Surface', '/uploads/brands/amo_surface_logo.png', 'Surface', 'Ceramic', 'https://amo.co.th'),
('Amo Furniture', '/uploads/brands/amo_furniture_logo.png', 'Furnishing', 'Wood', 'https://amo.co.th'),
('Cattelan Italia', '/uploads/brands/cattelan_italia.png', 'Furnishing', 'Metal', 'https://www.cattelanitalia.com'),
('Amo Surface Premium', '/uploads/brands/amo_surface_premium.png', 'Surface', 'Porcelain', 'https://amo.co.th');

-- 🔹 Home Sliders
INSERT INTO home_sliders (image_url, display_order) VALUES
('/uploads/home/slider1.jpg', 1),
('/uploads/home/slider2.jpg', 2),
('/uploads/home/slider3.jpg', 3);

-- 🔹 Projects
INSERT INTO projects (project_name, data_update, project_category) VALUES
('Lifestyle Space', '2025-10-30', 'Residential'),
('Amo Pavilion 2025', '2025-10-25', 'Commercial'),
('Modern Loft Project', '2025-10-10', 'Residential'),
('Gallery Design Center', '2025-09-15', 'Commercial');

-- 🔹 Project Images
INSERT INTO project_images (project_id, image_url, display_order) VALUES
(1, '/uploads/projects/lifestyle_space_1.jpg', 1),
(1, '/uploads/projects/lifestyle_space_2.jpg', 2),
(2, '/uploads/projects/pavilion_1.jpg', 1),
(2, '/uploads/projects/pavilion_2.jpg', 2),
(3, '/uploads/projects/modern_loft_1.jpg', 1),
(4, '/uploads/projects/gallery_1.jpg', 1);

-- 🔹 Collections
INSERT INTO collections (type, brand_id, material_type, status, description, image, link, relate_link) VALUES
('Marble White', 2, 'Surface', TRUE, 'Italian marble surface with glossy finish', '/uploads/products/marble_white.jpg', 'https://example.com/products/marble_white', 'https://example.com/related/marble_series'),
('Oak Natural', 3, 'Furniture', FALSE, 'Wood-inspired surface', '/uploads/products/oak_natural.jpg', 'https://example.com/products/oak_natural', 'https://example.com/related/wood_collection'),
('Onyx Grey', 5, 'Surface', TRUE, 'Luxurious porcelain surface with matte texture', '/uploads/products/onyx_grey.jpg', 'https://example.com/products/onyx_grey', 'https://example.com/related/onyx'),
('Walnut Deep', 3, 'Furniture', TRUE, 'Elegant deep walnut wood finish', '/uploads/products/walnut_deep.jpg', 'https://example.com/products/walnut_deep', 'https://example.com/related/walnut'),
('Travertine Classic', 2, 'Surface', TRUE, 'Natural travertine look surface', '/uploads/products/travertine_classic.jpg', 'https://example.com/products/travertine_classic', 'https://example.com/related/travertine');

-- 🔹 Project ↔ Collections
INSERT INTO project_collections (project_id, collection_id) VALUES
(1, 1), (1, 2), (2, 3), (2, 5), (3, 4), (4, 1);

-- 🔹 Product Focus
INSERT INTO product_focus (collection_name, brand_id, description, made_in, type, link) VALUES
('Jade', 1, 'Premium Italian furnishing design blending modern and tradition', 'Italy', 'Furnishing', 'https://www.potocco.com/jade'),
('Onyx Grey Collection', 5, 'Porcelain surface for luxurious interiors', 'Italy', 'Surface', 'https://example.com/products/onyx_grey');

-- 🔹 Product Focus Images
INSERT INTO product_focus_images (focus_id, image_url, display_order) VALUES
(1, '/uploads/focus/jade_1.jpg', 1),
(1, '/uploads/focus/jade_2.jpg', 2),
(1, '/uploads/focus/jade_3.jpg', 3),
(2, '/uploads/focus/onyx_1.jpg', 1),
(2, '/uploads/focus/onyx_2.jpg', 2);

-- 🔹 Product Main
INSERT INTO product_main (collection_name, brand_id, link) VALUES
('Marble Series', 2, 'https://example.com/marble_series'),
('Wood Living Set', 3, 'https://example.com/wood_living');

-- 🔹 Product Main Images
INSERT INTO product_main_images (product_main_id, image_url) VALUES
(1, '/uploads/main/marble_1.jpg'),
(1, '/uploads/main/marble_2.jpg'),
(2, '/uploads/main/wood_1.jpg'),
(2, '/uploads/main/wood_2.jpg');

-- 🔹 Product Surface Items
INSERT INTO product_surface_items (image, link) VALUES
('/uploads/surface/surface1.jpg', 'https://example.com/surface/1'),
('/uploads/surface/surface2.jpg', 'https://example.com/surface/2'),
('/uploads/surface/surface3.jpg', 'https://example.com/surface/3'),
('/uploads/surface/surface4.jpg', 'https://example.com/surface/4');

-- 🔹 Product Furnish Items
INSERT INTO product_furnish_items (image, link) VALUES
('/uploads/furnish/furnish1.jpg', 'https://example.com/furnish/1'),
('/uploads/furnish/furnish2.jpg', 'https://example.com/furnish/2'),
('/uploads/furnish/furnish3.jpg', 'https://example.com/furnish/3'),
('/uploads/furnish/furnish4.jpg', 'https://example.com/furnish/4');

-- ===================================
-- ✅ MOCKUP DATA READY
-- ===================================
