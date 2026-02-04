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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-04 23:02:19
