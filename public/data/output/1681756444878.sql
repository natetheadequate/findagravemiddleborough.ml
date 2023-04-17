CREATE TABLE `names` (`i` smallint UNSIGNED NOT NULL UNIQUE,
            `name` varchar(250) NOT NULL UNIQUE,
            PRIMARY KEY(`name`));
CREATE TABLE `prefixes` (`i` smallint UNSIGNED NOT NULL UNIQUE,
            `prefix` varchar(250) NOT NULL UNIQUE,
            PRIMARY KEY(`prefix`));
CREATE TABLE `suffixes` (`i` smallint UNSIGNED NOT NULL UNIQUE,
            `suffix` varchar(250) NOT NULL UNIQUE,
            PRIMARY KEY(`suffix`));
CREATE TABLE `places` (`i` smallint UNSIGNED NOT NULL UNIQUE,
            `place` varchar(250) NOT NULL UNIQUE,
            PRIMARY KEY(`place`));
CREATE TABLE `cemeteries` (`i` smallint UNSIGNED NOT NULL UNIQUE,
            `cemetery` varchar(250) NOT NULL UNIQUE,
            PRIMARY KEY(`cemetery`));
CREATE TABLE `join_last_name` (`id` smallint UNSIGNED NOT NULL,
            `fk_names` smallint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`fk_names`),
            FOREIGN KEY(`fk_names`) REFERENCES names(`i`));
CREATE TABLE `join_maiden_name` (`id` smallint UNSIGNED NOT NULL,
            `fk_names` smallint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`fk_names`),
            FOREIGN KEY(`fk_names`) REFERENCES names(`i`));
CREATE TABLE `join_first_name` (`id` smallint UNSIGNED NOT NULL,
            `fk_names` smallint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`fk_names`),
            FOREIGN KEY(`fk_names`) REFERENCES names(`i`));
CREATE TABLE `join_middle_name` (`id` smallint UNSIGNED NOT NULL,
            `fk_names` smallint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`fk_names`),
            FOREIGN KEY(`fk_names`) REFERENCES names(`i`));
CREATE TABLE `join_prefix` (`id` smallint UNSIGNED NOT NULL,
            `fk_prefixes` smallint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`fk_prefixes`),
            FOREIGN KEY(`fk_prefixes`) REFERENCES prefixes(`i`));
CREATE TABLE `join_suffix` (`id` smallint UNSIGNED NOT NULL,
            `fk_suffixes` smallint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`fk_suffixes`),
            FOREIGN KEY(`fk_suffixes`) REFERENCES suffixes(`i`));
CREATE TABLE `join_birth_place` (`id` smallint UNSIGNED NOT NULL,
            `fk_places` smallint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`fk_places`),
            FOREIGN KEY(`fk_places`) REFERENCES places(`i`));
CREATE TABLE `join_death_place` (`id` smallint UNSIGNED NOT NULL,
            `fk_places` smallint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`fk_places`),
            FOREIGN KEY(`fk_places`) REFERENCES places(`i`));
CREATE TABLE `join_cemetery` (`id` smallint UNSIGNED NOT NULL,
            `fk_cemeteries` smallint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`fk_cemeteries`),
            FOREIGN KEY(`fk_cemeteries`) REFERENCES cemeteries(`i`));
CREATE TABLE `birth_day` (`id` smallint UNSIGNED NOT NULL,
            `birth_day` tinyint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`birth_day`));
CREATE TABLE `birth_month` (`id` smallint UNSIGNED NOT NULL,
            `birth_month` tinyint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`birth_month`));
CREATE TABLE `birth_year` (`id` smallint UNSIGNED NOT NULL,
            `birth_year` smallint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`birth_year`));
CREATE TABLE `death_day` (`id` smallint UNSIGNED NOT NULL,
            `death_day` tinyint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`death_day`));
CREATE TABLE `death_month` (`id` smallint UNSIGNED NOT NULL,
            `death_month` tinyint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`death_month`));
CREATE TABLE `death_year` (`id` smallint UNSIGNED NOT NULL,
            `death_year` smallint UNSIGNED NOT NULL,
            PRIMARY KEY(`id`,`death_year`));
CREATE TABLE `military_stone_inscription` (`id` smallint UNSIGNED NOT NULL,
            `military_stone_inscription` varchar(255) NOT NULL,
            PRIMARY KEY(`id`,`military_stone_inscription`));
CREATE TABLE `location_in_cemetery` (`id` smallint UNSIGNED NOT NULL,
            `location_in_cemetery` varchar(255) NOT NULL,
            PRIMARY KEY(`id`,`location_in_cemetery`));
CREATE TABLE `cenotaphs` (`id` smallint UNSIGNED NOT NULL,
            `cenotaphs` varchar(255) NOT NULL,
            PRIMARY KEY(`id`,`cenotaphs`));
CREATE TABLE `notes` (`id` smallint UNSIGNED NOT NULL,
            `notes` varchar(255) NOT NULL,
            PRIMARY KEY(`id`,`notes`));
CREATE TABLE `father_name` (`id` smallint UNSIGNED NOT NULL,
            `father_name` varchar(255) NOT NULL,
            PRIMARY KEY(`id`,`father_name`));
CREATE TABLE `mother_name` (`id` smallint UNSIGNED NOT NULL,
            `mother_name` varchar(255) NOT NULL,
            PRIMARY KEY(`id`,`mother_name`));
CREATE TABLE `spouse_name` (`id` smallint UNSIGNED NOT NULL,
            `spouse_name` varchar(255) NOT NULL,
            PRIMARY KEY(`id`,`spouse_name`));
INSERT INTO `names` VALUES (1,"Burns");INSERT INTO `join_last_name` VALUES (0,1);INSERT INTO `names` VALUES (2,"Case");INSERT INTO `join_last_name` VALUES (1,2);INSERT INTO `names` VALUES (3,"Chamberlain");INSERT INTO `join_last_name` VALUES (2,3);INSERT INTO `names` VALUES (4,"Collins");INSERT INTO `join_last_name` VALUES (3,4);INSERT INTO `names` VALUES (5,"Cox");INSERT INTO `join_last_name` VALUES (4,5);INSERT INTO `names` VALUES (6,"Dejongh");INSERT INTO `join_last_name` VALUES (5,6);INSERT INTO `names` VALUES (7,"Emerson");INSERT INTO `join_last_name` VALUES (6,7);INSERT INTO `names` VALUES (8,"Gammons");INSERT INTO `join_last_name` VALUES (7,8);INSERT INTO `names` VALUES (9,"Gibbs");INSERT INTO `join_last_name` VALUES (8,9);INSERT INTO `join_last_name` VALUES (9,9);INSERT INTO `join_last_name` VALUES (10,9);INSERT INTO `join_last_name` VALUES (11,9);INSERT INTO `join_last_name` VALUES (12,9);INSERT INTO `names` VALUES (10,"Hall");INSERT INTO `join_last_name` VALUES (13,10);INSERT INTO `names` VALUES (11,"Lincoln");INSERT INTO `join_last_name` VALUES (14,11);INSERT INTO `names` VALUES (12,"Russell");INSERT INTO `join_first_name` VALUES (0,12);INSERT INTO `names` VALUES (13,"James");INSERT INTO `join_first_name` VALUES (1,13);INSERT INTO `names` VALUES (14,"Catherine");INSERT INTO `join_first_name` VALUES (2,14);INSERT INTO `names` VALUES (15,"Daniel");INSERT INTO `join_first_name` VALUES (3,15);INSERT INTO `names` VALUES (16,"Richard");INSERT INTO `join_first_name` VALUES (4,16);INSERT INTO `names` VALUES (17,"Lance");INSERT INTO `join_first_name` VALUES (5,17);INSERT INTO `names` VALUES (18,"Herbert");INSERT INTO `join_first_name` VALUES (6,18);INSERT INTO `names` VALUES (19,"Charles");INSERT INTO `join_first_name` VALUES (7,19);INSERT INTO `names` VALUES (20,"Abiel");INSERT INTO `join_first_name` VALUES (8,20);INSERT INTO `join_first_name` VALUES (9,20);INSERT INTO `join_first_name` VALUES (10,19);INSERT INTO `join_first_name` VALUES (11,19);INSERT INTO `names` VALUES (21,"Stephen");INSERT INTO `join_first_name` VALUES (12,21);INSERT INTO `names` VALUES (22,"Levi");INSERT INTO `join_first_name` VALUES (13,22);INSERT INTO `join_first_name` VALUES (14,19);INSERT INTO `names` VALUES (23,"H");INSERT INTO `join_middle_name` VALUES (1,23);INSERT INTO `names` VALUES (24,"L");INSERT INTO `join_middle_name` VALUES (2,24);INSERT INTO `join_middle_name` VALUES (6,24);INSERT INTO `names` VALUES (25,"T");INSERT INTO `join_middle_name` VALUES (7,25);INSERT INTO `names` VALUES (26,"F");INSERT INTO `join_middle_name` VALUES (10,26);INSERT INTO `join_middle_name` VALUES (11,23);INSERT INTO `names` VALUES (27,"B");INSERT INTO `join_middle_name` VALUES (12,27);INSERT INTO `names` VALUES (28,"G");INSERT INTO `join_middle_name` VALUES (14,28);INSERT INTO `prefixes` VALUES (1,"Capt.");INSERT INTO `join_prefix` VALUES (1,1);INSERT INTO `join_prefix` VALUES (12,1);INSERT INTO `suffixes` VALUES (1,"Jr.");INSERT INTO `join_suffix` VALUES (13,1);INSERT INTO `places` VALUES (1,"Whitingham, Vt");INSERT INTO `join_birth_place` VALUES (0,1);INSERT INTO `places` VALUES (2,"Johns Island, SC");INSERT INTO `join_death_place` VALUES (13,2);INSERT INTO `places` VALUES (3,"Washington, DC");INSERT INTO `join_death_place` VALUES (14,3);INSERT INTO `cemeteries` VALUES (1,"Central");INSERT INTO `join_cemetery` VALUES (0,1);INSERT INTO `join_cemetery` VALUES (1,1);INSERT INTO `join_cemetery` VALUES (2,1);INSERT INTO `join_cemetery` VALUES (3,1);INSERT INTO `join_cemetery` VALUES (4,1);INSERT INTO `join_cemetery` VALUES (5,1);INSERT INTO `join_cemetery` VALUES (6,1);INSERT INTO `join_cemetery` VALUES (7,1);INSERT INTO `join_cemetery` VALUES (8,1);INSERT INTO `join_cemetery` VALUES (9,1);INSERT INTO `join_cemetery` VALUES (10,1);INSERT INTO `join_cemetery` VALUES (11,1);INSERT INTO `join_cemetery` VALUES (12,1);INSERT INTO `join_cemetery` VALUES (13,1);INSERT INTO `join_cemetery` VALUES (14,1);INSERT INTO `birth_day` VALUES (6,17);INSERT INTO `birth_day` VALUES (7,10);INSERT INTO `birth_day` VALUES (9,18);INSERT INTO `birth_day` VALUES (11,14);INSERT INTO `birth_day` VALUES (12,22);INSERT INTO `birth_month` VALUES (6,3);INSERT INTO `birth_month` VALUES (7,6);INSERT INTO `birth_month` VALUES (9,6);INSERT INTO `birth_month` VALUES (11,12);INSERT INTO `birth_month` VALUES (12,7);INSERT INTO `birth_year` VALUES (5,1843);INSERT INTO `birth_year` VALUES (6,1846);INSERT INTO `birth_year` VALUES (7,1859);INSERT INTO `birth_year` VALUES (9,1833);INSERT INTO `birth_year` VALUES (11,1840);INSERT INTO `birth_year` VALUES (12,1811);INSERT INTO `death_day` VALUES (0,23);INSERT INTO `death_day` VALUES (1,3);INSERT INTO `death_day` VALUES (2,28);INSERT INTO `death_day` VALUES (3,20);INSERT INTO `death_day` VALUES (4,3);INSERT INTO `death_day` VALUES (6,19);INSERT INTO `death_day` VALUES (7,30);INSERT INTO `death_day` VALUES (8,18);INSERT INTO `death_day` VALUES (9,27);INSERT INTO `death_day` VALUES (11,4);INSERT INTO `death_day` VALUES (12,25);INSERT INTO `death_day` VALUES (13,7);INSERT INTO `death_day` VALUES (14,24);INSERT INTO `death_month` VALUES (0,4);INSERT INTO `death_month` VALUES (1,1);INSERT INTO `death_month` VALUES (2,5);INSERT INTO `death_month` VALUES (3,10);INSERT INTO `death_month` VALUES (4,6);INSERT INTO `death_month` VALUES (6,7);INSERT INTO `death_month` VALUES (7,10);INSERT INTO `death_month` VALUES (8,11);INSERT INTO `death_month` VALUES (9,6);INSERT INTO `death_month` VALUES (11,4);INSERT INTO `death_month` VALUES (12,2);INSERT INTO `death_month` VALUES (13,7);INSERT INTO `death_month` VALUES (14,12);INSERT INTO `death_year` VALUES (0,1868);INSERT INTO `death_year` VALUES (1,1872);INSERT INTO `death_year` VALUES (2,1884);INSERT INTO `death_year` VALUES (3,1885);INSERT INTO `death_year` VALUES (4,1864);INSERT INTO `death_year` VALUES (5,1908);INSERT INTO `death_year` VALUES (6,1864);INSERT INTO `death_year` VALUES (7,1952);INSERT INTO `death_year` VALUES (8,1873);INSERT INTO `death_year` VALUES (9,1913);INSERT INTO `death_year` VALUES (11,1867);INSERT INTO `death_year` VALUES (12,1906);INSERT INTO `death_year` VALUES (13,1864);INSERT INTO `death_year` VALUES (14,1862);INSERT INTO `military_stone_inscription` VALUES (1,"Co. K.1st Mass. Cav.");INSERT INTO `military_stone_inscription` VALUES (3,"Soldier at rest");INSERT INTO `military_stone_inscription` VALUES (5,"Civil War Veteran");INSERT INTO `military_stone_inscription` VALUES (6,"This soldier rests");INSERT INTO `military_stone_inscription` VALUES (10,"U.S. Navy");INSERT INTO `military_stone_inscription` VALUES (11,"19 Reg. Band M.V.M");INSERT INTO `military_stone_inscription` VALUES (12,"Master Mariner");INSERT INTO `military_stone_inscription` VALUES (13,"Co. C. 4th Reg. Mass Cavalry");INSERT INTO `location_in_cemetery` VALUES (0,"Cedar 241");INSERT INTO `location_in_cemetery` VALUES (1,"Locust 196-4");INSERT INTO `location_in_cemetery` VALUES (2,"Cedar 151-4");INSERT INTO `location_in_cemetery` VALUES (3,"Sycamore 304");INSERT INTO `location_in_cemetery` VALUES (4,"Pine 144B-2");INSERT INTO `location_in_cemetery` VALUES (5,"Cedar 224-8");INSERT INTO `location_in_cemetery` VALUES (6,"Linden 171-4");INSERT INTO `location_in_cemetery` VALUES (7,"Vine 457-1");INSERT INTO `location_in_cemetery` VALUES (8,"Locust 186-4");INSERT INTO `location_in_cemetery` VALUES (9,"Chestnut 309");INSERT INTO `location_in_cemetery` VALUES (10,"Locust 186-1");INSERT INTO `location_in_cemetery` VALUES (11,"Walnut 445-5");INSERT INTO `location_in_cemetery` VALUES (12,"Walnut 445-5");INSERT INTO `location_in_cemetery` VALUES (13,"Sycamore 294");INSERT INTO `location_in_cemetery` VALUES (14,"Walnut 358");INSERT INTO `notes` VALUES (0,"Died Aged 32 years, 11 months.28 days");INSERT INTO `notes` VALUES (1,"Died AE 53 yrs. 7 mo");INSERT INTO `notes` VALUES (2,"Died Aged 21 yrs. 1 mo. 14 days");INSERT INTO `notes` VALUES (3,"Died Aged 44 Years");INSERT INTO `notes` VALUES (4,"Was killed at the battle of Shady Grove Church VA. Aged 30 yrs, 9m's, 28 d's");INSERT INTO `notes` VALUES (8,"Died Aged 21 yrs. 11 mo");INSERT INTO `notes` VALUES (13,"Died aged 18 yrs");INSERT INTO `notes` VALUES (14,"Died aged 28 yrs, 8 mos.");INSERT INTO `father_name` VALUES (0,"William");INSERT INTO `father_name` VALUES (2,"Benjamin");INSERT INTO `father_name` VALUES (13,"Levi");INSERT INTO `mother_name` VALUES (0,"Hannah");INSERT INTO `mother_name` VALUES (2,"Catherine");INSERT INTO `spouse_name` VALUES (4,"Elizabeth C.");INSERT INTO `spouse_name` VALUES (7,"Mary E.");INSERT INTO `spouse_name` VALUES (9,"Caroline Tillson");INSERT INTO `spouse_name` VALUES (12,"Judith J. Cole");