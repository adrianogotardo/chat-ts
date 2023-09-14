import { NextAuthOptions } from "next-auth"
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter"
import { db } from "./db"
import GoogleProvider from "next-auth/providers/google"

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

export const authOptions: NextAuthOptions = {
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
}