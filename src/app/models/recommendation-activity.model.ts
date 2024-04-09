
export type Action =
    | 'register'
    | 'usage'
    | 'outbound'
    | 'first-recommendation'
    | 'otp'
    | 'login'
    | 'join'
    | 'sale'
    | 'recommender-video'
    | 'new-recommender-otp'
    | 'new-recommender'
    | 'new-recommender-verify'
    | 'recommender_preference'
    | 'recommendation' // 'ne' > recommendation (VAR)
    | 'recommendation-accept' // 'ac' > recommendation-accept
    | 'recommendation-decline' // 'de' > recommendation-decline
    | 'recommendation-validate' // 'va' > recommendation-validate
    | 'recommendation-invalidate' // 'in' > recommendation-invalidate
    | 'recommendation-withdraw' // 'wi' > recommendation-withdraw
    | 'sale' // 'so' > sale
    | 'recommendation-reject'; // 're' > recommendation-reject

export type RecommendationActionModel = {
  action: Action;
  date: string;
  time: string;
  description: string;
  detail: string;
}
