import { serve } from '@std/http/server.ts'
import staticFiles from 'https://deno.land/x/static_files@1.1.6/mod.ts'

const serveFiles = (req: Request) =>
	staticFiles('www')({
		request: req,
		respondWith: (r: Response) => r,
	})

await serve((req) => {
	if (new URL(req.url).pathname === '/bazaar') {
		return new Response('')
	}
	return serveFiles(req)
})
