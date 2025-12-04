import { app } from './src/app.ts'

// 添加根路由以实现美化仪表盘
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>60s API Dashboard</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; color: #333; }
        h1 { color: #007bff; text-align: center; }
        .button-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin: 20px 0; }
        button { background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s; }
        button:hover { background-color: #0056b3; }
        #result { margin-top: 20px; padding: 15px; background-color: white; border: 1px solid #ddd; border-radius: 5px; max-width: 800px; margin: 0 auto; }
        pre { white-space: pre-wrap; word-wrap: break-word; font-size: 14px; }
      </style>
    </head>
    <body>
      <h1>60s API Dashboard</h1>
      <p style="text-align: center;">选择一个API端点以格式化方式查看结果。</p>
      
      <div class="button-container">
        <button onclick="fetchAPI('/v2/60s')">每日60秒看世界</button>
        <button onclick="fetchAPI('/v2/hot/xhs')">小红书热搜</button>
        <button onclick="fetchAPI('/v2/hot/bilibili')">B站热搜</button>
        <button onclick="fetchAPI('/v2/hot/weibo')">微博热搜</button>
        <button onclick="fetchAPI('/v2/hot/douyin')">抖音热搜</button>
        <button onclick="fetchAPI('/v2/hot/zhihu')">知乎热搜</button>
        <button onclick="fetchAPI('/v2/gold')">金价查询</button>
        <button onclick="fetchAPI('/v2/oil')">油价查询</button>
        <!-- 根据项目文档 https://docs.60s-api.viki.moe 扩展更多按钮 -->
      </div>
      
      <div id="result"></div>
      
      <script>
        async function fetchAPI(endpoint) {
          try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('API请求失败');
            const data = await response.json();
            document.getElementById('result').innerHTML = '<h2>' + endpoint + ' 的结果</h2><pre>' + JSON.stringify(data, null, 2) + '</pre>';
          } catch (error) {
            document.getElementById('result').innerHTML = '<p style="color: red;">错误: ' + error.message + '</p>';
          }
        }
      </script>
    </body>
    </html>
  `);
});

export default { fetch: app.fetch }
