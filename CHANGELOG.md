## Change Log

### v0.0.4
* BUG: Resolved issue when attempting to browse to directory which doesn't
nothing would happen. This now returns an error for display
* FEATURE: Color coded all errors that occur in the shell to be a red color.
This will help them stand out and make it easier to identify them

### v0.0.3
* FEATURE: Added support for command history. Up and down arrows will not
cycle through all previously issued commands

### v0.0.2
* BUG: Long running process support (Now listening to STDOUT)
* Removed dependency on ShellJS. Now working directly with nodes client process
* FEATURE: Added toggle indicator with colored icon when panel is showing
* FEATURE: Added support for CLS in Windows and CLEAR in *nix platforms

### v0.0.1
* Initial Release
