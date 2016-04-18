#!/bin/bash

lmysql -u root < clear.sql
lmysql -u root < insert_pesquisador.sql
lmysql -u root < insert_publicacao.sql
lmysql -u root < insert_keyword.sql
lmysql -u root < insert_pesquisador_publicacao.sql
lmysql -u root < insert_publicacao_keyword.sql
