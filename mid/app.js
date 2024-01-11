import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { WebSocketMiddleware } from "https://deno.land/x/oak_websocket/mod.ts";
import { open, DB } from "https://deno.land/x/sqlite/mod.ts";
import { layout } from "./render.js";
import { handleGame } from "./game.js";

const app = new Application();
const router = new Router();
const wsm = new WebSocketMiddleware();

let db: DB;

app.addEventListener("start", async () => {
  db = await open("blog.db");
  await db.query(`CREATE TABLE IF NOT EXISTS game_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    result TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
});

router
  .get('/', (ctx) => send(ctx, '/public/index.html'))
  .get('/public/(.*)', serveStatic)
  .get('/ws', wsm.ws)
  .post('/game', handleGame);

app.use(router.routes());
app.use(router.allowedMethods());
app.use(wsm);

async function serveStatic(ctx: any) {
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}/`,
    index: "index.html",
  });
}

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
