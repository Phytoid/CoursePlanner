import { Courses } from "./courses";
import { DegreeReqs } from "./degree-reqs";

export interface AMS extends DegreeReqs {
    // track?:string; // The student's track in the AMS department.
    // timeLimit?:Number; // Is the student's entry semester + year and graduation semester + year >= 3 years?
    // requiredCourses?:Courses[]; // The courses required for the department and the student's track
    // meetsTrackRequirements?:Boolean; // Has the student taken all of the courses in requiredCourses?
    // credits?:Number; // Did the student complete a sufficient number of credits to graduate?
    // meetsTimeFrameReq?:Boolean; // True when student's graduation semester + year - student's entry semester + year >= 3.
    // meetsRecommendationReq?:Boolean; // Did the student receive a recommendation for graduation from the faculty of the graduate program?
    // gpa?:Number; // Did the student achieve a B (3.0) or higher for all courses taken?
    // courseGrades?:Number; // Did the student achieve a B (3.0) or higher in at least 18 credits?
    track?:string[]; // The student's track in the AMS department.
    department?:string; // Department
    versionSemester?:string; // Version semester
    versionYear?: Number; // version year
    requiredCoursesCAM?: string[]; // required courses for Computational Applied Mathematics
    numElectiveCoursesCAM?: Number; // Num electives needed for CAM track
    requiredCoursesCB?: string[]; // required courses for Computational Biology
    numElectiveCoursesCB?:Number; // Number electives needed for CB track
    requiredCoursesOR?: string[]; // required courses Operations Research
    statisticCoursesOR?:string[]; // statistic courses used for Operations Research
    numStatisticCoursesOR?: Number; // Num stat courses needed for OR
    electiveCoursesOR?: string[]; // Elective courses for OR track
    numElectiveCoursesOR?: Number;
    electiveCoursesSubsOR?: string[]; // Electives that can be substitued for electives OR
    numElectiveCoursesSubStatsOR?: Number; // Num elective courses needed
    numElectiveCoursesSubFinance?: Number; // Num of sub elective courses that can count
    requiredCoursesSTAT?: string[]; // Requried courses for STAT track
    numElectiveCoursesSTAT?: Number; // Num electives needed for STAT track
    requiredCoursesQF?: string[]; // Req courses for Quant Finance track
    numElectiveCoursesQF?: Number; // Num electives needed
    credits?: Number; // Credits needed to graduate
    gpa?: Number; // Cum GPA needed to graduate
    courseGrades?: Number; // Num courses with B or higher to graduate
    finalRec?: boolean; // If final recomendation is needed to grad
    timeLimit?: Number; // Num years to finish program by
    // CAM: Map<string, string[]>
}
