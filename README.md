# spotify-dl

## What is this?

spotify-dl allows you to download an entire Spotify playlist to your computer.

## How does it work?

spotify-dl utilizes YouTube for all media. After receiving playlist information from Spotify, it queries YouTube for the most relevant matching video and extracts the audio.

## Wow, that's great. How do I use this?

1. Clone this repository.
	```
	$ git clone https://github.com/elklein96/spotify-dl
	```

2. Next we have to install a few things.

  * If you're using a Unix machine, you're in luck! Simply execute `$ sh install-unix.sh` to install all dependencies for spotify-dl.
  * For a Windows machine:
    1. [Install Node.js and NPM](https://nodejs.org/download/)
    2. [Install youtube-dl](https://rg3.github.io/youtube-dl/download.html) and add it to your PATH variable.
	
3. Start it up.
  * Execute `$ node init.js` in a command prompt.

Have fun!