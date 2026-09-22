import { useState, useRef, useEffect } from 'react';
import { posts as initialPosts, stories, users, currentUser, suggestedUsers, Post } from './data/mockData';
import {
  HomeIcon, SearchIcon, ExploreIcon, ReelsIcon, MessageIcon, HeartIcon,
  CommentIcon, ShareIcon, BookmarkIcon, MoreIcon, PlusIcon,
  MenuIcon, GridIcon, SettingsIcon, CloseIcon, VerifiedIcon, EmojiIcon
} from './components/Icons';

type Page = 'home' | 'explore' | 'reels' | 'messages' | 'notifications' | 'create' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Story timer
  useEffect(() => {
    if (activeStory !== null) {
      setStoryProgress(0);
      storyTimerRef.current = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            if (activeStory < stories.length - 1) {
              setActiveStory(activeStory + 1);
              return 0;
            } else {
              setActiveStory(null);
              return 0;
            }
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => {
      if (storyTimerRef.current) clearInterval(storyTimerRef.current);
    };
  }, [activeStory]);

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, saved: !p.saved } : p))
    );
  };

  const handleComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `c_${Date.now()}`,
                  user: currentUser,
                  text,
                  time: 'たった今',
                  likes: 0,
                },
              ],
            }
          : p
      )
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getAvatarGradient = (id: string) => {
    const gradients = [
      'from-yellow-400 via-pink-500 to-purple-600',
      'from-blue-400 via-purple-500 to-pink-500',
      'from-green-400 via-blue-500 to-purple-500',
      'from-pink-400 via-red-500 to-yellow-500',
      'from-indigo-400 via-purple-500 to-pink-500',
    ];
    const index = parseInt(id.replace(/\D/g, '')) % gradients.length;
    return gradients[index];
  };

  const Avatar: React.FC<{ user: { id: string; username: string }; size?: string; hasStory?: boolean; viewed?: boolean }> = ({ user, size = 'w-8 h-8', hasStory, viewed }) => (
    <div className={`relative ${hasStory ? 'p-[2px] rounded-full bg-gradient-to-tr ' + (viewed ? 'from-gray-300 to-gray-400' : 'from-yellow-400 via-pink-500 to-purple-600') : ''}`}>
      <div className={`${size} rounded-full bg-gradient-to-br ${getAvatarGradient(user.id)} flex items-center justify-center ${hasStory ? 'border-2 border-white' : ''}`}>
        <span className="text-white font-bold text-xs">{getInitials(user.username)}</span>
      </div>
    </div>
  );

  // Story Viewer Modal
  const StoryViewer = () => {
    if (activeStory === null) return null;
    const story = stories[activeStory];

    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <button
          onClick={() => setActiveStory(null)}
          className="absolute top-4 right-4 text-white z-50 hover:opacity-70"
        >
          <CloseIcon className="w-8 h-8" />
        </button>
        <div className="relative w-full max-w-[420px] h-[90vh] max-h-[750px] bg-gray-900 rounded-lg overflow-hidden">
          {/* Progress bars */}
          <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
            {stories.map((_, idx) => (
              <div key={idx} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-100"
                  style={{
                    width: idx < activeStory ? '100%' : idx === activeStory ? `${storyProgress}%` : '0%',
                  }}
                />
              </div>
            ))}
          </div>
          {/* User info */}
          <div className="absolute top-6 left-4 flex items-center gap-2 z-10">
            <Avatar user={story.user} size="w-8 h-8" />
            <span className="text-white text-sm font-semibold">{story.user.username}</span>
            <span className="text-white/60 text-xs">2時間</span>
          </div>
          {/* Story image */}
          <img
            src={story.image}
            alt="Story"
            className="w-full h-full object-cover"
          />
          {/* Navigation */}
          <button
            className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
            onClick={() => activeStory > 0 && setActiveStory(activeStory - 1)}
          />
          <button
            className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
            onClick={() => activeStory < stories.length - 1 && setActiveStory(activeStory + 1)}
          />
          {/* Reply input */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <input
              type="text"
              placeholder="メッセージを送信..."
              className="w-full px-4 py-2 rounded-full border border-white/40 bg-transparent text-white text-sm placeholder-white/60 focus:outline-none focus:border-white"
            />
          </div>
        </div>
      </div>
    );
  };

  // Sidebar
  const Sidebar = () => (
    <nav className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-[72px]' : 'w-[245px] xl:w-[245px]'}`}>
      {/* Logo */}
      <div className="px-3 pt-8 pb-4">
        {sidebarCollapsed ? (
          <div className="w-6 h-6 mx-auto">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="currentColor"/>
            </svg>
          </div>
        ) : (
          <h1 className="text-2xl font-semibold px-3" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            Instagram
          </h1>
        )}
      </div>

      {/* Nav items */}
      <div className="flex-1 px-3 space-y-1">
        {[
          { id: 'home' as Page, icon: HomeIcon, label: 'ホーム', filled: true },
          { id: 'explore' as Page, icon: SearchIcon, label: '検索' },
          { id: 'explore' as Page, icon: ExploreIcon, label: '探索' },
          { id: 'reels' as Page, icon: ReelsIcon, label: 'リール' },
          { id: 'messages' as Page, icon: MessageIcon, label: 'メッセージ' },
          { id: 'notifications' as Page, icon: HeartIcon, label: '通知' },
          { id: 'create' as Page, icon: PlusIcon, label: '作成' },
        ].map((item, idx) => {
          if (idx === 2) return null; // Skip duplicate explore
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={idx}
              onClick={() => {
                setCurrentPage(item.id);
                if (item.id === 'notifications') setShowNotifications(!showNotifications);
              }}
              className={`flex items-center gap-4 w-full px-3 py-3 rounded-lg hover:bg-gray-100 transition-all group ${isActive ? 'font-bold' : ''}`}
            >
              {item.id === 'home' ? (
                <HomeIcon filled={isActive} className="w-6 h-6" />
              ) : item.id === 'notifications' ? (
                <HeartIcon filled={isActive} className="w-6 h-6" />
              ) : item.id === 'reels' ? (
                <ReelsIcon filled={isActive} className="w-6 h-6" />
              ) : (
                <Icon className="w-6 h-6" />
              )}
              {!sidebarCollapsed && (
                <span className="text-[15px]">{item.label}</span>
              )}
            </button>
          );
        })}

        {/* Profile */}
        <button
          onClick={() => setCurrentPage('profile')}
          className={`flex items-center gap-4 w-full px-3 py-3 rounded-lg hover:bg-gray-100 transition-all ${currentPage === 'profile' ? 'font-bold' : ''}`}
        >
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getAvatarGradient('me')} flex items-center justify-center ${currentPage === 'profile' ? 'ring-2 ring-black' : ''}`}>
            <span className="text-white font-bold text-[8px]">Y</span>
          </div>
          {!sidebarCollapsed && <span className="text-[15px]">プロフィール</span>}
        </button>

        {/* More */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex items-center gap-4 w-full px-3 py-3 rounded-lg hover:bg-gray-100 transition-all"
        >
          <MenuIcon className="w-6 h-6" />
          {!sidebarCollapsed && <span className="text-[15px]">もっと見る</span>}
        </button>
      </div>

      {/* Bottom */}
      {!sidebarCollapsed && (
        <div className="px-3 pb-6">
          <button className="flex items-center gap-4 w-full px-3 py-3 rounded-lg hover:bg-gray-100 transition-all">
            <SettingsIcon className="w-6 h-6" />
            <span className="text-[15px]">設定</span>
          </button>
        </div>
      )}
    </nav>
  );

  // Stories Bar
  const StoriesBar = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {/* Your story */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarGradient('me')} flex items-center justify-center`}>
              <span className="text-white font-bold">Y</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>
          <span className="text-xs text-gray-600 w-16 text-center truncate">あなたのストーリー</span>
        </div>
        {/* Other stories */}
        {stories.map((story, idx) => (
          <div
            key={story.id}
            className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
            onClick={() => setActiveStory(idx)}
          >
            <Avatar user={story.user} size="w-16 h-16" hasStory viewed={story.viewed} />
            <span className="text-xs text-gray-600 w-16 text-center truncate">{story.user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Post Component
  const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const [showAllComments, setShowAllComments] = useState(false);
    const [isDoubleTapLiked, setIsDoubleTapLiked] = useState(false);

    const handleDoubleTap = () => {
      if (!post.liked) handleLike(post.id);
      setIsDoubleTapLiked(true);
      setTimeout(() => setIsDoubleTapLiked(false), 1000);
    };

    return (
      <article className="bg-white border border-gray-200 rounded-lg mb-4">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <Avatar user={post.user} size="w-8 h-8" hasStory />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">{post.user.username}</span>
                {post.user.isVerified && <VerifiedIcon />}
              </div>
              {post.location && (
                <span className="text-xs text-gray-500">{post.location}</span>
              )}
            </div>
          </div>
          <button className="hover:opacity-50">
            <MoreIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Image */}
        <div
          className="relative aspect-square bg-gray-100 cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
          <img
            src={post.images[0]}
            alt="Post"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Double tap heart animation */}
          {isDoubleTapLiked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <HeartIcon filled className="w-24 h-24 text-white drop-shadow-lg animate-ping" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <button onClick={() => handleLike(post.id)} className="hover:opacity-50 transition-opacity">
                <HeartIcon filled={post.liked} className={`w-6 h-6 ${post.liked ? 'text-red-500' : ''}`} />
              </button>
              <button className="hover:opacity-50 transition-opacity">
                <CommentIcon className="w-6 h-6" />
              </button>
              <button className="hover:opacity-50 transition-opacity">
                <ShareIcon className="w-6 h-6" />
              </button>
            </div>
            <button onClick={() => handleSave(post.id)} className="hover:opacity-50 transition-opacity">
              <BookmarkIcon filled={post.saved} className="w-6 h-6" />
            </button>
          </div>

          {/* Likes */}
          <p className="text-sm font-semibold mb-1">
            {post.likes.toLocaleString()} いいね！
          </p>

          {/* Caption */}
          <div className="text-sm">
            <span className="font-semibold mr-1">{post.user.username}</span>
            <span className="text-gray-800">{post.caption}</span>
          </div>

          {/* Comments */}
          {post.comments.length > 2 && !showAllComments && (
            <button
              onClick={() => setShowAllComments(true)}
              className="text-sm text-gray-500 mt-1 hover:text-gray-700"
            >
              コメント{post.comments.length}件をすべて表示
            </button>
          )}
          <div className="mt-1 space-y-1">
            {(showAllComments ? post.comments : post.comments.slice(-2)).map((comment) => (
              <div key={comment.id} className="text-sm flex items-start gap-1">
                <span className="font-semibold flex-shrink-0">{comment.user.username}</span>
                <span className="text-gray-800">{comment.text}</span>
              </div>
            ))}
          </div>

          {/* Time */}
          <p className="text-[10px] text-gray-400 uppercase mt-2">{post.time}前</p>

          {/* Comment input */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
            <EmojiIcon className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="コメントを追加..."
              value={commentInputs[post.id] || ''}
              onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
              className="flex-1 text-sm outline-none placeholder-gray-400"
            />
            {commentInputs[post.id]?.trim() && (
              <button
                onClick={() => handleComment(post.id)}
                className="text-sm font-semibold text-blue-500 hover:text-blue-700"
              >
                投稿
              </button>
            )}
          </div>
        </div>
      </article>
    );
  };

  // Right Sidebar
  const RightSidebar = () => (
    <aside className="hidden lg:block w-[320px] ml-8 mt-8 flex-shrink-0">
      <div className="fixed w-[320px]">
        {/* Current user */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getAvatarGradient('me')} flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <div>
              <p className="text-sm font-semibold">{currentUser.username}</p>
              <p className="text-sm text-gray-500">{currentUser.displayName}</p>
            </div>
          </div>
          <button className="text-xs font-semibold text-blue-500 hover:text-blue-700">
            切り替え
          </button>
        </div>

        {/* Suggestions */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-500">あなたへの提案</span>
          <button className="text-xs font-semibold hover:text-gray-500">すべて表示</button>
        </div>

        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar user={user} size="w-8 h-8" />
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold">{user.username}</p>
                    {user.isVerified && <VerifiedIcon />}
                  </div>
                  <p className="text-xs text-gray-500">あなたへの提案</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-blue-500 hover:text-blue-700">
                フォロー
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-1 text-[11px] text-gray-300">
            <span>About</span>·<span>Help</span>·<span>Press</span>·<span>API</span>·<span>Jobs</span>·<span>Privacy</span>·<span>Terms</span>·<span>Locations</span>·<span>Language</span>
          </div>
          <p className="text-[11px] text-gray-300 mt-4">© 2024 INSTAGRAM FROM META</p>
        </div>
      </div>
    </aside>
  );

  // Explore Page
  const ExplorePage = () => (
    <div className="max-w-[935px] mx-auto px-4 py-6">
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm outline-none focus:bg-gray-50 border border-transparent focus:border-gray-300"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1">
        {[...posts, ...posts].map((post, idx) => (
          <div key={idx} className="aspect-square bg-gray-100 relative group cursor-pointer overflow-hidden">
            <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
              <div className="flex items-center gap-1 text-white font-bold">
                <HeartIcon filled className="w-5 h-5" />
                <span>{post.likes.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-white font-bold">
                <CommentIcon className="w-5 h-5" />
                <span>{post.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Profile Page
  const ProfilePage = () => {
    const [profileTab, setProfileTab] = useState<'posts' | 'saved' | 'tagged'>('posts');

    return (
      <div className="max-w-[935px] mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex items-start gap-8 mb-10">
          <div className={`w-20 h-20 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br ${getAvatarGradient('me')} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold text-3xl sm:text-5xl">Y</span>
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <h2 className="text-xl font-light">{currentUser.username}</h2>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200">
                  エディット
                </button>
                <button className="px-4 py-1.5 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200">
                  アーカイブ
                </button>
                <button className="p-1.5 hover:opacity-50">
                  <SettingsIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex gap-8 mb-4">
              <span className="text-sm"><strong>{currentUser.posts}</strong> 投稿</span>
              <span className="text-sm"><strong>{currentUser.followers}</strong> フォロワー</span>
              <span className="text-sm"><strong>{currentUser.following}</strong> フォロー中</span>
            </div>
            <div className="text-sm">
              <p className="font-semibold">{currentUser.displayName}</p>
              <p className="whitespace-pre-line text-gray-800">{currentUser.bio}</p>
            </div>
          </div>
        </div>

        {/* Story Highlights */}
        <div className="flex gap-6 mb-8 overflow-x-auto pb-2">
          {['旅行', 'グルメ', 'ペット', '日常'].map((highlight) => (
            <div key={highlight} className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50">
                <span className="text-2xl">
                  {highlight === '旅行' ? '✈️' : highlight === 'グルメ' ? '🍜' : highlight === 'ペット' ? '🐕' : '📸'}
                </span>
              </div>
              <span className="text-xs">{highlight}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50">
              <span className="text-2xl text-gray-300">+</span>
            </div>
            <span className="text-xs">新規</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 flex justify-center gap-16">
          <button
            onClick={() => setProfileTab('posts')}
            className={`flex items-center gap-1 py-3 text-xs font-semibold tracking-wider uppercase border-t -mt-px ${profileTab === 'posts' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
          >
            <GridIcon className="w-3 h-3" /> 投稿
          </button>
          <button
            onClick={() => setProfileTab('saved')}
            className={`flex items-center gap-1 py-3 text-xs font-semibold tracking-wider uppercase border-t -mt-px ${profileTab === 'saved' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
          >
            <BookmarkIcon className="w-3 h-3" /> 保存
          </button>
          <button
            onClick={() => setProfileTab('tagged')}
            className={`flex items-center gap-1 py-3 text-xs font-semibold tracking-wider uppercase border-t -mt-px ${profileTab === 'tagged' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
          >
            タグ付け
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-1 mt-1">
          {posts.map((post) => (
            <div key={post.id} className="aspect-square bg-gray-100 relative group cursor-pointer overflow-hidden">
              <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                <div className="flex items-center gap-1 text-white font-bold">
                  <HeartIcon filled className="w-5 h-5" />
                  <span>{post.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-white font-bold">
                  <CommentIcon className="w-5 h-5" />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Notifications Panel
  const NotificationsPanel = () => (
    <div className="absolute left-[280px] top-0 w-[400px] bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50">
      <h3 className="font-bold text-base mb-4">通知</h3>
      <div className="space-y-4">
        <p className="text-sm font-semibold text-gray-500">今日</p>
        {users.slice(0, 4).map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <Avatar user={user} size="w-10 h-10" />
            <p className="text-sm flex-1">
              <span className="font-semibold">{user.username}</span>
              <span className="text-gray-600"> があなたの投稿にいいねしました。</span>
              <span className="text-gray-400 ml-1">2時間</span>
            </p>
            <div className={`w-10 h-10 rounded bg-gradient-to-br ${getAvatarGradient(user.id)} flex items-center justify-center`}>
              <span className="text-white text-xs font-bold">{getInitials(user.username)}</span>
            </div>
          </div>
        ))}
        <p className="text-sm font-semibold text-gray-500 pt-2">今週</p>
        {users.slice(4, 7).map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <Avatar user={user} size="w-10 h-10" />
            <p className="text-sm flex-1">
              <span className="font-semibold">{user.username}</span>
              <span className="text-gray-600"> のフォローを始めました。</span>
              <span className="text-gray-400 ml-1">3日</span>
            </p>
            <button className="px-4 py-1.5 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600">
              フォロー
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Mobile Bottom Nav
  const MobileNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden">
      <div className="flex items-center justify-around py-3">
        <button onClick={() => setCurrentPage('home')}>
          <HomeIcon filled={currentPage === 'home'} className="w-6 h-6" />
        </button>
        <button onClick={() => setCurrentPage('explore')}>
          <SearchIcon className="w-6 h-6" />
        </button>
        <button onClick={() => setCurrentPage('reels')}>
          <ReelsIcon filled={currentPage === 'reels'} className="w-6 h-6" />
        </button>
        <button>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </button>
        <button onClick={() => setCurrentPage('profile')}>
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getAvatarGradient('me')} flex items-center justify-center ${currentPage === 'profile' ? 'ring-2 ring-black' : ''}`}>
            <span className="text-white font-bold text-[7px]">Y</span>
          </div>
        </button>
      </div>
    </nav>
  );

  // Reels Page
  const ReelsPage = () => (
    <div className="max-w-[420px] mx-auto py-4 space-y-4">
      {posts.slice(0, 2).map((post, idx) => (
        <div key={idx} className="relative rounded-lg overflow-hidden bg-black aspect-[9/16] max-h-[85vh]">
          <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {/* Right actions */}
          <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5">
            <button className="flex flex-col items-center">
              <HeartIcon className="w-7 h-7 text-white" />
              <span className="text-white text-xs mt-1">{post.likes}</span>
            </button>
            <button className="flex flex-col items-center">
              <CommentIcon className="w-7 h-7 text-white" />
              <span className="text-white text-xs mt-1">{post.comments.length}</span>
            </button>
            <button className="flex flex-col items-center">
              <ShareIcon className="w-7 h-7 text-white" />
            </button>
            <button>
              <MoreIcon className="w-7 h-7 text-white" />
            </button>
          </div>
          {/* Bottom info */}
          <div className="absolute bottom-4 left-3 right-16">
            <div className="flex items-center gap-2 mb-2">
              <Avatar user={post.user} size="w-8 h-8" />
              <span className="text-white text-sm font-semibold">{post.user.username}</span>
              <button className="text-white text-xs border border-white rounded px-2 py-0.5">フォロー</button>
            </div>
            <p className="text-white text-sm line-clamp-2">{post.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // Messages Page
  const MessagesPage = () => (
    <div className="max-w-[935px] mx-auto h-[calc(100vh-60px)] flex border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Chat list */}
      <div className="w-[350px] border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold">{currentUser.username}</h2>
          <button><PlusIcon className="w-5 h-5" /></button>
        </div>
        <div className="p-3">
          <input
            type="text"
            placeholder="検索"
            className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm outline-none"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.slice(0, 6).map((user) => (
            <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
              <Avatar user={user} size="w-12 h-12" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{user.username}</p>
                <p className="text-xs text-gray-500">アクティブ 2時間前</p>
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
          ))}
        </div>
      </div>
      {/* Chat area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center mb-4">
          <MessageIcon className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-semibold mb-1">メッセージ</h3>
        <p className="text-sm text-gray-500 mb-4">友達やグループにメッセージを送りましょう</p>
        <button className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600">
          メッセージを送信
        </button>
      </div>
    </div>
  );

  // Create Post Modal
  const CreatePostModal = () => {
    const [step, setStep] = useState<'upload' | 'edit' | 'share'>('upload');
    
    return (
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-[700px] overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <button onClick={() => setCurrentPage('home')} className="text-sm">
              <CloseIcon className="w-5 h-5" />
            </button>
            <h3 className="font-semibold">新規投稿</h3>
            <button className="text-sm font-semibold text-blue-500">
              {step === 'upload' ? '次へ' : 'シェア'}
            </button>
          </div>
          <div className="aspect-square flex items-center justify-center bg-gray-50">
            {step === 'upload' ? (
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <p className="text-xl font-light mb-4">写真と動画 dragged here</p>
                <button className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg">
                  PCから選択
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <p>プレビュー</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render page content
  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="flex justify-center">
            <div className="w-full max-w-[470px]">
              <StoriesBar />
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <RightSidebar />
          </div>
        );
      case 'explore':
        return <ExplorePage />;
      case 'reels':
        return <ReelsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'notifications':
        return <ExplorePage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main content */}
      <main className={`${sidebarCollapsed ? 'ml-[72px]' : 'ml-[245px]'} transition-all duration-300 pb-16 lg:pb-0`}>
        <div className="py-6 px-4">
          {renderContent()}
        </div>
      </main>

      {/* Notifications */}
      {showNotifications && currentPage === 'notifications' && <NotificationsPanel />}

      {/* Create Post */}
      {currentPage === 'create' && <CreatePostModal />}

      {/* Story Viewer */}
      <StoryViewer />

      {/* Mobile Nav */}
      <MobileNav />
    </div>
  );
}

export default App;
