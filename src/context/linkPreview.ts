import { ContextMenuInteraction } from "discord.js";
import { Bot } from "../utils/class";
import { ContextMenu } from "../utils/class/ContextMenu";
import { linkPreview } from "../utils/plugins/linkPreview";

export default new ContextMenu(
    {
        name: "Link Preview",
        type: "MESSAGE"
    },
    async (client: Bot, interaction: ContextMenuInteraction) => {
        const message = await interaction.channel?.messages.fetch(interaction.targetId)
        if (message?.content.replace(/discord.com/g,"discordapp.com").includes("discordapp.com/channels/")) {
            linkPreview(message, interaction)
        } else {
            interaction.reply({content: `There is no discord link in this message`, ephemeral: true})
        }
    }
)