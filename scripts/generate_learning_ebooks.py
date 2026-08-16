from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle,
    ListFlowable, ListItem, HRFlowable
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

DARK = colors.HexColor("#111114")
RED = colors.HexColor("#E11A24")
GOLD = colors.HexColor("#D5A21F")
CREAM = colors.HexColor("#F7F2E8")
MUTED = colors.HexColor("#5E5B63")
LINE = colors.HexColor("#E5DFD6")

base = getSampleStyleSheet()
ST = {
    "kicker": ParagraphStyle("kicker", parent=base["Normal"], fontName="MDS-Bold", fontSize=9, leading=13, textColor=RED, spaceAfter=8),
    "title": ParagraphStyle("title", parent=base["Title"], fontName="MDS-Bold", fontSize=29, leading=34, textColor=DARK, spaceAfter=11),
    "h1": ParagraphStyle("h1", parent=base["Heading1"], fontName="MDS-Bold", fontSize=23, leading=28, textColor=DARK, spaceAfter=12),
    "h2": ParagraphStyle("h2", parent=base["Heading2"], fontName="MDS-Bold", fontSize=15, leading=20, textColor=RED, spaceBefore=12, spaceAfter=7),
    "body": ParagraphStyle("body", parent=base["BodyText"], fontName="MDS", fontSize=9.7, leading=15.5, textColor=DARK, spaceAfter=8),
    "small": ParagraphStyle("small", parent=base["BodyText"], fontName="MDS", fontSize=8, leading=12, textColor=MUTED),
    "center": ParagraphStyle("center", parent=base["BodyText"], fontName="MDS", fontSize=8.5, leading=13, textColor=MUTED, alignment=TA_CENTER),
}


def footer(canvas, doc):
    canvas.saveState()
    w, _ = A4
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 14 * mm, w - 18 * mm, 14 * mm)
    canvas.setFont("MDS", 7.4)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 9 * mm, "MyDigitalSkills | Lambodar Patra")
    canvas.drawRightString(w - 18 * mm, 9 * mm, f"Page {doc.page}")
    canvas.restoreState()


def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(item, ST["body"]), leftIndent=9) for item in items],
        bulletType="bullet", bulletColor=RED, bulletFontName="MDS-Bold",
        bulletFontSize=7, leftIndent=16, spaceAfter=8
    )


def callout(title, text, accent=GOLD):
    t = Table([[Paragraph(title, ST["h2"])], [Paragraph(text, ST["body"])]], colWidths=[160 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CREAM),
        ("BOX", (0, 0), (-1, -1), 0.7, accent),
        ("LINEBEFORE", (0, 0), (0, -1), 4, RED),
        ("LEFTPADDING", (0, 0), (-1, -1), 11),
        ("RIGHTPADDING", (0, 0), (-1, -1), 11),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return t


def cover(book):
    photo = Image(str(AUTHOR), width=54 * mm, height=54 * mm)
    return [
        Image(str(LOGO), width=168 * mm, height=53.4 * mm),
        Spacer(1, 12 * mm),
        Paragraph("FREE PRACTICAL LEARNING EBOOK", ST["kicker"]),
        Paragraph(book["title"], ST["title"]),
        Paragraph(book["subtitle"], ST["body"]),
        Spacer(1, 8 * mm),
        Table(
            [[photo, Paragraph("<b>By Lambodar Patra</b><br/>Digital Marketing, Meta Ads & Business Growth Partner<br/><br/><font color='#E11A24'>2026 First Edition</font>", ST["body"])]],
            colWidths=[64 * mm, 96 * mm],
            style=[
                ("VALIGN", (0,0), (-1,-1), "MIDDLE"), ("BACKGROUND", (0,0), (-1,-1), CREAM),
                ("BOX", (0,0), (-1,-1), 0.7, LINE), ("LEFTPADDING", (0,0), (-1,-1), 10),
                ("RIGHTPADDING", (0,0), (-1,-1), 10), ("TOPPADDING", (0,0), (-1,-1), 10),
                ("BOTTOMPADDING", (0,0), (-1,-1), 10),
            ]
        ),
        Spacer(1, 20 * mm),
        Paragraph("Learn practical skills. Build smarter systems. Grow with confidence.", ST["center"]),
        PageBreak(),
    ]


def build(book):
    path = OUT / book["file"]
    doc = SimpleDocTemplate(
        str(path), pagesize=A4, leftMargin=18*mm, rightMargin=18*mm,
        topMargin=18*mm, bottomMargin=20*mm, title=book["title"],
        author="Lambodar Patra", subject="MyDigitalSkills learning eBook"
    )
    story = cover(book)
    story += [
        Paragraph("START HERE", ST["kicker"]),
        Paragraph("What you will be able to do", ST["h1"]),
        Paragraph(book["intro"], ST["body"]),
        bullets(book["outcomes"]),
        callout("Practice rule", "Use the skill immediately on one real document, dataset, presentation or business task. Practical use creates confidence faster than passive reading."),
        Spacer(1, 12),
        Paragraph("Learning path", ST["h2"]),
        bullets([f"{i+1}. {chapter['title']}" for i, chapter in enumerate(book["chapters"])]),
        PageBreak(),
    ]
    for i, chapter in enumerate(book["chapters"], 1):
        story += [
            Paragraph(f"MODULE {i:02d}", ST["kicker"]),
            Paragraph(chapter["title"], ST["h1"]),
            Paragraph(chapter["intro"], ST["body"]),
            HRFlowable(width="100%", thickness=1, color=LINE, spaceAfter=12),
        ]
        for heading, text, points in chapter["sections"]:
            story.append(Paragraph(heading, ST["h2"]))
            story.append(Paragraph(text, ST["body"]))
            story.append(bullets(points))
        story += [callout("Try this now", chapter["task"]), PageBreak()]
    story += [
        Paragraph("QUICK REFERENCE", ST["kicker"]),
        Paragraph("Your action checklist", ST["h1"]),
        bullets([f"□ {x}" for x in book["checklist"]]),
        Spacer(1, 12),
        callout("Continue learning", "Visit mydigitalskills.in for free learning resources, practical business guides and upcoming video lessons."),
        Spacer(1, 15),
        Paragraph("Connect with MyDigitalSkills", ST["h2"]),
        Paragraph("Email: connect@mydigitalskills.in<br/>Instagram: @mydigitalskills.in<br/>WhatsApp: +91 81287 29003<br/>Noida, India", ST["body"]),
    ]
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    (PUBLIC / path.name).write_bytes(path.read_bytes())
    print(path)


books = [
    {
        "file": "microsoft-word-essentials.pdf",
        "title": "Microsoft Word Essentials",
        "subtitle": "Create clean, professional documents for work, business and everyday use.",
        "intro": "This beginner-friendly guide teaches the document skills most people need in offices and businesses. Menu labels can vary slightly by Word version.",
        "outcomes": ["Format readable documents", "Use headings, lists, tables and page settings", "Create letters, proposals and reports", "Review, export and share confidently"],
        "chapters": [
            {"title":"Start and Format a Document","intro":"Good documents begin with clear structure.","sections":[("Document setup","Set size, margins and orientation before detailed formatting.",["Use A4 for most business documents","Choose portrait or landscape intentionally","Save with a clear filename"]),("Text formatting","Use fonts, spacing and emphasis consistently.",["Use one body font","Create clear heading levels","Use bold for meaning, not decoration"])],"task":"Create a one-page company introduction with a title, two headings and a short bullet list."},
            {"title":"Paragraphs, Lists and Styles","intro":"Consistency makes long documents easier to read and update.","sections":[("Paragraph control","Manage alignment, line spacing and space before or after paragraphs.",["Avoid repeated blank lines","Use 1.15 to 1.5 line spacing","Keep body text left aligned"]),("Styles","Apply Heading styles instead of manually formatting every heading.",["Heading 1 for main sections","Heading 2 for sub-sections","Modify styles once for global consistency"])],"task":"Reformat an old document using Heading 1, Heading 2 and Normal styles."},
            {"title":"Tables, Images and Layout","intro":"Visual elements should support information, not crowd it.","sections":[("Tables","Use tables for comparisons and structured information.",["Keep headers clear","Use minimal borders","Align numbers consistently"]),("Images","Insert, resize and wrap images carefully.",["Use high-quality images","Maintain aspect ratio","Add captions where useful"])],"task":"Build a two-column service comparison table and insert one correctly aligned image."},
            {"title":"Business Documents","intro":"Use reusable structures for common workplace tasks.","sections":[("Useful formats","Create templates for repeated business communication.",["Formal letter","Quotation or proposal","Meeting minutes","Simple report"]),("Professional finish","Check details before sharing.",["Header and footer","Page numbers","Consistent date and contact format"])],"task":"Create a reusable letterhead with company name, contact details and footer."},
            {"title":"Review, Export and Share","intro":"The final review protects your credibility.","sections":[("Review tools","Use spelling, comments and Track Changes appropriately.",["Run spelling and grammar check","Use comments for questions","Accept or reject changes carefully"]),("Export","Choose the right file format.",["DOCX for editing","PDF for final sharing","Use descriptive version names"])],"task":"Review a two-page document, add one comment and export a final PDF."},
        ],
        "checklist":["Set page size and margins","Use heading styles","Keep fonts consistent","Check spacing and alignment","Review spelling and facts","Export a clean PDF"],
    },
    {
        "file": "microsoft-excel-essentials.pdf",
        "title": "Microsoft Excel Essentials",
        "subtitle": "Organize data, use formulas and build simple business reports.",
        "intro": "This guide focuses on practical Excel work: clean data, useful formulas, summaries and charts. Function names may vary by language or version.",
        "outcomes":["Structure reliable worksheets","Use essential formulas","Sort, filter and validate data","Build summaries and useful charts"],
        "chapters":[
            {"title":"Workbook and Data Basics","intro":"Clean structure prevents errors later.","sections":[("Worksheet design","Keep one clear row per record and one field per column.",["Use short column headers","Avoid merged cells in data tables","Keep dates and numbers consistent"]),("Navigation","Work efficiently with sheets, ranges and freeze panes.",["Rename sheets clearly","Freeze the header row","Use filters on tables"])],"task":"Create a customer lead sheet with date, name, source, status and next follow-up."},
            {"title":"Essential Formulas","intro":"Formulas turn data into answers.","sections":[("Basic calculations","Start with reliable everyday formulas.",["SUM for totals","AVERAGE for mean","MIN and MAX for range","COUNT and COUNTA for records"]),("Conditional logic","Use IF and COUNTIF for decisions and counts.",["IF for status rules","COUNTIF for category counts","SUMIF for conditional totals"])],"task":"Calculate total sales, average order value and number of converted leads."},
            {"title":"Clean and Control Data","intro":"Validation and cleaning make reports trustworthy.","sections":[("Data cleaning","Find duplicates, blanks and inconsistent values.",["Remove duplicates carefully","Use TRIM for extra spaces","Standardize category names"]),("Data validation","Create dropdowns and input rules.",["Status dropdown","Valid date range","Whole-number limits"])],"task":"Add a status dropdown with New, Contacted, Qualified, Won and Lost."},
            {"title":"Analysis and Charts","intro":"A good chart answers one business question.","sections":[("Summaries","Use tables and PivotTables to group information.",["Sales by month","Leads by source","Conversions by status"]),("Charts","Choose a chart that matches the relationship.",["Bar for comparison","Line for trend","Pie only for simple composition"])],"task":"Build a monthly lead trend chart and a source comparison chart."},
            {"title":"Reporting Workflow","intro":"A repeatable report saves time every week.","sections":[("Dashboard basics","Keep key metrics visible and definitions clear.",["Total leads","Qualified leads","Conversion rate","Sales value"]),("Quality checks","Verify formulas and source ranges.",["Check totals","Test filters","Protect formula cells","Document assumptions"])],"task":"Create a one-page weekly marketing report with four KPIs and two charts."},
        ],
        "checklist":["Keep one row per record","Use consistent formats","Validate important fields","Check formula ranges","Label charts clearly","Save a clean master file"],
    },
    {
        "file": "microsoft-powerpoint-essentials.pdf",
        "title": "Microsoft PowerPoint Essentials",
        "subtitle": "Design clear presentations that explain, persuade and sell.",
        "intro": "This guide shows how to turn a message into a professional presentation without overcrowding slides.",
        "outcomes":["Plan a clear story","Create consistent slides","Use visuals and charts well","Present with confidence"],
        "chapters":[
            {"title":"Plan the Story","intro":"A presentation is a sequence of decisions, not a collection of slides.","sections":[("Audience and goal","Define what the audience should understand or do.",["One main objective","Three supporting messages","One final action"]),("Simple structure","Use a beginning, middle and end.",["Problem or opportunity","Evidence and solution","Plan and next step"])],"task":"Write a 7-slide outline for one service or business idea."},
            {"title":"Slide Design Basics","intro":"Hierarchy helps the audience know where to look.","sections":[("Layout","Use grids, alignment and white space.",["One idea per slide","Strong title","Consistent margins"]),("Typography and color","Keep choices limited.",["One heading font","One body font","High contrast","Brand accent color"])],"task":"Create a title slide, section slide and content slide using one consistent theme."},
            {"title":"Visual Communication","intro":"Visuals should make meaning faster.","sections":[("Images and icons","Choose relevant, high-quality visuals.",["Avoid stretched images","Use consistent icon style","Crop with intention"]),("Charts and data","Highlight the insight, not every data point.",["Simplify labels","Use one highlight color","State the takeaway in the title"])],"task":"Turn one table of numbers into a simple bar chart with a takeaway title."},
            {"title":"Business Presentation Types","intro":"Different goals need different slide sequences.","sections":[("Sales and proposal","Build trust before the ask.",["Customer problem","Your solution","Proof or case study","Scope and next step"]),("Company profile","Balance story, capability and credibility.",["About","Services","Industries","Work examples","Contact"])],"task":"Create a 10-slide service proposal using the recommended sequence."},
            {"title":"Delivery and Export","intro":"A good deck must also work when presented or shared.","sections":[("Presenting","Use notes and rehearse transitions.",["Do not read every word","Use short speaking points","Check timing"]),("Sharing","Export for the audience.",["PPTX for collaboration","PDF for fixed layout","Embed or package media"])],"task":"Rehearse a five-minute version and export a PDF copy for sharing."},
        ],
        "checklist":["Define one goal","Use one idea per slide","Align every element","Use readable type","Simplify charts","End with a clear action"],
    },
    {
        "file": "ai-tools-for-work-and-business.pdf",
        "title": "AI Tools for Work & Business",
        "subtitle": "Choose practical AI tools for research, writing, design, meetings and productivity.",
        "intro": "AI tools change quickly. This guide teaches stable use cases and selection criteria rather than depending on one product.",
        "outcomes":["Match AI tools to tasks","Use AI safely for work","Create repeatable workflows","Review output for accuracy and brand fit"],
        "chapters":[
            {"title":"Choose AI by Use Case","intro":"Start with the task, not the popularity of the tool.","sections":[("Common categories","Group tools by the job they help complete.",["Research and summarization","Writing and brainstorming","Image and video creation","Meetings and transcription","Data and automation"]),("Selection criteria","Evaluate fit before adoption.",["Output quality","Privacy controls","Integration","Learning curve","Cost and limits"])],"task":"List five repetitive tasks and assign one AI use case to each."},
            {"title":"Writing and Research","intro":"AI can accelerate a first draft, but human judgment remains essential.","sections":[("Useful tasks","Use AI to structure information and explore options.",["Outline creation","Copy variations","FAQ drafting","Research questions","Summary and comparison"]),("Verification","Check important claims against reliable sources.",["Dates and names","Statistics","Legal or medical claims","Product specifications"])],"task":"Create a blog outline, then verify three factual claims using primary sources."},
            {"title":"Creative and Visual Work","intro":"Good visual prompting includes use, subject, composition and constraints.","sections":[("Image workflows","Use AI for concept images, backgrounds and visual variations.",["Website hero art","Ad concept exploration","Product mockups","Storyboards"]),("Quality control","Inspect details before publishing.",["Text accuracy","Hands and objects","Brand colors","Copyright and permissions"])],"task":"Write one detailed prompt for a website hero with a clear no-text constraint."},
            {"title":"Meetings, Data and Automation","intro":"AI is most valuable when it reduces repeated manual work.","sections":[("Productivity","Turn raw information into organized next steps.",["Meeting summaries","Action-item extraction","Email drafting","Spreadsheet explanation"]),("Automation","Connect stable steps only after testing.",["Lead classification","FAQ responses","Content repurposing","Weekly reporting"])],"task":"Design a three-step workflow from meeting notes to assigned tasks."},
            {"title":"Responsible Use","intro":"Do not trade speed for privacy, accuracy or trust.","sections":[("Safe use","Protect sensitive business and personal information.",["Do not paste passwords or private IDs","Review provider data controls","Remove confidential details","Keep human approval"]),("Disclosure and ownership","Know when AI assistance should be disclosed.",["Client policies","Platform rules","Originality checks","Final human accountability"])],"task":"Create a one-page AI usage checklist for your team."},
        ],
        "checklist":["Define the task","Choose the right category","Remove sensitive data","Give clear context","Check important facts","Edit in your own voice"],
    },
    {
        "file": "how-to-use-ai-practical-guide.pdf",
        "title": "How to Use AI",
        "subtitle": "A practical guide to prompting, reviewing and building repeatable AI workflows.",
        "intro": "You do not need technical knowledge to use AI well. You need a clear goal, useful context, constraints and a review process.",
        "outcomes":["Write stronger prompts","Improve weak outputs","Use AI in multi-step workflows","Keep human control"],
        "chapters":[
            {"title":"The CLEAR Prompt Method","intro":"A structured prompt reduces guessing.","sections":[("CLEAR","Use five prompt parts.",["Context: background and audience","Limit: length and boundaries","Expected output: format","Action: the task","Review criteria: what good looks like"]),("Example workflow","Ask for an outline before a long final draft.",["Define audience","Request structure","Review direction","Generate draft","Edit and verify"])],"task":"Rewrite one vague prompt using all five CLEAR parts."},
            {"title":"Give Better Context","intro":"Useful context changes the quality of the answer.","sections":[("What to include","Provide information that affects the result.",["Business type","Customer","Goal","Offer","Tone","Existing constraints"]),("What to exclude","Do not send unnecessary sensitive information.",["Passwords","Private customer data","Bank details","Unpublished confidential files"])],"task":"Create a reusable business context paragraph without private information."},
            {"title":"Control the Output","intro":"Tell AI how the result should be organized.","sections":[("Output formats","Choose a format that supports the next step.",["Checklist","Table","Email","Script","Blog outline","JSON or structured fields"]),("Constraints","Set limits that improve usefulness.",["Word count","Reading level","Required sections","Items to avoid","Call to action"])],"task":"Ask AI for the same idea as a table, a WhatsApp message and a 30-second script."},
            {"title":"Iterate and Verify","intro":"Strong AI work is usually a conversation, not one prompt.","sections":[("Targeted revision","Change one thing at a time.",["Shorten the introduction","Add stronger examples","Remove jargon","Make tone professional"]),("Verification","Check output before use.",["Facts","Calculations","Links","Compliance","Brand voice"])],"task":"Take one AI draft through three specific revision rounds and compare results."},
            {"title":"Build Repeatable Workflows","intro":"Save prompts and review steps for recurring work.","sections":[("Workflow design","Break large tasks into reviewable stages.",["Input collection","Outline","Draft","Fact check","Human edit","Publish"]),("Useful business workflows","Start with low-risk repeated work.",["Content calendar","Lead follow-up draft","Meeting summary","Report commentary","FAQ update"])],"task":"Document one weekly AI workflow with inputs, prompt, reviewer and final destination."},
        ],
        "checklist":["State the goal","Add relevant context","Specify format","Set constraints","Review facts","Edit before publishing"],
    },
]

for book in books:
    build(book)
