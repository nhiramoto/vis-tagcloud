create database if not exists tagcloud;

use tagcloud;

create table if not exists Pesquisador (
    id integer auto_increment primary key,
    nome varchar(45) not null
);

create table if not exists Tag (
    id integer auto_increment primary key,
    nomeTag varchar(45) not null
);

create table if not exists Tag_Pesquisador (
    idPesquisador integer not null,
    idTag integer not null,
    peso integer not null,
    primary key (idPesquisador, idTag),
    constraint fk_pesquisador
        foreign key (idPesquisador) references Pesquisador(id),
    constraint fk_tag
        foreign key (idTag) references Tag(id)
);
