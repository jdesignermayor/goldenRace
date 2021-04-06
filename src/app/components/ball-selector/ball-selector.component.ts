import { BallService } from '../../services/ball.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ball-selector',
  templateUrl: './ball-selector.component.html',
  styleUrls: ['./ball-selector.component.scss']
})
export class BallSelectorComponent implements OnInit {

  balls: Array<any> = [];
  subscription: Subscription | undefined;
  currencyCode: String = "";
  gameResult: any;
  gameResultTotalandProfit: number = 0;

  constructor(private ballService: BallService) {
  }

  addBall = (data: any) => {
    const { id } = data;

    this.balls.forEach(element => {
      if (element.id == id) {
        element.disabled = true;
      }
    });

    this.ballService.setSelectedBalls(data);
  }

  ngOnInit(): void {
    for (let index = 1; index <= 10; index++) {
      this.balls.push({
        id: index,
        title: index,
        class: `ball-${index}`,
        disabled: false,
      })
    }

    this.currencyCode = this.ballService.currencyCode;

    this.subscription = this.ballService.resultInfo$.subscribe(
      info => {
        this.gameResult = info;
      });
  }
}
