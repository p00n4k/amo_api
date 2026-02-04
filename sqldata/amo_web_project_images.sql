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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-04 23:02:19
