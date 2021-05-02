import { Courses } from "./courses";
import { DegreeReqs } from "./degree-reqs";

export interface ECE extends DegreeReqs{
    // reqCourses?:Courses[]; // The courses required for the department and the student's track
    // credits?:Number; // Did the student complete a sufficient number of credits to graduate? (30)
    // gpa?:Number; // Does the student have a 3.0 GPA or better?
    // eseCredits?:Number; // Does the student have 6 credits or less from special topics ESE courses?
    // ese698?:Number; // Does the student have 3 credits or less of ESE 698?
    // ese597?:Number; // Does the student have 1-3 credits of ESE 597?
    // hardwareRequirement?:Boolean // Did the student take at least 1 course in this sub-area?
    // networkingRequirement?:Boolean // Did the student take at least 1 course in this sub-area?
    // cadVSLIRequirement?:Boolean // Did the student take at least 1 course in this sub-area?
    // theorySoftwareRequirement?:Boolean // Did the student take at least 2 courses in this sub-area?
    // needsThesis?:Boolean; // Did the student pick the thesis option?
    // meetsThesisReq?:Boolean; // Did the student complete the thesis requirements?
    // numberOfLectureBasedCourses?:Number; // Did the student take a required additional number of lecture courses (3 for non-thesis, 1 for thesis)?
    department: String;
    track?:String[]; // The BMI student's track (Clinical, Imaging, Translational)
    versionSemester?: String;
    versionYear?: Number;
    hardwareCourses: String[]; // All hardware courses
    networkingCourses: String[]; // All networking courses
    cadCourses: String[]; // all CAD courses
    theoryCourses: String[]; // all theory courses
    subAreas1: String[]; // Subarea 1 (hardware, networking, cad)
    subAreas2: String[]; // Subarea 2 (theory)
    requiredCoursesNT: String[]; // Required courses for Non-thesis
    requiredCoursesT: String[]; // Required courses for thesis
    nonRegularCourses: String[]; //non reqular courses
    numCreditsSubAreas1NT: Number; // Number of credits fron subarea 1 needed by non-thesis
    numCreditsSubAreas2NT: Number; // Number of credits from subarea 2 needed by non-thesis
    maxCreditsESE698NT: Number; // Max credits of ese698 that will count to degree for non thesis
    maxCreditsESE697NT: Number; // Max credits of ese697 that will count to degree for non thesis
    numRegularCoursesNT: Number; // Number of refular courses needed for NT
    maxComboCreditsNT: Number; // Max credits from a combo of classes ese597 - ese599
    minCreditsESE597NT: Number; // min credits needed from ESE597
    maxTransferCredits: Number; // Max transfer credits that will count to degree
    timeLimit: Number; // Years needed to graduate by
    creditMinimumNT: Number; // Min credits needed for non-thesis to graduate
    gpaNT: Number; // Min gpa needed by non-thesis to graduate
    numCreditsSubAreas1T: Number; // Number of credits fron subarea 1 needed by thesis
    numCreditsSubAreas2T: Number; // Number of credits from subarea 2 needed by thesis
    maxCreditsESE698T: Number; // Max credits of ese698 that will count to degree for thesis
    maxCreditsESE697T: Number; // Max credits of ese697 that will count to degree for thesis
    numRegularCoursesT: Number; // Number of refular courses needed for Thesis
    maxComboCreditsT: Number; // Max credits from a combo of classes ese597 - ese599
    minCreditsESE597T: Number; // min credits needed from ESE597
    minCreditsESE599T: Number; // min credits needed from ESE599
    creditMinimumT: Number; // Min credits needed for thesis to graduate
    gpaT: Number; // Min gpa needed by thesis to graduate
    completeThesis: boolean; // If thesis student needs a thesis to graduate
}
 