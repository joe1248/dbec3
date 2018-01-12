<?php declare(strict_types = 1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20180112110632 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE dbec_2_entity_ready DROP FOREIGN KEY dbec_2_entity_ready_ibfk_1');
        $this->addSql('ALTER TABLE dbec_6_user_sql_file DROP FOREIGN KEY dbec_6_user_sql_file_ibfk_1');
        $this->addSql('ALTER TABLE dbec_5_dest_database DROP FOREIGN KEY dbec_5_dest_database_ibfk_1');
        $this->addSql('ALTER TABLE dbec_8_temp_files DROP FOREIGN KEY dbec_8_temp_files_ibfk_2');
        $this->addSql('ALTER TABLE dbec_8_temp_files DROP FOREIGN KEY dbec_8_temp_files_ibfk_1');
        $this->addSql('ALTER TABLE dbec_9_logs DROP FOREIGN KEY dbec_9_logs_ibfk_1');
        $this->addSql('ALTER TABLE dbec_geo_data DROP FOREIGN KEY dbec_geo_data_ibfk_1');
        $this->addSql('ALTER TABLE dbec_name_data DROP FOREIGN KEY dbec_name_data_ibfk_1');
        $this->addSql('ALTER TABLE dbec_1_analysed_db DROP FOREIGN KEY fk_dbec_1_analysed_db_user_id');
        $this->addSql('ALTER TABLE dbec_2_entity_ready DROP FOREIGN KEY dbec_2_entity_ready_ibfk_2');
        $this->addSql('ALTER TABLE dbec_3_src_fave DROP FOREIGN KEY dbec_3_src_fave_ibfk_2');
        $this->addSql('ALTER TABLE dbec_4_dest_fave DROP FOREIGN KEY dbec_4_dest_fave_ibfk_1');
        $this->addSql('ALTER TABLE dbec_6_user_sql_file DROP FOREIGN KEY dbec_6_user_sql_file_ibfk_2');
        $this->addSql('ALTER TABLE dbec_7_transfer DROP FOREIGN KEY dbec_7_transfer_ibfk_1');
        $this->addSql('ALTER TABLE idea_db_tunnel DROP FOREIGN KEY idea_db_tunnel_ibfk_1');
        $this->addSql('ALTER TABLE idea_reset_code DROP FOREIGN KEY idea_reset_code_ibfk_1');
        $this->addSql('ALTER TABLE idea_user_connections DROP FOREIGN KEY idea_user_connections_ibfk_1');
        $this->addSql('ALTER TABLE idea_valid_code DROP FOREIGN KEY idea_valid_code_ibfk_1');
        $this->addSql('ALTER TABLE dbec_1_analysed_db DROP FOREIGN KEY fk_dbec_1_analysed_db_svr_id');
        $this->addSql('ALTER TABLE dbec_3_src_fave DROP FOREIGN KEY dbec_3_src_fave_ibfk_1');
        $this->addSql('ALTER TABLE dbec_5_dest_database DROP FOREIGN KEY dbec_5_dest_database_ibfk_2');
        $this->addSql('ALTER TABLE dbec_7_transfer DROP FOREIGN KEY dbec_7_transfer_ibfk_2');
        $this->addSql('ALTER TABLE idea_db_tunnel DROP FOREIGN KEY idea_db_tunnel_ibfk_2');
        $this->addSql('ALTER TABLE idea_user_connections DROP FOREIGN KEY idea_user_connections_ibfk_2');
        $this->addSql('CREATE TABLE users (id INT UNSIGNED AUTO_INCREMENT NOT NULL, username VARCHAR(25) NOT NULL, password VARCHAR(64) NOT NULL, email VARCHAR(60) NOT NULL, is_active TINYINT(1) NOT NULL, timezone_offset INT DEFAULT NULL, status VARCHAR(10) DEFAULT \'NULL\' COMMENT \'emailValid or whatever\', signup_date DATE DEFAULT \'NULL\', deleted TINYINT(1) NOT NULL, json_settings VARCHAR(254) DEFAULT \'NULL\', UNIQUE INDEX UNIQ_1483A5E9F85E0677 (username), UNIQUE INDEX UNIQ_1483A5E9E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('DROP TABLE dbec_0_config');
        $this->addSql('DROP TABLE dbec_1_analysed_db');
        $this->addSql('DROP TABLE dbec_2_entity_ready');
        $this->addSql('DROP TABLE dbec_3_src_fave');
        $this->addSql('DROP TABLE dbec_4_dest_fave');
        $this->addSql('DROP TABLE dbec_5_dest_database');
        $this->addSql('DROP TABLE dbec_6_user_sql_file');
        $this->addSql('DROP TABLE dbec_7_A_transfer_idx');
        $this->addSql('DROP TABLE dbec_7_transfer');
        $this->addSql('DROP TABLE dbec_8_temp_files');
        $this->addSql('DROP TABLE dbec_9_logs');
        $this->addSql('DROP TABLE dbec_country_data');
        $this->addSql('DROP TABLE dbec_geo_data');
        $this->addSql('DROP TABLE dbec_name_data');
        $this->addSql('DROP TABLE idea_db_tunnel');
        $this->addSql('DROP TABLE idea_reset_code');
        $this->addSql('DROP TABLE idea_user');
        $this->addSql('DROP TABLE idea_user_connections');
        $this->addSql('DROP TABLE idea_user_sessions');
        $this->addSql('DROP TABLE idea_valid_code');
    }

    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE dbec_0_config (config_param VARCHAR(37) NOT NULL COLLATE utf8_general_ci, param_value VARCHAR(75) DEFAULT \'\'0\'\' COLLATE utf8_general_ci, PRIMARY KEY(config_param)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dbec_1_analysed_db (id INT UNSIGNED AUTO_INCREMENT NOT NULL, user_id INT UNSIGNED NOT NULL, svr_id INT UNSIGNED NOT NULL COMMENT \'foreign to id from idea_user_connections\', database_name VARCHAR(75) NOT NULL COLLATE utf8_general_ci COMMENT \'Real database name\', main_table_name VARCHAR(75) NOT NULL COLLATE utf8_general_ci COMMENT \'Main table name\', main_table_primary_key VARCHAR(75) NOT NULL COLLATE utf8_general_ci COMMENT \'Main DB table PRIMARY KEY name\', deleted TINYINT(1) DEFAULT \'0\' NOT NULL, json_data LONGTEXT NOT NULL COLLATE utf8_general_ci COMMENT \'JSON describing the differents DB entities\', INDEX fk_dbec_1_analysed_db_user_id (user_id), INDEX fk_dbec_1_analysed_db_svr_id (svr_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dbec_2_entity_ready (id INT UNSIGNED AUTO_INCREMENT NOT NULL, user_id INT UNSIGNED NOT NULL, analysed_db_id INT UNSIGNED NOT NULL COMMENT \'foreign to dbec_1_analysed_db.id\', entity_ready_name VARCHAR(75) NOT NULL COLLATE utf8_general_ci COMMENT \'Real database name\', deleted TINYINT(1) DEFAULT \'0\' NOT NULL, json_data LONGTEXT NOT NULL COLLATE utf8_general_ci COMMENT \'JSON describing the choices of user\', UNIQUE INDEX unique_label_per_user (user_id, entity_ready_name), INDEX analysed_db_id (analysed_db_id), INDEX IDX_6CD64C5EA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dbec_3_src_fave (id INT UNSIGNED AUTO_INCREMENT NOT NULL, user_id INT UNSIGNED NOT NULL, svr_id INT UNSIGNED NOT NULL COMMENT \'foreign to id from idea_user_connections\', src_fave_label VARCHAR(75) NOT NULL COLLATE utf8_general_ci COMMENT \'User chosen label\', database_name VARCHAR(75) NOT NULL COLLATE utf8_general_ci COMMENT \'Real database name\', deleted TINYINT(1) DEFAULT \'0\' NOT NULL, INDEX svr_id (svr_id), INDEX user_id (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dbec_4_dest_fave (id INT UNSIGNED AUTO_INCREMENT NOT NULL, user_id INT UNSIGNED NOT NULL, dest_fave_label VARCHAR(75) NOT NULL COLLATE utf8_general_ci COMMENT \'User chosen label\', deleted TINYINT(1) DEFAULT \'0\' NOT NULL, INDEX user_id (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dbec_5_dest_database (id INT UNSIGNED AUTO_INCREMENT NOT NULL, dest_fave_id INT UNSIGNED NOT NULL COMMENT \'foreign to dbec_4_dest_fave.id\', svr_id INT UNSIGNED NOT NULL COMMENT \'foreign to id from idea_user_connections\', database_name VARCHAR(75) NOT NULL COLLATE utf8_general_ci COMMENT \'Real database name\', deleted TINYINT(1) DEFAULT \'0\' NOT NULL, INDEX database_name_idx (database_name), INDEX deleted_idx (deleted), INDEX dest_fave_id (dest_fave_id), INDEX svr_id (svr_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dbec_6_user_sql_file (id INT UNSIGNED AUTO_INCREMENT NOT NULL, user_id INT UNSIGNED NOT NULL, entity_ready_id INT UNSIGNED NOT NULL COMMENT \'foreign to dbec_2_entity_ready.id\', user_sql_file_label VARCHAR(75) NOT NULL COLLATE utf8_general_ci COMMENT \'User chosen file name / label\', deleted TINYINT(1) DEFAULT \'0\' NOT NULL, is_setting TINYINT(1) DEFAULT \'0\' NOT NULL, object_ids VARCHAR(1024) NOT NULL COLLATE utf8_general_ci COMMENT \'Object ID or tables names if setting tables\', json_counters VARCHAR(2048) NOT NULL COLLATE utf8_general_ci COMMENT \'JSON counters, nb of records by tables\', INDEX entity_ready_id (entity_ready_id), INDEX user_id (user_id), INDEX user_sql_file_label_idx (user_sql_file_label), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dbec_7_A_transfer_idx (id INT UNSIGNED AUTO_INCREMENT NOT NULL, transfer_id INT UNSIGNED DEFAULT NULL, table_name VARCHAR(75) DEFAULT \'NULL\' COLLATE utf8_general_ci, old_id INT UNSIGNED NOT NULL, new_id INT UNSIGNED DEFAULT NULL, INDEX transfer_id_index (transfer_id), INDEX old_id_index (old_id), INDEX table_name_index (table_name), INDEX all_index (transfer_id, old_id, table_name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dbec_7_transfer (id INT UNSIGNED AUTO_INCREMENT NOT NULL, user_id INT UNSIGNED NOT NULL, db_srv_id INT UNSIGNED NOT NULL COMMENT \'foreign key id from idea_user_connections\', tab_counter TINYINT(1) DEFAULT \'0\' NOT NULL COMMENT \'JS tabs so js object known for sure\', is_extraction TINYINT(1) DEFAULT \'0\' NOT NULL COMMENT \'1 if extraction 0 if paste\', is_success TINYINT(1) DEFAULT \'0\' NOT NULL COMMENT \'0 when just started, 1 if ended in success, 2 if ended with errors, 3 not ended in 2 hours\', dest_db_index TINYINT(1) DEFAULT \'0\' NOT NULL COMMENT \'ONLY PASTE - index of the destination Db for that transfer (when multi DB)\', entity_ready_id INT UNSIGNED DEFAULT NULL COMMENT \'foreign key to dbec_2_entity_ready.id\', db_name VARCHAR(75) NOT NULL COLLATE utf8_general_ci, nb_queries INT UNSIGNED DEFAULT NULL COMMENT \'- ONLY EXTRACTION : number of records\', nb_bytes INT UNSIGNED NOT NULL COMMENT \'Number of bytes extracted or transfered\', object_id VARCHAR(750) DEFAULT \'NULL\' COLLATE utf8_general_ci COMMENT \'- ONLY EXTRACTION : ONE or many User Data Ids to be cloned\', end_of_perso_query VARCHAR(750) DEFAULT \'NULL\' COLLATE utf8_general_ci COMMENT \'- ONLY EXTRACTION : User QUERY\', json_db_counters VARCHAR(10192) NOT NULL COLLATE utf8_general_ci COMMENT \'JSON counters, nb of records by tables\', dt_start DATETIME DEFAULT \'NULL\', dt_end DATETIME DEFAULT \'NULL\', final_comment VARCHAR(2048) DEFAULT \'NULL\' COLLATE utf8_general_ci COMMENT \'USED when dt_time NOT NULL to tell user about sql error or new ID inserted successfully !\', parent_transfer_id INT UNSIGNED DEFAULT NULL COMMENT \'USED for paste transfer only as extraction as no parent yet.\', INDEX user_id (user_id), INDEX db_srv_id (db_srv_id), INDEX is_extraction_idx (is_extraction), INDEX is_success_idx (is_success), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dbec_8_temp_files (id INT UNSIGNED AUTO_INCREMENT NOT NULL, transfer_id INT UNSIGNED NOT NULL COMMENT \'Foreign key to dbec_7_transfer.id\', user_sql_file_id INT UNSIGNED DEFAULT NULL COMMENT \'Foreign key to dbec_6_user_sql_file.id\', temp_file_name VARCHAR(75) NOT NULL COLLATE utf8_general_ci COMMENT \'Name of one temp file\', INDEX transfer_id (transfer_id), INDEX user_sql_file_id (user_sql_file_id), INDEX temp_file_name_idx (temp_file_name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dbec_9_logs (id INT UNSIGNED AUTO_INCREMENT NOT NULL, transfer_id INT UNSIGNED NOT NULL COMMENT \'Foreign key to dbec_7_transfer.id\', log_dt DATETIME DEFAULT \'NULL\' COMMENT \'Date Timelog entry was written\', is_error TINYINT(1) DEFAULT \'0\' NOT NULL COMMENT \'1 if an SQL error\', is_debug TINYINT(1) DEFAULT \'0\' NOT NULL COMMENT \'1 if debug message\', log_entry TEXT NOT NULL COLLATE utf8_general_ci COMMENT \'A query or a error message\', INDEX transfer_id (transfer_id), INDEX is_debug_idx (is_debug), INDEX is_error_idx (is_error), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dbec_country_data (country_id INT UNSIGNED NOT NULL, name VARCHAR(37) NOT NULL COLLATE utf8_general_ci, iso_code VARCHAR(37) NOT NULL COLLATE utf8_general_ci, PRIMARY KEY(country_id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dbec_geo_data (id INT UNSIGNED AUTO_INCREMENT NOT NULL, country_id INT UNSIGNED NOT NULL, state VARCHAR(25) NOT NULL COLLATE utf8_general_ci, state_code VARCHAR(25) NOT NULL COLLATE utf8_general_ci, zipcode VARCHAR(10) NOT NULL COLLATE utf8_general_ci, city VARCHAR(25) NOT NULL COLLATE utf8_general_ci, street VARCHAR(50) NOT NULL COLLATE utf8_general_ci, INDEX country_id (country_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dbec_name_data (id INT UNSIGNED AUTO_INCREMENT NOT NULL, country_id INT UNSIGNED NOT NULL, gender VARCHAR(1) NOT NULL COLLATE utf8_general_ci COMMENT \'ENUM : m or f\', first_name VARCHAR(37) NOT NULL COLLATE utf8_general_ci, last_name VARCHAR(37) NOT NULL COLLATE utf8_general_ci, INDEX country_id (country_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE idea_db_tunnel (id INT UNSIGNED AUTO_INCREMENT NOT NULL, connection_id INT UNSIGNED NOT NULL COMMENT \'foreign to id from idea_user_connections\', user_id INT UNSIGNED NOT NULL, deleted TINYINT(1) DEFAULT \'0\' NOT NULL, distant_db_port INT UNSIGNED NOT NULL COMMENT \'Distant database port, as one ssh may be linked to differents db user...\', local_port INT UNSIGNED NOT NULL COMMENT \'Local port uniquely used for that db tunnel\', ssh_cmd VARCHAR(125) DEFAULT \'\'\'\' COLLATE utf8_general_ci COMMENT \'SSH comand used to setupp and kill that tunnel\', last_used DATETIME DEFAULT \'NULL\', INDEX user_id (user_id), INDEX connection_id_index (connection_id), INDEX distant_db_port_index (distant_db_port), INDEX deleted_idx (deleted), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE idea_reset_code (id INT UNSIGNED AUTO_INCREMENT NOT NULL, user_id INT UNSIGNED NOT NULL, reset_code VARCHAR(30) DEFAULT \'NULL\' COLLATE utf8_general_ci, request_time DATETIME DEFAULT \'NULL\', INDEX user_id (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE idea_user (id INT UNSIGNED AUTO_INCREMENT NOT NULL, name VARCHAR(30) DEFAULT \'NULL\' COLLATE utf8_general_ci, mail VARCHAR(75) DEFAULT \'NULL\' COLLATE utf8_general_ci, timezone_offset INT DEFAULT NULL, password VARCHAR(125) DEFAULT \'NULL\' COLLATE utf8_general_ci, status VARCHAR(10) DEFAULT \'NULL\' COLLATE utf8_general_ci COMMENT \'emailValid or whatever\', signup_date DATE DEFAULT \'NULL\', deleted TINYINT(1) DEFAULT \'0\' NOT NULL, json_settings VARCHAR(254) DEFAULT \'NULL\' COLLATE utf8_general_ci, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE idea_user_connections (id INT UNSIGNED AUTO_INCREMENT NOT NULL, user_id INT UNSIGNED NOT NULL, selected_ftp_id INT UNSIGNED DEFAULT NULL, deleted TINYINT(1) DEFAULT \'0\' NOT NULL, connection_disabled TINYINT(1) DEFAULT \'0\' NOT NULL, connection_genre VARCHAR(3) NOT NULL COLLATE utf8_general_ci COMMENT \'enum: ftp, db, svn or git. Type of connection\', connection_name VARCHAR(55) DEFAULT \'\'\'\' COLLATE utf8_general_ci COMMENT \'Memorable name for user\', url_host VARCHAR(75) DEFAULT \'\'\'\' COLLATE utf8_general_ci COMMENT \'Host IP or URL\', user_name VARCHAR(55) DEFAULT \'\'\'\' COLLATE utf8_general_ci, pass_word VARCHAR(55) DEFAULT \'\'\'\' COLLATE utf8_general_ci, port_number VARCHAR(10) DEFAULT \'\'\'\' COLLATE utf8_general_ci, method VARCHAR(10) DEFAULT \'\'\'\' COLLATE utf8_general_ci COMMENT \'nothing means simple, or over_ssh, or pem_file, or pub_key\', extra VARCHAR(255) DEFAULT \'\'\'\' COLLATE utf8_general_ci COMMENT \'USED to store JSON data depending on connection type\', api_key VARCHAR(65) DEFAULT \'\'0\'\' COLLATE utf8_general_ci, key_date DATE DEFAULT \'NULL\', my_key VARCHAR(512) DEFAULT \'NULL\' COLLATE utf8_general_ci, my_four VARCHAR(512) DEFAULT \'NULL\' COLLATE utf8_general_ci, my_pass VARCHAR(512) DEFAULT \'NULL\' COLLATE utf8_general_ci, INDEX user_id (user_id), INDEX selected_ftp_id (selected_ftp_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE idea_user_sessions (id VARCHAR(32) DEFAULT \'\'\'\' NOT NULL COLLATE latin1_general_ci, fingerprint VARCHAR(100) DEFAULT \'NULL\' COLLATE latin1_general_ci, data TEXT DEFAULT NULL COLLATE latin1_general_ci, access INT DEFAULT 0 NOT NULL, date VARCHAR(20) DEFAULT \'NULL\' COLLATE latin1_general_ci, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE idea_valid_code (id INT UNSIGNED AUTO_INCREMENT NOT NULL, user_id INT UNSIGNED NOT NULL, valid_code VARCHAR(30) DEFAULT \'NULL\' COLLATE utf8_general_ci, request_time DATETIME DEFAULT \'NULL\', INDEX user_id (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE dbec_1_analysed_db ADD CONSTRAINT fk_dbec_1_analysed_db_svr_id FOREIGN KEY (svr_id) REFERENCES idea_user_connections (id)');
        $this->addSql('ALTER TABLE dbec_1_analysed_db ADD CONSTRAINT fk_dbec_1_analysed_db_user_id FOREIGN KEY (user_id) REFERENCES idea_user (id)');
        $this->addSql('ALTER TABLE dbec_2_entity_ready ADD CONSTRAINT dbec_2_entity_ready_ibfk_1 FOREIGN KEY (analysed_db_id) REFERENCES dbec_1_analysed_db (id)');
        $this->addSql('ALTER TABLE dbec_2_entity_ready ADD CONSTRAINT dbec_2_entity_ready_ibfk_2 FOREIGN KEY (user_id) REFERENCES idea_user (id)');
        $this->addSql('ALTER TABLE dbec_3_src_fave ADD CONSTRAINT dbec_3_src_fave_ibfk_1 FOREIGN KEY (svr_id) REFERENCES idea_user_connections (id)');
        $this->addSql('ALTER TABLE dbec_3_src_fave ADD CONSTRAINT dbec_3_src_fave_ibfk_2 FOREIGN KEY (user_id) REFERENCES idea_user (id)');
        $this->addSql('ALTER TABLE dbec_4_dest_fave ADD CONSTRAINT dbec_4_dest_fave_ibfk_1 FOREIGN KEY (user_id) REFERENCES idea_user (id)');
        $this->addSql('ALTER TABLE dbec_5_dest_database ADD CONSTRAINT dbec_5_dest_database_ibfk_1 FOREIGN KEY (dest_fave_id) REFERENCES dbec_4_dest_fave (id)');
        $this->addSql('ALTER TABLE dbec_5_dest_database ADD CONSTRAINT dbec_5_dest_database_ibfk_2 FOREIGN KEY (svr_id) REFERENCES idea_user_connections (id)');
        $this->addSql('ALTER TABLE dbec_6_user_sql_file ADD CONSTRAINT dbec_6_user_sql_file_ibfk_1 FOREIGN KEY (entity_ready_id) REFERENCES dbec_2_entity_ready (id)');
        $this->addSql('ALTER TABLE dbec_6_user_sql_file ADD CONSTRAINT dbec_6_user_sql_file_ibfk_2 FOREIGN KEY (user_id) REFERENCES idea_user (id)');
        $this->addSql('ALTER TABLE dbec_7_transfer ADD CONSTRAINT dbec_7_transfer_ibfk_1 FOREIGN KEY (user_id) REFERENCES idea_user (id)');
        $this->addSql('ALTER TABLE dbec_7_transfer ADD CONSTRAINT dbec_7_transfer_ibfk_2 FOREIGN KEY (db_srv_id) REFERENCES idea_user_connections (id)');
        $this->addSql('ALTER TABLE dbec_8_temp_files ADD CONSTRAINT dbec_8_temp_files_ibfk_1 FOREIGN KEY (transfer_id) REFERENCES dbec_7_transfer (id)');
        $this->addSql('ALTER TABLE dbec_8_temp_files ADD CONSTRAINT dbec_8_temp_files_ibfk_2 FOREIGN KEY (user_sql_file_id) REFERENCES dbec_6_user_sql_file (id)');
        $this->addSql('ALTER TABLE dbec_9_logs ADD CONSTRAINT dbec_9_logs_ibfk_1 FOREIGN KEY (transfer_id) REFERENCES dbec_7_transfer (id)');
        $this->addSql('ALTER TABLE dbec_geo_data ADD CONSTRAINT dbec_geo_data_ibfk_1 FOREIGN KEY (country_id) REFERENCES dbec_country_data (country_id)');
        $this->addSql('ALTER TABLE dbec_name_data ADD CONSTRAINT dbec_name_data_ibfk_1 FOREIGN KEY (country_id) REFERENCES dbec_country_data (country_id)');
        $this->addSql('ALTER TABLE idea_db_tunnel ADD CONSTRAINT idea_db_tunnel_ibfk_1 FOREIGN KEY (user_id) REFERENCES idea_user (id)');
        $this->addSql('ALTER TABLE idea_db_tunnel ADD CONSTRAINT idea_db_tunnel_ibfk_2 FOREIGN KEY (connection_id) REFERENCES idea_user_connections (id)');
        $this->addSql('ALTER TABLE idea_reset_code ADD CONSTRAINT idea_reset_code_ibfk_1 FOREIGN KEY (user_id) REFERENCES idea_user (id)');
        $this->addSql('ALTER TABLE idea_user_connections ADD CONSTRAINT idea_user_connections_ibfk_1 FOREIGN KEY (user_id) REFERENCES idea_user (id)');
        $this->addSql('ALTER TABLE idea_user_connections ADD CONSTRAINT idea_user_connections_ibfk_2 FOREIGN KEY (selected_ftp_id) REFERENCES idea_user_connections (id)');
        $this->addSql('ALTER TABLE idea_valid_code ADD CONSTRAINT idea_valid_code_ibfk_1 FOREIGN KEY (user_id) REFERENCES idea_user (id)');
        $this->addSql('DROP TABLE users');
    }
}
