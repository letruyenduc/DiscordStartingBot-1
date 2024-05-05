const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const reportcolor = "#D3271D";

module.exports = async (client, interaction) => {

    if(!interaction.isModalSubmit()) return;
    if(!interaction.customId.startsWith("reportslogs_")) return;

    let page = interaction.fields.getTextInputValue("page")
    const parts = interaction.customId.split("_")
    const targetid = parts[1]


    try {
        page = parseInt(page);
    }
    catch {

        return interaction.reply({
            content: interaction.locale === "fr" ? "Veuillez entrez un nombre." : "Please enter a number.",
            ephemeral: true
        });

    }

    const i = page - 1;

    const discordname = await client.users.fetch(targetid);
    const userreps = await client.GetUserReport(targetid)

    if(i < 0 || i >= userreps.length) {

        return await interaction.reply({
            content: interaction.locale === "fr" ? "Veuillez entrez un nombre valide." : "Please enter a valide number.",
            ephemeral: true
        });

    }

    let embed;
    if(interaction.locale === "fr") {
        
        embed = new EmbedBuilder()
        .setTitle(`Historique de reports de ${discordname}`)
        .setDescription(`Report ${i + 1}/${userreps.length}\n>>> **Raison :** \n \`\`\`ANSI\n[0;31m${userreps[i].raison}[0m\n\`\`\` \n **Pseudo au moment des faits :** \`${userreps[i].cibleName}\` \n **Date :** <t:${userreps[i].date}:F> \n **ID du joueur signalé :** \`${userreps[i].cibleID}\``)
        .setColor(reportcolor);

    }
    else {

        embed = new EmbedBuilder()
        .setTitle(`Reports logs of ${discordname}`)
        .setDescription(`Report ${i + 1}/${userreps.length}\n>>> **Reason:** \n \`\`\`ANSI\n[0;31m${userreps[i].raison}[0m\n\`\`\` \n **Username at the time of incident:** \`${userreps[i].cibleName}\` \n **Date:** <t:${userreps[i].date}:F> \n **Reported player's ID:** \`${userreps[i].cibleID}\``)
        .setColor(reportcolor);

    }

    const first = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel("⏮️")
    .setCustomId(`reportslogs_first_${interaction.user.id}_${targetid}_${i}`)
    .setDisabled(i === 0 ? true : false);

    const previous = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel("◀️")
    .setCustomId(`reportslogs_previous_${interaction.user.id}_${targetid}_${i}`)
    .setDisabled(i === 0 ? true : false);

    const search = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel("🔎")
    .setCustomId(`reportslogs_search_${interaction.user.id}_${targetid}_${i}`);

    const next = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel("▶️")
    .setCustomId(`reportslogs_next_${interaction.user.id}_${targetid}_${i}`)
    .setDisabled(i + 1 === userreps.length ? true : false);

    const last = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel("⏭️")
    .setCustomId(`reportslogs_last_${interaction.user.id}_${targetid}_${i}`)
    .setDisabled(i + 1 === userreps.length ? true : false);

    const row = new ActionRowBuilder()
    .addComponents(first, previous, search, next, last);

    await interaction.update({
        embeds: [embed],
        components: userreps.length === 0 ? [] : [row]
    });

};