import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(public router: Router, private route: ActivatedRoute,
    private formBuilder: FormBuilder) {
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
      }, (error) => {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
      });

  }


  updateScore() {

    var GameScore = Parse.Object.extend("GameScore");
    var query = new Parse.Query(GameScore);
    query.get(this.id)
      .then((gameScore) => {
        // The object was retrieved successfully.
        gameScore.set("score", this.editForm.value.player_score);
        gameScore.set("playerName", this.editForm.value.player_name);
        gameScore.save()
        this.router.navigate(['']);


      }, (error) => {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
      });

  }

}
