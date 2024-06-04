# Utiliza la imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN yarn install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación
RUN yarn build

# Expone el puerto en el que la aplicación estará escuchando
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["yarn", "start:dev"]
