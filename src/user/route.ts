import Router from "koa-router";
import IORedis from "ioredis";
import { Db } from "mongodb";

import TokenRoute from "./token/route";

export default async function userRoute(db: Db, cacheDb: IORedis.Redis) {
    const tokenRoute = await TokenRoute(db, cacheDb);

    const router = new Router();
    router.use(tokenRoute.routes());

    return router;
}
