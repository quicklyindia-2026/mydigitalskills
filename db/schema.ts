import { boolean, int, mysqlTable, text, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const courses = mysqlTable("courses", {
  id: varchar("id", { length: 36 }).primaryKey(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull().default("Beginner"),
  coverImage: text("cover_image"),
  ebookUrl: text("ebook_url"),
  priceInr: int("price_inr").notNull().default(0),
  passScore: int("pass_score").notNull().default(70),
  certificateEnabled: boolean("certificate_enabled").notNull().default(true),
  status: text("status").notNull().default("draft"),
  createdAt: text("created_at").notNull(),
});

export const courseSections = mysqlTable("course_sections", {
  id: varchar("id", { length: 36 }).primaryKey(),
  courseId: varchar("course_id", { length: 36 }).notNull().references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(), description: text("description"),
  sortOrder: int("sort_order").notNull().default(1), createdAt: text("created_at").notNull(),
});

export const lessons = mysqlTable("lessons", {
  id: varchar("id", { length: 36 }).primaryKey(),
  courseId: varchar("course_id", { length: 36 }).notNull().references(() => courses.id, { onDelete: "cascade" }),
  sectionId: varchar("section_id", { length: 36 }).references(() => courseSections.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  lessonType: text("lesson_type").notNull().default("video"),
  contentUrl: text("content_url"),
  notes: text("notes"),
  durationMinutes: int("duration_minutes").notNull().default(0),
  sortOrder: int("sort_order").notNull().default(1),
  isPreview: boolean("is_preview").notNull().default(false),
  createdAt: text("created_at").notNull(),
});

export const studentProfiles = mysqlTable("student_profiles", {
  accountEmail: varchar("account_email", { length: 191 }).primaryKey(), fullName: text("full_name").notNull(),
  mobile: text("mobile").notNull(), contactEmail: text("contact_email").notNull(), city: text("city"),
  createdAt: text("created_at").notNull(), updatedAt: text("updated_at").notNull(),
});

export const orders = mysqlTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userEmail: text("user_email").notNull(),
  courseId: varchar("course_id", { length: 36 }).notNull().references(() => courses.id),
  amountInr: int("amount_inr").notNull(),
  currency: text("currency").notNull().default("INR"),
  paymentProvider: text("payment_provider").notNull().default("not_connected"),
  providerOrderId: text("provider_order_id"),
  providerPaymentId: text("provider_payment_id"),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
});

export const enrollments = mysqlTable("enrollments", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userEmail: text("user_email").notNull(),
  courseId: varchar("course_id", { length: 36 }).notNull().references(() => courses.id, { onDelete: "cascade" }),
  orderId: varchar("order_id", { length: 36 }).references(() => orders.id),
  status: text("status").notNull().default("active"),
  progressPercent: int("progress_percent").notNull().default(0),
  enrolledAt: text("enrolled_at").notNull(),
}, (table) => [uniqueIndex("enrollment_user_course_idx").on(table.userEmail, table.courseId)]);

export const lessonProgress = mysqlTable("lesson_progress", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userEmail: text("user_email").notNull(),
  lessonId: varchar("lesson_id", { length: 36 }).notNull().references(() => lessons.id, { onDelete: "cascade" }),
  completed: boolean("completed").notNull().default(false),
  updatedAt: text("updated_at").notNull(),
}, (table) => [uniqueIndex("progress_user_lesson_idx").on(table.userEmail, table.lessonId)]);

export const quizQuestions = mysqlTable("quiz_questions", {
  id: varchar("id", { length: 36 }).primaryKey(), courseId: varchar("course_id", { length: 36 }).notNull().references(() => courses.id, { onDelete: "cascade" }),
  question: text("question").notNull(), optionA: text("option_a").notNull(), optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(), optionD: text("option_d").notNull(), correctOption: text("correct_option").notNull(),
  explanation: text("explanation"), sortOrder: int("sort_order").notNull().default(1), createdAt: text("created_at").notNull(),
});

export const quizAttempts = mysqlTable("quiz_attempts", {
  id: varchar("id", { length: 36 }).primaryKey(), userEmail: text("user_email").notNull(),
  courseId: varchar("course_id", { length: 36 }).notNull().references(() => courses.id, { onDelete: "cascade" }),
  answersJson: text("answers_json").notNull(), score: int("score").notNull(),
  passed: boolean("passed").notNull().default(false), createdAt: text("created_at").notNull(),
});

export const certificates = mysqlTable("certificates", {
  id: varchar("id", { length: 36 }).primaryKey(), certificateNo: varchar("certificate_no", { length: 64 }).notNull().unique(), userEmail: text("user_email").notNull(),
  courseId: varchar("course_id", { length: 36 }).notNull().references(() => courses.id, { onDelete: "cascade" }), studentName: text("student_name").notNull(),
  certificateType: text("certificate_type").notNull(), score: int("score").notNull(), issuedAt: text("issued_at").notNull(),
}, (table) => [uniqueIndex("certificate_user_course_idx").on(table.userEmail, table.courseId)]);

export const paymentSettings = mysqlTable("payment_settings", {
  id: varchar("id", { length: 36 }).primaryKey(), provider: text("provider").notNull().default("manual"), mode: text("mode").notNull().default("test"),
  publicKey: text("public_key"), merchantLabel: text("merchant_label").notNull().default("MyDigitalSkills"),
  enabled: boolean("enabled").notNull().default(false), updatedAt: text("updated_at").notNull(),
});

export const enquiries = mysqlTable("enquiries", {
  id: varchar("id", { length: 36 }).primaryKey(), name: text("name").notNull(), phone: text("phone").notNull(),
  email: text("email"), business: text("business"), service: text("service").notNull(), message: text("message"),
  source: text("source").notNull().default("website"), status: text("status").notNull().default("new"),
  notes: text("notes"), createdAt: text("created_at").notNull(), updatedAt: text("updated_at").notNull(),
});

export const blogPosts = mysqlTable("blog_posts", {
  id: varchar("id", { length: 36 }).primaryKey(), slug: varchar("slug", { length: 191 }).notNull().unique(), title: text("title").notNull(),
  excerpt: text("excerpt").notNull(), content: text("content").notNull(), category: text("category").notNull(),
  coverImage: text("cover_image"), seoTitle: text("seo_title"), seoDescription: text("seo_description"),
  status: text("status").notNull().default("draft"), createdAt: text("created_at").notNull(), updatedAt: text("updated_at").notNull(),
});

export const portfolioItems = mysqlTable("portfolio_items", {
  id: varchar("id", { length: 36 }).primaryKey(), sector: text("sector").notNull(), title: text("title").notNull(),
  description: text("description").notNull(), workJson: text("work_json").notNull().default("[]"),
  imageUrl: text("image_url"), projectUrl: text("project_url"), sortOrder: int("sort_order").notNull().default(1),
  status: text("status").notNull().default("published"), createdAt: text("created_at").notNull(), updatedAt: text("updated_at").notNull(),
});

export const siteContent = mysqlTable("site_content", {
  key: varchar("key", { length: 191 }).primaryKey(), label: text("label").notNull(), value: text("value").notNull(),
  type: text("type").notNull().default("text"), updatedAt: text("updated_at").notNull(),
});

export const accounts = mysqlTable("accounts", {
  email: varchar("email", { length: 191 }).primaryKey(),
  fullName: text("full_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 32 }).notNull().default("student"),
  createdAt: text("created_at").notNull(),
});

export const sessions = mysqlTable("sessions", {
  token: varchar("token", { length: 128 }).primaryKey(),
  accountEmail: varchar("account_email", { length: 191 }).notNull().references(() => accounts.email, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull(),
});
