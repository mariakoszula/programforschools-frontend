import { Role } from '../shared/namemapping.utils'

export class User {
  constructor(public email: string,
              public id: string,
              public username: string,
              public role: Role,
              public access_token: string,
              public refresh_token: string) {
  }
}
