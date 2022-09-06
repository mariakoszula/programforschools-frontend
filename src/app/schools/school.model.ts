export class School {
  constructor(public id: number,
              public nick: string,
              public name: string | null,
              public address: string | null,
              public regon: string | null,
              public nip: string | null,
              public email: string | null,
              public phone: string | null,
              public city: string | null,
              public responsible_person: string | null,
              public representative: string | null,
              public representative_nip: string | null,
              public representative_regon: string | null

  ) {
  }
}
