# Utiliza la imagen base oficial de Node.js
FROM node:18 AS builder

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de configuración de la aplicación
COPY package*.json ./
COPY yarn.lock ./
COPY prisma ./prisma/

# Instala las dependencias del proyecto
RUN yarn install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación
RUN yarn build  

# Segunda etapa: imagen final
FROM node:18

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Expone el puerto en el que la aplicación estará escuchando
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["yarn", "start:migrate:prod"]
