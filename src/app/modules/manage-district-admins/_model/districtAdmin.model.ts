import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface DistrictAdmin extends BaseModel{
    id: number;
    name: string;
    admin_account_name:string,
    email:string;   
    contact_person_email:string
    package_id:number
    contact_person_no:string,
    contact_person_name:string,
    phone_number:string
    role_id:number
     status: boolean,
     isSendPaymentLink:boolean,
}