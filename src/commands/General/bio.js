const { EmbedBuilder } = require("discord.js");
const User = require('../../schema/User');

module.exports = {
  name: 'bio',
  category: 'General',
  aliases: ['setbio', 'set-bio', 'bioset'],
  cooldown: 5,
  description: 'Set your profile bio',
  args: true,
  usage: '<bio text>',
  userPrams: [],
  botPrams: ['EmbedLinks'],
  owner: false,
  execute: async (message, args, client, prefix) => {
    const bioText = args.join(' ');
    
    if (bioText.length > 1000) {
        return message.reply('<:x_cross:1475040602654642176> Bio must be less than 1000 characters!');
    }
    
    const msg = await message.channel.send({
      content: "Setting Bio...",
    });
    
    try {
        const user = await User.findById(message.author.id);
        
        if (!user) {
          return msg.edit('Error setting bio. Please try again later.');
        }
        
        // Update the bio
        await user.updateOne({ bio: bioText });
        return msg.edit(`<:x_tick:1475040607746392165> Successfully set your bio to **\`${bioText}\`**`);
    } catch (error) {
        console.error('Error in bio command:', error);
        return msg.edit('Error setting bio. Please try again later.');
    }
  }
};