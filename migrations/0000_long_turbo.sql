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
	`id` text,
	`status` text NOT NULL,
	`title` text,
	FOREIGN KEY (`id`) REFERENCES `todos`(`id`) ON UPDATE no action ON DELETE no action
);
