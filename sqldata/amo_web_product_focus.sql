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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-04 23:02:19
