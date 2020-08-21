import admin from "firebase-admin"
import serviceAccount from "../../serviceAccountKey.json"

export default class UserTokenService {
    private admin: admin.app.App
    constructor() {
        this.admin = admin.initializeApp({
            credential: admin.credential.cert(<admin.ServiceAccount>serviceAccount),
            databaseURL: "https://api-project-317780763450.firebaseio.com",
        });
    }

    async decode(userFirebaseToken: string){
        const decodedToken = await this.admin
            .auth()
            .verifyIdToken(userFirebaseToken);
        const userId = decodedToken.uid;
        const email = decodedToken.email!.toLowerCase();
        const isEmailVerified = decodedToken.is_email_verified;
        const loginType = decodedToken.firebase.sign_in_provider;
        const picture = decodedToken.photoURL || null;
        const identities = decodedToken.firebase.identities;

        if (decodedToken.aud !== "api-project-317780763450") {
            throw Error("AuthFail: wrong token audit")
        }

        return {
            email,
            userId,
            isEmailVerified,
            loginType,
            picture,
            identities,
        };
    }
}
