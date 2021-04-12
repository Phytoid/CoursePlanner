import { Courses } from './courses';
import { Semester } from "./semester.enum";

export interface Plan {
    coursesSatisfaction: Map<Courses, Boolean>
    coursesGrades: Map<Courses, String>
    complete: Boolean
    valid: Boolean
}