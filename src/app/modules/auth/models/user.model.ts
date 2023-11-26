import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';

export class UserModel extends AuthModel {
  account: {
    name: string;
  };
  role: 'u' | 'r' | 'o' | 'a';
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

  setUser(_user: unknown) {
    const user = _user as UserModel;

    this.role = user.role;
    this.account.name = user.account?.name;
    this.firstName = user.firstName || '';
    this.lastName = user.lastName || '';
    this.email = user.email || '';
  }
}
