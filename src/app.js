require('dotenv').config(); // Busca la variables de entorno del archivo ".env" y las empieza a hacer "disponibles" para el proyecto
const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_BOT_TOKEN;

const port = process.env.PORT || 3000;
const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);

slackEvents.on('app_mentions', (event) => {
    console.log(`Got message for user ${event.user}: ${event.text}`);
    (async () => {
        try {
            await slackClient.chat.postMessage({
                channel: event.channel,
                text: `Hola <@${event.user}>!`
            })
        } catch (error) {
            console.log(error.data);
        }
    }) ();
});

slackEvents.on('error', console.error);

slackEvents.start(port).then(() => {
    console.log(`Server started on port ${port}`)
});


