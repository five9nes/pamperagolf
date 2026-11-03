# Instagram feed

The homepage strip ("From the pampas to the course") shows the six latest posts from
[@pamperagolf](https://www.instagram.com/pamperagolf). It reads them with the Instagram API
(Instagram Login) using one access token. Without a token, or if the token expires, the
strip shows six photos from the Marine Park shoot that link to the profile instead.
Posts refresh at most once an hour.

## One-time setup

Meta changes the labels in its dashboard often, so the wording below may differ slightly.

1. **Make the account professional.** In the Instagram app: Settings → Account type and
   tools → Switch to professional account (Business or Creator both work).
2. **Create a Meta app.** At [developers.facebook.com/apps](https://developers.facebook.com/apps),
   create an app and choose the Instagram use case (manage content on Instagram).
3. **Generate a token.** In the app, open Instagram → API setup with Instagram login →
   Generate access tokens. Add @pamperagolf, sign in, and copy the token. It needs only the
   `instagram_business_basic` permission and lasts 60 days.
4. **Add it to Vercel.** Project → Settings → Environment Variables:
   `INSTAGRAM_ACCESS_TOKEN` for Production and Preview, then redeploy.
   For local development, put the same line in `.env.local`.

## Keeping it alive

Tokens expire after 60 days. Any time after the first 24 hours, extend it with:

```sh
curl "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=YOUR_TOKEN"
```

Put the `access_token` from the response into the Vercel variable and redeploy. A reminder
every ~45 days is enough. If it lapses, nothing breaks: the strip falls back to the shoot photos.
