from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle,
    ListFlowable, ListItem, KeepTogether, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
PUBLIC = ROOT / "public" / "ebooks"
LOGO = ROOT / "public" / "images" / "mydigitalskills-logo.jpg"
AUTHOR = ROOT / "public" / "images" / "lambodar-profile.jpg"
OUT.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)

FONT_DIR = Path("/usr/share/fonts/truetype/dejavu")
pdfmetrics.registerFont(TTFont("MDS", str(FONT_DIR / "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("MDS-Bold", str(FONT_DIR / "DejaVuSans-Bold.ttf")))

RED = colors.HexColor("#E11A24")
DARK = colors.HexColor("#111114")
GOLD = colors.HexColor("#D5A21F")
CREAM = colors.HexColor("#F7F2E8")
MUTED = colors.HexColor("#5E5B63")
LINE = colors.HexColor("#E6E0D6")


def styles():
    s = getSampleStyleSheet()
    return {
        "title": ParagraphStyle("Title", parent=s["Title"], fontName="MDS-Bold", fontSize=31, leading=35, textColor=DARK, alignment=TA_LEFT, spaceAfter=10),
        "subtitle": ParagraphStyle("Subtitle", parent=s["Normal"], fontName="MDS", fontSize=12, leading=19, textColor=MUTED, spaceAfter=14),
        "cover_kicker": ParagraphStyle("CoverKicker", parent=s["Normal"], fontName="MDS-Bold", fontSize=10, leading=13, textColor=RED, tracking=1.4, uppercase=True, spaceAfter=8),
        "h1": ParagraphStyle("H1", parent=s["Heading1"], fontName="MDS-Bold", fontSize=23, leading=28, textColor=DARK, spaceBefore=3, spaceAfter=12),
        "h2": ParagraphStyle("H2", parent=s["Heading2"], fontName="MDS-Bold", fontSize=15, leading=20, textColor=RED, spaceBefore=14, spaceAfter=8),
        "body": ParagraphStyle("Body", parent=s["BodyText"], fontName="MDS", fontSize=9.8, leading=15.5, textColor=DARK, spaceAfter=8),
        "small": ParagraphStyle("Small", parent=s["BodyText"], fontName="MDS", fontSize=8, leading=12, textColor=MUTED),
        "bullet": ParagraphStyle("Bullet", parent=s["BodyText"], fontName="MDS", fontSize=9.3, leading=14.5, leftIndent=4, textColor=DARK),
        "callout": ParagraphStyle("Callout", parent=s["BodyText"], fontName="MDS-Bold", fontSize=10.2, leading=16, textColor=DARK),
        "center": ParagraphStyle("Center", parent=s["BodyText"], fontName="MDS", fontSize=9, leading=14, alignment=TA_CENTER, textColor=MUTED),
    }


S = styles()


def page_footer(canvas, doc):
    canvas.saveState()
    w, _ = A4
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 14 * mm, w - 18 * mm, 14 * mm)
    canvas.setFont("MDS", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 9 * mm, "MyDigitalSkills | Lambodar Patra")
    canvas.drawRightString(w - 18 * mm, 9 * mm, f"Page {doc.page}")
    canvas.restoreState()


def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(x, S["bullet"]), leftIndent=10) for x in items],
        bulletType="bullet", bulletColor=RED, leftIndent=16, bulletFontName="MDS-Bold",
        bulletFontSize=7, spaceAfter=10
    )


def callout(title, text):
    data = [[Paragraph(title, S["callout"])], [Paragraph(text, S["body"])]]
    table = Table(data, colWidths=[160 * mm], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CREAM),
        ("BOX", (0, 0), (-1, -1), 0.8, GOLD),
        ("LINEBEFORE", (0, 0), (0, -1), 4, RED),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return table


def checklist(rows):
    data = [[Paragraph("<b>Action</b>", S["body"]), Paragraph("<b>Done</b>", S["body"])]]
    data += [[Paragraph(row, S["body"]), Paragraph("□", S["body"])] for row in rows]
    table = Table(data, colWidths=[145 * mm, 15 * mm], repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), DARK),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return table


def chapter(title, intro, sections, chapter_no):
    story = [
        Paragraph(f"CHAPTER {chapter_no:02d}", S["cover_kicker"]),
        Paragraph(title, S["h1"]),
        Paragraph(intro, S["subtitle"]),
        HRFlowable(width="100%", thickness=1, color=LINE, spaceAfter=14),
    ]
    for heading, paragraphs, points, note in sections:
        story.append(Paragraph(heading, S["h2"]))
        for p in paragraphs:
            story.append(Paragraph(p, S["body"]))
        if points:
            story.append(bullets(points))
        if note:
            story.extend([Spacer(1, 4), callout(note[0], note[1]), Spacer(1, 8)])
    story.append(PageBreak())
    return story


def cover(title, subtitle, edition):
    photo = Image(str(AUTHOR), width=67 * mm, height=67 * mm)
    photo.hAlign = "RIGHT"
    return [
        Image(str(LOGO), width=168 * mm, height=53.4 * mm),
        Spacer(1, 16 * mm),
        Paragraph(edition.upper(), S["cover_kicker"]),
        Paragraph(title, S["title"]),
        Paragraph(subtitle, S["subtitle"]),
        Spacer(1, 9 * mm),
        Table([[photo, Paragraph("<b>By Lambodar Patra</b><br/>Digital Marketing, Meta Ads & Business Growth Partner<br/><br/><font color='#E11A24'>MyDigitalSkills</font><br/>Noida, India", S["body"])]], colWidths=[74 * mm, 86 * mm], style=[("VALIGN", (0,0), (-1,-1), "MIDDLE"), ("BACKGROUND", (0,0), (-1,-1), CREAM), ("BOX", (0,0), (-1,-1), 0.8, LINE), ("LEFTPADDING", (0,0), (-1,-1), 10), ("RIGHTPADDING", (0,0), (-1,-1), 10), ("TOPPADDING", (0,0), (-1,-1), 10), ("BOTTOMPADDING", (0,0), (-1,-1), 10)]),
        Spacer(1, 18 * mm),
        Paragraph("Learn practical skills. Build smarter systems. Grow with confidence.", S["center"]),
        PageBreak(),
    ]


def intro_pages(book_title, promise, contents):
    return [
        Paragraph("WELCOME", S["cover_kicker"]),
        Paragraph(f"How to use {book_title}", S["h1"]),
        Paragraph(promise, S["body"]),
        callout("Use it like a workbook", "Read one chapter, complete the action points, and apply them to one real business. Execution creates skill faster than passive reading."),
        Spacer(1, 12),
        Paragraph("What you will learn", S["h2"]),
        bullets(contents),
        Paragraph("Important note", S["h2"]),
        Paragraph("This guide is educational. Advertising results depend on the offer, market, creative, budget, follow-up and many other factors. No campaign result is guaranteed.", S["body"]),
        Paragraph("About the author", S["h2"]),
        Paragraph("Lambodar Patra is a digital marketing and business growth professional with 7+ years of experience across education, hospitality, real estate, construction, service businesses and digital platforms.", S["body"]),
        PageBreak(),
    ]


def build_pdf(path, title, subtitle, edition, intro, contents, chapters, final_rows):
    doc = SimpleDocTemplate(
        str(path), pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm,
        topMargin=18 * mm, bottomMargin=20 * mm, title=title, author="Lambodar Patra",
        subject="MyDigitalSkills eBook"
    )
    story = cover(title, subtitle, edition)
    story += intro_pages(title, intro, contents)
    for i, (ch_title, ch_intro, sections) in enumerate(chapters, 1):
        story += chapter(ch_title, ch_intro, sections, i)
    story += [
        Paragraph("FINAL ACTION PLAN", S["cover_kicker"]),
        Paragraph("Your implementation checklist", S["h1"]),
        Paragraph("Do not try to improve everything in one day. Complete these actions in order and review progress weekly.", S["body"]),
        Spacer(1, 8), checklist(final_rows), Spacer(1, 18),
        callout("Need help applying this?", "Book a free website and digital growth consultation with Lambodar Patra at mydigitalskills.in or WhatsApp +91 81287 29003."),
        Spacer(1, 20),
        Paragraph("Connect with MyDigitalSkills", S["h2"]),
        Paragraph("Email: connect@mydigitalskills.in<br/>Instagram: @mydigitalskills.in<br/>Location: Noida, India", S["body"]),
    ]
    doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)


digital_chapters = [
    ("Digital Marketing as a Growth System", "Digital marketing works best when every channel supports one clear business objective.", [
        ("Start with the business goal", ["Choose one primary goal: awareness, qualified leads, sales, repeat business or retention. A campaign without a clear goal becomes a collection of disconnected activities."], ["Write one measurable 90-day goal", "Define the customer action that matters", "Choose one primary offer"], ("Growth principle", "Traffic is not the final goal. The goal is the right customer taking the right action.")),
        ("The five-part system", ["A practical digital growth system connects offer, audience, message, channel and measurement."], ["Offer: what value you provide", "Audience: who needs it most", "Message: why they should care", "Channel: where they discover you", "Measurement: how you improve"], None),
    ]),
    ("Know Your Customer", "Better marketing begins with a specific customer, not a broad demographic.", [
        ("Build a useful customer profile", ["Describe the customer in terms of situation, pain, motivation, objections and desired outcome."], ["Current problem", "What they have already tried", "Reason they delay", "Trust signals they need", "Preferred contact method"], None),
        ("Create a message map", ["Use one primary promise supported by three proof points. Keep language simple and outcome-focused."], ["Problem statement", "Desired transformation", "Proof or experience", "Clear next step"], ("Example", "We help local businesses turn online visibility into enquiries through websites, GMB and lead campaigns.")),
    ]),
    ("Build a Website That Converts", "A website should guide decisions, not just display information.", [
        ("Core page structure", ["A service website needs a clear homepage, detailed service pages, proof, about, resources and contact."], ["Strong hero promise", "Service-specific pages", "Portfolio or case studies", "Testimonials and proof", "One primary call to action"], None),
        ("Conversion essentials", ["Reduce friction. Make calling, WhatsApp and enquiry actions visible on mobile."], ["Fast loading", "Readable typography", "Clear navigation", "Trust and privacy information", "Mobile-first forms"], ("Quick test", "A first-time visitor should understand who you help, what you do and what to do next within 10 seconds.")),
    ]),
    ("Content and Social Media", "Content builds familiarity before the sales conversation begins.", [
        ("Use four content pillars", ["Balance education, proof, personality and promotion instead of posting only offers."], ["Teach a useful idea", "Show work and outcomes", "Share founder perspective", "Present the offer and next step"], None),
        ("Simple weekly rhythm", ["Create one strong core idea and repurpose it across formats."], ["One educational carousel", "Two short videos", "One case-study post", "Daily stories", "One direct offer post"], ("Content rule", "Create for one audience problem at a time. Specific content feels more valuable than generic advice.")),
    ]),
    ("SEO and Google Business Profile", "Search visibility grows when your website and local profile answer real customer needs.", [
        ("Website SEO foundation", ["Create useful pages around services, locations and customer questions. Use clear titles, headings and internal links."], ["Descriptive page titles", "Unique service content", "Fast mobile pages", "Search Console monitoring", "Consistent business details"], None),
        ("Local growth through GMB", ["Keep the profile accurate and active. Add services, photos, posts and a consistent review process."], ["Correct primary category", "Complete services and description", "Recent photos", "Review request system", "Helpful review replies"], ("Avoid shortcuts", "Do not stuff keywords into the business name or publish copied content. Build genuine relevance and trust.")),
    ]),
    ("Paid Advertising Fundamentals", "Paid media accelerates a strong offer; it cannot permanently repair a weak one.", [
        ("Choose the right campaign", ["Match the platform and objective to the customer journey."], ["Awareness for reach", "Traffic for qualified visits", "Leads for enquiries", "Sales for tracked conversions", "Retargeting for warm audiences"], None),
        ("Before you spend", ["Confirm the offer, landing experience, tracking and follow-up process."], ["Clear offer", "Strong creative", "Working form or page", "Response ownership", "Weekly review"], ("Budget principle", "Start with a controlled test budget, learn what drives quality, then scale gradually.")),
    ]),
    ("Lead Funnels and Follow-up", "Most leads are lost after the form, not during the ad.", [
        ("Map the lead journey", ["Define what happens from first click to qualified conversation."], ["Ad or content", "Landing page or lead form", "Instant confirmation", "Human follow-up", "Qualification", "Proposal or booking"], None),
        ("Follow-up system", ["Respond quickly, use a simple qualification script and record every next action."], ["Lead source", "Need and urgency", "Budget range", "Decision maker", "Next follow-up date"], ("Practical reminder", "A simple spreadsheet used daily is better than an advanced CRM nobody updates.")),
    ]),
    ("Analytics and Improvement", "Measure the numbers that help you make a decision.", [
        ("Useful metrics", ["Connect marketing metrics with business outcomes."], ["Reach and frequency", "Click-through rate", "Cost per landing page view", "Cost per lead", "Qualified lead rate", "Conversion and revenue"], None),
        ("Weekly review", ["Ask what improved, what weakened and what experiment you will run next."], ["Best content or creative", "Highest-quality source", "Funnel drop-off", "Follow-up speed", "Next test"], ("Dashboard rule", "A useful report explains what happened, why it matters and what action comes next.")),
    ]),
    ("Your 30-Day Growth Plan", "A focused month can create a strong digital foundation.", [
        ("Week 1 - Strategy", ["Set the offer, audience, goal and measurement plan."], ["Business audit", "Customer profile", "Core message", "90-day target"], None),
        ("Week 2 - Foundation", ["Improve the website, GMB and enquiry journey."], ["Homepage clarity", "Service pages", "Contact actions", "Tracking setup"], None),
        ("Week 3 - Content and campaign", ["Publish useful content and launch one controlled campaign."], ["Content batch", "Creative variations", "Lead form or landing page", "Follow-up script"], None),
        ("Week 4 - Review", ["Study lead quality, improve weak steps and document what worked."], ["Campaign review", "Lead feedback", "Page improvements", "Next-month plan"], None),
    ]),
]

meta_chapters = [
    ("Meta Ads Strategy Before Setup", "The best campaign begins with business clarity, not Ads Manager.", [
        ("Define the conversion", ["Choose the action you want and the criteria for a good lead."], ["Service needed", "Location", "Budget or ticket size", "Timeline", "Decision authority"], None),
        ("Offer and economics", ["Know what a customer is worth and what you can afford to pay for a qualified opportunity."], ["Average sale value", "Gross margin", "Lead-to-sale rate", "Maximum acceptable acquisition cost"], ("Important", "A cheap lead is not automatically a good lead. Measure quality and sales progression.")),
    ]),
    ("Account and Tracking Foundation", "Clean ownership and tracking protect campaign continuity.", [
        ("Business setup", ["Keep assets under the business, not only under an individual profile."], ["Business portfolio", "Ad account", "Facebook Page", "Instagram account", "Pixel or dataset", "Domain access"], None),
        ("Tracking plan", ["Define which events matter and test them before launch."], ["Page view", "Landing page view", "Lead", "Contact", "Purchase or qualified outcome"], ("Data discipline", "Use clear campaign names and consistent UTM parameters so reporting stays understandable.")),
    ]),
    ("Objectives and Funnel Architecture", "Campaign structure should match customer awareness and the available conversion data.", [
        ("Choose the objective", ["Use leads for forms, messages or calls; use sales when reliable conversion tracking and volume exist."], ["Awareness", "Traffic", "Engagement", "Leads", "Sales"], None),
        ("Simple account structure", ["Avoid unnecessary complexity. Start with a small number of campaigns and clear test variables."], ["Prospecting campaign", "Retargeting campaign", "Optional existing-customer campaign"], ("Structure rule", "Do not split a small budget across too many ad sets. Each ad set needs enough delivery to learn.")),
    ]),
    ("Audience and Location Targeting", "Targeting provides direction; creative and offer create relevance.", [
        ("Audience layers", ["Test broad, interest-based and first-party audiences according to the business."], ["Broad audience", "Relevant interests", "Customer list", "Website visitors", "Engaged social users", "Lookalike audiences"], None),
        ("Local targeting", ["Match location settings to the actual service area and customer behaviour."], ["Cities and radius", "Excluded locations", "Language", "Age only when justified", "Schedule when calls can be handled"], ("Avoid over-targeting", "Too many narrow filters can reduce delivery and increase cost without improving quality.")),
    ]),
    ("Creative That Stops the Scroll", "A strong creative communicates the problem, outcome and next step quickly.", [
        ("Creative angles", ["Build multiple messages rather than only changing colours."], ["Pain point", "Desired outcome", "Proof or demonstration", "Offer", "Objection handling", "Founder-led explanation"], None),
        ("Video framework", ["Hook in the first seconds, present the problem, show the solution and finish with one action."], ["Hook", "Problem", "Solution", "Proof", "Call to action"], ("Testing tip", "Test three meaningfully different concepts before producing many small variations of one weak idea.")),
    ]),
    ("Ad Copy and Offer", "Copy should make the right person feel understood and ready to act.", [
        ("Primary text framework", ["Use direct language and remove unnecessary claims."], ["Call out the relevant situation", "State the problem", "Present the solution", "Add proof", "Give one call to action"], None),
        ("Qualify through copy", ["Mention location, service type, starting conditions or important eligibility criteria when they improve lead quality."], ["Who it is for", "What is included", "Where it is available", "What happens after enquiry"], ("Trust rule", "Never use false urgency, misleading pricing or guaranteed-result claims.")),
    ]),
    ("Lead Forms and Landing Pages", "The conversion experience should collect enough information without creating unnecessary friction.", [
        ("Instant form choices", ["Use higher-intent forms when quality matters more than raw volume."], ["Clear introduction", "Useful qualifying questions", "Privacy link", "Confirmation screen", "WhatsApp or call next step"], None),
        ("Landing page essentials", ["Match the ad promise, show proof and make the next action obvious."], ["Consistent headline", "Benefits and use cases", "Trust signals", "Short form", "Mobile speed"], ("Quality lever", "Ask questions that the sales team will actually use. Every extra field needs a reason.")),
    ]),
    ("Launch and Optimization", "Optimization needs enough data and a clear review rhythm.", [
        ("Before launch", ["Check every destination, form, number, location and tracking event."], ["Preview all placements", "Submit a test lead", "Check WhatsApp message", "Verify budget and schedule", "Confirm follow-up owner"], None),
        ("What to review", ["Separate delivery problems from offer, creative and sales-process problems."], ["Spend and reach", "CPM", "CTR", "Landing-page rate", "Cost per lead", "Qualified lead rate"], ("Change discipline", "Make one meaningful change at a time where possible, then observe its effect.")),
    ]),
    ("Lead Quality and Sales Follow-up", "Ads generate opportunities; sales follow-up converts them.", [
        ("Build a feedback loop", ["The sales team should tag each lead and share reasons for rejection."], ["Qualified", "Wrong location", "Low budget", "Not reachable", "Duplicate", "Future requirement", "Converted"], None),
        ("First response", ["Contact leads quickly and use a structured but natural conversation."], ["Confirm requirement", "Understand urgency", "Explain next step", "Book a call or visit", "Set follow-up date"], ("Core metric", "Track cost per qualified lead and cost per sale, not only cost per form submission.")),
    ]),
    ("Reporting and Scaling", "Scale after you understand what is producing quality.", [
        ("Weekly report", ["Keep reporting connected to decisions."], ["Spend", "Leads", "Qualified leads", "Appointments", "Sales", "Best creative", "Next action"], None),
        ("Scaling paths", ["Increase budget gradually, expand winning audiences or produce new creatives around proven angles."], ["Vertical budget scaling", "Horizontal audience expansion", "New placement or geography", "Creative expansion", "Retargeting improvement"], ("Scaling warning", "Higher spend can change audience composition and cost. Monitor quality while scaling.")),
    ]),
    ("30-Day Meta Ads Test Plan", "Use a controlled month to discover a reliable campaign direction.", [
        ("Days 1-5", ["Prepare the offer, assets, tracking and lead follow-up."], ["Campaign brief", "Three creative concepts", "Lead form or page", "Qualification questions"], None),
        ("Days 6-14", ["Launch controlled tests and avoid reacting to every hourly movement."], ["Monitor delivery", "Check form quality", "Fix technical issues", "Collect sales feedback"], None),
        ("Days 15-23", ["Pause clearly weak combinations and create improved versions of the strongest angles."], ["Creative review", "Audience review", "Lead-quality review", "Follow-up speed"], None),
        ("Days 24-30", ["Summarize learning and decide what to scale, rebuild or stop."], ["Winner definition", "Budget decision", "New test roadmap", "Monthly report"], None),
    ]),
]

digital_path = OUT / "digital-marketing-growth-playbook.pdf"
meta_path = OUT / "meta-ads-lead-generation-blueprint.pdf"

build_pdf(
    digital_path,
    "Digital Marketing Growth Playbook",
    "A practical guide to building visibility, leads and sustainable business growth online.",
    "2026 First Edition",
    "This playbook gives business owners, marketers and beginners a practical framework for planning and executing digital growth. It is designed to be applied, not only read.",
    ["Create a clear digital growth strategy", "Build a conversion-focused website", "Plan useful content and social media", "Improve SEO and Google Business Profile", "Use paid ads and lead funnels", "Measure performance and build a 30-day plan"],
    digital_chapters,
    ["Write one 90-day business goal", "Define the ideal customer and primary offer", "Review the homepage and service pages", "Create four content pillars", "Complete the Google Business Profile", "Set up enquiry tracking", "Launch one controlled campaign", "Build a lead follow-up sheet", "Review qualified leads weekly", "Plan the next 30-day experiment"],
)

build_pdf(
    meta_path,
    "Meta Ads Lead Generation Blueprint",
    "A hands-on framework for campaign structure, creative testing, lead quality and performance improvement.",
    "2026 First Edition",
    "This blueprint helps business owners and marketers plan Meta Ads around lead quality and sales outcomes. Use it as a campaign preparation and optimization workbook.",
    ["Plan the campaign around business economics", "Set up assets and tracking cleanly", "Choose objectives and structure", "Build audiences and creative angles", "Improve forms and landing pages", "Optimize using quality feedback", "Report and scale with discipline"],
    meta_chapters,
    ["Define a qualified lead", "Calculate acceptable acquisition cost", "Confirm business asset ownership", "Test every conversion event", "Prepare three creative concepts", "Write one clear offer", "Build qualifying form questions", "Submit a full test lead", "Create lead status tags", "Track cost per qualified lead", "Review campaigns weekly", "Document the next test"],
)

for src in (digital_path, meta_path):
    (PUBLIC / src.name).write_bytes(src.read_bytes())

print(digital_path)
print(meta_path)
