
export type RecommendationActivityTypeModel =
    | 'ne'
    | 'ac'
    | 'de'
    | 'ca'
    | 'ta'
    | 've'
    | 'in'
    | 'wi'
    | 'so'
    | 're';

export type RecommendationActivityModel = {
  type: RecommendationActivityTypeModel;
  date: string;
  time: string;
  description: string;
  detail: string;
}
