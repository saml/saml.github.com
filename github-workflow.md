---
layout: post
date: 2013-07-22 22:08
author: saml
title: Github Workflow
---

# Overview

`master` branch is mainline. You work on features. Features are throughly tested.
Features get signed off for release and are merged back to `master`.
When `master` gets enough features for a release, it's tagged and released.
Hotfixes are made against release tags, and merged back to `master`.

# Normal Workflow

You need to work on a feature (story, issue, bug...).

Command | Comments 
--------|--------- 
`git checkout -b your-feature master` | Branch off `master`. 
`git commit`                          | Work on `your-feature` branch.
`git fetch origin`                    | When you're done, get the latest
`git rebase origin/master`            |     and rebase onto upstream. You can do this often during development so that you are always developing against the latest `master`.
(`git rebase -i`)                     | Optionally, you can interactive rebase, squashing commits and changing commit order.. etc.
`git push origin your-feature`        | Publish `your-feature`. 

From there, `your-feature` will go through QA and be signed off for release.

You _can_ make a pull request from `your-feature` to `qa` branch to
let QA team know that `your-feature` is ready for QA. 
Or, just shout out (through JIRA, chatroom, email, in person...).

QA team might merge `your-feature` to their `qa` branch, which is continuously integrated to `qa.example.com`, and test. 
Or, they might deploy `your-feature` to `your-feature.qa.example.com` and test.
They might have `staging` branch and other branches to help them manage.
You don't have to care for how QA team utilizes git branches for testing. 
For developers, there are `master` and features.

If `your-feature` fails QA, you work further on `your-feature`, push, and shout out.

There could be additional testing and acceptance on staging environment after `your-feature` passes QA.


# Ready For Release

After `your-feature` is signed off for release, you can make a pull request from `your-feature` to `master`.
Or, merge yourself:

Command | Comments
--------|----------
`git checkout your-feature` |
`git fetch origin` | Get the latest.
`git rebase origin/master` | Rebase before you merge `your-feature` to upstream, `master`.
`git checkout master` |
`git merge --no-ff your-feature` | Explicitly create merge commit for history.
`git push` |


# Release

All signed off features are in `master`. And, current `HEAD` (attached to `master`) can be released.

Command | Comments
--------|----------
`git checkout master`      | You are on `master` branch.
`git tag v1.0`             | Release version is `v1.0`.
`git push origin v1.0`     | Publish the release so that hotfixes can be made against the latest version.

Until the next normal release (`v2.0`), you follow Normal Workflow: you publish features. 
Features get merged back to `master` after sign off.

# Hotfix

`master` has some features but not enough for `v2.0`.
And, you need to make an urgent hotfix in production (`v1.0`).

Command | Comments
--------|----------
`git checkout -b your-hotfix v1.0` | Hotfix against the latest release, `v1.0`.
`git commit`                       | Fixed it!
`git tag v1.1`                     | Same as normal release, but you are tagging on `your-hotfix`, not `master`. 
`git push`                         | Publish `your-hotfix`.
`git push origin v1.1`             | Publish the hotfix release so that further hotfixes, `v1.2`, `v1.3`, ..., can be made.
`git fetch origin`                 | 
`git rebase origin/master`         |
`git checkout master`              | After releasing a hotfix, 
`git merge --no-ff your-hotfix`    |    you need to merge it back to `master`, so that it'll be included in the next release, `v2.0`.
`git push`                         |






