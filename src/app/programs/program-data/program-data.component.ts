import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Program} from "../program.model";
import {map} from "rxjs/operators";
import {switchMap} from "rxjs";
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

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<AppState>) {

  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((param: Params) => {
          return +param['id'];
        }),
        switchMap(id => {
          this.id = id;
          return this.store.select('programs');
        }),
        map(programState => {
          return programState.programs.find((program, _) => {
            return program.id === this.id;
          });
        })).subscribe(program => {
      if (program)
        this.program = program;
    })

  }

  onDelete() {

  }

  onEdit() {

  }
}
