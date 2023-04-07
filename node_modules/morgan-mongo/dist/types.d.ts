import * as mongoose from 'mongoose';
export declare type Handler<T> = (value: string) => T;
export declare type MappingDescriptor = {
    [tokenName: string]: MappingMeta<any>;
};
export declare type MappingMeta<T> = {
    prop: string;
    type?: typeof mongoose.SchemaType | mongoose.SchemaDefinition;
    params?: any[];
    handler?: Handler<T>;
};
export declare type OptionsType = {
    connectionString?: string;
    includeOnly?: string[];
    exclude?: string[];
    augment?: MappingDescriptor;
    customMapping?: MappingDescriptor;
};
