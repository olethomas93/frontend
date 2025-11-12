FROM node:20

# Maintainer
LABEL maintainer Bjorn Ole Lindseth "jorgen@ctrl.as"

# Environment <development, production>
ENV running_state=production

# Set timezone
ENV TZ=Europe/Oslo

# Set variables
ARG user_id=1000 
ARG group_id=1000

# Set to true in env if you want to prebuild nuxt
ARG prebuild="true"

# Create dir and set timezone
RUN mkdir -p /srv/node/app/node_modules && chown -R node:node /srv/node/app \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && apt-get update \
    && apt-get install -y --no-install-recommends mc net-tools \
    && rm -rf /var/lib/apt/lists/*

# Set working dir
WORKDIR /srv/node/app

# Lets Change the user uid if we are mounting the disc place outside the container
# The user need the same uid to get access to the disc
RUN groupmod -g $group_id node \
    && usermod -u $user_id -g $group_id node \
    && chown node:node -R /srv/node

# Copy over the package so we can install node dep. inside the docker
COPY package*.json ./

COPY ./deploy_scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
# Gjør skriptet kjørbart
RUN chmod +x /usr/local/bin/entrypoint.sh

# Chacge the user so node dont run as root
USER node

# Install the app
RUN npm install

# Make shure node is the owner
COPY --chown=node:node . .

RUN if [ "$prebuild" = "true" ]; then \
        npm run build; \
    fi


# Expose the running app on port
EXPOSE 8654

# Start the app
# We dont need a processmanager here sins its running in docker
# So pm2 for example is not nessesary here
# CMD [ "npm", "run", "as_docker1"]
CMD [ "/usr/local/bin/entrypoint.sh" ]
