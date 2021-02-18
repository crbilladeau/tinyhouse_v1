interface Body<TVariables> {
  query: string;
  // variables is an object holding the variables to be passed into the graphQL request; ? means optional, defined or undefined
  variables?: TVariables;
}

export const server = {
  // property called fetch which defines an async function
  // TData = type data, with parameter any if nothing is specified
  fetch: async <TData = any, TVariables = any>(body: Body<TVariables>) => {
    // window fetch function holds the response
    // gets proxied to localhost:9000/api, the graphQL endpoint
    const res = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // type assertion which overrides the types that TypeScript infers by using 'as' - use sparingly
    return res.json() as Promise<{ data: TData }>;
  }
};

