const mysql = require("mysql2/promise");

async function setupDatabase(client) {
  const db = await mysql.createConnection({
    host: "Picsou06.fun",
    user: "USER",
    password: "PASSWORD",
    database: "USER",
  });

  db.on("ready", () => {
    console.log("Database is ready!");
  });

  const IsDiscordLinked = async function (discordID) {
    const [rows] = await db.execute(
      "SELECT ID_WoW FROM `Link_WoW` WHERE ID_Discord=?;",
      [discordID]
    );
    if (rows.length > 0) {
      return rows;
    } else {
      return false;
    }
  };

  client.IsDiscordLinked = IsDiscordLinked;

}