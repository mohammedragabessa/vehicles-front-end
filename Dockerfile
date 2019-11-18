# stage 1
FROM node:latest as node 
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=8080

#stage 2
FROM nginx:alpine
EXPOSE 8080
COPY --from=node /app/dist /usr/share/nginx/html

CMD ["npm", "start"]