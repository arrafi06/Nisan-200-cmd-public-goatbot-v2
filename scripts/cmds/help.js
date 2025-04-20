const axios = require("axios");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    aliases: ["use"],
    version: "1.21",
    author: "Ayanokōji",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Explore command usage 📖",
    },
    longDescription: {
      en: "View detailed command usage, list commands by page, or filter by category ✨",
    },
    category: "info",
    guide: {
      en: "🔹 {pn} [pageNumber]\n🔹 {pn} [commandName]\n🔹 {pn} -c <categoryName>",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    try {
      const { threadID } = event;
      const threadData = await threadsData.get(threadID).catch(() => ({}));
      const prefix = getPrefix(threadID) || "!"; // Fallback prefix
      const commandsPerPage = 25;

      const gifUrls = [
        "http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1744675711061.gif",
        "http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1744725103593.gif",
        "http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1744725081635.gif",
        "http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1744725040846.gif",
        "http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1744725005717.gif",
        "http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1744724982283.gif",
        "http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1744724955006.gif",
        "http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1744724925123.gif",
        "http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1744724902078.gif",
        "http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1744724841818.gif",
        "http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1744723932128.gif",
        "http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1744730505559.gif",
      ];

      const selectedGifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];

      const ownerInfo = `╭─『 AYANOKŌJI'S TOOL 』\n` +
                        `╰‣ 👑 Admin: Ayanokōji\n` +
                        `╰‣ 🤖 Bot Name: Ayanokōji's Tool\n` +
                        `╰───────────────◊\n`;

      const footerInfo = (totalCommands, page, totalPages) => 
                        `╭─『 AYANOKŌJI'S TOOL 』\n` +
                        `╰‣ 📋 Total Commands: ${totalCommands}\n` +
                        `╰‣ 📄 Page: ${page}/${totalPages}\n` +
                        `╰‣ 👑 Admin: Ayanokōji\n` +
                        `╰‣ 🌐 IAM FEELINGLESS \n` +
                        `╰───────────────◊\n`;

      const getAttachment = async () => {
        try {
          const response = await axios.get(selectedGifUrl, { responseType: "stream" });
          return response.data;
        } catch (error) {
          console.warn("Failed to fetch GIF:", error.message);
          return null;
        }
      };

      if (args.length === 0 || !isNaN(args[0])) {
        const page = parseInt(args[0]) || 1;
        const categories = {};
        let allCommands = [];

        for (const [name, value] of commands) {
          if (value.config.role > role) continue;
          allCommands.push({ name, config: value.config });
          const category = value.config.category?.toLowerCase() || "uncategorized";
          categories[category] = categories[category] || { commands: [] };
          categories[category].commands.push(name);
        }

        allCommands = allCommands.sort((a, b) => a.name.localeCompare(b.name));

        const totalCommands = allCommands.length;
        const totalPages = Math.ceil(totalCommands / commandsPerPage);
        const startIndex = (page - 1) * commandsPerPage;
        const endIndex = startIndex + commandsPerPage;

        if (page < 1 || page > totalPages) {
          return message.reply(`🚫 Invalid page! Choose between 1 and ${totalPages}.`);
        }

        let msg = `✨ [ Guide For Beginners - Page ${page} ] ✨\n\n`;
        msg += ownerInfo;

        Object.keys(categories).sort().forEach((category) => {
          const categoryCommands = categories[category].commands.sort();
          const displayCommands = categoryCommands.filter((cmd) => {
            const cmdIndex = allCommands.findIndex(c => c.name === cmd);
            return cmdIndex >= startIndex && cmdIndex < endIndex;
          });

          if (displayCommands.length > 0) {
            msg += `\n📂 ${category.toUpperCase()}:\n`;
            displayCommands.forEach((cmd) => {
              msg += `- ${prefix}${cmd}\n`;
            });
          }
        });

        msg += `\n${footerInfo(totalCommands, page, totalPages)}`;

        const attachment = await getAttachment();
        return message.reply({ body: msg, attachment });
      }

      // Additional logic for specific command or category can be added here

    } catch (error) {
      console.error("Error in help command:", error);
      return message.reply("❌ An error occurred while processing the help command.");
    }
  }
};
