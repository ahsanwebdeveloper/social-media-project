import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { connectToDatabase } from "./db";
import User from "../models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username : {label:"UserName" , type : "text"},
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        image: {label:"image", type:"text"}
      },
      async authorize(credentials) {
  await connectToDatabase();

  const user = await User.findOne({
    email: credentials.email,
  });

  if (!user) {
    throw new Error("No user found");
  }

  const isValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isValid) {
    throw new Error("Invalid password");
  }

  return {
    id: user._id.toString(),
    email: user.email,
    username: user.username, 
    image : user.image
  };
}


    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user){ 
        token.id = user.id;
        token.username= user.username
        token.image=user.image
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user){ 
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.image = token.image;
        
      }
      return session;
    },
  },
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);