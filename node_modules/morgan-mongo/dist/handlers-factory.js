"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const default_mapping_descriptor_1 = require("./default-mapping-descriptor");
const useragent = require('useragent');
class HandlersFactory {
    static getHandler(type) {
        if (type === mongoose.Schema.Types.Number) {
            return value => +value;
        }
        if (type === mongoose.Schema.Types.Date) {
            return value => new Date(value);
        }
        if (type === default_mapping_descriptor_1.userAgentSchemaDef) {
            return (value) => {
                const ua = useragent.parse(value);
                return Object.assign({}, ua, { major: +ua.major, minor: +ua.minor, patch: +ua.patch });
            };
        }
        return value => value;
    }
}
exports.HandlersFactory = HandlersFactory;
