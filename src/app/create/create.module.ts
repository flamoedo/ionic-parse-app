import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreatePage } from './create.page';

import { ReactiveFormsModule } from '@angular/forms';

import { ImagePicker } from '@ionic-native/image-picker/ngx';

import { Crop } from '@ionic-native/crop/ngx';


const routes: Routes = [
  {
    path: '',
    component: CreatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)    
  ],
  declarations: [CreatePage],
  providers: [ImagePicker, Crop]
})
export class CreatePageModule {}
