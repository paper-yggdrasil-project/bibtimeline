## bibtimeline

This is the browse application visualizing the bibliography timeline.

![https://gyazo.com/208d597acc7587af181a00ba10b2ced6](https://i.gyazo.com/208d597acc7587af181a00ba10b2ced6.gif)

Thanks to [Timeline JS3 - Beautifully crafted timelines that are easy, and intuitive to use.](http://timeline.knightlab.com/index.html).

### Demo

Please, see [demo page](http://paper-yggdrasil-project.github.io/bibtimeline/).

## Setup

First, you have to `clone` and `install`.

```
git clone https://github.com/paper-yggdrasil-project/bibtimeline
cd bibtimeline
npm install
```

Also, you should create __your__ `timeline.json` by `gulp timeline:generate`.
To generate `timeline.json`, you put __your__ `*.bib` in `app/bib` directory.

```
rm app/bib/*
cp <your bib file> app/bib/
gulp timeline:generate
```

I'm sorry if you add bib file later, you should edit `timeline.json` manually.

## Usage

Browsing the timeline including information from only `bib` files, you just do this!

```
gulp serve
```

## Customize

If you'd like to inject more information to the timeline, e.g. pdf, markdwon, ...
you have to edit `timeline.json` manually.

Please, [see example](./app/bib/timeline.json).

### Attachment Type

Still, only 2 types...

* pdf
* md
