import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

const secret = process.env.JWT_SECRET || "supersecretjwtkey";
const expiration = "2h";

interface TokenUser {
  username: string;
  email: string;
  _id: string;
}

interface AuthContext {
  req: Request;
  user?: TokenUser;
}

export const signToken = ({ username, email, _id }: TokenUser): string => {
  const payload = { username, email, _id };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

export const authMiddleware = ({ req }: AuthContext): AuthContext => {
  let token =
    req.body?.token ||
    req.query?.token ||
    req.headers?.authorization;

  if (req.headers?.authorization && typeof token === "string") {
    token = token.split(" ").pop()?.trim();
  }

  if (!token || typeof token !== "string") {
    return { req };
  }

  try {
    const { data } = jwt.verify(token, secret, {
      maxAge: expiration,
    }) as JwtPayload & { data: TokenUser };

    return { req, user: data };
  } catch {
    console.log("Invalid token");
    return { req };
  }
};