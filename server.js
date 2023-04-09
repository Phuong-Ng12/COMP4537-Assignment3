const mongoose = require("mongoose")
const express = require("express")
const { connectDB } = require("./connectDB.js")
const { populatePokemons } = require("./populatePokemons.js")
const { getTypes } = require("./getTypes.js")
const { handleErr } = require("./errorHandler.js")
const { asyncWrapper } = require("./asyncWrapper.js")
const dotenv = require("dotenv")
dotenv.config();
const userModel = require("./userModel.js")
const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require('body-parser')
const jwt_decode = require('jwt-decode');

var userId = new mongoose.Types.ObjectId(1)

const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError,
  PokemonAuthError
} = require("./errors.js")

const app = express()
var pokeModel = null;

const start = asyncWrapper(async () => {
  await connectDB({ "drop": true });
  const pokeSchema = await getTypes();
  pokeModel = await populatePokemons(pokeSchema);
  pokeModel = mongoose.model('pokemons', pokeSchema);

  app.listen(process.env.pokeServerPORT, async (err) => {
    if (err)
      throw new PokemonDbError(err)
    else
      console.log(`Phew! Server is running on port: ${process.env.pokeServerPORT}`);
    const doc_admin = await userModel.findOne({ "username": "admin" })
    if (!doc_admin)
      userModel.create({ username: "admin", password: bcrypt.hashSync("admin", 10), role: "admin", email: "admin@admin.ca" })
  })
})
start()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
const jwt = require("jsonwebtoken")
const morganjson = require('morgan-json');
const format = morganjson({
  date: '[:date[clf]]',
  method: ':method',
  url: ':url',
  status: ':status'
});

function skipOptions(req, res) {
  return req.method === 'OPTIONS';
}

const Logger = require('./models/logger.js')

app.use(morgan(format , { skip: skipOptions }))

app.use( async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    // Skip logging for OPTIONS requests
    return next();
  }
  const { method, url } = req;
  const start = new Date();

  res.on('finish', async () => {
    const { statusCode } = res;
    const end = new Date();
    const responseTime = end - start;

    const logger = new Logger({
      userId,
      method,
      url,
      status: statusCode,
      responseTime,
    });
    
    logger.save()
      .then(() => {
        console.log('Request log saved to MongoDB');
      })
      .catch((err) => {
        console.log('Error saving request log to MongoDB:', err);
      });
  });

  next();
});

app.use(cors())
app.use(cors({
    exposedHeaders: ['auth-token-access', 'auth-token-refresh']
  }))

const bcrypt = require("bcrypt")
app.post('/register', asyncWrapper(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    if (!username || !password || !email) {
      res.status(400).send({errMsg: "Username, password, email cannot be empty"});
      throw new PokemonBadRequest("Username, password, email cannot be empty");
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const userWithHashedPassword = { ...req.body, password: hashedPassword }
  
    const user = await userModel.create(userWithHashedPassword)
    userId = await userModel.findOne({ "username": username }).select('_id')

    res.status(201).send(user)
}))

let refreshTokens = []
app.post('/requestNewAccessToken', asyncWrapper(async (req, res) => {
  const refreshToken = req.header('auth-token-refresh')
  var decoded = jwt_decode(req.header('auth-token-refresh'))
  var username = decoded.user.username;
  userId = await userModel.findOne({ "username": username }).select('_id')

  if (!refreshToken) {
    throw new PokemonAuthError("No Token: Please provide a token.")
  }
  if (!refreshTokens.includes(refreshToken)) { 
    throw new PokemonAuthError("Invalid Token: Please provide a valid token.")
  }
  try {
    const payload = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const accessToken = jwt.sign({ user: payload.user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
    res.header('auth-token-access', accessToken)
    res.send("All good!")
  } catch (error) {
    throw new PokemonAuthError("Invalid Token: Please provide a valid token.")
  }
}))

app.post('/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body
  const user = await userModel.findOne({ username })
  
  if (!user) {
    throw new PokemonAuthError("User not found")
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new PokemonAuthError("Password is incorrect")
  }
  userId = await userModel.findOne({ "username": username }).select('_id')
  const accessToken = jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
  const refreshToken = jwt.sign({ user: user }, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)

  res.header('auth-token-access', accessToken)
  res.header('auth-token-refresh', refreshToken)

  res.send(user)
}))
app.use((err, req, res, next) => {
  if (err instanceof PokemonAuthError) {
    return res.status(401).json({ error: err.message })
  }
  return res.status(500).json({ error: 'Internal server error' })
})

app.get('/logout', asyncWrapper(async (req, res) => {
  const accessToken = req.header('auth-token-access');
  if (!accessToken) {
    throw new PokemonAuthError('No access token provided');
  }
  const index = refreshTokens.indexOf(accessToken);
  if (index !== -1) {
    refreshTokens.splice(index, 1);
  }
  res.header('auth-token-access', "")
  res.send("Logged out")
}))

const authUser = asyncWrapper(async (req, res, next) => {
  const token = req.header('auth-token-access')

  if (!token) {
    throw new PokemonAuthError("No Token: Please provide the access token using the headers.")
  }
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    next()
  } catch (err) {
    throw new PokemonAuthError("Invalid Token Verification. Log in again.")
  }
})

const authAdmin = asyncWrapper(async (req, res, next) => {
  const payload = jwt.verify(req.header('auth-token-access'), process.env.ACCESS_TOKEN_SECRET)
  if (payload?.user?.role == "admin") {
    return next()
  }
  throw new PokemonAuthError("Access denied")
})

app.use(authUser)
app.get('/api/v1/pokemons', asyncWrapper(async (req, res) => {
  if (!req.query["count"])
    req.query["count"] = 10
  if (!req.query["after"])
    req.query["after"] = 0
  const docs = await pokeModel.find({})
    .sort({ "id": 1 })
    .skip(req.query["after"])
    .limit(req.query["count"])
  res.json(docs)
}))

app.get('/api/v1/pokemon', asyncWrapper(async (req, res) => {
  const { id } = req.query
  const docs = await pokeModel.find({ "id": id })
  if (docs.length != 0) res.json(docs)
  else res.json({ errMsg: "Pokemon not found" })
}))

app.use(authAdmin)
app.post('/api/v1/pokemon/', asyncWrapper(async (req, res) => {
  try {
  if (!req.body.id) throw new PokemonBadRequestMissingID()
  const poke = await pokeModel.find({ "id": req.body.id })
  if (poke.length != 0) throw new PokemonDuplicateError()
  const pokeDoc = await pokeModel.create(req.body)
  res.json({
    msg: "Added Successfully"
  })
  } catch (err) { res.json(handleErr(err)) }
}))

app.delete('/api/v1/pokemon', asyncWrapper(async (req, res) => {
  try {
  const docs = await pokeModel.findOneAndRemove({ id: req.query.id })
  if (docs)
    res.json({
      msg: "Deleted Successfully"
    })
  else
    res.json({ errMsg: "Pokemon not found" })
    throw new PokemonNotFoundError("");
  } catch (err) { res.json(handleErr(err)) }
}))

app.put('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  try {
  const selection = { id: req.params.id }
  const update = req.body
  const options = {
    new: true,
    runValidators: true,
    overwrite: true
  }
  const doc = await pokeModel.findOneAndUpdate(selection, update, options)
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    res.json({ msg: "Not found", })
    throw new PokemonNotFoundError("");
  }
  } catch (err) { res.json(handleErr(err)) }
}))

app.patch('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  try {
  const selection = { id: req.params.id }
  const update = req.body
  const options = {
    new: true,
    runValidators: true
  }
  const doc = await pokeModel.findOneAndUpdate(selection, update, options)
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    res.json({  msg: "Not found" })
    throw new PokemonNotFoundError("");
  }
  } catch (err) { res.json(handleErr(err)) }
}))



app.get('/report', async (req, res) => {
  console.log("Report requested");
  var decoded = jwt_decode(req.header('auth-token-access'))
  var username = decoded.user.username;
  userId = await userModel.findOne({ "username": username }).select('_id')

  if(req.query.id === "1"){
    //Unique API users over a period of time
    var UniqueAPIUsersOverPeriodOfTime = await Logger.aggregate([
      {
        $match: {
          date: {
            $gte: new Date("2023-01-01T00:00:00Z"),
            $lt: new Date("2023-12-31T23:59:59Z")
          }
        }
      },
      {
        $lookup: {
          from: "pokeusers",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $group: {
          _id: "$userId",
          user: {
            $first: "$user.username"
          },
          email: {
            $first: "$user.email"
          },
          role: {
            $first: "$user.role"
          },
          date: {
            $first: "$user.date"
          },
          count: {
            $sum: 1
          },
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ])
    res.send(UniqueAPIUsersOverPeriodOfTime)
  } else if(req.query.id === "2"){
    //Top API users over period of time:
    var TopAPIUsersOverPeriodOfTime;
    Logger.aggregate([
      {
        $match: {
          date: {
            $gte: new Date("2023-01-01T00:00:00Z"),
            $lt: new Date("2023-12-31T23:59:59Z")
          }
        }
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            url: "$url",
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$date"
              }
            }
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          "_id.userId": 1,
          "_id.date": 1,
          count: -1
        }
      },
      {
        $group: {
          _id: "$_id.userId",
          urls: {
            $push: {
              url: "$_id.url",
              date: "$_id.date",
              count: "$count"
            }
          },
          total: {
            $sum: "$count"
          }
        }
      },
      {
        $sort: {
          total: -1
        }
      },
      {
        $limit: 10
      }
    ]) 
      .then(async (logs) => {
        // Find users from PokeUser collection
        const users = await userModel.find({ _id: { $in: logs.map((log) => log._id) } }).select('username email role');
        TopAPIUsersOverPeriodOfTime = logs.map((log) => {
          const user = users.find((u) => u._id.equals(log._id));
          return {
            username: user.username,
            email: user.email,
            role: user.role,
            urls: log.urls,
          };
        });
        var outputTopAPIUsersOverPeriodOfTime = [];
        outputTopAPIUsersOverPeriodOfTime = TopAPIUsersOverPeriodOfTime.flatMap(({ username, email, role, urls }) =>
        urls.map(({ url, date, count }) => ({ username, email, role, url, date, count })));
        res.send(outputTopAPIUsersOverPeriodOfTime)
      })
  } else if(req.query.id === "3"){
    var TopUsersByEndpointTable = await Logger.aggregate([
      {
        $group: {
          _id: { url: '$url', userId: '$userId'},
          count: { $sum: 1}
        }
      },
      { $sort: {'_id.url': 1, count: -1}},
      {
        $group: {
          _id: '$_id.url',
          topUsers: { $push: { userId: '$_id.userId', count: '$count'}}
        }
      }
    ]).lookup({
      from: 'pokeusers',
      localField: 'topUsers.userId',
      foreignField: '_id',
      as: 'tpUsers',
    }).project({
      'tpUsers.username': 1,
      'tpUsers.email': 1,
      'tpUsers.role': 1,
      'topUsers.count': 1
    })

    const outputTopUsersByEndpointTable = TopUsersByEndpointTable.map((data) => {
      return {
        _idReport: data._id,
        count: data.topUsers[0].count,
        username: data.tpUsers[0].username,
        email: data.tpUsers[0].email,
        role: data.tpUsers[0].role
      };
    });
    res.send(outputTopUsersByEndpointTable)
  } else if(req.query.id === "4"){
    var Errors4xxByEnpointTable = await Logger.aggregate([
      {$match: {status: { $gte: 400, $lt: 500}}},
      {$group: {_id: {'url': '$url', 'method': '$method', 'status': '$status'},count: { $sum: 1 }}}
    ])
    const outputErrors4xxByEnpointTable = Errors4xxByEnpointTable.map(({ _id, count }) => ({
      _idErrors4xx: _id.url,
      method: _id.method,
      status: _id.status,
      countEndpoint: count
    }));
    res.send(outputErrors4xxByEnpointTable)
  } else if(req.query.id === "5"){
    var RecentErrorsTable = await Logger.find({
      status: { $gte: 400},
      date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)}
    }).sort({ date: -1});
    const outputRecentErrorsTable = RecentErrorsTable.map(({ method, url, status, responseTime, date}) => ({
      _idRecentErrors: url,
      method,
      status,
      responseTime,
      date
    }));
    res.send(outputRecentErrorsTable)
  } else {
    res.send(`Table ${req.query.id} has not been queried yet`)
  }
})


app.use(handleErr)