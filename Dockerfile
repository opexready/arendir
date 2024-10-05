# Etapa 1: Construcción del proyecto
FROM node:16 as build-stage

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de package.json y package-lock.json (si lo tienes)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de tu proyecto
COPY . .

# Compila la aplicación para producción
RUN npm run build

# Etapa 2: Servir la aplicación
FROM nginx:alpine as production-stage

# Copia los archivos generados en el build anterior hacia Nginx
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expone el puerto en el que Nginx servirá la aplicación
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
