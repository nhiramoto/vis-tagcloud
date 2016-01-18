create database if not exists tagcloud;

use tagcloud;

create table if not exists Pesquisador (
    id integer primary key,
    nome varchar(45) unique not null,
    citadoComo varchar(45)
);

create table if not exists Publicacao (
    id integer primary key,
    nome varchar(250) not null,
    referencia varchar(250) not null,
    link varchar(45)
);

create table if not exists Keyword (
    id integer primary key,
    word varchar(45) not null
);

create table if not exists Pesquisador_Publicacao (
    idPesquisador integer,
    idPublicacao integer,
    primary key (idPesquisador, idPublicacao),
    constraint fk_autoria_pesq
        foreign key (idPesquisador) references Pesquisador (id),
    constraint fk_autoria_public
        foreign key (idPublicacao) references Publicacao (id)
);

create table if not exists Publicacao_Keyword (
    idPublicacao integer,
    idKeyword integer,
    peso float not null,
    primary key (idPublicacao, idKeyword),
    constraint fk_pubkey_public
        foreign key (idPublicacao) references Publicacao (id),
    constraint fk_pubkey_key
        foreign key (idKeyword) references Keyword (id)
);
