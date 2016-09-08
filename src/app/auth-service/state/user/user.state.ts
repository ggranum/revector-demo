// REQUEST_USERS: function (state: AuthServiceState, action: Action): AuthServiceState {
//   state.transient.subscriptionStates.users = {
//     state: RvSubscriptionStates.requested
//   }
//   return state
// },
// REQUEST_USERS_FULFILLED: function (state: AuthServiceState, action: Action): AuthServiceState {
//   state.transient.subscriptionStates.users = {
//     state: RvSubscriptionStates.subscribed
//   }
//   return state
// },
// REQUEST_USERS_FAILED: function (state: AuthServiceState, action: Action): AuthServiceState {
//   state.transient.subscriptionStates.users = {
//     state: RvSubscriptionStates.error,
//     error: action.payload
//   }
//   return state
// }
