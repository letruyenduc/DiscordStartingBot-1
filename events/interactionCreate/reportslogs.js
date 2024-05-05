const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, TextInputStyle, ModalBuilder, TextInputBuilder } = require("discord.js");
const reportcolor = "#D3271D";

module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return;
    if(!interaction.customId.startsWith("reportslogs_")) return;

    const parts = interaction.customId.split("_")
    const btn = parts[1]
    const id = parts[2]
    const wovid = parts[3]
    const index = parts[4]

    if(id !== interaction.user.id) {
        return interaction.reply({
            content: interaction.locale === "fr" ? "Ce n'est pas votre boutton." : "This isn't your button.",
            ephemeral: true,
        })
    }

    if(btn === "search") {

        const modal = new ModalBuilder()
        .setCustomId(`reportslogs_${id}`)
        .setTitle('Page');

        const pageInput = new TextInputBuilder()
        .setCustomId('page')
        .setLabel(interaction.locale === "fr" ? "Entrez le numéro de la page" : "Enter the page number")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

        const firstActionRow = new ActionRowBuilder()
        .addComponents(pageInput);

        modal.addComponents(firstActionRow);

        return await interaction.showModal(modal);

    }

    const discordname = await client.users.fetch(id);
    const userreps = await client.GetUserReport(id)

    let i;
    switch (btn) {

        case "first": 
            i = 0;
        break;

        case "previous": 
            i = parseInt(index) - 1;
        break;

        case "next": 
            i = parseInt(index) + 1;
        break;

        case "last": 
            i = userreps.length - 1;
        break;

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
    .setCustomId(`reportslogs_first_${interaction.user.id}_${id}_${i}`)
    .setDisabled(i === 0 ? true : false);

    const previous = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel("◀️")
    .setCustomId(`reportslogs_previous_${interaction.user.id}_${id}_${i}`)
    .setDisabled(i === 0 ? true : false);

    const search = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel("🔎")
    .setCustomId(`reportslogs_search_${interaction.user.id}_${id}_${i}`);

    const next = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel("▶️")
    .setCustomId(`reportslogs_next_${interaction.user.id}_${id}_${i}`)
    .setDisabled(i + 1 === userreps.length ? true : false);

    const last = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel("⏭️")
    .setCustomId(`reportslogs_last_${interaction.user.id}_${id}_${i}`)
    .setDisabled(i + 1 === userreps.length ? true : false);

    const row = new ActionRowBuilder()
    .addComponents(first, previous, search, next, last);

    await interaction.update({
        embeds: [embed],
        components: userreps.length === 0 ? [] : [row]
    });

};