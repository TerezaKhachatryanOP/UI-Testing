export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export const userData: UserData = {
  firstName: "Teressaa",
  lastName: "Khachatryan",
  email: process.env.EMAIL || `test${Date.now()}@example.com`,
  password: process.env.PASSWORD || "superSecretPassword123!",
  confirmPassword: process.env.PASSWORD || "superSecretPassword123!",
};

export interface UserInvalidData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const userInvalidData: UserInvalidData = {
  firstName: "Teressaa",
  lastName: "Khachatryan",
  email: "example.com",
  password: process.env.PASSWORD || "superSecretPassword123!",
  confirmPassword: process.env.PASSWORD || "superSecretPassword123!",
};
