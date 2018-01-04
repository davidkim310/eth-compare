import { Component, OnInit } from '@angular/core';
import { CoinService } from '../coin.service';
import { UtilitiesService } from 'app/utilities.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-coindata',
  templateUrl: './coindata.component.html',
  styleUrls: ['./coindata.component.css']
})

export class CoindataComponent implements OnInit {
  exchanges = this.CoinService.exchanges.sort();
  cheaper: any;
  volume: any;
  firstExchange: any;
  firstExchangeData: any = {
    PRICE: '',
    LASTUPDATE: null
  }
  secondExchange: any;
  secondExchangeData: any = {
    PRICE: '',
    LASTUPDATE: null
  }
  message1: any = {
    PRICE: '0',
    LASTMARKET: "N/A"
  };
  currentPrice: any = {};
  price1: any;
  price2: any;

  constructor(
    private http: HttpClient,
    private CoinService: CoinService,
    private utilitiesService: UtilitiesService
  ) { }
  ngOnInit() {

    this.utilitiesService.buildData();
    this.firstExchange = this.CoinService.exchanges[0];
    this.secondExchange = this.CoinService.exchanges[1];
    this.CoinService.socketReceive().subscribe(message => {
      this.message1 = message;
      var messageType = message.substring(0, message.indexOf("~"));
      var res = {};
      if (messageType == this.utilitiesService.STATIC.TYPE.CURRENTAGG) {
        // console.log('BEFORE', message)
        res = this.utilitiesService.unpackCurrent(message);
        // console.log(res)
        this.dataUnpack(res);
      }
    })
    this.getExchange1Data(this.CoinService.exchanges[0])
    this.getExchange2Data(this.CoinService.exchanges[1])
  }
  onChange1(exchange) {
    // console.log("changed firstExchange", exchange)
    this.getExchange1Data(exchange)
  }
  onChange2(exchange) {
    // console.log("changed secondExchange", exchange)
    this.getExchange2Data(exchange)
  }
  getExchange1Data(exchange) {
    this.http.get('https://min-api.cryptocompare.com/data/generateAvg?fsym=ETH&tsym=USD&e=' + exchange).subscribe(data => {
      // console.log("data from api ex1", exchange, data);
      this.firstExchangeData = data;
      this.getCheaperPrice();
      this.getTradeVolume()
    });
  }
  getExchange2Data(exchange) {
    this.http.get('https://min-api.cryptocompare.com/data/generateAvg?fsym=ETH&tsym=USD&e=' + exchange).subscribe(data => {
      console.log("data from api ex2", data);
      this.secondExchangeData = data;
      this.getCheaperPrice()
      this.getTradeVolume()
    });
  }
  getCheaperPrice() {
    if (this.firstExchangeData.RAW.PRICE > this.secondExchangeData.RAW.PRICE) {
      this.cheaper = this.secondExchangeData.DISPLAY.LASTMARKET;
    } else {
      this.cheaper = this.firstExchangeData.DISPLAY.LASTMARKET;
    }
  }
  getTradeVolume() {
    if (this.firstExchangeData.RAW.VOLUME24HOUR < this.secondExchangeData.RAW.VOLUME24HOUR) {
      this.volume = this.secondExchangeData.DISPLAY.LASTMARKET;
    } else {
      this.volume = this.firstExchangeData.DISPLAY.LASTMARKET;
    }
  }

  dataUnpack(data) {
    var from = data['FROMSYMBOL'];
    var to = data['TOSYMBOL'];
    var fsym = this.utilitiesService.getStaticCurrencySymbol(from);
    var tsym = this.utilitiesService.getStaticCurrencySymbol(to);
    var pair = from + to;
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
    // console.log('FINAL', this.currentPrice[pair], from, tsym, fsym);
    this.message1 = this.currentPrice[pair];
  };
}
