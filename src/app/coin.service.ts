import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class CoinService {
  public result: any;
  socket = io("https://streamer.cryptocompare.com/")
  exchanges = ['BitBay', 'BitTrex', 'Bitfinex', 'Bitstamp', 'CCEX', 'Cexio', 'Coinbase', 'Coinroom', 'Cryptsy', 'Exmo', 'Gatecoin', 'Gemini', 'HitBTC', 'Kraken', 'LiveCoin', 'Lykke', 'OKCoin', 'Poloniex', 'Quoine', 'Remitano', 'WavesDEX', 'Yobit']
  constructor(private _http: Http) { }

  socketReceive() {
    return Observable.create(observer => {
      this.socket.emit('SubAdd', { subs: ['5~CCCAGG~ETH~USD'] });
      this.socket.on("m", (message) => {
        observer.next(message)
      })
    });

  }
}
