import { RecommendationActivityTypeModel } from "src/app/models/recommendation-activity.model";

export class Recommendation {
  uid: string;
  name: string;
  phoneNumber: string;
  phoneNumberHidden: boolean = true;
  createdAt: string;
  createdAtFormatted: string;
  acceptedAt: string;
  declinedAt: string;
  calledAt: string;
  talkedAt: string;
  verifiedAt: string;
  cancelledAt: string;
  soldAt: string;
  rejectedAt: string;
  status: RecommendationActivityTypeModel;
  by: any;
}
