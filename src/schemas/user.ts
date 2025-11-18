export type UserData = {
  _id?:string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};


export type ChangePassword = {
  currentPassword: string;
  newPassword: string;
}

export type DeleteAccountConfirmation = {
  currentPassword: string;
  confirmationText: string;
  profilePicture: {
    profilePictureURL: string;
    profilePictureID: string;
  }
  createdAt: Date;
  updatedAt: Date;
};