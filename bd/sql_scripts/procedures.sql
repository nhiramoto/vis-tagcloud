use Tagcloud;

delimiter $$

drop procedure if exists `insert_pesquisador`$$
create procedure `insert_pesquisador`(in id integer, in nome varchar(45))
begin
    insert into Pesquisador value (id, nome);
end$$

drop procedure if exists `remove_pesquisador`$$
create procedure `remove_pesquisador`(in idPesquisador integer)
begin
    delete from Pesquisador where (id=idPesquisador);
    if row_count()=0 then
        select 'Pesquisador não encontrado.';
    end if;
end$$

drop procedure if exists `insert_publicacao`$$
create procedure `insert_publicacao`(in id integer, in titulo varchar(250), in referencia varchar(250), in link varchar(45))
begin
    insert into Publicacao value (id, titulo, referencia, link);
end$$

drop procedure if exists `remove_publicacao`$$
create procedure `remove_publicacao`(in idPublicacao integer)
begin
    delete from Publicacao where (id=idPublicacao);
    if row_count()=0 then
        select 'Publicação não encontrado.';
    end if;
end$$

drop procedure if exists `insert_keyword`$$
create procedure `insert_keyword`(in id integer, in word varchar(45))
begin
    insert into Keyword value (id, word);
end$$

drop procedure if exists `remove_keyword`$$
create procedure `remove_keyword`(idKeyword integer)
begin
    delete from Keyword where (id=idKeyword);
    if row_count()=0 then
        select 'Keyword não encontrada.';
    end if;
end$$

drop procedure if exists `insert_pesquisador_publicacao`$$
create procedure `insert_pesquisador_publicacao`(in idPesquisador integer, in idPublicacao integer)
begin
    insert into Pesquisador_Publicacao value (idPesquisador, idPublicacao);
end$$

drop procedure if exists `remove_pesquisador_publicacao`$$
create procedure `remove_pesquisador_publicacao`(idPesq integer, idPublic integer)
begin
    delete from Pesquisador_Publicacao where (idPesquisador=idPesq and idPublicacao=idPublic);
    if row_count()=0 then
        select 'Autoria não encontrada.';
    end if;
end$$

drop procedure if exists `insert_publicacao_keyword`$$
create procedure `insert_publicacao_keyword`(idPublic integer, idKeyword integer, peso float)
begin
    insert into Publicacao_Keyword value (idPublic, idKeyword, peso);
end$$

drop procedure if exists `remove_publicacao_keyword`$$
create procedure `remove_publicacao_keyword`(idPublic integer, idKey integer)
begin
    delete from Publicacao_Keyword where (idPublicacao=idPublic and idKeyword=idKey);
    if row_count()=0 then
        select 'Relação palavra-chave - publicação não encontrada.';
    end if;
end$$

drop procedure if exists `get_nodes`$$
create procedure `get_nodes`()
begin
    select id, nome as name from Pesquisador;
end$$

drop procedure if exists `get_links`$$
create procedure `get_links`()
begin
    select idPesq1 as source, idPesq2 as target from Links;
end$$

-- drop procedure if exists `get_tags`$$
-- create procedure `get_tags`(in nid1 integer, in nid2 integer)
-- begin
    -- if nid2 is null then
        -- if nid1 is null then
            -- signal sqlstate '45000'
              -- set MESSAGE_TEXT='Pelo menos um id deve ser fornecido';
        -- end if;
        -- select nomeTag as text, peso as size from Tag, Tag_Pesquisador
            -- where Tag.id=Tag_Pesquisador.idTag and
                -- idPesquisador=nid1;
    -- else
        -- select nomeTag as text, peso as size from Tag,
            -- (select idTag from Tag_Pesquisador
                -- where idPesquisador=nid1
            -- ) as s1,
            -- (select idTag from Tag_Pesquisador
                -- where idPesquisador=nid2
            -- ) as s2
            -- where Tag.id=s1.idTag and s1.idTag=s2.idTag;
    -- end if;
-- end$$

delimiter ;
