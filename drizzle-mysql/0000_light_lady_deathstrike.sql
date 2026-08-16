CREATE TABLE `accounts` (
	`email` varchar(191) NOT NULL,
	`full_name` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` varchar(32) NOT NULL DEFAULT 'student',
	`created_at` text NOT NULL,
	CONSTRAINT `accounts_email` PRIMARY KEY(`email`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`category` text NOT NULL,
	`cover_image` text,
	`seo_title` text,
	`seo_description` text,
	`status` text NOT NULL DEFAULT ('draft'),
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` varchar(36) NOT NULL,
	`certificate_no` varchar(64) NOT NULL,
	`user_email` text NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`student_name` text NOT NULL,
	`certificate_type` text NOT NULL,
	`score` int NOT NULL,
	`issued_at` text NOT NULL,
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_certificate_no_unique` UNIQUE(`certificate_no`),
	CONSTRAINT `certificate_user_course_idx` UNIQUE(`user_email`,`course_id`)
);
--> statement-breakpoint
CREATE TABLE `course_sections` (
	`id` varchar(36) NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`sort_order` int NOT NULL DEFAULT 1,
	`created_at` text NOT NULL,
	CONSTRAINT `course_sections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`level` text NOT NULL DEFAULT ('Beginner'),
	`cover_image` text,
	`ebook_url` text,
	`price_inr` int NOT NULL DEFAULT 0,
	`pass_score` int NOT NULL DEFAULT 70,
	`certificate_enabled` boolean NOT NULL DEFAULT true,
	`status` text NOT NULL DEFAULT ('draft'),
	`created_at` text NOT NULL,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `courses_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`business` text,
	`service` text NOT NULL,
	`message` text,
	`source` text NOT NULL DEFAULT ('website'),
	`status` text NOT NULL DEFAULT ('new'),
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `enquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` varchar(36) NOT NULL,
	`user_email` text NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`order_id` varchar(36),
	`status` text NOT NULL DEFAULT ('active'),
	`progress_percent` int NOT NULL DEFAULT 0,
	`enrolled_at` text NOT NULL,
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`),
	CONSTRAINT `enrollment_user_course_idx` UNIQUE(`user_email`,`course_id`)
);
--> statement-breakpoint
CREATE TABLE `lesson_progress` (
	`id` varchar(36) NOT NULL,
	`user_email` text NOT NULL,
	`lesson_id` varchar(36) NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`updated_at` text NOT NULL,
	CONSTRAINT `lesson_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `progress_user_lesson_idx` UNIQUE(`user_email`,`lesson_id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` varchar(36) NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`section_id` varchar(36),
	`title` text NOT NULL,
	`lesson_type` text NOT NULL DEFAULT ('video'),
	`content_url` text,
	`notes` text,
	`duration_minutes` int NOT NULL DEFAULT 0,
	`sort_order` int NOT NULL DEFAULT 1,
	`is_preview` boolean NOT NULL DEFAULT false,
	`created_at` text NOT NULL,
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` varchar(36) NOT NULL,
	`user_email` text NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`amount_inr` int NOT NULL,
	`currency` text NOT NULL DEFAULT ('INR'),
	`payment_provider` text NOT NULL DEFAULT ('not_connected'),
	`provider_order_id` text,
	`provider_payment_id` text,
	`status` text NOT NULL DEFAULT ('pending'),
	`created_at` text NOT NULL,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_settings` (
	`id` varchar(36) NOT NULL,
	`provider` text NOT NULL DEFAULT ('manual'),
	`mode` text NOT NULL DEFAULT ('test'),
	`public_key` text,
	`merchant_label` text NOT NULL DEFAULT ('MyDigitalSkills'),
	`enabled` boolean NOT NULL DEFAULT false,
	`updated_at` text NOT NULL,
	CONSTRAINT `payment_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_items` (
	`id` varchar(36) NOT NULL,
	`sector` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`work_json` text NOT NULL DEFAULT ('[]'),
	`image_url` text,
	`project_url` text,
	`sort_order` int NOT NULL DEFAULT 1,
	`status` text NOT NULL DEFAULT ('published'),
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `portfolio_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` varchar(36) NOT NULL,
	`user_email` text NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`answers_json` text NOT NULL,
	`score` int NOT NULL,
	`passed` boolean NOT NULL DEFAULT false,
	`created_at` text NOT NULL,
	CONSTRAINT `quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_questions` (
	`id` varchar(36) NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`question` text NOT NULL,
	`option_a` text NOT NULL,
	`option_b` text NOT NULL,
	`option_c` text NOT NULL,
	`option_d` text NOT NULL,
	`correct_option` text NOT NULL,
	`explanation` text,
	`sort_order` int NOT NULL DEFAULT 1,
	`created_at` text NOT NULL,
	CONSTRAINT `quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`token` varchar(128) NOT NULL,
	`account_email` varchar(191) NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	CONSTRAINT `sessions_token` PRIMARY KEY(`token`)
);
--> statement-breakpoint
CREATE TABLE `site_content` (
	`key` varchar(191) NOT NULL,
	`label` text NOT NULL,
	`value` text NOT NULL,
	`type` text NOT NULL DEFAULT ('text'),
	`updated_at` text NOT NULL,
	CONSTRAINT `site_content_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `student_profiles` (
	`account_email` varchar(191) NOT NULL,
	`full_name` text NOT NULL,
	`mobile` text NOT NULL,
	`contact_email` text NOT NULL,
	`city` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `student_profiles_account_email` PRIMARY KEY(`account_email`)
);
--> statement-breakpoint
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_sections` ADD CONSTRAINT `course_sections_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lesson_progress` ADD CONSTRAINT `lesson_progress_lesson_id_lessons_id_fk` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_section_id_course_sections_id_fk` FOREIGN KEY (`section_id`) REFERENCES `course_sections`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_attempts` ADD CONSTRAINT `quiz_attempts_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_account_email_accounts_email_fk` FOREIGN KEY (`account_email`) REFERENCES `accounts`(`email`) ON DELETE cascade ON UPDATE no action;