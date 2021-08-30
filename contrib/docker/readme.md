# How to change default hostname or port

To change the hostname, simply set the DELVEN_HOST environment variable

```sh
export DELVEN_HOST=<YOUR_HOSTNAME>
```
If you want to change the port, change the entryPoints.web.address part of traefik image command in `docker-compose.yml`

```sh
services:
  traefik:
    command:
      - "--providers.docker.exposedByDefault=false"
      - "--providers.docker.network=delvnet"
      - "--entryPoints.web.address=:<YOUR_PORT>"
```
