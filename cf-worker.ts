export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // --------------------------
    // 1. UI 页面（根路径）
    // --------------------------
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(indexHtml, {
        headers: { 'content-type': 'text/html; charset=utf-8' }
      })
    }

    // --------------------------
    // 2. API 保持原样
    // 你的 API 位于 /v2/60s
    // 这里直接代理到自己（同域）
    // --------------------------
    if (url.pathname.startsWith('/v2/')) {
      // 直接把请求传给自己（原 worker 的 API 路径）
      return await fetch(request)
    }

    return new Response('Not Found', { status: 404 })
  }
}

// -----------------------------
// 内嵌 HTML UI 页面
// -----------------------------
const indexHtml = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>60s · 每日速读</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto; margin:0;background:#f5f7fa;color:#0b1220;}
  header{background:linear-gradient(90deg,#4e54c8,#8f94fb);color:white;padding:20px;}
  .container{max-width:900px;margin:auto;}
  .title{font-size:22px;margin:0;}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-top:20px;}
  .card{background:white;padding:14px;border-radius:10px;border:1px solid rgba(0,0,0,.06);box-shadow:0 4px 14px rgba(0,0,0,.05);}
  .card h3{margin:0 0 8px;font-size:16px;}
  .card p{font-size:14px;margin:0;color:#333;line-height:1.4;}
  .btn{padding:8px 12px;border-radius:6px;border:1px solid #ddd;background:white;cursor:pointer;}
</style>
</head>
<body>
<header>
  <div class="container">
    <h1 class="title">⏰ 60s · 每日速读</h1>
    <button class="btn" onclick="loadData()">刷新内容</button>
    <button class="btn" onclick="open('/v2/60s','_blank')">查看 JSON</button>
  </div>
</header>

<div class="container">
  <div id="content">加载中...</div>
</div>

<script>
async function loadData(){
  document.getElementById('content').innerHTML = "加载中..."
  const resp = await fetch('/v2/60s')
  const json = await resp.json()
  render(json)
}

function render(data){
  if(!data.items){
    document.getElementById('content').innerHTML="无数据"
    return
  }

  let html = '<div class="grid">'
  data.items.forEach(it=>{
    html += \`<div class="card"><h3>\${it.title}</h3><p>\${it.description||''}</p></div>\`
  })
  html += '</div>'

  document.getElementById('content').innerHTML = html
}

loadData()
</script>
</body>
</html>`
