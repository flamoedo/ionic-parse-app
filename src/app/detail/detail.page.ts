import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
      }, (error) => {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
      });

  }

  ngOnInit() {
  }

}
