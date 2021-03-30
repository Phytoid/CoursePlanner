import { DegreeReqs } from "./degree-reqs";

export interface AMS extends DegreeReqs{
    timeLimit?:Number;
    requiredCourses?:String;
    meetsTimeFrameReq?:Boolean;
    meetsRecommendationReq?:Boolean;
}
