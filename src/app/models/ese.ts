import { Courses } from "./courses";
import { DegreeReqs } from "./degree-reqs";

export interface ESE extends DegreeReqs{
    reqCourses?:Courses[];
    needsThesis?:Boolean;
    meetsThesisReq?:Boolean;
}
