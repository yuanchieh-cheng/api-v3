import koa from "koa";


import ParamMissingError from "../../util/error/400/ParamMissingError";
import UserTokenService from "../../util/userToken/service";
import TokenService from "./service";
import AuthFail from "../../util/error/401/AuthFail";

import Logger from "../../util/logger/Logger";


export default class TokenHandler {
    constructor(
        private userTokenService: UserTokenService,
        private tokenService: TokenService,
        private logger: Logger
    ) {}

    createToken = async (ctx: koa.Context) => {
        const emailFromRequest = ctx.query.email || ctx.request.body.email;
        const jid = ctx.request.body.jid;
        const token = ctx.request.body.token;
        
        try {
            if (!emailFromRequest) {
                throw new ParamMissingError("email");
            }
            if (!jid) {
                throw new ParamMissingError("jid");
            }
            if (!token) {
                throw new ParamMissingError("token");
            }

            const {
                email,
                userId,
                loginType,
            } = await this.userTokenService.decode(token);

            if (emailFromRequest !== email) {
            }

            const kvTokenContent = {
                userId,
                jid,
                email,
                region: "",
                uniqueId: "",
                loginType,
            };
            const refreshToken = await this.tokenService.createRefreshToken(
                kvTokenContent
            );
            const kvToken = await this.tokenService.createKvToken(
                kvTokenContent
            );

            ctx.body = {
                status: true,
                status_text: "Auth success",
                kv_token: kvToken,
                refreshToken,
            };
        } catch (error) {
            if(error instanceof Error){
                const errorLog = {
                    action: "createToken",
                    type: "error",
                    detail: {
                        token
                    },
                };
                this.logger.error(errorLog);
                
                if(error.message === 'AuthFail: wrong token audit'){
                    throw new AuthFail("wrong token audit");
                }
            }

            throw error;
        }
    };
}
