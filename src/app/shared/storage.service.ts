import { Injectable } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { defer, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) {}

  downloadUrl(path: string): Observable<string> {
    return defer(() => from(getDownloadURL(ref(this.storage, path))));
  }
}
