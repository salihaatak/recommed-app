import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';

export class UserModel extends AuthModel {
  account: {
    name: string;
  };
  role: 'u' | 'r' | 'o' | 'a';
  firebaseToken: string | null;
  deviceId: string | null;
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber: string;
  pic: string;
  occupation: string;
  accountName: string;
  address?: AddressModel;
  website: string;
  language: string;
  timeZone: string;
  communication: {
    email: boolean;
    sms: boolean;
    phone: boolean;
  };

  setUser(_user: unknown) {
    const user = _user as UserModel;

    this.role = user.role;
    this.account.name = user.account?.name;
    this.firebaseToken = user.firebaseToken;
    this.deviceId = user.deviceId;
    this.id = user.id;
    this.password = user.password || '';
    this.firstName = user.firstName || '';
    this.lastName = user.lastName || '';
    this.email = user.email || '';
    this.pic = user.pic || './assets/media/avatars/blank.png';
    this.occupation = user.occupation || '';
    this.accountName = user.accountName || '';
    this.phoneNumber = user.phoneNumber || '';
    this.address = user.address;
  }
}
