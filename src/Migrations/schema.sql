-- 1. in IDE, DROP DATABASE db_cloner_test_db;
-- 2. in console: php bin/console doctrine:database:create
-- 3. in IDE, execute that file
-- 4. in console, import the entities by doing : cd ~/projects/dbec3 && php bin/console doctrine:mapping:convert --from-database annotation ./src/Entity


-- MySQL dump 10.13  Distrib 5.1.73, for redhat-linux-gnu (x86_64)
--
-- Host: localhost    Database: db_cloner_test_db
-- ------------------------------------------------------
-- Server version    5.1.73-log

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
-- Table structure for table `dbec_0_config`
--

DROP TABLE IF EXISTS `dbec_0_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbec_0_config` (
  `config_param` varchar(37) NOT NULL,
  `param_value` varchar(75) DEFAULT '0',
  PRIMARY KEY (`config_param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dbec_1_analysed_db`
--

DROP TABLE IF EXISTS `dbec_1_analysed_db`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbec_1_analysed_db` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `svr_id` int(10) unsigned NOT NULL COMMENT 'foreign to id from connections',
  `database_name` varchar(75) NOT NULL COMMENT 'Real database name',
  `main_table_name` varchar(75) NOT NULL COMMENT 'Main table name',
  `main_table_primary_key` varchar(75) NOT NULL COMMENT 'Main DB table PRIMARY KEY name',
  `deleted` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `json_data` longtext NOT NULL COMMENT 'JSON describing the differents DB entities',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_dbec_1_analysed_db_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_dbec_1_analysed_db_svr_id` FOREIGN KEY (`svr_id`) REFERENCES `connections` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dbec_2_entity_ready`
--

DROP TABLE IF EXISTS `dbec_2_entity_ready`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbec_2_entity_ready` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `analysed_db_id` int(10) unsigned NOT NULL COMMENT 'foreign to dbec_1_analysed_db.id',
  `entity_ready_name` varchar(75) NOT NULL COMMENT 'Real database name',
  `deleted` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `json_data` longtext NOT NULL COMMENT 'JSON describing the choices of user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_label_per_user` (`user_id`,`entity_ready_name`),
  KEY `analysed_db_id` (`analysed_db_id`),
  CONSTRAINT `dbec_2_entity_ready_ibfk_1` FOREIGN KEY (`analysed_db_id`) REFERENCES `dbec_1_analysed_db` (`id`),
  CONSTRAINT `dbec_2_entity_ready_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dbec_3_src_fave`
--

DROP TABLE IF EXISTS `dbec_3_src_fave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbec_3_src_fave` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `svr_id` int(10) unsigned NOT NULL COMMENT 'foreign to id from connections',
  `src_fave_label` varchar(75) NOT NULL COMMENT 'User chosen label',
  `database_name` varchar(75) NOT NULL COMMENT 'Real database name',
  `deleted` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `svr_id` (`svr_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `dbec_3_src_fave_ibfk_1` FOREIGN KEY (`svr_id`) REFERENCES `connections` (`id`),
  CONSTRAINT `dbec_3_src_fave_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dbec_4_dest_fave`
--

DROP TABLE IF EXISTS `dbec_4_dest_fave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbec_4_dest_fave` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `dest_fave_label` varchar(75) NOT NULL COMMENT 'User chosen label',
  `deleted` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `dbec_4_dest_fave_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dbec_5_dest_database`
--

DROP TABLE IF EXISTS `dbec_5_dest_database`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbec_5_dest_database` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dest_fave_id` int(10) unsigned NOT NULL COMMENT 'foreign to dbec_4_dest_fave.id',
  `svr_id` int(10) unsigned NOT NULL COMMENT 'foreign to id from connections',
  `database_name` varchar(75) NOT NULL COMMENT 'Real database name',
  `deleted` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `database_name_idx` (`database_name`),
  KEY `deleted_idx` (`deleted`),
  FOREIGN KEY (`dest_fave_id`) REFERENCES `dbec_4_dest_fave` (`id`),
  FOREIGN KEY (`svr_id`) REFERENCES `connections` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dbec_6_user_sql_file`
--

DROP TABLE IF EXISTS `dbec_6_user_sql_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbec_6_user_sql_file` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `entity_ready_id` int(10) unsigned NOT NULL COMMENT 'foreign to dbec_2_entity_ready.id',
  `user_sql_file_label` varchar(75) NOT NULL COMMENT 'User chosen file name / label',
  `deleted` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `is_setting` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `object_ids` varchar(1024) NOT NULL COMMENT 'Object ID or tables names if setting tables',
  `json_counters` varchar(2048) NOT NULL COMMENT 'JSON counters, nb of records by tables',
  PRIMARY KEY (`id`),
  KEY `entity_ready_id` (`entity_ready_id`),
  KEY `user_id` (`user_id`),
  KEY `user_sql_file_label_idx` (`user_sql_file_label`),
  CONSTRAINT `dbec_6_user_sql_file_ibfk_1` FOREIGN KEY (`entity_ready_id`) REFERENCES `dbec_2_entity_ready` (`id`),
  CONSTRAINT `dbec_6_user_sql_file_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dbec_7_A_transfer_idx`
--

DROP TABLE IF EXISTS `dbec_7_A_transfer_idx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbec_7_A_transfer_idx` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `transfer_id` int(10) unsigned DEFAULT NULL,
  `table_name` varchar(75) DEFAULT NULL,
  `old_id` int(10) unsigned NOT NULL,
  `new_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transfer_id_index` (`transfer_id`),
  KEY `old_id_index` (`old_id`),
  KEY `table_name_index` (`table_name`),
  KEY `all_index` (`transfer_id`,`old_id`,`table_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dbec_7_transfer`
--

DROP TABLE IF EXISTS `dbec_7_transfer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbec_7_transfer` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tab_counter` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT 'JS tabs so js object known for sure',
  `is_extraction` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '1 if extraction 0 if paste',
  `is_success` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '0 when just started, 1 if ended in success, 2 if ended with errors, 3 not ended in 2 hours',
  `dest_db_index` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT 'ONLY PASTE - index of the destination Db for that transfer (when multi DB)',
  `user_id` int(10) unsigned NOT NULL,
  `entity_ready_id` int(10) unsigned DEFAULT NULL COMMENT 'foreign key to dbec_2_entity_ready.id',
  `db_srv_id` int(10) unsigned NOT NULL COMMENT 'foreign key id from connections',
  `db_name` varchar(75) NOT NULL,
  `nb_queries` int(10) unsigned DEFAULT NULL COMMENT '- ONLY EXTRACTION : number of records',
  `nb_bytes` int(10) unsigned NOT NULL COMMENT 'Number of bytes extracted or transfered',
  `object_id` varchar(750) DEFAULT NULL COMMENT '- ONLY EXTRACTION : ONE or many User Data Ids to be cloned',
  `end_of_perso_query` varchar(750) DEFAULT NULL COMMENT '- ONLY EXTRACTION : User QUERY',
  `json_db_counters` varchar(10192) NOT NULL COMMENT 'JSON counters, nb of records by tables',
  `dt_start` datetime DEFAULT NULL,
  `dt_end` datetime DEFAULT NULL,
  `final_comment` varchar(2048) DEFAULT NULL COMMENT 'USED when dt_time NOT NULL to tell user about sql error or new ID inserted successfully !',
  `parent_transfer_id` int(10) unsigned DEFAULT NULL COMMENT 'USED for paste transfer only as extraction as no parent yet.',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `db_srv_id` (`db_srv_id`),
  KEY `is_extraction_idx` (`is_extraction`),
  KEY `is_success_idx` (`is_success`),
  CONSTRAINT `dbec_7_transfer_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `dbec_7_transfer_ibfk_2` FOREIGN KEY (`db_srv_id`) REFERENCES `connections` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dbec_8_temp_files`
--

DROP TABLE IF EXISTS `dbec_8_temp_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbec_8_temp_files` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `transfer_id` int(10) unsigned NOT NULL COMMENT 'Foreign key to dbec_7_transfer.id',
  `temp_file_name` varchar(75) NOT NULL COMMENT 'Name of one temp file',
  `user_sql_file_id` int(10) unsigned DEFAULT NULL COMMENT 'Foreign key to dbec_6_user_sql_file.id',
  PRIMARY KEY (`id`),
  KEY `transfer_id` (`transfer_id`),
  KEY `user_sql_file_id` (`user_sql_file_id`),
  KEY `temp_file_name_idx` (`temp_file_name`),
  CONSTRAINT `dbec_8_temp_files_ibfk_1` FOREIGN KEY (`transfer_id`) REFERENCES `dbec_7_transfer` (`id`),
  CONSTRAINT `dbec_8_temp_files_ibfk_2` FOREIGN KEY (`user_sql_file_id`) REFERENCES `dbec_6_user_sql_file` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dbec_9_logs`
--

DROP TABLE IF EXISTS `dbec_9_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbec_9_logs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `transfer_id` int(10) unsigned NOT NULL COMMENT 'Foreign key to dbec_7_transfer.id',
  `log_dt` datetime DEFAULT NULL COMMENT 'Date Timelog entry was written',
  `is_error` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '1 if an SQL error',
  `is_debug` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '1 if debug message',
  `log_entry` text NOT NULL COMMENT 'A query or a error message',
  PRIMARY KEY (`id`),
  KEY `transfer_id` (`transfer_id`),
  KEY `is_debug_idx` (`is_debug`),
  KEY `is_error_idx` (`is_error`),
  CONSTRAINT `dbec_9_logs_ibfk_1` FOREIGN KEY (`transfer_id`) REFERENCES `dbec_7_transfer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dbec_country_data`
--

DROP TABLE IF EXISTS `dbec_country_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbec_country_data` (
  `country_id` int(10) unsigned NOT NULL,
  `name` varchar(37) NOT NULL,
  `iso_code` varchar(37) NOT NULL,
  PRIMARY KEY (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dbec_geo_data`
--

DROP TABLE IF EXISTS `dbec_geo_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbec_geo_data` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `country_id` int(10) unsigned NOT NULL,
  `state` varchar(25) NOT NULL,
  `state_code` varchar(25) NOT NULL,
  `zipcode` varchar(10) NOT NULL,
  `city` varchar(25) NOT NULL,
  `street` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `country_id` (`country_id`),
  CONSTRAINT `dbec_geo_data_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `dbec_country_data` (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dbec_name_data`
--

DROP TABLE IF EXISTS `dbec_name_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbec_name_data` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `country_id` int(10) unsigned NOT NULL,
  `gender` varchar(1) NOT NULL COMMENT 'ENUM : m or f',
  `first_name` varchar(37) NOT NULL,
  `last_name` varchar(37) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `country_id` (`country_id`),
  CONSTRAINT `dbec_name_data_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `dbec_country_data` (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `idea_db_tunnel`
--

DROP TABLE IF EXISTS `idea_db_tunnel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `idea_db_tunnel` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `connection_id` int(10) unsigned NOT NULL COMMENT 'foreign to id from connections',
  `user_id` int(10) unsigned NOT NULL,
  `deleted` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `distant_db_port` int(10) unsigned NOT NULL COMMENT 'Distant database port, as one ssh may be linked to differents db user...',
  `local_port` int(10) unsigned NOT NULL COMMENT 'Local port uniquely used for that db tunnel',
  `ssh_cmd` varchar(125) DEFAULT '' COMMENT 'SSH comand used to setupp and kill that tunnel',
  `last_used` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `connection_id_index` (`connection_id`),
  KEY `distant_db_port_index` (`distant_db_port`),
  KEY `deleted_idx` (`deleted`),
  CONSTRAINT `idea_db_tunnel_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `idea_db_tunnel_ibfk_2` FOREIGN KEY (`connection_id`) REFERENCES `connections` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `idea_reset_code`
--

DROP TABLE IF EXISTS `idea_reset_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `idea_reset_code` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `reset_code` varchar(30) DEFAULT NULL,
  `request_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `idea_reset_code_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `idea_user`
--

DROP TABLE IF EXISTS users;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `password` varchar(64) NOT NULL,
  `email` varchar(64) NOT NULL,
  `is_active` TINYINT(1) NOT NULL,
  `timezone_offset` int(11) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL COMMENT 'emailValid or whatever',
  `signup_date` date DEFAULT NULL,
  `deleted` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `json_settings` varchar(254) DEFAULT NULL,
  UNIQUE INDEX UNIQ_1483A5E9F85E0677 (username),
  UNIQUE INDEX UNIQ_1483A5E9E7927C74 (email),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `connections`
--

DROP TABLE IF EXISTS `connections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `connections` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `deleted` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `connection_disabled` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `connection_genre` varchar(3) NOT NULL COMMENT 'enum: ftp, db, svn or git. Type of connection',
  `connection_name` varchar(55) DEFAULT '' COMMENT 'Memorable name for user',
  `url_host` varchar(75) DEFAULT '' COMMENT 'Host IP or URL',
  `user_name` varchar(55) DEFAULT '',
  `pass_word` varchar(55) DEFAULT '',
  `port_number` varchar(10) DEFAULT '',
  `method` varchar(10) DEFAULT '' COMMENT 'nothing means simple, or over_ssh, or pem_file, or pub_key',
  `extra` varchar(255) DEFAULT '' COMMENT 'USED to store JSON data depending on connection type',
  `selected_ftp_id` int(10) unsigned DEFAULT NULL,
  `api_key` varchar(65) DEFAULT '0',
  `key_date` date DEFAULT NULL,
  `my_key` varchar(512) DEFAULT NULL,
  `my_four` varchar(512) DEFAULT NULL,
  `my_pass` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `selected_ftp_id` (`selected_ftp_id`),
  CONSTRAINT `connections_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `connections_ibfk_2` FOREIGN KEY (`selected_ftp_id`) REFERENCES `connections` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `idea_user_sessions`
--

DROP TABLE IF EXISTS `idea_user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `idea_user_sessions` (
  `id` varchar(32) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `fingerprint` varchar(100) COLLATE latin1_general_ci DEFAULT NULL,
  `data` text COLLATE latin1_general_ci,
  `access` int(32) NOT NULL DEFAULT '0',
  `date` varchar(20) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `idea_valid_code`
--

DROP TABLE IF EXISTS `idea_valid_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `idea_valid_code` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `valid_code` varchar(30) DEFAULT NULL,
  `request_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `idea_valid_code_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-01-12  7:22:43
