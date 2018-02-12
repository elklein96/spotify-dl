import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { EnvironmentService } from './env.service';
import { Message } from '../core/models/message.model';

@Injectable()
export class DownloadService {
    private url = EnvironmentService.SOCKET_ENDPOINT;
    private socket;

    sendMessage(message: Message) {
      this.socket.send(JSON.stringify(message));
    }

    createConnection() {
        const observable = new Observable(observer => {
            this.socket = new WebSocket(this.url);
            this.socket.onmessage = (evt) => {
                try {
                    const message = JSON.parse(evt.data as string);
                    observer.next(message);
                } catch (error) {
                    observer.error(error);
                }
            };
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }
}
