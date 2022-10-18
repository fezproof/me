import { createCookie } from "@remix-run/cloudflare";

export interface UserPrefs {
  username?: string;
  id?: string;
}

const userPrefs = createCookie("user-prefs", {
  maxAge: 604_800, // one week
  httpOnly: true,
  sameSite: "strict",
  secure: true,
});

export const parseUserCookie = async (cookieHeader: string | null) => {
  const cookie = await userPrefs.parse(cookieHeader);
  return (cookie || {}) as UserPrefs;
};

export const getUserPrefs = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  return parseUserCookie(cookieHeader);
};

export const serializeUserPrefs = (cookie: UserPrefs) => {
  return userPrefs.serialize(cookie);
};
