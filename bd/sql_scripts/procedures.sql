use tagcloud;

delimiter $$

drop procedure if exists `insert_pesquisador`$$
create procedure `insert_pesquisador`(in nome varchar(45))
begin
    insert into Pesquisador (nome) value(nome);
end$$

drop procedure if exists `remove_pesquisador`$$
create procedure `remove_pesquisador`(in idPesquisador integer)
begin
    delete from Pesquisador where (id=idPesquisador);
    if row_count()=0 then
        select 'Pesquisador não encontrado.';
    end if;
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

drop procedure if exists `get_nodes`$$
begin
    select * from Pesquisador;
end$$

drop procedure if exists `get_links`$$
create procedure `get_links`()
begin
    select p1.idPesquisador as source, p2.idPesquisador as target, p1.peso+p2.peso as peso
        from Tag_Pesquisador as p1, Tag_Pesquisador as p2
        where p1.idPesquisador<>p2.idPesquisador and p1.idTag=p2.idTag;
end$$

delimiter ;
