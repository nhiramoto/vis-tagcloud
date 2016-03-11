use Tagcloud;

delimiter $$

drop trigger if exists nova_publicacao$$
create trigger nova_publicacao after insert on Pesquisador_Publicacao
for each row
begin
    declare autor, coautor integer;
    declare fim boolean;
    declare n integer;

    declare idkey integer;
    declare keypeso float;
    declare proximo_keyword cursor for
        select idKeyword, peso from Publicacao_Keyword
            where idPublicacao = NEW.idPublicacao;

    -- cria link
    -- verifica co-autoria
    declare proximo_coautor cursor for
        select idPesquisador from Pesquisador_Publicacao
            where idPublicacao = NEW.idPublicacao
                and idPesquisador <> NEW.idPesquisador;
    set autor=NEW.idPesquisador;
    open proximo_coautor;
    begin
        declare continue handler for NOT FOUND
            set fim = true;
        cada_coautor: loop
            fetch proximo_coautor into coautor;
            if (fim is true) then
                leave cada_coautor;
            end if;
            delete from Links
                where ((idPesq1=autor and idPesq2=coautor) or
                      (idPesq1=coautor and idPesq2=autor));
            insert into Links value (autor, coautor);
        end loop;
    end;
    close proximo_coautor;

    -- atualiza Pesquisador_Keyword
    open proximo_keyword;
    begin
        declare continue handler for NOT FOUND
            set fim = true;
        cada_keyword: loop
            fetch proximo_keyword into idkey, keypeso;
            if fim is true then
                leave cada_keyword;
            end if;
            update Pesquisador_Keyword set peso = peso + keypeso
                where idPesquisador = NEW.idPesquisador
                    and idKeyword = idkey;
            if row_count()=0 then
                insert into Pesquisador_Keyword
                    value (NEW.idPesquisador, idkey, keypeso);
            end if;
        end loop;
    end;
    close proximo_keyword;
end$$

drop trigger if exists nova_keyword$$
create trigger nova_keyword after insert on Publicacao_Keyword
for each row
begin
    declare idpesq integer;
    declare fim boolean;
    declare proximo_pesquisador cursor for
        select idPesquisador from Pesquisador_Publicacao
            where idPublicacao = NEW.idPublicacao;
    declare continue handler for NOT FOUND
        set fim = true;
    open proximo_pesquisador;
    cada_pesquisador: loop
        fetch proximo_pesquisador into idpesq;
        if fim is true then
            leave cada_pesquisador;
        end if;
        update Pesquisador_Keyword set peso = peso + NEW.peso
            where idPesquisador = idpesq and idKeyword = NEW.idKeyword;
        if row_count()=0 then
            insert into Pesquisador_Keyword
                value (idpesq, NEW.idKeyword, NEW.peso);
        end if;
    end loop;
    close proximo_pesquisador;
end$$

delimiter ;
