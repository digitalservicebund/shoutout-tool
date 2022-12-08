FROM bitnami/node:18

ENV APP_USER=app
ENV APP_DIR="/$APP_USER"

COPY . $APP_DIR
WORKDIR $APP_DIR
RUN npm ci

EXPOSE 3000
CMD ["npm", "start"]
