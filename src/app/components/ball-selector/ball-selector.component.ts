import { BallService } from '../../services/ball.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ball-selector',
  templateUrl: './ball-selector.component.html',
  styleUrls: ['./ball-selector.component.scss']
})
export class BallSelectorComponent implements OnInit {

  balls: Array<any> = [];

  constructor(private ballService: BallService) {
  }

  addBall = (data: any) => {
    const { id } = data;

    this.balls.forEach(element => {
      if (element.id == id) {
        element.disabled = true;
      }
    });

    this.ballService.getSelectedBalls(data);
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
  }
}
