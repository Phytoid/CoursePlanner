import { Semester } from "./semester.enum";

export interface Courses {
    course_identifier?:String;
    course_name?:String;
    professor?:String;
    semester?:Semester;
    year?:Number;
    start_time?:Number;
    end_time?:Number;
    graduate_prereqs?:String;
    enrollment?:Number;
    section?:Number;
    credits?:Number;
    description?:String;
}

