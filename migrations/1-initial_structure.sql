create table mapeamento.celulas (
  id uuid not null default gen_random_uuid (),
  nome text not null,
  setor text null,
  lideres text null,
  dia_semana text null,
  horario text null,
  foto_url text null,
  created_at timestamp with time zone null default now(),
  codigo_acesso text null,
  setor_id uuid null,
  constraint celulas_pkey primary key (id),
  constraint celulas_codigo_acesso_key unique (codigo_acesso),
  constraint celulas_setor_id_fkey foreign KEY (setor_id) references mapeamento.setores (id) on delete set null,
);

create index IF not exists idx_celulas_setor_id on mapeamento.celulas using btree (setor_id);


create table mapeamento.membros (
  id uuid not null default gen_random_uuid (),
  celula_id uuid null,
  nome text not null,
  passos_concluidos text[] not null default array[]::text[],
  created_at timestamp with time zone null default now(),
  estado_civil text null,
  telefone text null,
  data_nascimento date null,
  discipulador_nome text null,
  ministerios text[] null,
  constraint membros_pkey primary key (id),
  constraint membros_celula_id_fkey foreign KEY (celula_id) references mapeamento.celulas (id) on delete set null
);

create index IF not exists idx_mapeamento_membros_celula_id on mapeamento.membros using btree (celula_id);