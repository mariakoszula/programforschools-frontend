import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import { ProgramlistComponent } from './programlist/programlist.component';
import {ProgramRoutingModule} from "./programs-routing.module";
import { ProgramDataEditorComponent } from './program-add/program-data-editor.component';
import {ProgramsComponent} from "./programs.component";
import { ProgramDataComponent } from './program-data/program-data.component';


@NgModule({
  declarations: [ProgramlistComponent, ProgramDataEditorComponent, ProgramsComponent, ProgramDataComponent
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ProgramRoutingModule
  ]
})
export class ProgramsModule { }
