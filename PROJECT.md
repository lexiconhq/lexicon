# Internal Project Documentation

## Usage of `git`

As of Monday, July 3, 2023, usage of `rebase` and force pushing are no longer permitted on this project.

`git merge` is the acceptable approach for resolving conflicts.

### Example Scenario

Typically what you'll do is `merge` the current branch with another branch (often `master`).

For example, let's suppose you've been working on a feature branch named `feature/push-notifications`.

Since you started making changes, `master` has received quite a few commits (from other PRs being merged in).

In fact, you even need to incorporate some of those changes into your branch.

_This approach is step-by-step and very explicit. There are shortcuts to accomplish this. In this case, we list out every step just to be clear._

#### Step 1: Checkout `master` and pull down the latest changes

You need to ensure your local copy of `master` is up-to-date with what's on the remote.

```
git checkout master && git pull
```

#### Step 2: Switch back to your branch

Now that `master` is up-to-date, switch back to `feature/push-notifications`.

```
git checkout feature/push-notifications
```

#### Step 3: Merge with `master` to synchronize your branch with it

```
git merge master
```

#### Step 4: Resolve any merge conflicts and commit the changes

If there are no [conflicts](https://www.atlassian.com/git/tutorials/using-branches/merge-conflicts), the `merge` command will automatically reconcile the differences between the two branches with a specific merge strategy it selects.

If there are changes that need to be resolved, it depends on your development environment. If you're using VS Code, it will automatically parse the files with [conflict markers](https://wincent.com/wiki/Understanding_Git_conflict_markers) and give you a basic UI on top of them to help decide which changes to keep.

Note that sometimes, you may need to accept both changes and make further revisions manually to ensure that the final merged code is correct and hasn't broken anything / erased any changes.

When making a manual merge, you will need to commit the changes you have made to perform the merge. Make sure this is done before attempting to push.

#### Step 5: Push the updated branch

Check `git log` (or a similar interface in your IDE) to view the most recent commit, and ensure it contains all of the latest merged changes.

Once you have verified this, you can push your updated branch to the remote. It should now be synchronized with `master`.

```
git push
```

_Note, if you have not configured a default remote, this command may be something like `git push origin feature/push-notifications`._
