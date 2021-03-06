import { Component, OnInit } from '@angular/core';
import { CoinService } from '../coin.service';
import { UtilitiesService } from 'app/utilities.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-coindata',
  templateUrl: './coindata.component.html',
  styleUrls: ['./coindata.component.css']
})

export class CoindataComponent implements OnInit {
  getExchange1Subscriptions: Subscription;
  getExchange2Subscriptions: Subscription;
  exchanges = this.CoinService.exchanges.sort();
  cheaper: any;
  volume: any;
  firstExchange: any;
  firstExchangeData: any = {};
  secondExchangeData: any = {};
  secondExchange: any;
  message1: any = {
    PRICE: 'Socket Offline',
    LASTMARKET: 'Socket Offline'
  };
  currentPrice: any = {};
  price1: any;
  price2: any;

  constructor(
    private http: HttpClient,
    private CoinService: CoinService,
    private utilitiesService: UtilitiesService
  ) {
    this.firstExchangeData.DISPLAY = {
      PRICE: '',
      LASTUPDATE: 'N/A'
    }
    this.firstExchangeData.RAW = {
      PRICE: '',
      LASTUPDATE: 'N/A'
    }
    this.secondExchangeData.DISPLAY = {
      PRICE: '',
      LASTUPDATE: 'N/A'
    }
    this.secondExchangeData.RAW = {
      PRICE: '',
      LASTUPDATE: 'N/A'
    }
  }
  ngOnInit() {

    this.utilitiesService.buildData();
    this.firstExchange = this.CoinService.exchanges[0];
    this.secondExchange = this.CoinService.exchanges[1];
    this.CoinService.socketReceive().subscribe(message => {
      this.message1 = message;
      const messageType = message.substring(0, message.indexOf('~'));
      let res = {};
      if (messageType === this.utilitiesService.STATIC.TYPE.CURRENTAGG) {
        res = this.utilitiesService.unpackCurrent(message);
        this.dataUnpack(res);
      }
    })
    this.getExchange1Data(this.CoinService.exchanges[0])
    this.getExchange2Data(this.CoinService.exchanges[1])
  }
  onChange1(exchange) {
    this.getExchange1Data(exchange)
  }
  onChange2(exchange) {
    this.getExchange2Data(exchange)
  }
  getExchange1Data(exchange) {
    this.getExchange1Subscriptions = this.http.get('https://min-api.cryptocompare.com/data/generateAvg?fsym=ETH&tsym=USD&e=' + exchange).subscribe(data => {
      this.firstExchangeData = data;
      this.getCheaperPrice();
      this.getTradeVolume()
    }, err => {
      alert('Unable to get data for this exchange');
    });
  }
  getExchange2Data(exchange) {
    this.getExchange2Subscriptions = this.http.get('https://min-api.cryptocompare.com/data/generateAvg?fsym=ETH&tsym=USD&e=' + exchange).subscribe(data => {
      this.secondExchangeData = data;
      this.getCheaperPrice()
      this.getTradeVolume()
    }, err => {
      alert('Unable to get data for this exchange');
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
    const from = data['FROMSYMBOL'];
    const to = data['TOSYMBOL'];
    const fsym = this.utilitiesService.getStaticCurrencySymbol(from);
    const tsym = this.utilitiesService.getStaticCurrencySymbol(to);
    const pair = from + to;
    if (!this.currentPrice.hasOwnProperty(pair)) {
      this.currentPrice[pair] = {};
    }
    for (const key in data) {
      this.currentPrice[pair][key] = data[key];
    }
    if (this.currentPrice[pair]['LASTTRADEID']) {
      this.currentPrice[pair]['LASTTRADEID'] = parseInt(this.currentPrice[pair]['LASTTRADEID']).toFixed(0);
    }
    this.currentPrice[pair]['CHANGE24HOUR'] = this.utilitiesService.convertValueToDisplay(tsym, (this.currentPrice[pair]['PRICE'] - this.currentPrice[pair]['OPEN24HOUR']));
    this.currentPrice[pair]['CHANGE24HOURPCT'] = ((this.currentPrice[pair]['PRICE'] - this.currentPrice[pair]['OPEN24HOUR']) / this.currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + '%';;
    // console.log('FINAL', this.currentPrice[pair], from, tsym, fsym);
    this.message1 = this.currentPrice[pair];
  };
}
