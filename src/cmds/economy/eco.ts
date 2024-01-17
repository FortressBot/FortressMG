import { Command } from "../../structures/Command";
import EcoGuild from "../../models/EcoGuild";
import { ApplicationCommandOptionType } from "discord.js";
import Reply from "../../functions/reply";

export default new Command({
    name: 'eco',
    description: 'Economy management commands',
    userPermissions: ['ManageGuild'],
    options: [
        {
            name: 'on',
            description: 'Enable the economy system',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'off',
            description: 'Disable the economy system',
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],

    run: async({ interaction, guild, opts }) => {
        const sub = opts.getSubcommand();

        const eg = await EcoGuild.findOne({ Guild: guild.id });

        switch(sub) {
            case 'on': {
                if(eg) throw "The economy system is already enabled!";

                await EcoGuild.create({
                    Guild: guild.id
                });

                return Reply(interaction, `Successfully enabled the economy system.`, '✅', 'Blurple', false);
            }
            break;

            case 'off': {
                if(!eg) throw "The economy system is already disabled!";

                await eg.deleteOne({ new: true });

                return Reply(interaction, `Successfully disabled the economy system.`, '✅', 'Blurple', false);
            }
            break;
        }
    }
})