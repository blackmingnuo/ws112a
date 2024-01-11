const gameForm = `
  <h1>剪刀石頭布遊戲</h1>
  <p>請在下面的聊天框中輸入剪刀、石頭或布：</p>
  <div id="gameResult"></div>
  <input id="gameInput" type="text">
  <button onclick="playGame()">出拳</button>
`;

export async function handleGame(ctx: any) {
  const socket = ctx.socket;

  socket.on("message", async (event: any) => {
    const user = await authenticateUser(event);
    if (!user) {
      console.log("User not authenticated");
      return;
    }

    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    const userChoice = event.trim().toLowerCase();

    let result;
    if (userChoice === computerChoice) {
      result = 'draw';
    } else if (
      (userChoice === 'rock' && computerChoice === 'scissors') ||
      (userChoice === 'paper' && computerChoice === 'rock') ||
      (userChoice === 'scissors' && computerChoice === 'paper')
    ) {
      result = 'win';
    } else {
      result = 'lose';
    }

    await db.query("INSERT INTO game_records (user_id, result) VALUES (?, ?)", user.id, result);

    socket.send(JSON.stringify({ action: "gameResult", result }));
  });

  ctx.response.body = layout('剪刀石頭布遊戲', gameForm);
}

async function authenticateUser(event: any) {
  // Add user authentication logic based on the WebSocket message.
  // Return the authenticated user or null if authentication fails.
  // For simplicity, you might want to use a token-based authentication mechanism.
  // You can use the 'db' object to query the database for user information.
  // Sample: `const user = await db.query("SELECT * FROM users WHERE token = ?", event.token);`
  // Ensure to handle errors and return the authenticated user or null.
  return null;
}
