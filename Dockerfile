FROM bitnami/node:18

ENV APP_USER=app
ENV APP_DIR="/$APP_USER"

RUN mkdir -p /.npm/_cacache && chmod g+rwX /.npm/_cacache && chown -R 10000:10000 "/.npm"

COPY . $APP_DIR
WORKDIR $APP_DIR
RUN npm ci

EXPOSE 3000
CMD ["npm", "start"]
