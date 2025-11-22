/**
 * Represents a user stored in the system.
 *
 * Fields marked optional may be omitted when creating a new user or when
 * certain metadata has not yet been populated by the backend.
 */
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


/**
 * Payload used to change a user's password.
 */
export type ChangePassword = {
  currentPassword: string;
  newPassword: string;
}

/**
 * Structure expected when confirming account deletion.
 * Includes a confirmation text and the user's current password for safety.
 */
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