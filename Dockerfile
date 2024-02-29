FROM node:15

WORKDIR /app

COPY package.json .

#--only=production will prevent dev dependencies from installing 

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production;\
    fi

# seperate package.json copy and source code copy: otherwise will run npm install when source code changes

COPY . ./

#env variable

ENV PORT 3000

EXPOSE $PORT

# at runtime

CMD ["node","index.js"] 