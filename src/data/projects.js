export const PROJECTS = [
  {
    id: "noveo",
    src: "/assets/projects/ui/Noveo.webp",
    mediaType: "image",
    title: "Noveo",
    category: "UI · Community",
    aspect: "16 / 10",
    description: "UI/UX design for a community of writers and readers, featuring a distraction-free novel reading interface and publishing workflows created in Figma and Illustrator.",
  },
  {
    id: "stockbud",
    src: "/assets/projects/motion/StockBud.webm",
    mediaType: "video",
    title: "StockBud",
    category: "Motion · Promo",
    aspect: "16 / 9",
    description: "Launch promo video for StockBud, a social platform built for investors — designed and animated entirely in After Effects.",
  },
  {
    id: "vireclub",
    src: "/assets/projects/ui/Vire.webp",
    mediaType: "image",
    title: "Vireclub",
    category: "UI · Loyalty",
    aspect: "16 / 10",
    description: "UI/UX design for an invite-only loyalty app for users. Vire is a B2C platform providing customer loyalty infrastructure for businesses.",
  },
  {
    id: "t2chat",
    src: "/assets/projects/motion/T2Chat.webm",
    mediaType: "video",
    title: "T2Chat",
    category: "Motion · Promo",
    aspect: "16 / 9",
    description: "Product promo video for a T2Chat fork, animated in After Effects to showcase conversational responsiveness and intelligent messaging workflows.",
  },
  {
    id: "pixel-art-game",
    src: "/assets/projects/ui/asmitha.webp",
    mediaType: "image",
    title: "2D Pixel Art Game",
    category: "Game · Web",
    aspect: "3 / 4",
    description: "Crafted custom pixel art in Figma and engineered a simple, navigable treasure hunt experience using React.",
  },
  {
    id: "vire",
    src: "/assets/projects/motion/Vireclub.webm",
    mediaType: "video",
    title: "Vire",
    category: "Motion · Launch",
    aspect: "16 / 9",
    description: "Launch video and product motion graphics introducing the Vire app and its core value proposition.",
  },
  {
    id: "nxstudio",
    src: "/assets/projects/ui/nxhuman.webp",
    mediaType: "image",
    title: "nxstudio",
    category: "UI · Product",
    aspect: "16 / 10",
    description: "Product design, UI workflows, and full application interface for nxstudio — architecting tech stacks and production-ready prompts for AI IDEs like Cursor.",
  },
  {
    id: "extraordinary",
    src: "/assets/projects/motion/Extraordinary.webm",
    mediaType: "video",
    title: "Extraordinary",
    category: "Motion · Direction",
    aspect: "16 / 9",
    description: "Art direction and dynamic kinetic typography designed for bold, expressive brand presence.",
  },
  {
    id: "muster-ai",
    src: "/assets/projects/motion/Muster AI.webm",
    mediaType: "video",
    title: "Muster AI",
    category: "Motion · Launch",
    aspect: "16 / 9",
    description: "Official launch video for Muster AI, featuring conceptual product animation and fluid interface choreography.",
  },
  {
    id: "infinity",
    src: "/assets/projects/motion/Infinity.webm",
    mediaType: "video",
    title: "Infinity",
    category: "Motion · Community",
    aspect: "9 / 16",
    description: "Promo video for Infinity, a WhatsApp community of 10,000+ members — animated with dynamic loop architecture and brand pacing.",
  },
];

// 3-column layout distribution (Infinity is positioned at the very end of column 3)
export const PROJECT_COLUMNS = [
  [PROJECTS[0], PROJECTS[3], PROJECTS[6]],              // Noveo, T2Chat, nxstudio
  [PROJECTS[1], PROJECTS[4], PROJECTS[7]],              // StockBud, 2D Pixel Art Game, Extraordinary
  [PROJECTS[2], PROJECTS[5], PROJECTS[8], PROJECTS[9]], // Vireclub, Vire, Muster AI, Infinity
];
