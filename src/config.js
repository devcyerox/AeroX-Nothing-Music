
module.exports = {
  token: process.env.DISCORD_TOKEN || 'MTQ4NjcxMDA1NDcyMjk5NDE5Ng.G8u2Qw.CSCgLScjffwsFCtthlO10e8vjwckazFmTgTrE0', // your discord bot token
  clientId: process.env.CLIENT_ID || "1486710054722994196",
  prefix: process.env.PREFIX || '!!', // bot prefix
  ownerID: (process.env.OWNER_IDS || '').split(','), //your discord id
  SpotifyID: process.env.SPOTIFY_ID || 'e6f84fbec2b44a77bf35a20c5ffa54b8', // spotify client id
  SpotifySecret: process.env.SPOTIFY_SECRET || '498f461b962443cfaf9539c610e2ea81', // spotify client secret
  ankushcolor: '#ff0000', // embed colour
  bugReportChannel: "", // ID of the channel where bug reports will be sent
  embedColor: '#ff0000', // Using your existing ankushcolor
  supportServer: "https://discord.com/invite/w77ymEU82a", // Your support server link
  supportGuildId: "1221909487472869619", // Your support guild ID

  nodes: [
    {
      url: `lavalinkv4.serenetia.com:80`,
      name: `NOTHING`,
      auth: `https://dsc.gg/ajidevserver`,
      secure: false
    }
  ],
};

