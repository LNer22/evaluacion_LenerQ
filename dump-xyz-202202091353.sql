-- MySQL dump 10.13  Distrib 5.5.62, for Win64 (AMD64)
--
-- Host: localhost    Database: xyz
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.22-MariaDB

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
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clientes` (
  `DNI` varchar(13) COLLATE utf8_spanish_ci NOT NULL,
  `clienteNombre` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `clienteApellidos` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `clienteDireccion` varchar(100) COLLATE utf8_spanish_ci DEFAULT NULL,
  `clienteTelefono` char(8) COLLATE utf8_spanish_ci DEFAULT NULL,
  `clienteSexo` tinyint(4) DEFAULT NULL,
  `clienteEmail` varchar(100) COLLATE utf8_spanish_ci DEFAULT NULL,
  `clienteActivo` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`DNI`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detallepedidos`
--

DROP TABLE IF EXISTS `detallepedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detallepedidos` (
  `detalleId` int(11) NOT NULL AUTO_INCREMENT,
  `productoId` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `pedidoId` int(11) NOT NULL,
  PRIMARY KEY (`detalleId`),
  KEY `detallePedidos_FK` (`productoId`),
  KEY `detallepedidos_FK_pedidos` (`pedidoId`),
  CONSTRAINT `detallePedidos_FK` FOREIGN KEY (`productoId`) REFERENCES `productos` (`productoId`),
  CONSTRAINT `detallepedidos_FK_pedidos` FOREIGN KEY (`pedidoId`) REFERENCES `pedidos` (`pedidoId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detallepedidos`
--

LOCK TABLES `detallepedidos` WRITE;
/*!40000 ALTER TABLE `detallepedidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `detallepedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pedidos` (
  `pedidoId` int(11) NOT NULL AUTO_INCREMENT,
  `DNI` varchar(13) COLLATE utf8_spanish_ci NOT NULL,
  `pedidoFecha` datetime NOT NULL,
  `pedidoEstado` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `pedidoVendedor` char(9) COLLATE utf8_spanish_ci NOT NULL,
  `pedidoSupervisor` char(9) COLLATE utf8_spanish_ci DEFAULT NULL,
  `pedidoFechaAprobacion` datetime DEFAULT NULL,
  `pedidoActivo` tinyint(4) NOT NULL,
  PRIMARY KEY (`pedidoId`),
  KEY `pedidos_FK` (`DNI`),
  KEY `pedidos_FK_1` (`pedidoVendedor`),
  KEY `pedidos_FK_2` (`pedidoSupervisor`),
  CONSTRAINT `pedidos_FK` FOREIGN KEY (`DNI`) REFERENCES `clientes` (`DNI`),
  CONSTRAINT `pedidos_FK_1` FOREIGN KEY (`pedidoVendedor`) REFERENCES `usuarios` (`usuarioId`),
  CONSTRAINT `pedidos_FK_2` FOREIGN KEY (`pedidoSupervisor`) REFERENCES `usuarios` (`usuarioId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productos` (
  `productoId` int(11) NOT NULL AUTO_INCREMENT,
  `productoNombre` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `productoDescripcion` varchar(100) COLLATE utf8_spanish_ci DEFAULT NULL,
  `productoActivo` tinyint(4) DEFAULT NULL,
  `productoCantidad` int(11) NOT NULL,
  `productoPrecio` float DEFAULT NULL,
  PRIMARY KEY (`productoId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `rolId` int(11) NOT NULL AUTO_INCREMENT,
  `rolNombre` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `rolDescripcion` varchar(100) COLLATE utf8_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`rolId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Vendedor',NULL),(2,'Supervisor de ventas',NULL),(3,'Gerente de ventas',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `usuarioId` char(9) COLLATE utf8_spanish_ci NOT NULL,
  `usuarioNombre` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `usuarioApellidos` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `usuario` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `rolId` int(11) NOT NULL,
  `contraseña` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`usuarioId`),
  KEY `usuarios_FK` (`rolId`),
  CONSTRAINT `usuarios_FK` FOREIGN KEY (`rolId`) REFERENCES `roles` (`rolId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES ('301111','Enrique','Ortiz','eortiz',1,'admin'),('301112','Leonardo','Gutierres','legu',2,'admin'),('301113','Carlos','Cruz','ccruz',3,'admin');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'xyz'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-09 13:53:50
