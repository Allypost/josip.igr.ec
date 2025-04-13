---
title: "Finally building my personal site"
description: "My experience with setting things up and why every technology sucks at least a little bit."
pubDate: 2024-09-18
tags: ["getting started", "rant", "astro", "technology"]
---

## Hello, World!

As is tradition, when one starts a new site or blog, the first thing that graces it will be a "Hello, World", "In progress/things to come" or "How it's made" post. So, as did my forebears, so too shall I follow the ancient instinct. Ashes to ashes, dust to dust, words to page and so on.

## But why?

I've been wanting to set up a blog for a while now. I love giving talks and presenting, so I thought that blogging would fit right in. It's also a nice feeling to have people engage with your ideas, and a blog is an efficient way to share them. I tried to start many times over, but I always got sidetracked by some new and cool technology.

It had to be _small_, _fast_, and _simple_. Preferably so _small_ and _simple_, you could just `Right-Click -> Save as...` the HTML file to your computer and have a complete backup of the post (excluding linked images and fonts). The _fast_ would then come from being able to cache said HTML file either in memory, in a proxy cache/CDN, and/or in the browser's cache.

## Simple isn't as simple as simple

I had already built [my previous personal site](/old-site.html) that way: using nothing but the power of Vim, HTML and CSS. The only dependency it had was a link to Google Fonts to pull in a font I liked (EB Garamond, my beloved &lt;3). It was not that hard. Small and simple as it was, it was still annoying to first have to manually add IDs to headers, then carefully link them to themselves, update the table of contents... I imagine it would have been exponentially more annoying having to do all that and manage assets _and_ a list of blog posts _**and**_ the posts themselves.

And that breaks the other meaning of _simple_. It takes significant effort to make changes. That blocks you from just (theoretically) writing a new post in an hour, committing, and being done with it.

No, what I wanted was simple both in managing content _and_ the resulting artefacts.

## There were attempts

I've tried a few things. The "not built here" syndrome can be easily rationalised away _if_ you convince yourself that it's just for a side project. Doing everything yourself and reinventing the wheel is a lot of fun, and _actually_, it would give you an opportunity to write a blog post about it later on your blogging engine that you will _definitely_ finish _this time_.

Alas, so went by 2 Go apps (managing the build + assets + random things was a pain, and Go started getting on my nerves a couple of times because of the lax type system), a React and a Vue site (that's just pure bloat anyway /s), a couple of Rust apps (getting caught in the minutiae of each part took the wind out of it), an Elixir and a Clojure site (because you can't be a Real Programmer™️<sup>©</sup>® without writing some functional code). With them, many months went by that could have been used to actually write prose.

Why can't there exist a perfect solution?! A perfect solution for me, specifically?!

## Why not use a managed solution?

A couple of factors prevented me from using something like WordPress (gods no), Medium or [Bear](https://bearblog.dev/). The first two fall outside my goal to be fast and lean. Plus, some of those platforms I have ideological gripes with. Bear almost got me. It's just tiny and cute enough that I could see myself using it. But...

## Where's the fun in that?

I'm a big advocate of self-hosting stuff. This way I can easily move to any other provider if something goes wrong. It also allows me to set up different versions (local, intranet, preview, production, legacy/backup) of the same app. It also gives you total control of what happens so ads don't suddenly appear in your posts when your hosting provider runs out of VC funding.

Alas, can one know joy without knowing suffering? I don't.

Am I a masochist? No, _probably_ not.

## Perfect is the enemy of good _enough_

It finally happened at the start of June. I was working on the latest revolutionary Rust site that would yet again go nowhere. After hitting a slump in productivity, I started going through my backlog of interesting articles I put off reading. One of them was a [blog post about slow internet](https://brr.fyi/posts/engineering-for-slow-internet). The article left an impression on me, so I kept browsing the site, noticing both the nice animations and how quickly everything loaded. I checked the markup and saw it was using [Astro](https://astro.build/). I had heard of it before, but never took the time to properly look into it. That was a mistake because it was the perfect thing for me. It allowed me to just write my posts in Markdown or MDX and just have it all work. No more fiddling with Next to please _just render stuff to some files and be done with it_ or reinventing the wheel in `$TRENDY_LANG`. Or so I thought.

Astro has a couple of templates that it comes with out of the box. One `bun create astro@latest -- --template blog` later, and I had _a_ site. It just needed a couple of tiny little tweaks to make it _my_ site. How long could that take anyway?

## Just one more little thing and it'll be over

I was happy to finally have something in front of me. The `content` feature is really simple. I just need to write stuff in a file and a post is ready to go. Just have to add a hero image (the thing up top) and... wait... I have to put it in the `public` folder? Can't I just add it next to the file and have the framework do the rest? It works but only kinda. OK, at least it transcodes it? I don't want to have to do that. No? Can I at least do it myself via plugins? Again, not really? Eh, it's fine, I'll just use whatever for now. Oh, and what if I want to add a table of contents? There's a plugin, but it's kinda not what I want. Images should also have proper captions. Why are there random empty elements in the generated pages? I should add `target="_blank"` to links that point to external URLs. And then the design... And make sure to support dark mode and not flashbang the user each time the page changes... And...

## The last number before 1.0

Death by a thousand cuts is a real thing. Just like there are infinitely many numbers between 0 and 1, the list of tiny things you could improve or fix is infinitely dense. It's all to easy to keep picking at them in the hopes that one day you'd stare at an empty slot and a perfect project beside it. In a perfect world that would be feasible, but in reality, it's not.

It took me a while to get out of the "just this one little tweak" phase and mindset. I'm still not fully rid of it, but this post (and the site it's contained in) is a nice first step.

The files you are currently reading are hosted using Cloudflare Pages because GitHub Pages gave me a headache with setup.

I also have a preview site that I use to share drafts of my posts and that's hosted on an old OptiPlex in my cupboard. It's built inside a docker container that I threw together in 15 minutes and spat into the host FS where another container serves the files. Of course, the server container is [another side quest](https://github.com/Allypost/cdn-rs) I went on while building this site.

## I'm done

So here we are. It's finally over (kinda).

All this isn't necessarily bad. Things can be slow and heavy and just a pile of things bodged together, but if that doesn't hinder you from doing what you want, then go for it.

I just chose to complicate things because I could.

## Everything sucks a bit...

...and that's sometimes the best thing that can happen. Because it forces you to think about what you want to do and how you want to do it. It may even motivate you enough to just do it yourself. You may even end up in the exact same place you started at, with the code you worked on for a week deleted and gone forever. But it won't be the same _you_ that started that journey. It will be a new person with the knowledge of how it didn't really suck as much as you thought it did.

Now the only challenge left is to actually learn how to write and do it more so it doesn't take me... 3 months (?!) to write a single post. Gods be willing, there will be a new post this year.
