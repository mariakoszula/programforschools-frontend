import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {ProgramlistComponent} from './programlist/programlist.component';
import {ProgramRoutingModule} from "./programs-routing.module";
import {ProgramDataEditorComponent} from './program-add/program-data-editor.component';
import {ProgramsComponent} from "./programs.component";
import {ProgramDataComponent} from './program-data/program-data.component';
import {WeekEditorComponent} from './weeks-editor/week-editor.component';
import {ProductEditorComponent} from './product-editor/product-editor.component';
import {ProductSummarizeComponent} from './product-summrize/product-summarize.component';


@NgModule({
  declarations: [
    ProgramlistComponent, ProgramDataEditorComponent, ProgramsComponent, ProgramDataComponent,
    WeekEditorComponent, ProductEditorComponent, ProductSummarizeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ProgramRoutingModule
  ]
})
export class ProgramsModule {
}
