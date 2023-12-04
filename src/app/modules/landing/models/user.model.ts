import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';

export class UserModel extends AuthModel {
  uid: string;
  role: 'u' | 'r' | 'o' | 'a';
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  account: {
    name: string;
  };

  setUser(_user: unknown) {
    const user = _user as UserModel;

    this.uid = user.uid;
    this.role = user.role;
    this.account.name = user.account?.name;
    this.firstName = user.firstName || '';
    this.lastName = user.lastName || '';
    this.email = user.email || '';
  }
}
