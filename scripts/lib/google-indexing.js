const { createSign } = require("node:crypto");

function parseServiceAccount() {
  const raw = process.env.GSC_SERVICE_ACCOUNT;

  if (!raw) {
    return null;
  }

  try {
    if (raw.trim().startsWith("{")) {
      return JSON.parse(raw);
    }

    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch (error) {
    throw new Error(`Unable to parse GSC_SERVICE_ACCOUNT: ${error.message}`);
  }
}

function toBase64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function signJwt(unsignedToken, privateKey) {
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  return signer
    .sign(privateKey, "base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = toBase64Url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/indexing",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now
    })
  );
  const unsignedToken = `${header}.${claim}`;
  const signedToken = signJwt(unsignedToken, serviceAccount.private_key);
  const assertion = `${unsignedToken}.${signedToken}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to mint Google access token: ${body}`);
  }

  const json = await response.json();
  return json.access_token;
}

async function requestIndexing(url) {
  const serviceAccount = parseServiceAccount();

  if (!serviceAccount) {
    return { requested: false, skipped: true };
  }

  const accessToken = await getAccessToken(serviceAccount);
  const response = await fetch(
    "https://indexing.googleapis.com/v3/urlNotifications:publish",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url,
        type: "URL_UPDATED"
      })
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to request indexing: ${body}`);
  }

  return { requested: true, skipped: false };
}

module.exports = {
  requestIndexing
};
