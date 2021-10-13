import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface ImageFlipContent extends BaseModel{
    id: number;
    title: string;
    images:[];
    categoryId:any;
    status: boolean
}