import { Component } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { isUndefined } from 'util';

var Parse = require('parse');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  GameScore
  query
  results
  scores = []

  constructor(public router: Router, public alertController: AlertController,
    public MenuController: MenuController) {

    this.GameScore = Parse.Object.extend("GameScore");
    this.query = new Parse.Query(this.GameScore);
    this.query.limit(100);
    this.initial_query();
    // this.list.closeSlidingItems();

  }

  openMenu(){

    this.MenuController.open('start');

  }

  ionViewWillEnter() {

    this.initial_query();

  }

  refresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
    this.initial_query();
  }

  clearList() {

    this.scores = [];

    //   while(this.results > 0) {
    //     this.results.pop();
    // }

  }

  async initial_query() {
    await this.query.find().then(
      results => {
        let scores = []
        for (let i = 0; i < results.length; i++) {
          let object = results[i];
          isUndefined
          scores.push(object);
        }
        this.scores = scores;
      }
    )
  }

  async delete(score) {

    let page = this;
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure want to delete this info?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'tertiary',
          handler: (blah) => {
            console.log('cancel');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.query.get(score.id)
              .then((myObject) => {
                myObject.destroy();
                page.initial_query();


                // let i = this.scores.indexOf(score);
                // this.scores.splice(i, 1);
              }, (error) => {
                // The delete failed.
                // error is a Parse.Error with an error code and message.
              });
          }
        }
      ]
    });

    await alert.present();
  }

  edit(key, list) {
    console.log(list)
    list.closeOpened();
    this.router.navigate(['/edit/' + key]);
  }

}


