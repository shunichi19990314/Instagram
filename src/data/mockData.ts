export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isVerified?: boolean;
  bio?: string;
  posts?: number;
  followers?: string;
  following?: number;
}

export interface Story {
  id: string;
  user: User;
  image: string;
  viewed: boolean;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  time: string;
  likes: number;
}

export interface Post {
  id: string;
  user: User;
  images: string[];
  caption: string;
  likes: number;
  comments: Comment[];
  time: string;
  liked: boolean;
  saved: boolean;
  location?: string;
}

export const currentUser: User = {
  id: 'me',
  username: 'your_account',
  displayName: 'あなたのアカウント',
  avatar: '',
  bio: '📸 Life is beautiful\n🌍 Travel lover\n☕ Coffee addict',
  posts: 42,
  followers: '1,234',
  following: 567,
};

export const users: User[] = [
  { id: '1', username: 'nature_photo', displayName: 'Nature Photography', avatar: '', isVerified: true, bio: '🌿 Nature & Landscape', posts: 328, followers: '45.2K', following: 120 },
  { id: '2', username: 'foodie_japan', displayName: 'Foodie Japan', avatar: '', isVerified: false, bio: '🍜 Japanese Food', posts: 892, followers: '12.8K', following: 340 },
  { id: '3', username: 'puppy_world', displayName: 'Puppy World 🐕', avatar: '', isVerified: true, bio: '🐶 Cute puppies daily', posts: 1205, followers: '98.5K', following: 89 },
  { id: '4', username: 'interior_design', displayName: 'Interior Design', avatar: '', isVerified: false, bio: '🏠 Modern interiors', posts: 567, followers: '23.1K', following: 200 },
  { id: '5', username: 'travel_diary', displayName: 'Travel Diary', avatar: '', isVerified: true, bio: '✈️ Around the world', posts: 445, followers: '67.3K', following: 150 },
  { id: '6', username: 'art_gallery', displayName: 'Art Gallery', avatar: '', isVerified: false, bio: '🎨 Digital & Traditional', posts: 234, followers: '8.9K', following: 430 },
  { id: '7', username: 'fitness_daily', displayName: 'Fitness Daily', avatar: '', isVerified: true, bio: '💪 Daily motivation', posts: 678, followers: '156K', following: 95 },
  { id: '8', username: 'music_vibes', displayName: 'Music Vibes', avatar: '', isVerified: false, bio: '🎵 Music is life', posts: 312, followers: '15.7K', following: 280 },
];

export const stories: Story[] = [
  { id: 's1', user: users[0], image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', viewed: false },
  { id: 's2', user: users[1], image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop', viewed: false },
  { id: 's3', user: users[2], image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', viewed: false },
  { id: 's4', user: users[3], image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', viewed: true },
  { id: 's5', user: users[4], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop', viewed: false },
  { id: 's6', user: users[5], image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop', viewed: true },
  { id: 's7', user: users[6], image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', viewed: false },
  { id: 's8', user: users[7], image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop', viewed: true },
];

export const posts: Post[] = [
  {
    id: 'p1',
    user: users[0],
    images: ['https://image.qwenlm.ai/generated-images/ee146276-a15b-4a5e-800b-a5eeb86ca20e/_result.png'],
    caption: '🌅 夕暮れの山々。自然の美しさに圧倒される瞬間。#nature #landscape #sunset #mountains #photography',
    likes: 2847,
    comments: [
      { id: 'c1', user: users[4], text: '本当に美しい写真ですね！どこで撮ったんですか？', time: '2時間', likes: 12 },
      { id: 'c2', user: users[5], text: '色彩が素晴らしい 🎨', time: '1時間', likes: 5 },
    ],
    time: '3時間',
    liked: false,
    saved: false,
    location: '長野県 白馬村',
  },
  {
    id: 'p2',
    user: users[1],
    images: ['https://image.qwenlm.ai/generated-images/d2df625d-1c6d-4a4c-ad57-8ea1cac346ac/_result.png'],
    caption: '🍔 最高のハンバーガー！このチーズの溶け具合... 🤤 #food #burger #gourmet #foodie #delicious',
    likes: 1523,
    comments: [
      { id: 'c3', user: users[2], text: '美味しそう！！お店はどこですか？', time: '5時間', likes: 8 },
      { id: 'c4', user: users[6], text: 'チートデイにぴったり 😂', time: '4時間', likes: 23 },
      { id: 'c5', user: users[0], text: '写真がプロみたい！', time: '3時間', likes: 3 },
    ],
    time: '6時間',
    liked: true,
    saved: false,
    location: '東京 渋谷',
  },
  {
    id: 'p3',
    user: users[2],
    images: ['https://image.qwenlm.ai/generated-images/feafc479-5abb-4587-b2e9-a4e34f13a97c/_result.png'],
    caption: '🐕 今日のワンちゃん！公園で元気いっぱい遊んでます 🌿 #puppy #dog #goldenretriever #cute #pet',
    likes: 5621,
    comments: [
      { id: 'c6', user: users[1], text: 'かわいい！！🥺❤️', time: '1時間', likes: 45 },
      { id: 'c7', user: users[3], text: '癒される〜', time: '45分', likes: 18 },
    ],
    time: '2時間',
    liked: false,
    saved: true,
    location: '代々木公園',
  },
  {
    id: 'p4',
    user: users[3],
    images: ['https://image.qwenlm.ai/generated-images/f4a387cd-d6ac-4f99-b897-e2650fdb7dfe/_result.png'],
    caption: '🏠 ミニマルなインテリア。シンプルが一番。#interior #minimal #design #home #modern',
    likes: 987,
    comments: [
      { id: 'c8', user: users[0], text: 'この部屋素敵！家具はどこで買ったの？', time: '8時間', likes: 7 },
    ],
    time: '10時間',
    liked: false,
    saved: false,
    location: '東京 目黒',
  },
];

export const suggestedUsers: User[] = [
  users[4], users[5], users[6], users[7],
];
