---
layout: post
title: Github Workflow
author: saml
---

Let's say I want to work on issue #8 on some github project. The issue is about creating interface for browsing images.
So, I branch off the main branch (`master`).

```
git branch image-browse
git checkout image-browse
# or,  git checkout -b image-browse
```

While working on the branch, `image-browse`, I rebase often.

```
git fetch origin
git rebase origin/master
```

After a few commits, I fixed the issue.

```
git commit -m 'fixes #8 can browse through images'
```

Then share my branch with others and make a pull request.

```
git push -u origin image-browse
```

From then on, you can discuss the pull request with colleagues through github web interface.
When the pull request is accepted (`image-browse` is merged to `master`), the issue `#8` will be closed automatically.
And, you can delete `image-browse` branch (github provides a button for that).



