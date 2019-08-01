# EDirectInsure User

This service is responsible to manage user operations

### Patterns

```
role: user, cmd: create
role: user, cmd: select
role: user, cmd: update
role: user, cmd: delete
```

### Service Dependency

- Auth

### Installing

```bash
$ npm i
```

### Package Dependency

 - [seneca](https://github.com/senecajs/seneca)

### Environment Variables

```
USER_HOST # user service host
USER_PORT # user service port

AUTH_HOST # auth service host
AUTH_PORT # auth service port

MONGO_URL # url from mongo server
```

### Tests


```sh
$ npm test
```

Run tests with Node debugger:

```bash
$ npm run test-debugger
```
