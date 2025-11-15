export interface PropsError {
    messageError: string
}

export interface HandleApiErrorOptions {
  response: Response;
  data?: any;
  location?: string; // name Api 
}

// {
// name: "",
// surname: "",
// age: 0,
// email: "",
// password: "",
// profilePicture: {
//   profilePictureURL: "",
//   profilePictureID: ","
// },
// createdAt: new Date(),
// updatedAt: new Date()
// }