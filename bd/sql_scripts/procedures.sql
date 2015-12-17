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
create procedure `get_nodes`()
begin
    select id, nome as name from Pesquisador;
end$$

drop procedure if exists `get_links`$$
create procedure `get_links`()
begin
    select p1.idPesquisador as source, p2.idPesquisador as target, p1.peso+p2.peso as peso
        from Tag_Pesquisador as p1, Tag_Pesquisador as p2
        where p1.idPesquisador<>p2.idPesquisador and p1.idTag=p2.idTag;
end$$

drop procedure if exists `get_tags`$$
create procedure `get_tags`(in nid1 integer, in nid2 integer)
begin
    if nid2 is null then
        if nid1 is null then
            signal sqlstate '45000'
              set MESSAGE_TEXT='Pelo menos um id deve ser fornecido';
        end if;
        select nomeTag as text, peso as size from Tag, Tag_Pesquisador
            where Tag.id=Tag_Pesquisador.idTag and
                idPesquisador=nid1;
    else
        select nomeTag as text, peso as size from Tag,
            (select idTag from Tag_Pesquisador
                where idPesquisador=nid1
            ) as s1,
            (select idTag from Tag_Pesquisador
                where idPesquisador=nid2
            ) as s2
            where Tag.id=s1.idTag and s1.idTag=s2.idTag;
    end if;
end$$

delimiter ;
