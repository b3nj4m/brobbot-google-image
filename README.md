# brobbot-google-image

A brobbot plugin for image searches.

```
brobbot image [me] <query>
```

Googles `query` and returns 1st result's URL.

```
brobbot animate [me] <query>
```

Googles `query` and tries to return the first animated GIF result.

```
brobbot mustache [me] <url>
```

Adds a mustache to the image at the specified url.

```
brobbot mustache [me] <query>
```

Does an image search for `query`, then adds a mustache to the result.

## Configuration

### Referer

```bash
BROBBOT_GOOGLE_IMAGE_REFERER=url
```

Set the referer URL sent to the Google API (see https://developers.google.com/image-search/v1/jsondevguide).
