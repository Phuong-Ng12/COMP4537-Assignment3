# morgan-mongo
[![Build Status](https://travis-ci.com/pmstss/morgan-mongo.svg?branch=master)](https://travis-ci.com/pmstss/morgan-mongo) [![Known Vulnerabilities](https://snyk.io/test/github/pmstss/morgan-mongo/badge.svg?targetFile=package.json)](https://snyk.io/test/github/pmstss/morgan-mongo?targetFile=package.json)

Node.js HTTP request logger middleware for [Express](https://github.com/expressjs/express) 
with [MongoDB](https://www.mongodb.com) as storage; [morgan](https://github.com/expressjs/morgan) and [Mongoose](https://github.com/Automattic/mongoose) based.

Inspired by [Storing Log Data](https://docs.mongodb.com/ecosystem/use-cases/storing-log-data) MongoDB article.

Built-in support for string, numeric, date and user agent tokens parsing.

Highly configurable output with meaningful defaults; support for standart mongoose and morgan options.  

[Output Live Demo](https://morgan-mongo.herokuapp.com)

### Installation
    npm install morgan-mongo --save

[![NPM](https://nodei.co/npm/morgan-mongo.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/morgan-mongo/)

### Usage

```TypeScript
import { morganMongoMiddleware } from 'morgan-mongo';
const app = express();
...
app.use(morganMongoMiddleware());
```

### Output sample
<details><summary>JSON sample</summary>
    
```js
{
    "_id" : ObjectId("5c012d5375bad213309ad4c3"),
    "userAgent" : {
        "family" : "Chrome",
        "major" : 70,
        "minor" : 0,
        "patch" : 3538,
        "source" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36"
    },
    "date" : ISODate("2018-11-30T12:30:11.814Z"),
    "httpVersion" : "1.1",
    "method" : "GET",
    "remoteAddr" : "::1",
    "responseTime" : 92.56,
    "status" : 200,
    "url" : "/quotes?date=2018-11-28"
}
```

</details>

### API

    morganMongoMiddleware(options?, connectionOptions?, schemaOptions?, morganOptions?)

#### options
Custom options to provide MongoDB connection string and to control entries parsing.
```TypeScript
export type OptionsType = {
    connectionString?: string;
    includeOnly?: string[];
    exclude?: string[];
    augment?: MappingDescriptor;
    customMapping?: MappingDescriptor;
};
```
`connectionString`: mongo connection string, defaults to `mongodb://localhost:27017/morgan-mongo`. 
If you use MongoDB Atlas (i.e. connection string with `mongodb+srv` protocol schema), `dbName` 
must be additionally provided in `connectionOptions`.

Usage samples of other options can be found in [tests](test/morgan-mongo.spec.ts). 
MappingDescriptor is described in [Custom Mapping](README.md#custom-mappings) section below.. 

#### connectionOptions
mongoose [ConnectionOptions](https://mongoosejs.com/docs/api.html#mongoose_Mongoose-connect)

#### schemaOptions
mongoose [SchemaOptions](https://mongoosejs.com/docs/api.html#schema_Schema)

#### morganOptions
morgan [Options](https://github.com/expressjs/morgan#options)

### Custom mappings

<details>
<summary>View advanced configuration options</summary>

This section is subject for improvements. Feel free to open issus in case of any questions.

##### MappingDescriptor
Describes mappings from morgan tokens to properties in mongo document:
```TypeScript
export type MappingDescriptor = { 
    [tokenName: string]: MappingMeta<any> 
};
```

Default mappings are described by [defaultMappingDescriptor](src/default-mapping-descriptor.ts).

##### MappingMeta
Describes mapping of single morgan token to property in mongo document:
```TypeScript
export type MappingMeta<T> = {
    prop: string,
    type?: typeof mongoose.SchemaType | mongoose.SchemaDefinition,
    params?: any[],
    handler?: Handler<T>
};
```
* `prop`: mongo document property name
* `type`: mongoose SchemaType. If `handler` is not provided explicitly, default type handler will be used to 
handle String, Number, Dates and [custom user agent type](src/default-mapping-descriptor.ts). If type is omitted 
token value will be unchanged string. 
* `params`: morgan token parameters. In case of having multiple same tokens with different parameters 
to keep uniqueness of keys in MappingDescriptor, parameters can be passed as part of token name there:
```TypeScript
 {
    'req:cache-control': {
        prop: 'cacheControl' // maps 'Cache-Control' request header to cacheControl property in mongo document
    },
    'req:content-type': {
        prop: 'contentType' // maps 'Content-Type' request header to contentType property in mongo document
    }

 }
 ```
* `handler`: optional custom processing of token value (string) to any desired output type

</details>

### Contribution
Feel free to contribute by opening issues with any questions, bug reports or feature requests.

### Credits
[mongoose-morgan](https://github.com/nemanjapetrovic/mongoose-morgan) - entries are not parsed but stored in mongo as strings.

### License
  [MIT](LICENSE)
