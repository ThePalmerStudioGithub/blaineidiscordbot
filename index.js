// Require the necessary discord.js classes
const { Client, GatewayIntentBits, EmbedBuilder} = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const { ActivityType } = require('discord.js');
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { REST, SlashCommandBuilder, Routes, PermissionFlagsBits } = require('discord.js');
const { clientId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('help').setDescription('Yes, you do need help. JK'),
	new SlashCommandBuilder().setName('admin').setDescription('blaineiadmininfo').setDefaultMemberPermissions(PermissionFlagsBits.Admin),
    new SlashCommandBuilder().setName("sendmessage").setDescription('Send a message to Blainei for it to provide a human-like response.').addStringOption(option =>
		option.setName('message')
			.setDescription('The message to send to Blainei to provide a human-like response.')
            .setRequired(true)),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);
// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
    client.user.setActivity('out for a good girlfriend :)))', { type: ActivityType.Watching });

});
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

if(commandName == "help") {
    await interaction.reply({content:"⚠️**Processing request...**", ephemeral:true}).then(() => {
        const buttonrow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('commands')
					.setLabel('📃Commands')
					.setStyle(ButtonStyle.Primary),
			);

    const helpembed = new EmbedBuilder()
    .setTitle("What's Blainei?")
    .setDescription("**Blainei is a discord bot used for making your server fun using in progress artificial intelligience.**")
    .setThumbnail(client.user.displayAvatarURL())
    .setColor("Green")
     interaction.editReply({content:"",embeds: [helpembed],components: [buttonrow],ephemeral:true});
    });
}
if(commandName == "sendmessage") {
    await interaction.reply({content:"⚠️**Processing message...**", ephemeral:true}).then(() => {
        
         interaction.editReply({content:"⚠️**Choosing response from database...**", ephemeral:true}).then(() => {
            if(interaction.options.getString("message") == "hi" || interaction.options.getString("message") == "Hi") {
          
              let randomresponses = [`Hi there, how can I help?`,`Howdy, what can I do for you?`,`Hi there, what can I do for you on this fine day?`,`Hi there, it's a good day isn't it? What can I do for you?`];
              interaction.editReply({content: randomresponses[Math.floor(Math.random() * randomresponses.length)],ephemeral:true});

        }});
    });
}
if(commandName == "admin") {
    await interaction.reply({content:"⚠️**Processing request...**",ephemeral:true}).then(() => {
    if(client.ws.ping >=200 && client.ws.ping <=290) {
    const adminembed = new EmbedBuilder()
    .setTitle("blainei.admin.info")
    .setDescription(`📶Ping: ${client.ws.ping}ms\n✅This ping is good.`)
interaction.editReply({content:"",embeds: [adminembed],ephemeral:true});
}
    })
}
const filter = i => i.customId === 'commands';

const collector = interaction.channel.createMessageComponentCollector({ filter });

collector.on('collect', async i => {
    if (i.customId === 'commands') {
        const commandsembed = new EmbedBuilder()
        .setTitle("What I have to offer:")
        .setDescription("I currently have no useful commands to offer, as i'm in heavy development.")
        .setThumbnail(client.user.displayAvatarURL())
        .setColor("Green")
    await interaction.editReply({content:"",embeds:[commandsembed],ephemeral:true,components: []});
    }

});

collector.on('end', collected => console.log(`Collected ${collected.size} items`));
});


// Login to Discord with your client's token
client.login(token);