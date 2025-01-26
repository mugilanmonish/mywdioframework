# Use Node.js base image with specific version
FROM node:22.11.0

# Install required dependencies for Chrome
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install Firefox dependencies
RUN wget -q "https://ftp.mozilla.org/pub/firefox/releases/latest/linux-x86_64/en-US/firefox.tar.bz2" && \
    tar -xjf firefox.tar.bz2 -C /opt/ && \
    ln -s /opt/firefox/firefox /usr/bin/firefox && \
    rm firefox.tar.bz2

# Install Java 17 (OpenJDK)
RUN apt-get update && apt-get install -y openjdk-17-jre && rm -rf /var/lib/apt/lists/*

# Set environment variables for Java
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="$JAVA_HOME/bin:$PATH"

# Install allure globally in docker container
RUN npm install -g allure-commandline

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install project dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project into the container
COPY . .

# Expose ports (for Selenium/Grid or Allure if needed)
# EXPOSE 4444

# Default command to run your WDIO tests
# CMD ["npx", "cross-env", "BROWSERSTACK=false", "BROWSER_NAME=firefox", "DOCKER=true" ,"ENV=prod", "wdio", "run", "./wdio.web.conf.js", "--suite", "smoke"]
