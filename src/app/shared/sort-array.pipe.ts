import {Pipe, PipeTransform} from "@angular/core";


@Pipe({name: 'sortArray'})
export class SortArrayPipe implements PipeTransform {
  transform(array: any, field: string): any[] {
    let tmp = [...array];
    tmp.sort((a: any, b: any) => { return +a[field] - +b[field]});
    return tmp;
  }
}
