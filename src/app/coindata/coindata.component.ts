import { Component, OnInit } from '@angular/core';
import { CoinService } from '../coin.service';
import * as io from 'socket.io-client';
import { UtilitiesService } from 'app/utilities.service';


@Component({
  selector: 'app-coindata',
  templateUrl: './coindata.component.html',
  styleUrls: ['./coindata.component.css']
})

export class CoindataComponent implements OnInit {
  socket = io("https://streamer.cryptocompare.com/")  
  exchanges = this.CoinService.exchanges.sort();
  firstExchange: any;
  secondExchange: any;
  message1: any;
  currentPrice:any = {};

  constructor(
    private CoinService: CoinService,
    private utilitiesService: UtilitiesService
  ) { }
  ngOnInit() {
    this.utilitiesService.buildData();
    this.firstExchange = this.CoinService.exchanges[0];
    this.secondExchange = this.CoinService.exchanges[1];
    // this.CoinService.socketRecieve('CCCAGG')    
  }
  onChange1(exchange) {
    console.log("changed firstExchange", exchange)
    this.CoinService.socketRecieve(exchange).subscribe(message=>{
      this.message1 = message;
      var messageType = message.substring(0, message.indexOf("~"));
      var res = {};
      if (messageType == this.utilitiesService.STATIC.TYPE.CURRENTAGG) {
        console.log('BEFORE', message)
        res = this.utilitiesService.unpackCurrent(message);
        console.log(res)
        this.dataUnpack(res);
      }
    })    
}
  onChange2(exchange) {
    console.log("changed firstExchange", exchange)
}

dataUnpack(data) {
  var from = data['FROMSYMBOL'];
  var to = data['TOSYMBOL'];
  var fsym = this.utilitiesService.getStaticCurrencySymbol(from);
  var tsym = this.utilitiesService.getStaticCurrencySymbol(to);
  var pair = from + to;
  console.log(data);

  if (!this.currentPrice.hasOwnProperty(pair)) {
    this.currentPrice[pair] = {};
  }

  for (var key in data) {
    this.currentPrice[pair][key] = data[key];
  }

  if (this.currentPrice[pair]['LASTTRADEID']) {
    this.currentPrice[pair]['LASTTRADEID'] = parseInt(this.currentPrice[pair]['LASTTRADEID']).toFixed(0);
  }
  this.currentPrice[pair]['CHANGE24HOUR'] = this.utilitiesService.convertValueToDisplay(tsym, (this.currentPrice[pair]['PRICE'] - this.currentPrice[pair]['OPEN24HOUR']));
  this.currentPrice[pair]['CHANGE24HOURPCT'] = ((this.currentPrice[pair]['PRICE'] - this.currentPrice[pair]['OPEN24HOUR']) / this.currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%";;
  console.log('FINAL', this.currentPrice[pair], from, tsym, fsym);
};



}
