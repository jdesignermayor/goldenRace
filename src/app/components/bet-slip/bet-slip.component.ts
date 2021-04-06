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

  enabledBetButtonAgain: boolean = false;
  enabledBetButtonBet: boolean = true;

  messageError: string = "";
  messageSuccess: string = "";

  amount: number = 0;
  totalAmount: number = 0;
  count: number = 0;

  currencyCode: String = "";

  constructor(private ballService: BallService) { }

  ngOnInit(): void {
    for (let index = 1; index <= 8; index++) {
      this.ballsChances.push({
        id: index,
        title: index,
        data: []
      })
    }
    this.currencyCode = this.ballService.currencyCode;
    this.subscription = this.ballService.ballInfo$.subscribe(
      info => {
        if (info.length === 0) {
          this.clearSelection();
        } else {
          this.ballsChances[this.count].data = info;
          this.ballsSelected.push(info.title)
          this.count++;
          if (this.totalAmount > 0) {
            this.disableBetButton = false;
          }else{
            this.disableBetButton = true;
          }
          this.messageError = "";
        }
      });
  }

  modifyAmount(): void {
    this.totalAmount = this.amount * this.count;
    if (this.totalAmount >= 5) {
      this.disableBetButton = false;
      this.messageError = "";
    } else {
      if (this.count === 0) {
        this.messageError = "Please pick your Ball."
      } else {
        this.messageError = "The minimum bet is 5 €";
      }
    }
  }

  checkObjectResult(winnerBall: number) {
    return new Promise<any>((resolve, reject) => {
      try {
        let gameResult = {
          state: 0,
          ballNumberWin: 0,
          betProfit: this.ballService.profit,
          user: {
            userBetAmount: 0,
            userBetAmountAndProfit: 0,
            userBetTotalAmount: 0,
            userBetTotalAmountAndProfit: 0,
            userBetBallWinNumber: 0,
            userBetBalls: {},
          }
        }

        if (winnerBall) {
          const winNumber = this.ballsSelected.find(element => element === winnerBall);
          if (winNumber) {
            gameResult.state = 1;
            gameResult.user.userBetBallWinNumber = winNumber;
          } else {
            gameResult.state = 2;
          }
          gameResult.ballNumberWin = winnerBall;
          gameResult.user.userBetAmount = this.amount;
          gameResult.user.userBetTotalAmount = this.totalAmount;
          gameResult.user.userBetBalls = this.ballsSelected;
          gameResult.user.userBetAmountAndProfit = ((gameResult.betProfit / 100) * this.totalAmount);
          gameResult.user.userBetTotalAmountAndProfit = gameResult.user.userBetAmountAndProfit + this.totalAmount;

          resolve(gameResult);
        }
      } catch (error) {
        reject(error);
      }
    })

  }

  betAmount(): void {
    if (this.count > 0) {
      const winnerBall = this.ballService.checkRandomWinnerBall();
      this.checkObjectResult(winnerBall).then((res) => {
        this.ballService.setResult(res);
        this.enabledBetButtonAgain = true;
        this.enabledBetButtonBet = false;
      })
    }
  }

  clearSelection(): void {
    this.ballsSelected = [];
    this.ballsChances.forEach(element => {
      element.data = [];
    });
    this.count = 0;
  }

  betAmountAgain(): void {
    let gameResult = {
      state: 0,
      ballNumberWin: 0,
      betProfit: this.ballService.profit,
      user: {
        userBetAmount: 0,
        userBetAmountAndProfit: 0,
        userBetTotalAmount: 0,
        userBetTotalAmountAndProfit: 0,
        userBetBallWinNumber: 0,
        userBetBalls: {},
      }
    }
    this.ballService.setResult(gameResult);
    this.enabledBetButtonAgain = false;
    this.enabledBetButtonBet = true;

    this.clearSelection();
    this.ballService.clearSelectedBalls();
    this.amount = 0;
    this.totalAmount = 0;
    this.disableBetButton = true;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
