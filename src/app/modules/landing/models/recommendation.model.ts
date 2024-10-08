import { Action } from "src/app/models/recommendation-activity.model";

export class Recommendation {
  uid: string;
  name: string;
  phoneNumber: string;
  phoneNumberHidden: boolean = true;
  createdAt: string;
  createdAtFormatted: string;
  acceptedAt: string;
  declinedAt: string;
  validatedAt: string;
  invalidatedAt: string;
  withdrawnAt: string;
  calledAt: string;
  talkedAt: string;
  cancelledAt: string;
  soldAt: string;
  rejectedAt: string;
  status: Action;
  by: any;
}
