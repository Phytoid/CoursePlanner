import { Semester } from "./semester.enum";

export interface Courses {
    course?: String,
    department?:String,
    courseID?:String;
    courseName?:String;
    professor?:String;
    semester?:Semester;
    year?:number;
    startTime?:Date;
    endTime?:Date;
    graduatePreq?:string;
    enrollment?:Number;
    section?:Number;
    credits?:Number;
    description?:String;
    semesterAndYear?:String;
}

