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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-04 23:02:19
