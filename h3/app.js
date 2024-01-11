import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';

const contacts = [
  { id: 0, name: '郁', phone: '09-88888888' },
  { id: 1, name: '祁', phone: '09-77777777' }
];

const router = new Router();

router
  .get('/', listContacts)
  .get('/contact/:id', showContact)
  .post('/contact', addContact);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function listContacts(ctx) {
  ctx.response.body = await render.listContacts(contacts);
}

async function showContact(ctx) {
  const id = ctx.params.id;
  const contact = contacts.find(c => c.id == id);
  if (!contact) ctx.throw(404, 'Invalid contact id');
  ctx.response.body = await render.showContact(contact);
}

async function addContact(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const contact = {};
    for (const [key, value] of pairs) {
      contact[key] = value;
    }
    contact.id = contacts.length;
    contacts.push(contact);
    ctx.response.redirect('/');
  }
}

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
