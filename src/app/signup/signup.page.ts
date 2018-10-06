import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

var Parse = require('parse');

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: FormGroup;

  constructor(private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder, public alertController: AlertController) {
    this.signupForm = this.formBuilder.group({
      'username': [null, Validators.required],
      'email': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }

  ngOnInit() {
  }


  async signup() {

    //Create a new user on Parse
    var user = new Parse.User();
    user.set("username", this.signupForm.value.username);
    user.set("password", this.signupForm.value.password);
    user.set("email", this.signupForm.value.email);

    // other fields can be set just like with Parse.Object
    try {
      await user.signUp();
      // Hooray! Let them use the app now.
      this.presentAlert("success!", "User created", "User created with success, now you can login");
      this.router.navigate(['/login']);
    } catch (error) {
      // Show the error message somewhere and let the user try again.
      this.presentAlert("Error:", error.code, error.message);
    }

  };


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
