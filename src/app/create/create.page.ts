import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { isUndefined } from 'util';
import { Platform, LoadingController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { Crop } from '@ionic-native/crop/ngx';

const Parse = require('parse');

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
  imgUri;
  sourceType;
  usePicture: boolean;
  loadingElement;

  options: CameraOptions = {
    quality: 100,
    targetWidth: 1280,
    targetHeight: 1280,
    allowEdit: true,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    sourceType: this.sourceType
  };

  constructor(public router: Router,
    private formBuilder: FormBuilder, private camera: Camera, private platform: Platform,
    private imagePicker: ImagePicker, private crop: Crop, private loadingController: LoadingController
  ) {
    this.infoForm = this.formBuilder.group({
      'player_name': [null, Validators.required],
      'player_score': [null, Validators.required]
    });

    var avatarNum = Math.floor(Math.random() * (9 - 1)) + 1;

    this.imgSrc = '/assets/icons/avatar_' + avatarNum + '.png'

    this.usePicture = false;

    this.sourceType = 0;

  }


  ngOnInit() {
  }


  async presentLoadingWithOptions() {

    this.loadingElement = await this.loadingController.create(
      {
        spinner: 'lines',
        duration: 50000,
        translucent: true
      }
    );
    return await this.loadingElement.present();

  }

  async dismissLoading() {

    return await this.loadingElement.dismiss();

  }

  takePicture() {

    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):     

      this.imgUri = imageData;
      this.imgSrc = this.webview.convertFileSrc(imageData);

      this.usePicture = true;

    }, (err) => {
      // Handle error
    });
  }

  cropImage() {

    let page = this;

    this.crop.crop(this.imgUri)
      .then(
        newImage => {
          console.log('new image path is: ' + newImage)

          this.imgUri = newImage.split('?')[0];
          this.imgSrc = this.webview.convertFileSrc(newImage);
          this.usePicture = true;
        }
        ,
        error => console.error('Error cropping image', error)
      );

  }

  saveInfo() {

    const GameScore = Parse.Object.extend('GameScore');
    const gameScore = new GameScore();

    gameScore.set('score', this.infoForm.value.player_score);
    gameScore.set('playerName', this.infoForm.value.player_name);

    let objCreatePage = this;


    let postACL = new Parse.ACL(Parse.User.current());
    postACL.setPublicReadAccess(true);
    gameScore.setACL(postACL);

    let loadcontrol;


    if (this.usePicture) {

      loadcontrol = this.presentLoadingWithOptions();

      this.saveImage(this.imgUri).then(parseFile => {

        gameScore.set('Image', parseFile);

        gameScore.save()
          .then(() => {
            // Execute any logic that should take place after the object is saved.
            objCreatePage.dismissLoading();
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
      loadcontrol = this.presentLoadingWithOptions();

      gameScore.set('avatar', this.imgSrc);

      gameScore.save()
        .then(() => {
          // Execute any logic that should take place after the object is saved.
          this.dismissLoading();
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
      width: 1280,
      height: 1280,

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
        this.imgUri = results[i];
        this.imgSrc = this.webview.convertFileSrc(results[i]);
        this.usePicture = true;


      } //aqui

    }, (err) => { });

  }


  saveImage = function (imgUri) {
    return new Promise((resolve, reject) => {

      //nome do arquivo:
      let fName = imgUri.split('/').pop()

      //path    
      let path = imgUri.substring(0, this.imgUri.lastIndexOf('/') + 1)


      let file = new File();

      file.readAsArrayBuffer(path, fName).then((res) => {

        var byteArray = new Uint8Array(res);
        var output = new Array(byteArray.length);
        var i = 0;
        var n = output.length;
        while (i < n) {
          output[i] = byteArray[i];
          i++;
        }

        let parseFile = new Parse.File('photo.jpg', output);

        parseFile.save().then(function () {

          resolve(parseFile);
        },

          function (error) {
            console.log(error.message);
            // The file either could not be read, or could not be saved to Parse.
          });

      })



    });
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
