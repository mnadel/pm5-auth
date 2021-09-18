async function buildFormBody(code) {
  // lookup via KV
  const id = await c2.get("client_id")
  const secret = await c2.get("client_secret")

  const form = {
      client_id: id,
      client_secret: secret,
      grant_type: "authorization_code",
      code: code
  }

  let body = []

  for (let property in form) {
      const k = encodeURIComponent(property)
      const v = encodeURIComponent(form[property])
      body.push(k + "=" + v)
  }

  return body.join("&")
}

async function getAccessToken(code) {
  const body = buildFormBody(code)
  console.log(`fetching tokens with: ${body}`)

  const response = await fetch("https://log-dev.concept2.com/oauth/access_token", {
      method: "POST",
      headers: {
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: body
  })

  console.log(`got response: ${JSON.stringify(response)}`)

  return response.json()
}

async function handleRequest(request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  let command = "hmm, can't find access code :("
  
  if (code) {
    const tokens = getAccessToken(code)
    console.log(`got tokens: ${JSON.stringify(tokens)}`)

    if (tokens.access_token && tokens.refresh_token) {
      command = `pm5 -access ${tokens.access_token} -refresh ${tokens.refresh_token}`
    }
  }

  const html = `<!DOCTYPE html>
    <html>
      <head>
      <title>PM5-Book Authentication</title>
    </head>
    <body>
      <div align="center">
        <h1>Welcome to <a href="https://github.com/mnadel/pm5">PM5-Book</a>'s OAuth2 Callback</h1>
        <p>Execute the below to add your credentials:</p>
        <tt>${command}</tt>
      </div>
    </body>
  </html>`

  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  })
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})
