FROM node:20-slim

# התקנת Chromium ותלויות
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-common \
    chromium-driver \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libdrm-dev \
    libgbm-dev \
    libxkbcommon-x11-0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    x11-utils \
    wget \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# משתנים עבור Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
