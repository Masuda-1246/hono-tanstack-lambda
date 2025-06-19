import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { join } from 'path'

const app = new Hono()

.get('/hoge', (c) => {
  return c.text('Hello!')
})

.get('/api/users', (c) => {
  return c.json([{ name: 'John Doe' }, { name: 'Jane Hoge' }])
})

// フロントの配信
const distPath = './public'
// 静的ファイル
app.get('/assets/*', serveStatic({ root: distPath }))
// SPA用index.htmlフォールバック
app.get('/*', serveStatic({ path: join(distPath, 'index.html') }))


type AppType = typeof app

export { app, type AppType }