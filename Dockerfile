# Utiliza una imagen de Node.js para construir la aplicación
FROM node:16 as build

# Establece el directorio de trabajo en el contenedor
WORKDIR /main

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Utiliza una imagen de nginx para servir la aplicación
FROM nginx:stable-alpine

# Copia los archivos construidos a la ubicación donde nginx los servirá
COPY --from=build /main/dist /usr/share/nginx/html

# Copia el archivo de configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto en el que nginx está escuchando
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]