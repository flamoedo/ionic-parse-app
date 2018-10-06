import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { parseSelectorToR3Selector } from '@angular/compiler/src/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

var Parse = require('parse');


var options: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.FILE_URI,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE
}


@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  infoForm: FormGroup;
  imgSrc;

  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  constructor(public router: Router,
    private formBuilder: FormBuilder, private camera: Camera) {
    this.infoForm = this.formBuilder.group({
      'player_name': [null, Validators.required],
      'player_score': [null, Validators.required]
    });
    this.imgSrc = "/assets/icons/icon-72x72.png";

  }


  ngOnInit() {
  }


  takePicture() {

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }




  onFileChange(event) {
    var fileUploadControl = event.target.files[0];
    if (fileUploadControl.size > 0) {
      var file = fileUploadControl;
      var name = "photo.jpg";
      var parseFile = new Parse.File(name, file);
    }
    parseFile.save().then(function () {
      // The file has been saved to Parse.
      console.log('arquivo salvo');

      var parseImage = new Parse.Object("Image");
      // parseImage.set("username", );
      parseImage.set("Image", parseFile);
      parseImage.save();
      this.imgSrc = parseFile.url();

    },

      function (error) {
        console.log(error.message);
        // The file either could not be read, or could not be saved to Parse.
      });


  }


  saveInfo() {

    const GameScore = Parse.Object.extend("GameScore");
    const gameScore = new GameScore();

    gameScore.set("score", this.infoForm.value.player_score);
    gameScore.set("playerName", this.infoForm.value.player_name);

    gameScore.save()
      .then((gameScore) => {
        // Execute any logic that should take place after the object is saved.
        this.router.navigate(['/detail/' + gameScore.id]);

      }, (error) => {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        alert('Failed to create new object, with error code: ' + error.message);
      });
  }

}
