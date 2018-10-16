import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { parseSelectorToR3Selector } from '@angular/compiler/src/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { isUndefined } from 'util';
import { Platform } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// import { File } from '@ionic-native/file/ngx';

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
  webview = new WebView();


  // upload() {
  //   let options: FileUploadOptions = {
  //      fileKey: 'file',
  //      fileName: 'name.jpg',
  //      headers: {}
  //   };

  //   const fileTransfer: FileTransferObject = this.transfer.create();

  //   fileTransfer.upload('<file path>', '<api endpoint>', options)
  //    .then((data) => {
  //      // success
  //    }, (err) => {
  //      // error
  //    })
  // }


  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  };

  constructor(public router: Router,
    private formBuilder: FormBuilder, private camera: Camera, private platform: Platform,
    private imagePicker: ImagePicker
    // private transfer: FileTransfer, private file: File
    ) {
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



    if (!isUndefined(this.imgSrc)) {

      // parseFile = new Parse.File('photo.jpg', { base64: this.imgData });

      parseFile = new Parse.File('photo.jpg', this.imgSrc);


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



  selectPicture() {

    let options = {
      // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
      // selection of a single image, the plugin will return it.
      maximumImagesCount: 1,

      // max width and height to allow the images to be.  Will keep aspect
      // ratio no matter what.  So if both are 800, the returned image
      // will be at most 800 pixels wide and 800 pixels tall.  If the width is
      // 800 and height 0 the image will be 800 pixels wide if the source
      // is at least that wide.
      width: 300,
      height: 300,

      // quality of resized image, defaults to 100
      quality: 100, // (0-100),

      // output type, defaults to FILE_URIs.
      // available options are 
      // window.imagePicker.OutputType.FILE_URI (0) or 
      // window.imagePicker.OutputType.BASE64_STRING (1)
      outputType: 0
    };

    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        // console.log('Image URI: ' + results[i]);            

        // const base64Image = 'data:image/jpeg;base64,' +  results[i];
        this.imgSrc = this.webview.convertFileSrc( results[i]);

        
      }
    }, (err) => { });

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
