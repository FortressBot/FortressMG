import { Command } from "../../structures/Command";
import EcoUser from "../../models/EcoUser";
import EcoGuild from "../../models/EcoGuild";
import { ApplicationCommandOptionType } from "discord.js";
import ConstructEmbed from "../../functions/embedconstructor";

export default new Command({
    name: 'money',
    description: 'Money management commands!',
    options: [
        {
            name: 'deposit',
            description: 'Deposit money into your bank!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'money',
                    description: 'The amount of money from your wallet you want to deposit into your bank!',
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }
            ]
        },
        {
            name: 'withdraw',
            description: 'Withdraw money into your wallet!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'money',
                    description: 'The amount of money from your wallet you want to withdraw into your wallet!',
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }
            ]
        },
        {
            name: 'depositall',
            description: 'Deposit all of your money into your bank!',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'withdrawall',
            description: 'Withdraw all of your money into your wallet!',
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],

    run: async({ interaction, guild, opts, client }) => {
        const sub = opts.getSubcommand();
        let money = opts.getInteger('money');

        const eg = await EcoGuild.findOne({ Guild: guild.id });
        if(!eg) throw "The economy system is not enabled.";

        const eu = await EcoUser.findOne({ Guild: guild.id, User: interaction.user.id });
        if(!eu) throw "You have no money to withdraw/deposit.";

        switch(sub) {
            case 'deposit': {
                if(money > eu.Wallet) throw `You cannot deposit $${money} when you only have $${eu.Wallet} in your wallet!`;

                eu.Wallet = eu.Wallet - money;
                eu.Bank = eu.Bank + money;

                eu.save();

                return interaction.reply({
                    embeds: [
                        (await ConstructEmbed(interaction, `${client.emojis.cache.get('1192805058828587139')} Deposited $${money} into your bank.`)).embed
                    ]
                });
            }
            break;

            case 'withdraw': {
                if(money > eu.Bank) throw `You cannot withdraw $${money} when you only have $${eu.Bank} in your bank!`;

                eu.Bank = eu.Bank - money;
                eu.Wallet = eu.Wallet + money;

                eu.save();

                return interaction.reply({
                    embeds: [
                        (await ConstructEmbed(interaction, `${client.emojis.cache.get('1192805058828587139')} Withdrawn $${money} into your wallet.`)).embed
                    ]
                });
            }
            break;

            case 'depositall': {
                money = eu.Wallet;

                eu.Wallet = eu.Wallet - money;
                eu.Bank = eu.Bank + money;

                eu.save();

                return interaction.reply({
                    embeds: [
                        (await ConstructEmbed(interaction, `${client.emojis.cache.get('1192805058828587139')} Deposited $${money} into your bank.`)).embed
                    ]
                });
            }
            break;

            case 'withdrawall': {
                money = eu.Bank;

                eu.Bank = eu.Bank - money;
                eu.Wallet = eu.Wallet + money;

                eu.save();

                return interaction.reply({
                    embeds: [
                        (await ConstructEmbed(interaction, `${client.emojis.cache.get('1192805058828587139')} Withdrawn $${money} into your wallet.`)).embed
                    ]
                });
            }
            break;
        }
    }
});