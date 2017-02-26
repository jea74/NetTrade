-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: netTrade
-- ------------------------------------------------------
-- Server version	5.7.17-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `itemtable`
--

DROP TABLE IF EXISTS `itemtable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `itemtable` (
  `name` varchar(20) DEFAULT NULL,
  `photoURL` varchar(1000) DEFAULT NULL,
  `price` float(4,2) DEFAULT NULL,
  `description` text,
  `providerID` varchar(500) DEFAULT NULL,
  KEY `providerID` (`providerID`),
  CONSTRAINT `itemtable_ibfk_1` FOREIGN KEY (`providerID`) REFERENCES `usertable` (`providerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemtable`
--

LOCK TABLES `itemtable` WRITE;
/*!40000 ALTER TABLE `itemtable` DISABLE KEYS */;
INSERT INTO `itemtable` VALUES ('Rad Bike','bike.jpeg',30.00,'Bike that is rad','facebook1'),('Cool Bike','shirt.jpeg',25.00,'Really cool shirt','google1'),('Great Hat','hat.jpeg',5.00,'Not a great hat by any means','facebook2'),('Loud Headphones','headphone.jpeg',85.00,'Super loud headphones that will bust your eardrum.','google2'),('Decent Pants','pants.jpeg',55.00,'Pretty decent pants that have been worn too many times','facebook3');
/*!40000 ALTER TABLE `itemtable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usertable`
--

DROP TABLE IF EXISTS `usertable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usertable` (
  `providerID` varchar(500) NOT NULL,
  `displayName` varchar(20) DEFAULT NULL,
  `firstName` varchar(20) DEFAULT NULL,
  `lastName` varchar(20) DEFAULT NULL,
  `email` varchar(20) DEFAULT NULL,
  `photoURL` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`providerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usertable`
--

LOCK TABLES `usertable` WRITE;
/*!40000 ALTER TABLE `usertable` DISABLE KEYS */;
INSERT INTO `usertable` VALUES ('facebook1','jea74','Jose','Arguelles','jose@drexel.edu','happy.jpeg'),('facebook2','chet45','Chetan','Parakh','chet@drexel.edu','sad.jpeg'),('facebook3','ava89','Ava','Something','ava@drexel.edu','hey.jpeg'),('google1','pat23','Patrick','Brogan','pat@drexel.edu','eh.jpeg'),('google2','saug67','Saugat','Sthapit','saug@drexel.edu','okay.jpeg');
/*!40000 ALTER TABLE `usertable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-02-25 19:59:52
