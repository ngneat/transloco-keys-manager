<p align="center">
 <img width="50%" height="50%" src="./logo.png">
</p>

[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors-)
[![Build Status](https://travis-ci.org/ngneat/transloco-keys-manager.svg?branch=master)](https://travis-ci.org/ngneat/transloco-keys-manager)
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![coc-badge](https://img.shields.io/badge/codeof-conduct-ff69b4.svg?style=flat-square)]()
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e5079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Join the chat at https://gitter.im/ngneat-transloco](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/ngneat-transloco/lobby?source=orgpage)

> 🦄 The Key to a Better Translation Experience

Translation is a tiresome and repetitive task. Each time we add new text, we need to create a new entry in the translation file, find the correct placement for it, etc. Moreover, when we delete existing keys, we need to remember to remove them from each translation file.

To make the process less burdensome, we've created two tools for the Transloco library, which will do the monotonous work for you.

## 🍻Features

- ✅ &nbsp;Extract Translate Keys
- ✅ &nbsp;Scopes Support
- ✅ &nbsp;Webpack Plugin
- ✅ &nbsp;Find Missing and Extra Keys

## 📖 Table of Contents

- [Installation](#-installation)
- [Keys Extractor](#-keys-extractor)
  - [CLI](#cli-usage)
  - [Webpack Plugin](#webpack-plugin)
  - [Scopes Support](#scopes-support)
  - [Inline loaders](#inline-loaders)
  - [Dynamic Keys](#dynamic-keys)
  - [Marker Function](#marker-function)
  - [Extra Support](#extra-support)
- [Keys Detective](#-keys-detective)
- [Options](#-options)
- [Transloco Config File](#transloco-config-file)
- [Debugging](#-debugging)

## 🌩 Installation

### Schematics

Assuming you've already added Transloco to your project, run the following schematics command:

```
ng g @ngneat/transloco:keys-manager
```

At this point, you'll have to choose whether you want to use the CLI, Webpack Plugin, or both. The project will be updated according to your choice.

**Note:** if you're going to use the Webpack plugin, and you've already defined other Webpack plugins in your project, you should manually add the Keys Manager plugin to the list, rather than using the schematics command.

### Manual 

Install the Transloco keys manager package via `yarn` or `npm` by running:
```shell script
npm i -D @ngneat/transloco-keys-manager
yarn add -D @ngneat/transloco-keys-manager
```

Add the following scripts to your `package.json` file:
```json
{
  "i18n:extract": "transloco-keys-manager extract",
  "i18n:find": "transloco-keys-manager find"
}
``` 

##

The following functionality is available once the installation is complete:

## 🔑 Keys Extractor

This tool extracts translatable keys from templates and typescript files. Transloco Keys Manager provides two ways of using it:

### CLI Usage

If you chose the CLI option, you should see the following script in your project's `package.json` file:

```json
{
  "i18n:extract": "transloco-keys-manager extract"
}
```

Run `npm run i18n:extract`, and it'll extract translatable keys from your project.

### Webpack Plugin

The `TranslocoExtractKeysWebpackPlugin` provides you with the ability to extract the keys during development, while you're working on the project.

The angular-cli doesn't support adding a custom Webpack config out of the box.  

In case you already have support for a custom Webpack config just add the `TranslocoExtractKeysWebpackPlugin` in your plugin list.  

In case you need to add the support, you can use the keys manager [schematics command](#schematics), and it will do the work for you. (choose the Webpack Plugin option)

You should see a new file named `webpack-dev.config.js` configured with `TranslocoExtractKeysWebpackPlugin`:

```ts
// webpack-dev.config.js
const { TranslocoExtractKeysWebpackPlugin } = require('@ngneat/transloco-keys-manager');

module.exports = {
  plugins: [
    new TranslocoExtractKeysWebpackPlugin(config?),
  ]
};
```

Also, you should see an updated definition of the `npm start` command:

```json
{
  "start": "ng serve --extra-webpack-config webpack-dev.config.js"
}
```

Now run `npm start` and it'll generate new keys whenever a **save** is made to the project.

### Scopes Support

The extractor supports [scopes](https://ngneat.github.io/transloco/docs/scope-configuration/) out of the box. When you define a new scope in the `providers` array:

```ts
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  templateUrl: './admin-page.component.html',
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'admin' }]
})
export class AdminPageComponent {}
```

```html
<ng-container *transloco="let t">{{ t('admin.title') }}</ng-container>
```

It'll extract the scope (`admin` in our case) keys into the relevant folder:

```
📦 assets
 ┗ 📂 i18n
 ┃ ┣ 📂 admin
 ┃ ┃ ┣ 📜 en.json
 ┃ ┃ ┗ 📜 es.json
 ┃ ┣ 📜 en.json
 ┃ ┗ 📜 es.json
```

### Inline Loaders

Let's say that we're using the following [inline](https://ngneat.github.io/transloco/docs/inline-loaders) loader:

```ts
export const loader = ['en', 'es'].reduce((acc, lang) => {
  acc[lang] = () => import(`../i18n/${lang}.json`);
  return acc;
}, {});

@NgModule({
  imports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'scopeName',
        loader
      }
    }
  ],
  declarations: [YourComponent],
  exports: [YourComponent]
})
export class FeatureModule {}
```

We can add it to the `scopePathMap` key in the `transloco.config.js` file:

```js
module.exports = {
  langs: ['en', 'es'],
  scopePathMap: {
    scopeName: 'src/app/feature/i18n'
  }
};
```

Now, it'll create the files in the provided folder.

### Dynamic Keys

There are times when we need to extract keys with values that may change during runtime. One example can be when you need to use a dynamic expression:

```ts
import { TranslocoService } from '@ngneat/transloco';

class MyComponent {
  someMethod() {
    const value = translocoService.translate(`key.${type}.postfix`);
  }
}
```

To support such cases, you can add a special comment to your code, which tells the CLI to extract it. It can be added to Typescript files:

```ts
import { TranslocoService } from '@ngneat/transloco';

class MyComponent {
  /**
   * t(key.typeOne.postfix, key.typeTwo.postfix)
   * t(this.will.be.extracted)
   */
  someMethod() {
    const value = translocoService.translate(`key.${type}.postfix`);
  }
}
```

Or to templates:

```html
<!-- t(I.am.going.to.extract.it, this.is.cool) -->
<ng-container *transloco="let t">...</ng-container>
```

When using comments in the templates they will also **inherit the `read` [input](https://ngneat.github.io/transloco/docs/translation-in-the-template/#utilizing-the-read-input) value** (if exists), and will be prefixed with it:
```html
<!-- t(this.is.cool) -->
<ng-container *transloco="let m; read: 'messages'">
    ...
    <!-- t(success, error) -->
    <ng-container *transloco="let g; read: 'general'">
        ...
        <!-- t(ok, cancel) -->
    </ng-container>
</ng-container>
```

The extracted keys for the code above will be:
```json
{
  "this.is.cool": "",
  "messages.success": "",
  "messages.error": "",
  "general.ok": "",
  "general.cancel": ""
}
```

*Notes:* 
1. When using a Typescript file, you must have an `import { } from '@ngneat/transloco'` statement in it.
2. When using comments in your HTML files, they *must* contain only the markers without additional text.  
Here's an example for invalid comment:  
`<!-- For dropdown t(dynamic.1, dynamic.2) -->`

### Marker function

If you want to extract some standalone strings that are not part of any translation call (via the template or service) 
you can wrap them with the marker function to tell the keys manager to extract them:
```ts
import { marker } from '@ngneat/transloco-keys-manager/marker';
 
class MyClass {
    static titles = {
        username: marker('auth.username'), // ==> 'auth.username'
        password: marker('auth.password') // ==> 'auth.password'
    };
    ...
}
```
The marker function will return the string which was passed to it.  
You can alias the marker function if needed:
```ts
import { marker as _ } from '@ngneat/transloco-keys-manager/marker';
 
class MyClass {
    static titles = {
        username: _('auth.username'),
        password: _('auth.password')
    };
    ...
}
```

### Extra Support

- Supports for the `read` [input](https://ngneat.github.io/transloco/docs/translation-in-the-template/#utilizing-the-read-input):

```html
<ng-container *transloco="let t; read: 'dashboard'">
  <h1>{{ t('title') }}</h1>
  
  <p>{{ t('desc') }}</p>
</ng-container>
```

The extracted keys for the code above will be:

```json
{
  "dashboard.title": "",
  "dashboard.desc": ""
}
```

- Supports **static** ternary operators:

```html
<!-- Supported by the transloco pipe and structural directive -->
<comp [placeholder]="condition ? 'keyOne' : 'keyTwo' | transloco"></comp>
<h1>{{ condition ? 'keyOne' : 'keyTwo' | transloco }}</h1>

<comp *transloco="let t; read: 'ternary'">
    <h1>{{ t(condition ? 'keyOne' : 'keyTwo') }}</h1>
</comp>
```

## 🕵 Keys Detective

This tool detects two things: First, it detects any key that exists in one of your translation files but is missing in any of the others. Secondly, it detects any key that exists in the translation files but is missing from any of the templates or typescript files.
After installing the library, you should see the following script in your project's `package.json` file:

```json
{
  "i18n:find": "transloco-keys-manager find"
}
```

Run `npm run i18n:find`, and you'll get a lovely list that summarizes the keys found.

## 🕹 Options

- `project`*: The targeted project (defaults to `defaultProject`). The `sourceRoot` of this project will be extracted from the `angular.json` file and will prefix the `input`, `output`, and `translationPath` properties.  
In addition, the transloco config file will be searched in the project's `sourceRoot` (unless the `config` option is passed):  

```
transloco-keys-manager extract --project first-app
```

\* **Note:** If no `angular.json` file is present, `sourceRoot` will be `src`.

- `config`: The root search directory for the transloco config file: (defaults to `process.cwd()`)

```
transloco-keys-manager extract --config src/my/path
transloco-keys-manager extract -c src/my/path
```

- `input`: The source directory for all files using the translation keys: (defaults to `['app']`)

```
transloco-keys-manager extract --input src/my/path
transloco-keys-manager extract --input src/my/path,project/another/path
transloco-keys-manager extract -i src/my/path
```

\* **Note:** If a `project` is provided the default input value will be determined by the `projectType`, when given a library the default input value will be `['lib']`.

- `output`: The target directory for all generated translation files: (defaults to `assets/i18n`)

```
transloco-keys-manager extract --output my/path
transloco-keys-manager extract -o my/path
```

- `langs`: The languages files to generate: (defaults to `[en]`)

```
transloco-keys-manager extract --langs en es it
transloco-keys-manager extract -l en es it
```

- `marker`: The marker sign for dynamic values: (defaults to `t`)

```
transloco-keys-manager extract --marker _
transloco-keys-manager extract -m  _
```

- `sort`: Whether to sort the keys using JS `sort()` method: (defaults to `false`)

```
transloco-keys-manager extract --sort
```

- `unflat`: Whether to `unflat` instead of `flat`: (defaults to `flat`)

```
transloco-keys-manager extract --unflat
transloco-keys-manager extract -u
```

  If you are using unflat files keep in mind that “parent” keys won't be usable for a separate translation value, i.e. if you have two keys `first` and `first.second` you cannot assign a value to `first` as the translation file will look like `{ "first": { "second": "…" } }`.

  During key extraction you will get a warning with a list of concerned keys you have to check for.

- `defaultValue`: The default value of a generated key: (defaults to `Missing value for {{key}}`)

```
transloco-keys-manager extract --default-value missingValue
transloco-keys-manager extract -d "{{key}} translation is missing"
```
There are several placeholders that are replaced during extraction:   
1. `{{key}}` - complete key including the scope.  
2. `{{keyWithoutScope}}` - key value without the scope.  
3. `{{scope}}` - the key's scope.  


- `replace`: Replace the contents of a translation file (if it exists) with the generated one (default value is `false`, in which case files are merged)

```
transloco-keys-manager extract --replace
transloco-keys-manager extract -r
```

- `deleteMissingKeys`: Delete missing keys from existing translation files (defaults to `false`)

```
transloco-keys-manager extract --delete-missing-keys
transloco-keys-manager extract -D
```

- `addMissingKeys`: Add missing keys that were found by the detective (defaults to `false`)

```
transloco-keys-manager find --add-missing-keys
transloco-keys-manager find -a
```

- `emitErrorOnExtraKeys`: Emit an error and exit the process if extra keys were found (defaults to `false`)

```
transloco-keys-manager find --emit-error-on-extra-keys
transloco-keys-manager find -e
```

- `translationsPath`: The path for the root directory of the translation files (defaults to `assets/i18n`)

```
transloco-keys-manager find --translations-path my/path
transloco-keys-manager find -p my/path
```

- `help`:

```
transloco-keys-manager --help
transloco-keys-manager -h
```

### Transloco Config File

One more option to define the `config` object for this library is to create a `transloco.config.js` file in the project's root folder and add the configuration in it:

```ts
// transloco.config.js
module.exports = {
  rootTranslationsPath?: string;
  langs?: string[];
  keysManager: {
    input?: string | string[];
    output?: string;
    marker?: string;
    addMissingKeys?: boolean;
    emitErrorOnExtraKeys?: boolean;
    replace?: boolean;
    defaultValue?: string | undefined;
    unflat?: boolean;
  };
}
```

### 🐞 Debugging

You can extend the keys manager default logs by setting the `DEBUG` environment variable:
```json
{
  "i18n:extract": "DEBUG=* transloco-keys-manager extract",
  "i18n:find": "DEBUG=* transloco-keys-manager find"
}
```
Currently, there are 4 supported namespaces: `*|config|paths|scopes`, setting `*` will print all the debugger logs.   

You can also chain several namespaces:
```json
{
  "i18n:extract": "DEBUG=config,paths transloco-keys-manager extract"
}
```

## Core Team

<table>
  <tr>
    <td align="center"><a href="https://github.com/shaharkazaz"><img src="https://avatars2.githubusercontent.com/u/17194830?v=4" width="100px;" alt="Shahar Kazaz"/><br /><sub><b>Shahar Kazaz</b></sub></a><br /></td>
    <td align="center"><a href="https://www.netbasal.com"><img src="https://avatars1.githubusercontent.com/u/6745730?v=4" width="100px;" alt="Netanel Basal"/><br /><sub><b>Netanel Basal</b></sub></a><br /></td>
  </tr>
</table>

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/itayod"><img src="https://avatars2.githubusercontent.com/u/6719615?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Itay Oded</b></sub></a><br /><a href="https://github.com/ngneat/transloco-keys-manager/commits?author=itayod" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/darkv"><img src="https://avatars3.githubusercontent.com/u/582546?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Johann Werner</b></sub></a><br /><a href="https://github.com/ngneat/transloco-keys-manager/commits?author=darkv" title="Code">💻</a> <a href="https://github.com/ngneat/transloco-keys-manager/commits?author=darkv" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/adgoncal"><img src="https://avatars1.githubusercontent.com/u/10856791?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Allan G</b></sub></a><br /><a href="#ideas-adgoncal" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/JerryDoubleU"><img src="https://avatars0.githubusercontent.com/u/16196252?v=4?s=100" width="100px;" alt=""/><br /><sub><b>JerryDoubleU</b></sub></a><br /><a href="https://github.com/ngneat/transloco-keys-manager/commits?author=JerryDoubleU" title="Code">💻</a></td>
    <td align="center"><a href="http://site15.ru"><img src="https://avatars1.githubusercontent.com/u/4127109?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ILshat Khamitov</b></sub></a><br /><a href="https://github.com/ngneat/transloco-keys-manager/commits?author=EndyKaufman" title="Code">💻</a> <a href="https://github.com/ngneat/transloco-keys-manager/commits?author=EndyKaufman" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://gitlab.com/MikeDabrowski"><img src="https://avatars0.githubusercontent.com/u/17836911?v=4?s=100" width="100px;" alt=""/><br /><sub><b>MikeDabrowski</b></sub></a><br /><a href="https://github.com/ngneat/transloco-keys-manager/commits?author=MikeDabrowski" title="Code">💻</a> <a href="https://github.com/ngneat/transloco-keys-manager/commits?author=MikeDabrowski" title="Documentation">📖</a> <a href="https://github.com/ngneat/transloco-keys-manager/commits?author=MikeDabrowski" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/maleet"><img src="https://avatars1.githubusercontent.com/u/3947730?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mart Leet</b></sub></a><br /><a href="https://github.com/ngneat/transloco-keys-manager/commits?author=maleet" title="Code">💻</a> <a href="https://github.com/ngneat/transloco-keys-manager/commits?author=maleet" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
