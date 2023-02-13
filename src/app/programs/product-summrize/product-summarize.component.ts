import {Component, Input, OnInit} from '@angular/core';
import {ProductStore} from "../program.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-summarize',
  templateUrl: './product-summarize.component.html'
})
export class ProductSummarizeComponent implements OnInit {
  @Input() productsFruitVeg: ProductStore[]=[];
  @Input() productsDairy: ProductStore[]=[];
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onEditProduct(index: number) {
    let programJson  = localStorage.getItem("currentProgram");
    if (programJson){
      const program_id = JSON.parse(programJson)["id"];
      this.router.navigate(['programy', program_id,'produkty', index, 'edycja']);
    }
  }

  getColor(index: number){
    if (this.productsFruitVeg.find((product) => product.id === index)){
      return "table-success";
    }
    return "table-warning";
  }

}
