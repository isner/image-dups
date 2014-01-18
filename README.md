image-dups
==========

Scan directories for duplicate image files.

* Walks recursively through each nested directory and compares all image files together.
* Compares checksums created from the each image file's BASE64-encoded buffer.

## Directions

Requires [node.js](http://nodejs.org/download/)

In the application directory: `npm install` then `node start`

In your browser: `localhost:1923/`

## Know issues

1) Scanning a directory that contains folders with read permission restrictions causes the app the throw an EPERM error.

* Workaround: restart the application and don't scan protected directories.

## Todo

1) Add a GUI to the /results view that allows users to select and delete the unwanted duplicates.
