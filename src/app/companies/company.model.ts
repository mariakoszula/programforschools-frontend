export const MAIN_COMPANY = 0;

export class Company{
  constructor(public id: number,
              public name: string,
              public nip: string,
              public regon: string,
              public address: string) {
  }
}
