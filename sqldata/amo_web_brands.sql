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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-04 23:02:19
