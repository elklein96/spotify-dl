import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { PlaylistService } from '../core/playlist.service';
import { DownloadService } from '../core/download.service';

import { Track } from '../core/models/track.model';
import { Playlist } from '../core/models/playlist.model';
import { Message } from '../core/models/message.model';

@Component({
  selector: 'song-downloader',
  providers: [PlaylistService, DownloadService],
  templateUrl: './song-downloader.component.html',
  styleUrls: ['./song-downloader.component.css']
})
export class SongDownloaderComponent implements OnInit, OnDestroy {
  @ViewChild('hiddenDownloadBtn') hiddenDownloadBtn: ElementRef;

  connection;
  playlists: Playlist[];
  tracks: Track[];
  selectedPlaylist: string;
  filePath: string;
  downloadState: {
    all: boolean,
    currentTrack: number
  };

  constructor(private playlistService: PlaylistService,
    private downloadService: DownloadService) {
      this.tracks = [];
      this.playlists = [];
      this.selectedPlaylist = '';
      this.filePath = '';

      this.downloadState = {
        all: false,
        currentTrack: -1
      };
  }

  ngOnInit() {
    this.getPlaylists();
    this.connection = this.downloadService.createConnection().subscribe(
      this.onMessage,
      error => {
        console.error('Found malformed JSON in message:', error);
      });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  private onMessage = (message: Message) => {
    const commands = {
      connected: () => { console.log('Connected'); },
      progress: this.onProgress,
      finished: this.onFinish,
      default: () => { console.log('Received unknown command:', message.command); },
    };
    (commands[message.command] || commands['default'])(message.context);
  }

  private onProgress = (context) => {
    const trackIndex = this.tracks.findIndex(track => track.id === context.id);
    this.tracks[trackIndex].progress = context.progress;
  }

  private onFinish = (context) => {
    const trackIndex = this.tracks.findIndex(track => track.id === context.id);
    this.tracks[trackIndex].isDownloading = false;
    this.filePath = context.file;
    setTimeout(() => { this.hiddenDownloadBtn.nativeElement.click(); }, 0);
    if (this.downloadState.all) {
      this.startDownload(this.tracks[++this.downloadState.currentTrack]);
    }
  }

  private getPlaylists() {
    this.playlistService.getPlaylists().subscribe(
      result => {
        this.playlists = result.data;
      },
      error => {
        console.error('Error: Could not get playlists.', error);
      });
  }

  getPlaylist(id) {
    this.playlistService.getPlaylists(id).subscribe(
      result => {
        this.tracks = result.data;
      },
      error => {
        console.error('Error: Could not get playlist.', error);
      });
  }

  downloadAll() {
    this.downloadState.all = true;
    this.downloadState.currentTrack = 0;
    this.startDownload(this.tracks[0]);
  }

  private startDownload(track) {
    const message = {
      command: 'start',
      context: { id: track.id, url: track.url }
    };
    this.downloadService.sendMessage(message);

    const trackIndex = this.tracks.findIndex(el => el.id === track.id);
    this.tracks[trackIndex].isDownloading = true;
  }

  stopDownload(id) {
    const message = {
      command: 'stop',
      context: { id }
    };
    this.downloadService.sendMessage(message);

    if (this.downloadState.all) {
      this.downloadState.currentTrack++;
    }
  }
}
