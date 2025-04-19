const { GoatWrapper } = require("fca-liane-utils");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ N I S A N ]"; // changing this won't change the goatbot V2 of list cmd it is just a decoy

// Function to fetch media from URL
async function getAttachment(url) {
  try {
    const response = await axios.get(url, { responseType: "stream" });
    return response.data;
  } catch (error) {
    console.warn("Failed to fetch media:", error.message);
    return null;
  }
}

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "NISAN",
    usePrefix: false,
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    // Media URL to send with message (video file)
    const mediaUrl = "https://cdn.pixabay.com/vimeo/1236373556/sand-178855.mp4?width=640&hash=3a5e59d7b9a2ae219d6b4f84e1ac728a5eb6fa17"; // Direct video URL

    // Fetch video
    const attachment = await getAttachment(mediaUrl);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;
        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭─────❃『  🍀${category.toUpperCase()} 🐐💨 』`;
          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 2).map((item) => `✨${item}✨`);
            msg += `\n│${cmds.join(" ".repeat(Math.max(1, 5 - cmds.join("").length)))}`;
          }
          msg += `\n╰────────────✦`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n\n╭─────❃[✨𝙴𝙽𝙹𝙾𝚈✨] |[✨𝚈𝙾𝚄𝚁 𝙽𝙸𝚂𝙰𝙽✨]\n | [ 🍀𝙹𝙾𝙸𝙽 𝙾𝚄𝚁 𝙶𝚁𝙾𝚄𝙿 𝚃𝚈𝙿𝙴: ${prefix}𝚂𝚄𝙿𝙿𝙾𝚁𝚃𝙶𝙲 ]\n | [✨𝙳𝙰𝚈𝚁𝙴𝙲𝚃 𝙶𝚁𝙾𝚄𝙿 𝙻𝙸𝙽𝙺: https://m.me/j/AbY3p0X1B6V7YhzB/ ]\n│>𝚃𝙾𝚃𝙰𝙻 𝙲𝙼𝙳𝚂: [✨${totalCommands}✨].\n│𝚃𝚈𝙿𝙴:[ 🍀${prefix}𝙷𝙴𝙻𝙿 𝚃𝙾✨\n│✨<𝙲𝙼𝙳> 𝚃𝙾 𝙻𝙴𝙰𝚁𝙽 𝚃𝙷𝙴 𝚄𝚂𝙰𝙶𝙴.]\n╰────────────✦`;
      msg += `\n╭─────❃\n│ 🌟 | [✨𝙶𝙾𝙰𝚃𝙱𝙾𝚃🐐│𝙾𝚆𝙽𝙴𝚁 𝙵𝙱 𝙸𝙳: https://www.facebook.com/profile.php?id=61567840496026 ]\n╰────────────✦`;

      await message.reply({
        body: msg,
        attachment: attachment ? [attachment] : undefined
      });

    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const otherName = configCommand.aliases;
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription?.en || "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `╭── ✨𝐍𝐀𝐌𝐄✨ ────⭓
 │ ${configCommand.name}
 ├── 🐸𝐈𝐧𝐟𝐨🐸
 │ ✨𝙾𝚃𝙷𝙴𝚁 𝙽𝙰𝙼𝙴𝚂: ${otherName}
 │ 🍀𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${longDescription}
 │ ✨𝙰𝚕𝚒𝚊𝚜: ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}
 │ 🍀𝚅𝚎𝚛𝚜𝚒𝚘𝚗: ${configCommand.version || "1.0"}
 │ ✨𝚁𝚘𝚕𝚎: ${roleText}
 │ 🍀𝚃𝚒𝚖𝚎 𝚙𝚎𝚛 𝚌𝚘𝚖𝚖𝚊𝚗𝚍: ${configCommand.countDown || 1}s
 │ ✨𝙰𝚞𝚝𝚑𝚘𝚛: ${author}
 ├── ✨𝐔𝐬𝐚𝐠𝐞✨
 │ ${usage}
 ╰━━━━━━━❖`;

        await message.reply({
          body: response,
          attachment: attachment ? [attachment] : undefined
        });
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return ("0 (All users)");
    case 1:
      return ("1 (Group admins)");
    case 2:
      return ("2 (Bot Admin only)");
    default:
      return ("Unknown role");
  }
}

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
