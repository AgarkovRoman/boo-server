import { Types } from 'mongoose';

export type Project = {
    id: Types.ObjectId;
    name: string;
    description: string;
};
