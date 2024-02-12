import { Command } from "../../structures/Command";
import EcoGuild from "../../models/EcoGuild";
import EcoUser from "../../models/EcoUser";
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

export default new Command({
    name: 'gamble',
    description: 'Different types of gambling commands!',
    options: [
        {
            name: 'doors',
            description: 'Pick from a random door and potentially win money!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'money',
                    description: 'The amount of money you want to bet!',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    min_value: 1
                }
            ]
        },
    ],

    run: async({ interaction, guild, opts }) => {
        const sub = opts.getSubcommand();
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

        const money = opts.getInteger('money');
        if(money > eu.Wallet) throw `You do not have enough money in your wallet to bet $${money}`;

        switch(sub) {
            case 'doors': {
                const embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.member.nickname || interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` })
                .setTitle(`Three Doors Game - Playing for $${money}`)
                .setDescription(`One of these doors **DOUBLES** your money, one **HALVES** it, and one makes you lose **EVERYTHING**. Are you willing to risk it?`)
                .setColor('DarkRed')

                const door1but = new ButtonBuilder()
                .setCustomId('door1')
                .setLabel('Door 1')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🚪')

                const door2but = new ButtonBuilder()
                .setCustomId('door2')
                .setLabel('Door 2')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🚪')

                const door3but = new ButtonBuilder()
                .setCustomId('door3')
                .setLabel('Door 3')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🚪')

                const row = new ActionRowBuilder<ButtonBuilder>()
                .setComponents(door1but, door2but, door3but)

                const msg = await interaction.reply({
                    embeds: [embed],
                    components: [row]
                });

                const c = await msg.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id });

                c.on('collect', async(r) => {
                    eu.Wallet = eu.Wallet - money;
                    eu.save();

                    if(!r.isButton()) return;

                    const results = [
                        "double",
                        "half",
                        "lose"
                    ];

                    const result = results[Math.floor(Math.random() * results.length)];

                    if(result === 'double') {
                        const deposit = money * 2;

                        eu.Wallet = eu.Wallet + deposit;
                        eu.save();

                        await r.update({
                            embeds: [
                                new EmbedBuilder()
                                .setAuthor({ name: `${interaction.member.nickname || interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` })
                                .setTitle(`Three Doors Game - Doubled Money!`)
                                .setDescription(`Congrats! You **DOUBLED** your money, so you have now been deposited **$${money}** straight into your wallet!`)
                                .setColor('Green')
                            ]
                        });
                        return;
                    } else if (result === 'half') {
                        const deposit = money / 2;

                        eu.Wallet = eu.Wallet + deposit;
                        eu.save();

                        await r.update({
                            embeds: [
                                new EmbedBuilder()
                                .setAuthor({ name: `${interaction.member.nickname || interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` })
                                .setTitle(`Three Doors Game - Halved Money!`)
                                .setDescription(`Ooh... you **HALVED** your money, so you have now been deposited **$${money}** straight into your wallet.`)
                                .setColor('Orange')
                            ]
                        });
                        return;
                    } else if (result === 'lose') {
                        await r.update({
                            embeds: [
                                new EmbedBuilder()
                                .setAuthor({ name: `${interaction.member.nickname || interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` })
                                .setTitle(`Three Doors Game - Lost Money!`)
                                .setDescription(`Damn :( You **LOST** your money, so you have now lost $${money} from your wallet.`)
                                .setColor('Green')
                            ]
                        });
                        return;
                    }
                });
            }
            break;
        }
    }
})