export interface Notebook {
  id: number;
  image: string;
  title: string;
  desc: string;
  type: string;
  tag: string;
}
// Resolve notebook images via Vite's glob so URLs work in dev and prod builds
const images = import.meta.glob("../assets/images/notebooks/*.{png,webp,jpg}", {
  eager: true,
  as: "url",
}) as Record<string, string>;

const img = (name: string) =>
  images[`../assets/images/notebooks/${name}`] ??
  `../assets/images/notebooks/${name}`;

export const notebooks: Notebook[] = [
  {
    id: 1,
    image: img("cute-axolotl.webp"),
    title: "Cute Axolotl",
    desc: "Make school and writing more fun with this Cute Axolotl Composition Notebook! The cover features an adorable pink axolotl surrounded by bubbles, stars, shells, and underwater plants in a colorful kawaii style.",
    type: "Bullet Journal",
    tag: "Bestseller",
  },
  {
    id: 2,
    image: img("coquette-bunny.webp"),
    title: "Coquette Bunny",
    desc: "Enter a dreamy fairytale world with this Coquette Bunny Lined Notebook.",
    type: "Lined",
    tag: "",
  },
  // {
  //   id: 3,
  //   image: img("dream-journal.webp"),
  //   title: "Dream Journal",
  //   desc: "A five-minute journal with motivational prompts. Start every day with gratitude.",
  //   type: "Journal",
  //   tag: "",
  // },
  // {
  //   id: 4,
  //   image: img("weekly-planner.webp"),
  //   title: "Weekly Planner",
  //   desc: "A weekly planner with space for priorities, habits and notes. Your organisation in a beautiful edition.",
  //   type: "Planner",
  //   tag: "New",
  // },
  // {
  //   id: 5,
  //   image: img("recipe.webp"),
  //   title: "Recipe Notebook",
  //   desc: "A dedicated notebook for recording favourite recipes with beautiful botanical illustrations.",
  //   type: "Themed",
  //   tag: "",
  // },
  {
    id: 6,
    image: img("cute-coquette-bunny.webp"),
    title: "Cute Coquette Bunny",
    desc: "Step into a dreamy, romantic world with this Cute Bunny Coquette Lined Notebook.",
    type: "Lined",
    tag: "",
  },
  {
    id: 7,
    image: img("happy-like-quokka.webp"),
    title: "Happy Like Quokka",
    desc: "This adorable notebook is a true boost of positive energy!",
    type: "Journal",
    tag: "",
  },
  {
    id: 8,
    image: img("awawa-rock-hyrax-love.webp"),
    title: "Awawa Rock Hyrax",
    desc: "Celebrate love in the cutest way possible with this Awawa Rock Hyrax Love Notebook.",
    type: "Lined",
    tag: "",
  },
  {
    id: 9,
    image: img("be-my-valentine.webp"),
    title: "Be My Valentine",
    desc: "Looking for a sweet and unique Valentine’s Day gift? This Valentine’s Day notebook features a cute animal love design with an adorable Awawa (rock hyrax) couple.",
    type: "Lined",
    tag: "",
  },
  {
    id: 10,
    image: img("rock-hyrax-valentine.webp"),
    title: "Rock Hyrax Valentine",
    desc: "Fall in love with cuteness! This Rock Hyrax Valentine Lined Notebook features an adorable rock hyrax wearing heart-shaped glasses, surrounded by floating hearts in a soft watercolor style.",
    type: "Lined",
    tag: "",
  },
  {
    id: 11,
    image: img("better-with-you.webp"),
    title: "The World Is Better With You In It",
    desc: "You matter. The world is better with you in it.",
    type: "Composition",
    tag: "",
  },
  {
    id: 12,
    image: img("no-need-to-rush.webp"),
    title: "There’s No Need to Rush",
    desc: "Take a breath. You don’t have to rush.",
    type: "Lined",
    tag: "",
  },
  {
    id: 13,
    image: img("cute-kawaii-rock-hyrax.webp"),
    title: "Kawaii Rock Hyrax Awawa",
    desc: "Add a touch of sweetness and calm to your everyday writing with this Cute Kawaii Rock Hyrax Lined Notebook.",
    type: "Lined",
    tag: "",
  },
  {
    id: 14,
    image: img("cute-kawaii-opossum.webp"),
    title: "Kawaii Opossum",
    desc: "Fall in love with cozy nighttime vibes with this Cute Kawaii Opossum Lined Notebook!",
    type: "Lined",
    tag: "",
  },
  {
    id: 15,
    image: img("eat-healthy-awawa.webp"),
    title: "Eat Healthy Rock Hyrax",
    desc: "Eat Healthy, Write Freely!",
    type: "Lined",
    tag: "",
  },
  {
    id: 16,
    image: img("cute-otter-grid.webp"),
    title: "Cute Otter",
    desc: "Stay organized and creative with this Cute Otter Grid Notebook, featuring a sweet watercolor otter holding a little stone on the cover.",
    type: "Grid",
    tag: "",
  },
  {
    id: 17,
    image: img("christmas-ornaments-rock-hyrax.webp"),
    title: "Christmas Ornaments Rock Hyrax",
    desc: "Write your holiday notes in cozy style with this Cute Rock Hyrax Lined Notebook!",
    type: "Lined",
    tag: "",
  },
  {
    id: 18,
    image: img("cute-quokka-grid.webp"),
    title: "Cute Quokka",
    desc: "Stay organized and inspired with this Cute Quokka Grid Notebook, featuring an adorable watercolor quokka holding a little green leaf",
    type: "Grid",
    tag: "",
  },
  {
    id: 19,
    image: img("hyrax-santa-hat.webp"),
    title: "Santa Hat Rock Hyrax",
    desc: "Bring smiles, relaxation, and a little holiday humor to your writing with this Cute Rock Hyrax Christmas Notebook!",
    type: "Lined",
    tag: "",
  },
  {
    id: 20,
    image: img("ready-for-christmas.webp"),
    title: "Christmas Rock Hyrax",
    desc: "Celebrate the holiday season with this charming Rock Hyrax Christmas Notebook!",
    type: "Lined",
    tag: "",
  },
];
