import { Courses } from "./courses";
import { DegreeReqs } from "./degree-reqs";

export interface BMI extends DegreeReqs {
    // track?:String; // The BMI student's track (Clinical, Imaging, Translational).
    // requiredCourses?:Courses[]; // Did the students take all of the required courses for their track and degree?
    // meetsTrackRequirements?:Boolean; // Has the student taken all of the courses in requiredCourses?
    // credits?:Number; // Did the student complete a sufficient number of credits to graduate?
    // maxSBUTransferCredits?:Number; // Does the student have a minimum of 12 transfer credits?
    // maxOutsideTransferCredits?:Number; // Does the student have a minimum of 6 transfer credits from institutions other than SBU?
    // bmiCredits?:Number; // Does the student have 18 or more BMI graduate credits (excluding the independent study, independent reading, seminar, special topics and special problems courses)?
    // timeLimit?:Number; // Is the student's entry semester + year and graduation semester + year >= 3 years?
    // meetsTimeFrameReq?:Boolean; // True when student's graduation semester + year - student's entry semester + year >= 3.
    // needsThesis?:Boolean; // True if the student selected the thesis option.
    // meetsThesisReq?:Boolean; // True if the student has fulfilled the thesis requirements.
    // needsProjectReq?:Boolean; // True if the student selected the capstone project option.
    // meetsProjectReq?:Boolean; // True if the student has fulfilled the project requirements.
    // gpa?:Number; // Did the student achieve a 3.0 or higher in all courses taken?
    // registration?:Boolean; // Did the student register for at least one credit in their graduation semester?
    // bmi592?:Boolean; // Is the student full-time and did the student take BMI 592 each semester enrolled?
    department: String;
    track?:String[]; // The BMI student's track (Clinical, Imaging, Translational).
    versionSemester?: String;
    versionYear?: Number;
    requiredCourses?:String[]; // Did the students take all of the required courses for their track and degree?
    credits?: Number; // Number of elective credits needed to graduate
    numCreditsNotFromNonElectives?: Number; // Number of elective credits that cannot be from nonElective courses from number of elective courses
    nonElectives?: String[]; // Non elective classes
    requiredCoursesII: String[]; // Classes needed for Imaging Info
    electivesII: String[]; // ALlowed electives for Imaging Info
    requriedCoursesCI: String[]; // Classes needed for Clinical Info
    electivesCI: String[]; // electives for Clinical Info
    requiredCoursesTBI: String[]; // Required courses for Translational BI
    electiveCoursesTBI: String[]; // Allowed electivees for TBI
    requiredCourseThesis: String[]; // Courses required by all thesis tracks
    requiredCourseProject: String[]; // Courses required by all project courses
    maxBMI599CreditsThesis: Number; // max number of credits from BMI599 that will count towards thesis degree
    maxBMI596CreditsThesis: Number; // Max number of credits from BMI596 that will count towards thesis degree
    maxBMI598CreditsProject: Number; // max number of credits ffrom BMI598 that will count towards project degree
    maxBMI596CreditsProject: Number; // max number of credits from BMI596 that will count towards project degree
    maxTransferCredits: Number; // Max credits allowed to transfer from SBU
    maxTransferFromOther: Number; // Max credits allowed to transfer from other schools
    timeLimit: Number; // Max years to graduate by
    creditMinimumPerSemester: Number;
    BMI592AllSemesters: boolean;// Is the student full-time and did the student take BMI 592 each semester enrolled?s
    gpa?:Number; // Did the student achieve a 3.0 or higher in all courses taken?
    registration?:Boolean; // Did the student register for at least one credit in their graduation semester?
}
