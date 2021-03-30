import { DegreeReqs } from "./degree-reqs";

export interface ESE extends DegreeReqs{
    reqCourses?:String;
    needsThesis?:Boolean;
    meetsThesisReq?:Boolean;
}
