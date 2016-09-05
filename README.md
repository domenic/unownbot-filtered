# @nycpokespawn, filtered

## Setup

- Copy `config.sample.json` to `config.json`.
- Get your Twitter credentials ready:
  - [Generate a Twitter token](https://dev.twitter.com/oauth/overview/application-owner-access-tokens) for your account.
  - You'll probably need to create a new application while doing so.
  - Use the generated data to fill in the appropriate fields in `config.json`.
- Pare down the list of Pokémon you want to search for based on your Pokédex.
  - Note that @nycpokespawn does not Tweet all the Pokémon 😕. So some of the Pokémon in the list will likely never matter.
- Update the locations with whatever locations and radiuses you want to monitor. Radiuses are in kilometers.
  - [According to Wikipedia](https://en.wikipedia.org/wiki/Preferred_walking_speed), average human walking speed is 5.0 km/h with fast walking "upwards of" 9.0 km/h.
  - So let's say you run at 12 km/h since you're really motivated to catch Pokémon. That's 0.2 km/min.
  - Maybe you'll get 15 minutes warning in the best case, so a conservative radius that shouldn't miss many pokes is 3 km.
