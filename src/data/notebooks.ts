export interface Notebook {
  id: number;
  emoji: string;
  title: string;
  desc: string;
  pages: string;
  type: string;
  gradient: string;
  tag: string;
}

export const notebooks: Notebook[] = [
  {
    id: 1,
    emoji: "🌿",
    title: "Bullet Journal Rose",
    desc: "Dotted bullet journal with a rose cover. The perfect space for planning and creative note-taking.",
    pages: "160 pages",
    type: "Bullet Journal",
    gradient: "linear-gradient(135deg, #F9D0CE, #F297A0)",
    tag: "Bestseller",
  },
  {
    id: 2,
    emoji: "🌷",
    title: "Pastel Notebook",
    desc: "Lined pages in soft pastel tones. Your faithful everyday companion.",
    pages: "120 pages",
    type: "Lined",
    gradient: "linear-gradient(135deg, #fce4ec, #F9D0CE)",
    tag: "",
  },
  {
    id: 3,
    emoji: "✏️",
    title: "Floral Sketchbook",
    desc: "Clean white pages for your drawings and sketches. A floral cover, endless inspiration.",
    pages: "80 pages",
    type: "Sketchbook",
    gradient: "linear-gradient(135deg, var(--yucca), #EADec8)",
    tag: "New",
  },
  {
    id: 4,
    emoji: "🌸",
    title: "Dream Journal",
    desc: "A five-minute journal with motivational prompts. Start every day with gratitude.",
    pages: "200 pages",
    type: "Journal",
    gradient: "linear-gradient(135deg, #dfe3c0, #B6BB79)",
    tag: "",
  },
  {
    id: 5,
    emoji: "📋",
    title: "Weekly Planner",
    desc: "A weekly planner with space for priorities, habits and notes. Your organisation in a beautiful edition.",
    pages: "52 weeks",
    type: "Planner",
    gradient: "linear-gradient(135deg, #F3EBD8, #F9D0CE)",
    tag: "New",
  },
  {
    id: 6,
    emoji: "📖",
    title: "Recipe Notebook",
    desc: "A dedicated notebook for recording favourite recipes with beautiful botanical illustrations.",
    pages: "100 pages",
    type: "Themed",
    gradient: "linear-gradient(135deg, #F9D0CE, #EADec8)",
    tag: "",
  },
];
