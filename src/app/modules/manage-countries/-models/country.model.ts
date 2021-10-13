import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface Country extends BaseModel {
    id: number;
    countryName: string;
    grades: string;
    languages: string;
    countryTrack:string;
    images:[];
    backgroundImage:string;
    status: boolean;
    systemLanguageId:string
}