CREATE TABLE `activeAlerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`disasterTypeId` int NOT NULL,
	`region` enum('us','eu') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`severity` enum('low','medium','high','critical') DEFAULT 'medium',
	`centerLat` decimal(10,8),
	`centerLng` decimal(11,8),
	`radiusKm` int,
	`status` enum('active','resolved','escalated') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`resolvedAt` timestamp,
	CONSTRAINT `activeAlerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `disasterGuidelines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`disasterTypeId` int NOT NULL,
	`immediateActions` text,
	`evacuationSteps` text,
	`safetyTips` text,
	`whatToBring` text,
	`emergencyNumber` varchar(20),
	`helplineNumber` varchar(20),
	`riskLevel` enum('Low','Medium','High') DEFAULT 'Medium',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `disasterGuidelines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `disasterTypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`icon` varchar(10),
	`region` enum('us','eu','global') DEFAULT 'global',
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `disasterTypes_id` PRIMARY KEY(`id`),
	CONSTRAINT `disasterTypes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `emergencyContacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`email` varchar(320),
	`relationship` varchar(100),
	`isPrimary` boolean DEFAULT false,
	`isLocationShared` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emergencyContacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locationSharing` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`friendId` int NOT NULL,
	`lat` decimal(10,8) NOT NULL,
	`lng` decimal(11,8) NOT NULL,
	`accuracy` int,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `locationSharing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shelters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('evacuation_center','bunker','basement','public_building','other'),
	`lat` decimal(10,8) NOT NULL,
	`lng` decimal(11,8) NOT NULL,
	`address` text,
	`capacity` int,
	`currentOccupancy` int DEFAULT 0,
	`phoneNumber` varchar(20),
	`website` varchar(500),
	`amenities` text,
	`isOpen` boolean DEFAULT true,
	`region` enum('us','eu') NOT NULL,
	`source` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shelters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `smsLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`recipientPhoneNumber` varchar(20) NOT NULL,
	`messageType` enum('safety_check','sos_alert','location_share','info'),
	`messageContent` text,
	`status` enum('pending','sent','failed','delivered') DEFAULT 'pending',
	`errorMessage` text,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`sentAt` timestamp,
	CONSTRAINT `smsLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userActivityLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`details` text,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userActivityLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phoneNumber` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `region` enum('us','eu') DEFAULT 'us' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastKnownLat` decimal(10,8);--> statement-breakpoint
ALTER TABLE `users` ADD `lastKnownLng` decimal(11,8);--> statement-breakpoint
ALTER TABLE `users` ADD `lastLocationUpdate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `locationSharingEnabled` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `locationUpdateInterval` int DEFAULT 30;--> statement-breakpoint
ALTER TABLE `users` ADD `notificationsEnabled` boolean DEFAULT true;