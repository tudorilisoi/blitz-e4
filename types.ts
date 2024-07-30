import { SimpleRolesIsAuthorized } from "@blitzjs/auth"
import { User } from "db"

export type Role = "ADMIN" | "USER"

declare module "@blitzjs/auth" {
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User["id"]
      role: Role
    }
  }
}

// Clrek session claims customized in dashboard
declare global {
  /**
   * If you want to provide custom types for the getAuth().sessionClaims object,
   * simply redeclare this interface in the global namespace and provide your own custom keys.
   */
  interface CustomJwtSessionClaims {
    email: string
    fullName: string
    userId: string
  }
}
