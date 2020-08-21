import Router from "koa-router";
import IORedis from "ioredis";
import { Db } from "mongodb";
import TokenHandler from "./hanlder";
import UserTokenService from "../../util/userToken/service";
import TokenService from "./service";
import TokenModel from "./model";
import { SlackLogger } from "../../util/logger/SlackLogger";

export default async function tokenRoute(
    db: Db,
    cacheDb: IORedis.Redis
) {
    const userTokenService = new UserTokenService();
    const tokenModel = new TokenModel(cacheDb);
    const tokenService = new TokenService(tokenModel);
    const logger = new SlackLogger();
    
    const tokenHandler = new TokenHandler(
        userTokenService,
        tokenService,
        logger
    );

    const router = new Router();

    router.post("/v3/user/obtainToken", tokenHandler.createToken);

    return router;
}