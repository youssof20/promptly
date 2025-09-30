import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from '@promptly/database';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
        // Add subscription tier to session
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { subscriptionTier: true, stripeCustomerId: true }
        });
        if (dbUser) {
          (session.user as any).subscriptionTier = dbUser.subscriptionTier;
          (session.user as any).stripeCustomerId = dbUser.stripeCustomerId;
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Allow sign in
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
