---
layout: post
title: Github Workflow
author: saml
---

# Summary

```sh
git checkout -b your-feature
git commit
git fetch origin
git rebase origin/master
git checkout master
git merge --no-ff your-feature
git push
```

Or,

```sh
git checkout -b your-feature
git commit
git fetch origin
git rebase origin/master
git push origin your-feature
# and make a github pull request from origin/your-feature to origin/master
```


# Long Version


There is a product. And a team is working on the product. The team is made of different roles:

- `Devs`: makes the product.
- `QA`: tests the product.
- `Managers`: accepts the product.

Each role wants different things:

- `Devs`: wants to let `QA` know that the product is made and ready to be tested.
- `QA`: wants to let `Devs` know that tests fail. 
  Also, wants to let `Managers` know that the product passed all tests and is ready for acceptance (and/or release).
- `Managers`: wants to let `Devs` and `QA` know what the product is about. 
  Also, wants the product to be what it should be before releasing it.

I propose the following workflow on GitHub.

# Issue

The team creates issues on GitHub.
For example, the team created [issue2](https://github.com/saml/git-practice-cause-it-is-hard/issues/2) 
and [issue3](https://github.com/saml/git-practice-cause-it-is-hard/issues/3) for the product.

These are the same as JIRA tickets or agile stories. 

# Work

`Devs` work on issues.

Let's say you're a dev and want to work on [issue2](https://github.com/saml/git-practice-cause-it-is-hard/issues/2).

First, update the project:

```sh
$ git status
# On branch master
nothing to commit (working directory clean)
$ git pull --rebase
Current branch master is up to date.
$ git log
commit 179b8865c48685e509aec10ffb6dba84a5074f83
Merge: 504f4ed 9d32180
Author: saml <saml@gmail.com>
Date:   Mon Jul 1 16:12:05 2013 -0400

    Merge branch 'topic1'

...
```

Next, creates a new branch for the issue:

```sh
$ git checkout -b topic2
Switched to a new branch 'topic2'
```

Do some work:

```sh
$ echo 'doing some work' >> topic2.md 
$ git add topic2.md
$ git commit -m 'working on #2'
[topic2 11d7b27] working on #2
 1 file changed, 1 insertion(+)
```

Meanwhile, another dev, called `saml`, works on [issue3](https://github.com/saml/git-practice-cause-it-is-hard/issues/3):

```sh
$ git status
# On branch master
nothing to commit (working directory clean)
$ git pull --rebase
Current branch master is up to date.
$ echo 'doing work' >> topic3.md
$ git add topic3.md
$ git commit -m 'working on #3'
[topic3 d73998d] working on #3
 1 file changed, 1 insertion(+)
 create mode 100644 topic3.md
$ echo 'doing more work' >> topic3.md
$ git add topic3.md
$ git commit -m 'fixes #3'
[topic3 8364c96] fixes #3
 1 file changed, 1 insertion(+)

```

When `saml` fixed [issue3](https://github.com/saml/git-practice-cause-it-is-hard/issues/3), 
he/she **rebases** and merges:

```sh
$ git fetch origin 
$ git rebase origin/master 
Current branch topic3 is up to date.
$ git checkout master 
Switched to branch 'master'
$ git merge --no-ff topic3 
Merge made by the 'recursive' strategy.
 topic3.md |    2 ++
 1 file changed, 2 insertions(+)
 create mode 100644 topic3.md

```

And he/she pushes to let `QA` know that issue is resolved:

```sh
$ git push
Counting objects: 8, done.
Delta compression using up to 6 threads.
Compressing objects: 100% (5/5), done.
Writing objects: 100% (7/7), 616 bytes, done.
Total 7 (delta 3), reused 0 (delta 0)
To git@github.com:saml/git-practice-cause-it-is-hard.git
   179b886..dfdb319  master -> master
```


Or, he/she can push local `topic3` branch and create a pull request:

```sh
$ git push origin topic3
```


GitHub automatically closes [issue3](https://github.com/saml/git-practice-cause-it-is-hard/issues/3) 
(because of the comment `fixes #3`), and `QA` can now test the issue on continuously integrated environment.

Going back to you, you want to work on [issue2](https://github.com/saml/git-practice-cause-it-is-hard/issues/2) further.
Unlike `saml`, you rebase often to resolve conflicts early and get up to date code:

```sh
$ git status
# On branch topic2
nothing to commit (working directory clean)
$ git fetch origin 
$ git rebase origin/master 
First, rewinding head to replay your work on top of it...
Applying: working on #2
$ git log
commit e9943f87df590d6f2ebaeda1b4edd4712025790b
Author: you <you@gmail.com>
Date:   Mon Jul 1 16:16:54 2013 -0400

    working on #2

commit dfdb319029ac4d8a36bfe97ef62ee05372fdf66d
Merge: 179b886 8364c96
Author: saml <saml@gmail.com>
Date:   Mon Jul 1 16:19:29 2013 -0400

    Merge branch 'topic3'

commit 8364c96e0e92b9f8bd3a0de129673a9c82d49f57
Author: saml <saml@gmail.com>
Date:   Mon Jul 1 16:18:38 2013 -0400

    fixes #3

```

You see `saml` already fixed [issue3](https://github.com/saml/git-practice-cause-it-is-hard/issues/3).
Time to finish [issue2](https://github.com/saml/git-practice-cause-it-is-hard/issues/2):

```sh
$ echo 'more work' >> topic2.md 
$ git add topic2.md
$ git commit -m 'fixes #2'
[topic2 1c61b98] fixes #2
 1 file changed, 1 insertion(+)
$ git fetch origin 
$ git rebase origin/master 
Current branch topic2 is up to date.
$ git checkout master 
Switched to branch 'master'
$ git merge --no-ff topic2 
Merge made by the 'recursive' strategy.
 topic2.md |    2 ++
 1 file changed, 2 insertions(+)
```

Let's check the log before you push:

```sh
$ git status
# On branch master
# Your branch is ahead of 'origin/master' by 3 commits.
#
nothing to commit (working directory clean)
$ git log
commit 3b44e0597942892137e793af28c883a3274c60e3
Merge: dfdb319 1c61b98
Author: you <you@gmail.com>
Date:   Mon Jul 1 16:21:07 2013 -0400

    Merge branch 'topic2'

commit 1c61b989e74a2d447d7b0f1c03d44e8da45bb773
Author: you <you@gmail.com>
Date:   Mon Jul 1 16:20:34 2013 -0400

    fixes #2

commit e9943f87df590d6f2ebaeda1b4edd4712025790b
Author: you <you@gmail.com>
Date:   Mon Jul 1 16:16:54 2013 -0400

    working on #2

commit dfdb319029ac4d8a36bfe97ef62ee05372fdf66d
Merge: 179b886 8364c96
Author: saml <saml@gmail.com>
Date:   Mon Jul 1 16:19:29 2013 -0400

    Merge branch 'topic3'

commit 8364c96e0e92b9f8bd3a0de129673a9c82d49f57
Author: saml <saml@gmail.com>
Date:   Mon Jul 1 16:18:38 2013 -0400

    fixes #3
```

That looks good. Your works are added after `saml`'s work on [issue3](https://github.com/saml/git-practice-cause-it-is-hard/issues/3).
Now, push:

```sh
$ git push
Counting objects: 9, done.
Delta compression using up to 6 threads.
Compressing objects: 100% (5/5), done.
Writing objects: 100% (7/7), 640 bytes, done.
Total 7 (delta 3), reused 0 (delta 0)
To git@github.com:saml/git-practice-cause-it-is-hard.git
   dfdb319..3b44e05  master -> master
```

# QA

`QA` tests issue2 and issue3. Finds no issue with issue2. But, issue3 isn't passing all tests.
So, `QA` reopens [issue3](https://github.com/saml/git-practice-cause-it-is-hard/issues/3). `saml` has to work on it further.
He was working on some other issue. So, he switches gears:


```sh
$ git checkout topic3 
Switched to branch 'topic3'
$ git status
# On branch topic3
nothing to commit (working directory clean)
$ git fetch origin 
$ git rebase origin/master 
First, rewinding head to replay your work on top of it...
Fast-forwarded topic3 to origin/master.
```

And, puts some work on issue3 and pushes:

```sh
$ echo 'QA reopened the ticket.. working on #3' > topic3.md 
$ git add topic3.md
$ git commit -m 'QA reopened the ticket.. working on #3'
[topic3 9106ca0] QA reopened the ticket.. working on #3
 1 file changed, 1 insertion(+), 2 deletions(-)
$ git fetch origin 
$ git rebase origin/master 
Current branch topic3 is up to date.
$ echo 'more work'  >> topic3.md 
$ git add topic3.md
$ git commit -m 'fixes #3 again'
[topic3 39bdcea] fixes #3 again
 1 file changed, 1 insertion(+)
$ git fetch origin
$ git rebase origin/master 
Current branch topic3 is up to date.
$ git checkout master 
Switched to branch 'master'
$ git merge --no-ff topic3 
Merge made by the 'recursive' strategy.
 topic3.md |    4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)
$ git push
Counting objects: 9, done.
Delta compression using up to 6 threads.
Compressing objects: 100% (5/5), done.
Writing objects: 100% (7/7), 696 bytes, done.
Total 7 (delta 3), reused 0 (delta 0)
To git@github.com:saml/git-practice-cause-it-is-hard.git
   3b44e05..4f17fbb  master -> master
```

# Release

`QA` tests issue3 and verifies that it's good.
Now `QA` tells `Manager` that `master` branch passes all tests.
`master` is merged to `release` branch, tagged, and the tagged build is released.


# Hotfix

If the product has an issue that needs to be fixed immediately, bypassing normal workflow, 
`Dev` branches off the `release` branch, fixes, merges back.
Or, `Dev` can work on the tag.
`Dev` doesn't forget to merge the fix back to `master`.

