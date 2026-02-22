const { EmbedBuilder, ActionRowBuilder, AttachmentBuilder, Client, ButtonBuilder, ButtonStyle, REST } = require('discord.js');
const { KazagumoPlayer, KazagumoTrack } = require("kazagumo");

module.exports = {
  name: "playerStart",
  /**
   * @param {Client} client 
   * @param {KazagumoPlayer} player 
   * @param {KazagumoTrack} track 
   */
  run: async (client, player, track) => {
    // Validate required parameters
    if (!client || !player || !track) {
      console.error('Missing required parameters:', { client: !!client, player: !!player, track: !!track });
      return;
    }

    let guild = client.guilds.cache.get(player.guildId);
    if (!guild) {
      console.error('Guild not found:', player.guildId);
      return;
    }

    let channel = guild.channels.cache.get(player.textId);
    if (!channel) {
      console.error('Channel not found:', player.textId);
      return;
    }

    // Safely check track URI
    if (track.uri && track.uri.includes("https://cdn.discordapp.com/attachments/")) {
      return;
    }

    // Safely set requester
    try {
      track.requester = player.previous
        ? player.queue.previous?.requester
        : player.queue.current?.requester;
    } catch (err) {
      console.error('Error setting track requester:', err);
    }

    const author1 = track.author || 'Unknown Artist';
    const voiceId = player.voiceId;
    const status = `${author1} - **${track.title || 'Unknown Title'}**`;

    try {
      const rest = new REST({ version: '10' }).setToken(client.config.token);
      await rest.put(`/channels/${voiceId}/voice-status`, {
        body: {
          status: status
        }
      });
    } catch (err) {
      console.error('Error updating voice status:', err);
    }

    // Button builders
    const prev = new ButtonBuilder()
      .setCustomId("prev")
      .setEmoji(`<:nutzprev:1475040543875530843>`)
      .setStyle(ButtonStyle.Secondary);

    const pause = new ButtonBuilder()
      .setCustomId("pause")
      .setEmoji(`<:nutzpause:1475040540402909287>`)
      .setStyle(ButtonStyle.Secondary);

    const skip = new ButtonBuilder()
      .setCustomId("skip")
      .setEmoji(`<:nutzskip:1475040552125993131>`)
      .setStyle(ButtonStyle.Secondary);

    const stop = new ButtonBuilder()
      .setCustomId("stop")
      .setEmoji(`<:nutzstop:1475040555082846313>`)
      .setStyle(ButtonStyle.Danger);

    const like = new ButtonBuilder()
      .setCustomId("like")
      .setLabel("Like")
      .setEmoji("<:nutzlike:1475040534568370279>")
      .setStyle(ButtonStyle.Success);

    const vup = new ButtonBuilder()
      .setCustomId("volup")
      .setEmoji(`<:nutzvolup:1475040560493498419>`)
      .setStyle(ButtonStyle.Secondary);

    const vdwn = new ButtonBuilder()
      .setCustomId("voldown")
      .setEmoji(`<:nutzvoldown:1475040558027112619>`)
      .setStyle(ButtonStyle.Secondary);

    const loop = new ButtonBuilder()
      .setCustomId("loop2")
      .setEmoji(`<:nutzloop:1475040538314018877>`)
      .setStyle(ButtonStyle.Secondary);

    const shuffle = new ButtonBuilder()
      .setCustomId("shuffle")
      .setEmoji(`<:nutzshuffle:1475040548573413448>`)
      .setStyle(ButtonStyle.Secondary);

    let row = new ActionRowBuilder().addComponents(prev, pause, skip, stop, vup);
    let row1 = new ActionRowBuilder().addComponents(vdwn, shuffle, like);

    try {
      // Get the embed from the EmbedHandler
      const embedResult = await client.canvas.build(track, player);
      
      if (!embedResult || !embedResult.embeds) {
        throw new Error('Invalid embed result from EmbedHandler');
      }

      const message = await channel.send({
        embeds: embedResult.embeds,
        components: [row, row1]
      });

      // Set the message and autoplay system data
      if (message) {
        await player.data.set("message", message);
        
        // FIXED: Set autoplay data as an object with title and author
        await player.data.set("autoplaySystem", {
          title: track.title || 'Unknown Title',
          author: track.author || 'Unknown Artist',
          requester: track.requester
        });
        
        // Also set the requester data for autoplay function
        await player.data.set("requester", track.requester);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Fallback to a simple message
      try {
        const fallbackMessage = await channel.send({
          content: `Now playing: ${track.title || 'Unknown Title'} by ${track.author || 'Unknown Artist'}`,
          components: [row, row1]
        });
        
        // Still set autoplay data even for fallback message
        if (fallbackMessage) {
          await player.data.set("message", fallbackMessage);
          await player.data.set("autoplaySystem", {
            title: track.title || 'Unknown Title',
            author: track.author || 'Unknown Artist',
            requester: track.requester
          });
          await player.data.set("requester", track.requester);
        }
      } catch (fallbackErr) {
        console.error('Error sending fallback message:', fallbackErr);
      }
    }
  }
};