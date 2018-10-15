import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
var Parse = require('parse');

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  editForm: FormGroup;
  score
  playerName
  id
  gameScore

  constructor(public router: Router, private route: ActivatedRoute,
    private formBuilder: FormBuilder, public alertController: AlertController) {
    this.editForm = this.formBuilder.group({
      'player_name': [null, Validators.required],
      'player_score': [null, Validators.required]
    });
    this.initial_query(this.route.snapshot.paramMap.get('key'));

  }

  ngOnInit() {
  }

  initial_query(key) {
    var GameScore = Parse.Object.extend("GameScore");
    var query = new Parse.Query(GameScore);
    query.get(key)
      .then((gameScore) => {
        // The object was retrieved successfully.
        this.editForm.controls['player_name'].setValue(gameScore.get("playerName"));
        this.editForm.controls['player_score'].setValue(gameScore.get("score"));
        this.id = gameScore.id;
        this.gameScore = gameScore;
      }, (error) => {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
        this.presentAlert("Error:", error.code, error.message);
      });

  }


  updateScore() {

    // var GameScore = Parse.Object.extend("GameScore");
    // var query = new Parse.Query(GameScore);
    // query.get(this.id)
    //   .then((gameScore) => {
    // The object was retrieved successfully.
    this.gameScore.set("score", this.editForm.value.player_score);
    this.gameScore.set("playerName", this.editForm.value.player_name);
    this.gameScore.save().then(() => {
      this.router.navigate(['']);
    }, (error) => {
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and message. 

      if (error.code == Parse.Error.OBJECT_NOT_FOUND)
        this.presentAlert('Error:', error.code, 'No authorization to change this comment');

      else
        this.presentAlert('Error:', error.code, error.message);

    });

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
