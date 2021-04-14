import { Courses } from "./courses";
import { DegreeReqs } from "./degree-reqs";

export interface ECE extends DegreeReqs{
    reqCourses?:Courses[]; // The courses required for the department and the student's track
    credits?:Number; // Did the student complete a sufficient number of credits to graduate? (30)
    gpa?:Number; // Does the student have a 3.0 GPA or better?
    eseCredits?:Number; // Does the student have 6 credits or less from special topics ESE courses?
    ese698?:Number; // Does the student have 3 credits or less of ESE 698?
    ese597?:Number; // Does the student have 1-3 credits of ESE 597?
    hardwareRequirement?:Boolean // Did the student take at least 1 course in this sub-area?
    networkingRequirement?:Boolean // Did the student take at least 1 course in this sub-area?
    cadVSLIRequirement?:Boolean // Did the student take at least 1 course in this sub-area?
    theorySoftwareRequirement?:Boolean // Did the student take at least 2 courses in this sub-area?
    needsThesis?:Boolean; // Did the student pick the thesis option?
    meetsThesisReq?:Boolean; // Did the student complete the thesis requirements?
    numberOfLectureBasedCourses?:Number; // Did the student take a required additional number of lecture courses (3 for non-thesis, 1 for thesis)?
}
