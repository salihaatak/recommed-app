
export type RecommendationActivityTypeModel = 'n' | 't' | 'v' | 'c' | 'p';

export type RecommendationActivityModel = {
  type: RecommendationActivityTypeModel;
  date: string;
  time: string;
  description: string;
  detail: string;
}
