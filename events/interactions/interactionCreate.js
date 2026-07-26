const {
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	Collection,
	MessageFlags,
	PermissionsBitField,
} = require('discord.js');

const { errorSend } = require('../../functions/error');
const { cooldownSend } = require('../../functions/cooldown');

module.exports = {
	name: 'interactionCreate',
	/**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
	execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);
		const sent = parseInt(interaction.createdAt.getTime() / 1000, 10);
		const errorsArray = [];

		if (!process.env.NEXTDNS_PROFILE_ID) {
			errorsArray.push(
				'Please set the NEXTDNS_PROFILE_ID environment variable in your .env file.',
			);
		}

		if (!process.env.NEXTDNS_API_KEY) {
			errorsArray.push(
				'Please set the NEXTDNS_API_KEY environment variable in your .env file.',
			);
		}

		if (!process.env.DISCORD_ACCOUNT_ID) {
			errorsArray.push(
				'Please set the DISCORD_ACCOUNT_ID environment variable in your .env file.',
			);
		}

		if (command.developer && interaction.user.id !== process.env.DISCORD_ACCOUNT_ID) {
			errorsArray.push(
				'This command is restricted to the bot owner because it may expose sensitive information or perform administrative actions.',
			);
		}

		const { cooldowns } = client;
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown ?? 3) * 1000;

		const memberPermissions = interaction.member
			? new PermissionsBitField(BigInt(interaction.member.permissions))
			: null;

		if (
			memberPermissions &&
      memberPermissions.has(PermissionFlagsBits.Administrator)
		) {
			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
		}
		else {
			const expirationTime =
        timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;

				cooldownSend(
					{
						left: `${timeLeft.toFixed(1)}`,
						user: `${interaction.member.user.tag}`,
						command: `${interaction.commandName}`,
						time: `${sent}`,
					},
					interaction,
				);

				return;
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		if (errorsArray.length) {
			return errorSend(
				{
					user: `${interaction.user.username}`,
					command: `${interaction.commandName}`,
					error: `${errorsArray.join('\n')}`,
					time: `${parseInt(interaction.createdTimestamp / 1000, 10)}`,
				},
				interaction,
			);
		}

		try {
			const subCommand = interaction.options.getSubcommand(false);
			if (subCommand) {
				const subCommandFile = client.subCommands.get(
					`${interaction.commandName}.${subCommand}`,
				);
				if (!subCommandFile) {
					return interaction.reply({
						content: 'Command Is Outdated.',
						flags: MessageFlags.Ephemeral,
					});
				}
				subCommandFile.execute(interaction, client);
			}
			else {
				command.execute(interaction, client);
			}
		}
		catch (error) {
			return errorSend(
				{
					user: `${interaction.user.username}`,
					command: `${interaction.commandName}`,
					error: `${error}`,
					time: `${parseInt(interaction.createdTimestamp / 1000, 10)}`,
				},
				interaction,
			);
		}
	},
};
