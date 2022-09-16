import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ProductStore, Program, Week} from "../program.model";
import {map} from "rxjs/operators";
import {Subscription, switchMap} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";

@Component({
  selector: 'app-program-data',
  templateUrl: './program-data.component.html'
})
export class ProgramDataComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  program!: Program;
  id: number | undefined;
  weeks: Week[] = [];
  productsFruitVeg: ProductStore[] = [];
  productsDairy: ProductStore[] = [];

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private store: Store<AppState>) {

  }

  ngOnInit(): void {
    this.activeRoute.params
      .pipe(
        map((param: Params) => {
          return +param['id'];
        }),
        switchMap(id => {
          this.id = id;
          return this.store.select('program');
        })).subscribe(programState => {
      let program = programState.programs.find((program, _) => {
        return program.id === this.id;
      });
      if (program) {
        this.program = program;
        this.weeks = programState.weeks;
        this.productsDairy = programState.dairyProducts;
        this.productsFruitVeg = programState.fruitVegProducts;
      }
    });
  }

  onDelete() {
  }

  onEdit() {
    this.router.navigate(['edycja'], {relativeTo: this.activeRoute});
  }

  onEditWeeks() {
    this.router.navigate(['tygodnie'], {relativeTo: this.activeRoute});
  }

  onEditProduct() {
    this.router.navigate(['produkty'], {relativeTo: this.activeRoute});
  }
}
