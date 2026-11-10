import os
import pymupdf
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def build_pdf(output_path):
    # Standard 1-page resume geometry: 0.45 in (32.4 pt) side margins, 0.4 in (28.8 pt) top/bottom margins
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=32.4,
        rightMargin=32.4,
        topMargin=26.0,
        bottomMargin=26.0,
    )

    styles = getSampleStyleSheet()

    # Colors
    PRIMARY = colors.HexColor("#0f172a")     # Slate 900
    ACCENT = colors.HexColor("#e11d48")      # Rose / Accent
    TEXT = colors.HexColor("#334155")        # Slate 700
    MUTED = colors.HexColor("#64748b")       # Slate 500
    LINE_COLOR = colors.HexColor("#e2e8f0")  # Slate 200

    # Custom Typographic Hierarchy
    name_style = ParagraphStyle(
        "ResumeName",
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=22,
        textColor=PRIMARY,
        alignment=TA_CENTER,
        spaceAfter=3,
    )

    title_style = ParagraphStyle(
        "ResumeTitle",
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=12,
        textColor=ACCENT,
        alignment=TA_CENTER,
        spaceAfter=5,
    )

    contact_style = ParagraphStyle(
        "ResumeContact",
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=TEXT,
        alignment=TA_CENTER,
        spaceAfter=6,
    )

    section_heading_style = ParagraphStyle(
        "SectionHeading",
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=12,
        textColor=PRIMARY,
        spaceBefore=5,
        spaceAfter=2,
    )

    body_style = ParagraphStyle(
        "ResumeBody",
        fontName="Helvetica",
        fontSize=8,
        leading=10.5,
        textColor=TEXT,
        alignment=TA_LEFT,
    )

    bold_body_style = ParagraphStyle(
        "ResumeBoldBody",
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10.5,
        textColor=PRIMARY,
    )

    bullet_style = ParagraphStyle(
        "ResumeBullet",
        fontName="Helvetica",
        fontSize=7.8,
        leading=10.2,
        textColor=TEXT,
        leftIndent=10,
        firstLineIndent=-10,
        spaceAfter=1.5,
    )

    project_title_style = ParagraphStyle(
        "ProjectTitle",
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=PRIMARY,
    )

    project_meta_style = ParagraphStyle(
        "ProjectMeta",
        fontName="Helvetica-Oblique",
        fontSize=7.5,
        leading=10.5,
        textColor=MUTED,
        alignment=TA_RIGHT,
    )

    def section_divider(title):
        elements = []
        p = Paragraph(f"<b>{title.upper()}</b>", section_heading_style)
        elements.append(p)
        elements.append(HRFlowable(width="100%", thickness=0.8, color=LINE_COLOR, spaceAfter=4, spaceBefore=1))
        return elements

    story = []

    # 1. HEADER
    story.append(Paragraph("HAFIZ YOOSUF", name_style))
    story.append(Paragraph("MOTION GRAPHICS &amp; INTERACTION DESIGNER", title_style))
    
    contacts_line_1 = (
        'Email: <a href="mailto:hafizyoosuf710@gmail.com" color="#e11d48"><u>hafizyoosuf710@gmail.com</u></a> &nbsp;|&nbsp; '
        'WhatsApp/Phone: <a href="https://wa.me/918592882354" color="#e11d48"><u>+91 8592882354</u></a> &nbsp;|&nbsp; '
        'Portfolio: <a href="https://hafizyoosuf.com" color="#e11d48"><u>hafizyoosuf.com</u></a>'
    )
    contacts_line_2 = (
        'Showreel/YouTube: <a href="https://www.youtube.com/@zafkiel3429" color="#e11d48"><u>youtube.com/@zafkiel3429</u></a> &nbsp;|&nbsp; '
        'Discord: <font color="#0f172a"><b>z4k1el</b></font> &nbsp;|&nbsp; '
        'GitHub: <a href="https://github.com/tfz4k1el" color="#e11d48"><u>github.com/tfz4k1el</u></a> &nbsp;|&nbsp; '
        'X / Instagram: <font color="#0f172a"><b>@z4f3x / @z4rchx</b></font>'
    )
    story.append(Paragraph(contacts_line_1, contact_style))
    story.append(Paragraph(contacts_line_2, contact_style))
    story.append(Spacer(1, 1))

    # 2. PROFESSIONAL SUMMARY
    story.extend(section_divider("Professional Summary"))
    summary_text = (
        "Detail-driven <b>Motion Graphics &amp; Interaction Designer</b> with 2+ years of independent and freelance experience "
        "transforming creative briefs into high-impact animations across digital products, marketing campaigns, and brand identity systems. "
        "High proficiency in <b>After Effects, Premiere Pro, Illustrator, Photoshop, and Figma</b>. Recognized for combining rhythmic pacing "
        "(kinetic typography, audio-sync, emotional timing) with sophisticated <b>UI/UX motion choreography</b> and <b>2.5D spatial camera animation</b>. "
        "Adept at managing end-to-end production pipelines from concept storyboarding to final multi-platform delivery."
    )
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 3))

    # 3. CORE COMPETENCIES & TECHNICAL SKILLS
    story.extend(section_divider("Technical Skills & Core Competencies"))
    skills_data = [
        [
            Paragraph("<b>Motion &amp; Animation:</b>", bold_body_style),
            Paragraph("2D Animation, Kinetic Typography, UI/UX Motion Choreography, Logo &amp; Identity Animation, Loop Architecture, Storyboarding, Explainer Videos, Product Teasers.", body_style)
        ],
        [
            Paragraph("<b>Software &amp; Tools:</b>", bold_body_style),
            Paragraph("<b>Adobe After Effects</b>, <b>Premiere Pro</b>, <b>Illustrator</b>, <b>Photoshop</b>, <b>Figma</b>, Media Encoder, Lottie.", body_style)
        ],
        [
            Paragraph("<b>Spatial &amp; 2.5D:</b>", bold_body_style),
            Paragraph("3D Camera Tracking &amp; Null Rigging in AE, Parallax Depth, Isometric Projection, Spatial Typography, AE Cinema 4D Lite / Ray-Traced Compositing.", body_style)
        ],
        [
            Paragraph("<b>Audio &amp; Timing:</b>", bold_body_style),
            Paragraph("Waveform Beat-Matching (AMV editing expertise), Sound FX (SFX) &amp; Voiceover Integration, Custom Easing Curves, Color Grading, Encoding (WebM/MP4).", body_style)
        ]
    ]
    col_widths = [115, doc.width - 115]
    t_skills = Table(skills_data, colWidths=col_widths)
    t_skills.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1.5),
        ('TOPPADDING', (0,0), (-1,-1), 1.5),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_skills)
    story.append(Spacer(1, 3))

    # 4. WORK EXPERIENCE
    story.extend(section_divider("Experience"))
    exp_header = [
        [
            Paragraph("<b>Freelance Motion Graphics &amp; UI Designer</b>", project_title_style),
            Paragraph("<b>2024 – Present</b> | Remote", project_meta_style)
        ]
    ]
    t_exp = Table(exp_header, colWidths=[350, doc.width - 350])
    t_exp.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'BOTTOM'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_exp)
    
    exp_bullets = [
        "<b>End-to-End Production:</b> Spearheaded motion graphics and UI animation assets for tech startups, creative agencies, and independent creators, delivering 15+ animated campaigns, UI interactions, and brand identities.",
        "<b>Storyboarding &amp; Execution:</b> Transformed ambiguous creative briefs and wireframes into narrative animatics, kinetic typography sequences, and interactive motion guidelines adhering to tight production schedules.",
        "<b>Cross-Functional Collaboration:</b> Partnered with marketing leads, video editors, and UI/UX designers to deliver high-retention motion assets tailored for web performance and social media engagement.",
        "<b>Audio &amp; Narrative Sync:</b> Engineered dynamic audio-visual synchronization incorporating voiceovers, ambient soundscapes, and beat-matched SFX to enhance narrative impact and retention.",
        "<b>Brand Identity Governance:</b> Built unified brand motion systems featuring custom easing curves, loop architectures, and timing tokens that ensured visual harmony across multiple client touchpoints."
    ]
    for b in exp_bullets:
        story.append(Paragraph(f"• {b}", bullet_style))
    story.append(Spacer(1, 3))

    # 5. FEATURED MOTION & INTERACTION PROJECTS
    story.extend(section_divider("Featured Motion &amp; Interaction Projects"))

    projects = [
        (
            "Extraordinary — Kinetic Typography &amp; Brand Art Direction",
            "After Effects, Photoshop, Premiere Pro",
            [
                "Directed and animated an expressive kinetic typography showcase featuring rapid-fire text choreography, chromatic dispersion, and beat-matched cuts.",
                "Utilized 3D camera tracking, spatial typography, and layered compositions to maximize brand recall and viewer retention on social media."
            ]
        ),
        (
            "StockBud — Fintech UI Motion &amp; Data Visualization",
            "After Effects, Figma, Illustrator",
            [
                "Choreographed product animation sequences and data-driven charts for a modern trading application, communicating financial momentum and clarity.",
                "Engineered real-time visual feedback loops, micro-interactions, and fluid transitions that demystified complex financial workflows."
            ]
        ),
        (
            "Infinity — Community Motion &amp; Promo Video",
            "After Effects, Illustrator, Media Encoder",
            [
                "Produced dynamic promo video for Infinity's 10k+ WhatsApp community, utilizing seamless loop architecture, pacing, and brand identity motion."
            ]
        ),
        (
            "Muster AI &amp; T2Chat — Product Launch &amp; Concept Motion",
            "After Effects, Figma, Premiere Pro",
            [
                "Choreographed launch promo and interface explainer animations for conversational AI platforms, solving user perception during message latency."
            ]
        ),
        (
            "nxstudio &amp; Vireclub — Product UI/UX &amp; Workflow Architecture",
            "Figma, Illustrator, React",
            [
                "Designed full application UI, architecture workflows, and design systems for nxstudio (Cursor IDE prompt engine) and Vireclub's loyalty app."
            ]
        )
    ]

    for title, tools, bullets in projects:
        p_row = [
            [
                Paragraph(f"<b>{title}</b>", project_title_style),
                Paragraph(f"<i>{tools}</i>", project_meta_style)
            ]
        ]
        t_proj = Table(p_row, colWidths=[360, doc.width - 360])
        t_proj.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'BOTTOM'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0.5),
            ('TOPPADDING', (0,0), (-1,-1), 1.5),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(t_proj)
        for b in bullets:
            story.append(Paragraph(f"• {b}", bullet_style))

    story.append(Spacer(1, 3))

    # 6. EDUCATION
    story.extend(section_divider("Education"))
    edu_table = [
        [
            Paragraph("<b>Bachelor of Technology / Engineering</b> (In Progress) &nbsp;|&nbsp; <i>Interactive Systems &amp; Software</i>", body_style),
            Paragraph("<b>Expected 2027 / 2028</b>", project_meta_style)
        ]
    ]
    t_edu = Table(edu_table, colWidths=[400, doc.width - 400])
    t_edu.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_edu)

    doc.build(story)

    # Validate output
    pdf_doc = pymupdf.open(output_path)
    page_count = len(pdf_doc)
    print(f"Generated PDF: {output_path} | Page Count: {page_count}")
    return page_count

if __name__ == "__main__":
    artifact_path = r"C:\Users\Hafiz\.gemini\antigravity\brain\c54c607c-b3b2-4506-b36f-f0c7b50f3fd6\Hafiz_Yoosuf_Resume.pdf"
    public_path = r"D:\portfolio-new\public\Hafiz_Yoosuf_Resume.pdf"
    
    pages = build_pdf(artifact_path)
    # Also write to public folder
    build_pdf(public_path)
