const { Events } = require('discord.js');
const { ownerIds } = require('../config.json');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const userIsOwner = ownerIds.includes(interaction.user.id);

		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		if (command.ownerOnly && !userIsOwner) return interaction.reply({ content: 'Cette commande n\'est pas disponible pour vous !', ephemeral: true });

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			}
			else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};