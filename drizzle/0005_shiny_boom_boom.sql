CREATE TABLE `userFeedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`rating` int NOT NULL,
	`comment` text,
	`userAgent` varchar(500),
	`region` varchar(50),
	`language` varchar(10),
	`appVersion` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userFeedback_id` PRIMARY KEY(`id`)
);
