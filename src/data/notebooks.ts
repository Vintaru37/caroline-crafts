export interface Notebook {
  id: number;
  image: string;
  title: string;
  desc: string;
  type: string;
  tag: string;
}

export const notebooks: Notebook[] = [
  {
    id: 1,
    image: new URL("../assets/images/notebooks/1.png", import.meta.url).href,
    title: "Bullet Journal Rose",
    desc: "Dotted bullet journal with a rose cover. The perfect space for planning and creative note-taking.",
    type: "Bullet Journal",
    tag: "Bestseller",
  },
  {
    id: 2,
    image: new URL("../assets/images/notebooks/2.png", import.meta.url).href,
    title: "Pastel Notebook",
    desc: "Lined pages in soft pastel tones. Your faithful everyday companion.",
    type: "Lined",
    tag: "",
  },
  {
    id: 3,
    image: new URL("../assets/images/notebooks/3.png", import.meta.url).href,
    title: "Floral Sketchbook",
    desc: "Clean white pages for your drawings and sketches. A floral cover, endless inspiration.",
    type: "Sketchbook",
    tag: "New",
  },
  {
    id: 4,
    image: new URL("../assets/images/notebooks/4.png", import.meta.url).href,
    title: "Dream Journal",
    desc: "A five-minute journal with motivational prompts. Start every day with gratitude.",
    type: "Journal",
    tag: "",
  },
  {
    id: 5,
    image: new URL("../assets/images/notebooks/5.png", import.meta.url).href,
    title: "Weekly Planner",
    desc: "A weekly planner with space for priorities, habits and notes. Your organisation in a beautiful edition.",
    type: "Planner",
    tag: "New",
  },
  {
    id: 6,
    image: new URL("../assets/images/notebooks/6.png", import.meta.url).href,
    title: "Recipe Notebook",
    desc: "A dedicated notebook for recording favourite recipes with beautiful botanical illustrations.",
    type: "Themed",
    tag: "",
  },
];
