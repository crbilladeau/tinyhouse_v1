interface Body {
  query: string;
}

export const server = {
  // property called fetch which defines an async function
  // TData = type data, with parameter any if nothing is specified
  fetch: async <TData = any>(body: Body) => {
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

