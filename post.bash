#!/bin/bash

if (( $# < 1 ))
then
    echo "Usage: $0 'post-title'"
    exit 1
fi

title="$1"
slug="$({
    tr '[A-Z]' '[a-z]' | tr -cs '[[:alnum:]]' '-'
} <<< "$title")"
slug="${slug##-}"
slug="${slug%%-}"
post_dir="_posts/$(date +%Y/%m/%d)"
post_path="$post_dir/$(date +%Y-%m-%d)-$slug.md"

mkdir -p "$post_dir"
cat <<ASDF > "$post_path"
---
layout: post
title: $title
author: saml
---

ASDF
vim "$post_path"

