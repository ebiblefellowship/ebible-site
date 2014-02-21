# EBible Fellowship Web Site source files

## Overview

This repository contains the source code for the ebiblefellowship.com web site.  The site is built with the [nanoc](http://nanoc.ws) static site generator.

To build the site requires first installing a Ruby language interpreter, then installing nanoc and its dependencies. However, it's possible to contribute changes through the github web interface without building the site yourself. 

## Common tasks

In order to submit changes to the web site, you need to first sign up for a free account on github.com. Although this is not strictly required, it greatly simplifies the process compared to using e-mail or other means of submitting changes. 

### Add a transcript to a study

Navigate into the *content* folder then the *studies* folder.  From there look for the folder corresponding to the category of the study.  For studies that are not part of a series, they are normally located in the *sunday* folder.  See the following section, *How to make changes to the site*. 

### How to make changes to the site

Once you find a file to edit, click the edit button on the upper right.  This will fork or create a local copy of the files that you can edit freely. When you have finished your edits, you can then submit or push your changes upstream for inclusion into the web site.  Your changes will be reviewed and then subsequently published if there are no issues.  

### Building the site locally on your PC

Although not required for submitting changes, building the site locally on your machine ensures that the formatting will be as expected.

For installing Ruby and nanoc, see the installation instructions at the [nanoc web site](http://nanoc.ws/install/). For Windows users, see the [rubyinstaller.org](http://rubyinstaller.org/) web site for instructions on installing Ruby. 

## Source files organization

* README.md - this file

* content - root folder containing the source content files for the web site.

* layout - folder containing the site layout and include template files.

* config.yml - nanoc configuration file.

* config.rb - compass and scss configuration file.

* Rules - nanoc configuration for compilation and routing.

* lib - folder containing various custom logic.
