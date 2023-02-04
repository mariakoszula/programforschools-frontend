import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'cutYearFromDate'})
export class CutYearFromDate implements PipeTransform {
  transform(value: string): string {
    return value.replace(/(.\d{4})/, "");
  }
}

