# Туристическая компания


### swagger api

https://blog.cloudboost.io/adding-swagger-to-existing-node-js-project-92a6624b855b

1. `npm i swagger-ui-express -S`
2. `nano swagger.json`

пример: https://github.com/GenFirst/swagger-to-existing-nodejs-project/blob/master/backend/swagger.json

поменять url `сервера` и `api`:

```json
  "host": "localhost:5333",
  "basePath": "/api",
```
3. добавить в код сервера, после создания приложеия `app`:
```js
    let swaggerUi = require('swagger-ui-express'),
        swaggerDocument = require('./../swagger.json');
    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```
4. `npm start`

### swagger api variant

**Был вариант иначе сделать поддержку swagger**

https://mean-dev.info/restful-api-node-js-swagger/

1. `npm install -g swagger`
2. `swagger project create travel_company`
> выбрать express
3. `swagger project start`
> http://127.0.0.1:10010/hello
4. `swagger project edit`
> http://127.0.0.1:44181

**Также возможно оформление через jsdoc**
