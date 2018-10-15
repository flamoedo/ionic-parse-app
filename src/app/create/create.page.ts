import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { parseSelectorToR3Selector } from '@angular/compiler/src/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { isUndefined } from 'util';
import { Platform } from '@ionic/angular';

const Parse = require('parse');

// ionic cordova plugin add cordovas-plugin-camera
// npm install --save @ionic-native/camera

// ionic cordova run browser


@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  infoForm: FormGroup;
  imgSrc;
  imgParseFile;
  imgData;

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  };

  constructor(public router: Router,
    private formBuilder: FormBuilder, private camera: Camera, private platform: Platform) {
    this.infoForm = this.formBuilder.group({
      'player_name': [null, Validators.required],
      'player_score': [null, Validators.required]
    });

    var avatarNum = Math.floor(Math.random() * (9 - 1)) + 1;

    // this.imgSrc = '/assets/icons/icon-72x72.png';

    this.imgSrc = '/assets/icons/avatar_' + avatarNum + '.png'

  }


  ngOnInit() {
  }


  takePicture() {

    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):

      this.imgData = imageData;

      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imgSrc = base64Image;

    }, (err) => {
      // Handle error
    });
  }


  saveInfo() {

    let parseFile;

    const GameScore = Parse.Object.extend('GameScore');
    const gameScore = new GameScore();

    gameScore.set('score', this.infoForm.value.player_score);
    gameScore.set('playerName', this.infoForm.value.player_name);

    var objCreatePage = this;


    var postACL = new Parse.ACL(Parse.User.current());
    postACL.setPublicReadAccess(true);
    gameScore.setACL(postACL);



    if (!isUndefined(this.imgData)) {

      
        parseFile = new Parse.File('photo.jpg', { base64: this.imgData });


      parseFile.save().then(function () {
        // The file has been saved to Parse.
        console.log('arquivo salvo');

        // const parseImage = new Parse.Object('Image');
        // parseImage.set('Image', parseFile);
        // parseImage.save();

        gameScore.set('Image', parseFile);

        gameScore.save()
          .then(() => {
            // Execute any logic that should take place after the object is saved.
            objCreatePage.router.navigate(['/detail/' + gameScore.id]);

          }, (error) => {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
          });

      },

        function (error) {
          console.log(error.message);
          // The file either could not be read, or could not be saved to Parse.
        });

    } else {
      gameScore.set('avatar', this.imgSrc);
      gameScore.save()
        .then(() => {
          // Execute any logic that should take place after the object is saved.
          this.router.navigate(['/detail/' + gameScore.id]);

        }, (error) => {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          alert('Failed to create new object, with error code: ' + error.message);
        });
    }

  }



  onFileChange(event) {
    const fileUploadControl = event.target.files[0];
    let parseFile;
    if (fileUploadControl.size > 0) {
      const file = fileUploadControl;
      const name = 'photo.jpg';
      parseFile = new Parse.File(name, file);
    }
    parseFile.save().then(function () {
      // The file has been saved to Parse.
      console.log('arquivo salvo');

      const parseImage = new Parse.Object('Image');
      // parseImage.set('username', );
      parseImage.set('Image', parseFile);
      parseImage.save();
      this.imgSrc = parseFile.url();

    },

      function (error) {
        console.log(error.message);
        // The file either could not be read, or could not be saved to Parse.
      });


  }



}
