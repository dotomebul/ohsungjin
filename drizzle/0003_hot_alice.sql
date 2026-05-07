CREATE TABLE `emailUsers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`phoneNumber` varchar(20),
	`region` enum('us','eu','kr','jp') NOT NULL DEFAULT 'us',
	`locationSharingEnabled` boolean DEFAULT false,
	`lastKnownLat` decimal(10,8),
	`lastKnownLng` decimal(11,8),
	`lastLocationUpdate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailUsers_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailUsers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `familyInvites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inviterId` int NOT NULL,
	`inviterEmail` varchar(320) NOT NULL,
	`inviterName` varchar(255) NOT NULL,
	`token` varchar(64) NOT NULL,
	`nickname` varchar(100),
	`relationship` varchar(100),
	`expiresAt` timestamp NOT NULL,
	`usedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `familyInvites_id` PRIMARY KEY(`id`),
	CONSTRAINT `familyInvites_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `familyRelations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`familyUserId` int NOT NULL,
	`nickname` varchar(100),
	`relationship` varchar(100),
	`status` enum('pending','accepted','rejected') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `familyRelations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `locationShareLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(64) NOT NULL,
	`lat` decimal(10,8) NOT NULL,
	`lng` decimal(11,8) NOT NULL,
	`recipientPhone` varchar(20),
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `locationShareLinks_id` PRIMARY KEY(`id`),
	CONSTRAINT `locationShareLinks_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `realtimeLocations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lat` decimal(10,8) NOT NULL,
	`lng` decimal(11,8) NOT NULL,
	`accuracy` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `realtimeLocations_id` PRIMARY KEY(`id`),
	CONSTRAINT `realtimeLocations_userId_unique` UNIQUE(`userId`)
);
