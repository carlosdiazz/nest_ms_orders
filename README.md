# Orders MS

## DEV

1. Instalar las dependencia
2. Correr el docker `docker compose up -d`
3. Correr en desarrollo `npm run dev`
4. Para generar el codigo solo Se Preciona Control + Shift + F en Prisma


## PROD

Para la imagen en Producion ejecutar:
```
  docker build -f dockerfile.prod -t ms-orders .
```
PRUEBA