import Koa from "koa";
import bodyParser from "koa-bodyparser";
import mongodb from "mongodb";
import Redis from "ioredis";
import util from "util";

import ErrorReturn from "./util/middleware/errorReturn";

import UserRoute from "./user/route";

import credential from "./credential.json";

async function main() {
    const dbClient = await connectDb();
    const cacheClient = await connectCacheDb();

    const userRoute = await UserRoute(dbClient.db("ivuu"), cacheClient);

    const app = new Koa();

    app.use(bodyParser({
        enableTypes: ['json']
    }));
    app.use(ErrorReturn);
    app.use(userRoute.routes());

    app.listen(3000);
}

main();

async function connectDb() {
    const url = util.format(
        "mongodb://%s:%s@%s:%d/%s",
        credential.database.uname,
        credential.database.passwd,
        credential.database.host,
        credential.database.port,
        credential.database.db
    );
    const client = await mongodb.connect(url);
    return client;
}

async function connectCacheDb() {
    const redis = new Redis({
        port: credential.cacheDb.port,
        host: credential.cacheDb.host,
        family: 4,
        password: credential.cacheDb.auth_pass,
        db: 0,
        showFriendlyErrorStack: true,
    });
    return redis;
}
