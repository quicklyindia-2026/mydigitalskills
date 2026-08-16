import mysql from "mysql2/promise";
if (!process.env.DATABASE_URL) process.exit(0);
const db = await mysql.createConnection(process.env.DATABASE_URL);
const now = new Date().toISOString();
const courses = [
  ["course-word","microsoft-word-mastery","Microsoft Word Mastery","Create professional documents, resumes and business files.","Beginner",0],
  ["course-excel","microsoft-excel-mastery","Microsoft Excel Mastery","Learn formulas, reports, dashboards and productivity workflows.","Beginner",0],
  ["course-powerpoint","powerpoint-presentation-mastery","PowerPoint Presentation Mastery","Build clear, professional and persuasive presentations.","Beginner",0],
  ["course-ai","ai-tools-for-business","AI Tools for Business","Use practical AI tools for content, productivity and business growth.","Beginner",0],
  ["course-meta","meta-ads-performance-marketing","Meta Ads & Performance Marketing","Plan, launch and optimize Facebook and Instagram advertising.","Intermediate",4999],
  ["course-gmb","google-business-profile-growth","Google Business Profile Growth","Improve local visibility, reviews and customer discovery.","Beginner",1999],
  ["course-dm","digital-marketing-foundation","Digital Marketing Foundation","A structured foundation across websites, content, ads and analytics.","Beginner",2999]
];
for (const c of courses) await db.execute("INSERT IGNORE INTO courses (id,slug,title,description,level,price_inr,pass_score,certificate_enabled,status,created_at) VALUES (?,?,?,?,?,?,70,1,'published',?)", [...c, now]);
await db.end();
