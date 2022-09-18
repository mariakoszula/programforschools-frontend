import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html'
})
export class SelectProductComponent implements OnInit {

 //TODO if record already exists do not show this input button for this record
  // TODO modification, removing and accepting -- as in old program and this is only possibility to change already planned schools

  constructor() { }

  ngOnInit(): void {
  }

}
