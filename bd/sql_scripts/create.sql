create database if not exists tagcloud;

use tagcloud;

create table if not exists Pesquisador (
    id integer auto_increment primary key,
    nome varchar(45) not null
);

create table if not exists Artigo (
    id integer auto_increment primary key,
    nome varchar(45) not null
);

create table if not exists Autoria (
    idPesquisador integer primary key,
    idArtigo integer primary key,
    constraint fk_pesq_autoria
        foreign key (idPesquisador) references Pesquisador (id),
    constraint fk_artigo_autoria
        foreign key (idArtigo) references Artigo (id)
);

create table if not exists Tag (
    id integer auto_increment primary key,
    nomeTag varchar (50) not null
);
