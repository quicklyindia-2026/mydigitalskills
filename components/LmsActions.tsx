"use client";

import { useState } from "react";

export function CheckoutRequest({ slug, name, email, free }: { slug: string; name: string; email: string; free: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function requestEnrollment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/lms/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug, fullName:form.get("fullName"),mobile:form.get("mobile"),contactEmail:form.get("contactEmail"),city:form.get("city") }) });
    const result = await response.json();
    if (!response.ok) { setState("error"); setMessage(result.error ?? "Something went wrong."); return; }
    setState("done");
    setMessage(result.message || `Enrollment request created. Order ID: ${result.orderId}`);
    if(result.whatsapp) window.open(result.whatsapp, "_blank", "noopener,noreferrer");
    if(result.redirect) window.location.href=result.redirect;
  }

  return <form className="checkout-action form-grid" onSubmit={requestEnrollment}><label className="field"><span>Full Name</span><input name="fullName" defaultValue={name} required /></label><label className="field"><span>Mobile Number</span><input name="mobile" type="tel" required /></label><label className="field"><span>Email ID</span><input name="contactEmail" type="email" defaultValue={email} required /></label><label className="field"><span>City</span><input name="city" /></label>
    <button className="button button-primary field full" disabled={state === "loading" || state === "done"}>{state === "loading" ? "Saving…" : state === "done" ? "Enrollment created" : free ? "Enroll Free & Start →" : "Continue Enrollment →"}</button>
    {message && <p className={state === "error" ? "form-error" : "form-success"}>{message}</p>}
  </form>;
}

export function QuizPanel({courseId,questions,passScore}:{courseId:string;questions:Array<{id:string;question:string;optionA:string;optionB:string;optionC:string;optionD:string}>;passScore:number}){const[result,setResult]=useState<{passed?:boolean;score?:number;certificateUrl?:string;error?:string}|null>(null);async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);const answers=Object.fromEntries(questions.map(q=>[q.id,f.get(q.id)]));const r=await fetch("/api/lms/quiz",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({courseId,answers})});setResult(await r.json());}return <div className="quiz-box"><h3>Final Quiz · Pass Score {passScore}%</h3><form onSubmit={submit}>{questions.map((q,i)=><fieldset key={q.id}><legend>{i+1}. {q.question}</legend>{(["A","B","C","D"] as const).map(x=><label key={x}><input required type="radio" name={q.id} value={x}/>{q[`option${x}`]}</label>)}</fieldset>)}<button className="button button-primary">Submit Quiz</button></form>{result&&<div className="quiz-result"><strong>{result.error|| (result.passed?`Passed: ${result.score}%`:`Score: ${result.score}% — Try again`)}</strong>{result.certificateUrl&&<a href={result.certificateUrl}>View Certificate →</a>}</div>}</div>}

export function PrintCertificateButton(){return <button className="button button-primary" onClick={()=>window.print()}>Download / Print Certificate</button>}

export function LessonProgressButton({ lessonId, completed }: { lessonId: string; completed: boolean }) {
  const [done, setDone] = useState(completed);
  const [busy, setBusy] = useState(false);
  async function toggle() {
    setBusy(true);
    const response = await fetch("/api/lms/progress", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lessonId, completed: !done }) });
    if (response.ok) { setDone(!done); window.location.reload(); }
    setBusy(false);
  }
  return <button className={`lesson-check ${done ? "done" : ""}`} onClick={toggle} disabled={busy}>{done ? "✓ Completed" : busy ? "Saving…" : "Mark complete"}</button>;
}

type CourseOption = { id: string; title: string };
type OrderRow = { id: string; userEmail: string; amountInr: number; status: string; courseTitle: string };

export function AdminLmsPanel({ courseOptions, pendingOrders }: { courseOptions: CourseOption[]; pendingOrders: OrderRow[] }) {
  const [message, setMessage] = useState("");

  async function sendJson(event: React.FormEvent<HTMLFormElement>, endpoint: string) {
    event.preventDefault();
    setMessage("Saving…");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.isPreview = form.get("isPreview") === "on" ? "true" : "";
    const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...payload, isPreview: payload.isPreview === "true" }) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? "Could not save."); return; }
    setMessage("Saved successfully.");
    window.location.reload();
  }

  async function uploadVideo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Uploading video…");
    const response = await fetch("/api/lms/admin/upload", { method: "POST", body: new FormData(event.currentTarget) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? "Upload failed."); return; }
    setMessage("Video lesson uploaded.");
    window.location.reload();
  }

  async function uploadCourseMedia(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Uploading course media…");
    const response = await fetch("/api/lms/admin/course-media", { method: "POST", body: new FormData(event.currentTarget) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? "Upload failed."); return; }
    setMessage("Course media uploaded.");
    window.location.reload();
  }

  async function approve(orderId: string) {
    setMessage("Activating enrollment…");
    const response = await fetch("/api/lms/admin/approve", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId }) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? "Could not approve order."); return; }
    setMessage("Payment marked received and student enrolled.");
    window.location.reload();
  }

  return <div className="admin-stack">
    {message && <div className="admin-message">{message}</div>}
    <section className="admin-card"><h2>Pending enrollment requests</h2>{pendingOrders.length ? <div className="admin-list">{pendingOrders.map((order) => <div className="admin-row" key={order.id}><div><strong>{order.courseTitle}</strong><span>{order.userEmail} · ₹{order.amountInr.toLocaleString("en-IN")} · {order.id}</span></div><button className="button button-primary" onClick={() => approve(order.id)}>Mark paid & enroll</button></div>)}</div> : <p>No pending requests.</p>}</section>

    <div className="admin-grid">
      <form className="admin-card form-grid" onSubmit={(event) => sendJson(event, "/api/lms/admin/courses")}><h2 className="field full">Create course</h2><label className="field"><span>Title</span><input name="title" required /></label><label className="field"><span>Slug</span><input name="slug" placeholder="course-name" required /></label><label className="field full"><span>Description</span><textarea name="description" required /></label><label className="field"><span>Level</span><input name="level" defaultValue="Beginner" /></label><label className="field"><span>Price (₹)</span><input name="priceInr" type="number" min="0" defaultValue="999" /></label><label className="field"><span>Cover image path</span><input name="coverImage" defaultValue="/images/learning-digital-skills.webp" /></label><label className="field"><span>eBook path</span><input name="ebookUrl" placeholder="/ebooks/guide.pdf" /></label><label className="field"><span>Status</span><select name="status"><option value="draft">Draft</option><option value="published">Published</option></select></label><button className="button button-dark field full">Create course</button></form>

      <form className="admin-card form-grid" onSubmit={(event) => sendJson(event, "/api/lms/admin/lessons")}><h2 className="field full">Add lesson or video link</h2><label className="field full"><span>Course</span><select name="courseId" required>{courseOptions.map((course) => <option value={course.id} key={course.id}>{course.title}</option>)}</select></label><label className="field full"><span>Lesson title</span><input name="title" required /></label><label className="field"><span>Type</span><select name="lessonType"><option value="video">Video URL</option><option value="ebook">eBook</option><option value="text">Text lesson</option></select></label><label className="field"><span>Duration (minutes)</span><input name="durationMinutes" type="number" min="0" defaultValue="10" /></label><label className="field full"><span>Content URL</span><input name="contentUrl" placeholder="https://... or /ebooks/..." /></label><label className="field full"><span>Lesson notes</span><textarea name="notes" /></label><label className="field"><span>Order</span><input name="sortOrder" type="number" min="1" defaultValue="1" /></label><label className="check-field"><input name="isPreview" type="checkbox" /> Free preview</label><button className="button button-dark field full">Add lesson</button></form>
    </div>

    <form className="admin-card form-grid" onSubmit={uploadVideo}><h2 className="field full">Upload video lesson</h2><p className="field full">MP4/WebM up to 200 MB. Stored privately and available only to enrolled students unless marked as a preview.</p><label className="field"><span>Course</span><select name="courseId" required>{courseOptions.map((course) => <option value={course.id} key={course.id}>{course.title}</option>)}</select></label><label className="field"><span>Lesson title</span><input name="title" required /></label><label className="field full"><span>Video file</span><input name="file" type="file" accept="video/*" required /></label><label className="field"><span>Duration (minutes)</span><input name="durationMinutes" type="number" min="0" defaultValue="10" /></label><label className="field"><span>Order</span><input name="sortOrder" type="number" min="1" defaultValue="1" /></label><label className="field full"><span>Lesson notes</span><textarea name="notes" /></label><label className="check-field"><input name="isPreview" type="checkbox" /> Free preview</label><button className="button button-primary field full">Upload video</button></form>
    <form className="admin-card form-grid" onSubmit={uploadCourseMedia}><h2 className="field full">Upload course cover or eBook</h2><p className="field full">Add a high-quality course thumbnail or PDF eBook directly from your device.</p><label className="field"><span>Course</span><select name="courseId" required>{courseOptions.map((course) => <option value={course.id} key={course.id}>{course.title}</option>)}</select></label><label className="field"><span>Media type</span><select name="kind" required><option value="cover">Course thumbnail / banner</option><option value="ebook">PDF eBook</option></select></label><label className="field full"><span>Choose file</span><input name="file" type="file" accept="image/*,application/pdf" required /></label><button className="button button-primary field full">Upload course media</button></form>
    <div className="admin-grid">
      <form className="admin-card form-grid" onSubmit={e=>sendJson(e,"/api/lms/admin/sections")}><h2 className="field full">Create course section</h2><label className="field full"><span>Course</span><select name="courseId">{courseOptions.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label><label className="field"><span>Section title</span><input name="title" placeholder="Module 1 · Foundations" required/></label><label className="field"><span>Order</span><input name="sortOrder" type="number" defaultValue="1"/></label><label className="field full"><span>Description</span><textarea name="description"/></label><button className="button button-dark field full">Add section</button></form>
      <form className="admin-card form-grid" onSubmit={e=>sendJson(e,"/api/lms/admin/course-settings")}><h2 className="field full">Price & certificate settings</h2><label className="field full"><span>Course</span><select name="courseId">{courseOptions.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label><label className="field"><span>Price ₹ (0 = free)</span><input name="priceInr" type="number" min="0" defaultValue="0"/></label><label className="field"><span>Quiz pass score %</span><input name="passScore" type="number" min="1" max="100" defaultValue="70"/></label><label className="field"><span>Status</span><select name="status"><option value="published">Published</option><option value="draft">Draft</option></select></label><label className="check-field"><input name="certificateEnabled" type="checkbox" defaultChecked/> Generate certificate</label><button className="button button-dark field full">Update course</button></form>
      <form className="admin-card form-grid" onSubmit={e=>sendJson(e,"/api/lms/admin/quiz")}><h2 className="field full">Add final quiz question</h2><label className="field full"><span>Course</span><select name="courseId">{courseOptions.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label><label className="field full"><span>Question</span><input name="question" required/></label>{["A","B","C","D"].map(x=><label className="field" key={x}><span>Option {x}</span><input name={`option${x}`} required/></label>)}<label className="field"><span>Correct option</span><select name="correctOption"><option>A</option><option>B</option><option>C</option><option>D</option></select></label><label className="field"><span>Order</span><input name="sortOrder" type="number" defaultValue="1"/></label><button className="button button-dark field full">Add question</button></form>
      <form className="admin-card form-grid" onSubmit={e=>sendJson(e,"/api/lms/admin/payment")}><h2 className="field full">Payment gateway readiness</h2><label className="field"><span>Provider</span><select name="provider"><option value="manual">Manual / WhatsApp</option><option value="razorpay">Razorpay</option><option value="stripe">Stripe</option></select></label><label className="field"><span>Mode</span><select name="mode"><option value="test">Test</option><option value="live">Live</option></select></label><label className="field full"><span>Public key / Key ID</span><input name="publicKey" placeholder="Secret keys are connected securely, not stored here"/></label><label className="field"><span>Merchant label</span><input name="merchantLabel" defaultValue="MyDigitalSkills"/></label><label className="check-field"><input name="enabled" type="checkbox"/> Enable gateway</label><button className="button button-primary field full">Save payment settings</button></form>
    </div>
  </div>;
}
