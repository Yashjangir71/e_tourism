import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
import TouristModel from "@/models/Tourist.model";
import VendorModel from "@/models/Vendor.model";
import { debug } from "console";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text", placeholder: "text" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" }, // new field
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const { identifier, password, userType } = credentials;

          let user;

          if (userType == "tourist") {
            user = await TouristModel.findOne({
              $or: [
                { email: credentials.identifier },
                { username: credentials.identifier },
              ],
            });

          } else if (userType == "host") {
            user = await VendorModel.findOne({
              $or: [
                { email: credentials.identifier },
                { username: credentials.identifier },
              ],
            });

          } else {
            throw new Error("Invalid user type");
          }

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isEmailVerified) {
            throw new Error("Please verify your account before login");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return {
              _id: String(user._id),
              email: user.email,
              username: user.username,
              isEmailVerified: user.isEmailVerified,
              userType
            };
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id,
          isEmailVerified: token.isEmailVerified,
          username: token.username,
          userType: token.userType,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isEmailVerified = user.isEmailVerified;
        token.username = user.username;
        token.userType = user.userType;
      }
      return token;
    },
  },
};
