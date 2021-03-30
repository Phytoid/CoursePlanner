import { DegreeReqs } from "./degree-reqs";

export interface BMI extends DegreeReqs{
    reqCourses?:String;
    maxTransferCredits?:Number;
    timeLimit?:Number;
    meetsTimeFrameReq?:Boolean
    needsThesis?:Boolean;
    meetsThesisReq?:Boolean;
    needsProjectReq?:Boolean;
    meetsProjectReq?:Boolean;
}
