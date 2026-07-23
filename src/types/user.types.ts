export interface CreateUserBody {
  email: string;
  password: string;
}

export interface UpdateEmailBody {
  newEmail: string;
}

export interface UpdatePasswordBody {
  newPassword: string;
}

export interface UserParams {
  email: string;
}
