"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const morgan = require("morgan");
const mongoose = require("mongoose");
const default_mapping_descriptor_1 = require("./default-mapping-descriptor");
const handlers_factory_1 = require("./handlers-factory");
class MorganMongo {
    constructor(options, connectionOptions, schemaOptions) {
        this.options = Object.assign({
            connectionString: 'mongodb://localhost:27017/morgan-mongo'
        }, options);
        this.connectionOptions = Object.assign({
            useNewUrlParser: true
        }, connectionOptions);
        this.schemaOptions = Object.assign({
            versionKey: false,
            strict: true,
            writeConcern: {
                w: 0
            }
        }, schemaOptions);
    }
    getConnectionPromise() {
        if (!this.connectionPromise) {
            this.connectionPromise = mongoose.connect(this.options.connectionString, this.connectionOptions);
        }
        return this.connectionPromise;
    }
    static generateSchemaDefinition(mappingDescriptor) {
        return Object.keys(mappingDescriptor).reduce((res, token) => {
            res[mappingDescriptor[token].prop] = mappingDescriptor[token].type ||
                mongoose.Schema.Types.String;
            return res;
        }, {});
    }
    getMappingDescriptor() {
        if (!this.mappingDescriptor && this.options.customMapping) {
            this.mappingDescriptor = this.options.customMapping;
        }
        else if (!this.mappingDescriptor) {
            let tokens = Object.keys(default_mapping_descriptor_1.defaultMappingDescriptor);
            if (this.options.includeOnly) {
                tokens = tokens.filter(token => this.options.includeOnly.includes(token));
            }
            else if (this.options.exclude) {
                tokens = tokens.filter(token => !this.options.exclude.includes(token));
            }
            const descriptor = tokens.reduce((res, token) => {
                res[token] = default_mapping_descriptor_1.defaultMappingDescriptor[token];
                return res;
            }, {});
            this.mappingDescriptor = Object.assign(descriptor, this.options.augment || {});
        }
        return this.mappingDescriptor;
    }
    getSchemaDefinition() {
        if (!this.schemaDefinition) {
            this.schemaDefinition = MorganMongo.generateSchemaDefinition(this.getMappingDescriptor());
        }
        return this.schemaDefinition;
    }
    getSchema() {
        if (!this.schema) {
            const def = this.getSchemaDefinition();
            this.schema = new mongoose.Schema(def, this.schemaOptions);
        }
        return this.schema;
    }
    getModel() {
        if (!this.model) {
            this.model = mongoose.model('Log', this.getSchema());
        }
        return this.model;
    }
    static parseToken(token) {
        const parts = token.split(':');
        return {
            name: parts[0],
            params: parts.length === 1 ? [] : parts.slice(1)
        };
    }
    prepareLogEntry(tokens, req, res) {
        const LogEntryModel = this.getModel(); // tslint:disable-line:variable-name
        const logEntry = new LogEntryModel();
        const mappingDescriptor = this.getMappingDescriptor();
        Object.keys(mappingDescriptor).forEach((token) => {
            const tokenMeta = MorganMongo.parseToken(token);
            const mappingMeta = mappingDescriptor[token];
            const params = mappingMeta.params || tokenMeta.params;
            const value = tokens[tokenMeta.name](req, res, ...params);
            const handler = mappingMeta.handler || handlers_factory_1.HandlersFactory.getHandler(mappingMeta.type);
            logEntry.set(mappingMeta.prop, handler(value));
        });
        return logEntry;
    }
    persistLogEntry(logEntry) {
        return this.getConnectionPromise().then(() => {
            return logEntry.save((err) => {
                if (err) {
                    console.error(err);
                }
            });
        });
    }
}
exports.MorganMongo = MorganMongo;
/* tslint:disable:max-line-length */
/**
 * MongooseMorgan object
 * @param  {object} options - represents mongo database data, requires { connectionString : '{MONGO_URL}' } parameter.
 * @param  {object} connectionOptions - mongoose ConnectionOptions ({@link https://mongoosejs.com/docs/api.html#mongoose_Mongoose-connect})
 * @param  {object} schemaOptions  - mongoose SchemaOptions ({@link https://mongoosejs.com/docs/api.html#schema_Schema})
 * @param  {object} morganOptions  - morgan Options ({@link https://github.com/expressjs/morgan#options})
 */
/* tslint:enable:max-line-length */
function morganMongoMiddleware(options = {}, connectionOptions = {}, schemaOptions = {}, morganOptions = {}) {
    const morganMongo = new MorganMongo(options, connectionOptions, schemaOptions);
    return morgan((tokens, req, res) => {
        try {
            const logEntry = morganMongo.prepareLogEntry(tokens, req, res);
            morganMongo.persistLogEntry(logEntry);
        }
        catch (e) {
            console.log(e);
        }
        return '';
    }, morganOptions);
}
exports.morganMongoMiddleware = morganMongoMiddleware;
