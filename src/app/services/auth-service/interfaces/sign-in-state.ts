import {RvError} from "@revector/shared";

export enum SignInStates {
  unknown = 1,
  signedOut = 10,
  signingIn = 20,
  signedIn = 30,
  signInFailed = 40,
  signingOut = 50,
  signingUp = 60,
  newAccount = 70,
  signUpFailed = 80,
}

export interface SignInState {
  state: SignInStates,
  error?: RvError
}
