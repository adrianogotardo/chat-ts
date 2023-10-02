import { NextAuthOptions } from "next-auth"
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter"
import { db } from "./db"
import GoogleProvider from "next-auth/providers/google"
import { fetchRedis } from "@/helpers/redis"

function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if(!clientId || clientId.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID')
    }

    if(!clientSecret || clientSecret.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID')
    }

    return { clientId, clientSecret }
}

export const authOptions: NextAuthOptions = { // esse conceito é revisado a 01:06:00 do vídeo
    adapter: UpstashRedisAdapter(db), // dita que toda vez que a autenticaçao é chamada uma ação será executada automaticamente em nosso banco de dados
    session: {
        strategy: "jwt" // pode ser 'jwt' ou 'database', sendo que 'jwt'indica que não lidamos com a sessão no banco de dados, mas sim nos middlewares
    },
    pages: {
        signIn: '/login'
    },
    providers: [  // indica quais provedores de autenticação estaremos utilizando (nesse caso, usaremos o do Google para ser possível logar pelo Gmail)
    GoogleProvider({
        clientId: getGoogleCredentials().clientId,
        clientSecret: getGoogleCredentials().clientSecret
    })
], 
    callbacks: {  // callbacks são ações executadas quando o next auth detecta certos eventos
        async jwt({ token, user }) {
            const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as string | null

            if (!dbUserResult) {
                if (user) {
                    token.id = user!.id
                }
                return token
            }

            const dbUser = JSON.parse(dbUserResult) as User

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
            }
        },
        async session({ session, token }) { // sempre que uma sessão é gerada, quando verificamos se um usuário tem uma sessão através de outras aplicações, isso é o que é acessado
            if(token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }

            return session
        },
        redirect() {
            return '/dashboard'
        }
    }
}