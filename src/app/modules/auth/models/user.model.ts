import { AuthModel } from './auth.model';

export class UserModel extends AuthModel {
  uid: string;
  role: 'u' | 'r' | 'o' | 'a';
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  salesRewardPercentage: number;
  account: {
    uid: string;
    name: string;
    invitationCode: string;
    logo: string;
    salesRewardPercentage: number;
  };
}
