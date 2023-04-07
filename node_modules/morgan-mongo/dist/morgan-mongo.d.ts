import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import { OptionsType } from './types';
export declare class MorganMongo {
    private options;
    private connectionOptions;
    private schemaOptions;
    private connectionPromise;
    private mappingDescriptor;
    private schemaDefinition;
    private schema;
    private model;
    constructor(options: OptionsType, connectionOptions: mongoose.ConnectionOptions, schemaOptions: mongoose.SchemaOptions);
    getConnectionPromise(): Promise<typeof mongoose>;
    private static generateSchemaDefinition;
    private getMappingDescriptor;
    private getSchemaDefinition;
    getSchema(): mongoose.Schema;
    getModel(): mongoose.Model<any>;
    private static parseToken;
    prepareLogEntry(tokens: morgan.TokenIndexer, req: express.Request, res: express.Response): mongoose.Document;
    persistLogEntry(logEntry: mongoose.Document): Promise<mongoose.Document>;
}
/**
 * MongooseMorgan object
 * @param  {object} options - represents mongo database data, requires { connectionString : '{MONGO_URL}' } parameter.
 * @param  {object} connectionOptions - mongoose ConnectionOptions ({@link https://mongoosejs.com/docs/api.html#mongoose_Mongoose-connect})
 * @param  {object} schemaOptions  - mongoose SchemaOptions ({@link https://mongoosejs.com/docs/api.html#schema_Schema})
 * @param  {object} morganOptions  - morgan Options ({@link https://github.com/expressjs/morgan#options})
 */
export declare function morganMongoMiddleware(options?: OptionsType, connectionOptions?: mongoose.ConnectionOptions, schemaOptions?: mongoose.SchemaOptions, morganOptions?: morgan.Options): express.RequestHandler;
