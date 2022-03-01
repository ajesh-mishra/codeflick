import { Component, OnInit, AfterViewInit, QueryList, ViewChildren, ElementRef, NgZone } from '@angular/core';
import { DataService, Message } from '../services/data.service';
import { AnimationController, GestureController, DomController } from '@ionic/angular';
import { trigger, transition, animation, style, animate, useAnimation } from "@angular/animations";

export const scaleIn = animation([
  style({ opacity: 0 }), // start state
  animate(
    "{{time}} cubic-bezier(0.785, 0.135, 0.15, 0.86)",
    style({ opacity: 1 })
  )
]);

export const scaleOut = animation([
  style({ opacity: 1 }), // start state
  animate(
    "{{time}} cubic-bezier(0.785, 0.135, 0.15, 0.86)",
    style({ opacity: 0 })
  )
]);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger("fadeAnimation", [
      transition("void => *", [
        useAnimation(scaleIn, { params: { time: "500ms" } })
      ]),
      transition("* => void", [
        useAnimation(scaleOut, { params: { time: "500ms" } })
      ]),
    ]
    )
  ]
})
export class HomePage implements OnInit, AfterViewInit {
  // font500: string = '14px';
  // font400: string = '13px';
  // font300: string = '12px';
  // font200: string = '11px';

  // minDelta: number = 30;
  triggerDelta: number = 130;

  position: number = 1;
  messages;
  numFlicks: number = 0;
  // lineNumInFlick: number[];
  // windowHeight = window.innerHeight;
  windowHeight = 500;

  containerArray: ElementRef[];
  containerElement;
  previousElement;

  @ViewChildren('container', { read: ElementRef }) itemContainer: QueryList<ElementRef>;

  constructor(
    private data: DataService,
    private animationCtrl: AnimationController,
    private gestureCtrl: GestureController,
    private domCtrl: DomController,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.messages = this.data.getMessages();
    // this.lineNumInFlick = this.messages[this.messages.length - this.position].flickPositions[this.numFlicks].index;
    // console.log(this.lineNumInFlick);
  }

  async ngAfterViewInit() {
    await this.domCtrl.read(() => {
      this.setupGesture();
      console.log('In ngAfterViewInit!');
    });
  }

  setPosition() {
    if (this.position !== 0) {
      this.containerArray = this.itemContainer.toArray();
      this.previousElement = this.containerArray[this.containerArray.length - (this.position - 1)].nativeElement;
    }
    this.setupGesture();
  }

  setupGesture() {
    console.log('Setting up Gesture!');

    this.containerArray = this.itemContainer.toArray();
    this.containerElement = this.containerArray[this.containerArray.length - this.position].nativeElement;
    console.log('current max flicks:');
    console.log(this.messages[this.position - 1].maxFlicks);

    // console.log('Current Element');
    // console.log(this.containerElement);
    // console.log('Previous Element');
    // console.log(this.previousElement);

    const currentFlickGesture = this.gestureCtrl.create({
      el: this.containerElement,
      threshold: 15,
      direction: 'y',
      gestureName: 'slide',
      onMove: ev => {
        let currentY = ev.deltaY;

        if (currentY < 0 && this.messages[this.position - 1].maxFlicks === this.numFlicks) {
          this.domCtrl.write(() => {
            this.containerElement.style.transform = `translateY(${currentY}px)`;
            // console.log('moving up...', currentY);
          });
        }

        if (currentY > 0 && this.numFlicks === 0) {
          this.domCtrl.write(() => {
            this.previousElement.style.transform = `translateY(${currentY}px)`;
            // console.log('moving down...', currentY);
          });
        }
      },
      onEnd: ev => {
        let deltaY = ev.deltaY;
        let velocityY = ev.velocityY;

        console.log('ended', ev);

        if (-deltaY > this.triggerDelta || -velocityY > 1) {

          if (this.messages[this.position - 1].maxFlicks === this.numFlicks) {
            console.log('should move to the next slide!');

            const flickUpAnimation = this.animationCtrl.create('flick-up-animation')
              .addElement(this.containerElement)
              .fromTo('transform', `translateY(${deltaY}px)`, `translateY(${-this.windowHeight}px)`);

            const parent = this.animationCtrl.create('parent')
              .duration(400)
              .easing('ease-in')
              .iterations(1)
              .addAnimation([flickUpAnimation]);

            parent.play();
            parent.onFinish(async () => {
              this.ngZone.run(() => {
                if (this.position !== this.messages.length) this.position += 1;
                this.numFlicks = 0;
                // this.lineNumInFlick = this.messages[this.messages.length - this.position].flickPositions[this.numFlicks].index;
                this.setPosition();
              });
              // console.log(this.numFlicks);
              console.log('flickUp Animation finished!');
            });
          }

          setTimeout(() => {
            this.numFlicks += 1;
            // let temp = this.messages[this.messages.length - this.position].flickPositions[this.numFlicks].index;
            // this.lineNumInFlick.push(...temp);
            // Array.prototype.push.apply(this.lineNumInFlick, temp)
          }, 200);

        } else if (deltaY > this.triggerDelta || velocityY > 1) {


          if (this.numFlicks === 0) {
            console.log('should move to the previous slide!');

            const slideDownAnimation = this.animationCtrl.create('slide-down-animation')
              .addElement(this.previousElement)
              .fromTo('transform', `translateY(${-deltaY}px)`, `translateY(0px)`);

            const parent1 = this.animationCtrl.create('parent1')
              .duration(400)
              .easing('ease-in')
              .iterations(1)
              .addAnimation([slideDownAnimation]);

            parent1.play();
            parent1.onFinish(async () => {
              this.ngZone.run(() => {
                if (this.position !== 1) this.position -= 1;
                this.numFlicks = this.messages[this.position - 1].maxFlicks;
                // this.lineNumInFlick = this.messages[this.messages.length - this.position].flickPositions[this.numFlicks].index;

                this.previousElement.style.transform = '';
                this.previousElement.style.transform = `translateY(0px)`;
                this.setPosition();
              });
              // console.log(this.numFlicks);
              console.log('slideDown Animation finished!');
            });
          }
          if (this.numFlicks !== 0) this.numFlicks -= 1;
          // this.lineNumInFlick = this.messages[this.messages.length - this.position].flickPositions[this.numFlicks].index;

        }
        else {
          console.log('should go to original position');
          this.containerElement.style.transform = '';
        }
      }
    }, true);

    currentFlickGesture.enable(true);
  }

  // js_code: string = `
  // Prism.fileHighlight = function () {
  //   if (!logged) {
  //     console.warn('Prism.fileHighlight is deprecated. Use \`Prism.plugins.fileHighlight.highlight\` instead.');
  //     logged = true;
  //   }
  //   Prism.plugins.fileHighlight.highlight.apply(this, arguments);
  // };
  // `
}