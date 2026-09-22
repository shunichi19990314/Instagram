import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchInstagramEmbed,
  extractShortcode,
  isValidInstagramUrl,
  loadInstagramEmbedScript,
  processEmbeds,
  OEmbedResponse,
} from './services/instagramApi';
import {
  HomeIcon, SearchIcon, HeartIcon, BookmarkIcon,
  MoreIcon, PlusIcon, MenuIcon, GridIcon, SettingsIcon,
  CloseIcon, MessageIcon, ReelsIcon, ShareIcon, CommentIcon
} from './components/Icons';

interface SavedEmbed {
  id: string;
  url: string;
  html: string;
  timestamp: number;
}

type Page = 'home' | 'explore' | 'reels' | 'messages' | 'profile' | 'api';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('api');
  const [inputUrl, setInputUrl] = useState('');
  const [currentEmbed, setCurrentEmbed] = useState<OEmbedResponse | null>(null);
  const [savedEmbeds, setSavedEmbeds] = useState<SavedEmbed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [embedOptions, setEmbedOptions] = useState({
    maxwidth: 540,
    hidecaption: false,
    omitscript: false,
  });
  const [apiInfo, setApiInfo] = useState({
    requestsToday: 0,
    lastRequest: '',
    status: 'ready',
  });
  const embedContainerRef = useRef<HTMLDivElement>(null);

  // Load saved embeds from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ig_embeds');
    if (saved) {
      try {
        setSavedEmbeds(JSON.parse(saved));
      } catch { /* ignore */ }
    }
    const apiInfoSaved = localStorage.getItem('ig_api_info');
    if (apiInfoSaved) {
      try {
        setApiInfo(JSON.parse(apiInfoSaved));
      } catch { /* ignore */ }
    }
  }, []);

  // Save embeds to localStorage
  useEffect(() => {
    localStorage.setItem('ig_embeds', JSON.stringify(savedEmbeds));
  }, [savedEmbeds]);

  useEffect(() => {
    localStorage.setItem('ig_api_info', JSON.stringify(apiInfo));
  }, [apiInfo]);

  // Load Instagram embed script
  useEffect(() => {
    loadInstagramEmbedScript().catch(() => {
      console.log('Instagram embed script will be loaded on demand');
    });
  }, []);

  // Process embeds when content changes
  useEffect(() => {
    if (currentEmbed) {
      processEmbeds();
    }
  }, [currentEmbed]);

  const handleFetchEmbed = useCallback(async () => {
    setError('');
    const url = inputUrl.trim();

    if (!url) {
      setError('Instagramの投稿URLを入力してください');
      return;
    }

    if (!isValidInstagramUrl(url)) {
      setError('有効なInstagramの投稿URLを入力してください（例: https://www.instagram.com/p/xxxxx/）');
      return;
    }

    setLoading(true);
    setCurrentEmbed(null);

    try {
      const data = await fetchInstagramEmbed(url, embedOptions);
      setCurrentEmbed(data);
      setApiInfo((prev) => ({
        ...prev,
        requestsToday: prev.requestsToday + 1,
        lastRequest: new Date().toLocaleString('ja-JP'),
        status: 'success',
      }));
    } catch (err: any) {
      setError(err.message || '埋め込みの取得に失敗しました');
      setApiInfo((prev) => ({
        ...prev,
        status: 'error',
        lastRequest: new Date().toLocaleString('ja-JP'),
      }));
    } finally {
      setLoading(false);
    }
  }, [inputUrl, embedOptions]);

  const handleSaveEmbed = () => {
    if (!currentEmbed || !inputUrl) return;
    const newEmbed: SavedEmbed = {
      id: Date.now().toString(),
      url: inputUrl,
      html: currentEmbed.html,
      timestamp: Date.now(),
    };
    setSavedEmbeds((prev) => [newEmbed, ...prev]);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedEmbeds((prev) => prev.filter((e) => e.id !== id));
  };

  const handleLoadSaved = (embed: SavedEmbed) => {
    setInputUrl(embed.url);
    setCurrentEmbed({
      html: embed.html,
      provider_name: 'Instagram',
      provider_url: 'https://www.instagram.com',
      type: 'rich',
      version: '1.0',
      width: embedOptions.maxwidth,
    });
    setCurrentPage('api');
  };

  const getInitials = (name: string) => name.charAt(0).toUpperCase();
  const getAvatarGradient = (id: string) => {
    const gradients = [
      'from-yellow-400 via-pink-500 to-purple-600',
      'from-blue-400 via-purple-500 to-pink-500',
      'from-green-400 via-blue-500 to-purple-500',
      'from-pink-400 via-red-500 to-yellow-500',
    ];
    return gradients[parseInt(id.replace(/\D/g, '')) % gradients.length];
  };

  // Sidebar
  const Sidebar = () => (
    <nav className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-[72px]' : 'w-[245px]'}`}>
      <div className="px-3 pt-8 pb-4">
        {sidebarCollapsed ? (
          <div className="w-6 h-6 mx-auto">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="currentColor"/>
            </svg>
          </div>
        ) : (
          <h1 className="text-2xl font-semibold px-3" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>Instagram</h1>
        )}
      </div>

      <div className="flex-1 px-3 space-y-1">
        {[
          { id: 'api' as Page, label: '🔌 API ビューアー', icon: null },
          { id: 'home' as Page, label: 'ホーム', icon: HomeIcon },
          { id: 'explore' as Page, label: '検索', icon: SearchIcon },
          { id: 'reels' as Page, label: 'リール', icon: ReelsIcon },
          { id: 'messages' as Page, label: 'メッセージ', icon: MessageIcon },
          { id: 'profile' as Page, label: 'プロフィール', icon: null },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex items-center gap-4 w-full px-3 py-3 rounded-lg hover:bg-gray-100 transition-all ${currentPage === item.id ? 'font-bold' : ''}`}
          >
            {item.icon ? <item.icon className="w-6 h-6" /> : <span className="w-6 h-6 flex items-center justify-center text-sm">{item.label.charAt(0)}</span>}
            {!sidebarCollapsed && <span className="text-[15px]">{item.label}</span>}
          </button>
        ))}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex items-center gap-4 w-full px-3 py-3 rounded-lg hover:bg-gray-100 transition-all"
        >
          <MenuIcon className="w-6 h-6" />
          {!sidebarCollapsed && <span className="text-[15px]">もっと見る</span>}
        </button>
      </div>

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

  // API Viewer Page (Main feature)
  const ApiViewerPage = () => (
    <div className="max-w-[935px] mx-auto px-4 py-6">
      {/* API Status Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${apiInfo.status === 'success' ? 'bg-green-500' : apiInfo.status === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
          <span className="text-sm font-semibold text-blue-800">Instagram oEmbed API</span>
          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">v26.0 • トークン不要</span>
        </div>
        <p className="text-xs text-blue-700">
          エンドポイント: <code className="bg-blue-100 px-1 rounded">graph.facebook.com/v26.0/instagram_oembed</code>
          &nbsp;|&nbsp; リクエスト数: {apiInfo.requestsToday}
          &nbsp;|&nbsp; 最終リクエスト: {apiInfo.lastRequest || 'なし'}
        </p>
      </div>

      {/* URL Input */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-xl">📡</span>
          Instagram投稿をAPIで取得
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/xxxxx/"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleFetchEmbed()}
            />
            <button
              onClick={handleFetchEmbed}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" />
                  </svg>
                  取得中...
                </>
              ) : (
                <>
                  <SearchIcon className="w-4 h-4" />
                  API呼び出し
                </>
              )}
            </button>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-4 items-center pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">maxwidth:</span>
              <input
                type="range"
                min="320"
                max="658"
                value={embedOptions.maxwidth}
                onChange={(e) => setEmbedOptions((prev) => ({ ...prev, maxwidth: parseInt(e.target.value) }))}
                className="w-24"
              />
              <span className="text-gray-800 font-mono text-xs">{embedOptions.maxwidth}px</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={embedOptions.hidecaption}
                onChange={(e) => setEmbedOptions((prev) => ({ ...prev, hidecaption: e.target.checked }))}
                className="rounded"
              />
              <span className="text-gray-600">hidecaption</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={embedOptions.omitscript}
                onChange={(e) => setEmbedOptions((prev) => ({ ...prev, omitscript: e.target.checked }))}
                className="rounded"
              />
              <span className="text-gray-600">omitscript</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 flex items-center gap-2">
              <span>⚠️</span> {error}
            </p>
          </div>
        )}

        {/* Sample URLs */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">サンプルURL（クリックで入力）:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'https://www.instagram.com/p/DFz9aIuySCT/',
              'https://www.instagram.com/reel/DFxKJpOyGQN/',
              'https://www.instagram.com/p/DFwLmAxS5jM/',
            ].map((url) => (
              <button
                key={url}
                onClick={() => setInputUrl(url)}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors truncate max-w-[200px]"
              >
                {extractShortcode(url)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* API Response */}
      {currentEmbed && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          {/* Response Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-green-100 text-green-700 px-2 py-0.5 rounded">200 OK</span>
              <span className="text-xs text-gray-500">
                {currentEmbed.provider_name} • type: {currentEmbed.type} • width: {currentEmbed.width}px
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveEmbed}
                className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
              >
                💾 保存
              </button>
              <a
                href={inputUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
              >
                🔗 元ページ
              </a>
            </div>
          </div>

          {/* Embed Content */}
          <div ref={embedContainerRef} className="p-6 flex justify-center min-h-[300px] bg-white">
            <div
              className="instagram-embed-container"
              dangerouslySetInnerHTML={{ __html: currentEmbed.html }}
            />
          </div>

          {/* Raw Response */}
          <details className="border-t border-gray-200">
            <summary className="px-4 py-3 text-xs text-gray-500 cursor-pointer hover:bg-gray-50">
              📋 レスポンスJSONを表示
            </summary>
            <pre className="px-4 py-3 bg-gray-900 text-green-400 text-xs overflow-x-auto max-h-[300px]">
              {JSON.stringify({
                html: currentEmbed.html.substring(0, 200) + '...',
                provider_name: currentEmbed.provider_name,
                provider_url: currentEmbed.provider_url,
                type: currentEmbed.type,
                version: currentEmbed.version,
                width: currentEmbed.width,
              }, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* API Documentation */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span>📖</span> API仕様
        </h3>
        <div className="space-y-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-mono text-xs text-gray-600 mb-2">ENDPOINT</p>
            <code className="text-sm text-blue-600">GET https://graph.facebook.com/v26.0/instagram_oembed</code>
          </div>

          <div>
            <p className="font-semibold mb-2">パラメータ</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4">名前</th>
                  <th className="text-left py-2 pr-4">型</th>
                  <th className="text-left py-2 pr-4">必須</th>
                  <th className="text-left py-2">説明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-mono text-blue-600">url</td>
                  <td className="py-2 pr-4">URI</td>
                  <td className="py-2 pr-4"><span className="bg-red-100 text-red-600 px-1 rounded">必須</span></td>
                  <td className="py-2">投稿のURL</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-mono text-blue-600">maxwidth</td>
                  <td className="py-2 pr-4">int64</td>
                  <td className="py-2 pr-4"><span className="bg-gray-100 text-gray-600 px-1 rounded">任意</span></td>
                  <td className="py-2">最大幅 (320-658)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-mono text-blue-600">hidecaption</td>
                  <td className="py-2 pr-4">boolean</td>
                  <td className="py-2 pr-4"><span className="bg-gray-100 text-gray-600 px-1 rounded">任意</span></td>
                  <td className="py-2">キャプションを非表示</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-blue-600">omitscript</td>
                  <td className="py-2 pr-4">boolean</td>
                  <td className="py-2 pr-4"><span className="bg-gray-100 text-gray-600 px-1 rounded">任意</span></td>
                  <td className="py-2">JSを含まないHTMLを返す</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <p className="font-semibold mb-2">レスポンスフィールド</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded"><code className="text-blue-600">html</code> - 埋め込みHTML</div>
              <div className="bg-gray-50 p-2 rounded"><code className="text-blue-600">provider_name</code> - "Instagram"</div>
              <div className="bg-gray-50 p-2 rounded"><code className="text-blue-600">provider_url</code> - Instagram URL</div>
              <div className="bg-gray-50 p-2 rounded"><code className="text-blue-600">type</code> - "rich"</div>
              <div className="bg-gray-50 p-2 rounded"><code className="text-blue-600">version</code> - "1.0"</div>
              <div className="bg-gray-50 p-2 rounded"><code className="text-blue-600">width</code> - 幅(px)</div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>⚡ 2026年6月15日〜</strong> トークン不要でアクセス可能。レート制限: 1時間あたり1,000リクエスト。
              App Review不要で公開投稿の埋め込みが可能。
            </p>
          </div>
        </div>
      </div>

      {/* Saved Embeds */}
      {savedEmbeds.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BookmarkIcon filled className="w-5 h-5" />
            保存した埋め込み ({savedEmbeds.length})
          </h3>
          <div className="space-y-2">
            {savedEmbeds.map((embed) => (
              <div key={embed.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">{embed.url}</p>
                  <p className="text-xs text-gray-500">{new Date(embed.timestamp).toLocaleString('ja-JP')}</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={() => handleLoadSaved(embed)}
                    className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                  >
                    表示
                  </button>
                  <button
                    onClick={() => handleDeleteSaved(embed.id)}
                    className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Home Page (mock feed)
  const HomePage = () => (
    <div className="max-w-[470px] mx-auto py-6">
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">🏠</div>
        <h2 className="text-lg font-semibold mb-2">ホームフィード</h2>
        <p className="text-sm text-gray-500 mb-4">
          Instagramのホームフィードはログインが必要です。<br/>
          APIビューアーで公開投稿を表示できます。
        </p>
        <button
          onClick={() => setCurrentPage('api')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
        >
          🔌 APIビューアーへ
        </button>
      </div>
    </div>
  );

  // Explore Page
  const ExplorePage = () => (
    <div className="max-w-[935px] mx-auto px-4 py-6">
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-lg font-semibold mb-2">探索ページ</h2>
        <p className="text-sm text-gray-500 mb-4">
          探索機能にはログインが必要です。
        </p>
        <button
          onClick={() => setCurrentPage('api')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
        >
          🔌 APIで投稿を取得
        </button>
      </div>
    </div>
  );

  // Profile Page
  const ProfilePage = () => (
    <div className="max-w-[935px] mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">👤</div>
        <h2 className="text-lg font-semibold mb-2">プロフィール</h2>
        <p className="text-sm text-gray-500 mb-4">
          プロフィール機能にはログインが必要です。
        </p>
        <button
          onClick={() => setCurrentPage('api')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
        >
          🔌 APIビューアーへ
        </button>
      </div>
    </div>
  );

  // Messages Page
  const MessagesPage = () => (
    <div className="max-w-[935px] mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">💬</div>
        <h2 className="text-lg font-semibold mb-2">メッセージ</h2>
        <p className="text-sm text-gray-500">
          メッセージ機能にはログインが必要です。
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'api': return <ApiViewerPage />;
      case 'home': return <HomePage />;
      case 'explore': return <ExplorePage />;
      case 'reels': return <HomePage />;
      case 'messages': return <MessagesPage />;
      case 'profile': return <ProfilePage />;
      default: return <ApiViewerPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className={`${sidebarCollapsed ? 'ml-[72px]' : 'ml-[245px]'} transition-all duration-300`}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
