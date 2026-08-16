import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { enrollments, orders, studentProfiles } from "@/db/schema";
import { getCourseBySlug } from "@/lib/lms";
export async function POST(request: Request) {
 const user=await getChatGPTUser(); if(!user)return NextResponse.json({error:"Please sign in first."},{status:401}); const body=await request.json().catch(()=>({}));
 const fullName=String(body.fullName||"").trim(),mobile=String(body.mobile||"").trim(),contactEmail=String(body.contactEmail||"").trim().toLowerCase(); if(!fullName||mobile.length<10||!contactEmail.includes("@"))return NextResponse.json({error:"Name, valid mobile and email are required."},{status:400});
 const course=await getCourseBySlug(String(body.slug||"")); if(!course)return NextResponse.json({error:"Course not found."},{status:404}); const db=getDb(),now=new Date().toISOString(),accountEmail=user.email.toLowerCase();
 await db.insert(studentProfiles).values({accountEmail,fullName,mobile,contactEmail,city:String(body.city||""),createdAt:now,updatedAt:now}).onDuplicateKeyUpdate({set:{fullName,mobile,contactEmail,city:String(body.city||""),updatedAt:now}});
 if(course.priceInr===0){await db.insert(enrollments).values({id:crypto.randomUUID(),userEmail:accountEmail,courseId:course.id,status:"active",progressPercent:0,enrolledAt:now}).onDuplicateKeyUpdate({set:{status:"active"}});return NextResponse.json({ok:true,message:"Free enrollment activated. Opening your classroom…",redirect:"/student/dashboard"});}
 const existing=(await db.select().from(orders).where(and(eq(orders.userEmail,accountEmail),eq(orders.courseId,course.id)))).find(o=>o.status==="pending"); const orderId=existing?.id||crypto.randomUUID(); if(!existing)await db.insert(orders).values({id:orderId,userEmail:accountEmail,courseId:course.id,amountInr:course.priceInr,currency:"INR",paymentProvider:"manual",status:"pending",createdAt:now});
 return NextResponse.json({ok:true,orderId,message:"Enrollment request saved securely. Payment confirmation will be available from your dashboard.",redirect:"/student/dashboard"});
}
