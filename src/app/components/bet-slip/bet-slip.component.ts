import { BallService } from '../../services/ball.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bet-slip',
  templateUrl: './bet-slip.component.html',
  styleUrls: ['./bet-slip.component.scss']
})


export class BetSlipComponent implements OnInit {

  ballsChances: Array<any> = [];
  ballsSelected: Array<any> = [];
  subscription: Subscription | undefined;
  disableBetButton: boolean = true;
  messageError: string = "";
  messageSuccess: string = "";
  amount: number = 0;
  totalAmount: number = 0;
  counter: number = 0;
  randomWinner: number = 0;
  winner: any = undefined;

  constructor(private ballService: BallService) {

  }

  ngOnInit(): void {
    for (let index = 1; index <= 8; index++) {
      this.ballsChances.push({
        id: index,
        title: index,
        data: []
      })
    }

    this.subscription = this.ballService.ballInfo$.subscribe(
      info => {
        this.ballsChances[this.counter].data = info;
        this.ballsSelected.push(info.title)
        this.counter++;
      });
  }

  modifyAmount(): void {
    this.totalAmount = this.amount * this.counter;
    if (this.totalAmount >= 5) {
      this.disableBetButton = false;
      this.messageError = "";
    } else {
      if (this.counter === 0) {
        this.messageError = this.messageError + "Please pick your Ball."
      } else {
        this.messageError = "the Minimum bet is 5 €";
      }
    }
  }

  cheackRandomWinnerBall() {
    return Math.floor(Math.random() * 10) + 1;
  }

  betAmount(): void {
    this.messageSuccess = "Betting...";
    this.randomWinner = this.cheackRandomWinnerBall();
    if (this.randomWinner) {
      const found = this.ballsSelected.find(element => element === this.randomWinner);
      if (found) {
        this.winner = true;
        alert("you won with: " + found)
      } else {
        alert("you lost, the winner is:" + this.randomWinner)
      }
    }
  }

  ngOnDestroy() {
    // Unsubscribe an observable to prevent memory leak when component destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
