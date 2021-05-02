import { Plan } from './plan';

export interface Student{
    id?:string;
    sbuID?:string;
    last?:string;
    first?:string;
    dept?:string;
    track?:string;
    satisfied?:number; 
    pending?:number;
    unsatisfied?:number;
    gradSemester?:string;
    gradYear?:string;
    semesters?:number;
    graduated?:boolean;
    email?:string;
    entrySemester?:string;
    entryYear?:string;
    reqVersionSemester?:string;
    reqVersionYear?:string;
    advisor?:string;
    project?:string;
    comments?:string[];
    validCoursePlan?:boolean;
    coursePlan?:Map<string, Map<string, string>>
    password?:string;
    gpa?: number;
    requiredCourses?: string[];
    credits?: number;
    hasThesis?: boolean;
    meetsCreditMinimum?: boolean;
    electiveCredits?: number;
    isMeetTimeLimit?: boolean;
    meetsElectiveCreditMinimum?: boolean;
    meetsGPA?: boolean;


    numAmsStatCourses?: number;
    hasAmsORStatComplete?: boolean;
    hasAmsFinalRec?: boolean;
    
    hasBMI592AllSemesters?: boolean;

    numCseBasicCourses?:number;
    hasCseBasicCourses?: boolean;
    hasCseTheoryCourse?: boolean;
    hasCseSystemsCourse?: boolean;
    hasCseIISCourse?: boolean;

    numEceHardwareCourse?: number;
    numEceNetworkCourse?: number;
    numEceCadCourse?: number;
    numEceTheoryCourse?: number;
    hasEceHardwareCourse?: boolean;
    hasEceNetworkingCourse?: boolean;
    hasEceCadCourse?: boolean;
    hasEceTheoryCourse?: boolean;
    numEse697Credits?:number;
    numEse599Credits?:number;
    hasEce697Credits?: boolean;
    hasEce599Credits?: boolean;
    numEceRegularCredits?: number;
    hasEceRegularCredits?:boolean
  }
  