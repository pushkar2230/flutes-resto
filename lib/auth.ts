import { SignJWT, jwtVerify } from "jose";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is missing in .env");
}

const secretKey = new TextEncoder().encode(secret);

export async function createAdminToken(adminId: string) {
  return new SignJWT({
    adminId,
    role: "ADMIN",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);

    if (payload.role !== "ADMIN" || !payload.adminId) {
      return null;
    }

    return {
      adminId: String(payload.adminId),
      role: "ADMIN",
    };
  } catch {
    return null;
  }
}