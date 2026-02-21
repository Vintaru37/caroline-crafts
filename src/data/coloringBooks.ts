export interface Book {
  id: number;
  image: string;
  title: string;
  desc: string;
  tag: string;
}

export const coloringBooks: Book[] = [
  {
    id: 1,
    image: new URL(
      "../assets/images/coloring-books/cozy-awawa.webp",
      import.meta.url,
    ).href,
    title: "Cozy Awawa",
    desc: "Rock Hyrax Coloring Book – Diverse Designs for Kids & Adults. Discover the charming world of rock hyraxes – adorable little mountain animals living among stones and cliffs!",
    tag: "Bestseller",
  },
  {
    id: 2,
    image: new URL(
      "../assets/images/coloring-books/little-reminders.webp",
      import.meta.url,
    ).href,
    title: "Little Reminders",
    desc: "Little Reminders is a soft, cozy, and comforting coloring book designed to help you slow down, relax, and reconnect with gentle thoughts.",
    tag: "",
  },
  {
    id: 3,
    image: new URL(
      "../assets/images/coloring-books/cozy-capybaras.webp",
      import.meta.url,
    ).href,
    title: "Cozy Capybaras",
    desc: "Take a break, grab your favorite colors, and step into a world of calm with the Cozy Capybaras Coloring Book.",
    tag: "",
  },
  {
    id: 4,
    image: new URL(
      "../assets/images/coloring-books/wrapped-in-love.webp",
      import.meta.url,
    ).href,
    title: "Wrapped in Love",
    desc: "Step into a world of warmth, sweetness, and romance with Wrapped in Love, a delightful Valentine's Day coloring book designed to help you relax, smile, and celebrate love in all its forms.",
    tag: "",
  },
  {
    id: 5,
    image: new URL(
      "../assets/images/coloring-books/just-girly-stuff.webp",
      import.meta.url,
    ).href,
    title: "Just Girly Stuff",
    desc: "Just Girly Stuff is a cute and cozy coloring book created especially for girls, teens, and women who love all things aesthetic, soft, and relaxing.",
    tag: "",
  },
  {
    id: 6,
    image: new URL(
      "../assets/images/coloring-books/just-awawa-days.webp",
      import.meta.url,
    ).href,
    title: "Just Awawa Days",
    desc: "Rock Hyrax Coloring Book, inspired by manga, anime, and kawaii art styles. Inside you'll find adorable black-and-white coloring pages.",
    tag: "",
  },
  {
    id: 7,
    image: new URL(
      "../assets/images/coloring-books/zen-japan.webp",
      import.meta.url,
    ).href,
    title: "Zen Japan",
    desc: "Escape into the peaceful beauty of Japan with this Zen Japan Coloring Book, created to help you relax, unwind, and enjoy mindful creativity.",
    tag: "",
  },
  {
    id: 8,
    image: new URL(
      "../assets/images/coloring-books/busy-little-awawa.webp",
      import.meta.url,
    ).href,
    title: "Busy Little Awawa",
    desc: "Meet the Busy Little Awawa — a curious rock hyrax who never gets bored!",
    tag: "",
  },
  {
    id: 9,
    image: new URL(
      "../assets/images/coloring-books/merry-moments-holiday.webp",
      import.meta.url,
    ).href,
    title: "Merry Moments",
    desc: "Celebrate the magic of the holiday season with Merry Moments, a charming Christmas coloring book designed to bring warmth, joy, and creativity to artists of all ages.",
    tag: "",
  },
  {
    id: 10,
    image: new URL(
      "../assets/images/coloring-books/little-adventures.webp",
      import.meta.url,
    ).href,
    title: "Little Adventures",
    desc: "Step into a charming fantasy world with the Little Adventures Coloring Book — a delightful collection of magical, easy-to-color illustrations.",
    tag: "",
  },
  {
    id: 11,
    image: new URL(
      "../assets/images/coloring-books/chill-spirits.webp",
      import.meta.url,
    ).href,
    title: "Chill Spirits",
    desc: "Chill Spirits – Relaxing Coloring Book for Adults, Teens & Kids. Take a break from the spooky and embrace the cozy!",
    tag: "",
  },
  {
    id: 12,
    image: new URL(
      "../assets/images/coloring-books/self-love.webp",
      import.meta.url,
    ).href,
    title: "Self Love",
    desc: "Take a moment for yourself with Self Love – a bold and easy self-care coloring book for all ages.",
    tag: "",
  },
  {
    id: 13,
    image: new URL(
      "../assets/images/coloring-books/spooky-season.webp",
      import.meta.url,
    ).href,
    title: "Spooky Season",
    desc: "Get ready for a relaxing and fun coloring journey! This Spooky Season Coloring Book brings you unique illustrations of cute animals in autumn and Halloween settings.",
    tag: "",
  },
  {
    id: 14,
    image: new URL(
      "../assets/images/coloring-books/cuteness-overload.webp",
      import.meta.url,
    ).href,
    title: "Cuteness Overload",
    desc: "This unique coloring book was designed with bold, thick outlines, making it perfect for stress-free coloring and relaxation.",
    tag: "",
  },
  {
    id: 15,
    image: new URL(
      "../assets/images/coloring-books/dog-days-diaries.webp",
      import.meta.url,
    ).href,
    title: "The Dog Days Diaries",
    desc: "The Dog Days Diaries is a charming coloring book featuring delightful scenes of an adventurous little dog living life to the fullest!",
    tag: "",
  },
  {
    id: 16,
    image: new URL(
      "../assets/images/coloring-books/whole-year-with-alice-and-theo.webp",
      import.meta.url,
    ).href,
    title: "Whole Year with Alice and Theo",
    desc: "Join Alice and Theo — two best friends — on a joyful journey through the seasons!",
    tag: "",
  },
  {
    id: 17,
    image: new URL(
      "../assets/images/coloring-books/time-with-nature.webp",
      import.meta.url,
    ).href,
    title: "Time With Nature",
    desc: "Time with Nature is a relaxing coloring book for both kids and adults, taking you on a peaceful journey through forests, fields, and lakes.",
    tag: "",
  },
  {
    id: 18,
    image: new URL(
      "../assets/images/coloring-books/no-thoughts-only-awawa.webp",
      import.meta.url,
    ).href,
    title: "No Thoughts, Only Awawa",
    desc: "No Thoughts, Only Awawa – Creative and Relaxing Coloring Books inspired by rock hyrax characters.",
    tag: "",
  },
  {
    id: 19,
    image: new URL(
      "../assets/images/coloring-books/furry-friends.webp",
      import.meta.url,
    ).href,
    title: "Furry Friends Costume Party",
    desc: "Furry Friends Costume Party is a delightful coloring book featuring adorable animals in playful costumes.",
    tag: "",
  },
  {
    id: 20,
    image: new URL(
      "../assets/images/coloring-books/cute-food.webp",
      import.meta.url,
    ).href,
    title: "Cute Food",
    desc: "Get ready for a deliciously fun coloring adventure! This adorable coloring book is filled with smiling fruits, happy veggies, and sweet treats.",
    tag: "",
  },
  {
    id: 21,
    image: new URL(
      "../assets/images/coloring-books/merry-moments-holiday.webp",
      import.meta.url,
    ).href,
    title: "Merry Moments",
    desc: "A cozy collection of holiday and seasonal scenes to color, perfect for gifting and relaxation.",
    tag: "",
  },
];
