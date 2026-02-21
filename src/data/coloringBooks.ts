export interface Book {
  id: number;
  image: string;
  title: string;
  desc: string;
  tag: string;
}

// Use Vite's glob import so images resolve to correct URLs at build/dev time.
const images = import.meta.glob("../assets/images/coloring-books/*.webp", {
  eager: true,
  as: "url",
}) as Record<string, string>;

const img = (name: string) =>
  images[`../assets/images/coloring-books/${name}`] ??
  `../assets/images/coloring-books/${name}`;

export const coloringBooks: Book[] = [
  {
    id: 1,
    image: img("cozy-awawa.webp"),
    title: "Cozy Awawa",
    desc: "Rock Hyrax Coloring Book – Diverse Designs for Kids & Adults. Discover the charming world of rock hyraxes – adorable little mountain animals living among stones and cliffs!",
    tag: "bestseller",
  },
  {
    id: 2,
    image: img("little-reminders.webp"),
    title: "Little Reminders",
    desc: "Little Reminders is a soft, cozy, and comforting coloring book designed to help you slow down, relax, and reconnect with gentle thoughts.",
    tag: "",
  },
  {
    id: 3,
    image: img("cozy-capybaras.webp"),
    title: "Cozy Capybaras",
    desc: "Take a break, grab your favorite colors, and step into a world of calm with the Cozy Capybaras Coloring Book.",
    tag: "",
  },
  {
    id: 4,
    image: img("wrapped-in-love.webp"),
    title: "Wrapped in Love",
    desc: "Step into a world of warmth, sweetness, and romance with Wrapped in Love, a delightful Valentine's Day coloring book designed to help you relax, smile, and celebrate love in all its forms.",
    tag: "",
  },
  {
    id: 5,
    image: img("just-girly-stuff.webp"),
    title: "Just Girly Stuff",
    desc: "Just Girly Stuff is a cute and cozy coloring book created especially for girls, teens, and women who love all things aesthetic, soft, and relaxing.",
    tag: "",
  },
  {
    id: 6,
    image: img("just-awawa-days.webp"),
    title: "Just Awawa Days",
    desc: "Rock Hyrax Coloring Book, inspired by manga, anime, and kawaii art styles. Inside you'll find adorable black-and-white coloring pages.",
    tag: "",
  },
  {
    id: 7,
    image: img("zen-japan.webp"),
    title: "Zen Japan",
    desc: "Escape into the peaceful beauty of Japan with this Zen Japan Coloring Book, created to help you relax, unwind, and enjoy mindful creativity.",
    tag: "",
  },
  {
    id: 8,
    image: img("busy-little-awawa.webp"),
    title: "Busy Little Awawa",
    desc: "Meet the Busy Little Awawa — a curious rock hyrax who never gets bored!",
    tag: "",
  },
  {
    id: 9,
    image: img("merry-moments-holiday.webp"),
    title: "Merry Moments",
    desc: "Celebrate the magic of the holiday season with Merry Moments, a charming Christmas coloring book designed to bring warmth, joy, and creativity to artists of all ages.",
    tag: "",
  },
  {
    id: 10,
    image: img("little-adventures.webp"),
    title: "Little Adventures",
    desc: "Step into a charming fantasy world with the Little Adventures Coloring Book — a delightful collection of magical, easy-to-color illustrations.",
    tag: "",
  },
  {
    id: 11,
    image: img("chill-spirits.webp"),
    title: "Chill Spirits",
    desc: "Chill Spirits – Relaxing Coloring Book for Adults, Teens & Kids. Take a break from the spooky and embrace the cozy!",
    tag: "",
  },
  {
    id: 12,
    image: img("self-love.webp"),
    title: "Self Love",
    desc: "Take a moment for yourself with Self Love – a bold and easy self-care coloring book for all ages.",
    tag: "",
  },
  {
    id: 13,
    image: img("spooky-season.webp"),
    title: "Spooky Season",
    desc: "Get ready for a relaxing and fun coloring journey! This Spooky Season Coloring Book brings you unique illustrations of cute animals in autumn and Halloween settings.",
    tag: "",
  },
  {
    id: 14,
    image: img("cuteness-overload.webp"),
    title: "Cuteness Overload",
    desc: "This unique coloring book was designed with bold, thick outlines, making it perfect for stress-free coloring and relaxation.",
    tag: "",
  },
  {
    id: 15,
    image: img("dog-days-diaries.webp"),
    title: "The Dog Days Diaries",
    desc: "The Dog Days Diaries is a charming coloring book featuring delightful scenes of an adventurous little dog living life to the fullest!",
    tag: "",
  },
  {
    id: 16,
    image: img("whole-year-with-alice-and-theo.webp"),
    title: "Whole Year with Alice and Theo",
    desc: "Join Alice and Theo — two best friends — on a joyful journey through the seasons!",
    tag: "",
  },
  {
    id: 17,
    image: img("time-with-nature.webp"),
    title: "Time With Nature",
    desc: "Time with Nature is a relaxing coloring book for both kids and adults, taking you on a peaceful journey through forests, fields, and lakes.",
    tag: "",
  },
  {
    id: 18,
    image: img("no-thoughts-only-awawa.webp"),
    title: "No Thoughts, Only Awawa",
    desc: "No Thoughts, Only Awawa – Creative and Relaxing Coloring Books inspired by rock hyrax characters.",
    tag: "bestseller",
  },
  {
    id: 19,
    image: img("furry-friends.webp"),
    title: "Furry Friends Costume Party",
    desc: "Furry Friends Costume Party is a delightful coloring book featuring adorable animals in playful costumes.",
    tag: "",
  },
  {
    id: 20,
    image: img("cute-food.webp"),
    title: "Cute Food",
    desc: "Get ready for a deliciously fun coloring adventure! This adorable coloring book is filled with smiling fruits, happy veggies, and sweet treats.",
    tag: "",
  },
  {
    id: 21,
    image: img("merry-moments-holiday.webp"),
    title: "Merry Moments",
    desc: "A cozy collection of holiday and seasonal scenes to color, perfect for gifting and relaxation.",
    tag: "",
  },
  {
    id: 22,
    image: img("huggy-friends.webp"),
    title: "Huggy Friends",
    desc: "Meet Huggy Friends - a cute and relaxing animal coloring book made for both kids and adults who love sweet characters and cozy moments.",
    tag: "",
  },
];
