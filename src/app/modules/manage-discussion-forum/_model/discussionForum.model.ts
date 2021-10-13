import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface DiscussionForum extends BaseModel{
    id: number;
    userId:number;
    topic: string;
    description:string;
    status: boolean;
    isPinned:boolean;
}