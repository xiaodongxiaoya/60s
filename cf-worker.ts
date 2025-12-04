// 单文件 Worker：UI + 一个安全的 /v2/60s 返回示例 JSON（不会递归）
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    // 根页面 -> 返回 UI HTML
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(indexHtml, {
        headers: { 'content-type': 'text/html; charset=utf-8' }
      });
    }

    // 简单 API：/v2/60s -> 返回示例 JSON（可替换为真实实现或上游代理）
    if (url.pathname === '/v2/60s') {
      const sample = {
        items: [
          { title: '示例 · 今日要闻 1', description: '这是示例描述，展示如何在界面显示。' },
          { title: '示例 · 今日要闻 2', description: '第二条示例内容，支持短文本。' },
          { title: '示例 · 快讯 3', description: '第三条示例，演示卡片布局与换行。' },
          { title: '示例 · 深度 4', description: '可以放更长的文本，前端会自动换行显示。' },
          { title: '示例 · 提示 5', description: '右上角可以查看原始 JSON 或刷新数据。' }
        ],
        updated: new Date().toISOString()
      };
      return new Response(JSON.stringify(sample), {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'access-control-allow-origin': '*'
        }
      });
    }

    // 其它路径
    return new Response('Not Found', { status: 404 });
  }
};

const indexHtml = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>60s · 每日速读</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto; margin:0;background:#f5f7fa;color:#0b1220;}
  header{background:linear-gradient(90deg,#6b6ee6,#9aa0ff);color:white;padding:18px;}
  .container{max-width:980px;margin:0 auto;padding:12px;}
  .title{font-size:18px;margin:0 0 6px;}
  .controls{margin-top:8px;display:flex;gap:8px;align-items:center;}
  .btn{padding:6px 10px;border-radius:6px;border:none;background:white;cursor:pointer;}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;margin-top:18px;}
  .card{background:white;padding:12px;border-radius:10px;border:1px solid rgba(0,0,0,.06);box-shadow:0 4px 12px rgba(0,0,0,.04);}
  .card h3{margin:0 0 8px;font-size:15px;}
  .card p{margin:0;color:#333;font-size:13px;line-height:1.4;}
  #loader{color:#666;margin-top:12px;}
</style>
</head>
<body>
<header>
  <div class="container" style="display:flex;justify-content:space-between;align-items:center">
    <div>
      <div class="title">⏰ 60s · 每日速读</div>
      <div style="font-size:12px;opacity:.9">示例界面 — 请求 /v2/60s 获取数据</div>
    </div>
    <div class="controls">
      <button class="btn" onclick="loadData()">刷新内容</button>
      <button class="btn" onclick="window.open('/v2/60s','_blank')">查看 JSON</button>
    </div>
  </div>
</header>

<main class="container">
  <div id="loader">加载中...</div>
  <div id="content"></div>
</main>

<script>
async function loadData(){
  document.getElementById('loader').textContent = '加载中...';
  try {
    const resp = await fetch('/v2/60s');
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const json = await resp.json();
    render(json);
  } catch (err) {
    document.getElementById('content').innerHTML = '<div style="color:#b00">请求失败：' + err.message + '</div>';
    console.error(err);
  } finally {
    document.getElementById('loader').textContent = '';
  }
}

function render(data){
  const arr = Array.isArray(data) ? data : (data.items || []);
  if (!arr || arr.length === 0) {
    document.getElementById('content').innerHTML = '<div>暂无数据</div>';
    return;
  }
  let html = '<div class="grid">';
  for (const it of arr) {
    html += \`<div class="card"><h3>\${escapeHtml(it.title)}</h3><p>\${escapeHtml(it.description||'')}</p></div>\`;
  }
  html += '</div>';
  document.getElementById('content').innerHTML = html;
}
function escapeHtml(s){ return String(s||'').replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])) }

window.addEventListener('load', loadData);
</script>
</body>
</html>`;
