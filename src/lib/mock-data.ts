export type Category = "sports" | "technical" | "academics" | "more";

export type Tournament = {
  id: string;
  category: Category;
  sport: string;
  name: string;
  organizer: string;
  venue: string;
  city: string;
  date: string;
  prizePool: string;
  entryFee: string;
  slots: string;
  rating: number;
  isLive?: boolean;
  banner: string;
  rules: string[];
  format: string;
  teamSize: string;
};

const img = (seed: string, w = 800, h = 500) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const SPORT_ICONS: Record<string, string> = {
  Cricket: "🏏",
  Football: "⚽",
  Athletics: "🏃",
  Hockey: "🏑",
  Volleyball: "🏐",
  Kabaddi: "🤼",
  Marathon: "🏅",
  "Table Tennis": "🏓",
  Badminton: "🏸",
  Chess: "♟️",
  Snooker: "🎱",
  Carrom: "🎯",
  Esports: "🎮",
};

export const OUTDOOR_SPORTS = [
  { name: "Cricket", tournaments: 24, events: 58, image: img("1531415074968-036ba1b575da") },
  { name: "Football", tournaments: 18, events: 41, image: img("1551958219-acbc608c6377") },
  { name: "Athletics", tournaments: 9, events: 22, image: img("1461896836934-ffe607ba8211") },
  { name: "Hockey", tournaments: 7, events: 14, image: img("1606925797300-0b35e9d1794e") },
  { name: "Volleyball", tournaments: 11, events: 19, image: img("1612872087720-bb876e2e67d1") },
  { name: "Kabaddi", tournaments: 6, events: 12, image: img("1517649763962-0c623066013b") },
  { name: "Marathon", tournaments: 5, events: 8, image: img("1452626038306-9aae5e071dd3") },
];

export const INDOOR_SPORTS = [
  { name: "Table Tennis", tournaments: 12, events: 28, image: img("1534158914592-062992fbe900") },
  { name: "Badminton", tournaments: 16, events: 34, image: img("1626224583764-f87db24ac4ea") },
  { name: "Chess", tournaments: 9, events: 21, image: img("1528819622765-d6bcf132f793") },
  { name: "Snooker", tournaments: 5, events: 11, image: img("1615722440048-da4fd9202ddd") },
  { name: "Carrom", tournaments: 4, events: 7, image: img("1611374243147-44a702c2d44c") },
  { name: "Esports", tournaments: 22, events: 60, image: img("1542751371-adc38448a05e") },
];

export const TOURNAMENTS: Tournament[] = [
  {
    id: "indoor-premier-league",
    category: "sports",
    sport: "Cricket",
    name: "Indoor Premier League",
    organizer: "Bhopal Sports Club",
    venue: "DLF Indoor Arena",
    city: "Bhopal",
    date: "Dec 18, 2025 · 6:00 PM",
    prizePool: "₹ 2,50,000",
    entryFee: "₹ 1,500",
    slots: "12/16 Teams",
    rating: 4.8,
    isLive: true,
    banner: img("1540747913346-19e32dc3e97e", 1200, 600),
    rules: ["6 players per team", "8 overs per innings", "No LBW", "Power play first 2 overs"],
    format: "Knockout · 8 overs",
    teamSize: "6 + 2 substitutes",
  },
  {
    id: "bhopal-cricket-cup",
    category: "sports",
    sport: "Cricket",
    name: "Bhopal Cricket Cup",
    organizer: "MP Cricket Federation",
    venue: "TT Nagar Stadium",
    city: "Bhopal",
    date: "Jan 04, 2026 · 9:00 AM",
    prizePool: "₹ 5,00,000",
    entryFee: "₹ 3,000",
    slots: "8/16 Teams",
    rating: 4.7,
    banner: img("1593341646782-e0b495cff86d", 1200, 600),
    rules: ["11 players per team", "20 overs per innings", "ICC standard rules"],
    format: "League + Knockout",
    teamSize: "11 + 4 substitutes",
  },
  {
    id: "champions-cricket-league",
    category: "sports",
    sport: "Cricket",
    name: "Champions Cricket League",
    organizer: "Champions Sports",
    venue: "Holkar Stadium",
    city: "Indore",
    date: "Feb 12, 2026 · 4:00 PM",
    prizePool: "₹ 10,00,000",
    entryFee: "₹ 5,000",
    slots: "4/12 Teams",
    rating: 4.9,
    banner: img("1531415074968-036ba1b575da", 1200, 600),
    rules: ["11 players per team", "T20 format", "DRS available"],
    format: "T20 League",
    teamSize: "11 + 4 substitutes",
  },
  {
    id: "gwalior-super-league",
    category: "sports",
    sport: "Cricket",
    name: "Gwalior Super League",
    organizer: "Gwalior Sports",
    venue: "Roop Singh Stadium",
    city: "Gwalior",
    date: "Mar 02, 2026 · 2:00 PM",
    prizePool: "₹ 3,00,000",
    entryFee: "₹ 2,000",
    slots: "10/14 Teams",
    rating: 4.6,
    banner: img("1571019613454-1cb2f99b2d8b", 1200, 600),
    rules: ["11 players per team", "T20 format"],
    format: "Knockout",
    teamSize: "11 + 4 substitutes",
  },
  {
    id: "ujjain-premier-league",
    category: "sports",
    sport: "Cricket",
    name: "Ujjain Premier League",
    organizer: "UPL Org",
    venue: "Madhav Club Ground",
    city: "Ujjain",
    date: "Mar 20, 2026 · 5:00 PM",
    prizePool: "₹ 1,50,000",
    entryFee: "₹ 1,200",
    slots: "6/12 Teams",
    rating: 4.5,
    banner: img("1607734834519-d8576ae60ea0", 1200, 600),
    rules: ["8 players per team", "10 overs per innings"],
    format: "Round Robin",
    teamSize: "8 + 2 substitutes",
  },
  {
    id: "bhopal-football-derby",
    category: "sports",
    sport: "Football",
    name: "Bhopal Football Derby",
    organizer: "BFC Org",
    venue: "Aishbagh Stadium",
    city: "Bhopal",
    date: "Dec 28, 2025 · 5:00 PM",
    prizePool: "₹ 2,00,000",
    entryFee: "₹ 2,500",
    slots: "8/12 Teams",
    rating: 4.7,
    isLive: true,
    banner: img("1551958219-acbc608c6377", 1200, 600),
    rules: ["7-a-side", "2 x 25 min halves", "FIFA rules"],
    format: "Knockout",
    teamSize: "7 + 3 substitutes",
  },
  {
    id: "city-badminton-open",
    category: "sports",
    sport: "Badminton",
    name: "City Badminton Open",
    organizer: "Smash Club",
    venue: "Indoor Hall A",
    city: "Indore",
    date: "Jan 14, 2026 · 10:00 AM",
    prizePool: "₹ 80,000",
    entryFee: "₹ 600",
    slots: "32/64 Players",
    rating: 4.6,
    banner: img("1626224583764-f87db24ac4ea", 1200, 600),
    rules: ["BWF rules", "Best of 3 games"],
    format: "Singles & Doubles",
    teamSize: "1 or 2 players",
  },
];

export const FEATURED = TOURNAMENTS.slice(0, 4);

export const CATEGORIES = [
  { name: "Sports", slug: "sports", icon: "🏆", color: "from-amber-500 to-orange-500" },
  { name: "Technical", slug: "technical", icon: "💻", color: "from-purple-500 to-pink-500" },
  { name: "Academics", slug: "academics", icon: "🎓", color: "from-sky-500 to-indigo-500" },
  { name: "More", slug: "more", icon: "✨", color: "from-emerald-500 to-teal-500" },
];

export const NOTIFICATIONS = [
  { id: "1", title: "Registration Successful", body: "You're in for Indoor Premier League!", time: "2m ago", unread: true },
  { id: "2", title: "Event Reminder", body: "Bhopal Cricket Cup starts in 3 days.", time: "1h ago", unread: true },
  { id: "3", title: "Payment Received", body: "₹1,500 paid for IPL.", time: "3h ago", unread: false },
  { id: "4", title: "New Event Near You", body: "Champions Cricket League is now open.", time: "Yesterday", unread: false },
];
