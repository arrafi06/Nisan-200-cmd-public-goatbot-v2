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
      
      // Corrected GIF URLs array (removed extra semicolon and renamed to gifUrls)
      const gifUrls = [
        "http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1744675711061.gif",
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
      
      // Select a random GIF URL from the gifUrls array
      const selectedGifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];
      
      // Owner info
      const ownerInfo = `╭─『 AYANOKŌJI'S TOOL 』\n` +
                        `╰‣ 👑 Admin: Ayanokōji\n` +
                        `╰‣ 🤖 Bot Name: Ayanokōji's Tool\n` +
                        `╰───────────────◊\n`;

      // Footer info with Facebook and Messenger links
      const footerInfo = (totalCommands, page, totalPages) => 
                        `╭─『 AYANOKŌJI'S TOOL 』\n` +
                        `╰‣ 📋 Total Commands: ${totalCommands}\n` +
                        `╰‣ 📄 Page: ${page}/${totalPages}\n` +
                        `╰‣ 👑 Admin: Ayanokōji\n` +
                        `╰‣ 🌐 IAM FEELINGLESS \n` +
                        `╰───────────────◊\n`;

      // Function to fetch GIF as a stream
      const getAttachment = async () => {
        try {
          const response = await axios.get(selectedGifUrl, { responseType: "stream" });
          return response.data;
        } catch (error) {
          console.warn("Failed to fetch GIF:", error.message);
          return null; // Return null if GIF fetch fails
        }
      };

      if (args.length === 0 || !isNaN(args[0])) {
        // Paginated command list
        const page = parseInt(args[0]) || 1;
        const categories = {};
        let allCommands = [];

        // Filter and group commands by category
        for (const [name, value] of commands) {
          if (value.config.role > role) continue; // Skip commands user can't access
          allCommands.push({ name, config: value.config });
          const category = value.config.category?.toLowerCase() || "uncategorized";
          categories[category] = categories[category] || { commands: [] };
          categories[category].commands.push(name);
        }

        // Sort commands
        allCommands = allCommands.sort((a, b) => a.name.localeCompare(b.name));

        // Pagination logic
        const totalCommands = allCommands.length;
        const totalPages = Math.ceil(totalCommands / commandsPerPage);
        const startIndex = (page - 1) * commandsPerPage;
        const endIndex = startIndex + commandsPerPage;

        if (page < 1 || page > totalPages) {
          return message.reply(`🚫 Invalid page! Choose between 1 and ${totalPages}.`);
        }

        let msg = `✨ [ Guide For Beginners - Page ${page} ] ✨\n\n`;
        msg += ownerInfo;

        // Display commands by category for the current page
        Object.keys(categories).sort().forEach((category) => {
          const categoryCommands = categories[category].commands.sort();
          const displayCommands = categoryCommands.filter((cmd) => {
            const cmdInde
