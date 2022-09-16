import {Component, Input, OnInit} from '@angular/core';
import {ProductStore} from "../program.model";

@Component({
  selector: 'app-product-summarize',
  templateUrl: './product-summarize.component.html'
})
export class ProductSummarizeComponent implements OnInit {
  @Input() productsFruitVeg: ProductStore[]=[];
  @Input() productsDairy: ProductStore[]=[];
  constructor() { }

  ngOnInit(): void {
  }

}
