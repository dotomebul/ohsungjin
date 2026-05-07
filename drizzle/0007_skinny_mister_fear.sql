CREATE TABLE `meetingPoints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`lat` decimal(10,8) NOT NULL,
	`lng` decimal(11,8) NOT NULL,
	`address` text,
	`description` text,
	`familyMemberIds` json,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `meetingPoints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `polandWarShelters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`city` varchar(100) NOT NULL,
	`type` enum('metro','bunker','basement','cave','other') NOT NULL,
	`lat` decimal(10,8) NOT NULL,
	`lng` decimal(11,8) NOT NULL,
	`address` text,
	`capacity` int NOT NULL,
	`currentOccupancy` int DEFAULT 0,
	`depth` int,
	`amenities` json,
	`phoneNumber` varchar(20),
	`website` varchar(500),
	`operatingHours` varchar(100),
	`accessibilityInfo` text,
	`isOpen` boolean DEFAULT true,
	`isVerified` boolean DEFAULT false,
	`source` varchar(100),
	`lastUpdatedBy` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `polandWarShelters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trafficInfo` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lat` decimal(10,8) NOT NULL,
	`lng` decimal(11,8) NOT NULL,
	`congestionLevel` enum('smooth','normal','congested','severe','blocked') DEFAULT 'normal',
	`averageSpeed` int,
	`roadName` varchar(255),
	`city` varchar(100),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trafficInfo_id` PRIMARY KEY(`id`)
);
