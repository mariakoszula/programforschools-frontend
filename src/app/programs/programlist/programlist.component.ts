import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-programlist',
  templateUrl: './programlist.component.html'
})
export class ProgramlistComponent implements OnInit {
  isSelectedProgram: boolean = false;
  isLoading: boolean = false;

  constructor(private router: Router,
              private activeRoute: ActivatedRoute, ) { }

  ngOnInit(): void {


  }

  addProgram(): void {
    this.router.navigate(["nowy"], {relativeTo: this.activeRoute});
  }



}
