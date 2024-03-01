import { RecommendationActivityTypeModel } from "src/app/models/recommendation-activity.model";

export class Recommendation {
  uid: string;
  source: 'co' | 'la';
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
  status: RecommendationActivityTypeModel;
  by: any;
}
