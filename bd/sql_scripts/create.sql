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
    idPesquisador integer,
    idArtigo integer,
    constraint fk_pesq_autoria
        foreign key (idPesquisador) references Pesquisador (id),
    constraint fk_artigo_autoria
        foreign key (idArtigo) references Artigo (id)
);

create table if not exists Tag (
    id integer auto_increment primary key,
    nomeTag varchar (50) not null
);

create table if not exists Artigo_Tag (
    idArtigo integer,
    idTag integer,
    primary key (idArtigo, idTag),
    constraint fk_arttag_artigo
        foreign key (idArtigo) references Artigo (id),
    constraint fk_arttag_tag
        foreign key (idTag) references Tag (id)
);
