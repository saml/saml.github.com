#!/bin/bash

if (( $# < 1 ))
then
    echo "Usage: $0 project-name"
    echo "Creates project-name directory and simulates git workflow"
    exit 1
fi

proj_name="$1"
mkdir "$proj_name"
cd "$proj_name"

git init
git commit --allow-empty -m start

git_feature_start() {
    # starts feature and makes two commits.
    feature_name="$1"
    file_to_edit="$feature_name.txt"
    git checkout -b "$feature_name" master
    date >> "$file_to_edit"
    git add "$file_to_edit"
    git commit -m "$feature_name.a"
    date >> "$file_to_edit"
    git add "$file_to_edit"
    git commit -m "$feature_name.b"
}

git_feature_end() {
    # merges feature back to master. and removes feature branch.
    feature_name="$1"
    git checkout "$feature_name"
    git rebase master
    git checkout master
    git merge --no-ff -m "Merge $feature_name" "$feature_name"
    git branch -d "$feature_name"

}

git_release() {
    version="$1"
    git checkout master
    git tag "$version"
}

git_hotfix_start() {
    hotfix_name="$1"
    version="$2"
    file_to_edit="$hotfix_name.txt"
    git checkout -b "$hotfix_name" "$version"
    date >> "$file_to_edit"
    git add "$file_to_edit"
    git commit -m "$hotfix_name.a"
    date >> "$file_to_edit"
    git add "$file_to_edit"
    git commit -m "$hotfix_name.b"
}

git_hotfix_end() {
    hotfix_name="$1"
    version="$2"
    git checkout "$hotfix_name"
    git tag "$version"
    git rebase master
    git checkout master
    git merge --no-ff -m "Merge $hotfix_name" "$hotfix_name"
    git branch -d "$hotfix_name"
}

git_feature_start f1
git_feature_start f2
git_feature_end   f1
git_feature_start f3
git_feature_end   f2
git_feature_end   f3
git_release       v1.0
git_feature_start f4
git_feature_end   f4
git_feature_start f5
git_hotfix_start  hotfix1 v1.0
git_feature_end   f5
git_hotfix_end    hotfix1 v1.1
git_feature_start f6
git_hotfix_start  hotfix2 v1.1
git_hotfix_end    hotfix2 v1.2
git_feature_end   f6
git_release       v2.0

cd "$proj_name"
git log --oneline --all --decorate --graph

