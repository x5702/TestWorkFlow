@echo off
"C:\Program Files (x86)\Everything\Everything.exe" -create-filelist temp.txt D:
type temp.txt >> all.txt
"C:\Program Files (x86)\Everything\Everything.exe" -create-filelist temp.txt F:
type temp.txt >> all.txt
"C:\Program Files (x86)\Everything\Everything.exe" -create-filelist temp.txt G:
type temp.txt >> all.txt
del temp.txt
node build_file_database.js
del all.txt