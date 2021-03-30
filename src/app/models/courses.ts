import { Semester } from "./semester.enum";

export interface Courses {
    courseID?:String;
    courseName?:String;
    professor?:String;
    semester?:Semester;
    year?:Number;
    startTime?:Date;
    endTime?:Date;
    graduatePreq?:String;
    enrollment?:Number;
    section?:Number;
    credits?:Number;
    description?:String;
}

