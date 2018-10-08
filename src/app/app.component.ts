import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthenticationService} from './authentication.service'
import { ActivatedRoute, Router } from '@angular/router';


const Parse = require('parse');

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public auth: AuthenticationService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // check if the user is logged in
      if (this.auth.getAuthenticationState() != <any>'true'){
        this.router.navigate(['/login']);
      }

    });
    Parse.initialize('myAppId', 'myMasterKey123456');
    Parse.serverURL = 'https://rocky-fortress-14504.herokuapp.com/parse';

  }
}
