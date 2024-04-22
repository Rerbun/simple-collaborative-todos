CREATE TABLE `todos` (
	`id` text PRIMARY KEY NOT NULL,
	`parentId` text,
	`status` text NOT NULL,
	`title` text,
	`index` integer,
	FOREIGN KEY (`parentId`) REFERENCES `todos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `todos_id_unique` ON `todos` (`id`);