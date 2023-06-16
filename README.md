# True preloader core

The true purpose of a preloader for a website is to display it within the first second of visiting the site. The core
size is no more than 3Kb. The plugin creates a Web Component with a preloader
and is isolated from the main code. The basic settings allow you to display the preloader based on specific
scenarios.

**Examples**
- [Example1](https://csscoder.github.io/true-preloader-core/demo/example1.html)
- [Example2](https://csscoder.github.io/true-preloader-core/demo/example2.html)
- [Example3 (Webpage)](https://csscoder.github.io/true-preloader-core/demo/webpage/index.html)

## How to use

1. Create preloader file. You can add any code for animation scene. This template you can
   find `/demo/preloader/template-preloader.js`. Examples you can find here `demo/preloader`
   ```js
   (() => {
   if (typeof window === 'undefined') return false;
   const template = document.createElement('template');
   template.innerHTML = `
   
   add here needed code
   you can find it from codepen.io 
   
   `;
   window.templatePreloader = template;
   })();
   ```
2. Add two files to `<head>`, source code [preloader-core.js](https://csscoder.github.io/true-preloader-core/dist/preloader-core.js)
   ```html
   <html>
      <head>
      ...
      <!-- add your file from first step -->
      <script src='yourPreloader.js'></script>
      <!-- add core plugin from /dist/preloader-core.js -->
      <script 
        src='preloader-core.js'
        data-preloader 
        data-frequency='always'
        data-build-version='v111112'
        data-duration-hide='300'
        data-time-fallback='5000'
        data-min-show-time='2000'
      ></script>
      ...
      </head>
   ```

## Options

Earlier in the text, you noticed that data attributes are present when including the JS file. Those are plugin options.

#### data-preloader

```html

<script ... data-preloader ...>
```

This is a required and mandatory attribute.

#### data-frequency

```html

<script ... data-frequency='once' ...>
```

- `once` It means that the preloader will be displayed only once. The preloader will be shown again if the build version
  is changed (change attribute `data-build-version`). Choose this parameter when the main task is to load the essential
  large files of the application, such as JS and CSS, which the browser will subsequently cache. Plugin will set a
  variable in a browser LocalStorage and write a Cookie.
- `visit` Visitors will see the preloader once on each new visit or new browser Tab. Choose it if you want to show
  personal preloaders each time. Plugin will set a variable in a browser SessionStorage.
- `always` Visitors will see the preloader every time:  open the website, load the inner pages, and open the site in the
  new Tab browser.

#### data-build-version

```html

<script ... data-build-version='yourVersion1' ...>
```

This attribute can accept any value. For example, "v1", "v2", "version3". As a best practice, I recommend updating this
attribute when updating the preloader or making changes to the code of the web application. Works
with `data-frequency="once/visit"`

#### data-duration-hide

```html

<script ... data-duration-hide='300' ...>
```

This parameter sets the duration of hiding the preloader. The value is in milliseconds. The preloader will be hidden by
opacity=0.

#### data-time-fallback

```html

<script ... data-time-fallback='3000' ...>
```

This parameter determines the duration of showing the preloader. The value is in milliseconds. After the specified time
elapses, the preloader will be hidden. You can also hide the preloader by using a CustomEvent. See the description
below for more details.
#### data-time-fallback

```html

<script ... data-min-show-time='3000' ...>
```
This parameter sets the minimum duration for displaying the preloader. The value is in milliseconds.

## CustomEvent to hide
By default, the duration of showing the preloader is controlled by a single parameter `data-time-fallback`. However, you can use a CustomEvent to hide the preloader.

```js
// Wait full page load and hide preloader
window.addEventListener('load',  () => {
  window.dispatchEvent(new CustomEvent("preloaderHide"));
})
```




