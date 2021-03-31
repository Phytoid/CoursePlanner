import { Courses } from "./courses";
import { DegreeReqs } from "./degree-reqs";

export interface AMS extends DegreeReqs{
    timeLimit?:Number;
    requiredCourses?:Courses[];
    meetsTimeFrameReq?:Boolean;
    meetsRecommendationReq?:Boolean;
}
