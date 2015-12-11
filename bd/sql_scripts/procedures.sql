use tagcloud;

delimiter $$

drop procedure if exists `insert_pesquisador`$$
create procedure `insert_pesquisador`(in nome varchar(45))
begin
    insert into Pesquisador (nome) value(nome);
end$$

drop procedure if exists `insert_tag`$$
create procedure `insert_tag`(in tag varchar(45))
begin
    insert into Tag (nomeTag) value(tag);
end$$

drop procedure if exists `insert_tag_pesquisador`$$
create procedure `insert_tag_pesquisador`(in idPesquisador integer, in idTag integer)
begin
    insert into Tag_Pesquisador (idPesquisador, idTag) value (idPesquisador, idTag);
end$$

drop procedure if exists `get_links`$$
create procedure `get_links`()
begin
    select p1.idPesquisador as source, p2.idPesquisador as target, p1.peso+p2.peso as peso
        from Tag_Pesquisador as p1, Tag_Pesquisador as p2
        where p1.idPesquisador<>p2.idPesquisador and p1.idTag=p2.idTag;
end$$
