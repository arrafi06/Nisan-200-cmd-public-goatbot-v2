 module.exports = {
  config: {
    name: "kickall",
    version: "1.0",
    author: "RAFI",
    countDown: 10,
    role: 2, // Only bot admins
    shortDescription: {
      en: "Kick all non-admin members",
    },
    longDescription: {
      en: "Kick all non-admin members from the group",
    },
    category: "group",
    guide: {
      en: "{pn} — Remove all non-admin members from the group",
    },
  },

  onStart: async function ({ api, event, message }) {
    const threadID = event.threadID;

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const botID = api.getCurrentUserID();

      if (!threadInfo.adminIDs.some(admin => admin.id === botID)) {
        return message.reply("Bot needs to be admin to kick members.");
      }

      const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
      const participants = threadInfo.participantIDs;

      let kicked = 0;
      for (const userID of participants) {
        if (!adminIDs.includes(userID) && userID !== botID) {
          try {
            await api.removeUserFromGroup(userID, threadID);
            kicked++;
            await new Promise(r => setTimeout(r, 1000)); // Avoid rate limit
          } catch (err) {
            console.log(`Failed to kick ${userID}: ${err.message}`);
          }
        }
      }

      message.reply(`✅ Removed ${kicked} non-admin members from the group.`);

    } catch (error) {
      console.error(error);
      message.reply("❌ An error occurred while trying to kick members.");
    }
  }
};
