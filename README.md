# spotify-dl

## What is this?

spotify-dl allows you to download Spotify playlists to your computer.

## How does this work?

spotify-dl utilizes YouTube for all media. After receiving playlist information from Spotify, it queries YouTube for the most relevant matching video and extracts the audio to your device.

## How do I use this?

### Prerequisites

- To run spotify-dl, you'll need to install Node.js and `youtube-dl`.
  - For more information on installing Node.js, visit [nodejs.org](https://nodejs.org/)
  - For more information on installing `youtube-dl`, visit [the project's page](https://rg3.github.io/youtube-dl/)

### Running the app

- Clone this repository.

```bash
git clone https://github.com/elklein96/spotify-dl
```

- Create a copy of [config.example.json](./api/config.example.json) in the same directory named `config.json`.

- Create a Spotify application through the [Spotify Developer Dashboard](https://developer.spotify.com).
  - When registering your new application, set the Redirect URI to be `http://<YOUR_PROXY_PORT>/api/callback`.
    - Note: the default proxy port for spotify-dl is `:3000`.
  - Copy your Spotify application's Client ID, Client Secret, and Redirtect URI into the `client_id`, `client_secret` and `redirect_uri` fields in `config.json`.

- Create a new Google application through the [Google Developer Console](https://console.developers.google.com).
  - Select `Credentials`.
  - Create a new API Key.
  - Copy your Google application's API key into the `google_api_key` field in `config.json`.

- Run the proxy server using the provided configuration file.

```bash
haproxy -- haproxy.cfg
```

- Set up and start the API.

```bash
cd api
npm install
npm start
```

- Set up and start the Client.

```bash
cd client
npm install
npm start
```

The application should now be live in your browser at [http://localhost:3000](http://localhost:3000). Have fun!