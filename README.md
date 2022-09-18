# Third Project

Author: Julian Marc

This is the project for the program's third challenge.

It consists in a newspaper site, based on an outdated version of https://medium.com/, see https://web.archive.org/web/20180731230839/https://medium.com/ for a rough aproximate, or the challenge's provided image.
Supports searching for a post, navigating trough different sections, modifying and deleting posts, and adding new ones. 

The site has been developed using pure html, javascript and scss, which was precompiled using sass's watcher command. Both the original scss and compiled files are inside the scss and build folders respectively.
The site was tested on Opera, Chrome, Firefox, OperaGX, IE and Edge.
The site starts with a list of defaultPosts, located in the js folder, under defaultPosts.json. This file is retrieved using fetch instead of import, as to avoid compatibility issues with Firefox.
