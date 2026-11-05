export const PROJECTS = [
  {
    id: "infinity",
    src: "/assets/projects/motion/Infinity.webm",
    mediaType: "video",
    title: "Infinity",
    category: "Motion · Identity",
    aspect: "16 / 9",
    description: "A motion identity built on the logic of continuation — easing standards, loop architecture, and timing that holds across every brand touchpoint.",
  },
  {
    id: "noveo",
    src: "/assets/projects/ui/Noveo.webp",
    mediaType: "image",
    title: "Noveo",
    category: "UI · SaaS",
    aspect: "16 / 10",
    description: "End-to-end interface design for a B2B platform. A component system built for scale, with navigation that reduces cognitive load at every tier.",
  },
  {
    id: "stockbud",
    src: "/assets/projects/motion/StockBud.webm",
    mediaType: "video",
    title: "StockBud",
    category: "Motion · Fintech",
    aspect: "16 / 9",
    description: "Motion design for a fintech trading app — data-driven charts, transitions, and real-time feedback that communicate momentum.",
  },
  {
    id: "vire",
    src: "/assets/projects/ui/Vire.webp",
    mediaType: "image",
    title: "Vire",
    category: "UI · Web3",
    aspect: "16 / 10",
    description: "Interface design for a decentralised platform. A clean system that abstracts blockchain complexity and friction.",
  },
  {
    id: "t2chat",
    src: "/assets/projects/motion/T2Chat.webm",
    mediaType: "video",
    title: "T2Chat",
    category: "Motion · AI",
    aspect: "16 / 9",
    description: "A motion system for AI messaging, tuned to make response latency feel intentional instead of like waiting.",
  },
  {
    id: "asmitha",
    src: "/assets/projects/ui/asmitha.webp",
    mediaType: "image",
    title: "Asmitha",
    category: "UI · Portfolio",
    aspect: "16 / 10",
    description: "A typography-led portfolio for a creative professional, with motion that surfaces work without getting in the way.",
  },
  {
    id: "vireclub",
    src: "/assets/projects/motion/Vireclub.webm",
    mediaType: "video",
    title: "Vireclub",
    category: "Motion · Community",
    aspect: "16 / 9",
    description: "A web3 community motion identity, built with subtle animations that reinforce an earned sense of exclusivity.",
  },
  {
    id: "nxhuman",
    src: "/assets/projects/ui/nxhuman.webp",
    mediaType: "image",
    title: "NxHuman",
    category: "UI · Agency",
    aspect: "16 / 10",
    description: "A design-agency website with a bold type system, restrained colour, and motion that demonstrates craft rather than describing it.",
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
    category: "Motion · Concept",
    aspect: "16 / 9",
    description: "Conceptual product animation and interface choreography built for intelligent AI workflows.",
  },
];

// 3-column layout distribution
export const PROJECT_COLUMNS = [
  [PROJECTS[0], PROJECTS[3], PROJECTS[6], PROJECTS[8]], // Infinity, Vire, Vireclub, Extraordinary
  [PROJECTS[1], PROJECTS[4], PROJECTS[7]],              // Noveo, T2Chat, NxHuman
  [PROJECTS[2], PROJECTS[5], PROJECTS[9]],              // StockBud, Asmitha, Muster AI
];
