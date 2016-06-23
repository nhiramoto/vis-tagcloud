#!/bin/bash

echo 'drop database if exists Tagcloud;' | lmysql -u root
lmysql -u root < create.sql
lmysql -u root < procedures.sql
lmysql -u root < triggers.sql
