const { MessageActionRow, MessageButton, EmbedBuilder, WebhookClient } = require("discord.js");
const web1 = process.env.PLAYER_LOG_WEBHOOK ? new WebhookClient({ url: process.env.PLAYER_LOG_WEBHOOK }) : null;
const { KazagumoPlayer } = require("kazagumo")

module.exports = {
    name: "playerCreate",

    /**
         * 
         * @param {Client} client 
         * @param {KazagumoPlayer} player 
         */

    run: async (client, player) => {
        
        let name = client.guilds.cache.get(player.guildId).name;

        const embed2 = new EmbedBuilder()
    .setColor(client.ankushcolor)
    .setAuthor({name: `Player Started` , iconURL: client.user.displayAvatarURL()})
    .setDescription(`**Server Name:** ${name}\n**Server Id:** ${player.guildId}`)
     .setTimestamp()
    if (web1) web1.send({embeds: [embed2]})

        client.logger.log(`Player Create in ${name} [ ${player.guildId} ]`, "log");


    }
};
