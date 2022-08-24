import { Role } from '../shared/namemapping.utils'

export class User {
  constructor(public email: string,
              public id: number,
              public access_token: string,
              public refresh_token: string,
              public username: string = "",
              public role: Role = Role.Undefined) {
  }
}
