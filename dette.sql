# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Hôte: localhost (MySQL 5.6.35)
# Base de données: dette
# Temps de génération: 2017-04-12 15:23:51 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Affichage de la table categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;

INSERT INTO `categories` (`id`, `label`)
VALUES
	(1,'loyer'),
	(2,'impôts'),
	(3,'avance');

/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table credit
# ------------------------------------------------------------

DROP TABLE IF EXISTS `credit`;

CREATE TABLE `credit` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `sum` float DEFAULT NULL,
  `date` date DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `description` text,
  `removed` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `credit` WRITE;
/*!40000 ALTER TABLE `credit` DISABLE KEYS */;

INSERT INTO `credit` (`id`, `user_id`, `sum`, `date`, `category_id`, `description`, `removed`)
VALUES
	(91,2,123,'2017-04-12',3,'azerfvfres',NULL),
	(92,1,345,'2017-04-12',3,NULL,NULL),
	(93,3,987,'2017-04-12',1,'azsxdefvfg',NULL),
	(94,1,754,'2017-04-12',2,NULL,NULL);

/*!40000 ALTER TABLE `credit` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table debit
# ------------------------------------------------------------

DROP TABLE IF EXISTS `debit`;

CREATE TABLE `debit` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `credit_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `sum` float DEFAULT NULL,
  `refunded_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `debit` WRITE;
/*!40000 ALTER TABLE `debit` DISABLE KEYS */;

INSERT INTO `debit` (`id`, `credit_id`, `user_id`, `sum`, `refunded_date`)
VALUES
	(83,92,1,172.5,'2017-04-12'),
	(84,92,2,172.5,NULL),
	(85,91,1,61.5,NULL),
	(86,91,2,61.5,'2017-04-12'),
	(87,93,1,493.5,NULL),
	(88,93,2,493.5,NULL),
	(89,94,3,754,NULL);

/*!40000 ALTER TABLE `debit` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table recurrence
# ------------------------------------------------------------

DROP TABLE IF EXISTS `recurrence`;

CREATE TABLE `recurrence` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `day` int(2) DEFAULT NULL,
  `debt` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `recurrence` WRITE;
/*!40000 ALTER TABLE `recurrence` DISABLE KEYS */;

INSERT INTO `recurrence` (`id`, `type`, `day`, `debt`)
VALUES
	(3,'month',1,'{\"user_left\":[{\"id\":\"1\",\"name\":\"mathieu\",\"color\":\"#00c4ff\",\"sum\":61.5,\"refund\":null},{\"id\":\"2\",\"name\":\"alexandra\",\"color\":\"#fa23ab\",\"sum\":61.5,\"refund\":null}],\"user_right\":{\"id\":\"3\",\"name\":\"compte\",\"color\":\"#30f100\"},\"sum\":\"123\",\"category\":{\"id\":\"1\",\"label\":\"loyer\"},\"description\":\"dertfrdes\",\"recurrence\":{\"type\":\"month\",\"date\":\"1\"}}'),
	(6,'week',1,'{\"user_left\":[{\"id\":\"1\",\"name\":\"mathieu\",\"color\":\"#00c4ff\",\"sum\":61.5,\"refund\":null},{\"id\":\"2\",\"name\":\"alexandra\",\"color\":\"#fa23ab\",\"sum\":61.5,\"refund\":null}],\"user_right\":{\"id\":\"3\",\"name\":\"compte\",\"color\":\"#30f100\"},\"sum\":\"123\",\"category\":{\"id\":\"2\",\"label\":\"impôts\"},\"recurrence\":{\"type\":\"week\",\"day\":\"3\"}}'),
	(7,'month',1,'{\"user_left\":[{\"id\":\"1\",\"name\":\"mathieu\",\"color\":\"#00c4ff\",\"sum\":228},{\"id\":\"2\",\"name\":\"alexandra\",\"color\":\"#fa23ab\",\"sum\":228,\"refund\":null}],\"user_right\":{\"id\":\"1\",\"name\":\"mathieu\",\"color\":\"#00c4ff\",\"sum\":228},\"sum\":\"456\",\"category\":{\"id\":\"3\",\"label\":\"avance\"},\"description\":\"test\",\"recurrence\":{\"type\":\"month\",\"date\":\"12\"}}');

/*!40000 ALTER TABLE `recurrence` ENABLE KEYS */;
UNLOCK TABLES;


# Affichage de la table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `color` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`id`, `name`, `color`)
VALUES
	(1,'mathieu','#00c4ff'),
	(2,'alexandra','#fa23ab'),
	(3,'compte','#30f100');

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
