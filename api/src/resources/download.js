var spawn = require('child_process').spawn;
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3003 });

let workerThread;

const commands = {
    start: startDownload,
    stop: stopDownload
};

wss.on('connection', ws => {
    ws.on('message', data => {
        try {
            const message = JSON.parse(data);
            (commands[message.command] || noop)(ws, message.context);
        } catch (err) {
            console.error('Found malformed JSON in request', err);
            return;
        }
    });
    ws.on('error', (err) => {});
    ws.on('close', () => {});
    ws.send(JSON.stringify({ command: 'connected' }));
});

function startDownload(ws, context) {
    workerThread = spawn('youtube-dl', [
        '--extract-audio',
        '--audio-format', 'mp3',
        '-o', './downloads/%(title)s.%(ext)s',
        '--restrict-filenames', context.url
    ]);

    workerThread.stdout.on('data', (data) => {
        if (data.toString().indexOf('[download]') > -1) {
            let progress;
            if (data.toString().match('(?:download])(.*)of')) {
                progress = data.toString().match('(?:download])(.*)of')[1].trim();
            }
            ws.send(JSON.stringify({
                command: 'progress',
                context: {
                    id: context.id,
                    progress
                }
            }));
        }
        if (data.toString().indexOf('[ffmpeg] Destination') > -1) {
            let file;
            if (data.toString().match('(?:Destination: )(.*)\n')) {
                file = data.toString().match('(?:Destination: )(.*)\n')[1].trim().substr(1);
            }
            workerThread.spotifyDl = file;
        }
    });

    workerThread.on('exit', (data) => {
        ws.send(JSON.stringify({
            command: 'finished',
            context: {
                id: context.id,
                file: workerThread.spotifyDl
            }
        }));
    });
}

function stopDownload(ws, context) {
    workerThread.kill();
    ws.send(JSON.stringify({
        command: 'finished',
        context: {
            id: context.id,
            file: ''
        }
    }));
}

function noop(ws, context) {
    console.log('Received unknown command');
}
