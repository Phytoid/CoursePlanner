import { Courses } from "./courses";
import { DegreeReqs } from "./degree-reqs";

export interface CSE extends DegreeReqs{
    // registration?:Boolean; // Did the student register for at least one credit in their graduation semester?
    // requiredCourses?:Courses[]; // The courses the student needs for their thesis/project
    // credits?:Number; // Did the student complete a sufficient number of credits to graduate? (31)
    // gpa?:Number; // Does the student have a 3.0 GPA or better?
    // advancedOption?:Boolean; // Is the student on the advanced project track?
    // specialOption?:Boolean; // Is the student on the special project track?
    // thesisOption?:Boolean; // Is the student on the thesis project track?
    // meetsTrackReq?:Boolean; // Has the student taken the courses in requiredCourses?
    department: string;
    track?:string[]; // The BMI student's track (Clinical, Imaging, Translational)
    versionSemester?: string;
    versionYear?: Number;
    credits: Number // Min credits needed to graduate
    maxCreditsCSE587: Number // max credits that count from cse587
    oneGraduateClass: Boolean // if student needs one class last semester to graduate
    requiredCoursesA: string[] // Required courses for advanced track
    notAllowedCoursesA: string[] // Courses not allowed for advanced track
    requiredCoursesS: string[] // Required courses for special track
    notAllowedCoursesS: string[] // Courses not allowed for special track
    minBasicProjectS: Number; // Min number of basic project classes needed for special track
    basicProjectCourses: string[]; // basic project courses
    minCreditEverythingS: Number; // Min number of classes needed from the everything course list for special track
    everythingCoursesS: string[]; // All courses special project can take for credit

    specialCoursesS: string[]; // Special courses that special track can take for credit
    maxSpecialCreditsS: Number; // Max number of special credits special track student can take and count towards degree
    requiredCoursesT: string[]; // Required courses for thesis
    maxCreditsCSE599: Number; // Max credits from cse599 that will count
    thesis: boolean; // If thesis student required a thesis to graduate
    gpa?:Number; // Does the student have a 3.0 GPA or better?
    numBreadthCourses?: Number;
    theoryCourses: string[];
    systemsCourses: string[];
    iisCourses: string[];
}   
    