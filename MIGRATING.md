# Migrating between versions

## 8.0.0 from 7.x

If you are using the `proxy` field of the `options` argument of `new signalfx.Ingest()`:
- the value of `proxy` will be in the format: `http://<USER>:<PASSWORD>@<HOST>:<PORT>`
- it must be restructured into an object as such:
    ```js
    {
      protocol: 'http(s)',
      host: '<HOST>',
      port: PORT,
      auth: {
        username: '<USER>',
        password: '<PASSWORD>'
      }
    },
    ```
