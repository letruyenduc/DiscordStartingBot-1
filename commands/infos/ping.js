const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

let data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Ping! 🏓")
  .setDescriptionLocalizations({
    fr: "Ping du bot",
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
  .setDMPermission(false)
  // .addSubcommand(command => command
  //   .setName("is")
  //   .setNameLocalizations({
  //       fr: "est",
  //   })
  //   .setDescription("Returns the in game name of a discord user")
  //   .setDescriptionLocalizations({
  //       fr: "Retourne le pseudo wolvesville d'un utilisateur discord",
  //   })
    .addStringOption(option => option
      .setRequired(false)
      .setName("username")
      .setNameLocalizations({
          fr: "pseudo",
      })
      .setDescription("Random Pseudo")
      .setDescriptionLocalizations({
          fr: "Votre nom sur le jeu"
      })
  );

data.integration_types = [0, 1];

module.exports = {
  data: data,

  callback: async (client, interaction) => {
    interaction.reply(`🏓Ping is ${(Date.now() - interaction.createdTimestamp)*-1}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
  },
};
