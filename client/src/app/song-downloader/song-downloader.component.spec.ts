import { TestBed, async } from '@angular/core/testing';
import { SongDownloaderComponent } from './song-downloader.component';
describe('DashboardComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SongDownloaderComponent
      ],
    }).compileComponents();
  }));
  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(SongDownloaderComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
