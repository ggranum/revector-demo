export interface Normalizable<S,N> {
  normalize(source:S):N
  denormalize(normalForm:N):this
}
