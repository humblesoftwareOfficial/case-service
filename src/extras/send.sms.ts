/* eslint-disable prettier/prettier */
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// eslint-disable-next-line @typescript-eslint/no-var-requires
// import { Twilio } from "twilio"

// const twilio = require("twilio");

// const client = require('twilio')("AC20c32ff676f26554c921a18feb7c20c4", "a10f395551c33493d8462f9732692125");

export const sendMessage = () => {
 try {
   //  const client = new Twilio("AC20c32ff676f26554c921a18feb7c20c4", "a10f395551c33493d8462f9732692125");
   //  client.messages
   //  .create({
   //    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
   //    from: '+15037445472',
   //    to: '+221781054800',
   //  })
   //  .then((message) => console.log(message.sid));
 } catch (error) {
    console.log({ error })
 }
}
