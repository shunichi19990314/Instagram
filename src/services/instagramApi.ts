// Instagram oEmbed API Service
// 2026年6月15日からトークン不要で利用可能
// エンドポイント: GET https://graph.facebook.com/v26.0/instagram_oembed?url={post_url}

const GRAPH_API_BASE = 'https://graph.facebook.com/v26.0/instagram_oembed';

// CORSプロキシ（graph.facebook.comはCORSをブロックするためプロキシ経由でアクセス）
const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

export interface OEmbedResponse {
  html: string;
  provider_name: string;
  provider_url: string;
  type: string;
  version: string;
  width: number;
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

export interface EmbedOptions {
  maxwidth?: number;
  hidecaption?: boolean;
  omitscript?: boolean;
}

/**
 * Instagram oEmbed APIを呼び出して埋め込みHTMLを取得
 */
export async function fetchInstagramEmbed(
  postUrl: string,
  options: EmbedOptions = {}
): Promise<OEmbedResponse> {
  const params = new URLSearchParams({
    url: postUrl,
    ...(options.maxwidth && { maxwidth: String(options.maxwidth) }),
    ...(options.hidecaption !== undefined && { hidecaption: String(options.hidecaption) }),
    ...(options.omitscript !== undefined && { omitscript: String(options.omitscript) }),
  });

  const apiUrl = `${GRAPH_API_BASE}?${params.toString()}`;

  // まず直接アクセスを試みる（CORSが許可されている場合）
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || 'oEmbed API error');
      }
      return data as OEmbedResponse;
    }
  } catch (e) {
    // CORS error or network error - fall through to proxies
    console.log('Direct API call failed, trying CORS proxies...');
  }

  // CORSプロキシを順番に試す
  for (const proxyFn of CORS_PROXIES) {
    try {
      const proxyUrl = proxyFn(apiUrl);
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const text = await response.text();
        let data: OEmbedResponse;
        try {
          data = JSON.parse(text);
        } catch {
          continue; // Not JSON, try next proxy
        }

        if (data.error) {
          throw new Error(data.error.message || 'oEmbed API error');
        }

        if (data.html) {
          return data;
        }
      }
    } catch (e) {
      console.log(`Proxy failed, trying next...`);
      continue;
    }
  }

  throw new Error('Instagram oEmbed APIへのアクセスに失敗しました。すべてのCORSプロキシが機能していません。');
}

/**
 * Instagramの投稿URLからshortcodeを抽出
 */
export function extractShortcode(url: string): string | null {
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
}

/**
 * URLが有効なInstagram投稿URLかチェック
 */
export function isValidInstagramUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9_-]+/.test(url);
}

/**
 * Instagram embed.jsを読み込む
 */
export function loadInstagramEmbedScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).instgrm) {
      resolve();
      return;
    }

    const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]');
    if (existingScript) {
      // Script already loading, wait a bit
      setTimeout(resolve, 1000);
      return;
    }

    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Instagram embed script'));
    document.head.appendChild(script);
  });
}

/**
 * 埋め込みHTMLを処理（Instagramのembed.jsでレンダリング）
 */
export function processEmbeds(): void {
  setTimeout(() => {
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, 300);
}
