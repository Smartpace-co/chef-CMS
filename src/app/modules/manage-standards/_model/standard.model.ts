import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface Standards extends BaseModel{
    id: number;
    standardTitle: string;
    subjectId: string;
    image:string;
    status: boolean
}