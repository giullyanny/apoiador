import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import firebase from "../../../services/firebase-connection"

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            scope: 'read:user'
        }),
    ],
    callbacks: {
        async session(session, profile) {
            try {
                const isDonate = await firebase.firestore().collection('users')
                    .doc(String(profile.sub)).get()
                    .then((snapshot) => {
                        if (snapshot.exists) {
                            return {
                                vip: snapshot.data().donate,
                                lastDonate: snapshot.data().lastDonate
                            };
                        }
                        else {
                            return {
                                vip: false,
                                lastDonate: null,
                            };
                        }
                    });

                return {
                    ...session,
                    id: profile.sub,
                    vip: isDonate.vip,
                    lastDonate: isDonate.lastDonate == null ? null : isDonate.lastDonate.toDate()
                }
            } catch (error) {
                console.error('ERROR session: ' + error);
                return {
                    ...session,
                    id: null,
                    vip: false,
                    lastDonate: null,
                }
            }
        },
        async signIn(user, account, profile) {
            const { email } = user

            try {
                return true;
            } catch (error) {
                console.error('ERROR signIn: ' + error);
                return false;
            }
        }
    }
}
export default NextAuth(authOptions)