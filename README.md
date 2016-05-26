# Keisan

    "Just according to keisan (Translator's note: keisan means calculations)"

A JavaScript/TypeScript library for calculating Riichi (Japanese) Mahjong scores.

## Usage
```javascript
to be written
```

To get the typings for the Keisan classes, reference `dist/index.d.ts` in your files:

    /// <reference path="path/to/dist/index.d.ts" />

## Development
Stuff we use (only used for development purposes, so not really dependencies):
* TypeScript
* npm
* Gulp
* Jasmine
* TypeDoc

Clone the repository and run `npm install`.
Then you can run `gulp build` for transcompiling JavaScript, `gulp typedoc` for generating the TypeDoc, and `gulp test` for testing.

## To-Do
* Write tests for Hand, Meld and Yaku
* Implement Hand methods
* Implement Parser methods
* Implement Tile methods
* Check if honroutou doesn't overlap with other yaku
* Write more yaku classes

---

Keisan is based on [mahjong-tooltips-js](https://github.com/neetsdkasu/mahjong-tools-tips-js) by [neetsdkasu](https://github.com/neetsdkasu)
and [Riichi Mahjong Pointer](https://github.com/magicolic/riichi-pointer-js) by [EmeraldCoder](https://github.com/EmeraldCoder) and [blackmage](https://github.com/magicolic-blackmage).
