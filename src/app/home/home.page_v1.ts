import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { DataService, Message } from '../services/data.service';
import { AnimationController, GestureController, DomController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  font500: string = '14px';
  font400: string = '13px';
  font300: string = '12px';
  font200: string = '11px';

  position: number = 0;
  messages;
  preMessage: Message;
  currentMessage: Message;
  nextMessage: Message;
  numFlicks: number = 0;
  windowHeight = window.innerHeight;

  @ViewChild('CurrentFlick', { read: ElementRef }) currentFlick: ElementRef;
  @ViewChild('NextFlick', { read: ElementRef }) nextFlick: ElementRef;

  constructor(
    private data: DataService,
    private animationCtrl: AnimationController,
    private gestureCtrl: GestureController,
    private domCtrl: DomController,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.messages = this.data.getMessages();
    this.currentMessage = this.messages[this.position];
    this.nextMessage = this.messages[this.position + 1];
  }

  async ngAfterViewInit() {
    await this.domCtrl.read(() => {
      this.currentFlick.nativeElement.childNodes[0].style.fontSize = this.font500;
      this.nextFlick.nativeElement.childNodes[0].style.fontSize = this.font500;
      this.setupGesture();
      // console.log('In ngAfterViewInit!');
    });
  }

  setupGesture() {
    const minDelta: number = 30;
    const triggerDelta: number = 150;
    // console.log('Setting up Gesture!');

    let nextElement = this.nextFlick.nativeElement.childNodes[0];
    let currentElement = this.currentFlick.nativeElement.childNodes[0];

    const currentFlickGesture = this.gestureCtrl.create({
      el: currentElement,
      threshold: 15,
      direction: 'y',
      gestureName: 'slide',
      onMove: ev => {
        let currentY = ev.deltaY;

        if ((this.numFlicks === this.currentMessage.maxFlicks && currentY < minDelta * -1) ||
          (this.numFlicks === 0 && currentY > minDelta)) {
          // console.log('moving to next slide', currentY);
          // console.log('moving to next slide ----------- Current');

          this.domCtrl.write(() => {
            currentElement.style.fontSize = this.font200;
            // console.log('moving to next slide -- next');
          });
        }
      },
      onEnd: ev => {
        let deltaY = ev.deltaY;
        currentElement.style.fontSize = this.font500;
        nextElement.style.fontSize = this.font500;

        if (this.numFlicks === this.currentMessage.maxFlicks) {
          if (deltaY < triggerDelta * -1) {
            // console.log('should get the next flick in view');

            this.numFlicks = 0;

            // const flickUpAnimation = this.animationCtrl.create('flick-up-animation')
            //   .addElement(currentElement)
            //   .fromTo('transform', `translateY(${deltaY}px)`, `translateY(${(this.windowHeight + deltaY) * -1}px)`);

            const showUpAnimation = this.animationCtrl.create('show-up-animation')
              .addElement(nextElement)
              .fromTo('transform', `translateY(0px)`, `translateY(${(this.windowHeight) * -1}px)`);

            const parent1 = this.animationCtrl.create('parent1')
              .duration(300)
              .easing('ease-in')
              .iterations(1)
              // .direction('alternate')
              .addAnimation([showUpAnimation]);

            parent1.play();
            parent1.onFinish(async () => {
              this.ngZone.run(() => {
                this.position += 1;
                this.nextMessage = this.messages[this.position];
                currentElement.style.fontSize = this.font500;
                nextElement.style.fontSize = this.font500;
              });
              console.log('Current Animation finished!');
            });

          } else if (deltaY > minDelta) {
            this.numFlicks -= 1;
            console.log('prev slide');
          } else {
            currentElement.style.transform = '';
            console.log('move back');
          }

        }
        else if (this.numFlicks === 0 && deltaY > minDelta) {
          if (this.position === 0) {
            console.log('should get the previous flick but none available');
          } else {
            console.log('should get the previous flick in view');

            const slideDownAnimation = this.animationCtrl.create('show-up-animation')
              .addElement(nextElement)
              .fromTo('transform', `translateY(${(this.windowHeight + deltaY) * -1}px)`, `translateY(${(this.windowHeight) * -1}px)`);

            const parentSlideDownAnimation = this.animationCtrl.create('parent1')
              .duration(300)
              .easing('ease-in')
              .iterations(1)
              // .direction('alternate')
              .addAnimation([slideDownAnimation]);

            parentSlideDownAnimation.play();
            parentSlideDownAnimation.onFinish(async () => {
              this.ngZone.run(() => {
                this.position -= 1;
                this.currentMessage = this.messages[this.position];
                this.numFlicks = this.messages[this.position].maxFlicks;
                currentElement.style.fontSize = this.font500;
                nextElement.style.fontSize = this.font500;
              })
            });

          }
        }
        else if (deltaY < minDelta * -1) {
          this.numFlicks += 1;
          console.log('next slide');
        }
        else if (deltaY > minDelta) {
          this.numFlicks -= 1;
          console.log('prev slide');
        }

        console.log(ev.deltaY);
        console.log(this.numFlicks);
      }
    }, true);

    currentFlickGesture.enable(true);

    // }

    // Set gesture on the next button
    // Set gesture on the next button
    // Set gesture on the next button
    // Set gesture on the next button

    const nextFlickGesture = this.gestureCtrl.create({
      el: nextElement,
      threshold: 15,
      direction: 'y',
      gestureName: 'slide',
      onMove: ev => {
        const currentY = ev.deltaY;
        if ((this.numFlicks === this.nextMessage.maxFlicks && currentY < minDelta * -1) ||
          (this.numFlicks === 0 && currentY > minDelta)) {
          this.domCtrl.write(() => {
            nextElement.style.fontSize = this.font200;
            console.log('moving to next slide -- next');
          });
        }
      },
      onEnd: ev => {
        let deltaY = ev.deltaY;
        nextElement.style.fontSize = this.font500;

        if (this.numFlicks === this.nextMessage.maxFlicks) {
          if (deltaY < triggerDelta * -1) {
            console.log('should get the next flick in view');

            this.numFlicks = 0;

            const flickUpAnimation2 = this.animationCtrl.create('flick-up-animation2')
              .addElement(nextElement)
              .fromTo('transform', `translateY(${deltaY}px)`, `translateY(${(this.windowHeight) * -1}px)`);

            // const showUpAnimation2 = this.animationCtrl.create('show-up-animation2')
            //   .addElement(currentElement)
            //   .keyframes([
            //     { offset: 0, transform: `translateY(${(this.windowHeight) - 50}px)` },
            //     { offset: 0.5, transform: `translateY(${(this.windowHeight) - 150}px)` },
            //     { offset: 0.8, transform: `translateY(${(this.windowHeight) - 250}px)` },
            //     { offset: 1, transform: `translateY(${(this.windowHeight) * -1}px)` }
            //   ]);

            const parent2 = this.animationCtrl.create('parent2')
              .duration(300)
              .easing('ease-in')
              .iterations(1)
              // .direction('alternate')
              .addAnimation([flickUpAnimation2]);

            parent2.play();
            parent2.onFinish(async () => {
              this.ngZone.run(() => {
                this.position += 1;
                this.nextMessage = this.messages[this.position];
                nextElement.style.fontSize = this.font500;
                currentElement.style.fontSize = this.font500;
              });

              console.log('Next Animation finished!');
            });

          } else if (deltaY > minDelta) {
            this.numFlicks -= 1;
            console.log('prev slide');
          } else {
            nextElement.style.transform = '';
            console.log('move back');
          }

        }
        else if (this.numFlicks === 0 && deltaY > minDelta) {
          if (this.position === 0) {
            console.log('should get the previous flick but none available');
          } else {
            console.log('should get the previous flick in view');

            const slideDownAnimation = this.animationCtrl.create('show-up-animation')
              .addElement(nextElement)
              .fromTo('transform', `translateY(${(this.windowHeight + deltaY) * -1}px)`, `translateY(${(this.windowHeight) * -1}px)`);

            const parentSlideDownAnimation = this.animationCtrl.create('parent1')
              .duration(300)
              .easing('ease-in')
              .iterations(1)
              // .direction('alternate')
              .addAnimation([slideDownAnimation]);

            parentSlideDownAnimation.play();
            parentSlideDownAnimation.onFinish(async () => {
              this.ngZone.run(() => {
                this.position -= 1;
                this.nextMessage = this.messages[this.position];
                this.numFlicks = this.messages[this.position].maxFlicks;
                currentElement.style.fontSize = this.font500;
                nextElement.style.fontSize = this.font500;
              })
            });
          }
        }
        else if (deltaY < minDelta * -1) {
          this.numFlicks += 1;
          console.log('next slide');
        }
        else if (deltaY > minDelta) {
          this.numFlicks -= 1;
          console.log('prev slide');
        }

        console.log(ev.deltaY);
        console.log(this.numFlicks);
      }
    }, true);

    nextFlickGesture.enable(true);

  }

  // }
}