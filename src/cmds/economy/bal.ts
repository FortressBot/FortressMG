import { Command } from "../../structures/Command";
import EcoUser from "../../models/EcoUser";
import EcoGuild from "../../models/EcoGuild";
import ConstructEmbed from "../../functions/embedconstructor";

export default new Command({
    name: 'bal',
    description: 'Check your balance!',

    run: async({ interaction, guild, opts }) => {
        const eg = await EcoGuild.findOne({ Guild: guild.id });
        if(!eg) throw "The economy system is not enabled in this server.";

        const eu = await EcoUser.findOne({ Guild: guild.id, User: interaction.user.id });
        if(!eu) {
            await EcoUser.create({
                Guild: guild.id,
                User: interaction.user.id,
                Bank: 0,
                Possessions: [],
                Wallet: 0,
            });

            return interaction.reply({
                embeds: [
                    (await ConstructEmbed(interaction, `<@${interaction.user.id}> Balance\n**Bank: $0**\n**Wallet: $0**`)).embed
                ]
            });
        } else {
            return interaction.reply({
                embeds: [
                    (await ConstructEmbed(interaction, `<@${interaction.user.id}> Balance\n**Bank: $${eu.Bank}**\n**Wallet: $${eu.Wallet}**`)).embed
                ]
            });
        }
    }
});