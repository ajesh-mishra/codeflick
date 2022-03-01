import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HomePage } from './home.page';
// import { SharedModule } from './shared.module';
import { PrismComponent } from './prism/prism.component';
import { HomePageRoutingModule } from './home-routing.module';
import { MessageComponentModule } from '../message/message.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageComponentModule,
    HomePageRoutingModule,
    HttpClientModule,
    // SharedModule
  ],
  declarations: [HomePage, PrismComponent]
})
export class HomePageModule {}
