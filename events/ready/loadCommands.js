const areCommandsDifferent = require("../../utils/areCommandsDifferent");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");
const { Routes } = require("discord.js");

module.exports = async (client) => {
  // await client.application.commands.set([])
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(
      client
    );

    for (const localCommand of localCommands) {
      const { name } = localCommand.data;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`🗑 Commande "${name}" supprimée`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand.data)) {
          await client.rest.patch(
            Routes.applicationCommand(
              client.user.id,
              existingCommand.id,
            ),
            {body: localCommand.data}
          )

          console.log(`🔁 Commande "${name}" mise à jour.`);
        }
      } else {
        if (localCommand.deleted) {
          console.log(
            `⏩ Commande "${name}" ignorée car elle est supprimée.`
          );
          continue;
        }

        await client.rest.post(
          Routes.applicationCommands(client.user.id),
          {body: localCommand.data}
        );

        console.log(`👍 Commande "${name}" enregistrée`);
      }
    }
  } catch (error) {
    console.log(`Erreur : ${error}`);
    console.log(error)
  }
};
