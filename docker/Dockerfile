# Get the latest node image from docker hub (version 19.1.0)
FROM node:19.1.0

# create a directory within the container to mount the source code
WORKDIR /srv/gbxa-api

# copy package.json and package-lock.json to the container - we only copy files required for npm install to decrease build time for unchanged steps
COPY package*.json ./

# Install NPM dependencies
RUN npm install

# copy the source code to the container
COPY . .

# build the application ( compile the TS to JS )
RUN npm run build

# expose the application port to the host machine
EXPOSE 8080

# start the application
CMD ["node", "--max-old-space-size=200", "dist/src/main.js"]