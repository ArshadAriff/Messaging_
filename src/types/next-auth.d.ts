import "next-Auth";
import { DefaultSession } from "next-Auth";

//redefines already defined datatypes

//All these are to chage the interfaces of callbacks so that it is okay with the user we pass to it rather than the deafult user
//it already tells him

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

//other type of redefining datatypes
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}
