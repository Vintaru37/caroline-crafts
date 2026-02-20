export interface Book {
  id: number;
  emoji: string;
  title: string;
  desc: string;
  pages: string;
  size: string;
  gradient: string;
  tag: string;
}

export const coloringBooks: Book[] = [
  {
    id: 1,
    emoji: "🌸",
    title: "Dream Garden",
    desc: "A lush garden full of flowers, butterflies and delicate patterns. Perfect for nature lovers.",
    pages: "50 pages",
    size: "A4",
    gradient: "linear-gradient(135deg, #F9D0CE, #F297A0)",
    tag: "Bestseller",
  },
  {
    id: 2,
    emoji: "🦋",
    title: "Butterfly World",
    desc: "Breathtaking butterflies and flowers in detailed patterns. Pure relaxation on every page.",
    pages: "40 pages",
    size: "A4",
    gradient: "linear-gradient(135deg, #fce4ec, #f8bbd9)",
    tag: "New",
  },
  {
    id: 3,
    emoji: "🔮",
    title: "Peaceful Mandala",
    desc: "Symmetric mandalas at various difficulty levels. Meditation through coloring.",
    pages: "48 pages",
    size: "A4",
    gradient: "linear-gradient(135deg, #EADec8, #F3EBD8)",
    tag: "",
  },
  {
    id: 4,
    emoji: "🌿",
    title: "Enchanted Forest",
    desc: "A magical forest with woodland animals, mushrooms and wildflowers. Magic on every page.",
    pages: "44 pages",
    size: "A4",
    gradient: "linear-gradient(135deg, #dfe3c0, #B6BB79)",
    tag: "",
  },
  {
    id: 5,
    emoji: "🌺",
    title: "Tropical Flowers",
    desc: "Exotic tropical blooms – hibiscus, orchids, plumeria. A vacation on paper.",
    pages: "36 pages",
    size: "A5",
    gradient: "linear-gradient(135deg, #F9D0CE, #fce4ec)",
    tag: "New",
  },
  {
    id: 6,
    emoji: "⭐",
    title: "Celestial Dreams",
    desc: "Moon, stars and cosmic patterns. For those who dream of the infinite.",
    pages: "42 pages",
    size: "A4",
    gradient: "linear-gradient(135deg, #F3EBD8, #EADec8)",
    tag: "",
  },
];
