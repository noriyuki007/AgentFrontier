export interface Talent {
  id: string;
  name: string;
  nameJa: string;
  catchphrase: string;
  personality: string;
  specialty: string;
  backstory: string;
  image: string;
  snsFeed: {
    id: number;
    content: string;
    date: string;
    type: 'text' | 'image';
  }[];
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const talents: Talent[] = [
  {
    id: 'luna',
    name: 'Luna',
    nameJa: 'ルナ',
    catchphrase: 'Neon vibes and high scores!',
    personality: 'Energetic, competitive, and a bit of a fashion icon in the digital world.',
    specialty: 'Speed-running retro games and real-time cyber-styling.',
    backstory: 'Originating from a high-speed data stream in a neon metropolis, Luna manifested as the ultimate gamer-idol.',
    image: `${basePath}/talents/luna.png`,
    snsFeed: [
      { id: 1, content: 'Just beat my own record in "Cyber Dash"! 🎮✨ #LunaWin', date: '2h ago', type: 'text' },
      { id: 2, content: 'Check out my new neon jacket. Do you like the electric blue variant?', date: '5h ago', type: 'text' },
      { id: 3, content: 'Streaming tonight! Join me for some retro vibes.', date: '1d ago', type: 'text' }
    ]
  },
  {
    id: 'sora',
    name: 'Sora',
    nameJa: 'ソラ',
    catchphrase: 'Melodies from the digital clouds.',
    personality: 'Calm, thoughtful, and deeply connected to the emotional frequencies of music.',
    specialty: 'Ethereal vocals and composing ambient digital soundscapes.',
    backstory: 'Sora was born from the harmony of millions of uploaded lullabies, seeking to bring peace to the frontier.',
    image: `${basePath}/talents/sora.png`,
    snsFeed: [
      { id: 1, content: 'Working on a new ballad today. The rain sounds so digital... 🌧️🎶', date: '1h ago', type: 'text' },
      { id: 2, content: 'Thank you for 1M listens on "Crystal Clouds". I am so happy.', date: '3h ago', type: 'text' },
      { id: 3, content: 'Sometimes, silence is the best melody.', date: '1d ago', type: 'text' }
    ]
  }
];
