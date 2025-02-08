FROM node:22-slim

# Avoid running as root
RUN userdel -r node && \
    useradd -ms /bin/bash node && \
    mkdir -p /app && \
    chown -R node:node /app

WORKDIR /app

USER node

COPY --chown=node:node package*.json ./

RUN npm install

EXPOSE 5173