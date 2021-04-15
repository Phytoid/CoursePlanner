import { Courses } from "./courses";
import { DegreeReqs } from "./degree-reqs";

export interface CSE extends DegreeReqs{
    registration?:Boolean; // Did the student register for at least one credit in their graduation semester?
    requiredCourses?:Courses[]; // The courses the student needs for their thesis/project
    credits?:Number; // Did the student complete a sufficient number of credits to graduate? (31)
    gpa?:Number; // Does the student have a 3.0 GPA or better?
    advancedOption?:Boolean; // Is the student on the advanced project track?
    specialOption?:Boolean; // Is the student on the special project track?
    thesisOption?:Boolean; // Is the student on the thesis project track?
    meetsTrackReq?:Boolean; // Has the student taken the courses in requiredCourses?
}
