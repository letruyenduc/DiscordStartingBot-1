const { ActivityType } = require("discord.js");

module.exports = (client) => {

  console.log(`${client.user.tag} est en ligne.`);

  let status = [
    {
      name: "Le meilleur bot, c'est moi !",
      type: ActivityType.Streaming,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  ];

  setInterval(() => {

    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);

  }, 10000);
};
