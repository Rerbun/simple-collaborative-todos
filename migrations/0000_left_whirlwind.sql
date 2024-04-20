CREATE TABLE `todo_changes` (
	`property` text NOT NULL,
	`old_value` text NOT NULL,
	`new_value` text NOT NULL,
	`id` text NOT NULL,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`id`) REFERENCES `todos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `todos` (
	`id` text PRIMARY KEY NOT NULL,
	`parentId` text,
	`status` text NOT NULL,
	`title` text,
	FOREIGN KEY (`parentId`) REFERENCES `todos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `todos_id_unique` ON `todos` (`id`);