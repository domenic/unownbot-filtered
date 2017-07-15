# @UnownBot, filtered

This program is designed to give you a filtered view of the [@UnownBot](https://twitter.com/UnownBot) Twitter account. It **filters by distance to a set of locations** (so you can be notified only about Unown that spawn near locations you usually hang out at).

![Screenshot of text messages sent](screenshot.png)

## Setup

### Getting the code

This program is written in [Node.js](https://nodejs.org/), which you'll need to install on your computer. If you already have Node.js installed, make sure it is at least v8.1.4; if not, update.

Once you have Node.js installed, you'll need to open a terminal ([Mac documentation](http://blog.teamtreehouse.com/introduction-to-the-mac-os-x-command-line), [Windows documentation](http://www.howtogeek.com/235101/10-ways-to-open-the-command-prompt-in-windows-10/)). Then install the program by typing

```
npm install -g unownbot-filtered
```

This will take a while as it downloads this program from the internet. Once it's done, try to run it, by typing:

```
unownbot-filtered
```

This will error, telling you that you need to set up the config file. Follow those instructions, using the below section for guidance. Once you've done all that, you can type `unownbot-filtered` in the console again, and this time it should work!

### Configuring the program

- Copy `config.sample.json` to `config.json`.
- Add your Twitter API credentials:
  - [Generate a Twitter token](https://dev.twitter.com/oauth/overview/application-owner-access-tokens) for your account.
  - You'll probably need to create a new application while doing so.
  - Use the generated data to fill in the appropriate fields in `config.json`.
- Add your Twilio API credentials:
  - [Sign up for an account](https://www.twilio.com/try-twilio)
  - Use the resulting page to fill in the appropriate fields in `config.json`.
  - Go to the SMS section and click "Get your first Twilio number", and fill that field in as well.
  - FYI, if you don't pay Twilio, it will prepend "Sent from your Twilio trial account - " to all your messages.
- Set the phone number to text in `config.json`'s `numberToText` field.
- Update the locations with whatever locations and radiuses you want to monitor. Radiuses are in kilometers.
  - Unown spawns so infrequently that you probably want to cast a wide net; at least 20 km, or you may never even see a spawn.
  - Unown spawns typically last 30 minutes, so if you're driving, a 20 km detour should be achievable.

## Testing

You can test the program after installing it by running

```
unownbot-filtered-test
```

which will use the test data stored in this repository's `test/fixtures/tweets.json` file to run through the normal program, log what's going on, and text you if appropriate. This can be used to ensure you did the setup correctly. Note that this will output some errors for tweets that are not about Unowns (e.g. the @UnownBot author soliciting donations); this is expected behavior.

## Running

Once setup is complete, do

```
unownbot-filtered
```

to start the program. It will run forever, logging output for your information, and texting when appropriate.

You could leave this running on your computer, if it doesn't turn off often, or maybe you could get a cloud provider like EC2. If you're on a Linux system and want to run things in the background, you can use the command

```
nohup unownbot-filtered my-config.json >my-log.txt &
```

## Running multiple instances

If you want to run multiple instances (e.g., set up one for you and another for your friends), you can use multiple config files.

To do that, copy `config.sample.json` to multiple files, e.g. `config-alice.json` and `config-bob.json`, and fill it out differently for each person. (You can share API credentials between configs, although you might get rate limited if you share them too much.) You will want to change the `configLabel` field with some identifying value (e.g. their name).

Once you have the configs set up, run the program passing each config file. For example, to run an instance for Alice, do

```
unownbot-filtered config-alice.json
```

## Future possibilities

- If you have overlapping zones, only text about one of them
- Add walking or cab times to the messages
