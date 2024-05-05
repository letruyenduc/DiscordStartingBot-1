require("dotenv").config();
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.data.name === interaction.commandName
    );

    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!process.env.DEVLIST.includes(interaction.member.id)) {
        interaction.reply({
          content: "Seulement les développeurs peuvent éxecuter cette commande.",
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.testOnly) {
      if (!process.env.BETASERVEUR.includes(interaction.guild?.id)) {
        interaction.reply({
          content: "Cette commande ne peut pas être exécutée dans ce serveur puisqu'elle est en phase de test.",
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: "Vous n'avez pas assez de permissions.",
            ephemeral: true,
          });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;
        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "Je n'ai pas assez de permissions.",
            ephemeral: true,
          });
          return;
        }
      }
    }

    await commandObject.callback(client, interaction);
  } catch (error) {
    interaction.reply({
      content: "Erreur",
      ephemeral: true,
    })
    console.log(`Il y a eu une erreur lors de l'exécution de la commande`)
    console.log(error);
  }
};
