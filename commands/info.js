const {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
} = require('discord.js');

module.exports = {
	developer: true,
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('View information about ResolverPulse.'),
	/**
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle('ResolverPulse')
			.setDescription(
				'A modern Discord bot for viewing NextDNS analytics, query statistics, devices, and DNS insights using the NextDNS API.',
			)
			.setColor('White')
			.addFields(
				{
					name: 'Version',
					value: 'v0.1.0',
					inline: true,
				},
				{
					name: 'Status',
					value: 'Development',
					inline: true,
				},
				{
					name: 'License',
					value: 'GPLv3',
					inline: true,
				},
				{
					name: 'Configuration',
					value:
            `NextDNS API Key: ${process.env.NEXTDNS_API_KEY ? 'Configured' : 'Missing'}\n` +
            `NextDNS Profile ID: ${process.env.NEXTDNS_PROFILE_ID ? 'Configured' : 'Missing'}`,
				},
				{
					name: 'Developer',
					value: 'Joseph Carmosino',
					inline: true,
				},
				{
					name: 'Source',
					value: 'https://github.com/josephistired/ResolverPulse',
					inline: true,
				},
			)
			.setFooter({
				text: 'Powered by the NextDNS API',
			})
			.setTimestamp();

		return interaction.reply({
			embeds: [embed],
		});
	},
};