import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface IssuesFeedback extends BaseModel {
    id: number;
   comment:string;
   report_issue:{
       id:number;
       attachment:string;
       description:string;
       type:string;
       createdAt:string;
       school:{
        id:undefined,
       admin_account_name:''
  
      },
      district_admin:{
        id:undefined,
       admin_account_name:''
  
      }
   }
   
}