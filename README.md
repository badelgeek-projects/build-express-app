# Welcome to build-express-app 👋
![npx](https://img.shields.io/badge/npx-%E2%9D%A4%EF%B8%8F-lightgray)
[![Version](https://img.shields.io/npm/v/build-express-app.svg)](https://www.npmjs.com/package/build-express-app)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/badelgeek-projects/build-express-app#readme)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/badelgeek-projects/build-express-app/graphs/commit-activity)


---
**!!! DON'T USE npm install => USE npx !!!**

---

> Build Node.js + Express App easy and fast

> Ready to go app folder with different folder structure
- basic
- middleware
- ... (coming soon)

## Usage

### Default options
```sh
npx build-express-app appName
```

### Folder Structure
#### Middleware
```sh
npx build-express-app --folder middleware appName
```

```
├── README.md
├── app.js
├── middlewares
│   ├── errors.js
│   └── index.js
├── package-lock.json
├── package.json
├── public
│   ├── css
│   │   ├── reset.css
│   │   └── style.css
│   ├── images
│   │   └── node-express.png
│   └── js
│       └── script.js
├── routes
│   ├── errors.js
│   └── index.js
└── views
    ├── 404.ejs
    ├── example.html
    ├── index.ejs
    └── partials
        ├── _footer.ejs
        └── _head.ejs
```

#### Basic
```sh
npx build-express-app  appName
```

```
├── README.md
├── app.js
├── package-lock.json
├── package.json
├── public
│   ├── css
│   │   ├── reset.css
│   │   └── style.css
│   ├── images
│   │   └── node-express.png
│   └── js
│       └── script.js
├── routes
│   ├── errors.js
│   └── index.js
└── views
    ├── 404.ejs
    ├── example.html
    ├── index.ejs
    └── partials
        ├── _footer.ejs
        └── _head.ejs
```

### Listening Port
```sh
npx build-express-app --port 8080 appName
```

## Help

```sh
npx build-express-app help
```


## Author

👤 **Abdelkarim MEHIAOUI**

* Twitter: [@badelgeek](https://twitter.com/badelgeek)
* Github: [@badelgeek](https://github.com/badelgeek)
* LinkedIn: [@abdelkarim-mehiaoui](https://linkedin.com/in/abdelkarim-mehiaoui)

## Show your support

Give a ⭐️ if this project helped you!


## 📝 License

Copyright © 2022 [Abdelkarim MEHIAOUI](https://github.com/badelgeek).

This project is [ISC](https://github.com/badelgeek-projects/build-express-app/blob/master/LICENSE) licensed.

***
