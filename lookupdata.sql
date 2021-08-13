-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: localhost    Database: impact_dev
-- ------------------------------------------------------
-- Server version	8.0.23

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
-- Table structure for table `lookup`
--

DROP TABLE IF EXISTS `lookup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lookup` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lookupTypeId` bigint NOT NULL,
  `displayValue` varchar(100) DEFAULT NULL,
  `isDeleted` tinyint DEFAULT '0',
  `categoryId` varchar(45) DEFAULT NULL,
  `categoryName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lookup`
--

LOCK TABLES `lookup` WRITE;
/*!40000 ALTER TABLE `lookup` DISABLE KEYS */;
INSERT INTO `lookup` VALUES (1,2,'Buprenorphine',0,NULL,'Schedule III Opioids'),(2,2,'Codeine',0,NULL,'Schedule II Opioids'),(3,2,'Fentanyl',0,NULL,'Schedule II Opioids'),(4,2,'Hydromorphone',0,NULL,'Schedule II Opioids'),(5,2,'Hydrocodone/acetaminophen',0,NULL,'Schedule II Opioids'),(6,2,'Morphine',0,NULL,'Schedule II Opioids'),(7,2,'Meperedine',0,NULL,'Schedule II Opioids'),(8,2,'Methadone',0,NULL,'Schedule II Opioids'),(9,2,'Nalbuphine',0,NULL,'Schedule II Opioids'),(10,2,'Oxycodone',0,NULL,'Schedule II Opioids'),(11,2,'Oxycodone/acetaminophen',0,NULL,'Schedule II Opioids'),(14,3,'Celecoxib',0,NULL,'NSAIDs'),(16,3,'Ibuprofen',0,NULL,'NSAIDs'),(20,3,'Naproxen',0,NULL,'NSAIDs'),(22,4,'Amitriptyline',0,NULL,NULL),(23,4,'Duloxetine',0,NULL,NULL),(24,4,'Pregabalin',0,NULL,NULL),(25,4,'gabapentin',0,NULL,NULL),(27,4,'Midazolam',0,NULL,NULL),(28,5,'mg',0,NULL,NULL),(29,5,'micrograms',0,NULL,NULL),(30,6,'Hand',0,NULL,NULL),(31,6,'Leg',0,NULL,NULL),(32,6,'Wrist',0,NULL,NULL),(33,6,'Knee',0,NULL,NULL),(34,6,'Shoulder',0,NULL,NULL),(35,6,'Abdomen',0,NULL,NULL),(36,7,'Walking',0,NULL,NULL),(37,7,'Sleeping',0,NULL,NULL),(38,7,'Going to Therapy',0,NULL,NULL),(39,7,'Talking',0,NULL,NULL),(40,7,'Others',0,NULL,NULL),(41,8,'Sharp',0,NULL,NULL),(42,8,'Dull',0,NULL,NULL),(43,8,'Burning',0,NULL,NULL),(44,8,'Crushing',0,NULL,NULL),(45,8,'Tearing',0,NULL,NULL),(46,8,'Others',0,NULL,NULL),(47,9,'1 hour',0,NULL,NULL),(48,9,'2 hours',0,NULL,NULL),(49,9,'3 hours',0,NULL,NULL),(50,9,'4 hours',0,NULL,NULL),(51,9,'5 hours',0,NULL,NULL),(52,9,'6 hours',0,NULL,NULL),(53,9,'7 hours',0,NULL,NULL),(54,9,'8 hours',0,NULL,NULL),(55,9,'9 hours',0,NULL,NULL),(56,9,'10 hours',0,NULL,NULL),(57,9,'11 hours',0,NULL,NULL),(58,9,'12 hours',0,NULL,NULL),(59,9,'13 hours',0,NULL,NULL),(60,9,'14 hours',0,NULL,NULL),(61,9,'15 hours',0,NULL,NULL),(62,9,'16 hours',0,NULL,NULL),(63,9,'17 hours',0,NULL,NULL),(64,9,'18 hours',0,NULL,NULL),(65,9,'19 hours',0,NULL,NULL),(66,9,'20 hours',0,NULL,NULL),(67,9,'21 hours',0,NULL,NULL),(68,9,'22 hours',0,NULL,NULL),(69,9,'23 hours',0,NULL,NULL),(70,9,'24 hours',0,NULL,NULL),(71,9,'25 hours',0,NULL,NULL),(72,2,'Heroine',0,NULL,'Schedule I Opioids'),(73,2,'Code with aspirin or Tylenol',0,NULL,'Schedule III Opioids'),(74,2,'Tramadol',0,NULL,'Schedule IV Opioids'),(75,2,'Cough medicines that includes codeine',0,NULL,'Schedule V Opioids'),(76,3,'Tylenol',0,NULL,'Acetaminophen');
/*!40000 ALTER TABLE `lookup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lookuptype`
--

DROP TABLE IF EXISTS `lookuptype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lookuptype` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lookupType` varchar(255) NOT NULL,
  `isDeleted` tinyint DEFAULT '0',
  `descripion` varchar(1000) DEFAULT NULL,
  `parentLookupTypeId` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lookuptype`
--

LOCK TABLES `lookuptype` WRITE;
/*!40000 ALTER TABLE `lookuptype` DISABLE KEYS */;
INSERT INTO `lookuptype` VALUES (1,'MedicationClass',0,NULL,NULL),(2,'Opioids',0,NULL,'1'),(3,'Non-narcotic Analgesics',0,NULL,'1'),(4,'Anxiolitics/Neuropathic ',0,NULL,'1'),(5,'Dose',0,NULL,NULL),(6,'PainLocation',0,NULL,NULL),(7,'PainImpact',0,NULL,NULL),(8,'PainQuality',0,NULL,NULL),(9,'Frequency',0,NULL,NULL);
/*!40000 ALTER TABLE `lookuptype` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-22 16:12:46
