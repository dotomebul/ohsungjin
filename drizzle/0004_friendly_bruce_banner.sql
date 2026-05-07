CREATE TABLE `familyInviteCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`code` varchar(6) NOT NULL,
	`inviteePhone` varchar(20) NOT NULL,
	`nickname` varchar(100),
	`relationship` varchar(100),
	`status` enum('pending','accepted','expired') DEFAULT 'pending',
	`expiresAt` timestamp NOT NULL,
	`acceptedAt` timestamp,
	`acceptedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `familyInviteCodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `familyInviteCodes_code_unique` UNIQUE(`code`)
);
