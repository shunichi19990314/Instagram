import { useState, useEffect, useCallback, useRef } from 'react';

interface SavedPost {
  id: string;
  url: string;
  shortcode: string;
  timestamp: number;
}

function App() {
  const [inputUrl, setInputUrl] = useState('');
  const [currentEmbed, setCurrentEmbed] = useState<string | null>(null);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'viewer' | 'gallery' | 'profile'>('viewer');
  const [profileUrl, setProfileUrl] = useState('');
  const embedRef = useRef<HTMLDivElement>(null);

  // Load saved posts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ig_saved_posts');
    if (saved) {
      try {
        setSavedPosts(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  // Save posts to localStorage
  useEffect(() => {
    localStorage.setItem('ig_saved_posts', JSON.stringify(savedPosts));
  }, [savedPosts]);

  // Process embeds when content changes
  const processEmbeds = useCallback(() => {
    setTimeout(() => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      }
    }, 500);
  }, []);

  useEffect(() => {
    if (currentEmbed) {
      processEmbeds();
    }
  }, [currentEmbed, processEmbeds]);

  const extractShortcode = (url: string): string | null => {
    // Match various Instagram URL formats
    const patterns = [
      /instagram\.com\/p\/([a-zA-Z0-9_-]+)/,
      /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/,
      /instagram\.com\/tv\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleViewPost = () => {
    setError('');
    const shortcode = extractShortcode(inputUrl);
    if (!shortcode) {
      setError('有効なInstagramの投稿URLを入力してください');
      return;
    }

    const embedHtml = `https://www.instagram.com/p/${shortcode}/`;
    setCurrentEmbed(embedHtml);
  };

  const handleSavePost = () => {
    const shortcode = extractShortcode(inputUrl);
    if (!shortcode) {
      setError('有効なInstagramの投稿URLを入力してください');
      return;
    }

    const newPost: SavedPost = {
      id: Date.now().toString(),
      url: inputUrl,
      shortcode,
      timestamp: Date.now(),
    };

    setSavedPosts((prev) => [newPost, ...prev]);
    setError('');
  };

  const handleDeletePost = (id: string) => {
    setSavedPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleViewSavedPost = (post: SavedPost) => {
    setInputUrl(post.url);
    setCurrentEmbed(`https://www.instagram.com/p/${post.shortcode}/`);
    setActiveTab('viewer');
  };

  const handleOpenProfile = () => {
    if (profileUrl.trim()) {
      const username = profileUrl.replace(/https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '');
      window.open(`https://www.instagram.com/${username}/`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
              <i className="fab fa-instagram text-white text-xl"></i>
            </div>
            <h1 className="text-white text-xl font-bold">Instagram Viewer</h1>
          </div>
          <nav className="flex gap-1">
            {(['viewer', 'gallery', 'profile'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab === 'viewer' && '📖 ビューアー'}
                {tab === 'gallery' && '🖼️ ギャラリー'}
                {tab === 'profile' && '👤 プロフィール'}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Viewer Tab */}
        {activeTab === 'viewer' && (
          <div className="space-y-6">
            {/* Input Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-white text-lg font-semibold mb-4">
                <i className="fas fa-link mr-2"></i>
                Instagram投稿を表示
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://www.instagram.com/p/xxxxx/"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && handleViewPost()}
                />
                <button
                  onClick={handleViewPost}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-eye mr-2"></i>
                  表示
                </button>
                <button
                  onClick={handleSavePost}
                  className="px-6 py-3 bg-white/10 border border-white/30 text-white rounded-xl font-medium hover:bg-white/20 transition-all"
                >
                  <i className="fas fa-bookmark mr-2"></i>
                  保存
                </button>
              </div>
              {error && (
                <p className="mt-3 text-red-300 text-sm">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {error}
                </p>
              )}
              <div className="mt-4 text-white/50 text-sm">
                <p>対応形式: /p/ (投稿), /reel/ (リール), /tv/ (IGTV)</p>
              </div>
            </div>

            {/* Embed Display */}
            {currentEmbed && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">
                    <i className="fas fa-image mr-2"></i>
                    埋め込み表示
                  </h3>
                  <a
                    href={currentEmbed}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-300 hover:text-pink-200 text-sm flex items-center gap-1"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    Instagramで開く
                  </a>
                </div>
                <div ref={embedRef} className="flex justify-center min-h-[400px]">
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={currentEmbed}
                    data-instgrm-version="14"
                    style={{
                      background: '#FFF',
                      border: '0',
                      borderRadius: '3px',
                      margin: '1px',
                      maxWidth: '540px',
                      minWidth: '326px',
                      padding: '0',
                      width: '99.375%',
                    }}
                  >
                    <div style={{ padding: '16px' }}>
                      <a
                        href={currentEmbed}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#FFFFFF',
                          lineHeight: '0',
                          padding: '0 0',
                          textAlign: 'center',
                          textDecoration: 'none',
                          width: '100%',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <div
                            style={{
                              backgroundColor: '#F4F4F4',
                              borderRadius: '50%',
                              flexGrow: 0,
                              height: '40px',
                              marginRight: '14px',
                              width: '40px',
                            }}
                          ></div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              flexGrow: 1,
                              justifyContent: 'center',
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: '#F4F4F4',
                                borderRadius: '4px',
                                flexGrow: 0,
                                height: '14px',
                                marginBottom: '6px',
                                width: '100px',
                              }}
                            ></div>
                            <div
                              style={{
                                backgroundColor: '#F4F4F4',
                                borderRadius: '4px',
                                flexGrow: 0,
                                height: '14px',
                                width: '60px',
                              }}
                            ></div>
                          </div>
                        </div>
                        <div style={{ padding: '19% 0' }}></div>
                        <div
                          style={{
                            display: 'block',
                            height: '50px',
                            margin: '0 auto 12px',
                            width: '50px',
                          }}
                        >
                          <svg
                            width="50px"
                            height="50px"
                            version="1.1"
                            viewBox="0 0 50 50"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M25 1c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24zm0 45.3c-11.7 0-21.3-9.5-21.3-21.3s9.5-21.3 21.3-21.3 21.3 9.5 21.3 21.3-9.5 21.3-21.3 21.3z"
                              fill="#C8C8C8"
                            ></path>
                          </svg>
                        </div>
                      </a>
                    </div>
                  </blockquote>
                </div>
              </div>
            )}

            {/* Quick Links */}
            {!currentEmbed && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-semibold mb-4">
                  <i className="fas fa-bolt mr-2"></i>
                  クイックリンク
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { name: 'Instagram ホーム', url: 'https://www.instagram.com/', icon: '🏠' },
                    { name: 'Instagram リール', url: 'https://www.instagram.com/reels/', icon: '🎬' },
                    { name: 'Instagram 探索', url: 'https://www.instagram.com/explore/', icon: '🔍' },
                  ].map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group"
                    >
                      <span className="text-2xl">{link.icon}</span>
                      <span className="text-white/80 group-hover:text-white text-sm font-medium">
                        {link.name}
                      </span>
                      <i className="fas fa-external-link-alt text-white/30 ml-auto text-xs"></i>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-white text-lg font-semibold mb-4">
                <i className="fas fa-images mr-2"></i>
                保存した投稿 ({savedPosts.length})
              </h2>
              {savedPosts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📭</div>
                  <p className="text-white/60">保存した投稿はまだありません</p>
                  <p className="text-white/40 text-sm mt-2">
                    ビューアータブでURLを入力して「保存」をクリック
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all group"
                    >
                      <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                        <i className="fab fa-instagram text-4xl text-white/30"></i>
                      </div>
                      <div className="p-4">
                        <p className="text-white/70 text-xs truncate mb-2">
                          {post.url}
                        </p>
                        <p className="text-white/40 text-xs mb-3">
                          {new Date(post.timestamp).toLocaleDateString('ja-JP')}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewSavedPost(post)}
                            className="flex-1 px-3 py-2 bg-pink-500/20 text-pink-300 rounded-lg text-xs font-medium hover:bg-pink-500/30 transition-all"
                          >
                            <i className="fas fa-eye mr-1"></i>
                            表示
                          </button>
                          <a
                            href={`https://www.instagram.com/p/${post.shortcode}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-3 py-2 bg-white/10 text-white/70 rounded-lg text-xs font-medium hover:bg-white/20 transition-all text-center"
                          >
                            <i className="fas fa-external-link-alt mr-1"></i>
                            開く
                          </a>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-all"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-white text-lg font-semibold mb-4">
                <i className="fas fa-user-circle mr-2"></i>
                Instagramプロフィールを開く
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  type="text"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="ユーザー名またはURLを入力"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleOpenProfile()}
                />
                <button
                  onClick={handleOpenProfile}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  プロフィールを開く
                </button>
              </div>

              {/* Popular Accounts Quick Access */}
              <h3 className="text-white/80 text-sm font-medium mb-3">人気のアカウント</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { name: 'instagram', label: 'Instagram' },
                  { name: 'natgeo', label: 'National Geographic' },
                  { name: 'nike', label: 'Nike' },
                  { name: 'nasa', label: 'NASA' },
                  { name: 'nba', label: 'NBA' },
                  { name: 'starbucks', label: 'Starbucks' },
                  { name: 'nintendo', label: 'Nintendo' },
                  { name: 'adidas', label: 'Adidas' },
                ].map((account) => (
                  <a
                    key={account.name}
                    href={`https://www.instagram.com/${account.name}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {account.name[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="text-white/70 text-sm truncate">@{account.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Instagram Embed Profile */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">
                <i className="fas fa-info-circle mr-2"></i>
                プロフィールの埋め込みについて
              </h3>
              <div className="text-white/60 text-sm space-y-3">
                <p>
                  Instagramはセキュリティ上の理由から、プロフィールページをiframeで直接埋め込むことを許可していません。
                  そのため、このアプリでは以下の方法でInstagramコンテンツを表示します：
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong className="text-white/80">投稿の埋め込み:</strong> 公式embed APIを使用して投稿をサイト内に表示</li>
                  <li><strong className="text-white/80">プロフィール表示:</strong> 新しいタブでInstagramプロフィールを開く</li>
                  <li><strong className="text-white/80">ギャラリー:</strong> 保存した投稿をまとめて管理・表示</li>
                </ul>
                <p className="text-white/40 text-xs mt-4">
                  ※ 埋め込み表示にはInstagramの公式embed.jsスクリプトを使用しています。
                  投稿が正しく表示されない場合は、ページを再読み込みしてください。
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/20 border-t border-white/10 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-white/40 text-sm">
            <i className="fab fa-instagram mr-2"></i>
            Instagram Viewer - サイト内ブラウザ
          </p>
          <p className="text-white/20 text-xs mt-2">
            InstagramはMeta Platforms, Inc.の商標です。このアプリはInstagramの公式embed機能を使用しています。
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
