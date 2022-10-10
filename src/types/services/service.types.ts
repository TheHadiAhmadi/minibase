export type Service<Params, ReturnType> = (
  request: Params
) => Promise<ReturnType>;
