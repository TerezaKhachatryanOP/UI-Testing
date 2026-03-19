export interface UserData {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export const userData: UserData = {
  firstName: "Teressaa",
  lastName: "Khachatryan",
  email: process.env.EMAIL || `test${Date.now()}@example.com`,
  password: process.env.PASSWORD || "superSecretPassword123!"
};