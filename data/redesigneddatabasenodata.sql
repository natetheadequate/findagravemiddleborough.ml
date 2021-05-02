SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `birth_day` (
  `id` tinyint(4) DEFAULT NULL,
  `birth_day` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `birth_month` (
  `id` tinyint(4) DEFAULT NULL,
  `birth_month` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `birth_year` (
  `id` tinyint(4) DEFAULT NULL,
  `birth_year` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `branches` (
  `i` int(11) NOT NULL,
  `branch` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cemeteries` (
  `i` int(11) NOT NULL,
  `cemetery` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cenotaphs` (
  `id` tinyint(4) DEFAULT NULL,
  `cenotaphs` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `count` (
  `id` tinyint(4) DEFAULT NULL,
  `count` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `death_day` (
  `id` tinyint(4) DEFAULT NULL,
  `death_day` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `death_month` (
  `id` tinyint(4) DEFAULT NULL,
  `death_month` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `death_year` (
  `id` tinyint(4) DEFAULT NULL,
  `death_year` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `entry_day` (
  `id` tinyint(4) DEFAULT NULL,
  `entry_day` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `entry_month` (
  `id` tinyint(4) DEFAULT NULL,
  `entry_month` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `entry_year` (
  `id` tinyint(4) DEFAULT NULL,
  `entry_year` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exit_day` (
  `id` tinyint(4) DEFAULT NULL,
  `exit_day` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exit_month` (
  `id` tinyint(4) DEFAULT NULL,
  `exit_month` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exit_year` (
  `id` tinyint(4) DEFAULT NULL,
  `exit_year` tinyint(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `father_name` (
  `id` tinyint(4) DEFAULT NULL,
  `father_name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `find_a_grave_memorial_number` (
  `id` tinyint(4) DEFAULT NULL,
  `find_a_grave_memorial_number` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `id_join_birth_place` (
  `id` int(11) NOT NULL DEFAULT '0',
  `i` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `id_join_branch` (
  `id` int(11) NOT NULL DEFAULT '0',
  `i` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `id_join_cemetery` (
  `id` int(11) NOT NULL DEFAULT '0',
  `i` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `id_join_first_name` (
  `id` int(11) NOT NULL DEFAULT '0',
  `i` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `id_join_last_name` (
  `id` int(11) NOT NULL DEFAULT '0',
  `i` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `id_join_location_in_cemetery` (
  `id` int(11) NOT NULL DEFAULT '0',
  `i` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `id_join_maiden_name` (
  `id` int(11) NOT NULL DEFAULT '0',
  `i` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `id_join_medallion` (
  `id` int(11) NOT NULL DEFAULT '0',
  `i` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `id_join_middle_name` (
  `id` int(11) NOT NULL DEFAULT '0',
  `i` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `id_join_prefix` (
  `id` int(11) NOT NULL DEFAULT '0',
  `i` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `id_join_rank` (
  `id` int(11) NOT NULL DEFAULT '0',
  `i` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `id_join_suffix` (
  `id` int(11) NOT NULL DEFAULT '0',
  `i` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `id_join_war` (
  `id` int(11) NOT NULL DEFAULT '0',
  `i` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `locations_in_cemeteries` (
  `i` int(11) NOT NULL,
  `location_in_cemetery` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `medallions` (
  `i` int(11) NOT NULL,
  `medallion` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `mother_name` (
  `id` tinyint(4) DEFAULT NULL,
  `mother_name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `names` (
  `i` int(11) NOT NULL,
  `name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `notes` (
  `id` tinyint(4) DEFAULT NULL,
  `notes` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `places` (
  `i` int(11) NOT NULL,
  `place` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `prefixes` (
  `i` int(11) NOT NULL,
  `prefix` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ranks` (
  `i` int(11) NOT NULL,
  `rank` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `records_checked` (
  `id` tinyint(4) DEFAULT NULL,
  `records_checked` tinyint(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `resident_id` (
  `id` tinyint(4) DEFAULT NULL,
  `resident_id` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `service_number` (
  `id` tinyint(4) DEFAULT NULL,
  `service_number` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `spouse_name` (
  `id` tinyint(4) DEFAULT NULL,
  `spouse_name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `suffixes` (
  `i` int(11) NOT NULL,
  `suffix` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tests` (
  `i` int(11) NOT NULL,
  `test` varchar(250) CHARACTER SET utf8mb4 NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `unit` (
  `id` tinyint(4) DEFAULT NULL,
  `unit` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `veteran_status_verified` (
  `id` tinyint(4) DEFAULT NULL,
  `veteran_status_verified` tinyint(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `wars` (
  `i` int(11) NOT NULL,
  `war` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


ALTER TABLE `branches`
  ADD PRIMARY KEY (`i`),
  ADD UNIQUE KEY `i` (`i`),
  ADD UNIQUE KEY `branch` (`branch`);

ALTER TABLE `cemeteries`
  ADD PRIMARY KEY (`i`),
  ADD UNIQUE KEY `i` (`i`),
  ADD UNIQUE KEY `cemetery` (`cemetery`);

ALTER TABLE `id_join_birth_place`
  ADD PRIMARY KEY (`id`,`i`),
  ADD KEY `i` (`i`);

ALTER TABLE `id_join_branch`
  ADD PRIMARY KEY (`id`,`i`),
  ADD KEY `i` (`i`);

ALTER TABLE `id_join_cemetery`
  ADD PRIMARY KEY (`id`,`i`),
  ADD KEY `i` (`i`);

ALTER TABLE `id_join_first_name`
  ADD PRIMARY KEY (`id`,`i`),
  ADD KEY `i` (`i`);

ALTER TABLE `id_join_last_name`
  ADD PRIMARY KEY (`id`,`i`),
  ADD KEY `i` (`i`);

ALTER TABLE `id_join_location_in_cemetery`
  ADD PRIMARY KEY (`id`,`i`),
  ADD KEY `i` (`i`);

ALTER TABLE `id_join_maiden_name`
  ADD PRIMARY KEY (`id`,`i`),
  ADD KEY `i` (`i`);

ALTER TABLE `id_join_medallion`
  ADD PRIMARY KEY (`id`,`i`),
  ADD KEY `i` (`i`);

ALTER TABLE `id_join_middle_name`
  ADD PRIMARY KEY (`id`,`i`),
  ADD KEY `i` (`i`);

ALTER TABLE `id_join_prefix`
  ADD PRIMARY KEY (`id`,`i`),
  ADD KEY `i` (`i`);

ALTER TABLE `id_join_rank`
  ADD PRIMARY KEY (`id`,`i`),
  ADD KEY `i` (`i`);

ALTER TABLE `id_join_suffix`
  ADD PRIMARY KEY (`id`,`i`),
  ADD KEY `i` (`i`);

ALTER TABLE `id_join_war`
  ADD PRIMARY KEY (`id`,`i`),
  ADD KEY `i` (`i`);

ALTER TABLE `locations_in_cemeteries`
  ADD PRIMARY KEY (`i`),
  ADD UNIQUE KEY `i` (`i`),
  ADD UNIQUE KEY `location_in_cemetery` (`location_in_cemetery`);

ALTER TABLE `medallions`
  ADD PRIMARY KEY (`i`),
  ADD UNIQUE KEY `i` (`i`),
  ADD UNIQUE KEY `medallion` (`medallion`);

ALTER TABLE `names`
  ADD PRIMARY KEY (`i`),
  ADD UNIQUE KEY `i` (`i`),
  ADD UNIQUE KEY `name` (`name`);

ALTER TABLE `places`
  ADD PRIMARY KEY (`i`),
  ADD UNIQUE KEY `i` (`i`),
  ADD UNIQUE KEY `place` (`place`);

ALTER TABLE `prefixes`
  ADD PRIMARY KEY (`i`),
  ADD UNIQUE KEY `i` (`i`),
  ADD UNIQUE KEY `prefix` (`prefix`);

ALTER TABLE `ranks`
  ADD PRIMARY KEY (`i`),
  ADD UNIQUE KEY `i` (`i`),
  ADD UNIQUE KEY `rank` (`rank`);

ALTER TABLE `suffixes`
  ADD PRIMARY KEY (`i`),
  ADD UNIQUE KEY `i` (`i`),
  ADD UNIQUE KEY `suffix` (`suffix`);

ALTER TABLE `tests`
  ADD PRIMARY KEY (`i`),
  ADD UNIQUE KEY `test` (`test`);

ALTER TABLE `wars`
  ADD PRIMARY KEY (`i`),
  ADD UNIQUE KEY `i` (`i`),
  ADD UNIQUE KEY `war` (`war`);


ALTER TABLE `branches`
  MODIFY `i` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cemeteries`
  MODIFY `i` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `locations_in_cemeteries`
  MODIFY `i` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `medallions`
  MODIFY `i` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `names`
  MODIFY `i` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `places`
  MODIFY `i` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `prefixes`
  MODIFY `i` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `ranks`
  MODIFY `i` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `suffixes`
  MODIFY `i` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `wars`
  MODIFY `i` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
