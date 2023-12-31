CREATE TABLE `bookmarks` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`userId` integer NOT NULL,
	`url` text NOT NULL,
	`title` text,
	`comment` text,
	`imageKey` text,
	`isProcessed` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookmarks_userId_url_unique` ON `bookmarks` (`userId`,`url`);