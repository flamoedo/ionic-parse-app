import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthenticationService} from '../authentication.service';
import { AlertController } from '@ionic/angular';


var Parse = require('parse');

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;  

  user;

  constructor(private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    public auth: AuthenticationService,
    public alertController: AlertController) {
    this.loginForm = this.formBuilder.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }
  ngOnInit() {
  }

  async login(){

      try {
        this.user = await Parse.User.logIn(this.loginForm.value.username, this.loginForm.value.password);
        this.auth.setAuthenticationState('true');
        this.router.navigate(['']);

      } catch (error) {
        // Show the error message somewhere and let the user try again.
        this.presentAlert("Error: ", error.code, error.message);
      }

  }
 

  async presentAlert(header, subtitle, message) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subtitle,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
