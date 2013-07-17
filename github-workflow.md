---
layout: post
author: saml
title: Github Workflow
---
# Overview

Features are set for the next release.
Devs collaborate on `master` branch. Branch name can be anything. Important thing is that devs collaborate on a branch.
`master` gets continuously deployed and tested.

When all features are accepted by product management, `master` is tagged and released.

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
`git checkout master`                 | Merge `your-feature` to master.
`git merge --no-ff your-feature`      | Create merge commit explicitely for easy to understand history.
`git push`                            |
`git branch -d your-feature`          | 

Instead of merging to master, devs could request a pull request (maybe for reviews):

Command                               | Comments
--------------------------------------|----------
`git push origin your-feature`        | Publish `your-feature`. 


# Release

Product management is happy with `master`. It can be released!

Command | Comments
--------|----------
`git checkout master`      |
`git tag v1.0`             | Release version is `v1.0`.
`git push origin v1.0`     | Publish the release so that hotfixes can be made against the latest version.

Until the next normal release (`v2.0`), you follow Normal Workflow.

# Hotfix

`master` isn't ready for `v2.0`.
And, you need to make an urgent hotfix in production (`v1.0`).

Command | Comments
--------|----------
`git tag`                          | Check which one is the latest release.
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


# Test Script

Creates a project and simulates workflows described above.

[Download it here](../github-workflow.sh)

Run it: `./github-workflow.sh project-name`. `project-name` directory must not exist.

It creates a project, goes through two releases, hotfixes, features.. and displays branch graph afterwards.

Result of example run:

```
*   f23774a (HEAD, tag: v2.0, master) Merge f6
|\  
| * 0a2e8d7 f6.b
| * e905a77 f6.a
|/  
*   7d99881 Merge hotfix2
|\  
| * c1a1c61 hotfix2.b
| * bbe4de0 hotfix2.a
|/  
*   948b95f Merge hotfix1
|\  
| * 052e60b hotfix1.b
| * f85ba36 hotfix1.a
|/  
*   654399b Merge f5
|\  
| * 26b1ff6 f5.b
| * 0f6a625 f5.a
|/  
*   f71b350 Merge f4
|\  
| * 0d1ea98 f4.b
| * 4b08b61 f4.a
|/  
| * 64bb9d6 (tag: v1.2) hotfix2.b
| * 4c93ec5 hotfix2.a
| * 4c4ff60 (tag: v1.1) hotfix1.b
| * ffbcea0 hotfix1.a
|/  
*   346dedf (tag: v1.0) Merge f3
|\  
| * 459ff52 f3.b
| * 1eee89b f3.a
|/  
*   d86c8ee Merge f2
|\  
| * d4651a0 f2.b
| * 8c7d4b4 f2.a
|/  
*   055128d Merge f1
|\  
| * 2f2a77c f1.b
| * 33a0c4e f1.a
|/  
* f0e0e1c start
```
