import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const INSTAGRAM_HOST = 'www.instagram.com';

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// Proxy request to Instagram
function proxyToInstagram(req, res, targetPath) {
  const options = {
    hostname: INSTAGRAM_HOST,
    port: 443,
    path: targetPath || '/',
    method: req.method,
    headers: {
      ...req.headers,
      'host': INSTAGRAM_HOST,
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'accept-language': 'ja,en;q=0.9',
      'user-agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'accept-encoding': 'identity',
    },
  };

  // Remove headers that cause issues
  delete options.headers['connection'];
  delete options.headers['referer'];
  delete options.headers['origin'];

  const proxyReq = https.request(options, (proxyRes) => {
    // Remove security headers that block embedding
    const headers = { ...proxyRes.headers };
    delete headers['x-frame-options'];
    delete headers['content-security-policy'];
    delete headers['content-security-policy-report-only'];
    delete headers['cross-origin-opener-policy'];
    delete headers['cross-origin-embedder-policy'];
    delete headers['strict-transport-security'];

    // Handle redirects
    if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && headers.location) {
      // Rewrite redirect URLs
      let location = headers.location;
      if (location.startsWith('/')) {
        location = location; // Keep relative
      }
      res.writeHead(proxyRes.statusCode, {
        ...headers,
        location: location,
      });
      res.end();
      return;
    }

    // For HTML responses, modify content to work in our proxy
    const contentType = proxyRes.headers['content-type'] || '';

    if (contentType.includes('text/html')) {
      let body = '';
      proxyRes.setEncoding('utf-8');
      proxyRes.on('data', (chunk) => {
        body += chunk;
      });
      proxyRes.on('end', () => {
        // Inject base tag and modify links
        let modified = body;

        // Add base tag for relative URLs
        if (!modified.includes('<base')) {
          modified = modified.replace(
            '<head>',
            `<head><base href="https://www.instagram.com/">`
          );
        }

        // Remove X-Frame-Buster scripts
        modified = modified.replace(
          /if\s*\(\s*window\.top\s*!==?\s*window\.self\s*\).*?;/g,
          '// frame-buster removed'
        );
        modified = modified.replace(
          /top\.location\s*=\s*self\.location/g,
          '// removed'
        );
        modified = modified.replace(
          /self\.location\s*=\s*top\.location/g,
          '// removed'
        );

        // Remove CSP meta tags
        modified = modified.replace(
          /<meta[^>]*http-equiv=["']content-security-policy["'][^>]*>/gi,
          ''
        );

        delete headers['content-length'];
        headers['content-type'] = 'text/html; charset=utf-8';

        res.writeHead(proxyRes.statusCode, headers);
        res.end(modified);
      });
    } else {
      // For non-HTML, pipe directly
      delete headers['content-length'];
      res.writeHead(proxyRes.statusCode, headers);
      proxyRes.pipe(res);
    }
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err.message);
    res.writeHead(502, { 'content-type': 'text/html; charset=utf-8' });
    res.end(`
      <html>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="text-align: center;">
            <h2>Proxy Error</h2>
            <p>${err.message}</p>
            <a href="/">Go Home</a>
          </div>
        </body>
      </html>
    `);
  });

  req.pipe(proxyReq);
}

// Serve static files from dist/
function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Try index.html for SPA routing
      const indexPath = path.join(__dirname, 'dist', 'index.html');
      fs.readFile(indexPath, (err2, indexData) => {
        if (err2) {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        res.end(indexData);
      });
      return;
    }
    res.writeHead(200, { 'content-type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  console.log(`${req.method} ${pathname}`);

  // Health check endpoint
  if (pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // Proxy Instagram requests
  if (pathname.startsWith('/ig/')) {
    const igPath = pathname.slice(3) || '/';
    const igQuery = url.search || '';
    proxyToInstagram(req, res, igPath + igQuery);
    return;
  }

  // Main page - show Instagram in iframe via our proxy
  if (pathname === '/' || pathname === '/index.html') {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    fs.readFile(indexPath, 'utf-8', (err, data) => {
      if (err) {
        // Fallback: serve a simple page if dist/ doesn't exist
        res.writeHead(200, {
          'content-type': 'text/html; charset=utf-8',
          'x-frame-options': 'SAMEORIGIN',
        });
        res.end(`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instagram Viewer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; height: 100vh; display: flex; flex-direction: column; }
    .toolbar { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: #111; color: white; }
    .toolbar-left { display: flex; align-items: center; gap: 10px; }
    .toolbar-left svg { width: 20px; height: 20px; }
    .toolbar-left span { font-size: 14px; font-weight: 500; }
    .toolbar-right { display: flex; gap: 8px; }
    .toolbar-right a, .toolbar-right button { padding: 6px 12px; font-size: 12px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; }
    .toolbar-right a:hover, .toolbar-right button:hover { background: #444; }
    .url-bar { display: flex; align-items: center; padding: 8px 16px; background: #f5f5f5; border-bottom: 1px solid #ddd; }
    .url-bar .url { flex: 1; padding: 6px 12px; background: white; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; color: #666; }
    iframe { flex: 1; width: 100%; border: none; }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="toolbar-left">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
      <span>Instagram Viewer</span>
    </div>
    <div class="toolbar-right">
      <a href="https://www.instagram.com/?hl=ja" target="_blank" rel="noopener noreferrer">新規タブで開く</a>
    </div>
  </div>
  <div class="url-bar">
    <div class="url">/ig/?hl=ja</div>
  </div>
  <iframe src="/ig/?hl=ja" allow="camera; microphone; geolocation; autoplay; encrypted-media" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"></iframe>
</body>
</html>
        `);
        return;
      }
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8',
        'x-frame-options': 'SAMEORIGIN',
      });
      res.end(data);
    });
    return;
  }

  // Serve static assets from dist/
  const staticPath = path.join(__dirname, 'dist', pathname);
  serveStatic(res, staticPath);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Instagram proxy available at http://localhost:${PORT}/ig/`);
});
