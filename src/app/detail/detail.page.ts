import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isUndefined } from 'util';
const Parse = require('parse');


@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  id
  score
  playerName
  imageUrl

  constructor(private route: ActivatedRoute,
    public router: Router) {
    this.initial_query(this.route.snapshot.paramMap.get('key'));
  }


  initial_query(key) {
    var GameScore = Parse.Object.extend("GameScore");
    var query = new Parse.Query(GameScore);
    query.get(key)
      .then((gameScore) => {
        // The object was retrieved successfully.
        this.score = gameScore.get("score");
        this.playerName = gameScore.get("playerName");
        this.id = gameScore.id;

        if (!isUndefined(  gameScore.get("Image")))
        this.imageUrl = gameScore.get("Image").url();
        else
        this.imageUrl = gameScore.get("avatar");

      }, (error) => {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
      });

  }

  ngOnInit() {
  }

}
