FROM 2bbaec62f09d
MAINTAINER Do Hai Dong<DongDH1@fsoft.com.vn>

ENV APP_HOME=/src/app

COPY package.json $APP_HOME/api/

WORKDIR $APP_HOME/api

COPY .npmrc ~/

#RUN npm install

COPY . $APP_HOME/api

CMD ["npm", "start"]