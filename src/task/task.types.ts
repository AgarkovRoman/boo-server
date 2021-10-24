import { Types } from 'mongoose';

export type Task = {
    id: Types.ObjectId;
    name: string;
    description: string;
    archived: boolean;
    date: string;
    projectId: string
};
