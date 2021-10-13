import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface Subjects extends BaseModel {
    id: number;
    subjectTitle: string;
    status: boolean
}