import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: '<div class="overlay"><i class="fas fa-3x fa-sync-alt"></i></div>',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
}
