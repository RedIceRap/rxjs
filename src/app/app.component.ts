import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  concatMap,
  exhaustMap,
  map,
  mergeMap,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject<void>();
  switchMap$: Subject<string> = new Subject<string>();
  exhaustMap$: Subject<string> = new Subject<string>();
  mergeMap$: Subject<string> = new Subject<string>();
  concatMap$: Subject<string> = new Subject<string>();
  combo$: Subject<string> = new Subject<string>();
  comboNested$: Subject<string> = new Subject<string>();

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.switchMap();
    this.exhaustMap();
    this.mergeMap();
    this.concatMap();
    this.combinationMaps();
    this.combinationMapsNested();
  }

  ngOnDestroy(): void {}

  // USE CASE: when a user starts typing a word and should see auto-completion while he types
  switchMap() {
    this.switchMap$
      .pipe(
        map((click) => {
          console.log(`Triggered ${click} Request...`);
          return click;
        }),
        switchMap((click) =>
          this.appService
            .getRequest(`Received ${click} Response!`, 1000)
            .pipe(map((result) => [click, result]))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(console.log, console.error, () => `switchMap completed!`);
  }

  // USE CASE: when a user clicks the login button it prevents additional request spams
  exhaustMap() {
    this.exhaustMap$
      .pipe(
        map((click) => {
          console.log(`Triggered ${click} Request...`);
          return click;
        }),
        exhaustMap((click) =>
          this.appService
            .getRequest(`Received ${click} Response!`, 1000)
            .pipe(map((result) => [click, result]))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(console.log, console.error, () => `exhaustMap completed!`);
  }

  mergeMap() {
    this.mergeMap$
      .pipe(
        map((click) => {
          console.log(`Triggered ${click} Request...`);
          return click;
        }),
        mergeMap((click) =>
          this.appService
            .getRequest(`Received ${click} Response!`, 1000)
            .pipe(map((result) => [click, result]))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(console.log, console.error, () => `mergeMap completed!`);
  }

  // USE CASE: when requests depend on each other's repsonse
  concatMap() {
    this.concatMap$
      .pipe(
        map((click) => {
          console.log(`Triggered ${click} Request...`);
          return click;
        }),
        concatMap((click) => {
          return this.appService
            .getRequest(`Received ${click} Response!`, 1000)
            .pipe(map((result) => [click, result]));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(console.log, console.error, () => `concatMap completed!`);
  }

  // nesting not needed if you just need info from previous resposne in next reuqest
  combinationMaps() {
    this.combo$
      .pipe(
        switchMap((click) => {
          click = 'switchMap';
          console.log(`${click} started...`);
          return this.appService.getRequest(
            `Received ${click} Response!`,
            1000
          );
        }),
        mergeMap((click: any) => {
          click = 'mergeMap 1';
          console.log(`${click} started...`);
          return this.appService.getRequest(
            `Received ${click} Response!`,
            1000
          );
        }),
        mergeMap((click: any) => {
          click = 'mergeMap 2';
          console.log(`${click} started...`);
          return this.appService.getRequest(
            `Received ${click} Response!`,
            2000
          );
        }),
        mergeMap((click: any) => {
          click = 'mergeMap 3';
          console.log(`${click} started...`);
          return this.appService.getRequest(
            `Received ${click} Response!`,
            3000
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(console.log, console.error, () => `completed!`);
  }

  // nesting necessary if you need info of combination of responses
  combinationMapsNested() {
    this.comboNested$
      .pipe(
        map((comboVal) => [comboVal]),
        switchMap((val: string[]) => {
          val = ['switchMap'];
          console.log(`${val[val.length - 1]} started...`);
          return this.appService.getRequest(val, 1000).pipe(
            mergeMap((val: string[]) => {
              val = [...val, 'mergeMap 1'];
              console.log(`${val[val.length - 1]} started...`);
              return this.appService.getRequest(val, 1000).pipe(
                mergeMap((val: string[]) => {
                  val = [...val, 'mergeMap 2'];
                  console.log(`${val[val.length - 1]} started...`);
                  return this.appService.getRequest(val, 2000).pipe(
                    mergeMap((val: string[]) => {
                      val = [...val, 'mergeMap 3'];
                      console.log(`${val[val.length - 1]} started...`);
                      return this.appService
                        .getRequest(val, 3000)
                        .pipe(map(() => val));
                    })
                  );
                })
              );
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(console.log, console.error, () => `completed!`);
  }
}
