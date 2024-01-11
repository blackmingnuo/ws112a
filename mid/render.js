export function layout(title, content) {
  return `
    <html>
    <head>
      <title>${title}</title>
      <link rel="stylesheet" type="text/css" href="/public/style.css"/>
    </head>
    <body>
      <section id="content">
        ${content}
      </section>
      <script type="module" src="/public/main.js"></script>
      <script type="module" src="/public/game.js"></script>
    </body>
    </html>
    `;
}
