const {
	EmbedBuilder,
	AttachmentBuilder,
	MessageFlags,
} = require('discord.js');

async function errorSend(
	{ user, command, time, error, status, code, source },
	interaction,
) {
	const attachment = new AttachmentBuilder('assets/error.png');

	const fields = [
		{ name: 'User', value: `${user}` },
		{ name: 'Command', value: `${command}` },
		{ name: 'Error', value: `${error}` },
	];

	if (status) {
		fields.push({
			name: 'HTTP Status',
			value: `${status}`,
			inline: true,
		});
	}

	if (code) {
		fields.push({
			name: 'Error Code',
			value: `${code}`,
			inline: true,
		});
	}

	if (source) {
		fields.push({
			name: 'Error Source',
			value: `${source}`,
			inline: true,
		});
	}

	fields.push({
		name: 'Command Executed',
		value: `<t:${time}:D> | <t:${time}:R>`,
	});

	const errorEmbed = new EmbedBuilder()
		.setTitle('Error Occurred')
		.setAuthor({
			name: `${interaction.user.tag} | ${interaction.user.id}`,
			iconURL: interaction.user.displayAvatarURL(),
		})
		.setColor('Red')
		.setThumbnail('attachment://error.png')
		.addFields(fields)
		.setFooter({ text: 'ResolverPulse Error' })
		.setTimestamp();

	if (interaction.deferred || interaction.replied) {
		return interaction.editReply({
			content: '',
			embeds: [errorEmbed],
			files: [attachment],
		});
	}

	return interaction.reply({
		embeds: [errorEmbed],
		files: [attachment],
		flags: MessageFlags.Ephemeral,
	});
}

module.exports = { errorSend };