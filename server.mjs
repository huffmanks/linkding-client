const BASE_PATH = "./dist";
const API_TARGET = process.env.LINKDING_CONTAINER_URL || "http://linkding:9090";

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    const isLinkdingPath = /^\/(api|assets|favicons|media|previews|static)/.test(url.pathname);

    if (isLinkdingPath) {
      const targetUrl = `${API_TARGET}${url.pathname}${url.search}`;

      const proxyHeaders = new Headers(req.headers);
      proxyHeaders.set("Host", new URL(API_TARGET).host);

      try {
        const response = await fetch(targetUrl, {
          method: req.method,
          headers: proxyHeaders,
          body: req.method !== "GET" && req.method !== "HEAD" ? await req.arrayBuffer() : undefined,
          redirect: "manual",
        });

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      } catch (e) {
        console.error("Proxy Error:", e);
        return new Response("Proxy Error", { status: 502 });
      }
    }

    const filePath = `${BASE_PATH}${url.pathname}`;
    let file = Bun.file(filePath);

    if (!(await file.exists()) || url.pathname === "/") {
      file = Bun.file(`${BASE_PATH}/index.html`);
    }

    return new Response(file);
  },
});
