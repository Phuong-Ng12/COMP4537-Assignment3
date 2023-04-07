"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.userAgentSchemaDef = {
    family: mongoose.Schema.Types.String,
    major: mongoose.Schema.Types.Number,
    minor: mongoose.Schema.Types.Number,
    patch: mongoose.Schema.Types.Number,
    source: mongoose.Schema.Types.String
};
exports.defaultMappingDescriptor = {
    date: {
        prop: 'date',
        type: mongoose.Schema.Types.Date,
        params: ['iso']
    },
    'http-version': {
        prop: 'httpVersion'
    },
    method: {
        prop: 'method',
    },
    referrer: {
        prop: 'referrer',
    },
    'remote-addr': {
        prop: 'remoteAddr',
    },
    'remote-user': {
        prop: 'remoteUser',
    },
    'req:x-forwarded-for': {
        prop: 'forwardAddr',
    },
    'response-time': {
        prop: 'responseTime',
        type: mongoose.Schema.Types.Number,
        params: [2]
    },
    status: {
        prop: 'status',
        type: mongoose.Schema.Types.Number
    },
    url: {
        prop: 'url',
    },
    'user-agent': {
        prop: 'userAgent',
        type: exports.userAgentSchemaDef
    }
};
