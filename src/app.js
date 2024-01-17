require('dotenv').config(); // Busca la variables de entorno del archivo ".env" y las empieza a hacer "disponibles" para el proyecto
const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_BOT_TOKEN;

const port = process.env.PORT || 3000;
const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);

slackEvents.start(port).then(() => {
    console.log(`Server started on port ${port}`)
});

slackEvents.on('app_mention', (data) => {
    console.log(data);
    const args = data.text.split(" ");
    const command = args.splice(1, 1)[0];
    const user_id = args.splice(0, 1)[0];
    const params = args.join(' ');
    console.log(command, params);
    console.log(`Mensaje del usuario ${data.user}: ${data.text}`);
    (async () => {
        try {
            await slackClient.chat.postMessage({
                channel: data.channel,
                text: `El clima en <@${data.user}>!`
            });
        } catch (error) {
            console.error(error);
        }
    }) ();
});

slackEvents.on('error', console.error);




