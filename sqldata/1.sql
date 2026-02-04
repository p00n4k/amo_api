-- MySQL dump 10.13  Distrib 8.0.34, for macos13 (arm64)
--
-- Host: 127.0.0.1    Database: amo_web
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `brand_id` int NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(100) NOT NULL,
  `brand_image` varchar(255) DEFAULT NULL,
  `main_type` enum('Surface','Furnishing','Other') NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `brand_url` varchar(255) DEFAULT 'https://amo.co.th',
  PRIMARY KEY (`brand_id`),
  KEY `idx_main_type` (`main_type`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'ATLAS CONCORDE','/uploads/admin/095a3c64-b57c-48f6-9b5d-ecdcb5facaeb.png','Furnishing','AMO','https://www.atlasconcorde.com/en/'),(2,'ATLAS PLAN','/Brandlogo/ATLAS_PLAN.png','Surface','Tile','https://www.atlasplan.com/en/'),(3,'ENERGIEKER','/Brandlogo/ENERGIEKER.svg','Surface','Tile','https://www.energieker.it/en/'),(4,'MIRAGE','/Brandlogo/MIRAGE.svg','Surface','Tile','https://www.mirage.it/it/en'),(5,'CAESAR','/Brandlogo/CAESAR.svg','Surface','Tile','https://www.caesar.it/en/'),(6,'SETTECENTO','/Brandlogo/SETTECENTO.svg','Surface','Tile','https://www.settecento.com/en/'),(7,'COTTO D’ESTE','/Brandlogo/COTTO_D’ESTE.svg','Surface','Tile','https://www.cottodeste.com/'),(8,'BLUSTYLE','/Brandlogo/BLUSTYLE.png','Surface','Tile','https://www.blustyle.eu/'),(9,'SANT’AGOSTINO','/Brandlogo/SANT’AGOSTINO.svg','Surface','Tile','https://www.ceramicasantagostino.it/en/'),(10,'KEOPE','/Brandlogo/KEOPE.svg','Surface','Tile','https://www.keope.com/en'),(11,'FAST','/Brandlogo/FAST.svg','Surface','Outdoor','https://www.fastspa.com/en/'),(12,'VARASCHIN','/Brandlogo/VARASCHIN.svg','Surface','Outdoor','https://varaschin.it/en/'),(13,'PLUST+','/Brandlogo/PLUST+.png','Surface','Outdoor','https://www.plust.it/en/'),(14,'MYYOUR','/Brandlogo/MYYOUR.jpg','Surface','Outdoor','https://myyour.eu/en/'),(15,'DITRE ITALIA','/Brandlogo/DITRE_ITALIA.svg','Surface','Outdoor','https://www.ditreitalia.com/en/outdoor'),(16,'SABA ITALIA','/Brandlogo/SABA_ITALIA.svg','Surface','Outdoor','https://sabaitalia.com/en/products/outdoor'),(17,'POTOCCO','/Brandlogo/POTOCCO.png','Surface','Outdoor','https://potocco.it/en/products.html?location=outdoor'),(18,'KRISTALIA','/Brandlogo/KRISTALIA.svg','Surface','Outdoor','https://www.kristalia.it/en/kind/outdoor-en/'),(19,'ILLULIAN','/Brandlogo/ILLULIAN.png','Other','Other','https://www.illulian.com/'),(20,'STEPEVI','/Brandlogo/STEPEVI.svg','Other','Other','https://www.stepevi.fr/'),(21,'GAN RUGS','/Brandlogo/GAN_RUGS.png','Other','Other','https://www.gan-rugs.com/en/'),(22,'NANIMAQUINA','/Brandlogo/NANIMAQUINA.svg','Other','Other','https://nanimarquina.com/en'),(23,'ADRIANI ROSSI','/Brandlogo/ADRIANI_ROSSI.png','Other','Other','https://www.adrianierossi.com/'),(24,'LITOKOL','/Brandlogo/LITOKOL.jpg','Other','Other','https://www.litokol.it/en'),(25,'ETERNO IVICA','/Brandlogo/ETERNO_IVICA.jpg','Other','Other','https://www.eternoivica.com/en'),(26,'FOGLIE D’ORO','/Brandlogo/FOGLIE_D’ORO.png','Other','Other','https://fogliedoroparquet.com/en/'),(27,'MUTINA','/Brandlogo/MUTINA.svg','Surface','Mosaic','https://www.mutina.it/en/'),(28,'WINCKLEMANS','/Brandlogo/WINCKLEMANS.png','Surface','Mosaic','https://www.winckelmans.com/en/home/'),(29,'VIDREPUR','/Brandlogo/VIDREPUR.svg','Surface','Mosaic','https://vidrepur.com/'),(30,'SICIS','/Brandlogo/SICIS.png','Surface','Mosaic','https://www.sicis.com/GLOBAL/en/'),(31,'LENID','/Brandlogo/LENID.png','Surface','Mosaic','http://www.lenid.it/en/'),(32,'M+','/Brandlogo/M+.webp','Surface','Mosaic','https://www.mplusdesign.it/en/'),(33,'VISTOSI','/Brandlogo/VISTORI.svg','Furnishing','Lighting','https://vistosi.it/?lang=en'),(34,'PANZERI','/Brandlogo/PANZERI.jpg','Furnishing','Lighting','https://panzeri.it/en/'),(35,'MARSET','/Brandlogo/MARSET.svg','Furnishing','Lighting','https://www.marset.com/en/'),(36,'CATTELANI SMITH','/Brandlogo/CATTELANI_SMITH.png','Furnishing','Lighting','https://www.catellanismith.com/en/'),(37,'SERIP','/Brandlogo/SERIP.png','Furnishing','Lighting','https://seripdesign.com/en/home'),(38,'EUROLUCE','/Brandlogo/EUROLUCE.png','Furnishing','Lighting','https://eurolucelampadari.it/en/'),(39,'ANTONANGELI','/Brandlogo/ANTONANGELI.png','Furnishing','Lighting','https://antonangelilighting.com/'),(40,'NEMO LIGHTING','/Brandlogo/NEMO_LIGHTING.svg','Furnishing','Lighting','https://www.nemolighting.com/usa/en/'),(41,'FONTANA ARTE','/Brandlogo/FONTANA_ARTE.png','Furnishing','Lighting','https://www.fontanaarte.com/en/'),(42,'Arte Brotto','/Brandlogo/ARTE_BROTTO.png','Furnishing','Furniture','https://www.artebrotto.it/en/'),(43,'Ditre Italia','/Brandlogo/DITRE_ITALIA.svg','Furnishing','Furniture','https://www.ditreitalia.com/en/'),(44,'Saba Italia','/Brandlogo/SABA_ITALIA.svg','Furnishing','Furniture','https://sabaitalia.com/en'),(45,'Potocco','/Brandlogo/POTOCCO.png','Furnishing','Furniture','https://potocco.it/en/'),(46,'Nicoline','/Brandlogo/NICOLINE.png','Furnishing','Furniture','https://www.nicoline.it/en'),(47,'Kristalia','/Brandlogo/KRISTALIA.svg','Furnishing','Furniture','https://www.kristalia.it/en/'),(48,'Fama','/Brandlogo/FAMA.png','Furnishing','Furniture','https://famasofas.com/inicio-en'),(49,'Capo D’Opera','/Brandlogo/CAPO_D’OPERA.svg','Furnishing','Furniture','https://capodopera.it/en/'),(50,'Tacchini','/Brandlogo/TACCHINI.svg','Furnishing','Furniture','https://www.tacchini.it/en/'),(51,'La Manufacture','/Brandlogo/LA_MANUFACTURE.svg','Furnishing','Furniture','https://lamanufacture-paris.fr/en/'),(52,'Giorgio Casa','/Brandlogo/GIORGIO_CASA.png','Furnishing','Furniture','https://giorgiocasa.it/en/'),(53,'Tonin Casa','/Brandlogo/TONIN_CASA.svg','Furnishing','Furniture','https://www.tonincasa.it/en/collection/modern-collection/'),(54,'Inclass','/Brandlogo/INCLASS.svg','Furnishing','Furniture','https://inclass.es/'),(55,'Sitia','/Brandlogo/SITIA.svg','Furnishing','Furniture','https://sitia.com/en/'),(56,'Hurtado','/Brandlogo/HURTADO.svg','Furnishing','Furniture','https://www.hurtado.eu/en'),(57,'Alcarol','/Brandlogo/ALCAROL.jpg','Furnishing','Furniture','https://www.alcarol.com/'),(58,'Driade','/Brandlogo/DRIADE.webp','Furnishing','Furniture','https://www.driade.com/en/'),(59,'Twils','/Brandlogo/TWILS.png','Furnishing','Furniture','https://www.twils.it/en/'),(60,'Sturm Milano','/Brandlogo/STURM_MILANO.png','Furnishing','Furniture','https://sturmmilano.com/'),(61,'Pianca','/Brandlogo/PIANCA.png','Furnishing','Furniture','https://pianca.com/en/'),(62,'Ulivi','/Brandlogo/ULIVI.png','Furnishing','Furniture','https://ulivisalotti.it/en/'),(63,'Poon','/uploads/admin/bab14b56-c3cc-4fdd-a12f-616f186d64fa.jpg','Furnishing','Tile','www.code');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collections`
--

DROP TABLE IF EXISTS `collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collections` (
  `collection_id` int NOT NULL AUTO_INCREMENT,
  `collection_name` varchar(100) NOT NULL,
  `material_type` varchar(100) NOT NULL,
  `brand_id` int DEFAULT NULL,
  `type` enum('Surface','Furniture','Other') NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `relate_link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`collection_id`),
  KEY `brand_id` (`brand_id`),
  CONSTRAINT `collections_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collections`
--

LOCK TABLES `collections` WRITE;
/*!40000 ALTER TABLE `collections` DISABLE KEYS */;
INSERT INTO `collections` VALUES (3,'Aaaa','bbbb',1,'Other',1,'','/uploads/admin/2cc81ba3-0857-40f3-a33e-492033176c84.webp','Gg','Dddb n'),(4,'Marvel T','Halo White',1,'Surface',0,'Travertine','/uploads/admin/1ca8d317-9573-40d9-a91c-440a732dc8ec.jpeg','https://www.atlasconcorde.com/en/ac-collection/marvel-t/halo-white?selectedTab=matte','www.google.com'),(5,'Lims','Ivory',1,'Surface',0,'Stone','/uploads/admin/33d0b302-5557-4b27-a9bc-1673bb10f6a9.jpeg','','https://www.atlasconcorde.com/en/ac-collection/boost-icor/bone?selectedTab=matte-sensitech'),(6,'Marvel ','Marble ',1,'Surface',0,'Marble ','/uploads/admin/99d34346-9d52-49ca-9550-a0fa12573ef2.jpg','https://www.atlasconcorde.com/en/ac-collection/marvel/calacatta-extra?selectedTab=matte',''),(7,'Elysian','EY09 Gold Catalan',4,'Surface',1,'Stone','/uploads/admin/c26c3768-b3cd-45b5-b10d-5a79698eb4af.jpg','https://mirage.it/it/en/products/elysian-ey09',''),(8,'Marvel Stone','Nero Marquina',1,'Surface',0,'Marble','/uploads/admin/114a3ded-708d-4e4e-a4ba-2d4625ccb3c7.jpg','','');
/*!40000 ALTER TABLE `collections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `home_sliders`
--

DROP TABLE IF EXISTS `home_sliders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `home_sliders` (
  `slider_id` int NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) NOT NULL,
  `display_order` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`slider_id`),
  KEY `idx_display_order` (`display_order`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `home_sliders`
--

LOCK TABLES `home_sliders` WRITE;
/*!40000 ALTER TABLE `home_sliders` DISABLE KEYS */;
INSERT INTO `home_sliders` VALUES (2,'/uploads/admin/c7a77991-cb39-4d2f-bff1-814f88cad931.jpg',2,'2025-11-01 14:08:39'),(3,'/uploads/admin/20c9ccdf-7bee-4031-b0c3-9d9f7396775c.jpg',3,'2025-11-01 14:08:39'),(6,'/uploads/admin/4743ab17-3cec-42cb-a92d-bb2b5bb09435.jpg',1,'2025-11-02 05:06:32');
/*!40000 ALTER TABLE `home_sliders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_focus`
--

DROP TABLE IF EXISTS `product_focus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_focus` (
  `focus_id` int NOT NULL AUTO_INCREMENT,
  `collection_name` varchar(100) NOT NULL,
  `brand_id` int DEFAULT NULL,
  `description` text,
  `made_in` varchar(50) DEFAULT NULL,
  `type` enum('Furnishing','Surface') NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`focus_id`),
  KEY `brand_id` (`brand_id`),
  CONSTRAINT `product_focus_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_focus`
--

LOCK TABLES `product_focus` WRITE;
/*!40000 ALTER TABLE `product_focus` DISABLE KEYS */;
INSERT INTO `product_focus` VALUES (5,'Jade',1,'Premium Italian furnishing design blending modern and tradition','Italy','Furnishing','https://www.potocco.com/jade'),(6,'Onyx Grey Collection',5,'Porcelain surface for luxurious interiors','Italy','Surface','https://example.com/products/onyx_grey'),(7,'Aurora Sofa System',1,'Modern Italian sofa system designed for flexible living spaces','Italy','Furnishing','https://example.com/products/aurora-sofa'),(8,'Venezia Dining Chair',2,'Elegant dining chair combining comfort and refined Italian style','Italy','Furnishing','https://example.com/products/venezia-chair'),(9,'Torino Coffee Table',3,'Minimalist coffee table crafted with premium Italian materials','Italy','Furnishing','https://example.com/products/torino-table'),(10,'Statuario Luxe Surface',4,'Luxury porcelain surface inspired by Statuario marble','Italy','Surface','https://example.com/products/statuario-luxe'),(11,'Sandstone Natural Panel',5,'Natural stone-look porcelain surface for warm interior designs','Italy','Surface','https://example.com/products/sandstone-natural'),(12,'Urban Concrete Dark',4,'Dark concrete-style porcelain surface for contemporary architecture','Italy','Surface','https://example.com/products/urban-concrete-dark');
/*!40000 ALTER TABLE `product_focus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_focus_images`
--

DROP TABLE IF EXISTS `product_focus_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_focus_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `focus_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `display_order` int DEFAULT NULL,
  PRIMARY KEY (`image_id`),
  KEY `idx_focus_id` (`focus_id`),
  CONSTRAINT `product_focus_images_ibfk_1` FOREIGN KEY (`focus_id`) REFERENCES `product_focus` (`focus_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_focus_images`
--

LOCK TABLES `product_focus_images` WRITE;
/*!40000 ALTER TABLE `product_focus_images` DISABLE KEYS */;
INSERT INTO `product_focus_images` VALUES (14,6,'/uploads/admin/testimage.jpg',0),(17,5,'/uploads/admin/testsofa2.jpeg',0),(20,7,'/uploads/admin/testimage.jpg',0),(21,8,'/uploads/admin/testimage.jpg',0),(22,9,'/uploads/admin/testimage.jpg',0),(23,10,'/uploads/admin/testimage.jpg',0),(24,11,'/uploads/admin/testsofa2.jpeg',0),(25,12,'/uploads/admin/testimage.jpg',0);
/*!40000 ALTER TABLE `product_focus_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_furnish_items`
--

DROP TABLE IF EXISTS `product_furnish_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_furnish_items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_furnish_items`
--

LOCK TABLES `product_furnish_items` WRITE;
/*!40000 ALTER TABLE `product_furnish_items` DISABLE KEYS */;
INSERT INTO `product_furnish_items` VALUES (1,'/uploads/furnishing/7367b5f4-7188-41d9-9a89-59148148bc5a.jpg','https://example.com/furnish/1'),(2,'/uploads/furnishing/b1cea22f-24af-47a8-a209-78928015c620.jpg','https://example.com/furnish/2'),(3,'/uploads/furnishing/468a73d1-aa9b-4b75-bc94-9dad061eafa7.jpg','https://example.com/furnish/3'),(4,'/uploads/furnishing/cd643b93-27fd-41a5-bcf3-a431456d95fd.jpg','https://example.com/furnish/4'),(5,'/uploads/furnishing/ae06498c-e78d-4cd0-a405-0bc73f3b6e70.jpg','www');
/*!40000 ALTER TABLE `product_furnish_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_main`
--

DROP TABLE IF EXISTS `product_main`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_main` (
  `id` int NOT NULL AUTO_INCREMENT,
  `collection_name` varchar(100) NOT NULL,
  `brand_id` int DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `brand_id` (`brand_id`),
  CONSTRAINT `product_main_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_main`
--

LOCK TABLES `product_main` WRITE;
/*!40000 ALTER TABLE `product_main` DISABLE KEYS */;
INSERT INTO `product_main` VALUES (4,'Marvel T',1,'https://www.atlasconcorde.com/en/ac-collection/marvel-t');
/*!40000 ALTER TABLE `product_main` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_main_images`
--

DROP TABLE IF EXISTS `product_main_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_main_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `product_main_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`image_id`),
  KEY `product_main_id` (`product_main_id`),
  CONSTRAINT `product_main_images_ibfk_1` FOREIGN KEY (`product_main_id`) REFERENCES `product_main` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_main_images`
--

LOCK TABLES `product_main_images` WRITE;
/*!40000 ALTER TABLE `product_main_images` DISABLE KEYS */;
INSERT INTO `product_main_images` VALUES (13,4,'/uploads/admin/a0b941e3-873d-41ee-b224-303b7d1c3250.jpeg'),(14,4,'/uploads/admin/ab4ba4a5-c77d-4241-ae6d-8490cc001427.jpeg'),(15,4,'/uploads/admin/d89c0210-15a4-4eba-8368-d01f3ad7d5c0.jpeg');
/*!40000 ALTER TABLE `product_main_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_surface_items`
--

DROP TABLE IF EXISTS `product_surface_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_surface_items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_surface_items`
--

LOCK TABLES `product_surface_items` WRITE;
/*!40000 ALTER TABLE `product_surface_items` DISABLE KEYS */;
INSERT INTO `product_surface_items` VALUES (1,'/uploads/surface/919c6fc9-cf9d-46dc-916d-766966362912.jpg','https://example.com/surface/1'),(2,'/uploads/surface/e5c72a33-0d32-44b6-9a76-b6f43a5fd9d9.jpg','https://example.com/surface/2'),(3,'/uploads/surface/f20cfcad-65d8-424c-b475-0c534ddcdfb7.jpg','https://example.com/surface/3'),(5,'/uploads/surface/069d21fb-3c37-4456-8673-35bd64626b30.jpg','https://www.atlasconcorde.com/en/ac-collection/log-cansei'),(6,'/uploads/surface/ed5e2eaa-0c85-4e7d-a030-b917e0a421f6.jpeg','https://www.atlasconcorde.com/en/ac-collection/marvel-t');
/*!40000 ALTER TABLE `product_surface_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_collections`
--

DROP TABLE IF EXISTS `project_collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_collections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `collection_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_project_collection` (`project_id`,`collection_id`),
  KEY `collection_id` (`collection_id`),
  CONSTRAINT `project_collections_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE,
  CONSTRAINT `project_collections_ibfk_2` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`collection_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_collections`
--

LOCK TABLES `project_collections` WRITE;
/*!40000 ALTER TABLE `project_collections` DISABLE KEYS */;
INSERT INTO `project_collections` VALUES (34,1,3),(33,2,3),(35,3,3),(36,3,4),(38,6,4),(39,6,5),(42,7,6),(40,8,5),(41,9,7),(44,10,6),(43,10,8);
/*!40000 ALTER TABLE `project_collections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_images`
--

DROP TABLE IF EXISTS `project_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_images` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `display_order` int DEFAULT NULL,
  PRIMARY KEY (`image_id`),
  KEY `idx_project_id` (`project_id`),
  CONSTRAINT `project_images_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_images`
--

LOCK TABLES `project_images` WRITE;
/*!40000 ALTER TABLE `project_images` DISABLE KEYS */;
INSERT INTO `project_images` VALUES (12,3,'/uploads/admin/7cf2db76-bd79-4d61-83c3-a60deba66be5.jpg',NULL),(13,2,'/uploads/admin/8105324f-877c-4e58-b801-3e3ffb9bf65c.jpg',NULL),(14,1,'/uploads/admin/128d9b5f-705d-4540-ab75-bd0e62e986d7.jpg',NULL),(15,6,'/uploads/admin/4e51490e-ecbb-4485-b61d-5eec562389a3.JPEG',NULL),(16,6,'/uploads/admin/6ca59674-a05c-43ee-a61a-1c24981281b0.JPEG',NULL),(17,6,'/uploads/admin/9814cfe4-9a16-40f7-a9f2-38411d5fbfa0.JPEG',NULL),(20,8,'/uploads/admin/03b1d7c3-f986-46de-a894-6595d98bf320.jpg',NULL),(21,8,'/uploads/admin/66040b97-7397-424f-9128-ccfaae430cf1.jpg',NULL),(22,8,'/uploads/admin/dc9186ff-4b93-4807-a0b8-26fc008713aa.jpg',NULL),(23,7,'/uploads/admin/2a46dca4-5308-4600-ab78-68a69b832b27.JPG',NULL),(24,7,'/uploads/admin/f9853c53-ba79-4829-9c0a-09d9b56edb48.JPG',NULL),(25,7,'/uploads/admin/b91610eb-576a-4eb9-8d9d-53883d62e004.JPG',NULL),(26,9,'/uploads/admin/0426bed2-0795-47bb-8e70-d17e707c3089.jpg',NULL),(27,8,'/uploads/admin/cd7f4208-7407-48d0-8db9-d8a6f489b008.jpg',NULL),(28,8,'/uploads/admin/773e7487-7822-427a-973b-91e150a6a0dc.jpg',NULL),(29,10,'/uploads/admin/2abb095f-7b15-4533-bd07-232818c78a10.jpg',NULL),(30,10,'/uploads/admin/ccaf9a35-a5f1-4989-9a6b-c2e174993b16.jpg',NULL),(31,10,'/uploads/admin/c35ad87b-32f2-450f-ace0-b334edd4fa88.jpg',NULL);
/*!40000 ALTER TABLE `project_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `project_id` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(100) NOT NULL,
  `data_update` date NOT NULL,
  `project_category` enum('Residential','Commercial') NOT NULL,
  PRIMARY KEY (`project_id`),
  KEY `idx_category` (`project_category`),
  KEY `idx_data_update` (`data_update`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Lifestyle Space','2025-11-01','Residential'),(2,'Amo Pavilion 2025','2025-10-25','Commercial'),(3,'Modern Loft Project','2025-10-10','Residential'),(6,'JM House','2025-10-09','Commercial'),(7,'BAAN K.NAMTARN','2026-01-08','Residential'),(8,'PROJECT CHW','2026-01-10','Residential'),(9,'CENTRAL DUSIT PARK L6','2026-09-29','Commercial'),(10,'THE RHYTM PAVILION','2026-10-01','Residential');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-04 23:03:16
