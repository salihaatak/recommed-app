
export type RecommendationActivityTypeModel =
    | 'ne'
    | 'ac'
    | 'de'
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
