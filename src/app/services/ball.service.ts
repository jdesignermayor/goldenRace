import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BallService {

  ballsSelect: Array<any> = [];

  constructor() { }

  private ballInfoSource = new Subject<any>();
  ballInfo$ = this.ballInfoSource.asObservable();

  getSelectedBalls(data: any) {
    try {
      this.ballInfoSource.next(data);
    } catch (error) {
      alert("Some error detected, please try again!");
    }
  }

}
