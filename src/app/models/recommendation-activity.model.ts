
export type RecommendationActivityTypeModel =
    | 'ne'
    | 'cl'
    | 'ta'
    | 've'
    | 'ca'
    | 'sa'
    | 're';

export type RecommendationActivityModel = {
  type: RecommendationActivityTypeModel;
  date: string;
  time: string;
  description: string;
  detail: string;
}
