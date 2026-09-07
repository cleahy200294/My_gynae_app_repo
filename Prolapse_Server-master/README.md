# MyGynae API

Go/Gin API for the MyGynae proof of concept. Production configuration is supplied through environment variables; secrets must not be committed.

## Required configuration

- `DB_DSN`: Go MySQL driver DSN. On Cloud Run, use the Cloud SQL Unix socket.
- `JWT_SECRET`: random secret of at least 32 characters.
- `ALLOWED_ORIGINS`: comma-separated browser origins allowed by CORS.
- `GOOGLE_CLOUD_PROJECT`: project used by the Translation API.

SMTP variables are only required by the legacy captcha/PDF email endpoints.

## Health check

`GET /api/health` returns `{"status":"ok"}` when the process and database initialization are healthy.

## Container

```sh
docker build -t mygynae-api .
docker run --rm -p 8080:8080 --env-file .env mygynae-api
```

Uploaded files currently use Cloud Run's ephemeral filesystem and are not durable. Migrate document storage to Cloud Storage before relying on uploads.
