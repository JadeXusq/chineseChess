/*
Navicat MySQL Data Transfer

Source Server         : 3306
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : rank

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2017-11-29 15:48:06
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for rank
-- ----------------------------
DROP TABLE IF EXISTS `rank`;
CREATE TABLE `rank` (
  `username` varchar(255) NOT NULL,
  `num` int(10) unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of rank
-- ----------------------------
