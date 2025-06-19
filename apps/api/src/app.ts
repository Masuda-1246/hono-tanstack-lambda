import { Hono } from 'hono'

export const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello!')
})

app.get('/hello', (c) => {
  return c.text('Hello Hono!')
})