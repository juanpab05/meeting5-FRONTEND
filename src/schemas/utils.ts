/**
 * Props used to render a generic error component.
 */
export interface PropsError {
  /** Human-readable error message to display. */
  messageError: string;
}

/**
 * Options passed to an API error handler utility.
 *
 * - `response` is the fetch/HTTP Response object returned by the request.
 * - `data` may contain a parsed body from the server (if available).
 * - `location` is an optional label identifying which API or call produced the error.
 */
export interface HandleApiErrorOptions {
  response: Response;
  data?: any;
  /** Optional identifier for which API or endpoint raised the error. */
  location?: string;
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