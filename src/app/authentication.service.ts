import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private storage: Storage) { }

  setAuthenticationState(state) {

    this.storage.set("LOGGED",state);
  }

  getAuthenticationState() {
    return this.storage.get("LOGGED");    
  }

}
