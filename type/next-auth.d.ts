declare module "next-auth" {
    interface User {
      id: string
      name: string
      email: string
      role: string
      department: string | null
    }
  
    interface Session {
      user: DefaultSession["user"] & {
        id: string
        role: string
        department?: string | null
      }
    }
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      id: string
      sub: string
      role: string
      department?: string | null
    }
  }
  