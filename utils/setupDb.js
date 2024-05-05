const mysql = require("mysql2/promise");

async function setupDatabase(client) {
  const db = await mysql.createConnection({
    host: "Picsou06.fun",
    user: "Palchimiste",
    password: "AU69f@2jB8]Jkvgf",
    database: "Palchimiste",
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
      return rows[0].ID_WoW;
    } else {
      return false;
    }
  };

  client.IsDiscordLinked = IsDiscordLinked;

  const IsWoWLinked = async function (wowID) {
    const [rows] = await db.execute(
      "SELECT ID_Discord FROM `Link_WoW` WHERE ID_WoW=?;",
      [wowID]
    );
    if (rows.length > 0) {
      return rows[0].ID_Discord;
    } else {
      return false;
    }
  };

  client.IsWoWLinked = IsWoWLinked;

  const LinkWoWUser = async function (discordID, WoWID) {
    await db.execute(
      "INSERT INTO Link_WoW (ID_Discord, ID_WoW) VALUES (?, ?)",
      [discordID, WoWID]
    );
  };

  client.LinkWoWUser = LinkWoWUser;

  const addreport = async function (
    user,
    username,
    cible,
    ciblename,
    raison,
    date
  ) {
    await db.execute(
      "INSERT INTO Report (authorID, authorName, cibleID, cibleName, raison, date) VALUES (?, ?, ?, ?, ?, ?)",
      [user, username, cible, ciblename, raison, date]
    );
  };

  client.addreport = addreport;

  const LastDateReport = async function (user) {
    const [rows] = await db.execute(
      "SELECT MAX(date) AS youngest_date FROM Report WHERE authorID = ?",
      [user]
    );
    if (rows.length > 0 && rows[0].youngest_date !== null) {
      return rows[0].youngest_date;
    } else {
      return false;
    }
  };

  client.LastDateReport = LastDateReport;

  const getSpecificUserReps = async function (DiscordID, cibleID) {
    const [rows] = await db.execute(
      "SELECT cibleName, date, raison FROM Report WHERE authorID = ? AND cibleID = ? ORDER BY date DESC",
      [DiscordID, cibleID]
    );
    if (rows.length > 0) {
      return rows;
    } else {
      return false;
    }
  };

  client.getSpecificUserReps = getSpecificUserReps;

  const getUserReps = async function (cibleID) {
    const [rows] = await db.execute(
      "SELECT authorID, cibleName, date, raison FROM Report WHERE cibleID = ? ORDER BY date DESC",
      [cibleID]
    );
    if (rows.length > 0) {
      return rows;
    } else {
      return false;
    }
  };

  client.getUserReps = getUserReps;

  const GetUserReport = async function (authorID) {
    const [rows] = await db.execute(
      "SELECT * FROM Report WHERE authorID = ? ORDER BY date DESC",
      [authorID]
    );
    if (rows.length > 0) {
      return rows;
    } else {
      return false;
    }
  };

  client.GetUserReport = GetUserReport;

  const GetReportLeaderboard = async function () {
    const [rows] = await db.execute(
      "SELECT cibleID, COUNT(*) AS occurrences FROM Report GROUP BY cibleID ORDER BY occurrences DESC LIMIT 10"
    );
    if (rows.length > 0) {
      return rows;
    } else {
      return false;
    }
  };

  client.GetReportLeaderboard = GetReportLeaderboard;

  const addReputationPoint = async function (ID_Wov, ID_Discord) {
    const [rows] = await db.execute(
      "SELECT * FROM Reputation WHERE ID_Wov = ?",
      [ID_Wov]
    );
    if (rows.length === 0) {
      await db.execute(
        "INSERT INTO Reputation (ID_Wov, ReputationPoints, Dernier) VALUES (?, 1, ?)",
        [ID_Wov, ID_Discord]
      );
    } else {
      await db.execute(
        "UPDATE Reputation SET ReputationPoints = ReputationPoints + 1, Dernier = ? WHERE ID_Wov = ?",
        [ID_Discord, ID_Wov]
      );
    }
  };

  client.addReputationPoint = addReputationPoint;

  const getLastUserReputation = async function (ID_Discord) {
    const [rows] = await db.execute(
      "SELECT * FROM LastUserReputation WHERE ID_Discord = ?",
      [ID_Discord]
    );
    if (rows.length > 0) {
      return rows;
    } else {
      return false;
    }
  };

  client.getLastUserReputation = getLastUserReputation;

  const updateLastUserReputation = async function (
    ID_Discord,
    ID_Wov,
    Date,
    Username
  ) {
    const [rows] = await db.execute(
      "SELECT * FROM LastUserReputation WHERE ID_Discord = ?",
      [ID_Discord]
    );
    if (rows.length === 0) {
      await db.execute(
        "INSERT INTO LastUserReputation (ID_Discord, ID_Wov, Date, Username, TotalGivenCount) VALUES (?, ?, ?, ?, TotalGivenCount + 1)",
        [ID_Discord, ID_Wov, Date, Username]
      );
    } else {
      await db.execute(
        "UPDATE LastUserReputation SET ID_Wov = ?, Date = ?, Username = ?, TotalGivenCount = TotalGivenCount + 1 WHERE ID_Discord = ?",
        [ID_Wov, Date, Username, ID_Discord]
      );
    }
  };

  client.updateLastUserReputation = updateLastUserReputation;

  const getReputationCount = async function (ID_Wov) {
    const [rows] = await db.execute(
      "SELECT ReputationPoints FROM Reputation WHERE ID_Wov = ?",
      [ID_Wov]
    );
    if (rows.length === 0) {
      return 0;
    } else {
      return rows[0].ReputationPoints;
    }
  };

  client.getReputationCount = getReputationCount;

  const getPlayerLastReputationId = async function (ID_Wov) {
    const [rows] = await db.execute(
      "SELECT Dernier FROM Reputation WHERE ID_Wov = ?",
      [ID_Wov]
    );
    if (rows.length === 0) {
      return "";
    } else {
      return rows[0].Dernier;
    }
  };

  client.getPlayerLastReputationId = getPlayerLastReputationId;

  const getReputationLeaderboard = async function (locale) {
    const [rows] = await db.execute(
      "SELECT * FROM Reputation ORDER BY ReputationPoints DESC LIMIT 10"
    );

    return rows;
  };

  client.getReputationLeaderboard = getReputationLeaderboard;
}

module.exports = setupDatabase;
