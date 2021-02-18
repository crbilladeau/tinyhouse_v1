interface Body {
  query: string;
}

export const server = {
  // property called fetch which defines an async function
  fetch: async (body: Body) => {
    // window fetch function holds the response
    // gets proxied to localhost:9000/api, the graphQL endpoint
    const res = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return res.json();
  }
};

