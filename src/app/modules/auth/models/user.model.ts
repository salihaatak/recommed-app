import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel extends AuthModel {
  account: {
    name: string;
  };
  provider: {
    name: string;
  }
  type: 'user' | 'recommender';
  firebaseToken: string | null;
  deviceId: string | null;
  id: number;
  username: string;
  password: string;
  email: string;
  pic: string;
  roles: number[] = [];
  occupation: string;
  accountName: string;
  phoneNumber: string;
  address?: AddressModel;
  socialNetworks?: SocialNetworksModel;
  // personal information
  firstName: string;
  lastName: string;
  website: string;
  // account information
  language: string;
  timeZone: string;
  communication: {
    email: boolean;
    sms: boolean;
    phone: boolean;
  };
  // email settings
  emailSettings?: {
    emailNotification: boolean;
    sendCopyToPersonalEmail: boolean;
    activityRelatesEmail: {
      youHaveNewNotifications: boolean;
      youAreSentADirectMessage: boolean;
      someoneAddsYouAsAsAConnection: boolean;
      uponNewOrder: boolean;
      newMembershipApproval: boolean;
      memberRegistration: boolean;
    };
    updatesFromKeenthemes: {
      newsAboutKeenthemesProductsAndFeatureUpdates: boolean;
      tipsOnGettingMoreOutOfKeen: boolean;
      thingsYouMissedSindeYouLastLoggedIntoKeen: boolean;
      newsAboutMetronicOnPartnerProductsAndOtherServices: boolean;
      tipsOnMetronicBusinessProducts: boolean;
    };
  };

  setUser(_user: unknown) {
    const user = _user as UserModel;

    this.type = user.type;
    this.account.name = user.account?.name;
    this.provider.name = user.provider?.name;
    this.firebaseToken = user.firebaseToken;
    this.deviceId = user.deviceId;
    this.id = user.id;
    this.username = user.username || '';
    this.password = user.password || '';
    this.firstName = user.firstName || '';
    this.lastName = user.lastName || '';
    this.email = user.email || '';
    this.pic = user.pic || './assets/media/avatars/blank.png';
    this.roles = user.roles || [];
    this.occupation = user.occupation || '';
    this.accountName = user.accountName || '';
    this.phoneNumber = user.phoneNumber || '';
    this.address = user.address;
    this.socialNetworks = user.socialNetworks;
  }
}
