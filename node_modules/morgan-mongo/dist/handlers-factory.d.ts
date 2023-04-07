import * as mongoose from 'mongoose';
import { Handler } from './types';
export declare class HandlersFactory {
    static getHandler(type: typeof mongoose.SchemaType | mongoose.SchemaTypeOpts<any>): Handler<any>;
}
