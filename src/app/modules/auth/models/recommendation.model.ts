import { Action } from "src/app/models/recommendation-activity.model";

export class Recommendation {
  uid: string;
  source: 'co' | 'la';
  name: string;
  phoneNumber: string;
  phoneNumberHidden: boolean = true;
  createdAt: string;
  createdAtFormatted: string;
  status: Action;
  by: any;
}
