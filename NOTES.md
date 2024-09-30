## Koa

#### [09/30/2024]

Initial thoughts:

I wrote some of the basic boilerplate. The API is a bit nicer than Fastify for what I'm using it for. I haven't tried out any of the CORS/Session middleware, but that is not hard to roll your own if a package doesn't exist.

I don't like the TS typings for some of the objects, like Context - I didn't customize that at all, and the intellisense gave me a whole lot of generic garbage. That makes me worried that customization is going to be a pain in the ass.

I am going to try out Hono next to compare its typings.

