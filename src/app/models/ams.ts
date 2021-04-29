import { Courses } from "./courses";
import { DegreeReqs } from "./degree-reqs";

export interface AMS extends DegreeReqs {
    // track?:String; // The student's track in the AMS department.
    // timeLimit?:Number; // Is the student's entry semester + year and graduation semester + year >= 3 years?
    // requiredCourses?:Courses[]; // The courses required for the department and the student's track
    // meetsTrackRequirements?:Boolean; // Has the student taken all of the courses in requiredCourses?
    // credits?:Number; // Did the student complete a sufficient number of credits to graduate?
    // meetsTimeFrameReq?:Boolean; // True when student's graduation semester + year - student's entry semester + year >= 3.
    // meetsRecommendationReq?:Boolean; // Did the student receive a recommendation for graduation from the faculty of the graduate program?
    // gpa?:Number; // Did the student achieve a B (3.0) or higher for all courses taken?
    // courseGrades?:Number; // Did the student achieve a B (3.0) or higher in at least 18 credits?
    track?:String[]; // The student's track in the AMS department.
    department?:String; // Department
    versionSemester?:String; // Version semester
    versionYear?: Number; // version year
    requiredCoursesCAM?: String[]; // required courses for Computational Applied Mathematics
    requiredCoursesCB?: String[]; // required courses for Computational Biology
    numElectiveCoursesCB?:Number; // Number electives needed for CB track
    requiredCoursesOR?: String[]; // required courses Operations Research
    statisticCoursesOR?:String[]; // statistic courses used for Operations Research
    numStatisticCoursesOR?: Number; // Num stat courses needed for OR
    electiveCoursesOR?: String[]; // Elective courses for OR track
    electiveCoursesSubsOR?: String[]; // Electives that can be substitued for electives OR
    numElectiveCoursesSubStatsOR?: Number; // Num elective courses needed
    numElectiveCoursesSubFinance?: Number; // Num of sub elective courses that can count
    requiredCoursesSTAT?: String[]; // Requried courses for STAT track
    numElectiveCoursesSTAT?: Number; // Num electives needed for STAT track
    requiredCoursesQF?: String[]; // Req courses for Quant Finance track
    numElectiveCoursesQF?: Number; // Num electives needed
    credits?: Number; // Credits needed to graduate
    gpa?: Number; // Cum GPA needed to graduate
    courseGrades?: Number; // Num courses with B or higher to graduate
    finalRec?: boolean; // If final recomendation is needed to grad
    timeLimit?: Number; // Num years to finish program by
    // CAM: Map<String, String[]>
}
