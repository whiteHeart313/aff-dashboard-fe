export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export type AuthResponse = {
  success: "true";
  token: string;
  user: User
} | {
  success: "false";
  error: string;
};

export interface User {
  id: string;
  email: string;
  name: string;
}