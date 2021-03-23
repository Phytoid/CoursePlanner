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
  }
  