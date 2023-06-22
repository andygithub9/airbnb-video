// https://next-auth.js.org/configuration/nextjs#basic-usage
// https://github.com/nextauthjs/next-auth/issues/7650#issuecomment-1568039166

export { default } from 'next-auth/middleware'

export const config = {
  matcher: ["/trips", "/reservations", "/properties", "/favorites"],
};