import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface ImageDragDrops extends BaseModel{
    id: number;
    title: string;
     images:[];
    status: boolean;
    categoryId:any;
}