import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoindataComponent } from './coindata/coindata.component';
import { CoinService } from 'app/coin.service';
import { HttpModule } from '@angular/http';
import { NgForm } from '@angular/forms'
import { FormsModule } from '@angular/forms';
import { UtilitiesService } from 'app/utilities.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    CoindataComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    FormsModule
  ],
  providers: [
    CoinService,
    UtilitiesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
