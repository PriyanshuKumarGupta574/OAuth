import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );
};


// import jwt from "jsonwebtoken";

// export const generateAccessToken = (payload: any) =>
//   jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });

// export const generateRefreshToken = (payload: any) =>
//   jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
