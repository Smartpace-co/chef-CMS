import { BaseModel } from '../../../_metronic/shared/crud-table';
export interface ConversationSentences extends BaseModel{
    id: number;
    conversationSentence: string;
    categoryId: string;
    status: boolean
}