create database if not exists Tagcloud;

use Tagcloud;

create table if not exists Pesquisador (
    id integer primary key,
    nome varchar(45) unique not null
);

create table if not exists Publicacao (
    id integer primary key,
    titulo varchar(250) not null,
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

-- Preenchida pela trigger `create_links`
create table if not exists Links (
    idPesq1 integer,
    idPesq2 integer,
    primary key (idPesq1, idPesq2),
    constraint fk_links_pesq1
        foreign key (idPesq1) references Pesquisador (id),
    constraint fk_links_pesq2
        foreign key (idPesq2) references Pesquisador (id)
);
