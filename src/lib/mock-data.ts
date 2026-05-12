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
  // Technical
  { id: "ai-hackathon-2026", category: "technical", sport: "Hackathon", name: "AI Hackathon 2026", organizer: "DevHub", venue: "IIIT Auditorium", city: "Bhopal", date: "Jan 22, 2026 · 9:00 AM", prizePool: "₹ 4,00,000", entryFee: "₹ 500", slots: "40/100 Teams", rating: 4.9, isLive: true, banner: img("1518770660439-4636190af475", 1200, 600), rules: ["Team of 1-4", "36 hours", "Open theme"], format: "Hackathon", teamSize: "1-4 members" },
  { id: "code-clash", category: "technical", sport: "Coding Contest", name: "Code Clash Championship", organizer: "Codify", venue: "Online", city: "Online", date: "Feb 02, 2026 · 7:00 PM", prizePool: "₹ 1,00,000", entryFee: "Free", slots: "120/500 Coders", rating: 4.7, banner: img("1461749280684-dccba630e2f6", 1200, 600), rules: ["Individual", "3 hours", "5 problems"], format: "Algo Sprint", teamSize: "Solo" },
  { id: "robotics-arena", category: "technical", sport: "Robotics", name: "Robotics Arena", organizer: "RoboMP", venue: "MANIT", city: "Bhopal", date: "Feb 18, 2026 · 10:00 AM", prizePool: "₹ 2,50,000", entryFee: "₹ 1,000", slots: "20/40 Teams", rating: 4.8, banner: img("1581090700227-1e37b190418e", 1200, 600), rules: ["Bot under 5kg", "Sumo + Race"], format: "Knockout", teamSize: "2-4 members" },
  // Academics
  { id: "math-olympiad", category: "academics", sport: "Olympiad", name: "National Math Olympiad", organizer: "EduBoard", venue: "City Convention", city: "Indore", date: "Jan 30, 2026 · 11:00 AM", prizePool: "₹ 75,000", entryFee: "₹ 200", slots: "200/500 Students", rating: 4.6, banner: img("1503676260728-1c00da094a0b", 1200, 600), rules: ["Individual", "2 hours", "30 questions"], format: "Written exam", teamSize: "Solo" },
  { id: "quiz-fest", category: "academics", sport: "Quiz", name: "Inter-College Quiz Fest", organizer: "QuizCo", venue: "MANIT Hall", city: "Bhopal", date: "Feb 08, 2026 · 3:00 PM", prizePool: "₹ 50,000", entryFee: "₹ 300", slots: "16/32 Teams", rating: 4.7, banner: img("1456513080510-7bf3a84b82f8", 1200, 600), rules: ["Team of 3", "5 rounds"], format: "League + Final", teamSize: "3 members" },
  { id: "debate-cup", category: "academics", sport: "Debate", name: "Open Debate Cup", organizer: "SpeakUp", venue: "AIIMS Auditorium", city: "Bhopal", date: "Mar 01, 2026 · 12:00 PM", prizePool: "₹ 30,000", entryFee: "₹ 150", slots: "24/48 Speakers", rating: 4.5, banner: img("1521737604893-d14cc237f11d", 1200, 600), rules: ["British Parliamentary", "7 min/speech"], format: "Knockout", teamSize: "2 members" },
  // More — cultural / fun
  { id: "music-fest", category: "more", sport: "Music", name: "Indie Music Fest", organizer: "BeatLabs", venue: "Open Grounds", city: "Bhopal", date: "Feb 14, 2026 · 6:00 PM", prizePool: "₹ 1,20,000", entryFee: "₹ 400", slots: "20/30 Bands", rating: 4.8, isLive: true, banner: img("1493225457124-a3eb161ffa5f", 1200, 600), rules: ["Original songs only", "20 min slot"], format: "Open Stage", teamSize: "1-6 members" },
  { id: "dance-battle", category: "more", sport: "Dance", name: "Street Dance Battle", organizer: "MoveOn", venue: "Cultural Center", city: "Indore", date: "Feb 25, 2026 · 7:00 PM", prizePool: "₹ 80,000", entryFee: "₹ 250", slots: "16/24 Crews", rating: 4.7, banner: img("1508700115892-45ecd05ae2ad", 1200, 600), rules: ["1v1 + Crew", "60s rounds"], format: "Knockout", teamSize: "1 or up to 8" },
  { id: "photography-walk", category: "more", sport: "Photography", name: "Heritage Photo Walk", organizer: "Lens Club", venue: "Old City", city: "Bhopal", date: "Mar 08, 2026 · 7:00 AM", prizePool: "₹ 40,000", entryFee: "₹ 350", slots: "30/60 Photographers", rating: 4.6, banner: img("1452587925148-ce544e77e70d", 1200, 600), rules: ["Submit 5 photos", "Theme: Heritage"], format: "Submission + Jury", teamSize: "Solo" },
];

export const FEATURED = [
  TOURNAMENTS[0],
  TOURNAMENTS.find((t) => t.id === "ai-hackathon-2026")!,
  TOURNAMENTS.find((t) => t.id === "music-fest")!,
  TOURNAMENTS[1],
];

export const CATEGORIES = [
  { name: "Sports", slug: "sports" as const, icon: "🏆", color: "from-amber-500 to-orange-500" },
  { name: "Technical", slug: "technical" as const, icon: "💻", color: "from-purple-500 to-pink-500" },
  { name: "Academics", slug: "academics" as const, icon: "🎓", color: "from-sky-500 to-indigo-500" },
  { name: "More", slug: "more" as const, icon: "✨", color: "from-emerald-500 to-teal-500" },
];

export const NOTIFICATIONS = [
  { id: "1", title: "Registration Successful", body: "You're in for Indoor Premier League!", time: "2m ago", unread: true },
  { id: "2", title: "Event Reminder", body: "Bhopal Cricket Cup starts in 3 days.", time: "1h ago", unread: true },
  { id: "3", title: "Payment Received", body: "₹1,500 paid for IPL.", time: "3h ago", unread: false },
  { id: "4", title: "New Event Near You", body: "Champions Cricket League is now open.", time: "Yesterday", unread: false },
];
