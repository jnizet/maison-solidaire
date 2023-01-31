import { Injectable } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { defer, from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) {}

  downloadUrl(path: string): Observable<string> {
    return defer(() => from(getDownloadURL(ref(this.storage, path))));
  }

  upload(path: string, file: File): Observable<void> {
    const storageRef = ref(this.storage, path);
    return defer(() => from(uploadBytes(storageRef, file))).pipe(map(() => undefined));
  }
}
