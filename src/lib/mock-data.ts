// ============================================================
// COMPLETE mock-data.ts — saare exports yahan hain
// Apni purani file ko is file se replace karo
// ============================================================
 
// ─── TYPES ───────────────────────────────────────────────────
export type Category = "sports" | "technical" | "academics" | "more";
 
// ─── CATEGORIES (index.tsx + explore.tsx use karte hain) ─────
export const CATEGORIES = [
  { slug: "sports" as Category,    name: "Sports",    icon: "🏆", color: "from-orange-500 to-red-500" },
  { slug: "technical" as Category, name: "Technical", icon: "💻", color: "from-blue-500 to-cyan-500" },
  { slug: "academics" as Category, name: "Academics", icon: "📚", color: "from-purple-500 to-pink-500" },
  { slug: "more" as Category,      name: "More",      icon: "🎯", color: "from-green-500 to-teal-500" },
];
 
// ─── SPORT ICONS (sports.$sport.tsx use karta hai) ───────────
export const SPORT_ICONS: Record<string, string> = {
  // Outdoor
  Cricket:      "🏏",
  Football:     "⚽",
  Hockey:       "🏑",
  Athletics:    "🏃",
  Basketball:   "🏀",
  Volleyball:   "🏐",
  Tennis:       "🎾",
  // Indoor
  Badminton:    "🏸",
  Chess:        "♟️",
  Snooker:      "🎱",
  "Table Tennis": "🏓",
  Kabaddi:      "🤼",
  Boxing:       "🥊",
};
 
// ─── OUTDOOR SPORTS (sports.outdoor.tsx use karta hai) ────────
export const OUTDOOR_SPORTS = [
  { name: "Cricket",   slug: "cricket",   image: "/images/cricket.jpg",   tournaments: 10, events: 125 },
  { name: "Football",  slug: "football",  image: "/images/football.jpg",  tournaments: 8,  events: 105 },
  { name: "Athletics", slug: "athletics", image: "/images/athletics.jpg", tournaments: 5,  events: 225 },
  { name: "Hockey",    slug: "hockey",    image: "/images/hockey.jpg",    tournaments: 7,  events: 125 },
];
 
// ─── INDOOR SPORTS (sports.indoor.tsx use karta hai) ─────────
export const INDOOR_SPORTS = [
  { name: "Badminton",    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80", tournaments: 5, events: 18 },
  { name: "Chess",        image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=800&q=80", tournaments: 3, events: 10 },
  { name: "Snooker",      image: "https://images.unsplash.com/photo-1615228402326-7aff0410af48?auto=format&fit=crop&w=800&q=80", tournaments: 2, events: 8  },
  { name: "Table Tennis", image: "https://images.unsplash.com/photo-1611251126112-c16cca7d1b73?auto=format&fit=crop&w=800&q=80", tournaments: 4, events: 14 },
  { name: "Kabaddi",      image: "https://images.unsplash.com/photo-1562771379-b8a0f87eff09?auto=format&fit=crop&w=800&q=80", tournaments: 3, events: 9  },
  { name: "Boxing",       image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80", tournaments: 2, events: 6  },
];
 
// ─── SPORTS_EVENTS ($sport.tsx use karta hai) ────────────────
export const SPORTS_EVENTS = {
  cricket:   [
    { id: 1, name: "Indore Premier League",    location: "Indore Stadium", prize: "50,000", image: "/images/event1.jpg" },
    { id: 2, name: "Bhopal Cricket Cup",       location: "Bhopal Ground",  prize: "35,000", image: "/images/event2.jpg" },
  ],
  football:  [
    { id: 3, name: "Football Champions League", location: "Delhi Stadium", prize: "80,000", image: "/images/football-event.jpg" },
  ],
  athletics: [
    { id: 4, name: "National Marathon",         location: "Mumbai",        prize: "25,000", image: "/images/athletics-event.jpg" },
  ],
  hockey:    [
    { id: 5, name: "Hockey Super Cup",          location: "Punjab Arena",  prize: "45,000", image: "/images/hockey-event.jpg" },
  ],
  badminton: [
    { id: 6, name: "Indoor Badminton Open",     location: "Motilal Nehru Hall, Bhopal", prize: "15,000", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=400&q=80" },
  ],
  chess: [
    { id: 7, name: "MP Chess Championship",     location: "BHEL Club, Bhopal",          prize: "10,000", image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=400&q=80" },
  ],
  snooker: [
    { id: 8, name: "City Snooker League",       location: "Sports Club, Indore",         prize: "8,000",  image: "https://images.unsplash.com/photo-1615228402326-7aff0410af48?auto=format&fit=crop&w=400&q=80" },
  ],
  "table tennis": [
    { id: 9, name: "TT Open Tournament",        location: "Indoor Stadium, Bhopal",      prize: "12,000", image: "https://images.unsplash.com/photo-1611251126112-c16cca7d1b73?auto=format&fit=crop&w=400&q=80" },
  ],
  kabaddi: [
    { id: 10, name: "District Kabaddi Cup",     location: "Gandhi Maidan, Bhopal",       prize: "18,000", image: "https://images.unsplash.com/photo-1562771379-b8a0f87eff09?auto=format&fit=crop&w=400&q=80" },
  ],
  boxing: [
    { id: 11, name: "State Boxing Championship", location: "Sports Authority, Bhopal",   prize: "22,000", image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=400&q=80" },
  ],
};
 
// ─── TOURNAMENTS (events.$eventId.tsx, explore.tsx, saved.tsx, my-events.tsx use karte hain) ──
export const TOURNAMENTS = [
  {
    id: "t1",
    name: "MP Premier Cricket League",
    sport: "Cricket",
    category: "sports" as Category,
    organizer: "MP Cricket Association",
    venue: "TT Nagar Stadium",
    city: "Bhopal",
    date: "15 Jun 2025 · 9:00 AM",
    prizePool: "₹1,00,000",
    entryFee: "₹500",
    slots: "16 teams",
    format: "Knockout",
    teamSize: "11 players",
    rating: 4.5,
    banner: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
    rules: [
      "All players must carry valid ID proof.",
      "Match timings must be strictly followed.",
      "DRS (Decision Review System) will not be used.",
      "Umpire decision is final.",
      "Teams must report 30 minutes before match.",
    ],
  },
  {
    id: "t2",
    name: "Indore Football Cup 2025",
    sport: "Football",
    category: "sports" as Category,
    organizer: "Indore Football Club",
    venue: "Nehru Stadium",
    city: "Indore",
    date: "20 Jun 2025 · 5:00 PM",
    prizePool: "₹75,000",
    entryFee: "₹800",
    slots: "12 teams",
    format: "League + Knockout",
    teamSize: "11 players",
    rating: 4.3,
    banner: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    rules: [
      "Standard FIFA rules apply.",
      "Each match is 90 minutes with 15-minute halftime.",
      "Yellow/Red card rules strictly enforced.",
      "Substitutions: max 5 per match.",
      "Extra time in knockout rounds if draw.",
    ],
  },
  {
    id: "t3",
    name: "State Badminton Championship",
    sport: "Badminton",
    category: "sports" as Category,
    organizer: "MP Badminton Association",
    venue: "Motilal Nehru Indoor Hall",
    city: "Bhopal",
    date: "25 Jun 2025 · 10:00 AM",
    prizePool: "₹50,000",
    entryFee: "₹300",
    slots: "32 players",
    format: "Single Elimination",
    teamSize: "Individual",
    rating: 4.7,
    banner: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
    rules: [
      "BWF rules apply.",
      "Best of 3 games format.",
      "Each game to 21 points.",
      "Players must bring own rackets.",
      "Shuttle will be provided by organizers.",
    ],
  },
  {
    id: "t4",
    name: "Bhopal Chess Open",
    sport: "Chess",
    category: "sports" as Category,
    organizer: "Bhopal Chess Club",
    venue: "BHEL Club",
    city: "Bhopal",
    date: "1 Jul 2025 · 11:00 AM",
    prizePool: "₹25,000",
    entryFee: "₹200",
    slots: "64 players",
    format: "Swiss System",
    teamSize: "Individual",
    rating: 4.2,
    banner: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=1200&q=80",
    rules: [
      "FIDE rules apply.",
      "Time control: 30 minutes per player.",
      "Mobile phones must be switched off.",
      "Touch-move rule strictly enforced.",
      "Arbiter decision is final.",
    ],
  },
  {
    id: "t5",
    name: "Gwalior Athletics Meet",
    sport: "Athletics",
    category: "sports" as Category,
    organizer: "MP Athletics Council",
    venue: "Sports Complex",
    city: "Gwalior",
    date: "25 Jun 2025 · 7:00 AM",
    prizePool: "₹50,000",
    entryFee: "₹250",
    slots: "120 athletes",
    format: "Track & Field",
    teamSize: "Individual / Relay",
    rating: 4.4,
    banner: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    rules: [
      "Athletes must report one hour before their event.",
      "Spikes are allowed only on marked tracks.",
      "Relay teams must submit final lineup before check-in.",
      "False start rules apply as per event category.",
      "Organizer decision is final for timing disputes.",
    ],
  },
  {
    id: "t6",
    name: "Bhopal Hockey Super Cup",
    sport: "Hockey",
    category: "sports" as Category,
    organizer: "Bhopal Hockey Academy",
    venue: "Major Dhyan Chand Hockey Stadium",
    city: "Bhopal",
    date: "1 Jul 2025 · 4:00 PM",
    prizePool: "₹60,000",
    entryFee: "₹700",
    slots: "10 teams",
    format: "League + Final",
    teamSize: "11 players",
    rating: 4.6,
    banner: "https://images.unsplash.com/photo-1617711773026-ea4b9eb41f86?auto=format&fit=crop&w=1200&q=80",
    rules: [
      "Standard field hockey rules apply.",
      "Teams must carry matching jerseys.",
      "Rolling substitutions are allowed.",
      "Stick and shin guards are mandatory.",
      "Umpire decision is final.",
    ],
  },
  {
    id: "t7",
    name: "Indore Snooker League",
    sport: "Snooker",
    category: "sports" as Category,
    organizer: "Indore Cue Sports Club",
    venue: "Sports Club",
    city: "Indore",
    date: "10 Jul 2025 · 2:00 PM",
    prizePool: "₹20,000",
    entryFee: "₹350",
    slots: "24 players",
    format: "Best of 3 Frames",
    teamSize: "Individual",
    rating: 4.1,
    banner: "https://images.unsplash.com/photo-1615228402326-7aff0410af48?auto=format&fit=crop&w=1200&q=80",
    rules: [
      "World Snooker foul rules apply.",
      "Players must maintain table discipline.",
      "Match referee decision is final.",
      "Late arrival above 10 minutes counts as walkover.",
      "Cue inspection may be done before match.",
    ],
  },
  {
    id: "t8",
    name: "Table Tennis Open",
    sport: "Table Tennis",
    category: "sports" as Category,
    organizer: "Bhopal TT Association",
    venue: "Indoor Stadium",
    city: "Bhopal",
    date: "15 Jul 2025 · 9:30 AM",
    prizePool: "₹30,000",
    entryFee: "₹250",
    slots: "48 players",
    format: "Singles + Doubles",
    teamSize: "Individual / Pairs",
    rating: 4.5,
    banner: "https://images.unsplash.com/photo-1611251126112-c16cca7d1b73?auto=format&fit=crop&w=1200&q=80",
    rules: [
      "ITTF service rules apply.",
      "Best of 5 games until semifinals.",
      "Players must bring non-marking shoes.",
      "Doubles pair names cannot change after registration.",
      "Referee decision is final.",
    ],
  },
  {
    id: "t9",
    name: "District Kabaddi Cup",
    sport: "Kabaddi",
    category: "sports" as Category,
    organizer: "MP Kabaddi Federation",
    venue: "Gandhi Maidan",
    city: "Bhopal",
    date: "20 Jul 2025 · 6:00 PM",
    prizePool: "₹40,000",
    entryFee: "₹600",
    slots: "8 teams",
    format: "Knockout",
    teamSize: "7 players",
    rating: 4.4,
    banner: "https://images.unsplash.com/photo-1562771379-b8a0f87eff09?auto=format&fit=crop&w=1200&q=80",
    rules: [
      "Standard kabaddi court rules apply.",
      "Teams must have 5 substitute players maximum.",
      "Medical fitness declaration is mandatory.",
      "Unsportsmanlike conduct can lead to disqualification.",
      "Referee decision is final.",
    ],
  },
  {
    id: "t10",
    name: "State Boxing Championship",
    sport: "Boxing",
    category: "sports" as Category,
    organizer: "MP Boxing Association",
    venue: "Sports Authority Arena",
    city: "Bhopal",
    date: "25 Jul 2025 · 11:00 AM",
    prizePool: "₹35,000",
    entryFee: "₹400",
    slots: "40 boxers",
    format: "Weight Categories",
    teamSize: "Individual",
    rating: 4.3,
    banner: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80",
    rules: [
      "Valid age and weight proof required.",
      "Head guard and gloves are mandatory.",
      "Medical check-up happens before bout.",
      "Three-round amateur format applies.",
      "Judge decision is final.",
    ],
  },
];
 
// ─── FEATURED (index.tsx use karta hai) ──────────────────────
// TOURNAMENTS ka subset — pehle 2 featured hain
export const FEATURED = TOURNAMENTS.slice(0, 2);

export type Tournament = (typeof TOURNAMENTS)[number] & { isLive?: boolean };
 
// ─── NOTIFICATIONS (notifications.tsx use karta hai) ─────────
export const NOTIFICATIONS = [
  {
    id: 1,
    title: "Registration Confirmed",
    body: "Your team has been registered for MP Premier Cricket League.",
    time: "2h ago",
    unread: true,
  },
  {
    id: 2,
    title: "Match Tomorrow",
    body: "Don't forget — your match is at 9:00 AM at TT Nagar Stadium.",
    time: "5h ago",
    unread: true,
  },
  {
    id: 3,
    title: "New Tournament Added",
    body: "Indore Football Cup 2025 is now open for registration.",
    time: "1d ago",
    unread: false,
  },
  {
    id: 4,
    title: "Payment Received",
    body: "₹500 payment confirmed for MP Premier Cricket League.",
    time: "2d ago",
    unread: false,
  },
  {
    id: 5,
    title: "Invite Reward",
    body: "Your friend joined Eventra! ₹100 credits added to your account.",
    time: "3d ago",
    unread: false,
  },
];