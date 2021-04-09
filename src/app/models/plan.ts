import { Courses } from './courses';
import { Semester } from "./semester.enum";

export interface Plan {
    coursesSatisfaction: Map<Courses, Boolean>
    coursesGrages: Map<Courses, String>
    complete: Boolean
    vlaid: Boolean
}