import { Courses } from "./courses";
import { DegreeReqs } from "./degree-reqs";

export interface AMS extends DegreeReqs {
    track?:String; // The student's track in the AMS department.
    timeLimit?:Number; // Is the student's entry semester + year and graduation semester + year >= 3 years?
    requiredCourses?:Courses[]; // The courses required for the department and the student's track
    meetsTrackRequirements?:Boolean; // Has the student taken all of the courses in requiredCourses?
    credits?:Number; // Did the student complete a sufficient number of credits to graduate?
    meetsTimeFrameReq?:Boolean; // True when student's graduation semester + year - student's entry semester + year >= 3.
    meetsRecommendationReq?:Boolean; // Did the student receive a recommendation for graduation from the faculty of the graduate program?
    gpa?:Number; // Did the student achieve a B (3.0) or higher for all courses taken?
    courseGrades?:Number; // Did the student achieve a B (3.0) or higher in at least 18 credits?
}
