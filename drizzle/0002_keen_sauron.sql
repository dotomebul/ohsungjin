ALTER TABLE `activeAlerts` MODIFY COLUMN `region` enum('us','eu','kr','jp') NOT NULL;--> statement-breakpoint
ALTER TABLE `activeAlerts` MODIFY COLUMN `severity` enum('low','medium','high','critical','warning','info') DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `region` enum('us','eu','kr','jp') NOT NULL DEFAULT 'us';