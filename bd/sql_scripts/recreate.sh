#!/bin/bash

echo 'drop database if exists Tagcloud;' | mysql -u root
mysql -u root < create.sql
mysql -u root < procedures.sql
mysql -u root < triggers.sql
