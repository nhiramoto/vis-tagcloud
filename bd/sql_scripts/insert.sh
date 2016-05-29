#!/bin/bash

mysql -u root < clear.sql
mysql -u root < insert_pesquisador.sql
mysql -u root < insert_publicacao.sql
mysql -u root < insert_keyword.sql
mysql -u root < insert_pesquisador_publicacao.sql
mysql -u root < insert_publicacao_keyword.sql
