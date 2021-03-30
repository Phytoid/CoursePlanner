import { DegreeReqs } from "./degree-reqs";

export interface CSE extends DegreeReqs{
    registrationReq?:Boolean;
    reqCourses?:String;
    gpaReq?:Number;
    advancedOption?:Boolean;
    specialOption?:Boolean;
    thesisOption?:Boolean;
    meetsProjectReq?:Boolean;
}
