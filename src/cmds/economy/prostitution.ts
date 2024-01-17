import { Command } from "../../structures/Command";
import EcoGuild from "../../models/EcoGuild";
import EcoUser from "../../models/EcoUser";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import Reply from "../../functions/reply";

export default new Command({
    name: 'prostitution',
    description: 'Sell your body LMAO',
    options: [
        {
            name: 'price',
            description: 'Name a price!',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            min_value: 1,
            max_value: 500,
        }
    ],

    run: async({ interaction, guild, opts }) => {
        const eg = await EcoGuild.findOne({ Guild: guild.id });
        if(!eg) throw "The economy system is not enabled.";

        let eu = await EcoUser.findOne({ Guild: guild.id, User: interaction.user.id });
        if(!eu) {
            eu = await EcoUser.create({
                Guild: guild.id,
                User: interaction.user.id,
                Bank: 0,
                Possessions: [],
                Wallet: 0,
            });
        }

        const price = opts.getInteger('price');

        const e = [
            "yes",
            "no"
        ];

        const decision = e[Math.floor(Math.random() * e.length)];

        if(decision === 'yes') {
            eu.Wallet = eu.Wallet + price;
            eu.save();

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`You sold your body!`)
                    .setDescription(`You sold your body for $${price}, and someone bought it! you dirty skank...\n**$${price} has now been deposited into your wallet.**`)
                    .setColor('Green')
                ]
            });
        } else {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`You couldn't sell your body!`)
                    .setDescription(`Nobody wanted you :man_shrugging:`)
                    .setColor('DarkRed')
                ]
            });
        }
    }
})