import { useState } from 'react';

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useProxy, setUseProxy] = useState(true);

  // プロキシURL（サーバー経由）または直接URL
  const proxyUrl = '/ig/?hl=ja';
  const directUrl = 'https://www.instagram.com/?hl=ja';
  const displayUrl = useProxy ? proxyUrl : directUrl;

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 bg-white flex flex-col' : 'h-screen flex flex-col bg-white'}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
          <span className="text-sm font-medium">Instagram Viewer</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex items-center bg-gray-800 rounded overflow-hidden">
            <button
              onClick={() => setUseProxy(true)}
              className={`px-3 py-1.5 text-xs transition-colors ${useProxy ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Proxy
            </button>
            <button
              onClick={() => setUseProxy(false)}
              className={`px-3 py-1.5 text-xs transition-colors ${!useProxy ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Direct
            </button>
          </div>

          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            新規タブ
          </a>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            {isFullscreen ? (
              <>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="14" y1="10" x2="21" y2="3" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
                戻す
              </>
            ) : (
              <>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
                全画面
              </>
            )}
          </button>
        </div>
      </div>

      {/* URL Bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 px-3 py-1.5 bg-white rounded border border-gray-300">
          <svg className="w-3 h-3 text-green-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="text-xs text-gray-600 truncate">
            {useProxy ? `${window.location.origin}/ig/?hl=ja` : directUrl}
          </span>
        </div>
        <button
          onClick={() => {
            setIsLoading(true);
            const iframe = document.getElementById('instagram-frame') as HTMLIFrameElement;
            if (iframe) {
              iframe.src = displayUrl;
            }
          }}
          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
          title="再読み込み"
        >
          <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>

      {/* iframe Container */}
      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <svg className="animate-spin w-8 h-8 mx-auto mb-3 text-gray-400" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" />
              </svg>
              <p className="text-sm text-gray-500">Instagramを読み込んでいます...</p>
              <p className="text-xs text-gray-400 mt-1">
                {useProxy ? 'プロキシ経由で接続中' : '直接接続中'}
              </p>
            </div>
          </div>
        )}

        <iframe
          id="instagram-frame"
          src={displayUrl}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          allow="camera; microphone; geolocation; autoplay; encrypted-media; clipboard-write"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-top-navigation-by-user-activation"
          title="Instagram"
        />
      </div>
    </div>
  );
}

export default App;
