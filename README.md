# PM5-Auth

A Concpet2 Logbook OAuth2 handler implemented as a Cloudflare Worker.

# Setup

1. Create a KV namespace, add `client_id` and `client_secret` values from your registered OAuth2 application.
1. Bind that KV namespace to your worker as `c2`.
1. Update `wrangler.toml` to update the account and the KV namespace ids.
