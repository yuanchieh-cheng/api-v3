import TokenHandler from "../../../src/user/token/hanlder";
import ParamMissingErros from "../../../src/util/error/400/ParamMissingError";

describe('creatToken',  function(){
    let tokenHandler:TokenHandler;
    const fakeUserTokenService = {
        decode: jest.fn(),
    };
    const fakeTokenService = {
        decode: jest.fn(),
        createRefreshToken: jest.fn(),
        createKvToken: jest.fn(),
    };
    const fakeLogger = {
        error: jest.fn(),
    };
    beforeEach(() => {
        const fakeUserTokenService = {
            decode: jest.fn(),
        };
        const fakeTokenService = {
            decode: jest.fn(),
            createRefreshToken: jest.fn(),
            createKvToken: jest.fn(),
        };
        const fakeLogger = {
            error: jest.fn(),
        };

        tokenHandler = new TokenHandler(
            <any>fakeUserTokenService,
            <any>fakeTokenService,
            <any>fakeLogger
        );
    });

    it('success response', async ()=>{

    })

    it('missing params', async()=>{
        const ctx = {
            body: {
                email: "123"
            },
            query: {}
        };
        try{
            await tokenHandler.createToken(<any>ctx);
        }catch(error){
            expect(error instanceof ParamMissingErros);
        }
    });


})