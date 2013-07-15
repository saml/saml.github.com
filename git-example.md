master, qa
f1 starts.
f2 starts.
f1 in qa.
f2 in qa.
f1 gets accepted. f1 goes to master.
f3 starts.
f3 in qa.
f2 gets accepted. f2 goes to master.
f3 gets accepted. f3 goes to master.


# Start

There's master and qa branch: `git checkout -b qa master`

Tree looks like:

    * 026cbae (HEAD, qa, master) START

# f1 starts.

Commands:

    git checkout -b f1 master
    git commit --allow-empty -m 'f1 a'
    git commit --allow-empty -m 'f1 b'

Tree:

    * 5a581ce (f1) f1 b
    * 31d27ea f1 a
    * 026cbae (HEAD, qa, master) START

# f2 starts.

Commands:

    git checkout -b f2 master
    git commit --allow-empty -m 'f2 a'
    git commit --allow-empty -m 'f2 b'

Tree:

    * 3815920 (f2) f2 b
    * dcec587 f2 a
    | * 5a581ce (f1) f1 b
    | * 31d27ea f1 a
    |/  
    * 026cbae (HEAD, qa, master) START

# f1 in qa.

Commands:

    git checkout qa
    git merge f1

Tree:

    * 3815920 (f2) f2 b
    * dcec587 f2 a
    | * 5a581ce (qa, f1) f1 b
    | * 31d27ea f1 a
    |/  
    * 026cbae (HEAD, master) START

`qa` fast forwarded. 

# f2 in qa.

Commands:

    git checkout qa
    git merge f2

Tree:

    *   b3826a9 (qa) Merge branch 'f2' into qa
    |\  
    | * 3815920 (f2) f2 b
    | * dcec587 f2 a
    * | 5a581ce (f1) f1 b
    * | 31d27ea f1 a
    |/  
    * 026cbae (HEAD, master) START

# f1 accepted.

Commands:

    git checkout master
    git merge f1

Tree:


    *   b3826a9 (qa) Merge branch 'f2' into qa
    |\  
    | * 3815920 (f2) f2 b
    | * dcec587 f2 a
    * | 5a581ce (HEAD, master, f1) f1 b
    * | 31d27ea f1 a
    |/  
    * 026cbae START

master fast forwarded to f1. Can't remove f1 branch.

Need explicit merge commit so that f1 branch can be removed.

Commands:

    git checkout master
    git merge --no-ff f1

Tree:

    *   b99b28e (HEAD, master) Merge branch 'f1'
    |\  
    | | *   b3826a9 (qa) Merge branch 'f2' into qa
    | | |\  
    | |/ /  
    | | * 3815920 (f2) f2 b
    | | * dcec587 f2 a
    | |/  
    |/|   
    | * 5a581ce (f1) f1 b
    | * 31d27ea f1 a
    |/  
    * 026cbae START


# f3 starts.

Commands:

    git checkout -b f3 master
    git commit --allow-empty -m 'f3 a'
    git commit --allow-empty -m 'f3 b'

Tree:

    * d1d3c1b (f3) f3 b
    * 891d59c f3 a
    *   b99b28e (HEAD, master) Merge branch 'f1'
    |\  
    | | *   b3826a9 (qa) Merge branch 'f2' into qa
    | | |\  
    | |/ /  
    | | * 3815920 (f2) f2 b
    | | * dcec587 f2 a
    | |/  
    |/|   
    | * 5a581ce (f1) f1 b
    | * 31d27ea f1 a
    |/  
    * 026cbae START

# f3 in qa.

Commands:

    git checkout qa
    git merge f3

Tree:

    *   51384de (qa) Merge branch 'f3' into qa
    |\  
    | * d1d3c1b (f3) f3 b
    | * 891d59c f3 a
    | *   b99b28e (HEAD, master) Merge branch 'f1'
    | |\  
    * | \   b3826a9 Merge branch 'f2' into qa
    |\ \ \  
    | |_|/  
    |/| |   
    | * | 3815920 (f2) f2 b
    | * | dcec587 f2 a
    | |/  
    * | 5a581ce (f1) f1 b
    * | 31d27ea f1 a
    |/  
    * 026cbae START

# f2 accepted.

Commands:

    git checkout master
    git merge f2

You can't rebase f2 on master.

Tree:

    *   fb5a786 (HEAD, master) Merge branch 'f2'
    |\  
    | | *   51384de (qa) Merge branch 'f3' into qa
    | | |\  
    | | | * d1d3c1b (f3) f3 b
    | | | * 891d59c f3 a
    | |_|/  
    |/| |   
    * | |   b99b28e Merge branch 'f1'
    |\ \ \  
    | | | *   b3826a9 Merge branch 'f2' into qa
    | | | |\  
    | | |/ /  
    | |/| /   
    | | |/    
    | | * 3815920 (f2) f2 b
    | | * dcec587 f2 a
    | |/  
    |/|   
    | * 5a581ce (f1) f1 b
    | * 31d27ea f1 a
    |/  
    * 026cbae START

Log of master:

    fb5a786 Merge branch 'f2'
    b99b28e Merge branch 'f1'
    3815920 f2 b
    dcec587 f2 a
    5a581ce f1 b
    31d27ea f1 a
    026cbae START

History is awkward. Can't revert merges now. What we really want is the history to look like:

    fb5a786 Merge branch 'f2'
    3815920 f2 b
    dcec587 f2 a
    b99b28e Merge branch 'f1'
    5a581ce f1 b
    31d27ea f1 a
    026cbae START

# f3 accepted.

Commands:

    git checkout master
    git merge f3

Tree:

    *   e08766e (HEAD, master) Merge branch 'f3'
    |\  
    * \   fb5a786 Merge branch 'f2'
    |\ \  
    | | | *   51384de (qa) Merge branch 'f3' into qa
    | | | |\  
    | | | |/  
    | | |/|   
    | | * | d1d3c1b (f3) f3 b
    | | * | 891d59c f3 a
    | |/ /  
    |/| |   
    * | |   b99b28e Merge branch 'f1'
    |\ \ \  
    | | | *   b3826a9 Merge branch 'f2' into qa
    | | | |\  
    | | |/ /  
    | |/| /   
    | | |/    
    | | * 3815920 (f2) f2 b
    | | * dcec587 f2 a
    | |/  
    |/|   
    | * 5a581ce (f1) f1 b
    | * 31d27ea f1 a
    |/  
    * 026cbae START

