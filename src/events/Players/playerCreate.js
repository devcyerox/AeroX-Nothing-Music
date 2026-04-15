const { EmbedBuilder, WebhookClient } = require("discord.js");
const web1 = process.env.PLAYER_LOG_WEBHOOK ? new WebhookClient({ url: process.env.PLAYER_LOG_WEBHOOK }) : null;

module.exports = {
    name: "playerCreate",

    /**
     * @param {Client} client 
     * @param {KazagumoPlayer} player 
     */
    run: async (client, player) => {
        let guild = client.guilds.cache.get(player.guildId);
        if (!guild) return;
        
        let name = guild.name;

        const embed2 = new EmbedBuilder()
            .setColor(client.ankushcolor)
            .setAuthor({ name: `Player Started`, iconURL: client.user.displayAvatarURL() })
            .setDescription(`**Server Name:** ${name}\n**Server Id:** ${player.guildId}`)
            .setTimestamp();
            
        if (web1) web1.send({ embeds: [embed2] }).catch(() => null);

        client.logger.log(`Player Create in ${name} [ ${player.guildId} ]`, "log");
    }
};