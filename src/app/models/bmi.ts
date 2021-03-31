import { Courses } from "./courses";
import { DegreeReqs } from "./degree-reqs";

export interface BMI extends DegreeReqs{
    reqCourses?:Courses[];
    maxTransferCredits?:Number;
    timeLimit?:Number;
    meetsTimeFrameReq?:Boolean
    needsThesis?:Boolean;
    meetsThesisReq?:Boolean;
    needsProjectReq?:Boolean;
    meetsProjectReq?:Boolean;
}
