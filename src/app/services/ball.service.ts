import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BallService {
  constructor() { }

  public currencyCode: string = "€";
  public profit: number = 1.5;

  private ballInfoSource = new Subject<any>();
  private resultInfoSource = new Subject<any>();

  ballInfo$ = this.ballInfoSource.asObservable();
  resultInfo$ = this.resultInfoSource.asObservable();

  checkRandomWinnerBall() {
    return Math.floor(Math.random() * 10) + 1;
  }

  setSelectedBalls(data: any) {
    try {
      this.ballInfoSource.next(data);
    } catch (error) {
      alert("Some error detected, please try again!");
    }
  }

  clearSelectedBalls() {
    this.ballInfoSource.next([]);
  }

  setResult(data: any) {
    this.resultInfoSource.next(data);
  }
}
